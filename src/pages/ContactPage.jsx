import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Seo
        title="お問い合わせ"
        description="サブスクやめたへのご意見・追加リクエスト・誤情報のご指摘。"
        canonical="/contact"
      />
      <div className={styles.inner}>
        <h1 className={styles.title}>お問い合わせ</h1>
        <p className={styles.lead}>
          掲載サービスの追加リクエスト、誤情報のご指摘、ご意見をお待ちしています。
        </p>

        <div className={styles.card}>
          <h2>連絡方法</h2>
          <p>
            現在はメールでのみ受け付けています。
          </p>
          <ul>
            <li>サービス追加リクエスト：サービス名と公式サイトURLを添えてお送りください</li>
            <li>解約手順の誤りや古い情報のご指摘：該当ページのURLを添えてください</li>
          </ul>

          <h2>送り先</h2>
          <p>
            専用のお問い合わせ窓口を準備中です。整い次第、このページでご案内します。
            お急ぎのサービス追加・誤情報のご指摘は、該当ページのURLを控えておいていただけると、
            窓口開設後の対応がスムーズです。
          </p>

          <h2>返信について</h2>
          <p>
            個人運営のため、すべてのお問い合わせに返信できるとは限りません。
            修正・追加に関しては優先度に応じて順次対応いたします。
          </p>
        </div>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
