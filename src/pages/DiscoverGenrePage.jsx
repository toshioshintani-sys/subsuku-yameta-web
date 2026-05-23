import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { DISCOVER_GENRES_BY_ID, DISCOVER_GENRES } from '../data/discover';
import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
import { SITE_URL } from '../config';
import styles from './DiscoverGenrePage.module.css';

function formatYen(n) {
  return `¥${n.toLocaleString('ja-JP')}`;
}

export default function DiscoverGenrePage() {
  const { id } = useParams();
  const genre = DISCOVER_GENRES_BY_ID[id];

  const jsonLd = useMemo(() => {
    if (!genre) return null;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'サブスク図鑑', item: `${SITE_URL}/discover` },
          { '@type': 'ListItem', position: 3, name: genre.name, item: `${SITE_URL}/discover/${genre.id}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: genre.services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.name,
          url: s.officialUrl,
        })),
      },
    ];
  }, [genre]);

  if (!genre) return <Navigate to="/discover" replace />;

  return (
    <div className={styles.page}>
      <Seo
        title={`${genre.name}：サブスク図鑑`}
        description={`${genre.name}（${genre.priceRange}）の主要 ${genre.services.length} 社を中立比較。やめたくなった時の手順まで一緒に紹介。${genre.summary.slice(0, 60)}…`}
        canonical={`/discover/${genre.id}`}
        jsonLd={jsonLd}
      />

      <div className={styles.inner}>
        <nav className={styles.breadcrumb}>
          <Link to="/">トップ</Link>
          <span> › </span>
          <Link to="/discover">サブスク図鑑</Link>
          <span> › </span>
          <span>{genre.name}</span>
        </nav>

        <header className={styles.head}>
          <span className={styles.emoji} aria-hidden="true">{genre.emoji}</span>
          <div>
            <h1 className={styles.title}>{genre.name}</h1>
            <p className={styles.tagline}>{genre.tagline}</p>
            <div className={styles.meta}>
              <span className={styles.priceRange}>{genre.priceRange}</span>
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.h2}>このサブスクは何？</h2>
          <p className={styles.p}>{genre.summary}</p>
        </section>

        <section className={styles.section}>
          <div className={styles.targetsGrid}>
            <div className={styles.targetCard}>
              <h3 className={styles.targetTitle}>👍 向いている人</h3>
              <ul className={styles.targetList}>
                {genre.targets.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div className={styles.targetCard}>
              <h3 className={styles.targetTitle}>👎 向かない人</h3>
              <ul className={styles.targetList}>
                {genre.notFor.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>主要 {genre.services.length} 社の比較</h2>
          <p className={styles.lead}>順位ではなく、特徴で並べています。あなたの暮らしに合うものを選んでください。</p>
          <div className={styles.serviceGrid}>
            {genre.services.map((s, i) => (
              <article key={i} className={styles.serviceCard}>
                <header className={styles.serviceHead}>
                  <h3 className={styles.serviceName}>{s.name}</h3>
                  <span className={styles.servicePrice}>月 {formatYen(s.monthly)}〜</span>
                </header>
                <p className={styles.serviceUsp}>{s.usp}</p>
                <div className={styles.serviceCancel}>
                  <span className={styles.serviceCancelLabel}>やめる時：</span>
                  {s.cancel}
                </div>
                <a
                  href={s.affiliateUrl || s.officialUrl}
                  target="_blank"
                  rel={s.affiliateUrl ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
                  className={styles.serviceLink}
                >
                  公式サイトを見る ↗
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.cancelSection}`}>
          <h2 className={styles.h2}>💡 やめたくなったら</h2>
          <p className={styles.p}>{genre.cancelGuide}</p>
          <p className={styles.cancelFootnote}>
            それでも迷ったら、本サイトの <Link to="/" className={styles.inlineLink}>解約手順インデックス</Link> や <Link to="/tracker" className={styles.inlineLink}>サブスク棚卸しダッシュボード</Link> も併せてご活用ください。
          </p>
        </section>

        <ShareButtons
          path={`/discover/${genre.id}`}
          title={`${genre.name}のサブスクを比較｜サブスクやめた`}
          hashtags={['サブスクやめた', genre.name.replace(/\s+/g, '')]}
        />

        <Link to="/discover" className={styles.backLink}>← サブスク図鑑に戻る</Link>
      </div>

      {/* 関連ジャンル */}
      <div className={styles.related}>
        <h2 className={styles.relatedTitle}>他のジャンルも見る</h2>
        <ul className={styles.relatedList}>
          {DISCOVER_GENRES.filter((g) => g.id !== genre.id).slice(0, 5).map((g) => (
            <li key={g.id}>
              <Link to={`/discover/${g.id}`} className={styles.relatedCard}>
                <span className={styles.relatedEmoji} aria-hidden="true">{g.emoji}</span>
                <span className={styles.relatedName}>{g.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
