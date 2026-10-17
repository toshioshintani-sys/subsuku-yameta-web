// クラウド版の機械点検 — 巡回・3日棚卸し・週次の「見るところ」を、Windows に頼らず点検する（2026-10-17）
//
// なぜ要るか：
//   PC の点検（run_watch.mjs・triage.mjs）は schtasks・netlify CLI・gh pr list（GraphQL）・
//   PC にだけある判定ログ（scripts/price-watch/logs/ は git 管理外）を使うので、クラウドでは動かない。
//   クラウドの定期タスク（毎回リポジトリを新しくクローンする・米国から接続する）でも同じ目的を果たせるよう、
//   誰でも読める発信元だけで点検する：
//     - 本番に出ているコミット … https://sabusuku-yameta.com/build.json（netlify-build.mjs が書く）
//     - 未マージPR … GitHub REST（gh api。使えなければ公開APIを直接）
//     - 為替・価格監視の台帳 … main の src/data/services.js と scripts/price-watch/state/
//
// 使い方:
//   node scripts/ops/cloud_check.mjs                 # 毎日の巡回（直近1日）
//   node scripts/ops/cloud_check.mjs --days 3 --seo  # 3日棚卸し（SEO健全性も見る）
//   node scripts/ops/cloud_check.mjs --days 7 --seo  # 週次
//   --json で JSON 出力。対応が要る指摘（高・中、または未マージPR）があれば exit 1。

import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OWNER_REPO = 'toshioshintani-sys/subsuku-yameta-web';
const SITE = process.env.SEO_SITE_URL || 'https://sabusuku-yameta.com';
const args = process.argv.slice(2);
const argVal = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const DAYS = Number(argVal('--days', '1'));
const WITH_SEO = args.includes('--seo');
const JSON_OUT = args.includes('--json');

// netlify-ignore.sh・run_watch.mjs と同じ「サイトの出力に影響しないパス」
const SAFE = /^(docs\/|scripts\/price-watch\/(state|logs)\/|scripts\/price-watch\/watch-list\.json$|scripts\/ops\/|.*\.md$|\.gitignore$)/;

const findings = [];
const facts = [];
const add = (sev, kind, detail) => findings.push({ sev, kind, detail });

// クラウドは UTC で動くので、日付と時刻は必ず日本時間で数える
const jst = (d = new Date()) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, ym: `${p.year}-${p.month}`, day: Number(p.day), min: Number(p.hour) % 24 * 60 + Number(p.minute) };
};
const now = jst();

