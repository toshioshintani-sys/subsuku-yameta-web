import { useState } from 'react';
import { CategoryIcon } from '../icons';
import styles from './ServiceIcon.module.css';

/**
 * サービスアイコン表示コンポーネント
 *
 * 優先順位：
 * 1. /brand-logos/{serviceId}.svg があれば公式ブランドロゴ
 * 2. カテゴリベースの Lucide アイコン（Tv, Music 等）
 * 3. 絵文字（最終フォールバック）
 *
 * 公式ブランドロゴは Wikimedia Commons 等から取得し、public/brand-logos/ に配置。
 * ライセンス：各企業の商標。Wikimedia の使用許諾範囲内（PD-textlogo・商標）で利用。
 */
export default function ServiceIcon({ serviceId, category, emoji, size = 48 }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = !!serviceId && !logoFailed;

  if (hasLogo) {
    return (
      <span
        className={styles.brandTile}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <img
          src={`/brand-logos/${serviceId}.svg`}
          alt=""
          className={styles.brandLogo}
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      </span>
    );
  }

  if (category) {
    return (
      <span
        className={styles.fallbackTile}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <CategoryIcon
          categoryId={category}
          size={Math.floor(size * 0.55)}
        />
      </span>
    );
  }

  return (
    <span
      className={styles.emojiFallback}
      style={{ fontSize: size * 0.65, width: size, height: size }}
      aria-hidden="true"
    >
      {emoji || '📦'}
    </span>
  );
}
