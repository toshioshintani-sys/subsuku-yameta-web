import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function DisclosurePage() {
  return (
    <div className={styles.page}>
      <Seo
        title="収益開示について"
        description="サブスクやめたのアフィリエイトプログラム利用に関する開示。掲載順位は提携の有無や報酬で決まりません。"
        canonical="/disclosure"
      />
      <div className={styles.inner}>
        <h1 className={styles.title}>収益開示について</h1>
        <p className={styles.lead}>最終更新日：2026年5月23日</p>

        <div className={styles.card}>
          <h2>当サイトの収益源</h2>
          <p>
            サブスクやめた（以下「当サイト」）は、運営費を賄うために以下のアフィリエイトプログラムおよび広告プログラムを利用しています。
          </p>
          <ul>
            <li>Amazon アソシエイト</li>
            <li>楽天アフィリエイト</li>
            <li>A8.net</li>
            <li>もしもアフィリエイト</li>
            <li>Google AdSense</li>
          </ul>

          <h2>「PR」表記について</h2>
          <p>
            記事中またはサービス紹介中の外部リンクのうち、当サイトが商品紹介の対価として報酬を受け取る可能性があるリンクには「PR」と表記しています。
          </p>

          <h2>当サイトの編集方針（読者との約束）</h2>
          <ul className={styles.principleList}>
            <li>
              <strong>掲載順位は提携の有無や報酬で決まりません。</strong>
              月額・知名度・読者ニーズなどの中立的な軸で並べています。
            </li>
            <li>
              <strong>読者の利益に反すると判断したサービスは紹介しません。</strong>
              アフィリエイト報酬があるからといって、無理に勧めることはしません。
            </li>
            <li>
              <strong>すべてのサービスについて、メリットとデメリットを併記します。</strong>
              良い面だけを強調する記述は避け、判断材料を公平に提供します。
            </li>
            <li>
              <strong>「やめる」決断を支援することが、当サイトの最優先事項です。</strong>
              新しいサブスクへの誘導は、あくまで「やめた人がもし都度購入や代替を検討する場合」の補助情報として置いています。
            </li>
          </ul>

          <h2>運営の透明性</h2>
          <p>
            当サイトは、行動経済学とユーザーインターフェースの研究知見をもとに、読者が本当に必要なサービスだけを選び取れる環境を提供することを目指しています。
          </p>
          <p>
            「アフィリエイト導線が過剰だ」「掲載に違和感を覚えた」などのご意見は、<Link to="/contact/">お問い合わせページ</Link>からお寄せください。検証のうえ、必要に応じて掲載内容を修正します。
          </p>

          <h2>関連ページ</h2>
          <ul>
            <li><Link to="/privacy/">プライバシーポリシー</Link></li>
            <li><Link to="/disclaimer/">免責事項</Link></li>
            <li><Link to="/contact/">お問い合わせ</Link></li>
          </ul>
        </div>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
