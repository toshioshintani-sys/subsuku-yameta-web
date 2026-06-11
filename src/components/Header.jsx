import { Link, NavLink } from 'react-router-dom';
import { Scissors, LayoutGrid, ListChecks, FileText, Gamepad2, ShoppingBag } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.css';

// ナビは「初見で意味が分かる動詞ラベル」で統一する（正式名は aria-label と Footer が持つ）。
// 並び＝解約後の「次の動き」A→B→C 順。ゲームは収益寄与が最小のため最右。
// モバイルは labelShort を縦積み表示（アイコンだけの「無言化」はしない）。
const NAV_ITEMS = [
  {
    to: '/tracker',
    label: '固定費の棚卸し',
    short: '棚卸し',
    Icon: ListChecks,
    aria: '固定費の棚卸し（契約中サブスクを年額で見る）',
  },
  {
    to: '/discover',
    label: '乗り換え先を探す',
    short: '乗り換え',
    Icon: LayoutGrid,
    aria: 'サブスク図鑑（乗り換え先を特徴と弱点つきで比較）',
  },
  {
    to: '/yamete-kau',
    label: '買い切りで探す',
    short: '買い切り',
    Icon: ShoppingBag,
    aria: 'やめて買う（月額をやめて単発購入で済ます）',
  },
  {
    to: '/blog',
    label: 'お役立ち記事',
    short: '記事',
    Icon: FileText,
    aria: '解約・乗り換えのお役立ち記事',
  },
  {
    to: '/games',
    label: '判断ゲーム',
    short: 'ゲーム',
    Icon: Gamepad2,
    aria: 'サブスク判断ゲーム',
  },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="サブスクやめた トップへ">
          <span className={styles.logoIcon} aria-hidden="true">
            <Scissors size={22} strokeWidth={1.75} />
          </span>
          <div>
            <div className={styles.logoTitle}>サブスクやめた</div>
            <div className={styles.logoSub}>解約・乗り換え・買い切りができるサイト</div>
          </div>
        </Link>
        <div className={styles.right}>
          <nav className={styles.nav} aria-label="主要ナビゲーション">
            {NAV_ITEMS.map(({ to, label, short, Icon, aria }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
                aria-label={aria}
              >
                <Icon size={16} strokeWidth={1.75} className={styles.navIcon} aria-hidden="true" />
                <span className={styles.labelFull}>{label}</span>
                <span className={styles.labelShort}>{short}</span>
              </NavLink>
            ))}
          </nav>
          <span className={styles.navDivider} aria-hidden="true" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
