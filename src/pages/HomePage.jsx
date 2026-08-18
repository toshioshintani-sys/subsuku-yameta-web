import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Wallet, Armchair, Gift, SquareCheck, Dumbbell, Columns3 } from 'lucide-react';
import { SERVICES, getPopularity } from '../data/services';
import { BIAS_GAMES } from '../data/biasGames';
import Seo from '../components/Seo';
import HeroSearch from '../components/HeroSearch';
import RecentChanges from '../components/RecentChanges';
import CostAnchorCard from '../components/CostAnchorCard';
import StepsHowTo from '../components/StepsHowTo';
import ServiceList from '../components/ServiceList';
import CategoryBrowse from '../components/CategoryBrowse';
import NextMoves from '../components/NextMoves';
import StickyCtaBar from '../components/StickyCtaBar';
import { useCostCalculator } from '../hooks/useCostCalculator';
import { useSectionView } from '../hooks/useSectionView';
import styles from './HomePage.module.css';

// 息抜きコーナーの判断ゲームのアイコン（サイト共通の lucide 線アイコンで統一）
const GAME_ICONS = {
  'sunk-cost': Wallet,
  'status-quo': Armchair,
  'loss-aversion': Gift,
  'default-effect': SquareCheck,
  'planning-fallacy': Dumbbell,
  'decoy-effect': Columns3,
};

// ヒーローの人気チップ（よく解約されるもの）
const CHIP_IDS = ['netflix', 'spotify', 'amazon-prime'];

export default function HomePage() {
  // 計算機の状態は1か所で持ち、各セクションへ配る（合計を共有）
  const cal = useCostCalculator();

  const chipServices = CHIP_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean);
  const amountText = '年' + cal.yen(cal.annual);

  // Top10 に出るサービス（CategoryBrowse の除外用・ServiceList と同じ抽出ロジック）
  const top10Ids = useMemo(
    () =>
      [...SERVICES]
        .sort(
          (a, b) => getPopularity(b.id) - getPopularity(a.id) || a.name.localeCompare(b.name, 'ja')
        )
        .slice(0, 10)
        .map((s) => s.id),
    []
  );

  // セクション到達計測（GA4 home_section_view・構成論争をデータで決着させるため）
  const refTop10 = useSectionView('top10');
  const refCategories = useSectionView('categories');
  const refCalc = useSectionView('calculator');
  const refNextMoves = useSectionView('next_moves');

  return (
    <div className={styles.page}>
      <Seo canonical="/" />

      {/* ① ヒーロー＋検索（第一印象＝不可侵・全幅） */}
      <HeroSearch
        q={cal.q}
        setQ={cal.setQ}
        searchResults={cal.searchResults}
        chipServices={chipServices}
      />

      <div className={styles.content}>
        {/* ② 最近の変更（2026-07-25 追加・俊雄さん指示）
            価格・仕様の変更があった時だけ、直近3日分を日付つき箇条書きで出す。
            変更が無い日は要素ごと描画されない（null を返す）ので、
            通常時の第一印象・レイアウトは従来と完全に同じ＝§2-1 不可侵を保つ。
            ヒーロー（第一印象）の下・Top10 の上に置き、リンク先は解約手順ページ
            なので解約導線を弱めず、むしろ入口を増やす側に働く。 */}
        <RecentChanges />

        {/* ③ よく探される Top10（解約導線＝来訪目的への最短応答を検索直下に）
            2026-07-16 構成改訂（6視点パネル判定）：来訪者のジョブ（自分のサービスを
            見つけて解約する）に応える「探す層」を計算機より先に置く。
            「かんたんに切れるもの」はTop10と顔ぶれが重複していたため統合（難易度
            バッジは各行に表示済み） */}
        <div ref={refTop10}>
          <ServiceList limit={10} />
        </div>

        {/* ③ カテゴリ別リスト（BAE憲法§2不可侵の復元・残り57件への導線） */}
        <div ref={refCategories}>
          <CategoryBrowse excludeIds={top10Ids} />
        </div>

        {/* ④ 使い方は3ステップ（解約手順＝不可侵・上部域） */}
        <StepsHowTo />

        {/* ⑤ 固定費アンカー計算機（折りたたみ招待型・機能は不変・
            「探す層」の後の任意の深掘りツールとして提示） */}
        <div ref={refCalc}>
          <CostAnchorCard
            period={cal.period}
            setPeriod={cal.setPeriod}
            selectedServices={cal.selectedServices}
            on={cal.on}
            addService={cal.addService}
            removeService={cal.removeService}
            planIndexFor={cal.planIndexFor}
            setPlan={cal.setPlan}
            monthlyFor={cal.monthlyFor}
            target={cal.target}
            totalText={cal.totalText}
            fiveYearText={cal.fiveYearText}
            topCut={cal.topCut}
          />
        </div>

        {/* ⑥ やめた後の次の動き（乗り換え/買い切り＝B層/C層の収益導線・解約より控えめ） */}
        <div ref={refNextMoves}>
          <NextMoves />
        </div>

        {/* ⑦ 息抜き（既存機能・保持） */}
        <section className={styles.playZone} aria-label="息抜き">
          <h2 className={styles.playTitle}>ちょっと息抜き</h2>
          <p className={styles.playLead}>解約の合間に。遊びながら、固定費との距離感をつかむ。</p>
          <div className={styles.playLayout}>
            <div className={styles.gameMiniWrap}>
              <p className={styles.gameMiniHead}>
                <Gamepad2 size={15} strokeWidth={1.75} aria-hidden="true" />
                <span className={styles.gameMiniHeadMain}>判断ゲーム</span>
                <span className={styles.gameMiniHeadSub}>30秒で課金のクセを見抜く</span>
              </p>
              <div className={styles.gameMiniGrid}>
                {BIAS_GAMES.map((g) => {
                  const Icon = GAME_ICONS[g.id];
                  return (
                    <Link
                      key={g.id}
                      to={`/games/${g.id}/`}
                      className={styles.gameMini}
                      aria-label={`判断ゲーム：${g.headline}`}
                    >
                      <span className={styles.gameMiniIcon} aria-hidden="true">
                        {Icon ? <Icon size={22} strokeWidth={1.75} /> : null}
                      </span>
                      <span className={styles.gameMiniLabel}>{g.shortLabel}</span>
                    </Link>
                  );
                })}
              </div>
              <Link to="/games/" className={styles.gameMiniMore}>
                判断ゲームをまとめて見る →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* 親指ゾーン固定CTA（年額ライブ）。未入力（¥0）のときは意味を持たないので出さない
          （2026-07-16：空状態の二重表示ノイズを解消） */}
      {cal.annual > 0 && <StickyCtaBar amountText={amountText} />}
    </div>
  );
}
