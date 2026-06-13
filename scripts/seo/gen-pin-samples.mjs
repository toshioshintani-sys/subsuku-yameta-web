// Pinterest ピンのサンプル生成（チョキくん入り・1000x1500）。
//
// 目的: 「チョキくんを全広報素材の標準キャラに」（俊雄さん GO・2026-06-14）。
// 無味な数字ピンではなく、ブランドの顔=チョキくんが各テーマの表情で出るピンを量産する土台。
// テーマ別に表情を使い分ける: cutting=解約/買い切り, thinking=比較/判断, lost=「まだ払ってる?」,
// celebrate=節約達成, smile=デフォルト。
//
// 出力: docs/pinterest/samples/pin-<key>.png（実寸2x）＋ contact sheet（temp・確認用）。
// 再生成: node scripts/seo/gen-pin-samples.mjs
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OUTDIR = resolve(ROOT, 'docs/pinterest/samples');
mkdirSync(OUTDIR, { recursive: true });

const mascotSvg = (exp) => readFileSync(resolve(ROOT, `public/assets/mascot/mascot-${exp}.svg`), 'utf-8');

// マスコットSVGを pin SVG 内に入れ子配置（width/height を除去し x/y/width/height を付与）
function placeMascot(svg, x, y, size) {
  return svg.replace(/<svg([^>]*)>/, (_m, attrs) => {
    const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, '');
    return `<svg${cleaned} x="${x}" y="${y}" width="${size}" height="${size}">`;
  });
}

const TEAL = '#0a7c7c';
const NAVY = '#1a1f2e';
const GREY = '#5e6a82';
const CREAM = '#fbf8f3';
const FONT = "'Yu Gothic','Hiragino Sans','Noto Sans JP',sans-serif";

// 1ピン = 自己完結SVG（背景＋テキスト＋入れ子マスコット）。CSSで縮小しても全体が一緒にスケール。
function pinSvg({ head, sub, exp }) {
  const [l1, l2] = head;
  const mascot = placeMascot(mascotSvg(exp), 215, 720, 570); // 中心(500,1005)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="1000" height="1500">
    <rect width="1000" height="1500" fill="${CREAM}"/>
    <rect x="0" y="0" width="1000" height="10" fill="${TEAL}"/>
    <circle cx="500" cy="1010" r="340" fill="#e9f2f2"/>
    <g font-family="${FONT}" text-anchor="middle">
      <text x="500" y="135" font-size="40" font-weight="700" fill="${TEAL}">✂ サブスクやめた</text>
      <text x="500" y="322" font-size="80" font-weight="700" fill="${NAVY}" letter-spacing="-1">${l1}</text>
      <text x="500" y="436" font-size="80" font-weight="700" fill="${NAVY}" letter-spacing="-1">${l2}</text>
      <text x="500" y="548" font-size="36" fill="${GREY}">${sub}</text>
      ${mascot}
      <text x="500" y="1445" font-size="34" fill="${GREY}" opacity="0.85">sabusuku.netlify.app</text>
    </g>
  </svg>`;
}

const PINS = [
  { key: 'tracker', exp: 'lost', head: ['使ってないサブスク、', '年でいくら払ってる?'], sub: '1分で棚卸し・無料・登録不要' },
  { key: 'buyout', exp: 'cutting', head: ['月額をやめて、', '買い切りに。'], sub: '向く人・向かない人で正直に比較' },
  { key: 'games', exp: 'thinking', head: ['「解約できない」は、', '意志の弱さじゃない。'], sub: '課金のクセを30秒ゲームで見抜く' },
];

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  // 各ピンを実寸2xで保存
  for (const p of PINS) {
    await page.setViewport({ width: 1000, height: 1500, deviceScaleFactor: 2 });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}svg{display:block}</style></head><body>${pinSvg(p)}</body></html>`, { waitUntil: 'load' });
    await page.screenshot({ path: resolve(OUTDIR, `pin-${p.key}.png`), clip: { x: 0, y: 0, width: 1000, height: 1500 } });
    console.log('[pin] wrote', `pin-${p.key}.png`);
  }
  // 確認用コンタクトシート（3枚を横に並べ縮小）
  const cells = PINS.map((p) => `<div class="c">${pinSvg(p)}</div>`).join('');
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#dfe3ea}body{display:flex;gap:16px;padding:18px}.c{width:360px}.c svg{width:360px;height:540px;display:block;box-shadow:0 6px 20px rgba(0,0,0,.18);border-radius:8px}</style></head><body>${cells}</body></html>`;
  await page.setViewport({ width: 1160, height: 580, deviceScaleFactor: 2 });
  await page.setContent(sheet, { waitUntil: 'load' });
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/pin-samples.png' });
  console.log('[pin] wrote contact sheet → temp');
} finally {
  await browser.close();
}
