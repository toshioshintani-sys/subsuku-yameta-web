import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './StickyCtaBar.module.css';

// 親指ゾーン固定CTA（design_handoff §5.8）。
// amountText は年額のライブ文字列（例：'年¥45,000'）。リンク先＝/tracker。タップ高さ ≥48px。
export default function StickyCtaBar({ amountText }) {
  return (
    <div className={styles.bar}>
      <Link to="/tracker/" className={styles.cta} aria-label={`棚卸しで ${amountText} を見直す`}>
        <span className={styles.label}>
          棚卸しで <span className={styles.amount}>{amountText}</span> を見直す
        </span>
        <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  );
}
