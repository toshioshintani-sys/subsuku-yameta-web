import { useState } from 'react';
import { SITE_URL } from '../config';
import styles from './ShareButtons.module.css';

// X / LINE / コピー の3種シェアボタン
// path は SITE_URL からの相対パス。title はシェアテキスト。
export default function ShareButtons({ path = '/', title = 'サブスクやめた', hashtags = ['サブスクやめた'] }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}${path}`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags.join(','))}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック：URL を表示してユーザーが手動コピー
      window.prompt('リンクをコピーしてください:', url);
    }
  };

  return (
    <div className={styles.wrap} role="group" aria-label="シェア">
      <span className={styles.label}>シェア：</span>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.btn} ${styles.x}`}
        aria-label="X（旧Twitter）でシェア"
      >
        <span aria-hidden="true">𝕏</span>
        <span className={styles.btnLabel}>X</span>
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.btn} ${styles.line}`}
        aria-label="LINEでシェア"
      >
        <span aria-hidden="true">💬</span>
        <span className={styles.btnLabel}>LINE</span>
      </a>
      <button
        type="button"
        onClick={copyLink}
        className={`${styles.btn} ${styles.copy}`}
        aria-label="リンクをコピー"
      >
        <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
        <span className={styles.btnLabel}>{copied ? 'コピー済み' : 'コピー'}</span>
      </button>
    </div>
  );
}
