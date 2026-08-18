#!/usr/bin/env node
/**
 * reconcile.mjs — 表示価格の棚卸し（2026-07-25 追加）
 *
 * ■ なぜ要るのか（price-watch.mjs との違い＝これが最重要）
 *   price-watch.mjs は「公式ページの**今日** vs **前回スナップショット**」を比べる。
 *   つまり *変化* しか見ていない。うちの services.js に書いてある表示価格が
 *   そもそも合っているかは、一度も検証していなかった。
 *   その結果 iCloud+ は2世代前の価格（130円／実際は180円）を長期間表示し続け、
 *   監視は「変化なし」と報告し続けていた（＝穴を塞げない）。
 *
 *   このスクリプトは「公式ページ **vs うちの表示（PLANS / PRICING）**」を突き合わせる。
 *   price-watch が時間軸の監視なら、こちらは在庫の棚卸し。役割が違うので両方要る。
 *
 * ■ これは検知ツールであって、自動修正ではない（誤報ゼロ原則）
 *   「ページに出てこない = 間違い」ではない。よくある正常な不一致：
 *     - 年額のみ表示／税別表示／キャンペーン価格だけ大書
 *     - プラン表がJS描画・画像・ログイン後にしか出ない
 *     - 1ページに複数国の価格が並ぶ
 *   なので出力は「疑わしい候補リスト」。必ず公式ページを目視・一次確認してから直す。
 *
 * 使い方:
 *   node scripts/price-watch/reconcile.mjs                 # enabled 全件
 *   node scripts/price-watch/reconcile.mjs --only netflix,spotify
 *   node scripts/price-watch/reconcile.mjs --all           # disabled も含めて試す
 *   node scripts/price-watch/reconcile.mjs --json out.json # 生ログを保存
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');

// --- price-watch.mjs と同一の抽出ロジック（意図的な複製：監視側の挙動と食い違わせない） ---
const TAG = /<[^>]*>/g;
const WS = /\s+/g;
const SCRIPT_STYLE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const PRICE_TOK = /(?:[¥￥]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*\s?円|\$\s?\d[\d,]*(?:\.\d+)?)/g;
const FOLLOWED_BY_SLUG = /^[a-z-]/;
const COMPUTE_CONTEXT = /per\s+(hour|container|token|request|minute|second|gb|call)/i;

function extractTokens(rawHtml, opts = {}) {
  const base = opts.stripScriptStyle ? rawHtml.replace(SCRIPT_STYLE, ' ') : rawHtml;
  const text = base.replace(TAG, ' ').replace(WS, ' ');
  const toks = new Set();
  for (const m of text.matchAll(PRICE_TOK)) {
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 40);
    if (FOLLOWED_BY_SLUG.test(after)) continue;
    if (COMPUTE_CONTEXT.test(after)) continue;
    toks.add(m[0].replace(/\s/g, ''));
  }
  return [...toks];
}

// トークン("¥1,180" "1,180円" "$20")を数値に落とす。円/ドルは別集合で持つ。
function toNumbers(tokens) {
  const yen = new Set();
  const usd = new Set();
  for (const t of tokens) {
    const n = Number(t.replace(/[¥￥$円,\s]/g, ''));
    if (!Number.isFinite(n)) continue;
    if (t.includes('$')) usd.add(n);
    else yen.add(n);
  }
  return { yen, usd };
}

async function fetchPlain(url, ua, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': ua, 'Accept-Language': 'ja,en;q=0.8', Accept: 'text/html,*/*' },
      signal: ctrl.signal,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

const AD_BLOCK = /googlesyndication|doubleclick|google-analytics|googletagmanager|\/gtag\/|adservice\.google|pagead2|adsbygoogle/i;

