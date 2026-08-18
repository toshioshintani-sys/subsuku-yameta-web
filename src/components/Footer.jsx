import { Link } from 'react-router-dom';
import { CATEGORIES, SERVICES } from '../data/services';
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
              解約・乗り換え・買い切りまで、サブスクの「次の動き」をフラットに示す実利サイト。
            </p>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>このサイトでできること</div>
            <ul className={styles.list}>
              <li>
                <Link to="/compare/">解約方法の一覧・比較</Link>
                <div className={styles.listDesc}>{SERVICES.length}サービスの解約難易度・直リンクを1枚で</div>
              </li>
              <li>
                {/* 価格・仕様の変更ログ（2026-07-28 追加）。ヘッダーのナビは既に5項目で
                    これ以上増やすと窮屈なので、まずフッターから入れる */}
                <Link to="/price-watch/">値上げ・価格変更の記録</Link>
                <div className={styles.listDesc}>毎朝の巡回で確認できた変更を日付つきで</div>
              </li>
              <li>
                <Link to="/tracker/">サブスク棚卸し</Link>
                <div className={styles.listDesc}>契約中の月額・年額合計と見直し順を可視化</div>
              </li>
              <li>
                <Link to="/discover/">サブスク図鑑</Link>
                <div className={styles.listDesc}>乗り換え先を特徴と弱点つきで比較</div>
              </li>
              <li>
                <Link to="/yamete-kau/">やめて買う</Link>
                <div className={styles.listDesc}>月額をやめて買い切りで済ます代替案</div>
              </li>
              <li>
                <Link to="/blog/">お役立ち記事</Link>
                <div className={styles.listDesc}>解約・乗り換え・買い切りの解説記事</div>
              </li>
              <li>
                <Link to="/games/">サブスク判断ゲーム</Link>
                <div className={styles.listDesc}>課金の心理クセを2分で体験</div>
              </li>
            </ul>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>カテゴリ</div>
            <ul className={styles.list}>
              {categoryItems.map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.id}/`}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>サイト情報</div>
            <ul className={styles.list}>
              <li><Link to="/about/">このサイトについて</Link></li>
              <li><Link to="/privacy/">プライバシーポリシー</Link></li>
              <li><Link to="/disclaimer/">免責事項</Link></li>
              <li><Link to="/disclosure/">収益開示</Link></li>
              <li><Link to="/contact/">お問い合わせ</Link></li>
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
