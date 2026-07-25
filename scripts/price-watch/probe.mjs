#!/usr/bin/env node
// 価格ページ 多角調査プローブ（2026-07-25 追加）
//
// 目的：watch-list に登録できていない／sig=0 で空振りするサービスについて、
//       「どの角度なら価格が取れるか」を1コマンドで総当たりする。
//       2026-07-25 にこの手順で youtube-music（headless）と audible（トップページ）を復活させた。
//
// 使い方：
//   node scripts/price-watch/probe.mjs https://example.com/pricing
//   node scripts/price-watch/probe.mjs https://a.com/plans https://a.com/pricing   （複数URLを比較）
//   node scripts/price-watch/probe.mjs --headless https://example.com/pricing      （headlessのみ）
//   node scripts/price-watch/probe.mjs --ctx "600 円" https://example.com/x        （そのトークンの文脈を出す）
//
// 出力の読み方（詳細は ~/.claude/skills/subsuku-price-scout/SKILL.md Step 9）：
//   - 最終URL が入力と違う → リダイレクトされている。そこの数字は「別ページの値」かもしれない
//   - 本文に「セキュリティ検証」「Ray ID」→ Cloudflare系のbot拒否。回避策は取らない方針
//   - 本文に「ログイン」→ 匿名取得は不可。保留する
//   - 本文に「まだ提供していません」→ 地域未提供。正しい除外
//   - トークンが取れても必ず --ctx で文脈を見る（「600円オフ」を月額と誤認した実例あり）

const PRICE_TOK = /(?:[¥￥]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*\s?円|\$\s?\d[\d,]*(?:\.\d+)?)/g;
const POLITE_UA = 'Mozilla/5.0 (compatible; SabusukuYameta-PriceScout/0.1; +https://sabusuku-yameta.com)';

const argv = process.argv.slice(2);
const headlessOnly = argv.includes('--headless');
const ctxIdx = argv.indexOf('--ctx');
const ctxToken = ctxIdx >= 0 ? argv[ctxIdx + 1] : null;
const urls = argv.filter((a, i) => a.startsWith('http') && (ctxIdx < 0 || i !== ctxIdx + 1));

if (!urls.length) {
  console.error('URLを1つ以上指定してください。例: node scripts/price-watch/probe.mjs https://example.com/pricing');
  process.exitCode = 1;
}

function toText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

function tokens(text) {
  return [...new Set([...text.matchAll(PRICE_TOK)].map((m) => m[0].trim()))];
}

// 失敗の"種類"を見分ける（諦め方にも質がある）
function diagnose(text) {
  const t = text.slice(0, 1200);
  if (/セキュリティ検証|Ray ID|Checking your browser|Just a moment/i.test(t)) return 'bot拒否（Cloudflare系）→ 回避策は取らない。enabled:false で理由を記録';
  if (/ログインして開始|ログインが必要|Sign in to|ログイン/i.test(t) && tokens(text).length === 0) return '要ログイン → 匿名取得は不可。保留';
  if (/still working on launching|お住まいの国|ご利用いただけません/i.test(t)) return '地域未提供 → 正しい除外';
  if (/お探しのページ|見つかりません|not found/i.test(t)) return 'ソフト404 → URLが違う。別URLを試す';
  return null;
}

function showCtx(text, token) {
  let from = 0;
  let n = 0;
  while (n < 3) {
    const i = text.indexOf(token, from);
    if (i < 0) break;
    console.log('       文脈: ...' + text.slice(Math.max(0, i - 60), i + token.length + 50).trim() + '...');
    from = i + token.length;
    n++;
  }
  if (!n) console.log('       文脈: 「' + token + '」は本文に出現せず（script内などの可能性）');
}

async function probePlain(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(url, {
      headers: { 'user-agent': POLITE_UA, 'accept-language': 'ja,en;q=0.8' },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    const text = toText(await r.text());
    const toks = tokens(text);
    console.log('  [素のfetch] HTTP ' + r.status + ' / 最終URL ' + r.url);
    console.log('     価格トークン ' + toks.length + '件: ' + toks.slice(0, 10).join(' / '));
    const d = diagnose(text);
    if (d) console.log('     診断: ' + d);
    if (ctxToken) showCtx(text, ctxToken);
    return toks.length;
  } catch (e) {
    console.log('  [素のfetch] ERROR ' + e.message);
    return 0;
  } finally {
    clearTimeout(timer);
  }
}

async function probeHeadless(url) {
  let browser;
  try {
    const puppeteer = (await import('puppeteer')).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--lang=ja-JP'],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'accept-language': 'ja,en;q=0.8' });
    await page.setViewport({ width: 1280, height: 900 });
    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });
    await new Promise((s) => setTimeout(s, 2500));
    const body = await page.evaluate(() => (document.body ? document.body.innerText : ''));
    const toks = tokens(body);
    console.log('  [headless] HTTP ' + (resp ? resp.status() : '?') + ' / 最終URL ' + page.url());
    console.log('     本文 ' + body.length + '字 / 価格トークン ' + toks.length + '件: ' + toks.slice(0, 10).join(' / '));
    const d = diagnose(body);
    if (d) console.log('     診断: ' + d);
    if (ctxToken) showCtx(body.replace(/\s+/g, ' '), ctxToken);
    if (!toks.length && body.length) console.log('     本文冒頭: ' + body.slice(0, 140).replace(/\n/g, ' '));
    return toks.length;
  } catch (e) {
    console.log('  [headless] ERROR ' + e.message.slice(0, 120));
    return 0;
  } finally {
    if (browser) await browser.close();
  }
}

for (const url of urls) {
  console.log('\n===== ' + url + ' =====');
  let n = 0;
  if (!headlessOnly) n = await probePlain(url);
  // 素のfetchで取れなければ headless（コストの低い順・SKILL.md Step 9 の角度①）
  if (headlessOnly || n === 0) await probeHeadless(url);
  await new Promise((s) => setTimeout(s, 1500));
}

console.log('\n次の一手：取れたら watch-list.json に追加（headlessが必要なら "renderMode":"headless"）。');
console.log('取れなければ SKILL.md Step 9 の角度②〜⑤（別URL / ロケール / ヘルプ記事 / リダイレクト先確認）を試す。');
