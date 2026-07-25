import { Link } from 'react-router-dom';
import { getRecentPriceChanges } from '../data/services';
import styles from './RecentChanges.module.css';

// トップページ「最近の変更」（2026-07-25 追加・俊雄さん指示）
//
// 仕様：
//   - 直近3日以内に記録された価格・仕様の変更を、日付つきの箇条書きで出す。
//   - 箇条書きをタップすると、そのサービスの解約手順ページへ飛ぶ。
//   - **直近3日に変更が無ければ、何も描画しない（null を返す）。**
//     ＝空状態が存在しないので「データが少なくてスカスカ」に見えることがない。
//
// 憲法（CLAUDE.md §2-1）との関係：
//   HomePage の第一印象（濃紺ヒーロー「解約したいのに、どこから？」＋検索窓）は不可侵のため、
//   この要素はヒーローの**下**に置く。さらに変更が無い日は要素ごと消えるので、
//   通常時の第一印象は完全に従来どおり。リンク先は解約手順ページなので解約導線を強める側に働く。
//
// 煽らない（§2-2）：見出しは「値上げ」等の事実ラベルのみ。感嘆符・警告色・件数の誇張はしない。

const DIRECTION_LABEL = { up: '値上げ', down: '値下げ', new: '新プラン', restructure: '体系変更' };
const WINDOW_DAYS = 3;

function formatDate(iso) {
  const [, m, d] = iso.split('-');
  return `${Number(m)}/${Number(d)}`;
}

export default function RecentChanges() {
  const changes = getRecentPriceChanges(WINDOW_DAYS);
  if (changes.length === 0) return null;

  return (
    <section className={styles.wrap} aria-label="最近の価格・仕様の変更">
      <h2 className={styles.title}>最近の変更</h2>
      <ul className={styles.list}>
        {changes.map((c) => (
          <li key={`${c.serviceId}-${c.date}-${c.item}`}>
            <Link to={`/service/${c.serviceId}/`} className={styles.item}>
              <time className={styles.date} dateTime={c.date}>
                {formatDate(c.date)}
              </time>
              <span className={styles.text}>
                {c.serviceName}
                {c.item ? `の${c.item}` : ''}が{DIRECTION_LABEL[c.direction] || '変更'}
              </span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles.note}>公式ページで確認した日付です。詳細は各サービスのページに記録しています。</p>
    </section>
  );
}
