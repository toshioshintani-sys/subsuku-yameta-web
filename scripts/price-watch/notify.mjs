#!/usr/bin/env node
/**
 * notify.mjs — 検知結果を Slack に送り、あとで的中率を測れるように記録する（2026-07-26 追加）
 *
 * ■ なぜ要るのか
 *   毎朝7:10の監視は動いているが、**結果が誰にも届いていなかった**。
 *   price-watch.mjs には通知処理が1行も無く、candidates.json にローカル保存されるだけ。
 *   俊雄さんは平日日中にPCへ触れないので、スマホに届かない限り日次監視は意味を持たない。
 *   （警報器は動いているがベルが鳴らない状態だった）
 *
 * ■ なぜ「どの検査が鳴ったか」まで送るのか
 *   2026-07-25〜26の実測で、検知16件のうち本物は3件（19%）だった。
 *   ただしこの19%は「システムを修理していた期間」の数字で、外れ13件の内訳は：
 *     ・自分がURLを直したことによる差分 3件（一度きり・もう起きない）
 *     ・設定の不備 3件（直せる／2件は修正済み）
 *     ・構造的なノイズ 4件（割引と通常価格の並記など・今後も起きる）
 *   つまり **平均の的中率より、「この1件は信用してよいか」を事前に見分けられるか** が本質。
 *   そこで検知ごとに検査をかけ、鳴った検査名を一緒に送る。
 *   人が「本物／偽陽性」を返すたびに、どの検査が正しく予測できたかが detection_log.json に溜まる。
 *   **自動改修に進むかどうかは、この実測を見てから決める**（今の19%で自動化すると誤報を量産する）。
 *
 * ■ 静かにする
 *   検知ゼロの日は何も送らない。毎日鳴る通知は読まれなくなる。
 *
 * 使い方:
 *   node scripts/price-watch/notify.mjs           # candidates.json を読んで送る
 *   node scripts/price-watch/notify.mjs --dry-run # 送らずに本文だけ表示
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const CANDIDATES = resolve(HERE, 'state/candidates.json');
const LOG = resolve(HERE, 'state/detection_log.json');
const SLACK_SENDER =
  'C:\\Users\\user\\Desktop\\Claude_work\\world-oracle-staging\\notifications\\_shared\\slack_sender.py';

// 日付は必ず JST で取る（2026-07-28 修正）。
// それまで toISOString().slice(0,10) を使っていたため UTC の日付になり、
// 7:10 実行だと JST では翌日なのに**前日の日付**で記録・通知していた
// （7/28 の朝に「価格監視 2026-07-27」と送っていた）。
const jstDate = (d = new Date()) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(d);

// 通貨ごとに分けて数値化する。ドル建てを円の感覚で見ると誤検知する
// （実測：Claude Pro の $18/$22 を「桁が不自然」と誤って鳴らしていた）。
//
// ⚠️ 0円を捨てないこと（2026-07-28 修正）。
//   それまで n <= 0 を除外していたため、Amazon Music Unlimited の
//   「最初の3か月0円」が消えた＝**キャンペーン終了という本物の情報**を握り潰していた。
//   0円は「無料期間」を意味する有効な価格。
const parseTok = (tok) => {
  const s = String(tok);
  const n = Number(s.replace(/[¥￥$,\s円]/g, ''));
  if (!Number.isFinite(n) || n < 0) return null;
  return { value: n, usd: s.includes('$') };
};

/**
 * 検知1件を検査する。返すのは「鳴った検査の名前」と「人が最初に見るべき点」。
 * ここでスコアは付けない。名前で返す方が、あとで「どの検査が当たったか」を数えられる。
 */
