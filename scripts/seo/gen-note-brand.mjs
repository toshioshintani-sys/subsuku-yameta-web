// note ブランド画像生成（アイコン＋ヘッダー・チョキくん入り・ピン/OGと同じ家族感）。
// 出力: docs/syndication/note-icon.png (800x800) / docs/syndication/note-header.png (1280x670)
// 再生成: node scripts/seo/gen-note-brand.mjs
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OUT = resolve(ROOT, 'docs/syndication');
mkdirSync(OUT, { recursive: true });

const TEAL = '#0a7c7c';
const NAVY = '#1a1f2e';
const GREY = '#5e6a82';
const CREAM = '#fbf8f3';
const TEALBG = '#e9f2f2';
const FONT = "'Yu Gothic','Hiragino Sans','Noto Sans JP',sans-serif";

const smile = readFileSync(resolve(ROOT, 'public/assets/mascot/mascot-smile.svg'), 'utf-8');
const cutting = readFileSync(resolve(ROOT, 'public/assets/mascot/mascot-cutting.svg'), 'utf-8');

// マスコットSVGを入れ子配置（width/height を除去し x/y/width/height を付与・preserveAspectRatioで等比中央）
function placeMascot(svg, x, y, size) {
  return svg.replace(/<svg([^>]*)>/, (_m, attrs) => {
    const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, '');
    return `<svg${cleaned} x="${x}" y="${y}" width="${size}" height="${size}">`;
  });
}

// アイコン（円トリミング前提で中央に余白）：cream地＋淡teal円＋チョキくん smile
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="${CREAM}"/>
  <circle cx="400" cy="400" r="394" fill="${TEALBG}"/>
  <circle cx="400" cy="400" r="394" fill="none" stroke="${TEAL}" stroke-width="10"/>
  ${placeMascot(smile, 110, 130, 580)}
</svg>`;

// ヘッダー（1280x670・左にワードマーク/タグライン、右にチョキくん cutting）
const headerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 670" width="1280" height="670">
  <rect width="1280" height="670" fill="${CREAM}"/>
  <rect x="0" y="0" width="1280" height="12" fill="${TEAL}"/>
  <circle cx="1010" cy="350" r="258" fill="${TEALBG}"/>
  ${placeMascot(cutting, 790, 110, 440)}
  <g font-family="${FONT}">
    <text x="92" y="252" font-size="76" font-weight="700" fill="${TEAL}">✂ サブスクやめた</text>
    <text x="94" y="342" font-size="42" font-weight="700" fill="${NAVY}">今のサブスク、どう動きますか？</text>
    <text x="94" y="406" font-size="33" fill="${GREY}">やめる・乗り換える・買い切る・試す。</text>
    <text x="94" y="460" font-size="28" fill="${GREY}">煽らず・両論併記で、次の一手を。</text>
    <text x="94" y="588" font-size="30" font-weight="700" fill="${TEAL}">sabusuku.netlify.app</text>
  </g>
</svg>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  const shots = [
    { svg: iconSvg, w: 800, h: 800, out: 'note-icon.png' },
    { svg: headerSvg, w: 1280, h: 670, out: 'note-header.png' },
  ];
  for (const s of shots) {
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 2 });
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}svg{display:block}</style></head><body>${s.svg}</body></html>`,
      { waitUntil: 'load' }
    );
    await page.screenshot({ path: resolve(OUT, s.out), clip: { x: 0, y: 0, width: s.w, height: s.h } });
    console.log(`[note-brand] wrote ${s.out} (${s.w}x${s.h})`);
  }
} finally {
  await browser.close();
}
