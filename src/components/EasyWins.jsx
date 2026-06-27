import { useMemo } from 'react';
import { SERVICES, getPopularity, getDefaultMonthly } from '../data/services';
import ServiceRow from './ServiceRow';
import styles from './EasyWins.module.css';

// 「まず、かんたんに切れるものから」（design_handoff §5.5・初期労力を下げるナッジ）。
// 難易度=かんたん のサービスを人気順で count 件。各行に「やめると 年¥X」（＝年額）。
export default function EasyWins({ count = 3 }) {
  const items = useMemo(
    () =>
      SERVICES.filter((s) => s.difficulty === 'easy' && getDefaultMonthly(s.id) > 0)
        .sort((a, b) => getPopularity(b.id) - getPopularity(a.id))
        .slice(0, count),
    [count]
  );

  if (items.length === 0) return null;

  return (
    <section className={styles.wrap} aria-label="かんたんに切れるもの">
      <h2 className={styles.title}>まず、かんたんに切れるものから</h2>
      <div className={styles.rows}>
        {items.map((s) => (
          <ServiceRow key={s.id} service={s} savingAnnual={getDefaultMonthly(s.id) * 12} />
        ))}
      </div>
    </section>
  );
}
