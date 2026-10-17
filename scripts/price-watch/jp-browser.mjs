// jp-browser.mjs — 米国のクラウドから「日本の価格」を読むための取り方（2026-10-17）
// =============================================================================
// claude.ai のクラウドは米国から接続する。国で価格の通貨を変えるサイトは、そのままでは米ドルを出す。
// サービスごとに国の決め方が違うので、watch-list.json の "cloud" に取り方を書き、ここで実行する。
// price-watch.mjs と reconcile.mjs が SUBSUKU_CLOUD=1 の時だけ使う（PC＝日本では使わない）。
//
// 取り方（2026-10-17 クラウドで実測して全て日本円が一致したもの）：
//   1) "via": "relay"
//      東京の中継所（netlify/functions/jp-relay.mjs・Netlify の東京リージョン）にページを読ませる。
//      サーバー側で接続元の国を見て日本円を埋め込むサイト用（YouTube・Google One・Dropbox・Notion 等）。
//   2) "jsonCurrency": "JPY"
//      ページに全通貨の価格表が JSON で埋め込まれているサイト用（Evernote）。"JPY":{..."price":N} の N だけを拾う。
//   3) "geo": {...}（クラウドのブラウザで描く。ページが自分で国を判定するサイト用）
//      - respond      : サイト自身の国判定 API への答えを日本にする（Figma の /api/geoip）
//      - rewrite      : 国・通貨が URL に入る通信を日本向けに書き換える（ChatGPT の configs/US→JP、Vimeo に currency=JPY）
//      - documentReplace : ページ本体の初期値の国を日本にする（DeepL の userCountry）
//      - documentFromRelay: ページ本体だけ東京の中継所から取り、描くのは手元のブラウザ（Google AI プラン）
//   いずれも「サイトが公開している日本向けの料金表」を表示させるだけで、ログインや購入の画面には触れない。
// =============================================================================

export const RELAY = process.env.SUBSUKU_RELAY_URL || 'https://sabusuku-yameta.com/.netlify/functions/jp-relay';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const AD_BLOCK = /googlesyndication|doubleclick|google-analytics|googletagmanager|\/gtag\/|adservice\.google|pagead2|adsbygoogle/i;

/** 東京の中継所経由で読む（中継所が読めるのは scripts/price-watch/relay-targets.json の id だけ）。 */
export async function fetchRelay(id, timeoutMs = 30000) {
  const res = await fetch(`${RELAY}?id=${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(Math.max(timeoutMs, 30000)) });
  if (!res.ok) throw new Error(`relay HTTP ${res.status}`);
  const up = res.headers.get('x-relay-status');
  if (up !== '200') throw new Error(`relay upstream HTTP ${up}（${res.headers.get('x-relay-region') || '?'}）`);
  return res.text();
}

/**
 * 埋め込み JSON の通貨別価格表から、指定通貨の "price" だけを拾って「¥1,100 ¥7,099 …」の文字列にする。
 * JSON がエスケープされて HTML に入っている形（\"JPY\":{...}）にも対応する。
 */
export function extractJsonCurrency(raw, currency) {
  const re = new RegExp(`\\\\?"${currency}\\\\?"\\s*:\\s*\\{([^{}]*)\\}`, 'g');
  const nums = new Set();
  for (const m of raw.matchAll(re)) {
    for (const p of m[1].matchAll(/\\?"price\\?"\s*:\s*(\d+(?:\.\d+)?)/g)) nums.add(Number(p[1]));
  }
  const sym = currency === 'JPY' ? '¥' : `${currency} `;
  return [...nums].sort((a, b) => a - b).map((n) => `<div>${sym}${n.toLocaleString('en-US')}</div>`).join('\n');
}

/** "cloud.geo" の取り方で、クラウドのブラウザに日本向けの料金表を描かせて HTML を返す。 */
export async function fetchHeadlessGeo(browser, w, timeoutMs) {
  const g = w.geo || {};
  const compile = (list) => (list || []).map((r) => ({ ...r, re: new RegExp(r.match || r.from) }));
  const respond = compile(g.respond);
  const rewrite = compile(g.rewrite);
  const docReplace = (g.documentReplace || []).map((r) => ({ re: new RegExp(r.from, 'g'), to: r.to }));
  const swapDocument = !!g.documentFromRelay || docReplace.length > 0;

  const page = await browser.newPage();
  await page.setUserAgent(UA);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'ja-JP,ja;q=0.9' });
  await page.emulateTimezone('Asia/Tokyo');
  await page.setRequestInterception(true);
  let documentDone = false;
  page.on('request', async (req) => {
    try {
      const u = req.url();
      if (AD_BLOCK.test(u)) return await req.abort();
      if (swapDocument && !documentDone && req.isNavigationRequest() && req.frame() === page.mainFrame()) {
        documentDone = true;
        let html = g.documentFromRelay
          ? await fetchRelay(w.id, timeoutMs)
          : await (await fetch(u, { headers: { 'User-Agent': UA, 'Accept-Language': 'ja-JP,ja;q=0.9' }, signal: AbortSignal.timeout(timeoutMs) })).text();
        for (const r of docReplace) html = html.replace(r.re, r.to);
        return await req.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
      }
      for (const r of respond) {
        if (r.re.test(u)) return await req.respond({ status: 200, contentType: r.contentType || 'application/json', body: r.body });
      }
      for (const r of rewrite) {
        if (!r.re.test(u)) continue;
        const nu = u.replace(new RegExp(r.from), r.to);
        if (nu !== u) return await req.continue({ url: nu });
      }
      await req.continue();
    } catch {
      try { await req.continue(); } catch { /* 既に処理済みの要求 */ }
    }
  });
  // 日本円が画面に出るまで待つ。出なければ1回だけ読み込み直す（2026-10-17：ChatGPT が描画途中で取れて
  // 価格が全部「消えた」誤検知になった）。それでも出なければ、出ていないまま返す（検知側が判断する）。
  const yenShown = () => page
    .waitForFunction(() => document.body && /[¥￥]\s?\d/.test(document.body.innerText), { timeout: 15000 })
    .then(() => true, () => false);
  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      documentDone = false;
      await page.goto(w.url, { waitUntil: 'networkidle2', timeout: Math.max(timeoutMs, 45000) }).catch(() => {});
      if (await yenShown()) break;
    }
    // 国の判定 → 通貨の切り替えは描画のあとに走るので、少し待つ
    await new Promise((r) => setTimeout(r, 2500));
    return await page.evaluate(() => document.documentElement.outerHTML);
  } finally {
    await page.close();
  }
}
