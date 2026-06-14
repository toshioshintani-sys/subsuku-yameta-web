import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { SERVICES, CATEGORIES, getDefaultMonthly } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import { SITE_URL } from '../config';
import styles from './ComparePage.module.css';

// difficulty は「手順の多さ・導線の深さ」に基づく事実ラベル（優劣のランキングではない）。
const DIFFICULTY = {
  easy: { label: 'かんたん', order: 1, cls: 'easy' },
  medium: { label: 'ふつう', order: 2, cls: 'medium' },
  hard: { label: 'むずかしい', order: 3, cls: 'hard' },
};
const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

export default function ComparePage() {
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('category'); // 'category' | 'difficulty' | 'name'

  // 難易度の内訳（一目で分かる事実・AIにも引用されやすい一次データ）
  const counts = useMemo(() => {
    const c = { easy: 0, medium: 0, hard: 0 };
    SERVICES.forEach((s) => {
      if (c[s.difficulty] != null) c[s.difficulty] += 1;
    });
    return c;
  }, []);

  const rows = useMemo(() => {
    const list = SERVICES.filter((s) => cat === 'all' || s.category === cat);
    return [...list].sort((a, b) => {
      const byName = a.name.localeCompare(b.name, 'ja');
      if (sort === 'difficulty') {
        return (DIFFICULTY[a.difficulty]?.order ?? 9) - (DIFFICULTY[b.difficulty]?.order ?? 9) || byName;
      }
      if (sort === 'name') return byName;
      return (CAT_LABEL[a.category] || '').localeCompare(CAT_LABEL[b.category] || '', 'ja') || byName;
    });
  }, [cat, sort]);

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'サブスク解約方法 一覧・比較', item: `${SITE_URL}/compare` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'サブスクの解約方法 一覧',
        numberOfItems: SERVICES.length,
        itemListElement: SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${s.name}の解約方法`,
          url: `${SITE_URL}/service/${s.id}`,
        })),
      },
    ],
    []
  );

  return (
    <div className={styles.page}>
      <Seo
        title={`サブスク解約方法の一覧・比較｜${SERVICES.length}サービスの難易度と直リンク`}
        description={`Netflix・Spotify・Amazonプライムほか${SERVICES.length}サービスの解約方法を1ページで一覧・比較。解約難易度・月額の目安・注意点・解約ページへの直リンクを、煽り・ランキングなしでまとめました。`}
        canonical="/compare"
        jsonLd={jsonLd}
      />

      <header className={styles.hero}>
        <img
          src="/assets/mascot/mascot-jito.svg"
          alt=""
          width="92"
          height="92"
          className={styles.heroMascot}
          aria-hidden="true"
        />
        <div className={styles.heroText}>
          <p className={styles.kicker}>解約方法 一覧・比較</p>
          <h1 className={styles.title}>サブスク{SERVICES.length}サービスの解約方法、1枚で見渡す</h1>
          <p className={styles.lead}>
            「どれが解約しにくいか」を、手順の多さ・導線の深さで中立にラベル付け。
            月額の目安・注意点・解約ページへの直リンクをまとめました。
            <strong>ランキングも★スコアもつけません</strong>——あなたの契約しているものを、ここから探してください。
          </p>
          <p className={styles.summary}>
            内訳：かんたん <b>{counts.easy}</b> ・ ふつう <b>{counts.medium}</b> ・ むずかしい <b>{counts.hard}</b>
            <span className={styles.summarySub}>（{SERVICES.length}サービス中）</span>
          </p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.chips} role="group" aria-label="カテゴリで絞り込み">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={cat === c.id ? `${styles.chip} ${styles.chipActive}` : styles.chip}
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className={styles.sort}>
          並び替え
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.sortSelect}>
            <option value="category">カテゴリ順</option>
            <option value="difficulty">解約難易度順</option>
            <option value="name">名前順</option>
          </select>
        </label>
      </div>

      <p className={styles.scrollHint} aria-hidden="true">← 横にスクロールできます →</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.thName}>サービス</th>
              <th scope="col">カテゴリ</th>
              <th scope="col">解約難易度</th>
              <th scope="col">月額の目安</th>
              <th scope="col" className={styles.thNote}>注意・ひとこと</th>
              <th scope="col">解約ページ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const d = DIFFICULTY[s.difficulty] || DIFFICULTY.medium;
              const monthly = getDefaultMonthly(s.id);
              return (
                <tr key={s.id}>
                  <th scope="row" className={styles.thName}>
                    <Link to={`/service/${s.id}`} className={styles.svcLink}>
                      <ServiceIcon serviceId={s.id} category={s.category} domain={s.domain} emoji={s.emoji} size={26} />
                      <span>{s.name}</span>
                    </Link>
                  </th>
                  <td className={styles.cat}>{CAT_LABEL[s.category] || 'その他'}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[`badge_${d.cls}`]}`}>{d.label}</span>
                  </td>
                  <td className={styles.price}>{monthly ? `¥${monthly.toLocaleString()}` : '—'}</td>
                  <td className={styles.note}>{s.note || '—'}</td>
                  <td>
                    <a href={s.cancelUrl} target="_blank" rel="noopener noreferrer" className={styles.cancelLink}>
                      解約ページ
                      <ExternalLink size={13} strokeWidth={2} aria-hidden="true" />
                    </a>
                    <Link to={`/service/${s.id}`} className={styles.stepsLink}>手順を見る</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.bae}>
        難易度は「手順の多さ・解約導線の深さ」に基づく中立のラベルで、サービスの優劣ではありません。
        月額は代表的なプランの目安です（正確な金額・違約金・最低利用期間は各サービスのページと公式でご確認ください）。
      </p>

      <div className={styles.next}>
        <Link to="/tracker" className={styles.nextCard}>
          <span className={styles.nextTitle}>固定費の棚卸し →</span>
          <span className={styles.nextSub}>契約中サブスクの「これからの年額」を1分で可視化（登録不要）</span>
        </Link>
        <Link to="/yamete-kau" className={styles.nextCard}>
          <span className={styles.nextTitle}>やめて買い切りで探す →</span>
          <span className={styles.nextSub}>月額をやめて単発購入で済ます。向く人・向かない人で正直に</span>
        </Link>
      </div>
    </div>
  );
}
