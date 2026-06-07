#!/usr/bin/env node
/**
 * サブスクやめた — 悪態どら猫4コマ「画像」自動投稿
 * ------------------------------------------------------------
 * post.mjs（テキスト）の画像版。4koma-queue.json の1本を画像付きで投稿し、
 * 2投目（返信）に3段ファネルのリンク（記事/診断/棚卸し・utm_content付き）をぶら下げる。
 * 画像は GitHub raw URL でホスト（repo public 前提・docs/threads-4koma/ 配下を参照）。
 *
 * 設計方針（post.mjs と同じ思想）:
 *  - 認証情報が無ければ何もせず正常終了(exit 0)。
 *  - 画像コンテナ作成に失敗したら「ログして exit 1」＝壊れた投稿でスパムしない。
 *  - 新規npm依存ゼロ（global fetch）。トークン延長は post.mjs（毎日実行）に任せる。
 *
 * 使い方:
 *   node scripts/threads/post-4koma.mjs --dry-run   # 投稿せず「次に何を出すか」を表示
 *   node scripts/threads/post-4koma.mjs             # 実投稿（要・認証情報）
 *
 * 認証情報は post.mjs と共通（env 優先 / .credentials.json）。
 *
 * 🟢 運用（憲法・kokuchi-plan §2 広報運用ルール・2026-06-07 俊雄さん指示で改訂）:
 *   4コマは「原則 自動スケジュール投稿」。タスク Subsuku_Threads_4koma_1200（毎日12:00・1本）。
 *   安全装置は捨てない（kill-switch は"禁止"でなく"緊急停止"に格上げ）:
 *     ① reply-handler でコメントを監視（批判・炎上シグナルは承認キューへ）
 *     ② 炎上時の緊急停止: Disable-ScheduledTask -TaskName Subsuku_Threads_4koma_1200
 *   投稿失敗時は state を進めず exit（壊れた投稿でスパムしない）。
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const QUEUE_PATH = join(HERE, '4koma-queue.json');
const STATE_PATH = join(HERE, '.4koma-state.json');
const CRED_PATH = join(HERE, '.credentials.json');
const API_BASE = 'https://graph.threads.net/v1.0';

const DRY_RUN = process.argv.includes('--dry-run');

function log(...a) {
  console.log(`[4koma-poster ${new Date().toISOString()}]`, ...a);
}

function loadCreds() {
  const envId = process.env.THREADS_USER_ID;
  const envToken = process.env.THREADS_ACCESS_TOKEN;
  if (envId && envToken) return { userId: envId, accessToken: envToken };
  if (existsSync(CRED_PATH)) {
    try {
      const c = JSON.parse(readFileSync(CRED_PATH, 'utf8'));
      if (c.userId && c.accessToken) return { userId: c.userId, accessToken: c.accessToken };
    } catch (e) {
      log('⚠ .credentials.json 読込失敗:', e.message);
    }
  }
  return null;
}

function loadState() {
  if (existsSync(STATE_PATH)) {
    try {
      return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    } catch {
      /* fallthrough */
    }
  }
  return { nextIndex: 0, history: [] };
}
function saveState(s) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2) + '\n', 'utf8');
}

/** 画像コンテナ作成 → 公開。返り値は公開された投稿ID。 */
async function publishImage({ userId, accessToken }, imageUrl, text) {
  const createParams = new URLSearchParams({
    media_type: 'IMAGE',
    image_url: imageUrl,
    text,
    access_token: accessToken,
  });
  const createRes = await fetch(`${API_BASE}/${userId}/threads`, { method: 'POST', body: createParams });
  const created = await createRes.json();
  if (!createRes.ok || !created.id) {
    throw new Error(`画像container作成失敗: ${createRes.status} ${JSON.stringify(created)}`);
  }
  // 画像は取得・処理に時間がかかるため少し長めに待つ（Meta推奨）
  await new Promise((r) => setTimeout(r, 5000));
  const pubParams = new URLSearchParams({ creation_id: created.id, access_token: accessToken });
  const pubRes = await fetch(`${API_BASE}/${userId}/threads_publish`, { method: 'POST', body: pubParams });
  const published = await pubRes.json();
  if (!pubRes.ok || !published.id) {
    throw new Error(`公開失敗: ${pubRes.status} ${JSON.stringify(published)}`);
  }
  return published.id;
}

/** テキスト返信（2投目）。 */
async function publishReply({ userId, accessToken }, text, replyToId) {
  const createParams = new URLSearchParams({ media_type: 'TEXT', text, access_token: accessToken, reply_to_id: replyToId });
  const createRes = await fetch(`${API_BASE}/${userId}/threads`, { method: 'POST', body: createParams });
  const created = await createRes.json();
  if (!createRes.ok || !created.id) throw new Error(`返信container作成失敗: ${createRes.status} ${JSON.stringify(created)}`);
  await new Promise((r) => setTimeout(r, 2000));
  const pubParams = new URLSearchParams({ creation_id: created.id, access_token: accessToken });
  const pubRes = await fetch(`${API_BASE}/${userId}/threads_publish`, { method: 'POST', body: pubParams });
  const published = await pubRes.json();
  if (!pubRes.ok || !published.id) throw new Error(`返信公開失敗: ${pubRes.status} ${JSON.stringify(published)}`);
  return published.id;
}

async function main() {
  const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  const items = queue.items || [];
  if (items.length === 0) {
    log('キューが空です。');
    process.exit(0);
  }
  const state = loadState();
  const idx = ((state.nextIndex % items.length) + items.length) % items.length;
  const item = items[idx];
  const body = item.tag ? `${item.body}\n\n${item.tag}` : item.body;
  const imageUrl = queue.rawBase + encodeURIComponent(item.file);

  log(`今回の4コマ: No${item.no}（${idx + 1}/${items.length}）`);
  log('画像URL: ' + imageUrl);

  const creds = loadCreds();
  if (DRY_RUN || !creds) {
    if (!creds && !DRY_RUN) log('認証情報が未設定のため投稿しません（正常終了）。');
    log('--- 1投目（画像＋本文）---\n' + body);
    log('--- 2投目（返信）---\n' + item.reply);
    process.exit(0);
  }

  try {
    const postId = await publishImage(creds, imageUrl, body);
    log(`✓ 1投目(画像)を公開: ${postId}`);
    let replyId = null;
    if (item.reply) {
      replyId = await publishReply(creds, item.reply, postId);
      log(`✓ 2投目(返信)を公開: ${replyId}`);
    }
    state.nextIndex = idx + 1;
    state.history = (state.history || []).slice(-50);
    state.history.push({ ts: new Date().toISOString(), no: item.no, postId, replyId });
    saveState(state);
    log('state を更新。次回は次の4コマを出します。');
  } catch (e) {
    log('✗ 投稿に失敗:', e.message);
    log('  画像URLが公開アクセス不可（repo private / raw URL誤り）・トークン失効・レート上限などが原因の可能性。');
    log('  ※壊れた投稿でスパムしないため state は進めません。原因解消後に再実行。');
    process.exit(1);
  }
}

main();
