import { Link } from 'react-router-dom';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { DISCOVER_GENRES } from '../data/discover';
import { DiscoverIcon } from '../icons';
import Seo from '../components/Seo';
import styles from './DiscoverIndexPage.module.css';

export default function DiscoverIndexPage() {
  return (
    <div className={styles.page}>
      <Seo
        title="サブスク図鑑：知らないサブスクの世界"
        description="Netflix だけがサブスクじゃない。花の定期便、洋服レンタル、コーヒー定期便、おうち学び——知らない世界を中立に紹介。やめる時の手順まで併記。"
        canonical="/discover"
      />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>知らないサブスクの世界</h1>
        <p className={styles.heroDesc}>
          無駄なサブスクをやめたら、本当に大切なものに使う番。
          花の定期便、洋服レンタル、おうち学び——
          知ってる人だけが楽しんでいる「もうひとつのサブスク」を、
          <strong>中立的に・やめ方まで一緒に</strong>紹介します。
        </p>
        <p className={styles.heroHint}>
          <Lightbulb size={15} strokeWidth={1.75} aria-hidden="true" />
          <span>各ジャンルページの末尾に「やめたくなったら」セクションを置いています。気軽に試して、合わなければ止める——それを支援するのがこのサイトの役割です。</span>
        </p>
      </section>

      <div className={styles.content}>
        <ul className={styles.list}>
          {DISCOVER_GENRES.map((g) => (
            <li key={g.id} className={styles.item}>
              <Link to={`/discover/${g.id}/`} className={styles.card}>
                <div className={styles.cardEmoji} aria-hidden="true">
                  <DiscoverIcon genreId={g.id} size={26} />
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{g.name}</h2>
                  <p className={styles.cardTagline}>{g.tagline}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardPrice}>{g.priceRange}</span>
                    <span className={styles.cardCount}>主要 {g.services.length} 社を比較</span>
                  </div>
                </div>
                <span className={styles.cardArrow} aria-hidden="true">
                  <ChevronRight size={20} strokeWidth={1.75} />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.note}>
          このコーナーは「サブスクのハードルが低い人」のために作られました。<strong>解約特化サイトとして、やめる手順を最初から一緒に渡す</strong>——それが私たちのスタンスです。
        </p>
      </div>
    </div>
  );
}
