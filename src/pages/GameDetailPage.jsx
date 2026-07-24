import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';

import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
import BiasGame from '../components/BiasGame';
import { BIAS_GAME_BY_ID, BIAS_GAMES } from '../data/biasGames';
import { SITE_URL } from '../config';
import styles from './GamesPage.module.css';

export default function GameDetailPage() {
  const { id } = useParams();
  const game = BIAS_GAME_BY_ID[id];

  const jsonLd = useMemo(() => {
    if (!game) return null;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'サブスク判断ゲーム', item: `${SITE_URL}/games` },
          { '@type': 'ListItem', position: 3, name: game.headline, item: `${SITE_URL}/games/${game.id}` },
        ],
      },
    ];
  }, [game]);

  if (!game) return <Navigate to="/games/" replace />;

  const others = BIAS_GAMES.filter((g) => g.id !== game.id);

  return (
    <div className={styles.page}>
      <Seo
        title={`${game.headline}｜サブスク判断ゲーム`}
        description={`${game.cardDesc} 行動経済学でいう「${game.term}」を、サブスク継続判断のミニゲームで体験。知らなくても遊べます。`}
        canonical={`/games/${game.id}`}
        jsonLd={jsonLd}
      />

      <div className={styles.inner}>
        <nav className={styles.breadcrumb}>
          <Link to="/">トップ</Link>
          <span> › </span>
          <Link to="/games/">サブスク判断ゲーム</Link>
        </nav>

        <section className={styles.gameSection} aria-label={game.headline}>
          <BiasGame key={game.id} game={game} />
        </section>

        <section className={styles.explainer}>
          <h2 className={styles.h2}>{game.explainerHead}</h2>
          {game.explainerBody.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className={styles.upcoming}>
          <h2 className={styles.h2}>ほかの判断グセも遊ぶ</h2>
          <ul className={styles.upcomingList}>
            {others.map((g) => (
              <li key={g.id} className={styles.upcomingItem}>
                <Link to={`/games/${g.id}/`} className={styles.upcomingLink}>
                  <span className={styles.upcomingDesc}>{g.headline}</span>
                  <span className={styles.upcomingName}>＝行動経済学でいう「{g.term}」 遊ぶ →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ShareButtons
          path={`/games/${game.id}/`}
          title={`${game.headline}｜サブスク判断ゲーム`}
          hashtags={['サブスクやめた', game.term, '行動経済学']}
        />

        <Link to="/tracker/" className={styles.trackerCta}>
          <div>
            <div className={styles.trackerCtaTitle}>遊んだら、実際のサブスクで試そう</div>
            <div className={styles.trackerCtaSub}>
              棚卸しダッシュボードで、契約中サブスクの「これからのコスト（年額）」を1分で可視化 →
            </div>
          </div>
        </Link>

        <Link to="/games/" className={styles.backLink}>← ゲーム一覧に戻る</Link>
      </div>
    </div>
  );
}
