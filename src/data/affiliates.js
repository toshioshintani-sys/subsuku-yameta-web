// アフィリエイトリンク統合（BAE: Behavioral Affiliate Engine）
//
// 設計原則：docs/AFFILIATE_DESIGN_PRINCIPLES.md
//
// 対応 ASP（2026-05-23時点）：
//   - A8.net（提携した8案件の追跡URLを ASP_FULL_URLS に直接マップ）
//   - もしもアフィリエイト（提携した4案件 + 楽天市場の追跡URLをマップ）
//   - Amazon アソシエイト（StoreID を ?tag= で付与・全Amazon商品で稼働）
//   - 楽天アフィリエイト（hb.afl.rakuten.co.jp/hgc/{ID}/ 形式で全楽天市場商品で稼働）
//
// 設定済み環境変数（Netlify）：
//   - VITE_AMAZON_ASSOCIATE_ID = shinta1999-22
//   - VITE_RAKUTEN_AFFILIATE_ID = 039b7990.875038c7.0ab5f5c4.4f8cf5a9
//   - VITE_A8_MEDIA_ID
//   - VITE_MOSHIMO_MEDIA_ID = 673448

// Node（vite.config の sitemap プラグイン等）から import される場合 import.meta.env が
// undefined になりうるため null-safe に読む。ブラウザビルドでは Vite が値を静的注入する。
const ENV = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const A8_MEDIA_ID = ENV.VITE_A8_MEDIA_ID;
const MOSHIMO_MEDIA_ID = ENV.VITE_MOSHIMO_MEDIA_ID;
const AMAZON_ASSOCIATE_ID = ENV.VITE_AMAZON_ASSOCIATE_ID;
const RAKUTEN_AFFILIATE_ID = ENV.VITE_RAKUTEN_AFFILIATE_ID;

// ============================================================
// ASP_FULL_URLS：俊雄さんが ASP 管理画面で取得した「完成済みの追跡 URL」
// 提携完了したら、ここに serviceId → URL でマップする
// ============================================================
export const ASP_FULL_URLS = {
  // A8.net（サブスクやめた媒体・本番稼働中）
  // ABEMAプレミアム（2026-06 提携・報酬902円）：高い動画サブからの「安い乗換先」(B層)
  'abema-premium': 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+2HB4LU+4EKC+5YRHE',

  // A8.net（その他・サブスクやめた媒体で2026-05-23 申請中→順次URL取得）
  // 'hitohana': '...',
  // 'aircloset': '...',
  // 'drobe': '...',
  // 'another-address': '...',
  // 'delipicks': '...',
  // 'every-frecious': '...',
  // 'multipure': '...',
  // 'inic-coffee': '...',

  // もしも（4案件・2026-05-23 即時提携完了・URL は管理画面から取得して埋める）
  // 'toysub': '...',
  // 'digitane': '...',
  // 'dehari-online': '...',
  // 'sakepost': '...',
};

// ============================================================
// MOSHIMO_LINKS：もしも経由の追跡 URL マップ
// 提携完了した案件をここに記録。serviceId → URL
// （discover.js では各サービスの affiliateUrl に直接埋めるパターンが主流）
// ============================================================
export const MOSHIMO_LINKS = {
  // 提携完了4案件（2026-05-23 即時提携・サブスクやめた媒体）
  'toysub': 'https://af.moshimo.com/af/c/click?a_id=5581465&p_id=4587&pc_id=11989&pl_id=61358',
  'digitane': 'https://af.moshimo.com/af/c/click?a_id=5581466&p_id=4975&pc_id=13311&pl_id=65311',
  'dehari-online': 'https://af.moshimo.com/af/c/click?a_id=5581467&p_id=3193&pc_id=7476&pl_id=41798',
  'sakepost': 'https://af.moshimo.com/af/c/click?a_id=5581468&p_id=5618&pc_id=15457&pl_id=72438',
};

// ============================================================
// A8_PROGRAMS：互換性のために残す（fullUrl 方式に統合された）
// ============================================================
export const A8_PROGRAMS = {};

// ============================================================
// Amazon アソシエイト：Amazon URL に ?tag=AMAZON_ID を付与
// ============================================================
const AMAZON_HOSTS = ['amazon.co.jp', 'amazon.com', 'www.amazon.co.jp', 'www.amazon.com'];

function withAmazonTag(url) {
  if (!AMAZON_ASSOCIATE_ID || !url) return url;
  try {
    const u = new URL(url);
    if (!AMAZON_HOSTS.includes(u.hostname)) return url;
    u.searchParams.set('tag', AMAZON_ASSOCIATE_ID);
    return u.toString();
  } catch {
    return url;
  }
}

// ============================================================
// 楽天アフィリエイト：楽天 URL を hb.afl.rakuten.co.jp 形式に変換
// 形式: https://hb.afl.rakuten.co.jp/hgc/{ID}/?pc=<encoded_url>&link_type=text
// ============================================================
const RAKUTEN_HOSTS = [
  'rakuten.co.jp',
  'www.rakuten.co.jp',
  'item.rakuten.co.jp',
  'books.rakuten.co.jp',
  'travel.rakuten.co.jp',
  'magazine.rakuten.co.jp',
  'event.rakuten.co.jp',
];

function isRakutenUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return RAKUTEN_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

function withRakutenAffiliate(url) {
  if (!RAKUTEN_AFFILIATE_ID || !url) return url;
  if (!isRakutenUrl(url)) return url;
  const encoded = encodeURIComponent(url);
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encoded}&link_type=text&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJ0ZXh0In0=`;
}

// ============================================================
// 公開関数：外部リンクをアフィリエイト追跡 URL に変換
// ============================================================

/**
 * @param {string} serviceId 内部サービスID（例: 'netflix'）
 * @param {string} originalUrl 元の外部リンク
 * @returns {string} アフィリエイト URL または 元の URL（フォールバック）
 */
export function getAffiliateUrl(serviceId, originalUrl) {
  // 1. ASP_FULL_URLS に直接マップがあれば最優先
  if (serviceId && ASP_FULL_URLS[serviceId]) {
    return ASP_FULL_URLS[serviceId];
  }

  // 2. もしも経由のマップ
  if (serviceId && MOSHIMO_LINKS[serviceId]) {
    return MOSHIMO_LINKS[serviceId];
  }

  // 3. Amazon URL なら ?tag= を付与
  if (originalUrl) {
    const amazonized = withAmazonTag(originalUrl);
    if (amazonized !== originalUrl) return amazonized;

    // 4. 楽天 URL なら hb.afl 形式に変換
    const rakutenized = withRakutenAffiliate(originalUrl);
    if (rakutenized !== originalUrl) return rakutenized;
  }

  // 5. それ以外は元の URL（フォールバック）
  return originalUrl;
}

/**
 * Amazon の任意検索クエリへのアフィリエイトリンクを生成
 * 「やめた後の都度購入」用に使う
 * @param {string} query 検索キーワード
 * @returns {string} Amazon 検索 URL（tag付き）
 */
export function buildAmazonSearchUrl(query) {
  const base = `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}`;
  return withAmazonTag(base);
}

/**
 * 楽天市場の任意検索クエリへのアフィリエイトリンクを生成
 * @param {string} query 検索キーワード
 * @returns {string} 楽天市場検索 URL（アフィリエイト変換済み）
 */
export function buildRakutenSearchUrl(query) {
  const base = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(query)}/`;
  // 楽天検索URLは hb.afl 形式に変換できないので、id=tagで対応
  if (!RAKUTEN_AFFILIATE_ID) return base;
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encodeURIComponent(base)}&link_type=text`;
}

// ============================================================
// GA4 イベント送信（BAE 設計原則の計測ルール準拠）
// ============================================================

/**
 * アフィリエイトクリックを GA4 にイベントとして送信
 * @param {object} params
 * @param {string} params.asp - 'a8' | 'moshimo' | 'amazon' | 'rakuten'
 * @param {string} params.service - サービスID または検索キーワード
 * @param {string} params.placement - 'service_page_bottom' | 'discover_genre' | 'yamete_kau' | 'blog_inline' | 'home_hero'
 * @param {number} params.position - 厳選3つ中の何番目か（1/2/3）
 * @param {string} [params.layer] - 3層モデル 'A' | 'B' | 'C'（BAE憲法 §14・どの層から発生したクリックか）
 */
export function trackAffiliateClick(params) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', 'affiliate_click', {
      asp: params.asp || 'unknown',
      service: params.service || 'unknown',
      placement: params.placement || 'unknown',
      position: params.position || 0,
      layer: params.layer || 'unknown',
    });
  } catch {
    // 失敗してもユーザー体験は阻害しない
  }
}

/**
 * URL から ASP 種別を自動判定
 * @param {string} url
 * @returns {'a8' | 'moshimo' | 'amazon' | 'rakuten' | 'direct'}
 */
export function detectAsp(url) {
  if (!url) return 'direct';
  if (url.includes('px.a8.net')) return 'a8';
  if (url.includes('af.moshimo.com')) return 'moshimo';
  if (url.includes('hb.afl.rakuten.co.jp')) return 'rakuten';
  if (url.includes('amazon.co.jp') || url.includes('amazon.com')) return 'amazon';
  return 'direct';
}

// ============================================================
// デバッグ・統計用
// ============================================================

/**
 * 設定済みアフィの統計
 */
export function getAffiliateStats() {
  return {
    aspFull: Object.keys(ASP_FULL_URLS).length,
    moshimo: Object.keys(MOSHIMO_LINKS).length,
    amazonEnabled: !!AMAZON_ASSOCIATE_ID,
    rakutenEnabled: !!RAKUTEN_AFFILIATE_ID,
    a8MediaConfigured: !!A8_MEDIA_ID,
    moshimoMediaConfigured: !!MOSHIMO_MEDIA_ID,
  };
}
