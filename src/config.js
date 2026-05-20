// 本番 URL は環境変数 VITE_SITE_URL でオーバーライド可能。
// 独自ドメインへの切り替え時はここまたは Netlify の Env で差し替える。
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL || 'https://sabusuku.netlify.app').replace(/\/+$/, '');

export const SITE_NAME = 'サブスクやめた';
