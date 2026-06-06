#!/usr/bin/env node
/**
 * サブスクやめた — Threads リプライ担当（b2 安全版）
 * ------------------------------------------------------------
 * 自分の最近の投稿に付いたリプライ／メンションを取得し、種類で振り分ける。
 * 憲法 kokuchi-plan.md §2「広報運用ルール（リプライ運用）」に対応。
 *
 * 設計の絶対線（stress-test 2026-06-07 通過）:
 *  - 生成文を無承認で他人に送らない。どら猫キャラでの応戦は禁止（運営トーンのみ）。
 *  - 自動送信は「固定テンプレFAQ」だけ、かつ環境変数 THREADS_REPLY_AUTOSEND=1 のときだけ。
 *    既定は OFF＝すべて承認キュー(reply-queue.json)行き。
 *  - 批判・皮肉・実在企業名を含むものは必ず人承認（下書きを提示するだけ）。
 *  - 賞賛＝本来は「いいねのみ」だが Threads API は like 未対応のため現状は無反応＋記録。
 *  - 荒らし＝無反応＋フラグ。THREADS_REPLY_HIDE_SPAM=1 のときだけ hide_reply。
 *  - 認証情報が無ければ何もせず正常終了(exit 0)。新規npm依存ゼロ（global fetch）。
 *
 * 使い方:
 *   node scripts/threads/reply-handler.mjs --dry-run      # 取得＆分類だけ表示（送信・書込なし）
 *   node scripts/threads/reply-handler.mjs                # スキャン→いいね/テンプレ(許可時)＋承認キューに積む
 *   node scripts/threads/reply-handler.mjs --send-approved# reply-queue.json で approved:true のものだけ送信
 *
 * 認証情報は post.mjs と同じ（env 優先 / .credentials.json）。トークン延長は post.mjs（毎日実行）に任せる。
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(HERE, '.state.json'); // post.mjs が書く投稿履歴
const CRED_PATH = join(HERE, '.credentials.json');
const TEMPLATES_PATH = join(HERE, 'reply-templates.json');
const QUEUE_PATH = join(HERE, 'reply-queue.json');
const RSTATE_PATH = join(HERE, '.reply-state.json'); // 既読リプライID
const API_BASE = 'https://graph.threads.net/v1.0';

const DRY_RUN = process.argv.includes('--dry-run');
const SEND_APPROVED = process.argv.includes('--send-approved');
const AUTOSEND = process.env.THREADS_REPLY_AUTOSEND === '1'; // テンプレFAQの自動送信（既定OFF）
const HIDE_SPAM = process.env.THREADS_REPLY_HIDE_SPAM === '1';
const RECENT_POSTS = 12; // 直近何件の自投稿のリプライを見るか

function log(...a) {
  console.log(`[reply-handler ${new Date().toISOString()}]`, ...a);
}
function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    log(`⚠ ${path} の読込に失敗:`, e.message);
    return fallback;
  }
}
function writeJson(path, obj) {
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function loadCreds() {
  const envId = process.env.THREADS_USER_ID;
  const envToken = process.env.THREADS_ACCESS_TOKEN;
  if (envId && envToken) return { userId: envId, accessToken: envToken };
  const c = readJson(CRED_PATH, null);
  if (c && c.userId && c.accessToken) return c;
  return null;
}

/** 自分のユーザー名を取得（自分の返信＝2投目CTA等を除外するため）。失敗時は null。 */
async function fetchSelfUsername({ userId, accessToken }) {
  try {
    const url = `${API_BASE}/${userId}?fields=username&access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url);
    const data = await res.json();
    return res.ok && data.username ? data.username : null;
  } catch {
    return null;
  }
}

/** 投稿に付いたリプライを取得（公開リプライ）。失敗時は空配列。 */
async function fetchReplies({ accessToken }, postId) {
  try {
    const url = `${API_BASE}/${postId}/replies?fields=id,text,username,timestamp&access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      log(`⚠ replies取得失敗(${postId}): ${res.status} ${JSON.stringify(data)}`);
      return [];
    }
    return Array.isArray(data.data) ? data.data : [];
  } catch (e) {
    log(`⚠ replies取得例外(${postId}):`, e.message);
    return [];
  }
}

