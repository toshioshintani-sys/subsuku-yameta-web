import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
import SunkCostGame from '../components/SunkCostGame';
import AdSlot from '../components/AdSlot';
import { SITE_URL } from '../config';
import styles from './GamesPage.module.css';

// 今後追加するバイアス（シリーズ予告・各回1つの"クセ"を体験で学ぶ）
const UPCOMING = [
  { name: '現状維持バイアス', desc: '「解約は3クリック、継続は1クリック」——手間の差があなたを続けさせる。' },
  { name: '損失回避', desc: '「アクセスを失う」と「年◯円浮く」。同じ事実でも、言い方で気持ちが変わる。' },
  { name: 'デフォルト効果', desc: '自動更新が"最初からオン"。何もしないと続いていく仕組み。' },
  { name: 'おとり効果', desc: '3段階の料金プラン。真ん中を選ばせるために用意された選択肢。' },
  { name: 'プランニング誤謬', desc: '「来月こそ使う」。未来の自分を、いつも少し過信している。' },
];

export default function GamesPage() {
  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'サブスク判断ゲーム', item: `${SITE_URL}/games` },
        ],
      },
    ],
    []
  );

  return (
    <div className={styles.page}>
      <Seo
        title="サブスク判断ゲーム｜行動経済学で「やめられない理由」を見抜く"
        description="なぜ使っていないサブスクをやめられないのか。行動経済学のバイアスを、サブスク継続判断のミニゲームで体験。第1弾「サンクコストの罠」であなたの判断グセを試そう。"
        canonical="/games"
        jsonLd={jsonLd}
      />

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>行動経済学で遊ぶ</p>
          <h1 className={styles.title}>サブスク判断ゲーム</h1>
          <p className={styles.lead}>
            「使っていないのに、なぜかやめられない」。それはあなたの意志が弱いからではありません。
            サブスクの解約画面や料金プランは、人の心のクセ（行動経済学でいう<strong>バイアス</strong>）を
            利用して作られています。
          </p>
          <p className={styles.lead}>
            このページのミニゲームは、あなたを引き止めるためのものではありません。逆です。
            <strong>サブスクがあなたに使っているクセを、ゲームで体験して見抜けるようにする</strong>ための練習です。
            見抜けるようになると、毎月の固定費の判断がぐっと楽になります。
          </p>
        </header>

        <section className={styles.gameSection} aria-label="第1弾 サンクコストの罠">
          <SunkCostGame />
        </section>

        <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_GAMES || import.meta.env.VITE_ADSENSE_SLOT_SERVICE} label="広告" />

        <section className={styles.explainer}>
          <h2 className={styles.h2}>「サンクコスト」とは？</h2>
          <p>
            サンクコスト（埋没費用）とは、<strong>すでに支払ってしまい、もう取り戻せないお金や時間</strong>のことです。
            行動経済学の実験では、人は「ここまで払った（使った）のだから」と、本来は判断に関係ないはずの
            サンクコストに引っ張られて、不合理な選択を続けてしまうことが繰り返し確認されています。
          </p>
          <p>
            サブスクで言えば、「8ヶ月も払ったし」「年会費を払ったから」という気持ちがこれにあたります。
            でも、すでに払ったお金は、続けても・やめても戻ってきません。
            合理的な判断材料は、<strong>「これから得られる価値」と「これから払うコスト」だけ</strong>。
            このたった一つの視点を持つだけで、「もったいない」に縛られない選択ができるようになります。
          </p>
        </section>

        <section className={styles.upcoming}>
          <h2 className={styles.h2}>今後のゲーム（順次追加）</h2>
          <p className={styles.upcomingLead}>
            サブスクが使ってくる"クセ"は、サンクコストだけではありません。次のような心の動きを、
            ひとつずつゲームで体験できるようにしていきます。
          </p>
          <ul className={styles.upcomingList}>
            {UPCOMING.map((u) => (
              <li key={u.name} className={styles.upcomingItem}>
                <span className={styles.upcomingName}>{u.name}</span>
                <span className={styles.upcomingDesc}>{u.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <ShareButtons
          path="/games"
          title="サブスク判断ゲーム｜行動経済学で「やめられない理由」を見抜く"
          hashtags={['サブスクやめた', 'サンクコスト', '行動経済学']}
        />

        <Link to="/tracker" className={styles.trackerCta}>
          <div>
            <div className={styles.trackerCtaTitle}>遊んだら、実際のサブスクで試そう</div>
            <div className={styles.trackerCtaSub}>
              棚卸しダッシュボードで、契約中サブスクの「これからのコスト（年額）」を1分で可視化 →
            </div>
          </div>
        </Link>

        <Link to="/" className={styles.backLink}>← トップに戻る</Link>
      </div>
    </div>
  );
}
