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
 */
export default function ServiceIcon({ serviceId, category, emoji, size = 48 }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = !!serviceId && !logoFailed;

  if (hasLogo) {
    // 公式ブランドロゴ：角丸タイルの中に SVG を中央配置
    // padding は固定 px で確実に効かせる
    const innerPadding = Math.max(4, Math.round(size * 0.14));
    return (
      <span
        className={styles.brandTile}
        style={{
          width: size,
          height: size,
          padding: innerPadding,
        }}
        aria-hidden="true"
      >
        <img
          src={`/brand-logos/${serviceId}.svg`}
          alt=""
          className={styles.brandLogo}
          width={size - innerPadding * 2}
          height={size - innerPadding * 2}
          style={{
            width: size - innerPadding * 2,
            height: size - innerPadding * 2,
          }}
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
      style={{
        fontSize: size * 0.65,
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      {emoji || '📦'}
    </span>
  );
}
