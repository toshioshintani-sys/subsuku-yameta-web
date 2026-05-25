import { Link } from 'react-router-dom';
import { Scissors, LayoutGrid, ListChecks, FileText } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="サブスクやめた トップへ">
          <span className={styles.logoIcon} aria-hidden="true">
            <Scissors size={22} strokeWidth={1.75} />
          </span>
          <div>
            <div className={styles.logoTitle}>サブスクやめた</div>
            <div className={styles.logoSub}>解約ページへすぐ飛べるサイト</div>
          </div>
        </Link>
        <div className={styles.right}>
          <nav className={styles.nav} aria-label="主要ナビゲーション">
            <Link to="/discover" className={styles.navLink}>
              <LayoutGrid size={16} strokeWidth={1.75} className={styles.navIcon} aria-hidden="true" />
              <span>図鑑</span>
            </Link>
            <Link to="/tracker" className={styles.navLink}>
              <ListChecks size={16} strokeWidth={1.75} className={styles.navIcon} aria-hidden="true" />
              <span>棚卸し</span>
            </Link>
            <Link to="/blog" className={styles.navLink}>
              <FileText size={16} strokeWidth={1.75} className={styles.navIcon} aria-hidden="true" />
              <span>記事</span>
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
