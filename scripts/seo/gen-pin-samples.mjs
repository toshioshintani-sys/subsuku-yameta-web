// Pinterest ピンのサンプル生成（チョキくん入り・1000x1500）。
//
// 目的: 「チョキくんを全広報素材の標準キャラに」（俊雄さん GO・2026-06-14）。
// 無味な数字ピンではなく、ブランドの顔=チョキくんが各テーマの表情で出るピンを量産する土台。
// 表情は"目玉"で作る（俊雄さん 2026-06-14）。固定ポーズに縛られず、内側の○を
// ＞＜(困)/ ^^(笑)/ －－(冷静=見抜く)/ 黒目ずらし(視線)/ ~(ウインク) に描き替えて感情を出す。
// → applyFace相当の faceMascot() が base(立ち姿)の目・口を差し替え、各ピンに感情を割り当てる（FACES パレット）。
//
// 出力: docs/pinterest/samples/pin-<key>.png（1000x1500）＋ pins-manifest.md（ピン→URL）＋ contact grid（temp・確認用）。
// 再生成: node scripts/seo/gen-pin-samples.mjs
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';
import { PINS, utm } from './pins-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const OUTDIR = resolve(ROOT, 'docs/pinterest/samples');
mkdirSync(OUTDIR, { recursive: true });

// 立ち姿(smile)をベースに、目と口を差し替えて表情を作る。
const BASE = readFileSync(resolve(ROOT, 'public/assets/mascot/mascot-smile.svg'), 'utf-8');

// 表情パレット：le/re=左右の目（内側○の描き替え）、mouth=口。stroke はグループ継承(navy)。
// 参照＝藤子不二雄（ドラえもん/パーマン）の"単純な線・点で感情を一発"の目表現（俊雄さん 2026-06-14）。
const FACES = {
  smile: {}, // 素：丸い持ち手リング＋微笑み（落ち着いた既定）
  jito: { // ジト目：上まぶたの横線＋低い小瞳。見抜いた/呆れ/皮肉（"業界の闇を知ってる"声）
    le: '<path d="M65 108 H87" fill="none"/><circle cx="76" cy="116" r="3.4" fill="#1a1f2e"/>',
    re: '<path d="M113 108 H135" fill="none"/><circle cx="124" cy="116" r="3.4" fill="#1a1f2e"/>',
    mouth: '<path d="M92 133 H108" fill="none"/>',
  },
  sparkle: { // キラキラ目：大きい黒目＋白ハイライト。うれしい/憧れ（前向きな乗り換え）
    le: '<circle cx="76" cy="113" r="9" fill="#1a1f2e"/><circle cx="72.5" cy="109.5" r="3.1" fill="#fbf8f3"/>',
    re: '<circle cx="124" cy="113" r="9" fill="#1a1f2e"/><circle cx="120.5" cy="109.5" r="3.1" fill="#fbf8f3"/>',
    mouth: '<path d="M89 128 Q100 144 111 128" fill="none"/>',
  },
  joy: { // ＾＾ 笑い全開・達成（やった!/解約完了/貯金できた）
    le: '<path d="M67 117 Q76 103 85 117" fill="none"/>',
    re: '<path d="M115 117 Q124 103 133 117" fill="none"/>',
    mouth: '<path d="M89 128 Q100 144 111 128" fill="none"/>',
  },
  gentle: { // ◡◡ 優しく目を細める・寄り添い（責めない・大丈夫・一緒に考えよう）
    le: '<path d="M67 114 Q76 121 85 114" fill="none"/>',
    re: '<path d="M115 114 Q124 121 133 114" fill="none"/>',
    mouth: '<path d="M92 131 q8 5 16 0" fill="none"/>',
  },
  shock: { // 点目：小さな点＋小さなお口。ハッと気づく/しまった（"気づいたら課金"）
    le: '<circle cx="76" cy="112" r="2.6" fill="#1a1f2e"/>',
    re: '<circle cx="124" cy="112" r="2.6" fill="#1a1f2e"/>',
    mouth: '<circle cx="100" cy="133" r="4" fill="none"/>',
  },
  dumbfounded: { // ・・ 極小の瞳孔＋一文字口。唖然・呆然（言葉も出ない・悪質さに呆れ）
    le: '<circle cx="76" cy="113" r="1.9" fill="#1a1f2e"/>',
    re: '<circle cx="124" cy="113" r="1.9" fill="#1a1f2e"/>',
    mouth: '<path d="M93 134 H107" fill="none"/>',
  },
  troubled: { // ＞＜ 困った・後悔
    le: '<path d="M70 106 L82 113 L70 120" fill="none"/>',
    re: '<path d="M130 106 L118 113 L130 120" fill="none"/>',
    mouth: '<path d="M91 135 q4.5 -7 9 0 q4.5 7 9 0" fill="none"/>',
  },
  wink: { // ；) ウインク・図星
    le: '<path d="M68 113 Q76 119 84 113" fill="none"/>',
    re: '<circle cx="124" cy="113" r="6" fill="#1a1f2e"/>',
    mouth: '<path d="M91 130 q9 8 18 0" fill="none"/>',
  },
  lookRight: { // → 視線右（比較・資料を見る）
    le: '<circle cx="83" cy="113" r="6" fill="#1a1f2e"/>',
    re: '<circle cx="131" cy="113" r="6" fill="#1a1f2e"/>',
  },
  lookUp: { // ↑ 視線上（思考・どこから?）
    le: '<circle cx="76" cy="106" r="6" fill="#1a1f2e"/>',
    re: '<circle cx="124" cy="106" r="6" fill="#1a1f2e"/>',
    mouth: '<path d="M93 131 H107" fill="none"/>',
  },
  determined: { // 一文字口＋前向きの黒目（決意・突破）
    le: '<circle cx="76" cy="113" r="6" fill="#1a1f2e"/>',
    re: '<circle cx="124" cy="113" r="6" fill="#1a1f2e"/>',
    mouth: '<path d="M91 132 H109" fill="none"/>',
  },
};

