import { useEffect, useRef, useState } from 'react';
import styles from './AdSlot.module.css';

// Google AdSense の広告枠
// VITE_ADSENSE_CLIENT （ca-pub-XXXX...）が未設定の場合は何も描画しない＝完全に無害
// 各 AdSlot は slot プロパティで個別の data-ad-slot ID を渡す
//
// ⚠️ 現在どのページからも使われていない（2026-07-16）：
//   AdSense休眠（2026-07-15・docs/NOT_DOING.md参照）に伴い、未承認のまま
//   「広告」ラベル＋予約高さの空枠だけが全ページに出続けていたため、
//   4ページ（Service/DiscoverGenre/BlogPost/GameDetail）から配置を撤去した。
//   コンポーネント自体は再開トリガー（月間オーガニック1,000セッション＋記事30本）
//   到達時に再配置できるよう温存している。
//
// 配置ポリシー（STRATEGY.md / AFFILIATE_DESIGN_PRINCIPLES.md §2-1・原則B 準拠）：
//   - 解約導線を邪魔しない位置にだけ置く（解約 CTA の上には絶対置かない）
//   - 1ページ最大1スロット。HomePage には置かない
//   - 広告であることを「広告」ラベルで明示
//   - レスポンシブ・自動サイズで読み込み
//
// パフォーマンス（2026-06-04 追加）：
//   - CLS対策：枠に最初から高さを予約し、広告挿入で本文が動かないようにする
//   - 遅延ロード：IntersectionObserver でビューポート接近時のみ adsbygoogle.push
//   - SSR/プリレンダ安全：typeof window / typeof document をガード

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;

export default function AdSlot({ slot, label = '広告' }) {
  const wrapRef = useRef(null);
  const pushedRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // ビューポート接近を検知して shouldLoad を立てる（描画 ≠ ロード）
  useEffect(() => {
    if (!CLIENT || !slot) return;
    if (typeof window === 'undefined') return; // SSR/プリレンダ時は何もしない

    const el = wrapRef.current;
    if (!el) return;

    // IntersectionObserver 非対応環境ではフォールバックで即ロード
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      // ビューポート下端から 300px 手前で先読み開始（体感ラグ防止）
      { rootMargin: '300px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [slot]);

  // shouldLoad が立った瞬間にローダー注入＋push（一度だけ）
  useEffect(() => {
    if (!shouldLoad) return;
    if (!CLIENT || !slot) return;
    if (pushedRef.current) return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // AdSense ローダースクリプトを一度だけ注入
    if (!document.getElementById('adsense-script')) {
      const s = document.createElement('script');
      s.id = 'adsense-script';
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      document.head.appendChild(s);
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (err) {
      // 広告ブロッカーや初期化失敗時は静かに無視
      // eslint-disable-next-line no-console
      console.debug('[AdSlot] adsbygoogle push skipped:', err?.message);
    }
  }, [shouldLoad, slot]);

  if (!CLIENT || !slot) return null;

  return (
    <aside className={styles.wrap} aria-label={label} ref={wrapRef}>
      <div className={styles.label}>{label}</div>
      <div className={styles.reserve}>
        {shouldLoad && (
          <ins
            className={`adsbygoogle ${styles.ins}`}
            style={{ display: 'block' }}
            data-ad-client={CLIENT}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </aside>
  );
}
