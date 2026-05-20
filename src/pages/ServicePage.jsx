import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import styles from './ServicePage.module.css';

const DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };
const DIFFICULTY_COLOR = { easy: 'easy', medium: 'medium', hard: 'hard' };

const CATEGORY_LABEL = {
  video: '動画',
  music: '音楽',
  shopping: 'ショッピング',
  software: 'ソフト・ツール',
  news: 'ニュース・読み放題',
  game: 'ゲーム',
  other: 'その他',
};

export default function ServicePage() {
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id);

  const howToJsonLd = useMemo(() => {
    if (!service || !service.steps?.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `${service.name}の解約方法`,
      description: `${service.name}の解約ページへの直リンクと、${service.steps.length}ステップで完了する手順。`,
      step: service.steps.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: `ステップ${i + 1}`,
        text,
      })),
      ...(service.note ? { tip: [{ '@type': 'HowToTip', text: service.note }] } : {}),
    };
  }, [service]);

  // 同カテゴリのサービスを最大3件
  const related = SERVICES.filter((s) => s.category === service?.category && s.id !== id).slice(0, 3);

  if (!service) {
    return (
      <div className={styles.notFound}>
        <p>サービスが見つかりませんでした</p>
        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Seo
        title={`${service.name}の解約方法`}
        description={`${service.name}の解約ページへの直リンクと、${service.steps.length}ステップの手順${service.note ? '。注意点も。' : '。'}`}
        canonical={`/service/${service.id}`}
        jsonLd={howToJsonLd}
      />
      <div className={styles.inner}>
        {/* パンくず */}
        <nav className={styles.breadcrumb}>
          <Link to="/">トップ</Link>
          <span> › </span>
          <Link to={`/category/${service.category}`}>{CATEGORY_LABEL[service.category]}</Link>
          <span> › </span>
          <span>{service.name}</span>
        </nav>

        {/* メインカード */}
        <div className={styles.mainCard}>
          <div className={styles.serviceHead}>
            <ServiceIcon domain={service.domain} emoji={service.emoji} size={64} />
            <div>
              <h1 className={styles.name}>{service.name}の解約方法</h1>
              <div className={styles.meta}>
                <span className={`${styles.badge} ${styles[DIFFICULTY_COLOR[service.difficulty]]}`}>
                  解約難度：{DIFFICULTY_LABEL[service.difficulty]}
                </span>
                <span className={styles.steps}>{service.steps.length}ステップ</span>
              </div>
            </div>
          </div>

          {/* 解約ボタン */}
          <a
            href={service.cancelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cancelBtn}
          >
            🔗 {service.name}の解約ページを開く
          </a>

          {/* 手順 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>解約の手順</h2>
            <ol className={styles.stepList}>
              {service.steps.map((step, i) => (
                <li key={i} className={styles.step}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepText}>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 注意事項 */}
          {service.note && (
            <div className={styles.note}>
              <span className={styles.noteIcon}>⚠️</span>
              <p>{service.note}</p>
            </div>
          )}

          {/* 免責 */}
          <p className={styles.disclaimer}>
            ※ 解約手順はサービス側の仕様変更により異なる場合があります。最新情報は各サービスの公式サポートをご確認ください。
          </p>
        </div>

        {/* 同カテゴリの他サービス */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>
              {CATEGORY_LABEL[service.category]}の他のサービス
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((s) => (
                <Link to={`/service/${s.id}`} key={s.id} className={styles.relatedCard}>
                  <ServiceIcon domain={s.domain} emoji={s.emoji} size={28} />
                  <span className={styles.relatedName}>{s.name}</span>
                  <span className={styles.relatedArrow}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link to="/" className={styles.backLink}>← すべてのサービスを見る</Link>
      </div>
    </div>
  );
}
