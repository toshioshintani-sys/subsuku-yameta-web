import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, CATEGORIES } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import styles from './HomePage.module.css';

const DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };
const DIFFICULTY_COLOR = { easy: 'easy', medium: 'medium', hard: 'hard' };
const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

const SORT_OPTIONS = [
  { id: 'default', label: 'デフォルト' },
  { id: 'name', label: '五十音順' },
  { id: 'difficulty-asc', label: '解約しやすい順' },
  { id: 'difficulty-desc', label: '解約しにくい順' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    const list = SERVICES.filter((s) => {
      const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
      const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchQuery && matchCategory;
    });

    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    }
    if (sortBy === 'difficulty-asc') {
      return [...list].sort(
        (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
      );
    }
    if (sortBy === 'difficulty-desc') {
      return [...list].sort(
        (a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]
      );
    }
    return list;
  }, [query, selectedCategory, sortBy]);

  return (
    <div className={styles.page}>
      <Seo canonical="/" />

      {/* ヒーロー */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>解約したいのに、どこから？</h1>
        <p className={styles.heroDesc}>
          各サービスの解約ページへ直接飛べます。手順と注意点もすぐわかります。
        </p>

        {/* 検索 */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="サービス名で検索（例：Netflix、Spotify…）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        {/* Tracker CTA */}
        <Link to="/tracker" className={styles.heroTracker}>
          📊 まとめて棚卸しする：契約中サブスクの合計額と「解約しなさい順」を可視化 →
        </Link>
      </section>

      <div className={styles.content}>
        {/* カテゴリーフィルター */}
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${selectedCategory === cat.id ? styles.catBtnActive : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 件数とソート */}
        <div className={styles.toolbar}>
          <p className={styles.count}>{filtered.length}件のサービス</p>
          <label className={styles.sortWrap}>
            <span className={styles.sortLabel}>並び順</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* グリッド */}
        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>「{query}」は見つかりませんでした</p>
              <p className={styles.emptySub}>
                サービス追加のリクエストは <Link to="/contact" className={styles.emptyLink}>お問い合わせ</Link> から
              </p>
            </div>
          ) : (
            filtered.map((service) => (
              <Link to={`/service/${service.id}`} key={service.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <ServiceIcon domain={service.domain} emoji={service.emoji} size={44} />
                  <span className={`${styles.badge} ${styles[DIFFICULTY_COLOR[service.difficulty]]}`}>
                    {DIFFICULTY_LABEL[service.difficulty]}
                  </span>
                </div>
                <div className={styles.cardName}>{service.name}</div>
                <div className={styles.cardMeta}>{service.steps.length}ステップで完了</div>
                <div className={styles.cardArrow}>解約手順を見る →</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
