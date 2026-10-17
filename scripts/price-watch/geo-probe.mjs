#!/usr/bin/env node
/**
 * geo-probe.mjs — 「日本以外から接続しても日本の価格が取れる取り方」をサービスごとに総当たりで調べる（2026-10-17）
 *
 * ■ なぜ要るのか
 *   クラウド（Claude のクラウドルーティン）は米国から接続する。Netflix の日本ページをブラウザで開くと、
 *   JavaScript が接続元の国に合わせて米ドルに書き換える（2026-10-17 実測）。一方、ブラウザを使わず
 *   同じ URL の生 HTML を読むと「￥890〜￥2,290」が入っていた。＝取り方次第で日本の価格は取れる。
 *   どの取り方が効くかはサービスごとに違うので、機械で総当たりして表にする。
 *
 * ■ 試す取り方
 *   S1 plain    : 素の fetch（今の棚卸しと同じ。Accept-Language: ja）
 *   S2 first    : ブラウザで開き、JavaScript が書き換える前の「最初の HTML 応答」を読む
 *                 （ボット対策はブラウザで通しつつ、サーバー側で埋め込まれた日本価格を拾う）
 *   S3 jpbrowser: ブラウザのタイムゾーン=Asia/Tokyo・言語=ja-JP にして描画後を読む
 *   S4 rendered : ブラウザで描画後を読む（今の headless 方式）
 *
 * ■ 判定
 *   サイトの掲載価格（services.js の PRICING / PLANS の円）のうち、ページに出た円と一致した数を数える。
 *   日本（PC）と米国（クラウド）で同じ数になる取り方が「米国からでも使える取り方」。
 *   USD 建てサービス（USD_PRICED）は対象外（為替換算なので国に依らない）。
 *
 * 使い方:
 *   node scripts/price-watch/geo-probe.mjs                      # enabled 全件
 *   node scripts/price-watch/geo-probe.mjs --only netflix,disney-plus
 *   node scripts/price-watch/geo-probe.mjs --json scripts/price-watch/logs/geo-probe-jp.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');

// reconcile.mjs / price-watch.mjs と同一の抽出ロジック（意図的な複製）
const TAG = /<[^>]*>/g;
const WS = /\s+/g;
const SCRIPT_STYLE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const PRICE_TOK = /(?:[¥￥]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*\s?円|\$\s?\d[\d,]*(?:\.\d+)?)/g;
const FOLLOWED_BY_SLUG = /^[a-z-]/;
const COMPUTE_CONTEXT = /per\s+(hour|container|token|request|minute|second|gb|call)/i;

function extractNumbers(rawHtml, stripScriptStyle) {
  const base = stripScriptStyle ? rawHtml.replace(SCRIPT_STYLE, ' ') : rawHtml;
  const text = base.replace(TAG, ' ').replace(WS, ' ');
  const yen = new Set();
  const usd = new Set();
  for (const m of text.matchAll(PRICE_TOK)) {
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 40);
    if (FOLLOWED_BY_SLUG.test(after) || COMPUTE_CONTEXT.test(after)) continue;
    const t = m[0].replace(/\s/g, '');
    const n = Number(t.replace(/[¥￥$円,]/g, ''));
    if (!Number.isFinite(n)) continue;
    (t.includes('$') ? usd : yen).add(n);
  }
  return { yen, usd };
}

// 埋め込み JSON の価格（Netflix の "priceFormatted":"￥890" 型）も拾うため、生 HTML は script を剥がさずにも数える
function numbersBoth(html, stripScriptStyle) {
  const a = extractNumbers(html, stripScriptStyle);
  if (!stripScriptStyle) return a;
  const b = extractNumbers(html, false);
  return { yen: new Set([...a.yen, ...b.yen]), usd: new Set([...a.usd, ...b.usd]) };
}

function displayedYen(id, { PRICING, PLANS }) {
  const out = new Set();
  if (typeof PRICING[id] === 'number' && PRICING[id] > 0) out.add(PRICING[id]);
  const e = PLANS[id];
  if (e && Array.isArray(e.plans)) {
    for (const p of e.plans) {
      if (typeof p.monthly === 'number' && p.monthly > 0) out.add(p.monthly);
      if (typeof p.yearly === 'number' && p.yearly > 0) out.add(p.yearly);
    }
  }
  return [...out];
}

const UA_DESKTOP =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function s1Plain(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA_DESKTOP, 'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.5', Accept: 'text/html,*/*' },
      signal: ctrl.signal,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// S5：素朴な名乗り（curl と同じ）での素の取得。Netflix は Chrome と名乗る相手には日本円を埋め込まず、
// curl には埋め込んで返した（2026-10-17 クラウド実測）。偽装ではなく、正直に curl と名乗る。
async function s5Curl(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'curl/8.5.0', 'Accept-Language': 'ja-JP,ja;q=0.9', Accept: '*/*' },
      signal: ctrl.signal,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function withPage(browser, fn, { jp } = {}) {
  const page = await browser.newPage();
  try {
    await page.setUserAgent(UA_DESKTOP);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ja-JP,ja;q=0.9' });
    if (jp) {
      await page.emulateTimezone('Asia/Tokyo');
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'language', { get: () => 'ja-JP' });
        Object.defineProperty(navigator, 'languages', { get: () => ['ja-JP', 'ja'] });
      });
    }
    return await fn(page);
  } finally {
    await page.close().catch(() => {});
  }
}

