// 初回だけ実行：YouTube投稿用の OAuth リフレッシュトークンを取得して表示する（俊雄さんの原子操作）。
// 前提: Google Cloud で OAuth クライアント(デスクトップ/その他)を作成し、ID/SECRET を .env に置く。
//   YT_CLIENT_ID=... / YT_CLIENT_SECRET=...
// 実行: node get-token.mjs  → 表示されたURLをブラウザで開き、サブスクやめたのYouTubeアカウントで承認。
//   ローカルにリダイレクトされ、refresh_token が表示される → .env の YT_REFRESH_TOKEN= に貼る。
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { google } = require('googleapis');

const HERE = dirname(fileURLToPath(import.meta.url));
for (const line of (() => { try { return readFileSync(resolve(HERE, '.env'), 'utf-8').split('\n'); } catch { return []; } })()) {
  const t = line.trim(); if (!t || t.startsWith('#') || !t.includes('=')) continue;
  const i = t.indexOf('='); const k = t.slice(0, i).trim(); if (k && !process.env[k]) process.env[k] = t.slice(i + 1).trim();
}

const { YT_CLIENT_ID, YT_CLIENT_SECRET } = process.env;
if (!YT_CLIENT_ID || !YT_CLIENT_SECRET) { console.error('YT_CLIENT_ID / YT_CLIENT_SECRET を .env に設定してください。'); process.exit(1); }

const PORT = 5858;
const redirectUri = `http://localhost:${PORT}/oauth2callback`;
const oauth2 = new google.auth.OAuth2(YT_CLIENT_ID, YT_CLIENT_SECRET, redirectUri);
const scopes = ['https://www.googleapis.com/auth/youtube.upload'];
const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: scopes });

const server = createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) { res.writeHead(404); res.end(); return; }
  const code = new URL(req.url, redirectUri).searchParams.get('code');
  try {
    const { tokens } = await oauth2.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('取得成功。ターミナルに戻って refresh_token を .env に貼ってください。');
    console.log('\n===== これを .env に貼る =====');
    console.log(`YT_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('=============================\n');
    if (!tokens.refresh_token) console.log('※refresh_tokenが空。Googleアカウントのアプリ連携を一度解除して再実行してください。');
  } catch (e) {
    res.writeHead(500); res.end(String(e));
    console.error('トークン取得失敗:', e.message);
  } finally {
    server.close();
  }
});
server.listen(PORT, () => {
  console.log('次のURLをブラウザで開き、サブスクやめたのYouTubeアカウントで承認してください：\n');
  console.log(authUrl, '\n');
});