// base の目・口を face で差し替え、head の id をユニーク化（同一ページ複数SVGの <use> ID衝突回避）。
function faceMascot(faceKey, uid) {
  const f = FACES[faceKey] || {};
  let s = BASE
    .replace('id="front-scissors-head"', `id="head-${uid}"`)
    .replace('href="#front-scissors-head"', `href="#head-${uid}"`);
  if (f.le) s = s.replace('<circle cx="76" cy="113" r="7"/>', f.le);
  if (f.re) s = s.replace('<circle cx="124" cy="113" r="7"/>', f.re);
  if (f.mouth) s = s.replace('<path d="M91 130q9 7 18 0"/>', f.mouth);
  return s;
}

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
function pinSvg({ head, sub, face, key }) {
  const [l1, l2] = head;
  const mascot = placeMascot(faceMascot(face, key), 215, 720, 570); // 中心(500,1005)
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

// ピンの定義（PINS）と utm() は ./pins-data.mjs（API投稿器 post-pinterest.mjs と共有・単一ソース）。

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  // 各ピンを実寸（1000x1500）で保存
  for (const p of PINS) {
    await page.setViewport({ width: 1000, height: 1500, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}svg{display:block}</style></head><body>${pinSvg(p)}</body></html>`, { waitUntil: 'load' });
    await page.screenshot({ path: resolve(OUTDIR, `pin-${p.key}.png`), clip: { x: 0, y: 0, width: 1000, height: 1500 } });
  }
  console.log(`[pin] wrote ${PINS.length} pins → docs/pinterest/samples/`);
  // マニフェスト（ピン→リンク先URL+UTM・投稿時に使う）
  const manifest =
    '# Pinterest ピン → リンク先（投稿時に使うURL）\n\n' +
    '> 自動生成: `node scripts/seo/gen-pin-samples.mjs`。画像=`docs/pinterest/samples/pin-<key>.png`（1000x1500・チョキくん入り）。\n' +
    '> 俊雄さんはアカウント作成＋ドメイン認証の後、各画像を貼り、下記URLをリンク先に設定するだけ。\n\n' +
    '| 画像 | 表情 | 見出し | リンク先（UTM付き） |\n|---|---|---|---|\n' +
    PINS.map((p) => `| pin-${p.key}.png | ${p.face} | ${p.head.join('')} | ${utm(p.path, p.key)} |`).join('\n') +
    '\n';
  writeFileSync(resolve(ROOT, 'docs/pinterest/pins-manifest.md'), manifest, 'utf-8');
  console.log('[pin] wrote docs/pinterest/pins-manifest.md');
  // 表情パレット一覧（参照用 docs/pinterest/choki-faces.png・藤子不二雄風の目表現）
  const fcells = Object.keys(FACES)
    .map((k, i) => `<div style="text-align:center"><div class="f">${faceMascot(k, 'pal' + i)}</div><div style="font:16px sans-serif;color:#1a1f2e;margin-top:2px">${k}</div></div>`)
    .join('');
  const fhtml = `<!doctype html><html><head><meta charset="utf-8"><style>.f svg{width:165px;height:165px;display:block}.f{width:165px;height:165px}</style></head><body style="margin:0;background:#eef1f6;display:flex;flex-wrap:wrap;gap:6px 10px;padding:18px;align-items:flex-end;width:1090px">${fcells}</body></html>`;
  await page.setViewport({ width: 1130, height: 480, deviceScaleFactor: 2 });
  await page.setContent(fhtml, { waitUntil: 'load' });
  await page.screenshot({ path: resolve(ROOT, 'docs/pinterest/choki-faces.png'), fullPage: true });
  console.log('[pin] wrote docs/pinterest/choki-faces.png');
  // 確認用コンタクトシート（グリッド）
  const cells = PINS.map((p) => `<div class="c">${pinSvg(p)}</div>`).join('');
  const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#dfe3ea}#g{display:grid;grid-template-columns:repeat(5,200px);gap:12px;padding:16px}.c svg{width:200px;height:300px;display:block;box-shadow:0 4px 12px rgba(0,0,0,.18);border-radius:6px}</style></head><body><div id="g">${cells}</div></body></html>`;
  await page.setViewport({ width: 1072, height: 1340, deviceScaleFactor: 2 });
  await page.setContent(sheet, { waitUntil: 'load' });
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/pin-grid.png', fullPage: true });
  console.log('[pin] wrote contact grid → temp');
} finally {
  await browser.close();
}
