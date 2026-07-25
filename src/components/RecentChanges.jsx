import { Link } from 'react-router-dom';
import { getRecentPriceChanges } from '../data/services';
import styles from './RecentChanges.module.css';

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
  if (changes.length === 0) return null;

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
      <p className={styles.note}>公式ページで確認した日付です。見出しをタップすると中身が開きます。</p>
    </section>
  );
}
