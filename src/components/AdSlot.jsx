import { useEffect, useRef } from 'react';
import styles from './AdSlot.module.css';

// Google AdSense の広告枠
// VITE_ADSENSE_CLIENT （ca-pub-XXXX...）が未設定の場合は何も描画しない＝完全に無害
// 各 AdSlot は slot プロパティで個別の data-ad-slot ID を渡す
//
// 配置ポリシー（STRATEGY.md準拠）：
//   - 解約導線を邪魔しない位置にだけ置く（解約ボタンの上には絶対置かない）
//   - 1ページ最大1スロット。HomePage には置かない
//   - 広告であることを「広告」ラベルで明示
//   - レスポンシブ・自動サイズで読み込み

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;

export default function AdSlot({ slot, label = '広告' }) {
  const ref = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!CLIENT || !slot) return;
    if (pushedRef.current) return;

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
  }, [slot]);

  if (!CLIENT || !slot) return null;

  return (
    <aside className={styles.wrap} aria-label={label}>
      <div className={styles.label}>{label}</div>
      <ins
        ref={ref}
        className={`adsbygoogle ${styles.ins}`}
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
