// Pinterest ピンの単一ソース。gen-pin-samples.mjs（画像生成）と post-pinterest.mjs（API投稿）が共有する。
// face=表情（FACESパレット）, path=リンク先, head=見出し2行, sub=説明（両論併記/正直）。

import { SITE_URL } from './site-url.mjs';

export const SITE = SITE_URL;

export const PINS = [
  // 入口（index）
  { key: 'tracker', path: '/tracker', face: 'jito', head: ['使ってないサブスク、', '年でいくら払ってる?'], sub: '1分で棚卸し・無料・登録不要' },
  { key: 'buyout', path: '/yamete-kau', face: 'sparkle', head: ['月額をやめて、', '買い切りに。'], sub: '向く人・向かない人で正直に比較' },
  { key: 'games', path: '/games', face: 'gentle', head: ['「解約できない」は、', '意志の弱さじゃない。'], sub: '課金のクセを30秒ゲームで見抜く' },
  // 判断ゲーム
  { key: 'g-sunk', path: '/games/sunk-cost', face: 'dumbfounded', head: ['8ヶ月払って、', '一度も開いてない。'], sub: '「もったいない」で続けてない? 30秒で' },
  { key: 'g-status', path: '/games/status-quo', face: 'jito', head: ['解約3クリック、', '継続0クリック。'], sub: '動かない=払い続ける、の正体' },
  { key: 'g-loss', path: '/games/loss-aversion', face: 'troubled', head: ['「今やめると損」で、', '足が止まってない?'], sub: '引き止め画面の心理を見抜く' },
  { key: 'g-default', path: '/games/default-effect', face: 'shock', head: ['チェックは、', '最初から入ってた。'], sub: '"何もしない"を向こうは計算してる' },
  { key: 'g-plan', path: '/games/planning-fallacy', face: 'wink', head: ['「来月こそ使う」、', '毎月言ってない?'], sub: '未来の自分を、少し過信してる' },
  { key: 'g-decoy', path: '/games/decoy-effect', face: 'jito', head: ['なぜいつも、', '真ん中のプラン?'], sub: '松竹梅の"竹"は仕組まれてる' },
  // ブログ
  { key: 'b-whycant', path: '/blog/why-cant-cancel', face: 'jito', head: ['サブスクは、', 'わざとやめにくい。'], sub: 'ダークパターンの仕組みと対策' },
  { key: 'b-retention', path: '/blog/how-to-survive-retention-screen', face: 'determined', head: ['引き止め画面で、', '心を折られない。'], sub: '突破する3つのコツ' },
  { key: 'b-yearly', path: '/blog/monthly-vs-yearly-plan', face: 'lookRight', head: ['年契約と月契約、', '結局どっちが得?'], sub: '判断軸と計算式を公開' },
  { key: 'b-whencancel', path: '/blog/when-to-cancel', face: 'lookUp', head: ['解約は、', 'いつ押すのが正解?'], sub: '請求日・月末・更新月の使い分け' },
  { key: 'b-autorenew', path: '/blog/auto-renewal-pitfalls', face: 'shock', head: ['「気づいたら', '課金されてた」を防ぐ'], sub: '自動更新の落とし穴と対策' },
  { key: 'b-gym', path: '/blog/gym-cancel-to-home-training', face: 'joy', head: ['ジムをやめて、', '自宅トレに。'], sub: '何ヶ月で元が取れる? 向き不向きも' },
  { key: 'b-adobe', path: '/blog/adobe-cc-to-buyout-alternative', face: 'lookRight', head: ['Adobe CCが高い人へ。', '買い切りで済む線。'], sub: '現実的なラインを正直に' },
  { key: 'b-budget', path: '/blog/family-budget-review-order', face: 'lookUp', head: ['家計の見直し、', 'どこから手をつける?'], sub: '優先順位の決め方' },
  // サブスク図鑑（discover）
  { key: 'd-coffee', path: '/discover/coffee-subscription', face: 'sparkle', head: ['やめた月額で、', 'コーヒー定期便。'], sub: '卒業→入学。向く人・向かない人' },
  { key: 'd-frozen', path: '/discover/frozen-meal', face: 'lookRight', head: ['冷凍弁当・宅食、', '自炊と比べてどう?'], sub: '特徴と弱点で比較' },
  { key: 'd-water', path: '/discover/water-server', face: 'lookRight', head: ['ウォーターサーバー、', '浄水ポットとどっち?'], sub: '年いくら変わるか正直に' },
];

// テーマキー（UTM campaign＝Pinterestボードのキーを兼ねる）
export function themeKey(path) {
  if (path.startsWith('/games')) return 'psychology';
  if (path.startsWith('/blog')) return 'blog';
  if (path.startsWith('/discover')) return 'compare';
  if (path.includes('yamete')) return 'buyout';
  return 'fixed-cost';
}

export function utm(path, slug) {
  return `${SITE}${path}${path.includes('?') ? '&' : '?'}utm_source=pinterest&utm_medium=social&utm_campaign=${themeKey(path)}`;
}

// Pinterestボード（API投稿時に存在しなければ自動作成）。煽り・ランキングなし。
export const BOARDS = {
  'fixed-cost': { name: '固定費の見直し・サブスク棚卸し', description: '使っていないサブスクの棚卸しと、固定費の見直し。煽らず・両論併記で。' },
  buyout: { name: 'やめて買い切り（卒業→入学）', description: '月額をやめて単発購入で済ます選択肢。向く人・向かない人を正直に。' },
  compare: { name: 'サブスク比較（特徴と弱点つき）', description: '乗り換え先を、良い点だけでなく弱点つきで。ランキングや★はつけません。' },
  psychology: { name: '課金の心理（遊んで見抜く）', description: '解約をやめられない心のクセを、ミニゲームで体験して見抜く。' },
  blog: { name: 'サブスクのお役立ち（解約・乗り換え）', description: '解約・乗り換え・買い切り化を、煽りなし・両論併記で解説。' },
};

// 1ピン → 投稿メタ（API用）。imageは公開URL化したPNG。
export function pinMeta(p) {
  return {
    key: p.key,
    title: p.head.join('').slice(0, 100),
    description: `${p.sub}｜サブスクやめた（解約・乗り換え・買い切り）`,
    link: utm(p.path, p.key),
    imageUrl: `${SITE}/pins/pin-${p.key}.png`,
    boardKey: themeKey(p.path),
  };
}
