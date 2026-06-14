// クロス投稿（cross-post）用 Markdown 生成 — note / はてなブログ向け。
//
// 目的: 律速＝流入≈0。21記事を各PFに転載し、読者を元サイトへ送客する（俊雄さんは貼るだけ）。
// 方針:
//  - 内部リンク(/tracker 等) → 絶対URL＋UTM（送客＆計測）
//  - アフィリエイトリンク(a8/amazon/楽天 等) → リンクを外しプレーン化（note等のToS回避＋
//    クリックは「初出（全文）」に集約）
//  - 冒頭に初出リンク（canonicalの人手対応）。はてなは詳細設定でcanonical URLに初出を設定。
//  - 末尾に関連ツール(/compare,/tracker,/yamete-kau)＋全文への導線。
// 出力: docs/syndication/<slug>.md（21本）＋ README.md（一覧・canonical指針）。
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { POSTS } from '../../src/data/posts.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'docs/syndication');
mkdirSync(OUT, { recursive: true });
const SITE = 'https://sabusuku.netlify.app';
const AFF = /a8\.net|px\.a8|a8mat|moshimo|amazon\.|rakuten|valuecommerce|linksynergy|\.afl\.|af-mdf/i;

function utm(path, slug) {
  return `${SITE}${path}${path.includes('?') ? '&' : '?'}utm_source=note&utm_medium=syndication&utm_campaign=${slug}`;
}

function htmlToMd(text, slug) {
  let s = String(text ?? '');
  s = s.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
    const lbl = label.replace(/<[^>]+>/g, '').trim();
    if (href.startsWith('/')) return `[${lbl}](${utm(href, slug)})`;
    if (AFF.test(href)) return lbl; // アフィリンクは外す
    return `[${lbl}](${href})`;
  });
  s = s.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  s = s.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');
  s = s.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*');
  s = s.replace(/<br\s*\/?>(?=)/gi, '\n');
  s = s.replace(/<[^>]+>/g, ''); // 残りのタグを除去
  return s.trim();
}

function blockToMd(b, slug) {
  if (!b || !b.type) return '';
  if (b.type === 'h2') return `## ${htmlToMd(b.text, slug)}`;
  if (b.type === 'ul') return (b.items || []).map((i) => `- ${htmlToMd(i, slug)}`).join('\n');
  if (b.type === 'quote') return `> ${htmlToMd(b.text, slug)}`;
  if (b.type === 'img') return b.src ? `![${(b.alt || '').replace(/"/g, '')}](${b.src.startsWith('/') ? SITE + b.src : b.src})` : '';
  return htmlToMd(b.text, slug); // p ほか
}

function buildDoc(p) {
  const slug = p.slug;
  const orig = utm(`/blog/${slug}`, slug);
  const head = `> 📌 この記事の初出（最新版）: [サブスクやめた｜${p.title}](${orig})\n> ※元サイトでは、解約方法の一覧・棚卸しツールと一緒に読めます。`;
  const body = p.body.map((b) => blockToMd(b, slug)).filter(Boolean).join('\n\n');
  let faq = '';
  if (Array.isArray(p.faq) && p.faq.length) {
    faq = '\n\n## よくある質問\n\n' + p.faq.map((f) => `**Q. ${htmlToMd(f.q, slug)}**\n\n${htmlToMd(f.a, slug)}`).join('\n\n');
  }
  const cta =
    '\n\n---\n\n### 関連（サブスクやめた）\n' +
    `- 📋 [サブスク58サービスの解約方法 一覧・比較](${utm('/compare', slug)})\n` +
    `- 🧮 [固定費の棚卸し（契約中サブスクの年額を1分で可視化・登録不要）](${utm('/tracker', slug)})\n` +
    `- 🛒 [やめて買い切りで探す](${utm('/yamete-kau', slug)})\n` +
    `- 📖 [この記事の全文・最新版（具体的なサービス情報つき）](${orig})\n\n` +
    `*この記事は「サブスクやめた」(sabusuku.netlify.app) からの転載です。最新版・具体的なサービスリンクは元サイトでご覧いただけます。*`;
  return `${head}\n\n${body}${faq}${cta}\n`;
}

for (const p of POSTS) {
  writeFileSync(resolve(OUT, `${p.slug}.md`), buildDoc(p), 'utf-8');
}

const rows = POSTS.map((p) => `| \`${p.slug}.md\` | ${p.title.replace(/\|/g, '｜')} | ${SITE}/blog/${p.slug} |`).join('\n');
const readme = `# クロス投稿（cross-post）用 Markdown — note / はてなブログ

> 自動生成: \`node scripts/seo/gen-syndication.mjs\`。${POSTS.length}記事分の転載用Markdown。
> 各 \`<slug>.md\` を本文にコピペするだけ。タイトルは下表から各PFのタイトル欄へ。

## 使い方・重要な指針
- **canonical（重複コンテンツ対策・元記事のSEOを守る）**
  - **はてなブログ**：記事の「詳細設定 > canonical URL」に、下表の**初出URL**を設定する。
  - **note**：canonical設定が無いので、本文冒頭の「初出リンク」を必ず残す。**元記事がGoogleにインデックスされた数日後**に転載するとより安全。
- **UTM**：本文リンクは \`utm_source=note\`。はてなに貼る時は \`utm_source=note\` → \`utm_source=hatena\` に一括置換。
- **アフィリエイトリンクは外してあります**（note等のToS回避＋クリックを元サイトに集約）。具体的なサービスリンクは「初出（全文）」側に置いてある。
- **狙い**：各PFの読者を**元サイトへ送客**して律速（流入）を崩す。実投稿は俊雄さんの原子操作。

## 記事一覧（${POSTS.length}本）
| ファイル | タイトル（各PFのタイトル欄へ） | 初出URL（canonicalに設定） |
|---|---|---|
${rows}
`;
writeFileSync(resolve(OUT, 'README.md'), readme, 'utf-8');
console.log(`[syndication] wrote ${POSTS.length} cross-post md + README → docs/syndication/`);
