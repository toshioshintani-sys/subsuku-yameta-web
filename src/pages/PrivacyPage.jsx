import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Seo title="プライバシーポリシー" description="サブスクやめたのプライバシーポリシー。" canonical="/privacy" />
      <div className={styles.inner}>
        <h1 className={styles.title}>プライバシーポリシー</h1>
        <p className={styles.lead}>最終更新日：2026年5月20日</p>

        <div className={styles.card}>
          <h2>1. 収集する情報</h2>
          <p>
            サブスクやめた（以下「当サイト」）はユーザー登録機能を持たず、氏名・メールアドレス等の個人を直接識別する情報を取得しません。
          </p>

          <h2>2. アクセス解析（Google Analytics）</h2>
          <p>
            当サイトでは、サイト改善のため Google LLC が提供するアクセス解析ツール「Google Analytics 4」を利用しています。Google Analytics はトラフィックデータを収集するために Cookie を使用していますが、これらの情報は匿名で収集されており、個人を特定するものではありません。
          </p>
          <p>
            この機能は Cookie を無効にすることで収集を拒否できます。詳しくは <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Google のポリシー</a> をご確認ください。
          </p>

          <h2>3. 広告配信について（Google AdSense）</h2>
          <p>
            当サイトでは、第三者配信の広告サービス「Google AdSense」を利用する場合があります。広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、Cookie を使用することがあります。
          </p>
          <p>
            Cookie を使用した広告配信を希望されない場合は、<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">広告設定</a> ページで Cookie を無効化できます。また、<a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer">aboutads.info</a> で第三者配信事業者の Cookie を無効化することも可能です。
          </p>

          <h2>4. 外部リンクについて</h2>
          <p>
            当サイトは、各サブスクサービスの解約ページなど、外部サイトへのリンクを多数掲載しています。リンク先のサイトでの情報の取り扱いについては各サイトのプライバシーポリシーをご確認ください。
          </p>

          <h2>5. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは <Link to="/contact/">お問い合わせページ</Link> よりご連絡ください。
          </p>
        </div>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
