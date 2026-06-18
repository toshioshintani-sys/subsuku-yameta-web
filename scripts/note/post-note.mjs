// note.com API で転載記事を投稿（ライフオラクル gachijin/note_client.py 方式を移植）。
//
// フロー（note仕様）: POST /api/v1/text_notes（作成・タイトル）→ POST /image_upload/note_eyecatch
//   （アイキャッチ1280x670）→ PUT /api/v1/text_notes/{id}（本文free_body＋eye_catch_key＋公開状態）。
//   ※ note は「本文入りの下書き」を作れない（PUTは reserved/published でしか通らない）ため、
//      公開（published）か 公開予約（reserved＋publish_at）で本文が確定する。
// リンク: markdownToNoteHtml で [text](url) → <a href>（アンカーテキスト表示・URL非表示）。
// 認証: Cookie _note_session_v5 ＝ env NOTE_SESSION_TOKEN（.env 可）。
//
// 事前: node scripts/note/gen-note-eyecatch.mjs <slug|all>  でアイキャッチPNGを生成しておく。
// 使い方:
//   node scripts/note/post-note.mjs <slug> --dry-run         # 変換だけ確認
//   node scripts/note/post-note.mjs <slug> --schedule 60     # 60分後に公開予約（本文＋画像入り・確認できる）
//   node scripts/note/post-note.mjs <slug> --publish         # 今すぐ公開
//   node scripts/note/post-note.mjs all --schedule 1440      # 全21本を24時間後予約 など
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SYND = resolve(ROOT, 'docs/syndication');
const EYE = resolve(SYND, 'note/eyecatch');

function loadEnv() {
  const f = resolve(ROOT, '.env');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const k = t.slice(0, i).trim();
    if (k && !process.env[k]) process.env[k] = t.slice(i + 1).trim();
  }
}
loadEnv();

