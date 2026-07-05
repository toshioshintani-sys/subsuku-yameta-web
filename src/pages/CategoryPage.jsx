import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { SERVICES, CATEGORIES } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import styles from './CategoryPage.module.css';

const DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };
const DIFFICULTY_COLOR = { easy: 'easy', medium: 'medium', hard: 'hard' };

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

// カテゴリ固有の解説（手書き・事実ベース）。統計値は SERVICES から実測して文章に埋め込む。
const CATEGORY_INTRO = {
  video: '動画配信は「気づけば3〜4本同時契約」が最も起きやすいカテゴリです。見放題の範囲が重なるサービスも多く、直近1ヶ月で実際に開いた本数が1つなら、残りは解約候補になります。',
  music: '音楽配信はどのサービスも主要曲のカバー率が近く、乗り換えの障壁が低いのが特徴です。プレイリストの引き継ぎだけ確認できれば、料金や特典で選び直しやすいカテゴリです。',
  shopping: '通販系の会員サービスは、送料無料や特典目当てで契約したまま「実は年に数回しか注文していない」状態になりやすいカテゴリです。直近の利用回数で継続要否を判断してください。',
  software: '仕事・創作系ソフトの月額は、チーム利用と個人利用が混在しがちで「誰が支払っているか」「無料版で足りるか」が見落とされがちです。個人利用なら無料枠の範囲を先に確認する価値があります。',
  news: 'ニュース・雑誌の読み放題は、キャリア決済経由で契約した記憶が薄い「気づいたら払っている」型が多いカテゴリです。携帯料金の明細で見覚えのない項目がないか確認するのが第一歩です。',
  game: 'ゲーム機のオンラインサービスは、対戦だけでなくセーブデータお預かりや遊び放題タイトルも同時に止まる設計です。「対戦だけ使っている」つもりでも影響範囲は広めに見ておくと安心です。',
  other: 'ジャンル横断の各種サービスは、それぞれ解約の作法が大きく異なります。決済経路（アプリ内課金かWebか）を最初に確認するのが、遠回りしない一番の近道です。',
};

export default function CategoryPage() {
  const { id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);

  const services = useMemo(() => {
    if (!category || category.id === 'all') return [];
    return SERVICES.filter((s) => s.category === category.id).sort(
      (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
    );
  }, [category]);

  // カテゴリ内の解約難易度分布・注意サービスを実データから集計（捏造なし・services.js準拠）
  const stats = useMemo(() => {
    const dist = { easy: 0, medium: 0, hard: 0 };
    services.forEach((s) => { dist[s.difficulty] = (dist[s.difficulty] || 0) + 1; });
    const hardOnes = services.filter((s) => s.difficulty === 'hard').map((s) => s.name);
    const withNote = services.filter((s) => s.note).length;
    return { dist, hardOnes, withNote };
  }, [services]);

  if (!category || category.id === 'all') {
    return <Navigate to="/" replace />;
  }

  const title = `${category.label}サブスクの解約方法まとめ`;
  const description = `${category.label}サブスクの解約ページへの直リンクと、3ステップの解約手順を一覧にまとめています。`;

  const statsText = services.length
    ? `${services.length}サービス中、解約が「かんたん」${stats.dist.easy}件・「ふつう」${stats.dist.medium}件・「むずかしい」${stats.dist.hard}件${
        stats.hardOnes.length
          ? `。特に${stats.hardOnes.slice(0, 3).join('・')}は手順が分かりにくいので注意`
          : ''
      }${stats.withNote ? `。${stats.withNote}件は解約時の落とし穴（引き止め表示・決済経路の分岐等）を個別に注記しています` : ''}。`
    : '';

  return (
    <div className={styles.page}>
      <Seo title={title} description={description} canonical={`/category/${category.id}`} />

      <section className={styles.hero}>
        <nav className={styles.breadcrumb}>
          <Link to="/">トップ</Link>
          <span> › </span>
          <span>{category.label}</span>
        </nav>
        <h1 className={styles.title}>{category.label}サブスクの解約方法まとめ</h1>
        <p className={styles.desc}>
          {category.label}カテゴリの{services.length}サービスの解約ページへ、ここから直接ジャンプできます。
        </p>
        {CATEGORY_INTRO[category.id] && (
          <p className={styles.desc}>{CATEGORY_INTRO[category.id]}</p>
        )}
        {statsText && <p className={styles.desc}>{statsText}</p>}
      </section>

      <div className={styles.content}>
        {services.length === 0 ? (
          <p className={styles.empty}>このカテゴリのサービスはまだ登録されていません。</p>
        ) : (
          <div className={styles.grid}>
            {services.map((s) => (
              <Link to={`/service/${s.id}`} key={s.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <ServiceIcon serviceId={s.id} category={s.category} domain={s.domain} emoji={s.emoji} size={44} />
                  <span className={`${styles.badge} ${styles[DIFFICULTY_COLOR[s.difficulty]]}`}>
                    {DIFFICULTY_LABEL[s.difficulty]}
                  </span>
                </div>
                <div className={styles.cardName}>{s.name}</div>
                <div className={styles.cardMeta}>{s.steps.length}ステップで完了</div>
                <div className={styles.cardArrow}>解約手順を見る →</div>
              </Link>
            ))}
          </div>
        )}

        <Link to="/" className={styles.backLink}>← すべてのカテゴリを見る</Link>
      </div>
    </div>
  );
}
