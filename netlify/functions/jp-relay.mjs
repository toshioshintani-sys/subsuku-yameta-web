// 東京の中継所（jp-relay）— 日本から接続しないと日本の価格を出さない公式料金ページを、東京から読む（2026-10-17）
//
// なぜ要るか：
//   無人タスクを動かす claude.ai のクラウドは米国から接続する。YouTube・Google One・Dropbox などは
//   接続元の国で価格の通貨を変えるので、米国からは日本円が取れない（geo-probe の総当たりで11サービス）。
//   Netlify の関数は動かす地域を選べる（Pro は関数ごとに設定可）。この関数を東京（nrt）で動かせば、
//   相手からは日本からの接続に見える。VPN 業者・外部の有料プロキシは使わない（外部への支払いゼロ）。
//
// 守り（誰でも使える中継にしない）：
//   - 呼び出し側が指定できるのは「サービスの id」だけ。URL・ヘッダー・本文・Cookie は受け取らない。
//   - 読みに行くのは scripts/price-watch/relay-targets.json に載せた公式料金ページだけ（id → url）。
//     リストはビルド時にこの関数へ同梱される（実行時に外から書き換えられない）。
//   - GET だけ。こちらから Cookie・認証情報は送らない。返すのは公開ページの中身だけ。
//
// 使い方：/.netlify/functions/jp-relay?id=<relay-targets.json の id>
//   応答は常に 200。相手の HTTP ステータスは x-relay-status、動いた地域は x-relay-region。
// 自己診断：/.netlify/functions/jp-relay?whoami=1 … 動いた地域と、外から見た接続元の国・中継できる id

import relayList from '../../scripts/price-watch/relay-targets.json' with { type: 'json' };

const UA_BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const TARGETS = new Map();
for (const [id, r] of Object.entries(relayList.targets || {})) {
  if (r && typeof r.url === 'string' && r.url.startsWith('https://')) TARGETS.set(id, { url: r.url, ua: r.userAgent || UA_BROWSER });
}

export default async (req, context) => {
  const q = new URL(req.url).searchParams;
  const region = (context.server && context.server.region) || '?';
  const base = { 'x-relay-region': region, 'cache-control': 'no-store' };

  if (q.get('whoami')) {
    let ip;
    try {
      ip = await (await fetch('https://ipinfo.io/json', { signal: AbortSignal.timeout(10000) })).json();
    } catch (e) {
      ip = { error: String(e.message || e) };
    }
    return Response.json({ region, egress: { country: ip.country, city: ip.city, org: ip.org, error: ip.error }, ids: [...TARGETS.keys()].sort() }, { headers: base });
  }

  const t = TARGETS.get(q.get('id') || '');
  if (!t) return new Response('unknown id', { status: 404, headers: base });

  let res;
  try {
    res = await fetch(t.url, {
      headers: { 'User-Agent': t.ua, 'Accept-Language': 'ja-JP,ja;q=0.9', Accept: 'text/html,*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
    });
  } catch (e) {
    return new Response(`upstream error: ${e.message || e}`, { status: 502, headers: base });
  }
  return new Response(await res.text(), {
    status: 200,
    headers: { ...base, 'content-type': 'text/plain; charset=utf-8', 'x-relay-status': String(res.status), 'x-relay-url': res.url || t.url },
  });
};

// 東京（nrt）で動かす。接続元を日本にすることがこの関数の存在理由（Netlify Pro は関数ごとに地域を選べる）。
export const config = { region: 'nrt' };
