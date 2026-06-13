// Pinterest ピンのサンプル生成（チョキくん入り・1000x1500）。
//
// 目的: 「チョキくんを全広報素材の標準キャラに」（俊雄さん GO・2026-06-14）。
// 無味な数字ピンではなく、ブランドの顔=チョキくんが各テーマの表情で出るピンを量産する土台。
// テーマ別に表情を使い分ける: cutting=解約/買い切り, thinking=比較/判断, lost=「まだ払ってる?」,
// celebrate=節約達成, smile=デフォルト。
//
// 出力: docs/pinterest/samples/pin-<key>.png（1000x1500）＋ pins-manifest.md（ピン→URL）＋ contact grid（temp・確認用）。
// 再生成: node scripts/seo/gen-pin-samples.mjs
//
// 【将来の拡張：表情は"目玉"で増やせる（俊雄さん 2026-06-14）】
// チョキくんの表情は固定5種(smile/thinking/celebrate/lost/cutting)に縛られない。
// 目＝持ち手リング circle(76,113)/(124,113) r17＋瞳r7、口＝path "M91 130q9 7 18 0"。
// placeMascot 後に SVG の目（瞳のcx/cy/r）と口のpathを差し替えれば、驚き/ウインク/半目/上目遣い等を
// コードで量産できる（新しいSVGファイルを起こさず表情バリエーションを増やす）。要時に eye-variant 関数を追加する。
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
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

// 本番バッチ。head=瞬間の描写（煽らない）2行・sub=両論併記/正直。path=実在の確定URL（posts.js/discover.js/biasGamesと突合済＝404なし）。
// テーマで表情を使い分け（cutting=解約/買い切り, thinking=比較/判断, lost=「まだ払ってる?」, smile=汎用）。
const PINS = [
  // 入口（index）
  { key: 'tracker', path: '/tracker', exp: 'lost', head: ['使ってないサブスク、', '年でいくら払ってる?'], sub: '1分で棚卸し・無料・登録不要' },
  { key: 'buyout', path: '/yamete-kau', exp: 'cutting', head: ['月額をやめて、', '買い切りに。'], sub: '向く人・向かない人で正直に比較' },
  { key: 'games', path: '/games', exp: 'thinking', head: ['「解約できない」は、', '意志の弱さじゃない。'], sub: '課金のクセを30秒ゲームで見抜く' },
  // 判断ゲーム
  { key: 'g-sunk', path: '/games/sunk-cost', exp: 'thinking', head: ['8ヶ月払って、', '一度も開いてない。'], sub: '「もったいない」で続けてない? 30秒で' },
  { key: 'g-status', path: '/games/status-quo', exp: 'lost', head: ['解約3クリック、', '継続0クリック。'], sub: '動かない=払い続ける、の正体' },
  { key: 'g-loss', path: '/games/loss-aversion', exp: 'thinking', head: ['「今やめると損」で、', '足が止まってない?'], sub: '引き止め画面の心理を見抜く' },
  { key: 'g-default', path: '/games/default-effect', exp: 'lost', head: ['チェックは、', '最初から入ってた。'], sub: '"何もしない"を向こうは計算してる' },
  { key: 'g-plan', path: '/games/planning-fallacy', exp: 'thinking', head: ['「来月こそ使う」、', '毎月言ってない?'], sub: '未来の自分を、少し過信してる' },
  { key: 'g-decoy', path: '/games/decoy-effect', exp: 'thinking', head: ['なぜいつも、', '真ん中のプラン?'], sub: '松竹梅の"竹"は仕組まれてる' },
  // ブログ
  { key: 'b-whycant', path: '/blog/why-cant-cancel', exp: 'thinking', head: ['サブスクは、', 'わざとやめにくい。'], sub: 'ダークパターンの仕組みと対策' },
  { key: 'b-retention', path: '/blog/how-to-survive-retention-screen', exp: 'cutting', head: ['引き止め画面で、', '心を折られない。'], sub: '突破する3つのコツ' },
  { key: 'b-yearly', path: '/blog/monthly-vs-yearly-plan', exp: 'thinking', head: ['年契約と月契約、', '結局どっちが得?'], sub: '判断軸と計算式を公開' },
  { key: 'b-whencancel', path: '/blog/when-to-cancel', exp: 'thinking', head: ['解約は、', 'いつ押すのが正解?'], sub: '請求日・月末・更新月の使い分け' },
  { key: 'b-autorenew', path: '/blog/auto-renewal-pitfalls', exp: 'lost', head: ['「気づいたら', '課金されてた」を防ぐ'], sub: '自動更新の落とし穴と対策' },
  { key: 'b-gym', path: '/blog/gym-cancel-to-home-training', exp: 'cutting', head: ['ジムをやめて、', '自宅トレに。'], sub: '何ヶ月で元が取れる? 向き不向きも' },
  { key: 'b-adobe', path: '/blog/adobe-cc-to-buyout-alternative', exp: 'cutting', head: ['Adobe CCが高い人へ。', '買い切りで済む線。'], sub: '現実的なラインを正直に' },
  { key: 'b-budget', path: '/blog/family-budget-review-order', exp: 'thinking', head: ['家計の見直し、', 'どこから手をつける?'], sub: '優先順位の決め方' },
  // サブスク図鑑（discover）
  { key: 'd-coffee', path: '/discover/coffee-subscription', exp: 'smile', head: ['やめた月額で、', 'コーヒー定期便。'], sub: '卒業→入学。向く人・向かない人' },
  { key: 'd-frozen', path: '/discover/frozen-meal', exp: 'thinking', head: ['冷凍弁当・宅食、', '自炊と比べてどう?'], sub: '特徴と弱点で比較' },
  { key: 'd-water', path: '/discover/water-server', exp: 'thinking', head: ['ウォーターサーバー、', '浄水ポットとどっち?'], sub: '年いくら変わるか正直に' },
];

const UTM = (path) => {
  const camp = path.startsWith('/games') ? 'psychology' : path.startsWith('/blog') ? 'blog' : path.startsWith('/discover') ? 'compare' : path.includes('yamete') ? 'buyout' : 'fixed-cost';
  return `https://sabusuku.netlify.app${path}?utm_source=pinterest&utm_medium=social&utm_campaign=${camp}`;
};

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
    PINS.map((p) => `| pin-${p.key}.png | ${p.exp} | ${p.head.join('')} | ${UTM(p.path)} |`).join('\n') +
    '\n';
  writeFileSync(resolve(ROOT, 'docs/pinterest/pins-manifest.md'), manifest, 'utf-8');
  console.log('[pin] wrote docs/pinterest/pins-manifest.md');
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
