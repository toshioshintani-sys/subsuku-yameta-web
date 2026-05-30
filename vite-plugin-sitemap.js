import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SERVICES, CATEGORIES } from './src/data/services.js';
import { POSTS } from './src/data/posts.js';
import { DISCOVER_GENRES } from './src/data/discover.js';

const FALLBACK_SITE_URL = 'https://sabusuku.netlify.app';

function getSiteUrl() {
  return (process.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '');
}

function buildRoutes() {
  const staticRoutes = ['/', '/tracker', '/discover', '/yamete-kau', '/games', '/blog', '/about', '/privacy', '/disclaimer', '/disclosure', '/contact'];
  const categoryRoutes = CATEGORIES
    .filter((c) => c.id !== 'all')
    .map((c) => `/category/${c.id}`);
  const serviceRoutes = SERVICES.map((s) => `/service/${s.id}`);
  const postRoutes = POSTS.map((p) => `/blog/${p.slug}`);
  const discoverRoutes = DISCOVER_GENRES.map((g) => `/discover/${g.id}`);
  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...postRoutes, ...discoverRoutes];
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

export default function sitemapPlugin() {
  return {
    name: 'subsuku-yameta-sitemap',
    apply: 'build',
    closeBundle() {
      const siteUrl = getSiteUrl();
      const routes = buildRoutes();
      const outDir = resolve(process.cwd(), 'dist');
      writeFileSync(resolve(outDir, 'sitemap.xml'), renderSitemap(siteUrl, routes), 'utf8');
      writeFileSync(resolve(outDir, 'robots.txt'), renderRobots(siteUrl), 'utf8');
      console.log(`[sitemap] wrote ${routes.length} URLs to dist/sitemap.xml`);
    },
  };
}
