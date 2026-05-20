import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import styles from './StaticPage.module.css';

export default function DisclaimerPage() {
  return (
    <div className={styles.page}>
      <Seo title="免責事項" description="サブスクやめたの免責事項。" />
      <div className={styles.inner}>
        <h1 className={styles.title}>免責事項</h1>
        <p className={styles.lead}>最終更新日：2026年5月19日</p>

        <div className={styles.card}>
          <h2>掲載情報について</h2>
          <p>
            当サイトに掲載されている解約手順・解約ページURL・注意事項は、各サービスの公式情報をもとに作成していますが、サービス側の仕様変更により実際の手順と異なる場合があります。
          </p>
          <p>
            最新かつ正確な情報は、必ず各サービスの公式サポート・ヘルプページをご確認ください。当サイトの情報を利用したことで生じたいかなる損害についても、当サイトは責任を負いかねます。
          </p>

          <h2>外部リンクについて</h2>
          <p>
            当サイトから他のウェブサイトへのリンク先で発生したトラブル・損害について、当サイトは一切の責任を負いません。
          </p>

          <h2>商標・著作権について</h2>
          <p>
            当サイトで言及している各サービス名・ロゴ・商標は、それぞれの権利者に帰属します。当サイトは各サービスとの提携・関連を主張するものではなく、ユーザーの利便性向上のために情報提供のみを目的としています。
          </p>
        </div>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
