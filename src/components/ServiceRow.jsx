import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import DifficultyBadge from './DifficultyBadge';
import { getDefaultMonthly } from '../data/services';
import styles from './ServiceRow.module.css';

const yen = (n) => '¥' + Math.round(n || 0).toLocaleString('ja-JP');

// Top10 / EasyWins 共用の行。リンク先は自社の解約手順ページ（/service/:id・引き止め対策つき）。
// rank を渡せば順位、savingAnnual を渡せば「やめると 年¥X」、無ければ月額を表示。
// 「解約ページへ →」は常に提示＝解約を視覚序列の最上位に保つ（不可侵）。
export default function ServiceRow({ service, rank, savingAnnual }) {
  const monthly = getDefaultMonthly(service.id);
  const showPrice = savingAnnual == null && monthly > 0;
  return (
    <Link to={`/service/${service.id}`} className={styles.row}>
      {rank != null && <span className={styles.rank}>{rank}</span>}
      <ServiceIcon
        serviceId={service.id}
        category={service.category}
        domain={service.domain}
        emoji={service.emoji}
        size={32}
      />
      <span className={styles.body}>
        <span className={styles.name}>{service.name}</span>
        {savingAnnual != null && <span className={styles.saving}>やめると 年{yen(savingAnnual)}</span>}
      </span>
      <DifficultyBadge difficulty={service.difficulty} />
      {showPrice && <span className={styles.price}>月{yen(monthly)}</span>}
      <span className={styles.cancel}>
        <span className={styles.cancelText}>解約ページへ</span>
        <ArrowRight size={13} strokeWidth={1.9} aria-hidden="true" />
      </span>
    </Link>
  );
}
