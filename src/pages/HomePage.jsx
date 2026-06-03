import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart3, ChevronDown } from 'lucide-react';
import { SERVICES, CATEGORIES, getPopularity, getDefaultMonthly } from '../data/services';
import { CategoryIcon } from '../icons';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import SavingsGameLauncher from '../components/SavingsGameLauncher';
import FadeUp from '../components/FadeUp';
import styles from './HomePage.module.css';

const DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };
const DIFFICULTY_COLOR = { easy: 'easy', medium: 'medium', hard: 'hard' };
const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

const CATEGORY_LABEL = {
  video: '動画',
  music: '音楽',
  shopping: 'ショッピング',
  software: 'ソフト・ツール',
  news: 'ニュース・読み放題',
  game: 'ゲーム',
  other: 'その他',
};

// カテゴリ表示順
const CATEGORY_ORDER_LIST = ['video', 'music', 'software', 'game', 'news', 'shopping', 'other'];

const SORT_OPTIONS = [
  { id: 'popular', label: '人気順' },
  { id: 'name', label: '五十音順' },
  { id: 'difficulty-asc', label: '解約しやすい順' },
  { id: 'difficulty-desc', label: '解約しにくい順' },
];

function formatYen(n) {
  if (!n || n === 0) return '';
  return `¥${n.toLocaleString('ja-JP')}`;
}

