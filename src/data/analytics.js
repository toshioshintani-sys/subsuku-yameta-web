// UI 行動イベントの GA4 送信（affiliate_click 以外の軽量イベント用）
//
// 背景（2026-07-16）：トップページの構成論争（計算機の配置・Top10の導線）が
// 「セクション単位の到達・利用データが一切ない」ために理論の空中戦になった。
// 次に同じ議論をするとき実測で決着できるよう、最小限のイベントを仕込む。
// 計測するのは操作と到達のみ。個人情報・入力内容そのものは送らない。

/**
 * UI イベントを GA4 に送信（gtag 未ロード時は何もしない）
 * @param {string} name - イベント名（例: 'home_calc_open'）
 * @param {object} [params] - 追加パラメータ
 */
export function trackUiEvent(name, params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', name, params);
  } catch {
    // 計測失敗でユーザー体験を阻害しない
  }
}
