import styles from './DifficultyBadge.module.css';

// 難易度バッジ（Home 決定版・design_handoff §7）。
// difficulty は 'easy' | 'medium' | 'hard'（services.js の値）。
const LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };

export default function DifficultyBadge({ difficulty }) {
  const label = LABEL[difficulty];
  if (!label) return null;
  return <span className={`${styles.badge} ${styles[difficulty]}`}>{label}</span>;
}
