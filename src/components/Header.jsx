import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="サブスクやめた トップへ">
          <span className={styles.logoIcon} aria-hidden="true">✂️</span>
          <div>
            <div className={styles.logoTitle}>サブスクやめた</div>
            <div className={styles.logoSub}>解約ページへすぐ飛べるサイト</div>
          </div>
        </Link>
        <nav className={styles.nav} aria-label="主要ナビゲーション">
          <Link to="/tracker" className={styles.navLink}>棚卸し</Link>
          <Link to="/blog" className={styles.navLink}>記事</Link>
        </nav>
      </div>
    </header>
  );
}
