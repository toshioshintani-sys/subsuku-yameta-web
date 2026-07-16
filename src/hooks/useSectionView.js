import { useEffect, useRef } from 'react';
import { trackUiEvent } from '../data/analytics';

// セクション到達計測（1セクション1回だけ・40%見えたら発火）。
// トップページの「どこまでスクロールされているか」を GA4 の
// home_section_view {section} で取れるようにする（2026-07-16 構成論争の再発防止）。
// prerender（SSG）では window / IntersectionObserver が無いので何もしない。
export function useSectionView(name) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !fired) {
            fired = true;
            trackUiEvent('home_section_view', { section: name });
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [name]);

  return ref;
}
