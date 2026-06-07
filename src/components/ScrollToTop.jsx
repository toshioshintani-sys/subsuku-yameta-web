import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ルート遷移のたびにページ最上部へスクロールする。
 *
 * SPA（BrowserRouter）はデフォルトで前ページのスクロール位置を引き継ぐため、
 * リンクをクリックして次ページに移ると「先頭でなく中盤」から表示されてストレスになる。
 * これを解消し、遷移先は常に最上部から見せる。
 *
 * ハッシュ（/path#section）付きの遷移はアンカー位置を尊重して当該要素へスクロールする。
 * 同一ページ内の戻る/進む（履歴）でも pathname が変わればトップへ戻す。
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    // 即時に最上部へ（smoothにすると遷移が重く見えるため瞬間移動）
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
