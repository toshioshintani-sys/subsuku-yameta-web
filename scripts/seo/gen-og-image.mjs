// og-image.svg → public/og-image.png（1200x630）を Puppeteer で生成する。
//
// なぜ必要か: X/Facebook/LINE/Threads/Pinterest/Slack の多くは OGP 画像に SVG を
// 描画しない（PNG/JPG が必須）。og:image を .svg のままにすると、どのリンクを
// シェアしても画像カードが出ず、全シェア施策の効果が乗算でゼロになる（2026-06-14 実害確認）。
//
// 方針: 日本語フォント描画を確実にするため、JPフォントのあるローカル(Windows)で生成して
// public/og-image.png を静的アセットとしてコミットする（Netlify/Linux のフォント欠落を回避）。
// SVG デザインを変えたら `node scripts/seo/gen-og-image.mjs` で再生成する。
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const frame = readFileSync(resolve(ROOT, 'public/og-image.svg'), 'utf-8'); // 背景＋テキスト＋白丸
const mascot = readFileSync(resolve(ROOT, 'public/assets/mascot/mascot-cutting.svg'), 'utf-8'); // チョキくん（紐を切る）
const OUT = resolve(ROOT, 'public/og-image.png');

// フレームの白丸(cx952,cy318,r236)にチョキくんを重ねる。マスコットは透過SVGなので overlay で合成。
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  #wrap{position:relative;width:1200px;height:630px}
  #frame{position:absolute;inset:0}
  #frame svg{width:1200px;height:630px;display:block}
  #mascot{position:absolute;left:772px;top:162px;width:362px;height:362px}
  #mascot svg{width:362px;height:362px;display:block}
</style></head><body><div id="wrap"><div id="frame">${frame}</div><div id="mascot">${mascot}</div></div></body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('[og-image] wrote', OUT, '(1200x630 @2x, チョキくん入り)');
} finally {
  await browser.close();
}
