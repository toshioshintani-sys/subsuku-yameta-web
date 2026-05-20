import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <Seo title="ページが見つかりません" description="お探しのページは見つかりませんでした。" />
      <div className={styles.notFoundCode}>404</div>
      <p className={styles.notFoundText}>お探しのページは見つかりませんでした。</p>
      <Link to="/" className={styles.backLink}>← トップに戻る</Link>
    </div>
  );
}
