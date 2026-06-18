// Markdown転載原稿(docs/syndication/*.md) → note投稿用テキストに変換（v2: リンクはカード化）。
// note挙動（2026-06-18 実地確認）:
//   ## 見出し / **太字** → noteが変換 → 維持
//   裸URLを単独行に置く  → noteが埋め込みカードに変換（URLは本文に出ない）★これでリンク表示
//   - / *（箇条書き）→ ・
//   > 引用 → プレフィックス除去 ／ ![img] → 除去 ／ ---（水平線）→ 空行
// リンク方針（俊雄さん指示・絶対）: URLを本文に直書きしない。[text](url) は
//   アンカーテキストを本文に残し、URLは単独行に出してカード化する。URLは重複排除（同一URLは1カード）。
// 出力: docs/syndication/note/<slug>.note.txt（本文にコピペ。タイトルはREADME表から）
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = resolve(ROOT, 'docs/syndication');
const OUT = resolve(SRC, 'note');
mkdirSync(OUT, { recursive: true });

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function adapt(md) {
  const out = [];
  const seen = new Set(); // URL重複排除（同一URLは1カードだけ）
  const card = (url) => { if (!seen.has(url)) { seen.add(url); out.push(''); out.push(url); out.push(''); } };

  for (const rawLine of md.split('\n')) {
    const t = rawLine.trim();
    if (/^!\[/.test(t)) continue; // 画像行は除去
    if (/^([-*_]\s?){3,}$/.test(t)) { out.push(''); continue; } // 水平線 → 空行

    let line = rawLine.replace(/^>\s?/, ''); // 引用プレフィックス除去
    line = line.replace(/^(\s*)[-*]\s+/, '$1・'); // 箇条書き → ・

    const links = [...line.matchAll(LINK)];
    if (!links.length) { out.push(line); continue; }

    // この行は「リンクだけの行」か？（・絵文字記号を除いた残りが空＝関連リンク等のリスト項目）
    const residue = line.replace(LINK, '').replace(/[・\s|｜📋🧮🛒📖📌※：:、。]/gu, '').trim();
    if (residue === '') {
      // ラベルは出さず、カードだけ（URLは本文に出ない＝カード表示）
      for (const [, , url] of links) card(url);
      continue;
    }
    // インライン: アンカーテキストは本文に残し、URLはカードとして直後に出す
    const collected = [];
    line = line.replace(LINK, (_m, text, url) => { collected.push(url); return text; });
    out.push(line);
    for (const url of collected) card(url);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

const files = readdirSync(SRC).filter(
  (f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('NOTE_POST')
);
for (const f of files) {
  const adapted = adapt(readFileSync(resolve(SRC, f), 'utf-8'));
  writeFileSync(resolve(OUT, basename(f, '.md') + '.note.txt'), adapted, 'utf-8');
  console.log(`[note-adapt] ${basename(f, '.md')}.note.txt`);
}
console.log(`\n完了：${files.length}本 → docs/syndication/note/（リンクはカード化・URL本文非表示）`);
