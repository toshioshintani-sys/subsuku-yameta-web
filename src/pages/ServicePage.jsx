import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  SERVICES,
  ALTERNATIVES,
  EXTENDED_CONTENT,
  PRICING,
  getDefaultMonthly,
  getPlans,
  getPlanCheckHint,
  formatMonthlyRange,
} from '../data/services';
import {
  getAffiliateUrl,
  buildAmazonSearchUrl,
  buildRakutenSearchUrl,
  trackAffiliateClick,
  detectAsp,
} from '../data/affiliates';
import {
  Scissors,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  ArrowUpRight,
  ExternalLink as ExternalLinkIcon,
} from 'lucide-react';
import ServiceIcon from '../components/ServiceIcon';
import CountUpYen from '../components/CountUpYen';
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
  const monthly = service ? getDefaultMonthly(service.id) : 0;
  const plans = service ? getPlans(service.id) : [];
  const planCheckHint = service ? getPlanCheckHint(service.id) : null;
  const hasMultiplePlans = plans.length >= 2;
  const monthlyDisplay = service ? formatMonthlyRange(service.id) : '';

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
        // 外部リンクは serviceId が分からないので、URLからの推測でAmazonタグ等を付与
        // 内部 alternatives のキー（alt.id 相当）が無い場合は URL ベースの変換のみ
        const inferredId = alt.serviceId || null;
        return {
          kind: 'external',
          href: getAffiliateUrl(inferredId, alt.url),
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
            <ServiceIcon serviceId={service.id} category={service.category} domain={service.domain} emoji={service.emoji} size={64} />
            <div>
              <h1 className={styles.name}>{service.name}の解約方法</h1>
              <div className={styles.meta}>
                <span className={`${styles.badge} ${styles[DIFFICULTY_COLOR[service.difficulty]]}`}>
                  解約難度：{DIFFICULTY_LABEL[service.difficulty]}
                </span>
                <span className={styles.steps}>{service.steps.length}ステップ</span>
                {monthlyDisplay && (
                  <span className={styles.price}>
                    月 {monthlyDisplay}
                  </span>
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
            <Scissors size={18} strokeWidth={2} aria-hidden="true" />
            <span>{service.name}の解約ページを開く</span>
            <ExternalLinkIcon size={14} strokeWidth={1.75} aria-hidden="true" />
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
              <span className={styles.noteIcon} aria-hidden="true">
                <AlertTriangle size={16} strokeWidth={1.75} />
              </span>
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

          {/* 料金プラン一覧（多プラン対応サービスのみ表示・BAE：情報の透明化） */}
          {hasMultiplePlans && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>あなたが契約しているプランは？</h2>
              <p className={styles.paragraphLead}>
                {service.name} には複数の料金プランがあります。自分がどれを契約しているか確認してから、損失額を見てみましょう。
              </p>
              <div className={styles.planTable}>
                <div className={styles.planTableHead}>
                  <span>プラン</span>
                  <span>月額</span>
                  <span>年額相当</span>
                </div>
                {plans.map((p, i) => (
                  <div key={i} className={`${styles.planRow} ${p.popular ? styles.planRowPopular : ''}`}>
                    <div className={styles.planName}>
                      {p.name}
                      {p.popular && <span className={styles.planBadge}>一般的</span>}
                      {p.note && <span className={styles.planNote}>{p.note}</span>}
                    </div>
                    <div className={styles.planMonthly}>{formatYen(p.monthly)}</div>
                    <div className={styles.planYearly}>
                      {p.yearly ? formatYen(p.yearly) : formatYen(p.monthly * 12)}
                    </div>
                  </div>
                ))}
              </div>
              {planCheckHint && (
                <p className={styles.planCheckHint}>
                  <span className={styles.planCheckIcon} aria-hidden="true">
                    <Lightbulb size={14} strokeWidth={1.75} />
                  </span>
                  {planCheckHint}
                </p>
              )}
            </section>
          )}

          {/* 損失可視化ブロック（BAE：行動経済学のナッジ - 損失回避） */}
          {monthly > 0 && (
            <div className={styles.lossViz} aria-label="年額試算">
              {hasMultiplePlans ? (
                // 複数プランがある場合：プラン別の損失額を併記（カウントアップ）
                <>
                  <div className={styles.lossVizHeader}>
                    <span className={styles.lossVizLabel}>このまま続けると（プラン別）</span>
                  </div>
                  <ul className={styles.lossVizPlanList}>
                    {plans.map((p, i) => (
                      <li key={i} className={styles.lossVizPlanItem}>
                        <span className={styles.lossVizPlanName}>
                          {p.name.length > 16 ? p.name.slice(0, 14) + '…' : p.name}
                        </span>
                        <span className={styles.lossVizPlanAmount}>
                          年 <CountUpYen value={p.yearly ?? p.monthly * 12} duration={1.0} delay={0.1 * i} className={styles.lossVizPlanAmountValue} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.lossVizSub}>
                    最も高いプランなら 10年で{' '}
                    <CountUpYen
                      value={Math.max(...plans.map((p) => (p.yearly ?? p.monthly * 12))) * 10}
                      duration={1.6}
                      delay={0.4}
                      className={styles.lossVizSubStrong}
                    />
                    {' '}を払い続ける計算です。
                  </p>
                </>
              ) : (
                // 単一プランの場合：従来の表示（カウントアップ）
                <>
                  <div className={styles.lossVizMain}>
                    <span className={styles.lossVizLabel}>このまま続けると</span>
                    <span className={styles.lossVizAmount}>
                      年 <CountUpYen value={monthly * 12} duration={1.2} className={styles.lossVizAmountValue} />
                    </span>
                  </div>
                  <p className={styles.lossVizSub}>
                    月{formatYen(monthly)} × 12ヶ月。5年で{' '}
                    <CountUpYen value={monthly * 60} duration={1.4} delay={0.2} className={styles.lossVizSubStrong} />、
                    10年で{' '}
                    <CountUpYen value={monthly * 120} duration={1.6} delay={0.4} className={styles.lossVizSubStrong} />
                    {' '}を払い続ける計算です。
                  </p>
                </>
              )}
            </div>
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

        {/* 解約後の選択肢（記事末尾・BAE準拠：押し売り厳禁・PR表示・厳選3つまで） */}
        {alternatives.length > 0 && (
          <section className={styles.alternatives}>
            <div className={styles.altHeader}>
              <h2 className={styles.altTitle}>もし「次に何か」を検討するなら</h2>
              <span className={styles.prLabel} aria-label="一部のリンクはアフィリエイトです">PR</span>
            </div>
            <p className={styles.altLead}>
              似た用途で使えるサービスを情報として置いておきます。
              <strong>乗り換える必要はありません</strong>。
              「やめる」が最善の選択であることも多いです。
            </p>
            <div className={styles.altGrid}>
              {alternatives.slice(0, 3).map((alt, i) => (
                alt.kind === 'internal' ? (
                  <Link key={i} to={alt.href} className={styles.altCard}>
                    <div className={styles.altCardTop}>
                      <ServiceIcon serviceId={alt.id} category={alt.category} domain={alt.domain} emoji={alt.emoji} size={32} />
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
                    onClick={() =>
                      trackAffiliateClick({
                        asp: detectAsp(alt.href),
                        service: service.id,
                        placement: 'service_page_bottom',
                        position: i + 1,
                      })
                    }
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
            <p className={styles.altDisclosure}>
              掲載順位は提携の有無や報酬で決まりません。詳細は
              <Link to="/disclosure">収益開示</Link>をご覧ください。
            </p>
          </section>
        )}

        {/* サブスク棚卸しダッシュボードへの送客 */}
        <Link to="/tracker" className={styles.trackerCta}>
          <div className={styles.trackerCtaIcon} aria-hidden="true">
            <BarChart3 size={28} strokeWidth={1.5} />
          </div>
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
                  <ServiceIcon serviceId={s.id} category={s.category} domain={s.domain} emoji={s.emoji} size={28} />
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
