import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✂️</span>
          <div>
            <div className={styles.logoTitle}>サブスクやめた</div>
            <div className={styles.logoSub}>解約ページへすぐ飛べるサイト</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
