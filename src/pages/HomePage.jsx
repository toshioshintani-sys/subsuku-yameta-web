import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, CATEGORIES } from '../data/services';
import styles from './HomePage.module.css';

const DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };
const DIFFICULTY_COLOR = { easy: 'easy', medium: 'medium', hard: 'hard' };

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
      const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchQuery && matchCategory;
    });
  }, [query, selectedCategory]);

  return (
    <div className={styles.page}>
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

        {/* 件数 */}
        <p className={styles.count}>
          {filtered.length}件のサービス
        </p>

        {/* グリッド */}
        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>「{query}」は見つかりませんでした</p>
              <p className={styles.emptySub}>サービス名のリクエストはTwitter（@未定）まで</p>
            </div>
          ) : (
            filtered.map((service) => (
              <Link to={`/service/${service.id}`} key={service.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardEmoji}>{service.emoji}</span>
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
