import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Scissors, LayoutGrid, ListChecks, FileText, Gamepad2, ShoppingBag, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.css';

// ナビは「初見で意味が分かる動詞ラベル」で統一（正式名は aria-label と Footer が持つ）。
// 並び＝解約後の「次の動き」A→B→C 順。ゲームは収益寄与が最小のため最右。
// デスクトップ＝横一列のフルラベル／モバイル(≤768px)＝ハンバーガー→ドロワー（フルラベル縦並び）。
// 横スクロール式はロゴと衝突し最後の項目が切れて美しくないため廃止（2026-06-13）。
const NAV_ITEMS = [
  { to: '/tracker/', label: '固定費の棚卸し', Icon: ListChecks, aria: '固定費の棚卸し（契約中サブスクを年額で見る）' },
  { to: '/discover/', label: '乗り換え先を探す', Icon: LayoutGrid, aria: 'サブスク図鑑（乗り換え先を特徴と弱点つきで比較）' },
  { to: '/yamete-kau/', label: '買い切りで探す', Icon: ShoppingBag, aria: 'やめて買う（月額をやめて単発購入で済ます）' },
  { to: '/blog/', label: 'お役立ち記事', Icon: FileText, aria: '解約・乗り換えのお役立ち記事' },
  { to: '/games/', label: '判断ゲーム', Icon: Gamepad2, aria: 'サブスク判断ゲーム' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // 展開中は Esc で閉じる
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="サブスクやめた トップへ" onClick={close}>
          <span className={styles.logoIcon} aria-hidden="true">
            <Scissors size={22} strokeWidth={1.75} />
          </span>
          <div>
            <div className={styles.logoTitle}>サブスクやめた</div>
            <div className={styles.logoSub}>解約・乗り換え・買い切りができるサイト</div>
          </div>
        </Link>

        <div className={styles.right}>
          {/* デスクトップ：横一列のフルラベルナビ（≤768px では非表示） */}
          <nav className={styles.nav} aria-label="主要ナビゲーション">
            {NAV_ITEMS.map(({ to, label, Icon, aria }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
                aria-label={aria}
              >
                <Icon size={16} strokeWidth={1.75} className={styles.navIcon} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <span className={styles.navDivider} aria-hidden="true" />
          <ThemeToggle />

          {/* モバイル：ハンバーガー（>768px では非表示） */}
          <button
            type="button"
            className={styles.menuButton}
            aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* モバイル：ドロワー（フルラベル縦並び・項目数が増えても破綻しない） */}
      <nav
        id="mobile-menu"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-label="メニュー"
        aria-hidden={!open}
      >
        {NAV_ITEMS.map(({ to, label, Icon, aria }) => (
          <NavLink
            key={to}
            to={to}
            tabIndex={open ? 0 : -1}
            className={({ isActive }) =>
              isActive ? `${styles.drawerLink} ${styles.drawerLinkActive}` : styles.drawerLink
            }
            aria-label={aria}
            onClick={() => setOpen(false)}
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      </header>

      {/* 背景オーバーレイは header の外に置く（header の backdrop-filter が
          position:fixed の包含ブロックになり全画面を覆えないため） */}
      {open && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="メニューを閉じる"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
