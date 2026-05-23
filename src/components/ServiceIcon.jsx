import { useState } from 'react';
import { CategoryIcon } from '../icons';
import { getBrand, hasLocalSvg } from '../icons/brand-registry';
import styles from './ServiceIcon.module.css';

/**
 * サービスアイコン表示コンポーネント
 *
 * 5段階フォールバック（すべて無料・認証不要・課金リスク 0）：
 * 1. simple-icons（ローカル・公式着色）→ 主要29サービス
 * 2. ローカル SVG /brand-logos/{id}.svg（Wikimedia から取得した個別 SVG）
 * 3. Google Favicon API（domain ベース・無料無制限）→ 表示保証
 * 4. DuckDuckGo Icons API（Google Favicon の予備）
 * 5. カテゴリ Lucide アイコン → 最終フォールバック
 */
export default function ServiceIcon({ serviceId, domain, category, emoji, size = 48 }) {
  const [localSvgFailed, setLocalSvgFailed] = useState(false);
  const [googleFailed, setGoogleFailed] = useState(false);
  const [duckFailed, setDuckFailed] = useState(false);

  // 1. simple-icons：最優先・最も品質高い・公式カラー塗り
  const brand = serviceId ? getBrand(serviceId) : null;
  if (brand) {
    const innerSize = Math.round(size * 0.55);
    const isLightBg = brand.bg.toUpperCase() === '#FFFFFF' || brand.bg.toUpperCase() === '#FAF9F5';
    return (
      <span
        className={styles.brandTile}
        style={{
          width: size,
          height: size,
          backgroundColor: brand.bg,
          borderColor: isLightBg ? 'var(--border)' : 'transparent',
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

  // 2. ローカル SVG ファイル（Wikimedia から手動取得）
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
          borderColor: 'var(--border)',
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

  // 3. Google Favicon API：domain から高解像度ファビコンを取得（無料・無制限）
  if (domain && !googleFailed) {
    const innerPadding = Math.max(4, Math.round(size * 0.14));
    const inner = size - innerPadding * 2;
    const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    return (
      <span
        className={styles.faviconTile}
        style={{
          width: size,
          height: size,
          padding: innerPadding,
        }}
        title={domain}
        aria-hidden="true"
      >
        <img
          src={src}
          alt=""
          width={inner}
          height={inner}
          style={{ width: inner, height: inner, display: 'block', objectFit: 'contain' }}
          loading="lazy"
          onError={() => setGoogleFailed(true)}
        />
      </span>
    );
  }

  // 4. DuckDuckGo Favicon API：Google が失敗したら予備で試す
  if (domain && !duckFailed) {
    const innerPadding = Math.max(4, Math.round(size * 0.14));
    const inner = size - innerPadding * 2;
    const src = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
    return (
      <span
        className={styles.faviconTile}
        style={{
          width: size,
          height: size,
          padding: innerPadding,
        }}
        title={domain}
        aria-hidden="true"
      >
        <img
          src={src}
          alt=""
          width={inner}
          height={inner}
          style={{ width: inner, height: inner, display: 'block', objectFit: 'contain' }}
          loading="lazy"
          onError={() => setDuckFailed(true)}
        />
      </span>
    );
  }

  // 5. カテゴリ Lucide アイコン
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

  // 6. 絵文字（最終）
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
