// YouTube Data API v3 で Short を自動アップロード（resumable）。
// 認証: OAuth2 リフレッシュトークン（環境変数）。アカウント/初回OAuthは俊雄さんの原子操作。
//   YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN
// 安全既定:
//   YT_PRIVACY = private（既定）。確信が持てたら public へ（段階導入）。
//   カテゴリ 22(People & Blogs)。#Shorts を概要欄に付与（縦9:16・短尺で自動Short判定の補助）。
import { createReadStream, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { google } = require('googleapis');

export function getAuth() {
  const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN } = process.env;
  if (!YT_CLIENT_ID || !YT_CLIENT_SECRET || !YT_REFRESH_TOKEN) {
    throw new Error('YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN が未設定（.env）。初回OAuthは俊雄さんの原子操作。');
  }
  const o = new google.auth.OAuth2(YT_CLIENT_ID, YT_CLIENT_SECRET);
  o.setCredentials({ refresh_token: YT_REFRESH_TOKEN });
  return o;
}

// item: { title, description, tags } ; videoPath: mp4
export async function uploadShort(item, videoPath, { privacy } = {}) {
  const auth = getAuth();
  const youtube = google.youtube({ version: 'v3', auth });
  const privacyStatus = privacy || process.env.YT_PRIVACY || 'private';
  const desc = /#Shorts/i.test(item.description) ? item.description : `${item.description}\n#Shorts`;
  const path = resolve(videoPath);
  const fileSize = statSync(path).size;

  const res = await youtube.videos.insert(
    {
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: item.title.slice(0, 100),
          description: desc.slice(0, 4900),
          tags: item.tags,
          categoryId: process.env.YT_CATEGORY || '22',
        },
        status: { privacyStatus, selfDeclaredMadeForKids: false },
      },
      media: { body: createReadStream(path) },
    },
    { maxContentLength: Infinity, maxBodyLength: Infinity },
  );
  const id = res.data.id;
  return { id, url: `https://youtu.be/${id}`, privacyStatus, fileSize };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // 単体テスト: node upload-short.mjs <video.mp4> <title>
  const [, , video, title] = process.argv;
  if (!video) { console.error('使い方: node upload-short.mjs <video.mp4> <title>'); process.exit(1); }
  uploadShort({ title: title || 'test', description: 'test', tags: ['サブスク'] }, video)
    .then((r) => console.log('uploaded:', r))
    .catch((e) => { console.error(e.message); process.exit(1); });
}
