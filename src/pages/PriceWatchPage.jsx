import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getAllPriceChanges, getAllActiveIntroOffers, SERVICES } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import styles from './PriceWatchPage.module.css';

// 価格・仕様の変更ログ（2026-07-28 追加・俊雄さん指示）
//
// ■ なぜ作ったか
//   トップの「最近の変更」は直近3日しか出ない。3日を過ぎると消える。
//   2026-07-28 の時点で、22サービスの価格を公式確認で直しても、Apple 3件の値上げも、
//   前日に作った「入口価格の崖」も、**どこからも見えない状態**になっていた。
//   俊雄さんの指摘：「サイト更新をしないのは、外から見る人からは何もしていないのと同じ」。
//   9回デプロイしていても、溜めた記録に置き場所が無ければ外からは何も起きていない。
//
// ■ このページの性格
//   ここに出るのは **公式ページで確認できた事実だけ**（PRICE_HISTORY / INTRO_OFFERS）。
//   推測や未確認のものはデータに入れない運用なので、このページが誤報になることは無い。
//   ＝ 価格を機械が書き換えるのは危険だが、**検証済みの記録を見せるのは安全**。
//
// ■ 表ではなくログ形式にする理由
//   全67サービスを表にすると、記録があるのは数件なので空欄だらけに見える。
//   時系列のログなら件数が少なくても「最近の観測」として自然に読める。
//   順位もスコアも付けない（BAE §5 禁則）。事実を日付順に置くだけ。

// 方向は色だけに頼らず矢印でも示す（色覚特性のある読者向け・2026-08-04）
const DIRECTION_LABEL = { up: '↑ 値上げ', down: '↓ 値下げ', new: '新プラン', restructure: '体系変更' };

const yen = (n) => `${n.toLocaleString('ja-JP')}円`;

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${Number(y)}年${Number(m)}月${Number(d)}日`;
}

export default function PriceWatchPage() {
  const changes = useMemo(() => getAllPriceChanges(), []);
  const introOffers = useMemo(() => getAllActiveIntroOffers(), []);

  // 日付ごとにまとめる（同じ日の複数サービスを1つの見出しの下に置く）
  const byDate = useMemo(() => {
    const map = new Map();
    for (const c of changes) {
      if (!map.has(c.date)) map.set(c.date, []);
      map.get(c.date).push(c);
    }
    return [...map.entries()];
  }, [changes]);

  const serviceCount = SERVICES.length;
  const changedServices = new Set(changes.map((c) => c.serviceId)).size;

  return (
    <div className={styles.page}>
      <Seo
        title="サブスクの値上げ・価格変更の記録"
        description={`掲載中の${serviceCount}サービスの公式ページを毎朝巡回し、確認できた価格・プランの変更を日付つきで記録しています。載せているのは公式ページで実際に確認できた変更だけです。`}
        canonical="/price-watch"
      />

      <section className={styles.hero}>
        <p className={styles.kicker}>価格・仕様の変更ログ</p>
        <h1 className={styles.heroTitle}>サブスクの値上げ、記録しています</h1>
        <p className={styles.heroDesc}>
          掲載中の{serviceCount}サービスの公式ページを毎朝巡回し、価格やプランの変更を確認しています。
          ここに載せているのは、実際に公式ページで確認できた変更だけです。値上げの案内は
          いずれ消えますが、記録は残ります。
        </p>
        <p className={styles.summary}>
          記録 {changes.length}件（{changedServices}サービス）／巡回対象 {serviceCount}サービス
        </p>
      </section>

      <div className={styles.content}>
        {/* 今わかっている入口価格。鮮度切れ・終了日超過は getActiveIntroOffers が落とすので、
            放置しても勝手に消える（終わった特典を出し続けない）。 */}
        {introOffers.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.h2}>今わかっている「入口価格」</h2>
            <p className={styles.lead}>
              新規登録者向けに、最初の数か月だけ安くなる価格が出ていることがあります。
              入口の金額だけを見て決めると、切り替わったあとの負担を見落とします。
            </p>
            {introOffers.map(({ serviceId, serviceName, offer, summary }) => (
              <div key={`${serviceId}-${offer.planName}`} className={styles.offer}>
                <Link to={`/service/${serviceId}/`} className={styles.offerHead}>
                  <ServiceIcon serviceId={serviceId} size={20} />
                  <span>
                    {serviceName} — {offer.planName}
                  </span>
                </Link>
                <p className={styles.offerBody}>
                  {offer.periodMonths}か月{yen(offer.totalForPeriod)}
                  {offer.eligibility ? `（${offer.eligibility}` : ''}
                  {offer.endDate ? `${offer.eligibility ? '・' : '（'}${formatDate(offer.endDate)}まで` : ''}
                  {offer.eligibility || offer.endDate ? '）' : ''}。
                  {summary.regularMonthly !== null && (
                    <>
                      {offer.periodMonths + 1}か月目から自動的に月{yen(summary.regularMonthly)}になり、
                      初年度は{yen(summary.firstYearTotal)}、2年目以降は年{yen(summary.laterYearTotal)}。
                    </>
                  )}
                </p>
                <p className={styles.offerNote}>{offer.verifiedAt} 確認</p>
              </div>
            ))}
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.h2}>変更の記録</h2>

          {byDate.length === 0 ? (
            <p className={styles.lead}>
              まだ確認できた変更はありません。毎朝{serviceCount}サービスを巡回しています。
              次の変更が見つかり次第、ここに追加します。
            </p>
          ) : (
            byDate.map(([date, rows]) => (
              <div key={date} className={styles.dateGroup}>
                <h3 className={styles.date}>{formatDate(date)}</h3>
                {rows.map((c, i) => (
                  <article key={`${c.serviceId}-${i}`} className={styles.item}>
                    <div className={styles.itemHead}>
                      <Link to={`/service/${c.serviceId}/`} className={styles.itemName}>
                        <ServiceIcon serviceId={c.serviceId} size={20} />
                        <span>{c.serviceName}</span>
                      </Link>
                      <span className={`${styles.dir} ${styles['dir_' + c.direction] || ''}`}>
                        {DIRECTION_LABEL[c.direction] || '変更'}
                      </span>
                    </div>
                    {c.item && <p className={styles.itemLabel}>{c.item}</p>}
                    {c.change && <p className={styles.change}>{c.change}</p>}
                    <p className={styles.meta}>
                      {c.source && (
                        <a
                          href={c.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceLink}
                        >
                          公式ページ
                          <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
                        </a>
                      )}
                      <span>{c.verifiedAt} 確認</span>
                      <Link to={`/service/${c.serviceId}/`} className={styles.sourceLink}>
                        {c.serviceName}の解約方法
                      </Link>
                    </p>
                  </article>
                ))}
              </div>
            ))
          )}
        </section>

        <section className={styles.next}>
          <Link to="/tracker/" className={styles.nextCard}>
            <span className={styles.nextTitle}>固定費の棚卸し</span>
            <span className={styles.nextDesc}>契約しているものを並べて、年額を出す</span>
          </Link>
          <Link to="/compare/" className={styles.nextCard}>
            <span className={styles.nextTitle}>全{serviceCount}サービスの一覧</span>
            <span className={styles.nextDesc}>解約の難しさと月額をまとめて見る</span>
          </Link>
        </section>

        <p className={styles.disclaimer}>
          価格は変わります。ここに書いていないサービスに変更が無かったとは限りません（巡回で
          確認できなかった場合も含みます）。契約や解約の前には、必ず公式ページで最新の料金を
          確かめてください。
        </p>
      </div>
    </div>
  );
}