async function s2First(browser, url, timeoutMs) {
  return withPage(browser, async (page) => {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    if (!resp) throw new Error('no response');
    if (resp.status() >= 400) throw new Error('HTTP ' + resp.status());
    return await resp.text();
  });
}

async function sRendered(browser, url, timeoutMs, jp) {
  return withPage(
    browser,
    async (page) => {
      const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: timeoutMs });
      if (resp && resp.status() >= 400) throw new Error('HTTP ' + resp.status());
      await page
        .waitForFunction(() => document.body && document.body.innerText.replace(/\s/g, '').length > 100, { timeout: 8000 })
        .catch(() => {});
      return await page.evaluate(() => document.documentElement.outerHTML);
    },
    { jp }
  );
}

async function main() {
  const args = process.argv.slice(2);
  const iOnly = args.indexOf('--only');
  const only = iOnly >= 0 && args[iOnly + 1] ? new Set(args[iOnly + 1].split(',').map((s) => s.trim())) : null;
  const iJson = args.indexOf('--json');
  const jsonOut = iJson >= 0 && args[iJson + 1] ? args[iJson + 1] : null;

  const wl = JSON.parse(readFileSync(resolve(HERE, 'watch-list.json'), 'utf-8'));
  const timeoutMs = (wl.settings && wl.settings.timeoutMs) || 25000;
  const svc = await import(pathToFileURL(resolve(ROOT, 'src/data/services.js')).href);
  const { PRICING, PLANS, USD_PRICED = {} } = svc;

  let targets = (wl.watch || wl.targets || []).filter((w) => w.enabled !== false);
  // --variants geo-variants.json：サービスごとの候補URLを1行ずつ試す（watch-list の URL の代わり）
  const iVar = args.indexOf('--variants');
  if (iVar >= 0 && args[iVar + 1]) {
    const byId = new Map(targets.map((w) => [w.id, w]));
    const spec = JSON.parse(readFileSync(resolve(ROOT, args[iVar + 1]), 'utf-8'));
    targets = spec.candidates.flatMap((c) =>
      c.urls.map((url) => ({ ...(byId.get(c.id) || {}), id: c.id, url }))
    );
  }
  if (only) targets = targets.filter((w) => only.has(w.id));
  targets = targets.filter((w) => !Object.prototype.hasOwnProperty.call(USD_PRICED, w.id));
  // --strategies S1,S5,S4 で取り方を絞る（候補URLの総当たりは数が多いので軽い取り方だけにする）
  const iStr = args.indexOf('--strategies');
  const pick = iStr >= 0 && args[iStr + 1] ? new Set(args[iStr + 1].split(',').map((s) => s.trim())) : null;

  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--lang=ja-JP'],
  });

  const strategies = [
    ['S1_plain', (w) => s1Plain(w.url, timeoutMs)],
    ['S2_first', (w) => s2First(browser, w.url, timeoutMs)],
    ['S3_jpbrowser', (w) => sRendered(browser, w.url, timeoutMs, true)],
    ['S4_rendered', (w) => sRendered(browser, w.url, timeoutMs, false)],
    ['S5_curl', (w) => s5Curl(w.url, timeoutMs)],
  ].filter(([n]) => !pick || pick.has(n.split('_')[0]));

  const rows = [];
  for (const w of targets) {
    const want = displayedYen(w.id, { PRICING, PLANS });
    if (!want.length) continue;
    const row = { id: w.id, url: w.url, want, results: {} };
    for (const [name, run] of strategies) {
      try {
        // 1つの取り方が固まっても全体を止めない（2026-10-17 Netflix の S2 で固まった）
        const html = await Promise.race([
          run(w),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout 45s')), 45000)),
        ]);
        const { yen, usd } = numbersBoth(html, w.stripScriptStyle);
        const hit = want.filter((v) => yen.has(v));
        row.results[name] = { hit: hit.length, of: want.length, usdCount: usd.size, yenSample: [...yen].sort((a, b) => a - b).slice(0, 12) };
      } catch (e) {
        row.results[name] = { error: String(e.message || e).slice(0, 80) };
      }
      await sleep(400);
    }
    rows.push(row);
    const cell = (r) => (r.error ? `ERR(${r.error.slice(0, 20)})` : `${r.hit}/${r.of}${r.usdCount ? ` $${r.usdCount}` : ''}`);
    console.log([w.id.padEnd(24), ...strategies.map(([n]) => `${n}=${cell(row.results[n])}`), w.url].join('  '));
  }
  await browser.close();

  if (jsonOut) {
    mkdirSync(dirname(resolve(ROOT, jsonOut)), { recursive: true });
    writeFileSync(resolve(ROOT, jsonOut), JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2), 'utf-8');
    console.log('\njson: ' + jsonOut);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
