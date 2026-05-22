import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES, ALTERNATIVES, EXTENDED_CONTENT, PRICING } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import AdSlot from '../components/AdSlot';
import ShareButtons from '../components/ShareButtons';
import { SITE_URL } from '../config';
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

function formatYen(n) {
  return `¥${n.toLocaleString('ja-JP')}`;
}

export default function ServicePage() {
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id);
  const extended = service ? EXTENDED_CONTENT[service.id] : null;
  const monthly = service ? PRICING[service.id] : undefined;

  // 構造化データ（HowTo + FAQPage + BreadcrumbList）
  const jsonLd = useMemo(() => {
    if (!service) return null;
    const list = [];

    // HowTo
    if (service.steps?.length) {
      list.push({
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
      });
    }

    // FAQPage（拡張コンテンツがあるサービスのみ）
    if (extended?.faq?.length) {
      list.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: extended.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      });
    }

    // BreadcrumbList
    list.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE_URL + '/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: CATEGORY_LABEL[service.category] || service.category,
          item: `${SITE_URL}/category/${service.category}`,
        },
        { '@type': 'ListItem', position: 3, name: service.name, item: `${SITE_URL}/service/${service.id}` },
      ],
    });

    return list;
  }, [service, extended]);

  // 同カテゴリのサービスを最大3件
  const related = SERVICES.filter((s) => s.category === service?.category && s.id !== id).slice(0, 3);

  // 解約後の選択肢
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

  const description = extended?.summary
    ? `${extended.summary.slice(0, 110)}…${service.name}の解約手順と引き止め対策を解説。`
    : `${service.name}の解約ページへの直リンクと、${service.steps.length}ステップの手順${service.note ? '。注意点も。' : '。'}`;

  return (
    <div className={styles.page}>
      <Seo
        title={`${service.name}の解約方法`}
        description={description}
        canonical={`/service/${service.id}`}
        jsonLd={jsonLd}
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
                {monthly > 0 && (
                  <span className={styles.price}>月 {formatYen(monthly)}</span>
                )}
              </div>
            </div>
          </div>

          {/* 概要（拡張コンテンツがあれば） */}
          {extended?.summary && (
            <p className={styles.summary}>{extended.summary}</p>
          )}

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

          {/* なぜ解約が難しい/簡単か */}
          {extended?.whyHard && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {service.difficulty === 'hard' ? 'なぜ解約が難しいのか' : '解約のポイント'}
              </h2>
              <p className={styles.paragraph}>{extended.whyHard}</p>
            </section>
          )}

          {/* 引き止め画面の対策 */}
          {extended?.darkPatterns?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>引き止め画面と対策</h2>
              <p className={styles.paragraphLead}>
                解約フロー中によく出る画面と、それぞれの対処法です。
              </p>
              <div className={styles.dpList}>
                {extended.darkPatterns.map((dp, i) => (
                  <div key={i} className={styles.dpItem}>
                    <div className={styles.dpTrigger}>
                      <span className={styles.dpTriggerLabel}>こう表示される</span>
                      {dp.trigger}
                    </div>
                    <div className={styles.dpResponse}>
                      <span className={styles.dpResponseLabel}>対策</span>
                      {dp.response}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 解約後の影響 */}
          {extended?.afterCancel && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>解約後の影響</h2>
              <p className={styles.paragraph}>{extended.afterCancel}</p>
            </section>
          )}

          {/* FAQ */}
          {extended?.faq?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>よくある質問</h2>
              <div className={styles.faqList}>
                {extended.faq.map((item, i) => (
                  <details key={i} className={styles.faqItem}>
                    <summary className={styles.faqQ}>
                      <span className={styles.faqMark}>Q.</span>
                      {item.q}
                    </summary>
                    <p className={styles.faqA}>
                      <span className={styles.faqMarkA}>A.</span>
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* 免責 */}
          <p className={styles.disclaimer}>
            ※ 解約手順はサービス側の仕様変更により異なる場合があります。最新情報は各サービスの公式サポートをご確認ください。
          </p>
        </div>

        {/* シェア（他の困っている人へ） */}
        <ShareButtons
          path={`/service/${service.id}`}
          title={`${service.name}の解約方法｜サブスクやめた`}
          hashtags={['サブスクやめた', service.name.replace(/\s+/g, '')]}
        />

        {/* 広告（解約手順が終わった直後の自然なブレイク。ない場合は何も描画しない） */}
        <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_SERVICE} label="広告" />

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

        {/* サブスク棚卸しダッシュボードへの送客 */}
        <Link to="/tracker" className={styles.trackerCta}>
          <div className={styles.trackerCtaIcon}>📊</div>
          <div>
            <div className={styles.trackerCtaTitle}>サブスクの棚卸し、まとめてやりませんか？</div>
            <div className={styles.trackerCtaSub}>月額・年額の合計と「解約しなさい順」を1分で可視化 → /tracker</div>
          </div>
        </Link>

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
