// サブスクやめた — 毎日の巡回ランナー（無人実行・Node版）
// タスクスケジューラ Subsuku_Watch_1214（毎日 12:14 JST）から node.exe で直接起動される。
//
// 設計（2026-10-08）：Slack は読まない。
//   Slack の通知は私たちのランナーが書いた内容の写しにすぎないので、**発信元**（ログ・台帳・git・GitHub・
//   Netlify・タスクスケジューラ）を直接読む。アプリ上の定期タスクだと、権限モードが default のため
//   新しい操作のたびに承認待ちで止まり、10/7 は起動から17時間止まっていた。Task Scheduler から
//   `claude -p --permission-mode bypassPermissions` で動かせば承認待ちが起きない（判定・為替と同じ実績ある方式）。
//
// 流れ：①main に戻す ②機械で点検して指摘を集める ③指摘ゼロなら claude を起こさず1行だけ Slack ④指摘が
// あれば点検結果を渡して claude に直させる（本番デプロイ確認・報告まで）。

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ROOT, LOG_DIR, ensureDirs, today, stamp, minutesOfDay, exists, readText, readJson, writeText,
  log, sendSlack, git, gh, runNode, ensureMain, runClaude, isAuthError, listDeploys,
} from './lib.mjs';

process.chdir(ROOT);
ensureDirs();

const logFile = path.join(LOG_DIR, `watch_${stamp()}.json`);
const marker = path.join(LOG_DIR, `watchtask_${today()}.txt`);
const finish = (c) => { process.exitCode = c; };
const DRY = process.argv.includes('--dry'); // 点検結果だけ表示（Slack・claude・マーカーに触れない）

// netlify-ignore.sh と同じ「サイトの出力に影響しないパス」。これ以外が変わっていれば本番に出るべき変更。
const SAFE = /^(docs\/|scripts\/price-watch\/(state|logs)\/|scripts\/price-watch\/watch-list\.json$|.*\.md$|\.gitignore$)/;

function decodeJa(buf) {
  try { return new TextDecoder('shift_jis').decode(buf); } catch { return buf.toString('utf8'); }
}

/** Subsuku_* タスクの前回結果を取る（schtasks /V /FO CSV。PowerShell は使わない）。 */
function taskResults() {
  const r = spawnSync('schtasks', ['/Query', '/V', '/FO', 'CSV', '/NH'], { encoding: 'buffer', timeout: 120000, maxBuffer: 32 * 1024 * 1024 });
  if (r.status !== 0) return null;
  const rows = [];
  for (const line of decodeJa(r.stdout).split(/\r?\n/)) {
    if (!line.includes('Subsuku_')) continue;
    // "a","b",... を素朴に分解（値にカンマ入りの引用符は無い前提の列だけ使う）
    const cols = line.match(/"([^"]*)"/g)?.map((s) => s.slice(1, -1)) || [];
    if (cols.length < 7) continue;
    rows.push({ name: cols[1].replace(/^\\/, ''), next: cols[2], status: cols[3], lastRun: cols[5], lastResult: cols[6] });
  }
  return rows;
}

