import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import DifficultyBadge from './DifficultyBadge';
import { getDefaultMonthly, getPlans } from '../data/services';
import styles from './ServiceRow.module.css';

const yen = (n) => '¥' + Math.round(n || 0).toLocaleString('ja-JP');

function minMonthly(plans) {
  const amounts = plans.map((p) => p.monthly).filter((v) => v > 0);
  return amounts.length ? Math.min(...amounts) : 0;
}

// Top10 / EasyWins 共用の行。リンク先は自社の解約手順ページ（/service/:id・引き止め対策つき）。
// rank を渡せば順位、savingAnnual を渡せば「やめると 年¥X」、無ければ月額を表示。
// 「解約ページへ →」は常に提示＝解約を視覚序列の最上位に保つ（不可侵）。
//
// ★複数プラン対応（2026-07-11 修正）：プランが複数あるサービスで「popular」プラン1つの
// 金額を確定額のように見せていた（実際は¥890〜¥1,980など幅があるのに「月¥1,490」とだけ
// 表示）。曖昧な単一額を確定額として出すのは不誠実なので、複数プランがあれば最安プラン基準
// の「〜」表示にする（プランごとの正確な額はServicePageの一覧・更新日リマインダーで選べる）。
export default function ServiceRow({ service, rank, savingAnnual }) {
  const plans = getPlans(service.id);
  const isMultiPlan = plans.length > 1;
  const monthly = isMultiPlan ? minMonthly(plans) : getDefaultMonthly(service.id);
  const displaySaving = isMultiPlan ? minMonthly(plans) * 12 : savingAnnual;
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
        {savingAnnual != null && (
          <span className={styles.saving}>
            やめると 年{yen(displaySaving)}
            {isMultiPlan ? '〜' : ''}
          </span>
        )}
      </span>
      <DifficultyBadge difficulty={service.difficulty} />
      {showPrice && (
        <span className={styles.price}>
          月{yen(monthly)}
          {isMultiPlan ? '〜' : ''}
        </span>
      )}
      <span className={styles.cancel}>
        <span className={styles.cancelText}>解約ページへ</span>
        <ArrowRight size={13} strokeWidth={1.9} aria-hidden="true" />
      </span>
    </Link>
  );
}
