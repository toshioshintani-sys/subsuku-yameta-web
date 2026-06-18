// note.com API でサブスク転載記事を投稿（ライフオラクルの確立方式を移植）。
//
// 方式（ライフオラクル lessons.md 2026-05-03・gachijin/note_client.py に準拠）:
//   - 認証: Cookie `_note_session_v5`（DevTools→Application→Cookies→note.com で取得・32文字）
//           → 環境変数 NOTE_SESSION_TOKEN（または .env）
//   - POST https://note.com/api/v1/text_notes に { name(タイトル), free_body(HTML), status } を送る
//   - free_body は HTML。Markdownを markdownToNoteHtml() で変換 →
//       [text](url) → <a href="url">text</a>（アンカーテキスト表示・URL非表示＝俊雄さん指示を満たす）
//       ## → <h2> / **太字** → <strong> / - → <ul><li> / > → <blockquote> など
//   - 既定は status='draft'（下書き作成）。note ダッシュボードで確認→公開、が安全。
//
// 使い方:
//   $env:NOTE_SESSION_TOKEN="<_note_session_v5の値>"
//   node scripts/note/post-note.mjs world-cup-2026-where-to-watch-free --dry-run   # 変換だけ確認（投稿しない）
//   node scripts/note/post-note.mjs world-cup-2026-where-to-watch-free             # 下書き作成
//   node scripts/note/post-note.mjs all                                            # 全21本を下書き作成
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SYND = resolve(ROOT, 'docs/syndication');

// ---- .env から NOTE_SESSION_TOKEN を読む（無ければ環境変数）----
function loadEnv() {
  const f = resolve(ROOT, '.env');
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const idx = t.indexOf('=');
    const k = t.slice(0, idx).trim();
    const v = t.slice(idx + 1).trim();
    if (k && !process.env[k]) process.env[k] = v;
  }
}
loadEnv();

// ---- Markdown → note HTML（ライフオラクル markdown.py の移植・画像は除去）----
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
    if (/^!\[/.test(line.trim())) { i++; continue; } // 画像は除去（free_bodyに外部画像は載らない）
    if (line.startsWith('### ')) { parts.push(`<h3>${processInline(line.slice(4).trim())}</h3>`); i++; continue; }
    if (line.startsWith('## ')) { parts.push(`<h2>${processInline(line.slice(3).trim())}</h2>`); i++; continue; }
    if (line.startsWith('# ')) { parts.push(`<h2>${processInline(line.slice(2).trim())}</h2>`); i++; continue; }
    if (/^---+$/.test(line.trim())) { parts.push('<hr>'); i++; continue; }
    if (line.startsWith('> ')) {
      const block = [];
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
        block.push(lines[i].startsWith('> ') ? lines[i].slice(2) : '');
        i++;
      }
      parts.push(`<blockquote>${linesToHtml(block)}</blockquote>`);
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(processInline(lines[i].slice(2).trim())); i++;
      }
      parts.push('<ul>' + items.map((x) => `<li>${x}</li>`).join('') + '</ul>');
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(processInline(lines[i].replace(/^\d+\.\s*/, '').trim())); i++;
      }
      parts.push('<ol>' + items.map((x) => `<li>${x}</li>`).join('') + '</ol>');
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const para = [];
    while (
      i < lines.length && lines[i].trim() &&
      !(lines[i].startsWith('#') || lines[i].startsWith('> ') || lines[i].startsWith('- ') ||
        lines[i].startsWith('* ') || /^\d+\.\s/.test(lines[i]) || /^!\[/.test(lines[i].trim()) ||
        /^---+$/.test(lines[i].trim()))
    ) { para.push(lines[i]); i++; }
    if (para.length) parts.push('<p>' + para.map(processInline).join('<br>') + '</p>');
    else i++;
  }
  return parts.join('\n');
}
const markdownToNoteHtml = (md) => linesToHtml(md.split('\n'));

// ---- タイトル抽出（各 .md 冒頭の初出リンク「[サブスクやめた｜<TITLE>](…)」から）----
function titleFromMd(md) {
  const m = md.match(/\[サブスクやめた[｜|](.+?)\]\(/);
  return m ? m[1].trim() : null;
}

// ---- note API ----
const TOKEN = process.env.NOTE_SESSION_TOKEN;
const HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
  'Accept': 'application/json, text/plain, */*',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Referer: 'https://note.com/notes/new',
  Origin: 'https://note.com',
  Cookie: `_note_session_v5=${TOKEN}`,
};
async function createDraft(name, freeBody) {
  const body = {
    author_ids: [], body_length: freeBody.length, disable_comment: false,
    free_body: freeBody, hashtags: [], image_keys: [], name, price: 0,
    send_notifications_flag: false, separator: null, status: 'draft',
  };
  const res = await fetch('https://note.com/api/v1/text_notes', {
    method: 'POST', headers: HEADERS, body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`draft作成失敗 HTTP ${res.status}: ${text.slice(0, 400)}`);
  const j = JSON.parse(text);
  return j.data || j;
}

// ---- main ----
const arg = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!arg) {
  console.error('使い方: node scripts/note/post-note.mjs <slug|all> [--dry-run]');
  process.exit(1);
}
const slugs = arg === 'all'
  ? readdirSync(SYND).filter((f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('NOTE_POST')).map((f) => basename(f, '.md'))
  : [arg];

if (!dryRun && !TOKEN) {
  console.error('NOTE_SESSION_TOKEN 未設定。DevTools→Application→Cookies→note.com の _note_session_v5 を NOTE_SESSION_TOKEN に設定してください（.env 可）。');
  process.exit(1);
}

let ok = 0, fail = 0;
for (const slug of slugs) {
  const mdPath = resolve(SYND, `${slug}.md`);
  if (!existsSync(mdPath)) { console.error(`[skip] 原稿なし: ${slug}.md`); fail++; continue; }
  const md = readFileSync(mdPath, 'utf-8');
  const name = titleFromMd(md);
  if (!name) { console.error(`[skip] タイトル抽出失敗: ${slug}`); fail++; continue; }
  const freeBody = markdownToNoteHtml(md);
  if (dryRun) {
    console.log(`\n==== ${slug} ====`);
    console.log(`タイトル: ${name}`);
    console.log(`free_body(HTML) 先頭400字:\n${freeBody.slice(0, 400)}`);
    ok++;
    continue;
  }
  try {
    const note = await createDraft(name, freeBody);
    const key = note.key || note.id;
    console.log(`[draft] ${slug} → https://editor.note.com/notes/${key}/edit （確認して公開）`);
    ok++;
    await new Promise((r) => setTimeout(r, 1500)); // レート制御
  } catch (e) {
    console.error(`[fail] ${slug}: ${e.message}`);
    fail++;
  }
}
console.log(`\n完了：${dryRun ? 'DRY-RUN ' : ''}成功 ${ok} / 失敗 ${fail}`);