async function fetchHeadless(browser, url, timeoutMs, opts = {}) {
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  );
  if (!opts.noAdBlock) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (AD_BLOCK.test(req.url())) req.abort();
      else req.continue();
    });
  }
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: timeoutMs });
    await page
      .waitForFunction(() => document.body && document.body.innerText.replace(/\s/g, '').length > 100, { timeout: 8000 })
      .catch(() => {});
    return await page.evaluate(() => document.documentElement.outerHTML);
  } finally {
    await page.close();
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- うちの表示価格を1サービス分あつめる ---
function displayedPrices(id, { PRICING, PLANS }) {
  const out = [];
  if (typeof PRICING[id] === 'number' && PRICING[id] > 0) {
    out.push({ label: '代表月額(PRICING)', value: PRICING[id] });
  }
  const entry = PLANS[id];
  if (entry && Array.isArray(entry.plans)) {
    entry.plans.forEach((p) => {
      if (typeof p.monthly === 'number' && p.monthly > 0) out.push({ label: p.name + '(月)', value: p.monthly });
      if (typeof p.yearly === 'number' && p.yearly > 0) out.push({ label: p.name + '(年)', value: p.yearly });
    });
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const only = (() => {
    const i = args.indexOf('--only');
    return i >= 0 && args[i + 1] ? new Set(args[i + 1].split(',').map((s) => s.trim())) : null;
  })();
  const includeDisabled = args.includes('--all');
  const jsonOut = (() => {
    const i = args.indexOf('--json');
    return i >= 0 && args[i + 1] ? args[i + 1] : null;
  })();

  const wl = JSON.parse(readFileSync(resolve(HERE, 'watch-list.json'), 'utf-8'));
  const settings = wl.settings || {};
  const ua = settings.userAgent || 'Mozilla/5.0';
  const timeoutMs = settings.timeoutMs || 20000;

  const svc = await import(pathToFileURL(resolve(ROOT, 'src/data/services.js')).href);
  const { PRICING, PLANS, SERVICES, USD_PRICED = {} } = svc;
  const nameById = new Map(SERVICES.map((s) => [s.id, s.name]));

  let targets = (wl.watch || wl.targets || []).filter((w) => (includeDisabled ? true : w.enabled !== false));
  if (only) targets = targets.filter((w) => only.has(w.id));

  const needsHeadless = targets.some((w) => w.renderMode === 'headless');
  let browser = null;
  if (needsHeadless) {
    const puppeteer = (await import('puppeteer')).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--lang=ja-JP'],
    });
  }

  const results = [];
  for (const w of targets) {
    const shown = displayedPrices(w.id, { PRICING, PLANS });
    const row = { id: w.id, name: nameById.get(w.id) || w.id, url: w.url, shown: shown.length, status: '', missing: [], pageYen: [], pageUsd: [] };

    if (shown.length === 0) {
      row.status = 'SKIP_NO_DISPLAY';
      results.push(row);
      continue;
    }

    let html = '';
    try {
      html =
        w.renderMode === 'headless'
          ? await fetchHeadless(browser, w.url, timeoutMs, { noAdBlock: w.noAdBlock })
          : await fetchPlain(w.url, ua, timeoutMs);
    } catch (e) {
      row.status = 'FETCH_FAIL';
      row.error = String(e.message || e).slice(0, 100);
      results.push(row);
      await sleep(600);
      continue;
    }

    const tokens = extractTokens(html, { stripScriptStyle: w.stripScriptStyle });
    const { yen, usd } = toNumbers(tokens);
    row.pageYen = [...yen].sort((a, b) => a - b);
    row.pageUsd = [...usd].sort((a, b) => a - b);

    if (yen.size === 0 && usd.size === 0) {
      row.status = 'NO_PRICE_ON_PAGE';
      results.push(row);
      await sleep(600);
      continue;
    }

    const isUsd = Object.prototype.hasOwnProperty.call(USD_PRICED, w.id);
    for (const s of shown) {
      // USD建てサービスは円の表示値が為替換算済みなので突き合わせ対象外（USD側を別途見る）
      if (isUsd) continue;
      if (!yen.has(s.value)) row.missing.push(s);
    }
    if (isUsd) {
      const want = USD_PRICED[w.id];
      row.status = usd.has(want) ? 'OK_USD' : 'CHECK_USD';
      row.usdExpected = want;
    } else {
      row.status = row.missing.length === 0 ? 'OK' : row.missing.length === shown.length ? 'ALL_MISS' : 'PARTIAL_MISS';
    }
    results.push(row);
    await sleep(600);
  }

  if (browser) await browser.close();

  // --- レポート ---
  const order = { ALL_MISS: 0, PARTIAL_MISS: 1, CHECK_USD: 2, NO_PRICE_ON_PAGE: 3, FETCH_FAIL: 4, OK_USD: 5, OK: 6, SKIP_NO_DISPLAY: 7 };
  results.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.id.localeCompare(b.id));

  const count = (s) => results.filter((r) => r.status === s).length;
  console.log('\n===== 表示価格の棚卸し（公式ページ vs services.js） =====');
  console.log(`対象 ${results.length}件 / 一致 ${count('OK') + count('OK_USD')} / 全不一致 ${count('ALL_MISS')} / 一部不一致 ${count('PARTIAL_MISS')} / USD要確認 ${count('CHECK_USD')} / 価格取れず ${count('NO_PRICE_ON_PAGE')} / 取得失敗 ${count('FETCH_FAIL')}`);
  console.log('※「不一致」は即エラーではない（年額のみ/税別/JS描画等で出ない場合あり）。公式を一次確認してから直すこと。\n');

  for (const r of results) {
    if (r.status === 'OK' || r.status === 'OK_USD' || r.status === 'SKIP_NO_DISPLAY') continue;
    console.log(`【${r.status}】${r.name} (${r.id})`);
    console.log(`   ${r.url}`);
    if (r.error) console.log(`   エラー: ${r.error}`);
    if (r.missing.length) console.log(`   ページに無い表示値: ${r.missing.map((m) => m.value + '円[' + m.label + ']').join(' / ')}`);
    if (r.usdExpected != null) console.log(`   期待USD: $${r.usdExpected} / ページUSD: ${r.pageUsd.slice(0, 12).join(', ') || 'なし'}`);
    if (r.pageYen.length) console.log(`   ページの円: ${r.pageYen.slice(0, 18).join(', ')}${r.pageYen.length > 18 ? ' …' : ''}`);
    console.log('');
  }

  const okIds = results.filter((r) => r.status === 'OK' || r.status === 'OK_USD').map((r) => r.id);
  console.log('一致（問題なし）: ' + (okIds.join(', ') || 'なし'));

  if (jsonOut) {
    mkdirSync(dirname(resolve(ROOT, jsonOut)), { recursive: true });
    writeFileSync(resolve(ROOT, jsonOut), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2), 'utf-8');
    console.log('\n生ログ: ' + jsonOut);
  }

  // 一致しなかった件があっても exit 1 にはしない（=検知ツール。CIを赤くするのは別途 lint で行う）
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
