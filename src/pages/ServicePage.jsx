import { useParams, Link } from 'react-router-dom';
import {
  SERVICES,
  ALTERNATIVES,
  BUYOUT_ALTERNATIVES,
  EXTENDED_CONTENT,
  getDefaultMonthly,
  getPlans,
  getPlanCheckHint,
  formatMonthlyRange,
  getUsdMonthly,
  getFxNote,
  PRICE_HISTORY,
} from '../data/services';
import {
  getAffiliateUrl,
  buildAmazonSearchUrl,
  buildRakutenSearchUrl,
  trackAffiliateClick,
  detectAsp,
  REVIEW_MODE,
} from '../data/affiliates';
import { POST_BY_SLUG } from '../data/posts';
import { getGuidesForService } from '../data/serviceGuides';
import {
  Scissors,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  FileText,
  ExternalLink as ExternalLinkIcon,
} from 'lucide-react';
import ServiceIcon from '../components/ServiceIcon';
import CountUpYen from '../components/CountUpYen';
import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
import RenewalReminderCard from '../components/RenewalReminderCard';
import DirectionBadge from '../components/DirectionBadge';
import { SITE_URL } from '../config';
import { trackOfficialCancelClick } from '../utils/analytics';
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
  const priceHistory = service ? PRICE_HISTORY[service.id] || null : null;
  const monthly = service ? getDefaultMonthly(service.id) : 0;
  const plans = service ? getPlans(service.id) : [];
  const planCheckHint = service ? getPlanCheckHint(service.id) : null;
  const hasMultiplePlans = plans.length >= 2;
  const monthlyDisplay = service ? formatMonthlyRange(service.id) : '';

  // 構造化データ（HowTo + FAQPage + BreadcrumbList）
  // ※手動useMemoはReact Compilerの自動メモ化と衝突して最適化がスキップされていたため撤去
  //   （計算コストは小さく、メモ化はCompilerに任せる。2026-07-17 lint一掃）
  const jsonLd = (() => {
    if (!service) return null;
    const list = [];

    // 価格変更履歴の最新確認日（あれば dateModified に＝鮮度シグナル）
    const ph = PRICE_HISTORY[service.id];
    const latestPriceDate = ph?.length ? [...ph].map((h) => h.date).sort().slice(-1)[0] : null;

    // HowTo
    if (service.steps?.length) {
      list.push({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `${service.name}の解約方法`,
        description: `${service.name}の解約ページへの直リンクと、${service.steps.length}ステップで完了する手順。`,
        ...(latestPriceDate ? { dateModified: latestPriceDate } : {}),
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
  })();

  // 同カテゴリのサービスを最大3件
  const related = SERVICES.filter((s) => s.category === service?.category && s.id !== id).slice(0, 3);

  // 解約前に読む記事（内部リンク・選出ロジックは serviceGuides.js）
  const guides = getGuidesForService(service, 3);

  // C層（整理層）：買い切り・単発購入への切り替え提案（該当するサービスのみ）
  const buyout = service ? BUYOUT_ALTERNATIVES[service.id] || null : null;
  const buyoutArticle = buyout?.articleSlug ? POST_BY_SLUG[buyout.articleSlug] || null : null;

  // 解約後の選択肢（手動useMemo撤去・メモ化はReact Compilerに任せる）
  const alternatives = (() => {
    if (!service) return [];
    const raw = ALTERNATIVES[service.id] || [];
    return raw
      .map((alt) => {
        if (alt.id) {
          const target = SERVICES.find((s) => s.id === alt.id);
          if (!target) return null;
          return {
            kind: 'internal',
            href: `/service/${target.id}/`,
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
  })();

  if (!service) {
    return (
      <div className={styles.notFound}>
        <p>サービスが見つかりませんでした</p>
        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    );
  }

  // 拡張コンテンツを持たないサービスは、以前ここが「◯◯の解約ページへの直リンクと、3ステップの
  // 手順。」だけの30字前後になっていた（2026-09-02 Bing Webmaster が15ページを「説明が短い」と指摘）。
  // 文字数を稼ぐための水増しはしない。**ページに実際にある事実だけ**を足して、検索結果を見た人が
  // 「開く価値があるか」を判断できるようにする（解約難度・月額・注意点や代替案の有無）。
  const fallbackDescription = (() => {
    const parts = [`${service.name}の解約ページへの直リンクと、${service.steps.length}ステップの手順。`];
    parts.push(`解約難度は${DIFFICULTY_LABEL[service.difficulty]}。`);
    if (monthlyDisplay) parts.push(`月額${monthlyDisplay}。`);
    if (service.note) parts.push('解約時の注意点も記載。');
    if (alternatives.length) parts.push('解約後の選択肢もまとめています。');
    return parts.join('');
  })();

  const description = extended?.summary
    ? `${extended.summary.slice(0, 110)}…${service.name}の解約手順と引き止め対策を解説。`
    : fallbackDescription;

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
          <Link to={`/category/${service.category}/`}>{CATEGORY_LABEL[service.category]}</Link>
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

          {/* 為替の注釈（ドル建てで請求されるサービスのみ）
              円の金額を出す以上、それが「請求される金額」ではなく「どのレートで計算した
              概算か」を同じ画面で必ず言う。省くと、公式が $20 と書いているものを円で
              断言することになる。土日に読んだ日は最終営業日の値である旨も自動で入る。 */}
          {getUsdMonthly(service.id) != null && (
            <p className={styles.fxNote}>{getFxNote()}</p>
          )}

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
            onClick={() =>
              trackOfficialCancelClick({
                service: service.id,
                placement: 'service_page_primary',
                url: service.cancelUrl,
                difficulty: service.difficulty,
              })
            }
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

          {/* 更新日リマインダー（信頼はしご 第2段+第3段。続ける判断をした人への価値提供・
              サーバー保存なし＝解約サイトとしての信頼を壊さない設計。2026-07-11追加） */}
          <section className={styles.section}>
            <RenewalReminderCard
              serviceName={service.name}
              plans={plans}
              fallbackMonthlyDisplay={monthlyDisplay}
              cancelUrl={service.cancelUrl}
              renewalCheckUrl={service.renewalCheckUrl}
            />
          </section>

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

          {/* 価格・仕様の変更履歴（stack letter後継の下層。本文の厚み＋鮮度＝E-E-A-T。誤報ゼロ＝確認日つき・公式ソース） */}
          {priceHistory?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>価格・仕様の変更履歴</h2>
              <p className={styles.paragraphLead}>
                {service.name} の料金・プランで確認できた変更を、公式ページで確認した日付とともに記録しています。
              </p>
              <ul className={styles.historyList}>
                {priceHistory.map((h, i) => (
                  <li key={i} className={styles.historyItem}>
                    <div className={styles.historyMeta}>
                      <time className={styles.historyDate} dateTime={h.date}>{h.date}</time>
                      <DirectionBadge direction={h.direction} variant="filled" />
                      {h.item && <span className={styles.historyItemLabel}>{h.item}</span>}
                    </div>
                    <p className={styles.historyChange}>{h.change}</p>
                    {h.source && (
                      <a
                        className={styles.historySource}
                        href={h.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        公式料金ページで確認（{h.verifiedAt || h.date} 時点）
                        <ExternalLinkIcon size={12} strokeWidth={1.75} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <p className={styles.historyNote}>
                ※ 各変更は記載日時点で公式ページを確認した内容です。最新の料金は公式ページでご確認ください。
              </p>
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
          path={`/service/${service.id}/`}
          title={`${service.name}の解約方法｜サブスクやめた`}
          hashtags={['サブスクやめた', service.name.replace(/\s+/g, '')]}
        />

        {/* 解約後の選択肢（記事末尾・BAE準拠：押し売り厳禁・PR表示・厳選3つまで） */}
        {alternatives.length > 0 && (
          <section className={styles.alternatives}>
            <div className={styles.altHeader}>
              <h2 className={styles.altTitle}>もし「次に何か」を検討するなら</h2>
              {!REVIEW_MODE && (
                <span className={styles.prLabel} aria-label="一部のリンクはアフィリエイトです">PR</span>
              )}
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
                    rel={REVIEW_MODE ? 'noopener noreferrer' : 'sponsored noopener noreferrer'}
                    className={styles.altCard}
                    onClick={() =>
                      trackAffiliateClick({
                        asp: detectAsp(alt.href),
                        service: service.id,
                        placement: 'service_page_bottom',
                        position: i + 1,
                        layer: 'B',
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
              <Link to="/disclosure/">収益開示</Link>をご覧ください。
            </p>
          </section>
        )}

        {/* 買い切り・単発購入への切り替え（C層・BAE §6/§11・該当するサービスのみ表示） */}
        {buyout && (
          <section className={styles.alternatives}>
            <div className={styles.altHeader}>
              <h2 className={styles.altTitle}>単発購入・買い切りに切り替えるなら</h2>
              {!REVIEW_MODE && (
                <span className={styles.prLabel} aria-label="一部のリンクはアフィリエイトです">PR</span>
              )}
            </div>
            <p className={styles.altLead}>
              継続課金をやめて、<strong>一度の購入で完結させる</strong>という選択肢もあります。
              使い方によっては合わないこともあるので、デメリットもあわせて書いておきます。
            </p>
            {buyoutArticle ? (
              <div className={styles.altGrid}>
                <Link to={`/blog/${buyoutArticle.slug}/`} className={styles.altCard}>
                  <div className={styles.altCardTop}>
                    <span className={styles.altCardExternalIcon}>📄</span>
                    <span className={styles.altCardName}>{buyout.label}</span>
                  </div>
                  <p className={styles.altCardReason}>{buyoutArticle.description}</p>
                  <span className={styles.altCardArrow}>損益分岐と一緒に読む →</span>
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.altGrid}>
                  <a
                    href={buildAmazonSearchUrl(buyout.query)}
                    target="_blank"
                    rel={REVIEW_MODE ? 'noopener noreferrer' : 'sponsored noopener noreferrer'}
                    className={styles.altCard}
                    onClick={() =>
                      trackAffiliateClick({
                        asp: 'amazon',
                        service: service.id,
                        placement: 'service_page_bottom',
                        position: 1,
                        layer: 'C',
                      })
                    }
                  >
                    <div className={styles.altCardTop}>
                      <span className={styles.altCardExternalIcon}>↗</span>
                      <span className={styles.altCardName}>{buyout.label}（Amazonで探す）</span>
                    </div>
                    <p className={styles.altCardReason}>{buyout.reason}</p>
                    <span className={styles.altCardArrow}>Amazonで探す ↗</span>
                  </a>
                  <a
                    href={buildRakutenSearchUrl(buyout.query)}
                    target="_blank"
                    rel={REVIEW_MODE ? 'noopener noreferrer' : 'sponsored noopener noreferrer'}
                    className={styles.altCard}
                    onClick={() =>
                      trackAffiliateClick({
                        asp: 'rakuten',
                        service: service.id,
                        placement: 'service_page_bottom',
                        position: 2,
                        layer: 'C',
                      })
                    }
                  >
                    <div className={styles.altCardTop}>
                      <span className={styles.altCardExternalIcon}>↗</span>
                      <span className={styles.altCardName}>{buyout.label}（楽天市場で探す）</span>
                    </div>
                    <p className={styles.altCardReason}>{buyout.reason}</p>
                    <span className={styles.altCardArrow}>楽天市場で探す ↗</span>
                  </a>
                </div>
                <p className={styles.altLead} style={{ marginTop: 10, marginBottom: 0 }}>
                  <strong>正直なデメリット：</strong>{buyout.caveat}
                </p>
              </>
            )}
            <p className={styles.altDisclosure}>
              掲載順位は提携の有無や報酬で決まりません。詳細は
              <Link to="/disclosure/">収益開示</Link>をご覧ください。
            </p>
          </section>
        )}

        {/* サブスク棚卸しダッシュボードへの送客 */}
        <Link to="/tracker/" className={styles.trackerCta}>
          <div className={styles.trackerCtaIcon} aria-hidden="true">
            <BarChart3 size={28} strokeWidth={1.5} />
          </div>
          <div>
            <div className={styles.trackerCtaTitle}>サブスクの棚卸し、まとめてやりませんか？</div>
            <div className={styles.trackerCtaSub}>月額・年額の合計と「解約しなさい順」を1分で可視化 → /tracker</div>
          </div>
        </Link>

        {/* 解約前に読んでおくと迷いにくい記事（内部リンク・2026-07-25 追加）
            記事⇔サービス間に内部リンクが一本も無く、GSCで表示は出ているのに
            順位が上がりきらないページ（例:「figma 解約方法」90回表示/14位）への
            オーソリティ導線が欠けていたため。選出ロジック=src/data/serviceGuides.js */}
        {guides.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>解約の前に読んでおくと迷いにくい記事</h2>
            <div className={styles.guideList}>
              {guides.map((g) => (
                <Link to={`/blog/${g.slug}/`} key={g.slug} className={styles.guideCard}>
                  <span className={styles.guideIcon} aria-hidden="true">
                    <FileText size={17} strokeWidth={1.75} />
                  </span>
                  <span className={styles.guideBody}>
                    <span className={styles.guideTitle}>{g.title}</span>
                    <span className={styles.guideDesc}>{g.description}</span>
                  </span>
                  <span className={styles.relatedArrow}>→</span>
                </Link>
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
                <Link to={`/service/${s.id}/`} key={s.id} className={styles.relatedCard}>
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
