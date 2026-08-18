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
  music: '音楽配信はどのサービスも主要曲のカバー率が近く、乗り換えの障壁は低めです。プレイリストの引き継ぎさえ確認できれば、料金や特典で選び直しやすいジャンルだと言えます。SpotifyやApple Musicの解約は数クリックで済みますが、LINE MUSICやSoundCloud Goはアプリ内課金かWeb契約かで解約場所がまったく変わります。「プライムだから」「キャリア特典だから」と流れで契約した1本があるなら、実際に聴いている頻度と見比べてみてください。',
  shopping: '通販系の会員サービスは、送料無料や特典目当てで契約したまま実は年に数回しか注文していない、という状態になりやすいカテゴリです。直近の利用回数で継続要否を判断してください。カテゴリの代表格Amazonプライムは配送特典だけでなく動画・音楽・読書の特典もセットになっています。送料無料以外をほとんど使っていないなら、年間の会費と注文回数を一度比べてみてください。解約画面は「特典を終了する」という小さめのリンクを何度かたどる形で、途中に継続を勧める案内も挟まりますが、手続き自体は数分で終わります。年間プランを解約すると未使用期間分は日割りで一部返金されますが、特典を使った形跡が多いほど返金額は減ります。家族で共有している場合は、代表者が解約すると共有設定の家族会員も同時に外れる点も覚えておいてください。',
  software: '仕事・創作系ソフトの月額は、チーム利用と個人利用が混在しがちです。「誰が払っているか」「無料版で足りるか」を見落としたまま契約が続いているケースは珍しくありません。FigmaやDropboxのようなチーム課金型は支払い管理者しか解約できず、編集権限の人数で料金も変わります。個人利用なら、まず無料枠でどこまで足りるか確認するところから始めてください。',
  news: 'ニュース・雑誌の読み放題は、キャリア決済経由で契約した記憶が薄いカテゴリです。気づいたら払っている状態になりやすいので、携帯料金の明細を一度見返してみてください。dマガジンや楽天マガジンのようなキャリア・経済圏連携サービスは、解約手続きの途中で完了画面まで進まないと契約が残ることがあります。「手続きを完了する」の表示が出たかどうか、最後に確かめておきましょう。',
  game: 'ゲーム機のオンラインサービスは、対戦だけでなくセーブデータお預かりや遊び放題タイトルも一緒に止まります。「対戦だけ使っている」つもりでも、影響範囲は広めに見ておいたほうがいいでしょう。PlayStation Plus・Xbox Game Pass・Nintendo Switch Onlineはいずれも自動更新が既定オンで、「解約」の実態はほとんどの場合「自動更新の停止」です。支払い済み期間が終わるまでは通常どおり遊べるので、使わないと決めた時点で自動更新だけ先に止めておくと安心です。3サービスとも本体・プラットフォームに閉じた仕組みで、あるハードの遊び放題タイトルを別ハードへ持ち越すことはできません。複数機種を持っているなら、実際に使っているハードがどれか整理してみると重複契約に気づきやすくなります。',
  other: 'ジャンル横断の各種サービスは、それぞれ解約の作法が大きく異なります。まず決済経路（アプリ内課金かWebか）を確認するのが、遠回りしない近道です。マッチングアプリのPairsやMatchはアプリ内に解約ボタンがなく、ブラウザでの手続きが必須です。Patreonはクリエイターごとの個別解約になるなど、「その他」ならではの落とし穴も少なくありません。契約した覚えのあるサービスから順に、決済経路を1つずつ確認していきましょう。',
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
              <Link to={`/service/${s.id}/`} key={s.id} className={styles.card}>
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
