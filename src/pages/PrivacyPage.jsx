import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Seo title="プライバシーポリシー" description="サブスクやめたのプライバシーポリシー。" />
      <div className={styles.inner}>
        <h1 className={styles.title}>プライバシーポリシー</h1>
        <p className={styles.lead}>最終更新日：2026年5月19日</p>

        <div className={styles.card}>
          <h2>1. 収集する情報</h2>
          <p>
            サブスクやめた（以下「当サイト」）はユーザー登録機能を持たず、氏名・メールアドレス等の個人を直接識別する情報を取得しません。
          </p>

          <h2>2. アクセス解析</h2>
          <p>
            当サイトでは、サイト改善のためアクセス解析ツールを利用する場合があります。アクセス解析ツールはトラフィックデータを収集するためにCookieを使用することがありますが、これらの情報は匿名で収集されており、個人を特定するものではありません。
          </p>

          <h2>3. 外部リンクについて</h2>
          <p>
            当サイトは、各サブスクサービスの解約ページなど、外部サイトへのリンクを多数掲載しています。リンク先のサイトでの情報の取り扱いについては各サイトのプライバシーポリシーをご確認ください。
          </p>

          <h2>4. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは <Link to="/contact">お問い合わせページ</Link> よりご連絡ください。
          </p>
        </div>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