function inspect(ev, ours) {
  const addedTok = ev.added.map(parseTok).filter(Boolean);
  const removedTok = ev.removed.map(parseTok).filter(Boolean);
  const added = addedTok.map((t) => t.value);
  const removed = removedTok.map((t) => t.value);
  const signals = [];

  // --- 無料期間（0円）の出入りは、キャンペーンの開始・終了を意味する ---
  // 通常価格は変わらないが、入口価格の表示（INTRO_OFFERS）を見直す合図になるので必ず知らせる。
  // 実測：2026-07-28 に Amazon Music Unlimited の「最初の3か月0円」（フジロック配信記念）が消えた。
  if (removed.includes(0)) {
    signals.push({ name: '「0円」の表示が消えた＝無料キャンペーンが終わった可能性', kind: '本物より' });
  }
  if (added.includes(0)) {
    signals.push({ name: '「0円」の表示が出た＝無料キャンペーンが始まった可能性', kind: '本物より' });
  }

  // --- 偽陽性である可能性を上げる signal を先に見る ---
  // （2026-07-25〜26 に実際に起きた型を、そのまま検査項目にしてある）

  // ① 出現した値が全部うちの表示と一致＝「変わった」のではなく「見えるようになった」だけ。
  //    監視URLを直した翌日や、headless 化した直後に必ず起きる。
  //    実測：LINE MUSIC（1,080/580）と Gemini（725/2,900/14,500/32,000）がこれだった。
  const allAddedKnown = added.length > 0 && added.every((v) => ours.has(v));
  if (allAddedKnown) {
    signals.push({
      name: '出現した値が全部うちの表示と一致＝価格は変わっていない（取得方法を変えた直後に起きる）',
      kind: '偽陽性より',
    });
  }

  // ② 追加と消失の数値が同一＝表記ゆれ（全角￥と半角¥など）
  const sameSet =
    added.length > 0 && added.length === removed.length && added.every((v) => removed.includes(v));
  if (sameSet) {
    signals.push({ name: '追加と消失の数値が同一（表記ゆれ・全角半角の差）', kind: '偽陽性より' });
  }

  // ③ ちょうど半額の組＝割引価格と通常価格の並記。
  //    相方は「出現した値」の中だけでなく「うちの表示」側にあることもある。
  //    実測：Google Workspace は出現が ¥400/¥1,250 で、相方の ¥800/¥2,500 はうちの表示側にあった。
  const pool = new Set([...added, ...ours]);
  const halfPair = [...new Set(added)].sort((a, b) => a - b).find((v) => pool.has(v * 2));
  if (halfPair) {
    signals.push({
      name: `ちょうど半額の組がある（${halfPair} と ${halfPair * 2}）＝割引価格と通常価格の並記`,
      kind: '偽陽性より',
    });
  }

  // ④ 桁が不自然。円とドルで基準を分ける（ドルを円の感覚で見ると $18 が異常値になる）
  //    0 は「無料期間」という意味のある値なので、桁の異常には含めない（上で別途扱っている）
  const extreme = [...addedTok, ...removedTok]
    .filter((t) => t.value !== 0)
    .filter((t) => (t.usd ? t.value < 1 || t.value > 5000 : t.value < 50 || t.value > 500000))
    .map((t) => (t.usd ? `$${t.value}` : t.value));
  if (extreme.length) {
    signals.push({ name: `桁が不自然な値（${extreme.slice(0, 3).join(', ')}）`, kind: '偽陽性より' });
  }

  // ⑤ 変化が多すぎる＝1ページに別商品が並んでいる
  if (added.length + removed.length > 8) {
    signals.push({
      name: `変化した金額が多すぎる（${added.length + removed.length}件）＝別商品の混在`,
      kind: '偽陽性より',
    });
  }

  // ⑥ 消失ゼロで追加だけ（①に当たらない場合）＝監視の取り方を変えた直後の可能性
  if (!allAddedKnown && added.length > 0 && removed.length === 0) {
    signals.push({ name: '消失ゼロで追加だけ＝監視URL/描画方法を変えた直後の可能性', kind: '偽陽性より' });
  }

  // --- 本物である可能性を上げる signal ---
  // 偽陽性の signal が鳴っている時は出さない（両方出ると人が迷うだけ）。
  // ⚠️ signals.length で判定しないこと。上の 0円 signal は「本物より」なので、
  //    それを数えると本物同士で打ち消し合ってしまう。
  const suspicious = signals.some((s) => s.kind === '偽陽性より');
  if (!suspicious) {
    if (removed.some((v) => ours.has(v))) {
      signals.push({ name: 'うちの表示価格がページから消えた', kind: '本物より' });
    }
    if (added.length === 1 && removed.length === 1) {
      signals.push({ name: '1つの金額が1つに置き換わった（単純な置換）', kind: '本物より' });
    }
  }

  return { added, removed, signals };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!existsSync(CANDIDATES)) {
    console.log('candidates.json が無い。何もしない。');
    return;
  }
  const data = JSON.parse(readFileSync(CANDIDATES, 'utf-8'));
  const events = Array.isArray(data.events) ? data.events : [];

  // 検知ゼロの日は黙る（毎日鳴る通知は読まれなくなる）
  if (events.length === 0) {
    console.log('検知ゼロ。通知しない。');
    return;
  }

  let PRICING = {};
  let PLANS = {};
  try {
    ({ PRICING, PLANS } = await import(pathToFileURL(resolve(ROOT, 'src/data/services.js')).href));
  } catch (e) {
    console.error('services.js を読めなかった。うちの表示価格の突き合わせは省略する:', e.message);
  }
  const oursOf = (id) => {
    const set = new Set();
    if (typeof PRICING[id] === 'number' && PRICING[id] > 0) set.add(PRICING[id]);
    for (const p of PLANS[id]?.plans || []) {
      if (typeof p.monthly === 'number' && p.monthly > 0) set.add(p.monthly);
      if (typeof p.yearly === 'number' && p.yearly > 0) set.add(p.yearly);
    }
    return set;
  };

  const today = jstDate();
  const lines = [`🔍 サブスクやめた 価格監視 ${today}`, `検知 ${events.length}件（公式で確認するまで services.js は書き換えません）`, ''];
  const logEntries = [];

  for (const ev of events) {
    const ours = oursOf(ev.id);
    const { added, removed, signals } = inspect(ev, ours);

    lines.push(`▼ ${ev.name}`);
    lines.push(`   ${ev.url}`);
    if (ev.added.length) lines.push(`   出現: ${ev.added.join(', ')}`);
    if (ev.removed.length) lines.push(`   消失: ${ev.removed.join(', ')}`);
    lines.push(`   うちの表示: ${[...ours].sort((a, b) => a - b).join(', ') || '（なし）'}`);
    if (signals.length === 0) {
      lines.push('   検査: 何も鳴っていない');
    } else {
      for (const s of signals) lines.push(`   ${s.kind === '本物より' ? '🔺' : '🔶'} ${s.name}`);
    }
    lines.push('');

    logEntries.push({
      date: today,
      serviceId: ev.id,
      name: ev.name,
      added,
      removed,
      ours: [...ours],
      signals: signals.map((s) => ({ name: s.name, kind: s.kind })),
      verdict: null, // ← あとで「本物」「偽陽性」を入れる。これが溜まると検査の当たり外れが測れる
    });
  }

  lines.push('確認するには：`npm run price:fetch -- <サービスid>` でページ本文を取れます。');
  lines.push('判定したら detection_log.json の verdict に「本物」か「偽陽性」を入れてください。');

  const body = lines.join('\n');

  // 判定を記録する台帳に追記（的中率の実測用）
  let log = [];
  if (existsSync(LOG)) {
    try {
      log = JSON.parse(readFileSync(LOG, 'utf-8'));
      if (!Array.isArray(log)) log = [];
    } catch {
      log = [];
    }
  }
  // 同じ日・同じサービスの重複は入れない（手動で複数回走らせても台帳が汚れないように）
  for (const e of logEntries) {
    if (!log.some((x) => x.date === e.date && x.serviceId === e.serviceId)) log.push(e);
  }
  mkdirSync(dirname(LOG), { recursive: true });
  writeFileSync(LOG, JSON.stringify(log, null, 2) + '\n', 'utf-8');

  if (dryRun) {
    console.log('--- dry-run（送信しない）---');
    console.log(body);
    console.log(`--- 台帳: ${log.length}件（今回 ${logEntries.length}件追記）---`);
    return;
  }

  const r = spawnSync('python', ['-X', 'utf8', SLACK_SENDER, 'SUBSUKU_DAILY', body], {
    encoding: 'utf-8',
  });
  if (r.status === 0) {
    console.log(`Slack通知 OK（検知${events.length}件・台帳${log.length}件）`);
  } else {
    // 通知に失敗しても監視自体は成功しているので、ここで異常終了させない（fail-open）
    console.error('Slack通知に失敗:', (r.stderr || r.stdout || '').slice(0, 200));
    console.error('--- 送ろうとした本文 ---');
    console.error(body);
  }
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
