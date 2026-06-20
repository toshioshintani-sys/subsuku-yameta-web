import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SERVICES, CATEGORIES } from './src/data/services.js';
import { POSTS } from './src/data/posts.js';
import { DISCOVER_GENRES } from './src/data/discover.js';
import { BIAS_GAMES } from './src/data/biasGames.js';

const FALLBACK_SITE_URL = 'https://sabusuku-yameta.com';

function getSiteUrl() {
  return (process.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');
}

function buildRoutes() {
  const staticRoutes = ['/', '/compare', '/tracker', '/discover', '/yamete-kau', '/games', '/blog', '/about', '/privacy', '/disclaimer', '/disclosure', '/contact'];
  const categoryRoutes = CATEGORIES
    .filter((c) => c.id !== 'all')
    .map((c) => `/category/${c.id}`);
  const serviceRoutes = SERVICES.map((s) => `/service/${s.id}`);
  const postRoutes = POSTS.map((p) => `/blog/${p.slug}`);
  const discoverRoutes = DISCOVER_GENRES.map((g) => `/discover/${g.id}`);
  const gameRoutes = BIAS_GAMES.map((g) => `/games/${g.id}`);
  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...postRoutes, ...discoverRoutes, ...gameRoutes];
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderSitemap(siteUrl, routes) {
  const urls = routes
    .map((path) => `  <url><loc>${escapeXml(siteUrl + path)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function renderRobots(siteUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

// RSS 2.0 フィード（最新20記事）。アグリゲータ・AIクローラー向けの更新配信面。
function renderRss(siteUrl, posts) {
  const items = posts
    .slice(0, 20)
    .map(
      (p) => `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${siteUrl}/blog/${p.slug}</link>
    <guid isPermaLink="true">${siteUrl}/blog/${p.slug}</guid>
    <pubDate>${new Date(`${p.published}T09:00:00+09:00`).toUTCString()}</pubDate>
    <description>${escapeXml(p.description)}</description>
  </item>`
    )
    .join('\n');
  const latest = posts[0] ? new Date(`${posts[0].published}T09:00:00+09:00`).toUTCString() : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>サブスクやめた｜お役立ち記事</title>
  <link>${siteUrl}/blog</link>
  <description>サブスクの解約・乗り換え・買い切り化を、煽りなし・両論併記で解説するお役立ち記事の更新フィード</description>
  <language>ja</language>
  <lastBuildDate>${latest}</lastBuildDate>
${items}
</channel>
</rss>
`;
}

// llms.txt — AI検索/LLMクローラー向けのサイト案内（https://llmstxt.org 形式）。
// データから生成するため記事・ジャンルが増えても常に最新＝AI検索引用最適化の配信面。
function renderLlmsTxt(siteUrl, posts, genres) {
  const postLines = posts
    .map((p) => `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.description}`)
    .join('\n');
  const genreLines = genres
    .map((g) => `- [${g.name}](${siteUrl}/discover/${g.id}): ${g.tagline}`)
    .join('\n');
  return `# サブスクやめた

> 日本のサブスクリプション（Netflix・Spotify など${SERVICES.length}サービス）の解約手順への直リンク集。あわせて「乗り換え先の比較」「買い切りでの代替」「固定費の棚卸しツール」を、煽り・ランキング・★スコアを使わず両論併記で提供する日本語サイト。

重要な前提:
- 解約手順が主目的のサイトで、紹介サービスには必ずデメリットも併記する
- アフィリエイトリンクには（PR）表記がある。詳細: [収益開示](${siteUrl}/disclosure)
- 運営者情報: [このサイトについて](${siteUrl}/about)

## 主要ツール

- [解約手順トップ](${siteUrl}/): ${SERVICES.length}サービスの解約ページ直リンクと3ステップ手順
- [解約方法の一覧・比較](${siteUrl}/compare): ${SERVICES.length}サービスの解約難易度・月額目安・注意点・解約ページ直リンクを1ページで一覧・比較（ランキングなし・両論併記）
- [固定費の棚卸し](${siteUrl}/tracker): 契約中サブスクの月額・年額合計と見直し順を可視化（登録不要）
- [サブスク図鑑](${siteUrl}/discover): ジャンル別に乗り換え先を特徴・弱点つきで比較
- [やめて買う](${siteUrl}/yamete-kau): 月額をやめて買い切りで済ませる代替案
- [お役立ち記事](${siteUrl}/blog): 解約・乗り換え・買い切り化の解説記事（RSS: ${siteUrl}/feed.xml）

## 図鑑ジャンル

${genreLines}

## 記事一覧

${postLines}
`;
}

export default function sitemapPlugin() {
  return {
    name: 'subsuku-yameta-sitemap',
    apply: 'build',
    closeBundle() {
      const siteUrl = getSiteUrl();
      const routes = buildRoutes();
      const outDir = resolve(process.cwd(), 'dist');
      const postsDesc = [...POSTS].sort((a, b) => (a.published < b.published ? 1 : -1));
      writeFileSync(resolve(outDir, 'sitemap.xml'), renderSitemap(siteUrl, routes), 'utf8');
      writeFileSync(resolve(outDir, 'robots.txt'), renderRobots(siteUrl), 'utf8');
      writeFileSync(resolve(outDir, 'feed.xml'), renderRss(siteUrl, postsDesc), 'utf8');
      writeFileSync(resolve(outDir, 'llms.txt'), renderLlmsTxt(siteUrl, postsDesc, DISCOVER_GENRES), 'utf8');
      console.log(`[sitemap] wrote ${routes.length} URLs to dist/sitemap.xml + feed.xml(${Math.min(postsDesc.length, 20)} items) + llms.txt`);
    },
  };
}
