import { POST_BY_SLUG } from './posts';
import { SERVICES } from './services';

// サービスページ ⇔ 記事の相互内部リンク（2026-07-25）
//
// 背景：GSCで「figma 解約方法」90回表示/0クリック・平均掲載順位14位のように、
// 表示は取れているのに順位が上がりきらないサービスページが多数ある一方、
// 記事(40本)とサービスページ(67件)の間に内部リンクが一本も無かった。
// 内部リンクは自サイト内でオーソリティを流し込める数少ない手段であり、
// discovery型チャネル（X/Pinterest/Threads＝2026-07-25に失敗確定）と違って
// 外部プラットフォームに依存せず、コストゼロで実行できる。
//
// 設計：67サービス×40記事を手書きで対応付けると保守できないため、
// (1)個別指定 →(2)難易度ルール →(3)カテゴリルール →(4)全サービス共通
// の順に積み上げ、重複を除いて上位N件を返す。記事が増えても表だけ直せばよい。

// (1) 個別マッピング：そのサービス固有の深い記事があるものだけ
const BY_SERVICE = {
  'microsoft-365': ['microsoft365-vs-perpetual-office'],
  'adobe-cc': ['adobe-cc-to-buyout-alternative'],
  netflix: ['graduated-netflix-tried-flower-subscription'],
  spotify: ['graduated-spotify-tried-coffee-subscription'],
  dazn: ['world-cup-2026-where-to-watch-free'],
  'abema-premium': ['world-cup-2026-where-to-watch-free'],
};

// (2) 難易度ルール：解約が重いサービスには引き止め対策の記事を優先で添える
const BY_DIFFICULTY = {
  hard: ['how-to-survive-retention-screen', 'why-cant-cancel'],
  medium: ['how-to-survive-retention-screen'],
  easy: [],
};

// (3) カテゴリルール：そのジャンルで判断材料になる記事
const BY_CATEGORY = {
  video: ['family-sharing-subscription', 'monthly-vs-yearly-plan'],
  music: ['family-sharing-subscription'],
  software: ['monthly-vs-yearly-plan', 'bonus-season-fixed-cost-yearly-vs-buyout'],
  game: ['family-sharing-subscription'],
  news: ['monthly-vs-yearly-plan'],
  shopping: ['auto-renewal-pitfalls'],
  other: ['auto-renewal-pitfalls'],
};

// (4) 全サービス共通：どのページから来た人にも役立つ土台の記事
const COMMON = [
  'when-to-cancel',
  'app-vs-browser-billing',
  'auto-renewal-pitfalls',
  'subscription-cant-press-cancel-commitment-bias',
];

/**
 * サービスページに添える関連記事を返す（存在する記事だけ・最大 limit 件）
 * @param {{id: string, category: string, difficulty: string}} service
 * @param {number} limit
 */
export function getGuidesForService(service, limit = 3) {
  if (!service) return [];
  const ordered = [
    ...(BY_SERVICE[service.id] || []),
    ...(BY_DIFFICULTY[service.difficulty] || []),
    ...(BY_CATEGORY[service.category] || []),
    ...COMMON,
  ];
  const seen = new Set();
  const picked = [];
  for (const slug of ordered) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const post = POST_BY_SLUG[slug];
    if (post) picked.push(post);
    if (picked.length >= limit) break;
  }
  return picked;
}

/**
 * 記事ページに添える「関連するサービスの解約手順」を返す。
 * 記事本文が実際にリンクしているサービスを最優先し、足りなければ
 * タグに対応する定番サービスで補う（無関係なサービスは足さない）。
 * @param {{slug: string, tags?: string[], body?: Array}} post
 * @param {number} limit
 */
export function getServicesForPost(post, limit = 4) {
  if (!post) return [];

  // 本文中の /service/xxx 参照を拾う（記事が実際に触れているサービス）
  // 末尾スラッシュの有無どちらにも対応する（記事本文の表記ゆれに依存させない）
  const mentioned = new Set();
  const scan = (text) => {
    if (typeof text !== 'string') return;
    for (const m of text.matchAll(/\/service\/([a-z0-9-]+)/g)) mentioned.add(m[1]);
  };
  (post.body || []).forEach((b) => {
    scan(b.text);
    (b.items || []).forEach(scan);
  });

  // タグ → 補完に使うサービス（記事テーマと素直に対応するものだけ）
  const TAG_SERVICES = {
    Office: ['microsoft-365'],
    Adobe: ['adobe-cc'],
    コーヒー: ['spotify'],
    ワールドカップ: ['dazn', 'abema-premium'],
    家族シェア: ['netflix', 'spotify', 'youtube-premium'],
    年契約: ['microsoft-365', 'adobe-cc'],
    アプリ課金: ['spotify', 'youtube-premium'],
  };
  const fromTags = (post.tags || []).flatMap((t) => TAG_SERVICES[t] || []);

  const ids = [...mentioned, ...fromTags];
  const seen = new Set();
  const picked = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const svc = SERVICES.find((s) => s.id === id);
    if (svc) picked.push(svc);
    if (picked.length >= limit) break;
  }
  return picked;
}