function git(a, timeout = 120000) {
  const r = spawnSync('git', a, { cwd: ROOT, encoding: 'utf-8', timeout, maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'subsuku-cloud-check/1.0', Accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** GitHub REST。gh api（認証あり）を先に試し、駄目なら公開APIを直接（このリポは公開）。 */
async function github(apiPath) {
  const r = spawnSync('gh', ['api', apiPath], { cwd: ROOT, encoding: 'utf-8', timeout: 60000, maxBuffer: 32 * 1024 * 1024 });
  if (r.status === 0 && r.stdout) return JSON.parse(r.stdout);
  return getJson(`https://api.github.com/${apiPath}`);
}

const readRepo = (rel, fallback = null) => {
  const p = path.join(ROOT, rel);
  if (!existsSync(p)) return fallback;
  try { return JSON.parse(readFileSync(p, 'utf-8').replace(/^﻿/, '')); } catch { return fallback; }
};

// ---------------------------------------------------------------------------
git(['fetch', '--quiet', 'origin', 'main']);
const head = git(['rev-parse', 'origin/main']).out || git(['rev-parse', 'HEAD']).out;

// 1) 本番に出ているコミットと main の差
try {
  const b = await getJson(`${SITE}/build.json?t=${Date.now()}`);
  const live = String(b.commit || '');
  facts.push(`本番のコミット: ${live.slice(0, 7)}（${b.builtAt || '?'}）／ main先頭: ${head.slice(0, 7)}`);
  if (live && live !== head) {
    if (git(['cat-file', '-e', `${live}^{commit}`]).code !== 0) git(['fetch', '--quiet', 'origin', live]);
    if (git(['cat-file', '-e', `${live}^{commit}`]).code !== 0) git(['fetch', '--quiet', '--unshallow', 'origin']);
    const d = git(['diff', '--name-only', live, head]);
    if (d.code !== 0) {
      add('中', '本番と main を比べられない', `git diff ${live.slice(0, 7)}..${head.slice(0, 7)} が失敗: ${d.err.slice(0, 160)}`);
    } else {
      const unsafe = d.out.split('\n').filter(Boolean).filter((f) => !SAFE.test(f));
      if (unsafe.length) {
        // push 直後はビルド中（2〜3分）。いちばん古い未反映コミットが20分以内なら「ビルド待ち」として扱う。
        const ts = git(['log', '--format=%ct', `${live}..${head}`, '--', ...unsafe]).out.split('\n').filter(Boolean).map(Number);
        const oldestMin = ts.length ? (Date.now() / 1000 - Math.min(...ts)) / 60 : 999;
        if (oldestMin < 20) {
          add('低', 'ビルド待ち', `main の変更が本番に出るのを待っている（最古の未反映 ${Math.round(oldestMin)}分前）: ${unsafe.slice(0, 5).join(', ')}`);
        } else {
          add('高', '本番が古い', `本番 ${live.slice(0, 7)} と main ${head.slice(0, 7)} の間に、サイトの表示に効く変更が出ていない（${Math.round(oldestMin)}分以上）: ${unsafe.slice(0, 8).join(', ')}`);
        }
      }
    }
  }
} catch (e) {
  add('低', '本番のコミットを読めない', `${SITE}/build.json: ${e.message}（設置前のデプロイなら想定内。Netlify コネクタで確認する）`);
}

// 2) 本番サイトが生きているか
try {
  const res = await fetch(SITE, { headers: { 'User-Agent': 'subsuku-cloud-check/1.0' } });
  if (!res.ok) add('高', '本番サイト', `${SITE} が HTTP ${res.status}`);
} catch (e) {
  add('高', '本番サイト', `${SITE} に接続できない: ${e.message}`);
}

// 3) 未マージPR（価格・判定・為替は高。ほかは2日以上で中）。為替を変えるPRが2本以上なら矛盾の疑い。
try {
  const prs = await github(`repos/${OWNER_REPO}/pulls?state=open&per_page=50`);
  facts.push(`未マージPR: ${prs.length}本`);
  const fxPrs = [];
  for (const p of prs) {
    const age = Math.floor((Date.now() - new Date(p.created_at)) / 86400000);
    const priceLike = /価格|判定|為替|改定|price\//.test(`${p.title} ${p.head && p.head.ref}`);
    const line = `#${p.number}（${age}日・${p.head && p.head.ref}） ${p.title}`;
    if (priceLike) add('高', '未マージPR', line);
    else if (age >= 2) add('中', '未マージPR', line);
    else add('低', '未マージPR', line);
    if (priceLike) {
      try {
        const files = await github(`repos/${OWNER_REPO}/pulls/${p.number}/files?per_page=100`);
        const svc = files.find((f) => f.filename === 'src/data/services.js');
        const m = svc && svc.patch && svc.patch.match(/^\+export const USD_JPY = ([\d.]+)/m);
        const a = svc && svc.patch && svc.patch.match(/^\+export const USD_JPY_AS_OF = '([\d-]+)'/m);
        if (m) fxPrs.push(`#${p.number} USD_JPY=${m[1]}${a ? `（相場日 ${a[1]}）` : ''}`);
      } catch { /* ファイル一覧が取れなくてもPR自体は上で指摘済み */ }
    }
  }
  if (fxPrs.length >= 2) add('高', '為替を変えるPRが複数', `${fxPrs.join(' / ')}（同じ相場日で値が違えば少なくとも一方が誤り）`);
} catch (e) {
  add('中', 'PR一覧を取得できない', `GitHub REST が失敗: ${e.message}`);
}

// 4) 為替の鮮度（区切りは毎月1日と15日。公表は10時頃なので、区切り当日は11:30まで待つ）
try {
  const svc = readFileSync(path.join(ROOT, 'src/data/services.js'), 'utf-8');
  const m = svc.match(/USD_JPY_AS_OF\s*=\s*'(\d{4}-\d{2}-\d{2})'/);
  if (m) {
    const boundary = `${now.ym}-${now.day >= 15 ? '15' : '01'}`;
    facts.push(`為替: USD_JPY_AS_OF=${m[1]}（直近の区切り ${boundary}）`);
    const boundaryDayEarly = now.date === boundary && now.min < 11 * 60 + 30;
    if (m[1] < boundary && !boundaryDayEarly) add('高', '為替が古い', `USD_JPY_AS_OF=${m[1]} が直近の区切り ${boundary} より前`);
  }
} catch { /* services.js が読めない事態はビルド・本番の指摘で出る */ }

// 5) 価格監視（当面PCに残る）が main に記録を出しているか・未判定が main に残っていないか
const st = readRepo('scripts/price-watch/state/price_watch_state.json', {});
const lastChecked = Object.values(st || {}).map((v) => v && v.checkedAt).filter(Boolean).sort().pop();
if (lastChecked) {
  const ageH = (Date.now() - new Date(lastChecked)) / 3600000;
  facts.push(`価格監視の最終記録（main）: ${lastChecked}（${Math.round(ageH)}時間前）`);
  if (ageH > 72) add('中', '価格監視の記録が止まっている', `main の台帳の最終巡回が ${Math.round(ageH)}時間前。PC の巡回・判定（Subsuku_PriceWatch_0710 / PriceJudge_0730）が動いていない可能性`);
}
const dl = readRepo('scripts/price-watch/state/detection_log.json', []);
const unjudged = Array.isArray(dl) ? dl.filter((x) => x.verdict == null) : [];
facts.push(`main の未判定の検知: ${unjudged.length}件`);
if (unjudged.length) add('高', '未判定の検知が main に残っている', `${unjudged.length}件（最古 ${unjudged.map((x) => x.date).sort()[0]}）`);

// 6) 週次：自動修正の影（autofix_shadow）に未解決が残っていないか
if (DAYS >= 7) {
  const sh = readRepo('scripts/price-watch/state/autofix_shadow.json', null);
  const list = Array.isArray(sh) ? sh : (sh && Array.isArray(sh.entries) ? sh.entries : []);
  const open = list.filter((x) => x && !x.resolvedAt);
  facts.push(`autofix_shadow の未解決: ${open.length}件`);
  if (open.length) add('中', 'autofix_shadow に未解決', open.slice(0, 5).map((x) => x.id || x.serviceId || JSON.stringify(x).slice(0, 60)).join(' / '));
}

// 7) 3日棚卸し・週次：SEO 健全性（本番の実HTML）
let seoOut = '';
if (WITH_SEO) {
  const r = spawnSync(process.execPath, ['scripts/seo/seo-health.mjs'], { cwd: ROOT, encoding: 'utf-8', timeout: 600000, maxBuffer: 64 * 1024 * 1024 });
  seoOut = (r.stdout || '') + (r.stderr || '');
  if (r.status !== 0) add('中', 'SEO健全性の指摘', seoOut.trim().split('\n').filter((l) => /❌|⚠|NG|短い|欠/.test(l)).slice(0, 8).join(' / ') || `exit ${r.status}`);
}

// ---------------------------------------------------------------------------
const order = { 高: 0, 中: 1, 低: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev]);
const actionable = findings.filter((f) => f.sev !== '低' || f.kind === '未マージPR');

if (JSON_OUT) {
  console.log(JSON.stringify({ jst: now, days: DAYS, facts, findings, actionable: actionable.length }, null, 2));
} else {
  console.log(`## クラウド点検（${now.date} 日本時間・直近${DAYS}日）`);
  console.log('\n### 事実');
  for (const f of facts) console.log(`- ${f}`);
  console.log(`\n### 指摘 ${findings.length}件（対応が要るもの ${actionable.length}件）`);
  if (!findings.length) console.log('- なし');
  for (const f of findings) console.log(`- 【${f.sev}】${f.kind}：${f.detail}`);
  if (seoOut) console.log(`\n### SEO健全性の出力\n${seoOut.trim()}`);
}
process.exitCode = actionable.length ? 1 : 0;
