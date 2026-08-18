import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES, getPopularity } from '../data/services';
import ServiceIcon from './ServiceIcon';
import DifficultyBadge from './DifficultyBadge';
import { trackUiEvent } from '../data/analytics';
import styles from './CategoryBrowse.module.css';

// カテゴリ別リスト（BAE設計憲法 §2 不可侵「Top10タイル＋カテゴリ別リスト」の復元・2026-07-16）。
// 6/27 の決定版リデザインで削除されていたホーム上のカテゴリ別導線を、折りたたみ型で戻す。
// Top10 に出た分は除外し「残りの57件」への到達経路をホーム本文に確保する。
const CATEGORY_META = [
  { id: 'video', label: '動画' },
  { id: 'music', label: '音楽' },
  { id: 'software', label: 'ソフト・ツール' },
  { id: 'game', label: 'ゲーム' },
  { id: 'news', label: 'ニュース・読み放題' },
  { id: 'shopping', label: 'ショッピング' },
  { id: 'other', label: 'その他' },
];

export default function CategoryBrowse({ excludeIds }) {
  const excluded = useMemo(() => new Set(excludeIds || []), [excludeIds]);

  const groups = useMemo(() => {
    const rest = SERVICES.filter((s) => !excluded.has(s.id));
    return CATEGORY_META.map((cat) => ({
      ...cat,
      services: rest
        .filter((s) => s.category === cat.id)
        .sort(
          (a, b) => getPopularity(b.id) - getPopularity(a.id) || a.name.localeCompare(b.name, 'ja')
        ),
    })).filter((g) => g.services.length > 0);
  }, [excluded]);

  const restCount = useMemo(() => groups.reduce((n, g) => n + g.services.length, 0), [groups]);

  return (
    <section className={styles.wrap} aria-label="カテゴリ別にすべてのサービスを見る">
      <h2 className={styles.title}>
        残りの<span className={styles.count}>{restCount}</span>サービスもカテゴリ別に
      </h2>
      <div className={styles.groups}>
        {groups.map((g) => (
          <details
            key={g.id}
            className={styles.group}
            onToggle={(e) => {
              if (e.currentTarget.open) trackUiEvent('home_category_open', { category: g.id });
            }}
          >
            <summary className={styles.summary}>
              <span className={styles.summaryLabel}>{g.label}</span>
              <span className={styles.summaryCount}>{g.services.length}件</span>
            </summary>
            <div className={styles.items}>
              {g.services.map((s) => (
                <Link key={s.id} to={`/service/${s.id}/`} className={styles.item}>
                  <ServiceIcon
                    serviceId={s.id}
                    category={s.category}
                    domain={s.domain}
                    emoji={s.emoji}
                    size={24}
                  />
                  <span className={styles.itemName}>{s.name}</span>
                  <DifficultyBadge difficulty={s.difficulty} />
                  <ArrowRight size={13} strokeWidth={1.9} aria-hidden="true" className={styles.itemArrow} />
                </Link>
              ))}
            </div>
          </details>
        ))}
      </div>
      <Link
        to="/compare/"
        className={styles.seeAll}
        onClick={() => trackUiEvent('home_see_all_click', {})}
      >
        全{SERVICES.length}サービスを一覧表で見る（難易度・月額つき） →
      </Link>
    </section>
  );
}
