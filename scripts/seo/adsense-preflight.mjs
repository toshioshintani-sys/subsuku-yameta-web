// AdSense再審査ゲート（docs/ADSENSE_REAPPROVAL_PLAN.md P4-1）。
// `npm run build`（vite build + prerender）の後、dist/ を機械検査して合否表を出す。
// ①sitemap⇄実ファイル整合 ②メイン本文量≥しきい値 ③title/description重複 ④JSON-LDパース可否
// ⑤（REVIEW_MODE時のみ）アフィリエイトURLの残存ゼロ確認
//
// 使い方: node scripts/seo/adsense-preflight.mjs
// 終了コード: 0=全緑 / 1=いずれか不合格

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const DIST = resolve('dist');
const SITEMAP = join(DIST, 'sitemap.xml');

// 本文量の最低ライン（文字数）。ナビ・フッター等の共通chromeを含んだ body 全体で計測。
// 実測値: 最薄の周辺ページでも chrome(ナビ+フッター+パンくず) だけで概ね数百字あるため、
// 800字を「chrome程度では届かない・固有本文が要る」ラインとして採用（P2完了後の実測に基づき調整可）。
const MIN_BODY_CHARS = 800;

function fail(msgs, msg) {
  msgs.push(`✗ ${msg}`);
}
function ok(msgs, msg) {
  msgs.push(`✓ ${msg}`);
}

function routeToDistFile(urlPath) {
  // '/' → dist/index.html, '/service/netflix' → dist/service/netflix/index.html
  const clean = urlPath.replace(/\/$/, '');
  return clean === '' ? join(DIST, 'index.html') : join(DIST, clean, 'index.html');
}

function extractBodyText(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || html;
  const noScriptStyle = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const text = noScriptStyle.replace(/<[^>]+>/g, ' ');
  return text.replace(/\s+/g, ' ').trim();
}

function extractTag(html, re) {
  return html.match(re)?.[1]?.trim() || null;
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) blocks.push(m[1]);
  return blocks;
}

function main() {
  const report = [];
  let failures = 0;

  if (!existsSync(SITEMAP)) {
    console.error(`✗ ${SITEMAP} が見つかりません。先に \`npm run build\` を実行してください。`);
    process.exit(1);
  }
  const sitemapXml = readFileSync(SITEMAP, 'utf-8');
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const siteUrl = urls[0]?.match(/^https?:\/\/[^/]+/)?.[0] || '';
  const paths = urls.map((u) => u.replace(siteUrl, '') || '/');

  // ① sitemap ⇄ 実ファイル整合
  const missing = paths.filter((p) => !existsSync(routeToDistFile(p)));
  if (missing.length) {
    fail(report, `sitemap記載${paths.length}件中${missing.length}件でdistファイル欠落: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '…' : ''}`);
    failures++;
  } else {
    ok(report, `sitemap ${paths.length}件 全てdistファイルと一致`);
  }

  // ②③④⑤の集計
  const thin = [];
  const descriptions = new Map(); // description -> [paths]
  const titles = new Map();
  const jsonLdBroken = [];
  let affiliateHits = 0;
  const AFFILIATE_MARKERS = /a8mat=|af\.moshimo\.com|hb\.afl\.rakuten|amazon\.[a-z.]+\/[^"']*[?&]tag=/;
  const reviewMode = process.env.VITE_REVIEW_MODE === 'true';

  for (const p of paths) {
    const file = routeToDistFile(p);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf-8');

    const bodyLen = extractBodyText(html).length;
    if (bodyLen < MIN_BODY_CHARS) thin.push([p, bodyLen]);

    const title = extractTag(html, /<title>([\s\S]*?)<\/title>/);
    const desc = extractTag(html, /<meta\s+name="description"\s+content="([^"]*)"/);
    if (!title) { fail(report, `${p}: <title> なし`); failures++; }
    if (!desc) { fail(report, `${p}: meta description なし`); failures++; }
    if (title) { if (!titles.has(title)) titles.set(title, []); titles.get(title).push(p); }
    if (desc) { if (!descriptions.has(desc)) descriptions.set(desc, []); descriptions.get(desc).push(p); }

    for (const block of extractJsonLdBlocks(html)) {
      try { JSON.parse(block); } catch { jsonLdBroken.push(p); }
    }

    if (reviewMode && AFFILIATE_MARKERS.test(html)) affiliateHits++;
  }

  if (thin.length) {
    fail(report, `本文量が${MIN_BODY_CHARS}字未満のページ ${thin.length}件: ${thin.slice(0, 8).map(([p, n]) => `${p}(${n}字)`).join(', ')}${thin.length > 8 ? '…' : ''}`);
    failures++;
  } else {
    ok(report, `全ページ本文量 ≥ ${MIN_BODY_CHARS}字`);
  }

  const dupTitles = [...titles.entries()].filter(([, ps]) => ps.length >= 2);
  const dupDescs = [...descriptions.entries()].filter(([, ps]) => ps.length >= 2);
  if (dupTitles.length) {
    fail(report, `title重複 ${dupTitles.length}組: ${dupTitles.slice(0, 3).map(([t, ps]) => `"${t.slice(0, 20)}…"×${ps.length}`).join(', ')}`);
    failures++;
  } else {
    ok(report, 'title重複なし');
  }
  if (dupDescs.length) {
    fail(report, `description重複 ${dupDescs.length}組: ${dupDescs.slice(0, 3).map(([d, ps]) => `"${d.slice(0, 20)}…"×${ps.length}`).join(', ')}`);
    failures++;
  } else {
    ok(report, 'description重複なし');
  }

  if (jsonLdBroken.length) {
    fail(report, `JSON-LDパース失敗 ${jsonLdBroken.length}件: ${jsonLdBroken.slice(0, 5).join(', ')}`);
    failures++;
  } else {
    ok(report, '全ページのJSON-LDがパース可能');
  }

  if (reviewMode) {
    if (affiliateHits > 0) {
      fail(report, `REVIEW_MODE=trueだがアフィリエイトURLが${affiliateHits}ページに残存`);
      failures++;
    } else {
      ok(report, 'REVIEW_MODE=true: アフィリエイトURL残存ゼロ確認');
    }
  } else {
    report.push('· REVIEW_MODE=false（通常ビルド）のためアフィリエイトURL検査はスキップ');
  }

  console.log(report.join('\n'));
  console.log(failures === 0 ? `\n✅ 全緑（${paths.length}ページ検査）` : `\n❌ ${failures}項目が不合格`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