// ---- Markdown → note HTML（ライフオラクル markdown.py 移植・画像は除去）----
function processInline(text) {
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => `<a href="${u}">${t}</a>`);
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
}
function linesToHtml(lines) {
  const parts = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^!\[/.test(line.trim())) { i++; continue; }
    if (line.startsWith('### ')) { parts.push(`<h3>${processInline(line.slice(4).trim())}</h3>`); i++; continue; }
    if (line.startsWith('## ')) { parts.push(`<h2>${processInline(line.slice(3).trim())}</h2>`); i++; continue; }
    if (line.startsWith('# ')) { parts.push(`<h2>${processInline(line.slice(2).trim())}</h2>`); i++; continue; }
    if (/^---+$/.test(line.trim())) { parts.push('<hr>'); i++; continue; }
    if (line.startsWith('> ')) {
      const block = [];
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) { block.push(lines[i].startsWith('> ') ? lines[i].slice(2) : ''); i++; }
      parts.push(`<blockquote>${linesToHtml(block)}</blockquote>`);
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) { items.push(processInline(lines[i].slice(2).trim())); i++; }
      parts.push('<ul>' + items.map((x) => `<li>${x}</li>`).join('') + '</ul>');
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(processInline(lines[i].replace(/^\d+\.\s*/, '').trim())); i++; }
      parts.push('<ol>' + items.map((x) => `<li>${x}</li>`).join('') + '</ol>');
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() && !(lines[i].startsWith('#') || lines[i].startsWith('> ') || lines[i].startsWith('- ') || lines[i].startsWith('* ') || /^\d+\.\s/.test(lines[i]) || /^!\[/.test(lines[i].trim()) || /^---+$/.test(lines[i].trim()))) { para.push(lines[i]); i++; }
    if (para.length) parts.push('<p>' + para.map(processInline).join('<br>') + '</p>');
    else i++;
  }
  return parts.join('\n');
}
const markdownToNoteHtml = (md) => linesToHtml(md.split('\n'));
function titleFromMd(md) { const m = md.match(/\[サブスクやめた[｜|](.+?)\]\(/); return m ? m[1].trim() : null; }

// JST ISO（note の publish_at 用）
function jstIso(date) {
  const j = new Date(date.getTime() + 9 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${j.getUTCFullYear()}-${p(j.getUTCMonth() + 1)}-${p(j.getUTCDate())}T${p(j.getUTCHours())}:${p(j.getUTCMinutes())}:${p(j.getUTCSeconds())}+09:00`;
}

// ---- note API ----
const TOKEN = process.env.NOTE_SESSION_TOKEN;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const HEADERS = { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json', Accept: 'application/json, text/plain, */*', 'User-Agent': UA, Referer: 'https://note.com/notes/new', Origin: 'https://note.com', Cookie: `_note_session_v5=${TOKEN}` };

function notePayload(name, freeBody, { status = 'draft', publishAt = null, eyeCatchKey = null } = {}) {
  const p = { author_ids: [], body_length: freeBody.length, disable_comment: false, free_body: freeBody, hashtags: [], image_keys: [], name, price: 0, send_notifications_flag: false, separator: null, status };
  if (publishAt) p.publish_at = publishAt;
  if (eyeCatchKey) p.eye_catch_key = eyeCatchKey;
  return p;
}
async function createDraft(name, freeBody) {
  const res = await fetch('https://note.com/api/v1/text_notes', { method: 'POST', headers: HEADERS, body: JSON.stringify(notePayload(name, freeBody)) });
  const text = await res.text();
  if (!res.ok) throw new Error(`draft作成失敗 ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text).data || JSON.parse(text);
}
async function uploadEyecatch(noteId, pngBytes) {
  const fd = new FormData();
  fd.append('note_id', String(noteId));
  fd.append('file', new Blob([pngBytes], { type: 'image/png' }), 'eyecatch.png');
  const res = await fetch('https://note.com/api/v1/image_upload/note_eyecatch', { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest', 'User-Agent': UA, Accept: 'application/json', Referer: 'https://note.com/notes/new', Origin: 'https://note.com', Cookie: `_note_session_v5=${TOKEN}` }, body: fd });
  const text = await res.text();
  if (!res.ok) throw new Error(`eyecatch upload失敗 ${res.status}: ${text.slice(0, 200)}`);
  const url = (JSON.parse(text).data || {}).url || '';
  const m = url.match(/\/images\/(\d+)\//);
  if (!m) throw new Error(`eye_catch_key抽出失敗: ${url}`);
  return Number(m[1]);
}
async function finalize(noteId, payload) {
  const res = await fetch(`https://note.com/api/v1/text_notes/${noteId}`, { method: 'PUT', headers: HEADERS, body: JSON.stringify(payload) });
  const text = await res.text();
  if (!res.ok) throw new Error(`確定(PUT)失敗 ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

// ---- main ----
const arg = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
const publishNow = process.argv.includes('--publish');
const schIdx = process.argv.indexOf('--schedule');
const scheduleMin = schIdx >= 0 ? Number(process.argv[schIdx + 1]) : null;
if (!arg) { console.error('使い方: node scripts/note/post-note.mjs <slug|all> [--dry-run|--publish|--schedule <分>]'); process.exit(1); }
if (!dryRun && !publishNow && !scheduleMin) { console.error('モード必須: --publish（即公開） / --schedule <分>（予約） / --dry-run'); process.exit(1); }
if (!dryRun && !TOKEN) { console.error('NOTE_SESSION_TOKEN 未設定（.env）。'); process.exit(1); }

const slugs = arg === 'all' ? readdirSync(SYND).filter((f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('NOTE_POST')).map((f) => basename(f, '.md')) : [arg];

let ok = 0, fail = 0;
for (const slug of slugs) {
  const mdPath = resolve(SYND, `${slug}.md`);
  if (!existsSync(mdPath)) { console.error(`[skip] ${slug}.md なし`); fail++; continue; }
  const md = readFileSync(mdPath, 'utf-8');
  const name = titleFromMd(md);
  if (!name) { console.error(`[skip] ${slug} タイトル抽出失敗`); fail++; continue; }
  const freeBody = markdownToNoteHtml(md);
  if (dryRun) { console.log(`\n==== ${slug} ====\nタイトル: ${name}\nHTML先頭300字:\n${freeBody.slice(0, 300)}`); ok++; continue; }
  try {
    const note = await createDraft(name, freeBody);
    const id = note.id;
    const key = note.key || id;
    // アイキャッチ（あればアップ）
    let eyeCatchKey = null;
    const eyePath = resolve(EYE, `${slug}.png`);
    if (existsSync(eyePath)) eyeCatchKey = await uploadEyecatch(id, readFileSync(eyePath));
    // 本文＋画像＋公開状態を確定
    const status = publishNow ? 'published' : 'reserved';
    const publishAt = publishNow ? null : jstIso(new Date(Date.now() + scheduleMin * 60000));
    await finalize(id, notePayload(name, freeBody, { status, publishAt, eyeCatchKey }));
    const where = publishNow ? `公開 https://note.com/notes/${key}` : `予約(${publishAt}) https://editor.note.com/notes/${key}/edit`;
    console.log(`[ok] ${slug} → ${where}${eyeCatchKey ? ' （アイキャッチ付き）' : ''}`);
    ok++;
    await new Promise((r) => setTimeout(r, 1800));
  } catch (e) { console.error(`[fail] ${slug}: ${e.message}`); fail++; }
}
console.log(`\n完了：${dryRun ? 'DRY-RUN ' : ''}成功 ${ok} / 失敗 ${fail}`);