function applySort(list, sortBy) {
  if (sortBy === 'name') {
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  }
  if (sortBy === 'difficulty-asc') {
    return [...list].sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
  }
  if (sortBy === 'difficulty-desc') {
    return [...list].sort((a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]);
  }
  // popular（デフォルト）
  return [...list].sort((a, b) => {
    const diff = getPopularity(b.id) - getPopularity(a.id);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, 'ja');
  });
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [collapsedCats, setCollapsedCats] = useState({}); // {videoId: true}

  // 検索結果（クエリがあれば全件フィルタ・フラット表示モード）
  const isSearchMode = query.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearchMode) return [];
    const q = query.toLowerCase();
    const list = SERVICES.filter((s) => s.name.toLowerCase().includes(q));
    return applySort(list, sortBy);
  }, [query, sortBy, isSearchMode]);

  // 通常モード：Top10 + カテゴリ別
  const top10 = useMemo(() => {
    return applySort(SERVICES, 'popular').slice(0, 10);
  }, []);

  const top10Ids = useMemo(() => new Set(top10.map((s) => s.id)), [top10]);

  // Top10 を除いた残りを カテゴリ別に分割
  const restByCategory = useMemo(() => {
    const rest = SERVICES.filter((s) => !top10Ids.has(s.id));
    const grouped = {};
    rest.forEach((s) => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    // 各カテゴリ内をソート
    Object.keys(grouped).forEach((cat) => {
      grouped[cat] = applySort(grouped[cat], sortBy);
    });
    return grouped;
  }, [top10Ids, sortBy]);

  const toggleCategory = (catId) => {
    setCollapsedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div className={styles.page}>
      <Seo canonical="/" />

      {/* ヒーロー */}
      <section className={styles.hero}>
        {/* 背景帯：キリさんが紐を切る v3 イラスト（装飾・薄く敷く / 紺ヒーロー帯に合わせ dark 版） */}
        <picture className={styles.heroBg} aria-hidden="true">
          <source media="(max-width: 600px)" srcSet="/assets/hero/hero-main-mobile-dark.svg" />
          <img src="/assets/hero/hero-main-dark.svg" alt="" loading="eager" decoding="async" />
        </picture>

        <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>解約したいのに、どこから？</h1>
        <p className={styles.heroDesc}>
          各サービスの解約ページへ直接飛べます。手順と注意点もすぐわかります。
        </p>

        {/* 検索 */}
        <div className={styles.searchWrap}>
          <label htmlFor="service-search" className="sr-only">サービス名で検索</label>
          <span className={styles.searchIcon} aria-hidden="true">
            <Search size={18} strokeWidth={1.75} />
          </span>
          <input
            id="service-search"
            className={styles.searchInput}
            type="search"
            placeholder="サービス名で検索（例：Netflix、Spotify…）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => setQuery('')}
              aria-label="検索をクリア"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tracker CTA */}
        <Link to="/tracker" className={styles.heroTracker}>
          <BarChart3 size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>まとめて棚卸しする：契約中サブスクの合計額と「解約しなさい順」を可視化</span>
          <span aria-hidden="true">→</span>
        </Link>
        </div>
      </section>

      <div className={styles.content}>
        {/* 使い方ガイド（初訪問者向け） */}
        <section className={styles.guide} aria-label="使い方">
          <ol className={styles.guideList}>
            <li className={styles.guideItem}>
              <span className={styles.guideNum}>1</span>
              <div>
                <div className={styles.guideTitle}>サービスを探す</div>
                <div className={styles.guideDesc}>下の検索かカテゴリから、解約したいサブスクを選ぶ</div>
              </div>
            </li>
            <li className={styles.guideItem}>
              <span className={styles.guideNum}>2</span>
              <div>
                <div className={styles.guideTitle}>解約ページへ直行</div>
                <div className={styles.guideDesc}>3ステップ以内の手順と、引き止め画面の対策つき</div>
              </div>
            </li>
            <li className={styles.guideItem}>
              <span className={styles.guideNum}>3</span>
              <div>
                <div className={styles.guideTitle}>まとめて棚卸し</div>
                <div className={styles.guideDesc}>
                  <Link to="/tracker" className={styles.guideLink}>棚卸しダッシュボード</Link>で年間総額を可視化
                </div>
              </div>
            </li>
          </ol>
        </section>

        {/* 並び順切り替え（カテゴリフィルタは2階層レイアウトでは廃止） */}
        <div className={styles.toolbar}>
          <p className={styles.count}>
            {isSearchMode ? `「${query}」の結果：${searchResults.length}件` : `全 ${SERVICES.length}件のサービス`}
          </p>
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

        {/* 検索モード：フラットなカードグリッド表示 */}
        {isSearchMode ? (
          searchResults.length === 0 ? (
            <div className={styles.empty}>
              <p>「{query}」は見つかりませんでした</p>
              <p className={styles.emptySub}>
                サービス追加のリクエストは <Link to="/contact" className={styles.emptyLink}>お問い合わせ</Link> から
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {searchResults.map((service) => (
                <Link to={`/service/${service.id}`} key={service.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <ServiceIcon serviceId={service.id} category={service.category} domain={service.domain} emoji={service.emoji} size={44} />
                    <span className={`${styles.badge} ${styles[DIFFICULTY_COLOR[service.difficulty]]}`}>
                      {DIFFICULTY_LABEL[service.difficulty]}
                    </span>
                  </div>
                  <div className={styles.cardName}>{service.name}</div>
                  <div className={styles.cardMeta}>{service.steps.length}ステップで完了</div>
                  <div className={styles.cardArrow}>解約手順を見る →</div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <>
            {/* 通常モード：Top10 大タイル + カテゴリ別リスト */}

            {/* セクション1：Top10 大タイル */}
            <section className={styles.topSection} aria-label="人気のサブスク Top10">
              <FadeUp>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionRank}>★</span>
                  人気の <span className={styles.numHighlight}>Top 10</span>
                </h2>
              </FadeUp>
              <div className={styles.topGrid}>
                {top10.map((service, i) => (
                  <Link to={`/service/${service.id}`} key={service.id} className={styles.topCard}>
                    <span className={styles.topRank}>{i + 1}</span>
                    <ServiceIcon
                      serviceId={service.id}
                      category={service.category}
                      domain={service.domain}
                      emoji={service.emoji}
                      size={64}
                    />
                    <div className={styles.topName}>{service.name}</div>
                    <div className={styles.topMeta}>
                      <span className={`${styles.badgeSmall} ${styles[DIFFICULTY_COLOR[service.difficulty]]}`}>
                        {DIFFICULTY_LABEL[service.difficulty]}
                      </span>
                      {getDefaultMonthly(service.id) > 0 && (
                        <span className={styles.topPrice}>{formatYen(getDefaultMonthly(service.id))}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* セクション2：カテゴリ別リスト */}
            <section className={styles.catSection} aria-label="カテゴリ別すべて">
              <FadeUp delay={0.05}>
                <h2 className={styles.sectionTitle}>
                  すべてのサービス <span className={styles.numHighlight}>{SERVICES.length - 10}</span>
                  <span className={styles.titleSub}>件をカテゴリ別に</span>
                </h2>
              </FadeUp>

              {CATEGORY_ORDER_LIST.map((catId) => {
                const items = restByCategory[catId] || [];
                if (items.length === 0) return null;
                const isCollapsed = collapsedCats[catId];

                return (
                  <div key={catId} className={styles.catGroup}>
                    <button
                      type="button"
                      className={styles.catHeader}
                      onClick={() => toggleCategory(catId)}
                      aria-expanded={!isCollapsed}
                    >
                      <span className={styles.catHeaderLeft}>
                        <span className={styles.catHeaderIcon} aria-hidden="true">
                          <CategoryIcon categoryId={catId} size={18} />
                        </span>
                        <span className={styles.catHeaderName}>{CATEGORY_LABEL[catId]}</span>
                        <span className={styles.catHeaderCount}>{items.length}</span>
                      </span>
                      <span
                        className={`${styles.catHeaderChevron} ${isCollapsed ? styles.collapsed : ''}`}
                        aria-hidden="true"
                      >
                        <ChevronDown size={18} strokeWidth={1.75} />
                      </span>
                    </button>

                    {!isCollapsed && (
                      <ul className={styles.catList}>
                        {items.map((s) => (
                          <li key={s.id}>
                            <Link to={`/service/${s.id}`} className={styles.catRow}>
                              <ServiceIcon
                                serviceId={s.id}
                                category={s.category}
                                domain={s.domain}
                                emoji={s.emoji}
                                size={32}
                              />
                              <span className={styles.catRowName}>{s.name}</span>
                              <span className={`${styles.badgeSmall} ${styles[DIFFICULTY_COLOR[s.difficulty]]}`}>
                                {DIFFICULTY_LABEL[s.difficulty]}
                              </span>
                              {getDefaultMonthly(s.id) > 0 && (
                                <span className={styles.catRowPrice}>月 {formatYen(getDefaultMonthly(s.id))}</span>
                              )}
                              <span className={styles.catRowArrow} aria-hidden="true">→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        )}

        {/* やめたつもり貯金ゲーム — 下部に控えめに（俊雄さん指示） */}
        <SavingsGameLauncher />
      </div>
    </div>
  );
}
