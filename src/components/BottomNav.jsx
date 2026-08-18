import { NavLink } from 'react-router-dom';
import { Home, ListChecks, LayoutGrid, ShoppingBag, FileText } from 'lucide-react';
import styles from './BottomNav.module.css';

// ボトムタブバー（モバイル専用）。
// 各タブに「文字ラベル」を出す＝押す前に（押さずに）行き先が分かる。
// ハンバーガー（☰）は使わず、主要動線を常時"画面に"出す。
// タブ＝解約(home)＋3層モデル(棚卸し/乗り換え/買い切り)＋記事。
// ゲームは憲法（GAME_POSITIONING）で"おまけ"位置づけのため一次タブから外す（入れ替え可）。
const TABS = [
  { to: '/', label: '解約', Icon: Home, end: true },
  { to: '/tracker/', label: '棚卸し', Icon: ListChecks },
  { to: '/discover/', label: '乗り換え', Icon: LayoutGrid },
  { to: '/yamete-kau/', label: '買い切り', Icon: ShoppingBag },
  { to: '/blog/', label: '記事', Icon: FileText },
];

export default function BottomNav() {
  return (
    <nav className={styles.bar} aria-label="メインナビゲーション">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab)}
        >
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
