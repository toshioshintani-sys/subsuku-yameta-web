import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Seo
        title="お問い合わせ"
        description="サブスクやめたへのご意見・追加リクエスト・誤情報のご指摘。"
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
            <a href="mailto:contact@subsuku-yameta.example.com">contact@subsuku-yameta.example.com</a>
            （※サイト本番運用開始時に正規アドレスへ差し替え予定）
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
