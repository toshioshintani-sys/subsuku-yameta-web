#!/usr/bin/env node
/**
 * サブスクやめた — Threads 自動投稿スクリプト
 * ------------------------------------------------------------
 * queue.json のテキスト投稿を1回の実行で1本だけ投稿し、続けて
 * 「リンク入りの返信(2投目)」をぶら下げる。投稿後は state を進め、
 * 次回は次のネタを出す（最後まで行ったら先頭へ循環）。
 *
 * 設計方針（重要）:
 *  - 認証情報が無ければ「何もせず正常終了(exit 0)」する。
 *    → 俊雄さんがトークンを設定する前にスケジュール実行されても
 *      エラーで騒がない（AdSlot が client 未設定なら null を返すのと同じ思想）。
 *  - 新規 npm 依存ゼロ（Node 18+ の global fetch のみ）。
 *  - 画像は扱わない（テキストのみ＝完全自動化できる範囲に限定）。
 *    4コマ画像は image_url(公開URL)が要るため別途。docs/THREADS_AUTOPOST_SETUP.md 参照。
 *
 * 使い方:
 *   node scripts/threads/post.mjs --dry-run   # 投稿せず「次に何を出すか」だけ表示
 *   node scripts/threads/post.mjs             # 実投稿（要・認証情報）
 *
 * 認証情報（どちらでも可・env 優先）:
 *   1) 環境変数 THREADS_USER_ID / THREADS_ACCESS_TOKEN
 *   2) scripts/threads/.credentials.json  {"userId":"...","accessToken":"..."}  ※gitignore済
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const QUEUE_PATH = join(HERE, 'queue.json');
const STATE_PATH = join(HERE, '.state.json');
const CRED_PATH = join(HERE, '.credentials.json');
const API_BASE = 'https://graph.threads.net/v1.0';

const DRY_RUN = process.argv.includes('--dry-run');

function log(...a) {
  console.log(`[threads-poster ${new Date().toISOString()}]`, ...a);
}

// 返り値: { creds: {userId, accessToken, expiresAt?}|null, fromFile: boolean }
// fromFile=true のときだけトークン自動延長で .credentials.json を書き戻せる
function loadCreds() {
  const envId = process.env.THREADS_USER_ID;
  const envToken = process.env.THREADS_ACCESS_TOKEN;
  if (envId && envToken) return { creds: { userId: envId, accessToken: envToken }, fromFile: false };
  if (existsSync(CRED_PATH)) {
    try {
      const c = JSON.parse(readFileSync(CRED_PATH, 'utf8'));
      if (c.userId && c.accessToken) return { creds: c, fromFile: true };
    } catch (e) {
      log('⚠ .credentials.json の読込に失敗:', e.message);
    }
  }
  return { creds: null, fromFile: false };
}

/**
 * トークンが失効間近(残り≤10日)または期限不明なら refresh_access_token で延長し、
 * .credentials.json を {userId, accessToken, expiresAt, refreshedAt} で更新する。
 * - 失敗してもその日の投稿は止めない（現行トークンで続行）。
 * - env 由来トークンは書き戻せないので延長しない（残量が分かれば警告のみ）。
 * - Threads 仕様：取得から24h未満は延長不可（その場合は失敗扱いで継続）。~50日ごとに延長で半永久に生きる。
 */
