// 3日分の棚卸し — 無人運用が静かに壊れていないかを機械で見る
//
// なぜ要るか（2026-09-05）：
//   9/2の点検で見つかった不具合は、どれも「気づく仕組みが無かった」だけで、
//   状態を見れば全部わかるものだった。
//     - 為替が8/18のまま15日間据え置き（PRは毎日できていたが誰もマージしなかった）
//     - 同じ相場日で違う値のPRが2本（公表前の時刻に取っていた）
//     - judge の PR が4本たまっていた（8/21〜8/28）
//   Slack には毎日通知が流れていたが、流れるものは溜まりを可視化しない
//   （docs/lessons.md 2026-08-19 の結論）。**溜まりは静止しているので、定期的に
//   数えに行くしかない。** これがその「数えに行く」役。
//
// 見るもの（すべてログイン不要・ローカルと公開サイトだけで判定できるもの）：
//   1. 未判定の検知が残っていないか
//   2. 未マージPRが何日滞留しているか
//   3. 為替が直近の区切り(1日/15日)より古くないか
//   4. 直近3日ぶん、毎日の判定が実際に走った形跡があるか（ログの欠測）
//   5. judge が Slack 送信に失敗した形跡がないか
//   6. 本番サイトが 200 を返すか
//
// 実行: node scripts/ops/triage.mjs [--json]
//   指摘があれば exit 1。何もなければ exit 0。

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DAYS = Number(process.env.TRIAGE_DAYS || 3);
const SITE = process.env.SEO_SITE_URL || 'https://sabusuku-yameta.com';
const jsonMode = process.argv.includes('--json');

const findings = [];
const add = (severity, kind, detail, action) => findings.push({ severity, kind, detail, action });

const jstToday = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(d);
};

function readJson(rel) {
  const p = path.join(ROOT, rel);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf-8')) : null;
}

// 1) 未判定の検知
const log = readJson('scripts/price-watch/state/detection_log.json') || [];
const unjudged = log.filter((x) => !x.verdict);
if (unjudged.length) {
  const oldest = unjudged.map((x) => x.date).sort()[0];
  add('高', '未判定の検知', `${unjudged.length}件が未判定のまま（最古 ${oldest}）`,
    '判定タスクが動いていない可能性。Subsuku_PriceJudge_0730 の実行結果を見る');
}

// 2) 未マージPR
try {
  const raw = execFileSync('gh', ['pr', 'list', '--limit', '30', '--json', 'number,title,createdAt'],
    { cwd: ROOT, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
  const prs = JSON.parse(raw || '[]');
  const stale = prs
    .map((p) => ({ ...p, age: Math.floor((Date.now() - new Date(p.createdAt)) / 86400000) }))
    .filter((p) => p.age >= 2);
  if (stale.length) {
    add('中', '未マージPR', `${stale.length}本が2日以上放置：` +
      stale.map((p) => `#${p.number}(${p.age}日)`).join(' '),
      'サイトの表示が実際と違う可能性がある。中身を見てマージするか閉じる');
  }
} catch {
  add('低', 'PR確認', 'gh でPR一覧を取得できなかった', '認証切れかネットワーク。手で確認する');
}

// 3) 為替の鮮度
try {
  const svc = readFileSync(path.join(ROOT, 'src/data/services.js'), 'utf-8');
  const m = svc.match(/USD_JPY_AS_OF\s*=\s*'(\d{4}-\d{2}-\d{2})'/);
  if (m) {
    const asOf = m[1];
    const now = new Date();
    const day = Number(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', day: 'numeric' }).format(now));
    const ym = jstToday().slice(0, 7);
    const boundary = day >= 15 ? `${ym}-15` : `${ym}-01`;
    if (asOf < boundary) {
      const lag = Math.floor((Date.now() - new Date(asOf)) / 86400000);
      add('中', '為替が古い', `USD_JPY_AS_OF=${asOf}（直近の区切り ${boundary} より前・${lag}日経過）`,
        'Subsuku_FxUpdate_1100 が作ったPRが未マージの可能性。PRを見る');
    }
  }
} catch { /* services.js が読めない事態は下の site チェックで拾う */ }

// 4) 判定ログの欠測（直近DAYS日ぶん、その日のログが1つでもあるか）
const logDir = path.join(ROOT, 'scripts/price-watch/logs');
if (existsSync(logDir)) {
  const files = readdirSync(logDir);
  const missing = [];
  for (let i = 1; i <= DAYS; i += 1) {
    const d = daysAgo(i);
    if (!files.some((f) => f.startsWith(`judge_${d}`))) missing.push(d);
  }
  if (missing.length) {
    add('中', '判定の欠測', `直近${DAYS}日のうち ${missing.join(' / ')} の判定ログが無い`,
      'PCが落ちていたなら想定内。連日続くならタスクを確認する');
  }

  // 5) judge が Slack 送信に失敗した形跡
  const recent = files.filter((f) => f.startsWith('judge_') &&
    [...Array(DAYS)].some((_, i) => f.startsWith(`judge_${daysAgo(i + 1)}`) || f.startsWith(`judge_${jstToday()}`)));
  const failed = [];
  for (const f of recent) {
    try {
      const t = readFileSync(path.join(logDir, f), 'utf-8');
      if (/slack[^\n]{0,80}(失敗|failed|Exit code [1-9])/i.test(t)) failed.push(f);
    } catch { /* 読めないログは飛ばす */ }
  }
  if (failed.length) {
    add('中', 'Slack送信の失敗', `${failed.length}件のログに送信失敗の形跡：${failed.join(' ')}`,
      '通知が届いていない日がある。ログを開いて内容を確認する');
  }
}

// 6) 本番サイトが生きているか
try {
  const res = await fetch(SITE, { headers: { 'User-Agent': 'subsuku-triage/1.0' } });
  if (!res.ok) add('高', '本番サイト', `${SITE} が HTTP ${res.status}`, 'Netlifyのデプロイ状況とクレジット残量を見る');
} catch (e) {
  add('高', '本番サイト', `${SITE} に接続できない: ${e.message}`, 'Netlifyのデプロイ状況とクレジット残量を見る');
}

if (jsonMode) {
  console.log(JSON.stringify({ days: DAYS, findings }, null, 2));
} else {
  console.log(`===== ${DAYS}日分の棚卸し =====`);
  if (findings.length === 0) {
    console.log('✅ 指摘なし。');
  } else {
    console.log(`❌ ${findings.length}件\n`);
    for (const f of findings) {
      console.log(`【${f.severity}】${f.kind}`);
      console.log(`  ${f.detail}`);
      console.log(`  → ${f.action}\n`);
    }
  }
}

// process.exit を即座に呼ぶと、fetch が張ったソケットの後始末と競合して
// Windows の libuv が「Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)」で
// 落ちることがある（2026-09-05 実測・exit code 127 になり呼び出し側が誤解する）。
// 終了コードだけ予約して、イベントループが自然に空くのを待つ。
process.exitCode = findings.length > 0 ? 1 : 0;
