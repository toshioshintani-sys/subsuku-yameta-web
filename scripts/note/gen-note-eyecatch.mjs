// note アイキャッチ（1280×670）を記事ごとに生成（チョキくんブランド・ピン/OGと同じ家族感）。
// タイトルは docs/syndication/<slug>.md 冒頭の初出リンクから取得。
// 出力: docs/syndication/note/eyecatch/<slug>.png
// 使い方: node scripts/note/gen-note-eyecatch.mjs <slug|all>
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SYND = resolve(ROOT, 'docs/syndication');
const OUT = resolve(SYND, 'note/eyecatch');
mkdirSync(OUT, { recursive: true });

const TEAL = '#0a7c7c', NAVY = '#1a1f2e', CREAM = '#fbf8f3', TEALBG = '#e9f2f2';
const FONT = "'Yu Gothic','Hiragino Sans','Noto Sans JP',sans-serif";

let smile = readFileSync(resolve(ROOT, 'public/assets/mascot/mascot-smile.svg'), 'utf-8');
smile = smile.replace(/\s(width|height)="[^"]*"/g, '').replace(/<svg/, '<svg style="width:100%;height:100%;display:block"');

function titleFromMd(md) {
  const m = md.match(/\[サブスクやめた[｜|](.+?)\]\(/);
  return m ? m[1].trim() : null;
}
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// タイトル長で文字サイズを調整（長文でも収まるように）
function fontSize(title) {
  const n = title.length;
  if (n <= 22) return 60;
  if (n <= 30) return 52;
  if (n <= 40) return 46;
  return 40;
}

function html(title) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}</style></head><body>
  <div style="width:1280px;height:670px;background:${CREAM};font-family:${FONT};position:relative;overflow:hidden;box-sizing:border-box">
    <div style="position:absolute;top:0;left:0;width:1280px;height:14px;background:${TEAL}"></div>
    <div style="position:absolute;right:58px;top:140px;width:392px;height:392px;border-radius:50%;background:${TEALBG};display:flex;align-items:center;justify-content:center">
      <div style="width:320px;height:320px">${smile}</div>
    </div>
    <div style="position:absolute;left:72px;top:90px;width:730px;height:470px;display:flex;flex-direction:column;justify-content:center">
      <div style="font-size:${fontSize(title)}px;font-weight:700;color:${NAVY};line-height:1.42">${esc(title)}</div>
    </div>
    <div style="position:absolute;left:74px;bottom:54px;color:${TEAL};font-weight:700;font-size:28px">✂ サブスクやめた　｜　sabusuku.netlify.app</div>
  </div></body></html>`;
}

const arg = process.argv[2] || 'all';
const slugs = arg === 'all'
  ? readdirSync(SYND).filter((f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('NOTE_POST')).map((f) => basename(f, '.md'))
  : [arg];

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 670, deviceScaleFactor: 1 });
  for (const slug of slugs) {
    const mdPath = resolve(SYND, `${slug}.md`);
    if (!existsSync(mdPath)) { console.error(`[skip] ${slug}.md なし`); continue; }
    const title = titleFromMd(readFileSync(mdPath, 'utf-8'));
    if (!title) { console.error(`[skip] ${slug} タイトル抽出失敗`); continue; }
    await page.setContent(html(title), { waitUntil: 'load' });
    await page.screenshot({ path: resolve(OUT, `${slug}.png`), clip: { x: 0, y: 0, width: 1280, height: 670 } });
    console.log(`[eyecatch] ${slug}.png`);
  }
} finally {
  await browser.close();
}
