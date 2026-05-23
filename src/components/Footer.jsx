import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/services';
import styles from './Footer.module.css';

export default function Footer() {
  const categoryItems = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.col}>
            <div className={styles.colTitle}>サブスクやめた</div>
            <p className={styles.tagline}>
              解約ページへ1クリックで飛べる、解約導線のインデックスサイト。
            </p>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>ツール</div>
            <ul className={styles.list}>
              <li><Link to="/discover">サブスク図鑑</Link></li>
              <li><Link to="/tracker">サブスク棚卸し</Link></li>
              <li><Link to="/blog">お役立ち記事</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>カテゴリ</div>
            <ul className={styles.list}>
              {categoryItems.map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.id}`}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>サイト情報</div>
            <ul className={styles.list}>
              <li><Link to="/about">このサイトについて</Link></li>
              <li><Link to="/privacy">プライバシーポリシー</Link></li>
              <li><Link to="/disclaimer">免責事項</Link></li>
              <li><Link to="/disclosure">収益開示</Link></li>
              <li><Link to="/contact">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.copy}>
          © {new Date().getFullYear()} サブスクやめた
        </div>
      </div>
    </footer>
  );
}