/** テキストを分類。最初にマッチしたカテゴリを返す（criticism/companyを賞賛より優先）。 */
function classify(text, templates) {
  const t = (text || '').toLowerCase();
  // 危険側を先に判定（賞賛キーワードが混じっていても批判・企業名を優先）
  const order = ['spam', 'criticism', 'company_mention', 'faq', 'praise'];
  for (const cat of order) {
    const def = templates.categories[cat];
    if (!def) continue;
    if (def.keywords.some((k) => t.includes(k.toLowerCase()))) {
      return { category: cat, action: def.action };
    }
  }
  return { category: 'ambiguous', action: 'draft_for_review' };
}

function pickTemplate(text, templates) {
  if ((text || '').includes('解約')) return templates.templates.faq_cancel;
  return templates.templates.faq_default;
}

/** Threads: 返信を1本公開（reply_to_id にぶら下げる）。 */
async function publishReply({ userId, accessToken }, text, replyToId) {
  const createParams = new URLSearchParams({ media_type: 'TEXT', text, access_token: accessToken, reply_to_id: replyToId });
  const createRes = await fetch(`${API_BASE}/${userId}/threads`, { method: 'POST', body: createParams });
  const created = await createRes.json();
  if (!createRes.ok || !created.id) throw new Error(`container作成失敗: ${createRes.status} ${JSON.stringify(created)}`);
  await new Promise((r) => setTimeout(r, 2000));
  const pubParams = new URLSearchParams({ creation_id: created.id, access_token: accessToken });
  const pubRes = await fetch(`${API_BASE}/${userId}/threads_publish`, { method: 'POST', body: pubParams });
  const published = await pubRes.json();
  if (!pubRes.ok || !published.id) throw new Error(`公開失敗: ${pubRes.status} ${JSON.stringify(published)}`);
  return published.id;
}

/** 荒らしリプライを非表示（任意・HIDE_SPAM=1時のみ）。 */
async function hideReply({ accessToken }, replyId) {
  try {
    const params = new URLSearchParams({ hide: 'true', access_token: accessToken });
    const res = await fetch(`${API_BASE}/${replyId}/manage_reply`, { method: 'POST', body: params });
    return res.ok;
  } catch {
    return false;
  }
}

// ---- 承認済み送信モード ----
async function runSendApproved(creds) {
  const queue = readJson(QUEUE_PATH, { pending: [], sent: [] });
  const toSend = queue.pending.filter((q) => q.approved === true && !q.sent);
  if (toSend.length === 0) {
    log('送信対象（approved:true）がありません。reply-queue.json を編集して approved:true にしてください。');
    return;
  }
  for (const q of toSend) {
    const text = (q.reply && q.reply.trim()) || q.suggestedReply; // 人が reply を上書きしていれば優先
    if (!text) {
      log(`スキップ（本文空）: ${q.replyId}`);
      continue;
    }
    if (DRY_RUN) {
      log(`[dry-run] 送信予定 → @${q.username}: ${text}`);
      continue;
    }
    try {
      const id = await publishReply(creds, text, q.replyId);
      q.sent = true;
      q.sentId = id;
      q.sentAt = new Date().toISOString();
      log(`✓ 送信: @${q.username} (${id})`);
    } catch (e) {
      log(`✗ 送信失敗(${q.replyId}):`, e.message);
    }
  }
  queue.sent = [...(queue.sent || []), ...queue.pending.filter((q) => q.sent)];
  queue.pending = queue.pending.filter((q) => !q.sent);
  if (!DRY_RUN) writeJson(QUEUE_PATH, queue);
}