async function ensureFreshToken(creds, fromFile) {
  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const expMs = creds.expiresAt ? new Date(creds.expiresAt).getTime() : NaN;
  const remainingDays = Number.isFinite(expMs) ? (expMs - now) / DAY : NaN;

  // 期限が分かっていて10日より多く残っていれば何もしない
  if (Number.isFinite(remainingDays) && remainingDays > 10) return creds;

  if (!fromFile) {
    if (Number.isFinite(remainingDays) && remainingDays <= 10) {
      log(`⚠ トークン残り約${remainingDays.toFixed(1)}日。env 由来のため自動延長不可。手動更新を。`);
    }
    return creds;
  }

  log(`トークン延長を試行（残り: ${Number.isFinite(remainingDays) ? remainingDays.toFixed(1) + '日' : '不明'}）`);
  try {
    const url = `${API_BASE}/refresh_access_token?grant_type=th_refresh_token&access_token=${encodeURIComponent(creds.accessToken)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !data.access_token) {
      throw new Error(`${res.status} ${JSON.stringify(data)}`);
    }
    const expiresIn = Number(data.expires_in) || 60 * 24 * 60 * 60; // 秒（既定60日）
    const updated = {
      userId: creds.userId,
      accessToken: data.access_token,
      expiresAt: new Date(now + expiresIn * 1000).toISOString(),
      refreshedAt: new Date(now).toISOString(),
    };
    writeFileSync(CRED_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf8');
    log(`✓ トークン延長成功（次回失効目安: ${updated.expiresAt}）`);
    return updated;
  } catch (e) {
    log('⚠ トークン延長に失敗（投稿は現行トークンで継続）:', e.message);
    log('  ※取得から24h未満は延長不可。完全失効後は再生成（方法B）。詳細 docs/THREADS_OPERATION_HANDOFF.md §4。');
    return creds;
  }
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

function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

/** Threads: コンテナ作成 → 公開 の2段。返り値は公開された投稿ID。 */
async function publishText({ userId, accessToken }, text, replyToId) {
  const createParams = new URLSearchParams({
    media_type: 'TEXT',
    text,
    access_token: accessToken,
  });
  if (replyToId) createParams.set('reply_to_id', replyToId);

  const createRes = await fetch(`${API_BASE}/${userId}/threads`, {
    method: 'POST',
    body: createParams,
  });
  const created = await createRes.json();
  if (!createRes.ok || !created.id) {
    throw new Error(`container作成失敗: ${createRes.status} ${JSON.stringify(created)}`);
  }

  // テキストは即時でよいが、Meta推奨に従い軽く待つ
  await new Promise((r) => setTimeout(r, 2000));

  const pubParams = new URLSearchParams({
    creation_id: created.id,
    access_token: accessToken,
  });
  const pubRes = await fetch(`${API_BASE}/${userId}/threads_publish`, {
    method: 'POST',
    body: pubParams,
  });
  const published = await pubRes.json();
  if (!pubRes.ok || !published.id) {
    throw new Error(`公開失敗: ${pubRes.status} ${JSON.stringify(published)}`);
  }
  return published.id;
}

async function main() {
  const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  const items = queue.items || [];
  if (items.length === 0) {
    log('キューが空です。queue.json を確認してください。');
    process.exit(0);
  }

  const state = loadState();
  const idx = ((state.nextIndex % items.length) + items.length) % items.length;
  const item = items[idx];
  const body = item.tag ? `${item.body}\n\n${item.tag}` : item.body;

  log(`今回のネタ: ${item.id}（${idx + 1}/${items.length}）`);

  const { creds: loadedCreds, fromFile } = loadCreds();
  let creds = loadedCreds;

  if (DRY_RUN || !creds) {
    if (!creds && !DRY_RUN) {
      log('認証情報が未設定のため投稿しません（正常終了）。設定方法は docs/THREADS_AUTOPOST_SETUP.md を参照。');
    }
    log('--- 1投目（本文）---\n' + body);
    log('--- 2投目（返信・リンク）---\n' + item.reply);
    // dry-run / 未設定では state を進めない・トークン延長もしない（副作用なし）
    process.exit(0);
  }

  // 本番のみ：トークンが失効間近なら自動延長（失敗しても現行トークンで投稿は継続）
  creds = await ensureFreshToken(creds, fromFile);

  try {
    const postId = await publishText(creds, body);
    log(`✓ 1投目を公開: ${postId}`);
    let replyId = null;
    if (item.reply) {
      replyId = await publishText(creds, item.reply, postId);
      log(`✓ 2投目(返信)を公開: ${replyId}`);
    }
    state.nextIndex = idx + 1;
    state.history = (state.history || []).slice(-50);
    state.history.push({ ts: new Date().toISOString(), id: item.id, postId, replyId });
    saveState(state);
    log('state を更新。次回は次のネタを出します。');
  } catch (e) {
    log('✗ 投稿に失敗:', e.message);
    log('  トークン失効(60日)・権限不足・レート上限などが原因の可能性。SETUP の「トークン更新」を確認。');
    process.exit(1);
  }
}

main();
