// サブスクやめた — 価格検知の判定ランナー（無人実行・Node版）
// タスクスケジューラ Subsuku_PriceJudge_0730 から node.exe で直接起動される（PowerShell は使わない）。
// 旧 run_daily_judge.ps1 の完全移植。判断の理由コメントは旧版から引き継いでいる。
//
// 7:10 の Subsuku_PriceWatch_0710（巡回・検知）の後に走り、検知を公式ページで確かめて
// 本物ならサイトを直し PR まで作る。マージはしない（人のゲートを残す）。2026-07-31 制定。

import path from 'node:path';
import {
  ROOT, LOG_DIR, ensureDirs, today, stamp, minutesOfDay, exists, readText, readJson, writeText,
  log, sendSlack, git, gh, runNode, ensureMain, runClaude, isAuthError, dailyStatusReport,
  findTodayPr, moveOntoTodayPr, returnToMain,
} from '../ops/lib.mjs';

process.chdir(ROOT);
ensureDirs();

const promptFile = path.join(ROOT, 'scripts/price-watch/daily_judge_prompt.md');
const logPath = path.join(ROOT, 'scripts/price-watch/state/detection_log.json');
const candPath = path.join(ROOT, 'scripts/price-watch/state/candidates.json');
const reconcilePath = path.join(ROOT, 'scripts/price-watch/state/reconcile_today.txt');
const logFile = path.join(LOG_DIR, `judge_${stamp()}.json`);
const day = today();

function finish(code) {
  process.exitCode = code;
}

try {
  main();
} catch (e) {
  sendSlack(`サブスクやめた 価格判定（無人）で例外\n${e && e.stack ? e.stack.split('\n').slice(0, 4).join('\n') : e}`);
  finish(1);
}

