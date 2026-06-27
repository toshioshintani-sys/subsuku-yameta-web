import { useMemo } from 'react';
import { SERVICES, getPopularity } from '../data/services';
import ServiceRow from './ServiceRow';
import styles from './ServiceList.module.css';

// よく探される Top N（design_handoff §5.7）。既定は人気順＝解約導線の序列を維持。
// 並び替え/フィルタ（README §9）は今回スコープ外。
export default function ServiceList({ limit = 10 }) {
  const top = useMemo(
    () =>
      [...SERVICES]
        .sort(
          (a, b) => getPopularity(b.id) - getPopularity(a.id) || a.name.localeCompare(b.name, 'ja')
        )
        .slice(0, limit),
    [limit]
  );

  return (
    <section className={styles.wrap} aria-label={`よく探される Top ${limit}`}>
      <h2 className={styles.title}>
        よく探される <span className={styles.top}>Top {limit}</span>
      </h2>
      <div className={styles.rows}>
        {top.map((s, i) => (
          <ServiceRow key={s.id} service={s} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}
