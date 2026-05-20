import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES, ALTERNATIVES } from '../data/services';
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

  // 解約後の選択肢（内部リンクはサービス詳細を補完して描画）
  const alternatives = useMemo(() => {
    if (!service) return [];
    const raw = ALTERNATIVES[service.id] || [];
    return raw
      .map((alt) => {
        if (alt.id) {
          const target = SERVICES.find((s) => s.id === alt.id);
          if (!target) return null;
          return {
            kind: 'internal',
            href: `/service/${target.id}`,
            name: target.name,
            emoji: target.emoji,
            domain: target.domain,
            reason: alt.reason,
          };
        }
        return {
          kind: 'external',
          href: alt.url,
          name: alt.name,
          reason: alt.reason,
        };
      })
      .filter(Boolean);
  }, [service]);

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

        {/* 解約後の選択肢（記事末尾・押し売り厳禁） */}
        {alternatives.length > 0 && (
          <section className={styles.alternatives}>
            <h2 className={styles.altTitle}>解約したあなたへ：別の選択肢</h2>
            <p className={styles.altLead}>
              似た用途で使えるサービスを参考までに紹介します。無理に乗り換える必要はありません。
            </p>
            <div className={styles.altGrid}>
              {alternatives.map((alt, i) => (
                alt.kind === 'internal' ? (
                  <Link key={i} to={alt.href} className={styles.altCard}>
                    <div className={styles.altCardTop}>
                      <ServiceIcon domain={alt.domain} emoji={alt.emoji} size={32} />
                      <span className={styles.altCardName}>{alt.name}</span>
                    </div>
                    <p className={styles.altCardReason}>{alt.reason}</p>
                    <span className={styles.altCardArrow}>このサービスの解約方法もみる →</span>
                  </Link>
                ) : (
                  <a
                    key={i}
                    href={alt.href}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className={styles.altCard}
                  >
                    <div className={styles.altCardTop}>
                      <span className={styles.altCardExternalIcon}>↗</span>
                      <span className={styles.altCardName}>{alt.name}</span>
                    </div>
                    <p className={styles.altCardReason}>{alt.reason}</p>
                    <span className={styles.altCardArrow}>公式サイトへ ↗</span>
                  </a>
                )
              ))}
            </div>
          </section>
        )}

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
