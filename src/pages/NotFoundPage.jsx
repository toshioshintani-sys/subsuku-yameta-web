import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <Seo title="ページが見つかりません" description="お探しのページは見つかりませんでした。" noindex />
      <img
        src="/assets/mascot/mascot-lost.svg"
        alt="道に迷ったキリさん"
        className={styles.notFoundMascot}
        width="160"
        height="160"
      />
      <div className={styles.notFoundCode}>404</div>
      <p className={styles.notFoundText}>道に迷っちゃいました。お探しのページは見つかりませんでした。</p>
      <div className={styles.notFoundActions}>
        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
        <Link to="/discover" className={styles.backLink}>サブスクを探す</Link>
      </div>
    </div>
  );
}
