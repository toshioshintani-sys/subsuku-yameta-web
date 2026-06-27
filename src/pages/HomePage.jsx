import { Link } from 'react-router-dom';
import { Gamepad2, Wallet, Armchair, Gift, SquareCheck, Dumbbell, Columns3 } from 'lucide-react';
import { SERVICES } from '../data/services';
import { BIAS_GAMES } from '../data/biasGames';
import Seo from '../components/Seo';
import SavingsGameLauncher from '../components/SavingsGameLauncher';
import HeroSearch from '../components/HeroSearch';
import CostAnchorCard from '../components/CostAnchorCard';
import EasyWins from '../components/EasyWins';
import StepsHowTo from '../components/StepsHowTo';
import ServiceList from '../components/ServiceList';
import NextMoves from '../components/NextMoves';
import StickyCtaBar from '../components/StickyCtaBar';
import { useCostCalculator } from '../hooks/useCostCalculator';
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
        {/* ② 固定費アンカー＋ナッジ（最重要） */}
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

        {/* ③ かんたんに切れるものから */}
        <EasyWins count={3} />

        {/* ④ 使い方は3ステップ（解約手順＝不可侵・上部域） */}
        <StepsHowTo />

        {/* ⑤ よく探される Top10 */}
        <ServiceList limit={10} />

        {/* ⑥ やめた後の次の動き（乗り換え/買い切り＝B層/C層の収益導線・解約より控えめ） */}
        <NextMoves />

        {/* ⑦ 息抜き（既存機能・保持） */}
        <section className={styles.playZone} aria-label="息抜き">
          <h2 className={styles.playTitle}>ちょっと息抜き</h2>
          <p className={styles.playLead}>解約の合間に。遊びながら、固定費との距離感をつかむ。</p>
          <div className={styles.playLayout}>
            <SavingsGameLauncher />
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
                      to={`/games/${g.id}`}
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
              <Link to="/games" className={styles.gameMiniMore}>
                判断ゲームをまとめて見る →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* 親指ゾーン固定CTA（年額ライブ） */}
      <StickyCtaBar amountText={amountText} />
    </div>
  );
}
