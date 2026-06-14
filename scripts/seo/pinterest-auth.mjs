// Pinterest OAuth トークン取得の補助。
// 認可URLの生成（引数なし）と、認可コード→アクセストークン交換（codeを渡す）を行う。
//
// 手順:
//  0) developers.pinterest.com でアプリ作成。Redirect URI に下記 REDIRECT を登録（既定: サイトトップ）。
//     App ID と App secret を控える。
//  1) 認可URLを表示:
//       $env:PINTEREST_APP_ID="xxx"; node scripts/seo/pinterest-auth.mjs
//     表示URLをブラウザで開き「許可」→ リダイレクト先URLの ?code=XXXX を控える。
//  2) トークン交換:
//       $env:PINTEREST_APP_ID="xxx"; $env:PINTEREST_APP_SECRET="yyy"; node scripts/seo/pinterest-auth.mjs <code>
//     出力の access_token を PINTEREST_TOKEN にセットして post-pinterest.mjs を実行。
const SCOPES = 'boards:read,boards:write,pins:read,pins:write';
const REDIRECT = process.env.PINTEREST_REDIRECT || 'https://sabusuku.netlify.app/';
const appId = process.env.PINTEREST_APP_ID;
const secret = process.env.PINTEREST_APP_SECRET;
const code = process.argv[2];

if (!appId) {
  console.error('PINTEREST_APP_ID を set してください（developers.pinterest.com のアプリ）。');
  process.exit(1);
}

if (!code) {
  const url =
    `https://www.pinterest.com/oauth/?client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT)}` +
    `&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
  console.log('① ブラウザで開いて「許可」→ リダイレクトURLの ?code= を控える:\n');
  console.log(url);
  console.log(`\n（Redirect URI は ${REDIRECT}。アプリ設定の Redirect URIs に登録しておくこと）`);
  process.exit(0);
}

if (!secret) {
  console.error('PINTEREST_APP_SECRET を set してください（トークン交換に必要）。');
  process.exit(1);
}

const basic = Buffer.from(`${appId}:${secret}`).toString('base64');
const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
  method: 'POST',
  headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
});
const text = await res.text();
if (!res.ok) {
  console.error(`トークン交換失敗 HTTP ${res.status}: ${text.slice(0, 400)}`);
  process.exit(1);
}
const j = JSON.parse(text);
console.log(JSON.stringify(j, null, 2));
if (j.access_token) {
  console.log('\n→ この access_token を PINTEREST_TOKEN にセットして:');
  console.log('   $env:PINTEREST_TOKEN="' + j.access_token + '"; node scripts/seo/post-pinterest.mjs --dry-run');
}
