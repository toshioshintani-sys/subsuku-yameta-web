import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Seo
        title="このサイトについて"
        description="サブスクやめたは、解約ページへ1クリックで飛べる解約導線のインデックスサイトです。"
      />
      <div className={styles.inner}>
        <h1 className={styles.title}>このサイトについて</h1>
        <p className={styles.lead}>
          「解約したいのに、解約ページがどこにあるか分からない」を1クリックで終わらせる。
        </p>

        <div className={styles.card}>
          <h2>サブスクやめたとは</h2>
          <p>
            「サブスクやめた」は、各サブスクリプションサービスの解約ページへ直接ジャンプできるインデックスサイトです。
            サービスごとの解約手順を3ステップ程度に要約し、引き止め画面・アプリからは解約できないなどの注意点も合わせて掲載しています。
          </p>

          <h2>なぜ作ったか</h2>
          <p>
            多くのサブスクサービスは、解約ページを意図的に深い階層に置いています。
            ユーザーは「サービス名 解約」とググりますが、検索結果の上位は長いヘルプ記事や個人ブログばかりで、肝心の「解約ボタン」にたどり着くまでに時間がかかります。
          </p>
          <p>
            このサイトは、その「数秒で済むはずのタスク」を本当に数秒で完了できる状態にするために作られました。
          </p>

          <h2>大切にしていること</h2>
          <ul>
            <li>解約ページへの直リンクを最上位に置く（押し売りや誘導をはさまない）</li>
            <li>手順は3ステップ以内に要約する</li>
            <li>引き止め画面や落とし穴など、公式ヘルプには書かれていない警告を出す</li>
            <li>ユーザー登録不要・個人情報を取らない</li>
          </ul>
        </div>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
