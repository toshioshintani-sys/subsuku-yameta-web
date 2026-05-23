// Brand Logo Registry（公式ブランドロゴ中央レジストリ）
//
// 優先順位：
//   1. simple-icons（npm でローカルバンドル・確実・3000+ ブランド）
//   2. /brand-logos/{id}.svg（Wikimedia から取得した個別 SVG・simple-icons 不在を補完）
//   3. なし → カテゴリ Lucide アイコンへフォールバック
//
// Simple Icons から削除されたブランド（商標問題）：
//   Disney+ / Amazon / Microsoft / Adobe / Hulu / ABEMA / Yahoo / LinkedIn /
//   Canva / Xbox / Nintendo / Kindle / ChatGPT / OpenAI など
//   → これらは Wikimedia SVG（public/brand-logos/）で補完

import {
  siNetflix,
  siSpotify,
  siYoutube,
  siApplemusic,
  siAppletv,
  siNotion,
  siDropbox,
  siDiscord,
  siDazn,
  siGithub,
  siGithubcopilot,
  siFigma,
  siPlaystation,
  siAudible,
  siAnthropic,
  siClaude,
  siNiconico,
  siCrunchyroll,
  siVimeo,
  siSoundcloud,
  siLine,
  siRakuten,
  siDmm,
  siRakutenkobo,
  siEvernote,
  siDeepl,
  siIcloud,
  siApple,
  siPatreon,
} from 'simple-icons';

/**
 * serviceId → simple-icons オブジェクト
 * simple-icons は { hex, path, title } を持つ
 */
export const SI_BRAND = {
  netflix: siNetflix,
  spotify: siSpotify,
  'youtube-premium': siYoutube,
  'apple-music': siApplemusic,
  'apple-tv-plus': siAppletv,
  'apple-one': siApple,
  notion: siNotion,
  dropbox: siDropbox,
  'discord-nitro': siDiscord,
  dazn: siDazn,
  'github-copilot': siGithubcopilot,
  figma: siFigma,
  'playstation-plus': siPlaystation,
  audible: siAudible,
  'claude-pro': siClaude,
  'niconico-premium': siNiconico,
  crunchyroll: siCrunchyroll,
  'vimeo-pro': siVimeo,
  'soundcloud-go': siSoundcloud,
  'line-music': siLine,
  'rakuten-music': siRakuten,
  'rakuten-tv': siRakuten,
  'rakuten-magazine': siRakuten,
  'rakuten-kobo': siRakutenkobo,
  'dmm-premium': siDmm,
  evernote: siEvernote,
  'deepl-pro': siDeepl,
  'icloud-plus': siIcloud,
  patreon: siPatreon,
};

/**
 * 一部サービスはブランドカラーを上書きしたい（より本物のアプリアイコン風）
 * 例：Netflix は黒地に赤 N が本物っぽい（公式hex は赤一色）
 */
export const BRAND_PALETTE_OVERRIDE = {
  netflix: { bg: '#000000', fg: '#E50914' },     // 黒地に赤 N（公式アプリアイコン）
  spotify: { bg: '#000000', fg: '#1ED760' },     // 黒地に緑（公式アプリアイコン）
  'apple-music': { bg: '#000000', fg: '#FA243C' }, // 黒地にピンク
  'apple-tv-plus': { bg: '#000000', fg: '#FFFFFF' }, // 黒地に白
  'apple-one': { bg: '#000000', fg: '#FFFFFF' },
  dazn: { bg: '#F8F8F5', fg: '#000000' },        // 白地に黒
  'github-copilot': { bg: '#FFFFFF', fg: '#000000' }, // 白地に黒
  notion: { bg: '#FFFFFF', fg: '#000000' },
  'claude-pro': { bg: '#FAF9F5', fg: '#D97757' },  // ベージュ系
  anthropic: { bg: '#191919', fg: '#FFFFFF' },
};

/**
 * デフォルト配色（オーバーライドが無いブランド用）
 * 公式 hex 背景 + 白いシルエット
 */
export function defaultPalette(hex) {
  return {
    bg: `#${hex}`,
    fg: '#FFFFFF',
  };
}

/**
 * serviceId からブランド情報を取得（simple-icons 優先・なければ null）
 */
export function getBrand(serviceId) {
  const si = SI_BRAND[serviceId];
  if (!si || !si.hex) return null;
  const override = BRAND_PALETTE_OVERRIDE[serviceId];
  const palette = override || defaultPalette(si.hex);
  return {
    title: si.title,
    path: si.path,           // SVG path d attribute
    bg: palette.bg,
    fg: palette.fg,
  };
}

/**
 * /brand-logos/{id}.svg が存在するか（事前定義リスト・ビルド時に決まる）
 * simple-icons に無いブランドだけ Wikimedia SVG にフォールバック
 */
export const LOCAL_SVG_AVAILABLE = new Set([
  // Wikimedia から取得済み（simple-icons に無いもの優先）
  'amazon-prime',
  'disney-plus',
  'adobe-cc',
  'linkedin-premium',
  // simple-icons とダブってる（事実上 simple-icons 優先）
  'netflix',
  'spotify',
  'youtube-premium',
  'apple-music',
  'apple-tv-plus',
  'notion',
  'dropbox',
  'figma',
  'github-copilot',
  'playstation-plus',
]);

export function hasLocalSvg(serviceId) {
  return LOCAL_SVG_AVAILABLE.has(serviceId);
}
