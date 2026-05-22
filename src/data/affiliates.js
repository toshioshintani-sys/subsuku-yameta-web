// アフィリエイトリンク統合
//
// 設計：
//   - ALTERNATIVES（services.js）の外部リンクを、ASP の追跡 URL でラップする
//   - ASP ID は Netlify 環境変数（VITE_*）から読む。未設定でも壊れない
//   - 設定済みなら ASP 経由のリンクを返し、未設定なら元の URL を返す（フォールバック）
//
// 対応 ASP：
//   - A8.net（最も多い案件・主力）
//   - もしもアフィリエイト（Amazon・楽天・カエレバ系も）
//   - Amazon アソシエイト（直）
//
// 俊雄さんの設定手順は docs/AFFILIATE_SETUP.md を参照

const A8_MEDIA_ID = import.meta.env.VITE_A8_MEDIA_ID;       // 例: a10040418585
const MOSHIMO_MEDIA_ID = import.meta.env.VITE_MOSHIMO_MEDIA_ID; // 例: 1184296
const AMAZON_ASSOCIATE_ID = import.meta.env.VITE_AMAZON_ASSOCIATE_ID; // 例: subsuku-22

// サービス id → A8 のプログラム ID（提携承認後に取得して埋める）
// 俊雄さんが A8 で提携承認されたら、ここに記入するだけで全リンクが切り替わる
// プログラム ID と広告 ID（s00000000000xxxxxxx）の組合せ
// 例: u-next: { program: 'p00000000000xxxxx', ad: 's00000000000yyyyy' }
export const A8_PROGRAMS = {
  // 提携承認後に俊雄さんが追記
  // 'u-next': { program: '', ad: '' },
  // 'hulu': { program: '', ad: '' },
  // 'dazn': { program: '', ad: '' },
  // 'adobe-cc': { program: '', ad: '' },
  // 'audible': { program: '', ad: '' },
  // 'kindle-unlimited': { program: '', ad: '' },
  // 'amazon-prime': { program: '', ad: '' },
  // 'danime': { program: '', ad: '' },
};

// もしもアフィリエイトでカバーするサービス
// 楽天系・Amazon系・特定の案件
// 形式: そのまま追跡URL（俊雄さんが「リンク作成」でコピーしたもの）を入れる
export const MOSHIMO_LINKS = {
  // 'rakuten-magazine': 'https://af.moshimo.com/af/c/click?...',
  // 'rakuten-music': 'https://af.moshimo.com/af/c/click?...',
  // 'rakuten-kobo': 'https://af.moshimo.com/af/c/click?...',
};

// Amazon アソシエイトでカバーするサービス（associate id を末尾につけるだけ）
const AMAZON_HOSTS = ['amazon.co.jp', 'amazon.com', 'www.amazon.co.jp', 'www.amazon.com'];

function withAmazonTag(url) {
  if (!AMAZON_ASSOCIATE_ID) return url;
  try {
    const u = new URL(url);
    if (!AMAZON_HOSTS.includes(u.hostname)) return url;
    u.searchParams.set('tag', AMAZON_ASSOCIATE_ID);
    return u.toString();
  } catch {
    return url;
  }
}

function buildA8Url(serviceId) {
  const cfg = A8_PROGRAMS[serviceId];
  if (!cfg || !cfg.program || !cfg.ad || !A8_MEDIA_ID) return null;
  // A8 の追跡 URL は媒体IDによって形式が違うが、最も標準的な形式：
  // https://px.a8.net/svt/ejp?a8mat=<program>+<random>+<medium>+<ad>
  // 厳密には A8 管理画面で発行された URL をそのまま使うのが安全
  // ここでは「俊雄さんが管理画面で取得したリンクをそのまま入れる」運用を推奨
  // → A8_PROGRAMS の値を { fullUrl: '...' } に変えるのが現実的
  return null; // 未確定。fullUrl 方式に移行
}

// シンプルで確実な方式：
// 俊雄さんが ASP 管理画面で取得した「完成済みの追跡 URL」をそのまま入れる
// それを ASP_FULL_URLS としてマップする
export const ASP_FULL_URLS = {
  // フォーマット：serviceId → 完成済みの追跡 URL
  // 例（架空）：
  // 'u-next': 'https://px.a8.net/svt/ejp?a8mat=ABCDEFG+HIJKLM',
  // 'rakuten-magazine': 'https://af.moshimo.com/af/c/click?a_id=...',
};

/**
 * 外部リンクをアフィリエイト追跡 URL に変換する
 * @param {string} serviceId - 内部サービスID（例: 'u-next'）
 * @param {string} originalUrl - 元の外部リンク URL
 * @returns {string} アフィリエイト URL（設定があれば）または元の URL
 */
export function getAffiliateUrl(serviceId, originalUrl) {
  // 1. ASP_FULL_URLS に直接マップがあれば、それを返す（最優先）
  if (ASP_FULL_URLS[serviceId]) {
    return ASP_FULL_URLS[serviceId];
  }

  // 2. もしも経由
  if (MOSHIMO_LINKS[serviceId]) {
    return MOSHIMO_LINKS[serviceId];
  }

  // 3. Amazon アソシエイト（URL ホストで判定）
  return withAmazonTag(originalUrl);
}

/**
 * 設定済みアフィの数（管理画面/デバッグ用）
 */
export function getAffiliateStats() {
  return {
    a8: Object.keys(A8_PROGRAMS).filter((k) => A8_PROGRAMS[k]?.program).length,
    moshimo: Object.keys(MOSHIMO_LINKS).length,
    aspFull: Object.keys(ASP_FULL_URLS).length,
    amazonEnabled: !!AMAZON_ASSOCIATE_ID,
  };
}