// ---- スキャンモード ----
async function runScan(creds) {
  const templates = readJson(TEMPLATES_PATH, null);
  if (!templates) {
    log('reply-templates.json が読めません。中断。');
    return;
  }
  const postState = readJson(STATE_PATH, { history: [] });
  const postIds = (postState.history || []).slice(-RECENT_POSTS).map((h) => h.postId).filter(Boolean);
  if (postIds.length === 0) {
    log('自投稿の履歴(.state.json)がありません。まず post.mjs で投稿してから。');
    return;
  }
  const selfUser = await fetchSelfUsername(creds); // 自分の返信（2投目CTA等）を除外
  const rstate = readJson(RSTATE_PATH, { seen: [] });
  const seen = new Set(rstate.seen);
  const queue = readJson(QUEUE_PATH, { pending: [], sent: [] });

  const counts = { praise: 0, faq: 0, criticism: 0, company_mention: 0, spam: 0, ambiguous: 0, autosent: 0, queued: 0 };

  for (const postId of postIds) {
    const replies = await fetchReplies(creds, postId);
    for (const r of replies) {
      if (!r.id || seen.has(r.id)) continue;
      if (selfUser && r.username === selfUser) continue; // 自分の返信は無視
      const { category, action } = classify(r.text, templates);
      counts[category] = (counts[category] || 0) + 1;
      seen.add(r.id);

      if (action === 'none') {
        log(`praise（無反応＋記録）@${r.username}: ${r.text}`);
      } else if (action === 'flag') {
        log(`spam（フラグ）@${r.username}: ${r.text}`);
        if (HIDE_SPAM && !DRY_RUN) await hideReply(creds, r.id);
      } else if (action === 'template') {
        const tmpl = pickTemplate(r.text, templates);
        if (AUTOSEND && !DRY_RUN) {
          try {
            const id = await publishReply(creds, tmpl, r.id);
            counts.autosent++;
            log(`✓ FAQ自動返信 @${r.username} (${id})`);
          } catch (e) {
            log(`✗ FAQ自動返信失敗、キューへ回す:`, e.message);
            queue.pending.push(makeEntry(r, category, tmpl));
            counts.queued++;
          }
        } else {
          queue.pending.push(makeEntry(r, category, tmpl));
          counts.queued++;
          log(`FAQ（承認キューへ・AUTOSEND=${AUTOSEND}）@${r.username}: ${r.text}`);
        }
      } else {
        // draft_for_review（criticism / company_mention / ambiguous）＝必ず人承認
        queue.pending.push(makeEntry(r, category, suggestDraft(category)));
        counts.queued++;
        log(`要承認(${category})@${r.username}: ${r.text}`);
      }
    }
  }

  rstate.seen = [...seen].slice(-1000);
  if (!DRY_RUN) {
    writeJson(RSTATE_PATH, rstate);
    writeJson(QUEUE_PATH, queue);
  }
  log(`完了: ${JSON.stringify(counts)} / 承認キュー pending=${queue.pending.length}（DRY_RUN=${DRY_RUN}）`);
}

function makeEntry(r, category, suggestedReply) {
  return {
    replyId: r.id,
    username: r.username || '',
    text: r.text || '',
    category,
    suggestedReply, // 叩き台。人が reply で上書き可
    reply: '', // 俊雄さんが最終文をここに書いてもよい
    approved: false,
    sent: false,
    ts: new Date().toISOString(),
  };
}

function suggestDraft(category) {
  if (category === 'criticism')
    return 'コメントありがとうございます。不快に感じさせていたら申し訳ありません。ご指摘の点、運営として受け止めます。'; // 運営トーン・叩き台
  if (category === 'company_mention')
    return 'コメントありがとうございます。特定サービスの是非ではなく「自動更新などの仕組み」に注意を向けたい趣旨です。'; // 名指し回避の叩き台
  return 'コメントありがとうございます。'; // ambiguous は最小限。人が判断
}

async function main() {
  const templatesExist = existsSync(TEMPLATES_PATH);
  if (!templatesExist) log('⚠ reply-templates.json が無い。');

  const creds = loadCreds();
  if (!creds) {
    log('認証情報が未設定のため何もしません（正常終了）。post.mjs と同じ設定が必要。');
    process.exit(0);
  }

  if (SEND_APPROVED) {
    await runSendApproved(creds);
  } else {
    await runScan(creds);
  }
}

main();