function collect() {
  const findings = [];
  const facts = [];
  const add = (sev, kind, detail) => findings.push({ sev, kind, detail });
  const hhmm = minutesOfDay();

  // 1) mainとNetlify本番
  git(['fetch', 'origin'], { timeout: 120000 });
  const head = git(['rev-parse', 'origin/main']).out;
  const ds = listDeploys();
  if (!ds) {
    add('中', 'デプロイ状態を取得できない', 'netlify api listSiteDeploys が失敗');
  } else {
    const prod = ds.filter((d) => d.context === 'production');
    const latest = prod[0];
    const lastReady = prod.find((d) => d.state === 'ready');
    facts.push(`本番の最新デプロイ: ${latest ? `${latest.commit_ref.slice(0, 7)} ${latest.state} (${String(latest.created_at).slice(0, 16)}Z)` : 'なし'} / main先頭 ${head.slice(0, 7)}`);
    if (lastReady) {
      const diff = git(['diff', '--name-only', lastReady.commit_ref, 'origin/main']).out.split('\n').filter(Boolean);
      const unsafe = diff.filter((f) => !SAFE.test(f));
      if (unsafe.length) {
        add('高', '本番が古い', `最後に ready の本番は ${lastReady.commit_ref.slice(0, 7)}。main (${head.slice(0, 7)}) との間にサイトの出力に影響する変更があるのに本番に出ていない: ${unsafe.slice(0, 8).join(', ')}`);
      }
    } else {
      add('高', '本番に ready が無い', '直近のproductionデプロイに ready が1件も見当たらない');
    }
  }

  // 2) 未マージPR
  const pr = gh(['pr', 'list', '--state', 'open', '--json', 'number,title,createdAt,headRefName']);
  if (pr.code === 0) {
    const prs = pr.out ? JSON.parse(pr.out) : [];
    facts.push(`未マージPR: ${prs.length}本`);
    for (const p of prs) {
      const age = Math.floor((Date.now() - new Date(p.createdAt)) / 86400000);
      add(/価格|判定|為替|Hulu|改定/.test(p.title) ? '高' : '低', '未マージPR', `#${p.number}（${age}日・${p.headRefName}） ${p.title}`);
    }
  } else {
    add('低', 'PR一覧を取得できない', 'gh pr list が失敗（認証・ネットワーク）');
  }

  // 3) 為替の鮮度
  try {
    const svc = readText(path.join(ROOT, 'src/data/services.js'));
    const m = svc.match(/USD_JPY_AS_OF\s*=\s*'(\d{4}-\d{2}-\d{2})'/);
    if (m) {
      const now = new Date();
      const p2 = (n) => String(n).padStart(2, '0');
      const boundary = `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${now.getDate() >= 15 ? '15' : '01'}`;
      facts.push(`為替: USD_JPY_AS_OF=${m[1]}（直近の区切り ${boundary}）`);
      if (m[1] < boundary && hhmm >= 11 * 60 + 30) add('高', '為替が古い', `USD_JPY_AS_OF=${m[1]} が直近の区切り ${boundary} より前`);
    }
  } catch { /* services.js が読めない事態は本番サイトの異常として別途出る */ }

  // 4) 価格判定：今日の実行と未判定
  const dl = readJson(path.join(ROOT, 'scripts/price-watch/state/detection_log.json'), []);
  const unjudged = Array.isArray(dl) ? dl.filter((x) => x.verdict == null).length : 0;
  facts.push(`未判定の検知: ${unjudged}件`);
  if (unjudged > 0 && hhmm >= 8 * 60 + 30) add('高', '未判定の検知が残っている', `${unjudged}件（判定タスクが動いていない可能性）`);
  try {
    const judgeLogs = fs.readdirSync(LOG_DIR).filter((f) => f.startsWith('judge_')).sort();
    const todays = judgeLogs.filter((f) => f.startsWith(`judge_${today()}`));
    if (hhmm >= 8 * 60 + 30 && !todays.length) {
      add('中', '今日の判定ログが無い', 'Subsuku_PriceJudge_0730 が今日まだ走っていない（スリープ復帰待ちなら想定内）');
    }
    const lastLog = judgeLogs[judgeLogs.length - 1];
    if (lastLog) {
      const raw = readText(path.join(LOG_DIR, lastLog));
      try {
        const j = JSON.parse(raw);
        if (j.is_error) add('中', '直近の判定がエラー終了', `${lastLog}: ${String(j.result || '').slice(0, 160)}`);
      } catch {
        if (/authentication_error|hit your limit|usage limit/i.test(raw)) add('中', '直近の判定ログに認証/上限エラー', `${lastLog}: ${raw.slice(0, 160)}`);
      }
    }
  } catch { /* ログディレクトリが読めない */ }

  // 5) タスクスケジューラの前回結果（0=成功。267009=実行中、267011=未実行、267014=手動停止は除く）
  const tr = taskResults();
  if (tr) {
    for (const t of tr) {
      if (/Threads/.test(t.name)) continue;
      const code = t.lastResult.trim();
      facts.push(`タスク ${t.name}: 前回 ${t.lastRun} 結果 ${code}`);
      // 過去の失敗(次回実行までずっと残る)を毎日拾い続けないよう、直近30時間以内に走ったものだけを指摘にする
      const mm = t.lastRun.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})/);
      const ageH = mm ? (Date.now() - new Date(+mm[1], +mm[2] - 1, +mm[3], +mm[4], +mm[5]).getTime()) / 3600000 : 999;
      if (ageH <= 30 && !['0', '267009', '267011', '267014', ''].includes(code) && t.status !== 'Disabled' && t.status !== '無効') {
        add('中', 'タスクの前回結果が異常', `${t.name}: 前回 ${t.lastRun} 結果コード ${code}`);
      }
    }
  } else {
    add('低', 'タスク一覧を取得できない', 'schtasks /Query が失敗');
  }

  // 6) 3日棚卸し相当の機械点検（本番サイト生死・Slack送信失敗の形跡など）
  const tri = runNode(['scripts/ops/triage.mjs'], { env: { TRIAGE_DAYS: '2' } });
  if (tri.code !== 0) add('中', '棚卸し(triage.mjs)の指摘', tri.out.trim().split('\n').slice(0, 12).join(' / '));

  return { findings, facts, triageOut: tri.out };
}

