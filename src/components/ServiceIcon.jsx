import { useState } from 'react';
import { CategoryIcon } from '../icons';
import { getBrand, hasLocalSvg } from '../icons/brand-registry';
import styles from './ServiceIcon.module.css';

/**
 * サービスアイコン表示コンポーネント
 *
 * 優先順位：
 * 1. simple-icons にあれば → ブランドカラー背景 + 白いシルエット（公式アプリアイコン風）
 * 2. /brand-logos/{serviceId}.svg があれば → そのまま表示
 * 3. なければ → カテゴリ Lucide アイコン（accent-soft タイル）
 * 4. それも無理 → 絵文字
 */
export default function ServiceIcon({ serviceId, category, emoji, size = 48 }) {
  const [localSvgFailed, setLocalSvgFailed] = useState(false);

  // 1. Simple Icons から SVG path で直接描画
  const brand = serviceId ? getBrand(serviceId) : null;
  if (brand) {
    const innerSize = Math.round(size * 0.55);
    return (
      <span
        className={styles.brandTile}
        style={{
          width: size,
          height: size,
          backgroundColor: brand.bg,
          borderColor: brand.bg === '#FFFFFF' ? 'var(--border)' : 'transparent',
        }}
        title={brand.title}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={innerSize}
          height={innerSize}
          fill={brand.fg}
          role="img"
          style={{ display: 'block' }}
        >
          <path d={brand.path} />
        </svg>
      </span>
    );
  }

  // 2. ローカル SVG ファイルがあれば表示
  if (serviceId && hasLocalSvg(serviceId) && !localSvgFailed) {
    const innerPadding = Math.max(4, Math.round(size * 0.14));
    const inner = size - innerPadding * 2;
    return (
      <span
        className={styles.brandTile}
        style={{
          width: size,
          height: size,
          padding: innerPadding,
          backgroundColor: 'var(--surface)',
        }}
        aria-hidden="true"
      >
        <img
          src={`/brand-logos/${serviceId}.svg`}
          alt=""
          width={inner}
          height={inner}
          style={{ width: inner, height: inner, display: 'block', objectFit: 'contain' }}
          loading="lazy"
          onError={() => setLocalSvgFailed(true)}
        />
      </span>
    );
  }

  // 3. カテゴリ Lucide アイコン
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

  // 4. 絵文字（最終）
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
