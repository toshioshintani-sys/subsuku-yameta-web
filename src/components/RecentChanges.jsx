import { Link } from 'react-router-dom';
import {
  getRecentPriceChanges,
  getActiveIntroOffers,
  computeIntroOfferSummary,
} from '../data/services';
import styles from './RecentChanges.module.css';

const yen = (n) => `${n.toLocaleString('ja-JP')}円`;

function formatEndDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${Number(y)}年${Number(m)}月${Number(d)}日`;
}

// 入口価格の一文を、データから組み立てる（文章を手書きで持たない）。
// 手書きの文章に金額を埋め込むと、価格を直したときに文章側が古いまま残る。
// ここで組み立てれば、PLANS を直せば自動的に追随する。
function introOfferSentence(serviceId, offer) {
  const s = computeIntroOfferSummary(serviceId, offer);
  const head = `${offer.planName || 'このサービス'}は${offer.periodMonths}か月${yen(offer.totalForPeriod)}`;
  const cond = [offer.eligibility, offer.endDate ? `${formatEndDate(offer.endDate)}まで` : null]
    .filter(Boolean)
    .join('・');

  // 通常価格が引けない時は金額を断定しない（誤報ゼロ）
  if (s.regularMonthly === null) {
    return `${head}${cond ? `（${cond}）` : ''}。${offer.periodMonths}か月を過ぎると通常価格に戻る。`;
  }
  return (
    `${head}${cond ? `（${cond}）` : ''}。` +
    `${offer.periodMonths + 1}か月目から自動的に月${yen(s.regularMonthly)}になり、` +
    `初年度は${yen(offer.totalForPeriod)}＋${yen(s.regularMonthly)}×${s.restMonths}か月＝${yen(s.firstYearTotal)}、` +
    `2年目以降は年${yen(s.laterYearTotal)}。`
  );
}

// トップページ「最近の変更」（2026-07-25 追加／2026-07-26 挙動を修正）
//
// 仕様：
//   - 直近3日以内に記録された価格・仕様の変更を、日付つきの箇条書きで出す。
//   - 見出しをタップすると**その場で開いて変更の中身を見せる**（ページ遷移しない）。
//   - **直近3日に変更が無ければ、何も描画しない（null を返す）。**
//     ＝空状態が存在しないので「データが少なくてスカスカ」に見えることがない。
//
// 2026-07-26 の修正（俊雄さん指摘「クリックしたら解約画面が出て違和感しかない」）：
//   もとは見出しをタップすると解約手順ページへ飛ぶ設計だった。しかしこれは
//   「値上げしました」と告げた直後に解約画面を突きつける動きになり、
//   CLAUDE.md §2-2「煽り・ランキングを一切使わない」に正面から反する。
//   読み手がその見出しをタップして知りたいのは、まず「いくら上がったのか」であって
//   解約手順ではない。そこでタップしたらその場で中身（いくらがいくらになったか・
//   確認日・公式ソース）が開く形に変え、解約手順ページへのリンクは開いた中の
//   控えめな一行に降ろした。＝事実を見せてから、動くかどうかは読み手が決める。
//
// 憲法（CLAUDE.md §2-1）との関係：
//   HomePage の第一印象（濃紺ヒーロー＋検索窓）は不可侵のため、この要素はヒーローの**下**に置く。
//   変更が無い日は要素ごと消えるので、通常時の第一印象は完全に従来どおり。
//
// 煽らない（§2-2）：見出しは「値上げ」等の事実ラベルのみ。感嘆符・警告色・件数の誇張はしない。

const DIRECTION_LABEL = { up: '値上げ', down: '値下げ', new: '新プラン', restructure: '体系変更' };
const WINDOW_DAYS = 3;

function formatDate(iso) {
  const [, m, d] = iso.split('-');
  return `${Number(m)}/${Number(d)}`;
}

export default function RecentChanges() {
  const changes = getRecentPriceChanges(WINDOW_DAYS);

  // 直近3日に変更が無い日（＝ほとんどの日）。
  // 2026-07-28 まではここで null を返して丸ごと消していたが、それだと
  // **溜めた記録へ辿り着く導線がトップから消える**（実際 7/28 に0件になり、
  // 22サービスの価格修正も入口価格の崖も、外からは何も見えない状態になっていた）。
  // 空状態を大きく出すのは避けたいので、事実を1行だけ置いて記録へ送る。
  if (changes.length === 0) {
    return (
      <p className={styles.emptyLine}>
        直近3日の価格変更はありません。
        <Link to="/price-watch/" className={styles.more}>
          これまでの記録を見る →
        </Link>
      </p>
    );
  }

  return (
    <section className={styles.wrap} aria-label="最近の価格・仕様の変更">
      <h2 className={styles.title}>最近の変更</h2>
      <ul className={styles.list}>
        {changes.map((c) => (
          <li key={`${c.serviceId}-${c.date}-${c.item}`}>
            <details className={styles.item}>
              <summary className={styles.summary}>
                <time className={styles.date} dateTime={c.date}>
                  {formatDate(c.date)}
                </time>
                <span className={styles.text}>
                  {c.serviceName}
                  {c.item ? `の${c.item}` : ''}が{DIRECTION_LABEL[c.direction] || '変更'}
                </span>
                <span className={styles.marker} aria-hidden="true" />
              </summary>
              <div className={styles.body}>
                {c.change && <p className={styles.change}>{c.change}</p>}

                {/* 入口価格（2026-07-26 追加）
                    値上げを告げて公式ページへ送ると、そこで新規登録者向けの安い価格に
                    出会って契約してしまう——実際に起きた事故を塞ぐための段落。
                    ※記号や枠で浮かせず、上の変更内容と同じ体裁の地の文にする。
                    「180円」を視覚的に強調すると、それ自体がアンカーとして働いてしまう。 */}
                {(() => {
                  const offers = getActiveIntroOffers(c.serviceId);
                  if (offers.length === 0) return null;
                  return (
                    <>
                      {offers.map((offer, i) => (
                        <p key={offer.planName || i} className={styles.change}>
                          {i === 0 && '公式ページには今、新規登録者向けの安い価格も出ている。'}
                          {introOfferSentence(c.serviceId, offer)}
                        </p>
                      ))}
                      {/* 開示の副作用を塞ぐ：「◯か月で解約すれば得」という新しい契約動機を
                          作らないための一文。特定プランの話に見えないよう独立した段落にする。
                          意思の弱さのせいにせず、構造の話として置く。 */}
                      <p className={styles.change}>
                        {`${offers[0].periodMonths}か月で解約すれば安く済むが、その日を覚えていて手続きまでする人は多くない。`}
                      </p>
                    </>
                  );
                })()}

                <p className={styles.links}>
                  {c.source && (
                    <a
                      href={c.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      公式ページで確認する
                    </a>
                  )}
                  <Link to={`/service/${c.serviceId}/`} className={styles.link}>
                    {c.serviceName}の解約方法を見る
                  </Link>
                </p>
              </div>
            </details>
          </li>
        ))}
      </ul>
      {/* 沈黙の誤報を防ぐ常設の一文（2026-07-26 追加）。
          入口価格の注記が付くのは、値上げを確認できたサービスだけ。
          注記が無い＝安い入口価格が無い、と読まれると逆に危ないので、
          個別データを持たない一般的な注意をここに常時置く（維持コストゼロ）。 */}
      <p className={styles.note}>
        公式ページで確認した日付です。見出しをタップすると中身が開きます。ここに載せているのは通常価格で、
        公式ページには新規登録者向けの安い価格が別に出ていることがあります。
      </p>
      {/* 3日を過ぎた記録の行き先（2026-07-28 追加）。
          ここが無いと、窓から落ちた変更はどこからも辿れなくなる。 */}
      <Link to="/price-watch/" className={styles.more}>
        これまでの変更をすべて見る →
      </Link>
    </section>
  );
}