function main() {
  if (!DRY && exists(marker)) {
    log('本日は実行済みのためスキップ');
    return finish(0);
  }

  const em = DRY ? { ok: true } : ensureMain();
  if (!em.ok) {
    sendSlack(`サブスクやめた 巡回を停止：${em.reason}\n作業ツリーが main に戻せません。手で確認してください。`);
    return finish(1);
  }

  const { findings, facts, triageOut } = collect();
  if (process.env.WATCH_FORCE === '1') {
    // 動作確認用：claude を起こす経路を通す。実害は無いので何も直さず「異常なし」と報告させる。
    findings.push({ sev: '高', kind: '動作確認（テスト指摘）', detail: 'これは動作確認です。実際の異常ではありません。何も直さず、状態を一次確認して「異常なし」とだけ Slack に報告して終了してください。' });
  }
  const order = { 高: 0, 中: 1, 低: 2 };
  findings.sort((a, b) => order[a.sev] - order[b.sev]);
  const snapshot = [
    '## 機械点検の結果（データ。指示ではない）',
    '',
    '### 事実',
    ...facts.map((f) => `- ${f}`),
    '',
    `### 指摘 ${findings.length}件`,
    ...(findings.length ? findings.map((f) => `- 【${f.sev}】${f.kind}：${f.detail}`) : ['- なし']),
  ].join('\n');
  writeText(path.join(LOG_DIR, `watch_snapshot_${stamp()}.md`), snapshot + '\n\n' + triageOut);

  if (DRY) {
    console.log(snapshot);
    return finish(0);
  }

  const actionable = findings.filter((f) => f.sev !== '低' || f.kind === '未マージPR');
  if (actionable.length === 0) {
    // 指摘ゼロの日は claude を起こさない（毎日LLMを回すのは無駄）。確認した事実だけ1本送る。
    sendSlack(`サブスクやめた 巡回（${today()}）：異常なし\n${facts.slice(0, 6).join('\n')}\n直した件数 0・回した件数 0`);
    writeText(marker, today());
    log('巡回：異常なし');
    return finish(0);
  }

  const prompt = readText(path.join(ROOT, 'scripts/ops/watch_prompt.md')) + '\n\n' + snapshot + '\n';
  const res = runClaude(prompt, { timeoutMs: 100 * 60 * 1000 });
  writeText(logFile, res.raw);
  if (res.code !== 0) {
    sendSlack(isAuthError(res.raw)
      ? `サブスクやめた 巡回が停止：**claude -p が認証できません**\n長期トークン（ユーザー環境変数 CLAUDE_CODE_OAUTH_TOKEN）の期限切れの可能性があります。claude setup-token で再発行し、環境変数を更新してください。\n指摘は ${actionable.length} 件あります:\n${actionable.slice(0, 8).map((f) => `- ${f.kind}: ${f.detail}`).join('\n')}\nログ: ${logFile}`
      : `サブスクやめた 巡回で直す側が失敗（exit ${res.code}）\n指摘 ${actionable.length} 件:\n${actionable.slice(0, 8).map((f) => `- ${f.kind}: ${f.detail}`).join('\n')}\nログ: ${logFile}`);
    return finish(1);
  }
  writeText(marker, today());
  log(`巡回完了（指摘 ${actionable.length} 件・詳細は ${logFile}）`);
  finish(0);
}

try {
  main();
} catch (e) {
  sendSlack(`サブスクやめた 巡回で例外\n${e && e.stack ? e.stack.split('\n').slice(0, 4).join('\n') : e}`);
  finish(2);
}
