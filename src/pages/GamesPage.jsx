import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
import { BIAS_GAMES } from '../data/biasGames';
import { SITE_URL } from '../config';
import styles from './GamesPage.module.css';

/**
 * /games バイアスゲーム一覧（hub）
 * 各ゲームは /games/:id の独立ページ（SEO/AdSense レバー2）。
 */
export default function GamesPage() {
  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'サブスク判断ゲーム', item: `${SITE_URL}/games` },
        ],
      },
    ],
    []
  );

  return (
    <div className={styles.page}>
      <Seo
        title="サブスク判断ゲーム｜「やめられない理由」を遊んで見抜く"
        description="使っていないサブスクをなぜやめられないのか。その心のクセを、サブスク継続判断のミニゲームで体験。サンクコスト・現状維持・損失回避など、知らなくても遊べます。"
        canonical="/games"
        jsonLd={jsonLd}
      />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>遊んで見抜く</p>
          <h1 className={styles.title}>サブスク判断ゲーム</h1>
          <p className={styles.lead}>
            「使っていないのに、なぜかやめられない」。それはあなたの意志が弱いからではありません。
            サブスクの解約画面や料金プラン、引き止めの言葉は、人の心のクセを利用して作られています。
          </p>
          <p className={styles.lead}>
            このミニゲームは、あなたを引き止めるためのものではありません。逆です。
            <strong>サブスクがあなたに使っているクセを、ゲームで体験して見抜けるようにする</strong>ための練習です。
            むずかしい言葉は知らなくて大丈夫。遊んでいるうちに分かります。
          </p>
        </header>

        <section className={styles.gameCards} aria-label="ゲーム一覧">
          {BIAS_GAMES.map((g) => (
            <Link key={g.id} to={`/games/${g.id}/`} className={styles.gameCard}>
              <span className={styles.gameCardNo}>第{g.n}弾</span>
              <span className={styles.gameCardTitle}>{g.headline}</span>
              <span className={styles.gameCardDesc}>{g.cardDesc}</span>
              <span className={styles.gameCardTerm}>＝行動経済学でいう「{g.term}」</span>
              <span className={styles.gameCardPlay}>遊ぶ（30秒）→</span>
            </Link>
          ))}
        </section>

        <ShareButtons
          path="/games/"
          title="サブスク判断ゲーム｜「やめられない理由」を遊んで見抜く"
          hashtags={['サブスクやめた', '行動経済学']}
        />

        <Link to="/tracker/" className={styles.trackerCta}>
          <div>
            <div className={styles.trackerCtaTitle}>遊んだら、実際のサブスクで試そう</div>
            <div className={styles.trackerCtaSub}>
              棚卸しダッシュボードで、契約中サブスクの「これからのコスト（年額）」を1分で可視化 →
            </div>
          </div>
        </Link>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