function main() {
  // PRブランチ上に居残らない（lib.ensureMain の注釈参照）。戻せないなら黙って続けず止めて知らせる。
  const em = ensureMain();
  if (!em.ok) {
    sendSlack(`サブスクやめた 価格判定（無人）を停止：${em.reason}\n直pushがPRブランチに積まれて本番に出ない危険があるため続行しません。`);
    return finish(1);
  }

  // 毎日の状況報告（1日1回・判定の有無にかかわらず）
  dailyStatusReport();

  // 起動の判断は「今日の検知があるか」ではなく「未判定が残っているか」で行う。
  //   今日の検知の有無で判断すると、7:10 の巡回が長引いた日や、翌日の検知がゼロだった日に
  //   積み残しが永久に判定されなくなる。未判定の残数だけを見れば、次の実行が必ず拾う（自己修復）。
  //   同時に冪等ガードにもなる＝手動テストと定時実行が重なっても2回目は走らない。
  let beforeUnjudged = 0;
  let todayEntries = 0;
  const dl = readJson(logPath, null);
  if (Array.isArray(dl)) {
    beforeUnjudged = dl.filter((x) => x.verdict == null).length;
    todayEntries = dl.filter((x) => x.date === day).length;
  }

  let eventCount = 0;
  const cand = readJson(candPath, null);
  if (cand === null && exists(candPath)) eventCount = -1;
  else if (cand && Array.isArray(cand.events)) eventCount = cand.events.length;

  // 為替が滞っていないか（2026-08-03）。為替更新の手順は claude を起動して初めて実行されるので、
  // 起動条件が「未判定が残っているか」だけだと、検知がない日は為替チェックそのものが走らない。
  // 公表仲値の公表は午前10時頃なので、取りに行くのは 10:30 以降の再試行のとき。1日1回に絞る。
  let fxStale = false;
  try {
    const svc = readText(path.join(ROOT, 'src/data/services.js'));
    const m = svc.match(/USD_JPY_AS_OF\s*=\s*'(\d{4}-\d{2}-\d{2})'/);
    if (m) {
      const now = new Date();
      const p = (n) => String(n).padStart(2, '0');
      const boundary = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${now.getDate() >= 15 ? '15' : '01'}`;
      fxStale = m[1] < boundary;
    }
  } catch { /* 読めなければ stale 扱いにしない */ }
  const fxMarker = path.join(LOG_DIR, `fx_attempt_${day}.txt`);
  const fxDue = fxStale && minutesOfDay() >= 10 * 60 + 30 && !exists(fxMarker);

  // 掲載価格の棚卸し（reconcile）を1日1回だけ走らせる（2026-08-19）。
  // 毎朝の検知は「公式ページが前回から変わったか」しか見ない。こちらの取り込み漏れ・古いままの掲載は
  // 公式が動かない限り原理的に検出できない。早期リターンより前に置く（検知ゼロの日にも掲載ズレはある）。
  let reconcileFresh = false;
  if (exists(reconcilePath)) {
    try { reconcileFresh = readText(reconcilePath).split(/\r?\n/)[0] === day; } catch { /* */ }
  }
  let reconcileRanNow = false;
  if (!reconcileFresh) {
    try {
      const rc = runNode(['scripts/price-watch/reconcile.mjs']);
      writeText(reconcilePath, `${day}\n${rc.out}`);
      log('reconcile を実行しました');
    } catch (e) {
      writeText(reconcilePath, `${day}\n(reconcile の実行に失敗: ${e.message})`);
      log('reconcile に失敗（判定は続行）');
    }
    reconcileRanNow = true;
  }

  if (beforeUnjudged === 0 && !fxDue && !reconcileRanNow) {
    // 検知はあるのに今日の記録が台帳に1件も無い＝巡回側の記録/通知が失敗している。
    // 黙って緑にせず知らせる（検知が誰にも見られないまま消えるのを防ぐ）。
    if (eventCount > 0 && todayEntries === 0) {
      sendSlack(`サブスクやめた 価格判定（無人）を中止\n検知 ${eventCount} 件があるのに、台帳に今日(${day})の記録が1件もありません。7:10 の巡回が終わっていないか、記録に失敗した可能性があります。`);
      return finish(1);
    }
    log(`未判定ゼロ・為替も最新のため判定はスキップ（検知 ${eventCount} 件）`);
    return finish(0);
  }
  if (fxDue) {
    // 起動理由が為替だけの回もあるので、記録を残しておく（同日の再起動を防ぐ）
    writeText(fxMarker, day);
    log(`為替が区切りより古いため起動（未判定 ${beforeUnjudged} 件）`);
  }

  // IndexNow へ1日1回通知する（2026-08-20）。失敗しても判定は止めない。
  const inMarker = path.join(LOG_DIR, `indexnow_${day}.txt`);
  if (!exists(inMarker)) {
    try {
      const r = runNode(['scripts/seo/indexnow-ping.mjs']);
      writeText(inMarker, day);
      log('IndexNow: ' + r.out.trim());
    } catch (e) {
      log('IndexNow に失敗（判定は続行）: ' + e.message);
    }
  }

  // 実行前の main の位置を控える（2026-08-05）。機械が main に何を入れたかを実行後に検算する。
  // HEAD ではなく main を見る（2026-10-04）：PRブランチ上でのコミットは main の変更ではない。
  const shaBefore = git(['rev-parse', 'refs/heads/main']).out;

  // 今日のPRがすでに開いていれば、今回の判定はそのPRに積む（2026-10-04・lib.findTodayPr の注釈参照）。
  let prompt = readText(promptFile);
  const todayPr = findTodayPr(day);
  if (todayPr && todayPr.error) {
    sendSlack(`サブスクやめた 価格判定（無人）を停止\n今日のPRの有無を確かめられません（${todayPr.error}）。main へ直pushしてPRと記録が分かれるのを避けるため続行しません。`);
    return finish(1);
  }
  if (todayPr) {
    const mv = moveOntoTodayPr(todayPr.branch);
    if (!mv.ok) {
      sendSlack(`サブスクやめた 価格判定（無人）を停止\n今日のPR #${todayPr.number} のブランチへ移れません：${mv.reason}\n未判定 ${beforeUnjudged} 件は残っています。次の判定で再試行します。`);
      return finish(1);
    }
    log(`今日のPR #${todayPr.number}（${todayPr.branch}）に積むモードで判定します`);
    prompt = `## ⚠️ 今日はすでにPRが開いています（この指示は手順5より優先）

今日の判定PR #${todayPr.number}（${todayPr.url}・ブランチ ${todayPr.branch}）が未マージのまま開いています。
作業ツリーはすでにそのブランチ上です。朝以降の巡回が足した検知も detection_log.json に合流済みです。

- 手順5は、偽陽性だけの日でも **A（main へ直接 push）を使わず**、このブランチに追加コミットして \`git push origin ${todayPr.branch}\` してください。
- 新しいブランチ・新しいPRは作らない。main へ切り替えない。main へ push しない。PRのマージもしない。
- コミットメッセージは「〇月〇日 追加の検知N件を判定（…）」の形に。
- Slack 報告には、このPRのURLと「今日のPRに追記した」ことを書いてください。

---

` + prompt;
  }

  const res = runClaude(prompt);
  writeText(logFile, res.raw);
  // PRを作った回・PRに追記した回とも、判定のあとは main へ戻す（次の巡回・為替が main 上で動くように）。
  const back = returnToMain();
  if (!back.ok) sendSlack(`サブスクやめた 価格判定（無人）：判定のあと main へ戻れません\n${back.reason}\n次の判定・為替が止まる可能性があります。作業ツリーを確認してください。`);

  if (res.code !== 0) {
    // 失敗の中身を見て、何をすればいいかまで書く（2026-07-14 の認証失効が2週間気づかれなかった教訓）。
    if (isAuthError(res.raw)) {
      // 認証切れは直るまで毎回同じ状態なので、通知は1日1回に絞る（量を増やさない）。
      const marker = path.join(LOG_DIR, `auth_alert_${day}.txt`);
      if (exists(marker)) {
        log('認証エラー（本日通知済みのためSlackは送らない）');
        return finish(1);
      }
      writeText(marker, day);
      sendSlack('サブスクやめた 価格判定（無人）が停止：**CLIの認証が失効しています**\n' +
        `検知 ${eventCount} 件は未判定のまま残っています。\n\n` +
        '対処（俊雄さんの操作が必要です）：ターミナルで claude auth login を実行し、ブラウザで承認してください。\n' +
        '毎回切れるのを止めたい場合は claude setup-token で長期トークンに切り替えられます（無人実行用・Claudeサブスクが必要）。\n\n' +
        '※ claude auth status は「ログイン済み」と出ますが、保存済みトークンが失効しているとリクエスト時に401になります。\n' +
        `ログ: ${logFile}`);
      return finish(1);
    }
    const why = /hit your limit|usage limit|resets/i.test(res.raw)
      ? '（利用上限に達しています。リセット後の再試行で拾われます）' : '';
    sendSlack(`サブスクやめた 価格判定（無人）が失敗\nclaude -p が exit code ${res.code} で終了${res.timedOut ? '（タイムアウト）' : ''}${why}。検知 ${eventCount} 件は未判定のまま残っています。\nログ: ${logFile}`);
    return finish(1);
  }

  // 走ったのに未判定が減っていない＝実質何もしていない。静かに緑にしない。
  let afterUnjudged = 0;
  const dl2 = readJson(logPath, null);
  if (Array.isArray(dl2)) afterUnjudged = dl2.filter((x) => x.verdict == null).length;
  if (afterUnjudged >= beforeUnjudged && beforeUnjudged > 0) {
    sendSlack(`サブスクやめた 価格判定（無人）が空振り\nexit 0 で終わったのに未判定が ${beforeUnjudged} 件から減っていません。\nログ: ${logFile}`);
    return finish(1);
  }

  // main に何を入れたかを検算する（2026-08-05）。許すのは台帳と巡回状態だけ。
  // src/ に手が入っていたら表示価格が人の目を通らずに公開された可能性がある＝すぐ知らせる。
  // ただし src/ が動いていない回は失敗にしない（2026-08-20）。本当は緑の日を赤くすると赤の意味が薄れる。
  const shaAfter = git(['rev-parse', 'refs/heads/main']).out;
  if (shaBefore && shaAfter && shaBefore !== shaAfter) {
    const touched = git(['diff', '--name-only', shaBefore, shaAfter]).out.split('\n').filter(Boolean);
    const allowed = ['scripts/price-watch/state/', 'scripts/price-watch/watch-list.json'];
    const violations = touched.filter((f) => !allowed.some((a) => f.startsWith(a)));
    if (violations.length) {
      const srcTouched = violations.filter((f) => f.startsWith('src/'));
      const commits = git(['log', '--format=  %h %ad %an  %s', '--date=format:%H:%M:%S', `${shaBefore}..${shaAfter}`]).out;
      if (!srcTouched.length) {
        log('許可リスト外だが src/ は無変更のため続行: ' + violations.join(', '));
        log('範囲内のコミット:\n' + commits);
      } else {
        sendSlack('サブスクやめた 価格判定（無人）の実行中に **src/ が main で変わりました**\n' +
          '表示価格が人の目を通らずに公開された可能性があります。差分を確認してください。\n\n' +
          `変わったファイル: ${violations.join(', ')}\n\n` +
          `範囲内のコミット（人が同時に commit した場合もここに出ます）:\n${commits}\n\nログ: ${logFile}`);
        return finish(1);
      }
    }
    log('main に直接入れた変更: ' + touched.join(', '));
  }

  // 未マージのPRが滞っていないか（2026-08-19）。誰も見ないPRは誤報を直す手が止まっているのと同じ。
  try {
    const r = gh(['pr', 'list', '--limit', '30', '--json', 'number,title,createdAt']);
    if (r.code === 0 && r.out) {
      const stale = JSON.parse(r.out).filter((p) =>
        /価格|判定|為替/.test(p.title) && new Date(p.createdAt) < new Date(Date.now() - 86400000));
      if (stale.length) {
        const lines = stale.map((p) => `  #${p.number} (${Math.floor((Date.now() - new Date(p.createdAt)) / 86400000)} 日放置) ${p.title}`).join('\n');
        sendSlack(`サブスクやめた **未マージのPRが ${stale.length} 件滞っています**\n\n${lines}\n\n` +
          '価格が動いた日だけPRにしているので、ここに残っているのは**サイトの表示が実際の価格と違う可能性があるもの**です。');
      }
    }
  } catch { /* 通知の失敗で判定を止めない */ }

  log(`判定完了（検知 ${eventCount} 件・未判定 ${beforeUnjudged} → ${afterUnjudged}）`);
  finish(0);
}
