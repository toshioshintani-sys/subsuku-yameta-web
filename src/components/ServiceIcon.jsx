import { useState } from 'react';
import styles from './ServiceIcon.module.css';

export default function ServiceIcon({ domain, emoji, size = 48 }) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed) {
    return (
      <span className={styles.emoji} style={{ fontSize: size * 0.65 }}>
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt=""
      width={size}
      height={size}
      className={styles.logo}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
