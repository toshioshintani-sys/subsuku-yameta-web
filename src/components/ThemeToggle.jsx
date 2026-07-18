import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

// 保存キー（ローカルストレージ）
const STORAGE_KEY = 'sabusuku-theme';

/**
 * テーマトグル：light / dark / system の3状態。
 * - 初回：localStorage を見て、なければ system。
 * - クリック：system → dark → light → system… の3段ループ。
 * - data-theme 属性を <html> に書き込んで CSS 側で切替。
 *
 * BAE 設計憲法：解約導線 > アフィリエイト > 装飾 の視覚序列を守りつつ、
 * 暗所での視認性を確保するため accent カラー輪郭で光らせる。
 */
export default function ThemeToggle() {
  // 初期値は localStorage から遅延初期化（マウント後の setState による再レンダーを避ける。
  // main.jsx は createRoot（hydration なし）なのでプリレンダーHTMLとの不一致問題はない）
  const [theme, setTheme] = useState(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  });

  // theme 変化を <html data-theme=""> に反映
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
      if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    } else {
      root.setAttribute('data-theme', theme);
      if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  function cycle() {
    setTheme((prev) => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  }

  const label =
    theme === 'dark'
      ? 'ダークモード（タップでライトに切替）'
      : theme === 'light'
        ? 'ライトモード（タップで自動に切替）'
        : '自動（システム設定に追従・タップでダークに切替）';

  return (
    <button
      type="button"
      onClick={cycle}
      className={styles.toggle}
      data-theme-state={theme}
      aria-label={label}
      title={label}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        {/* dark 表示中 → Sun アイコン（クリックで明るくなる方向） */}
        {/* light 表示中 → Moon アイコン（クリックで暗くなる方向） */}
        {/* system → 現在の OS 設定に応じて自動で見える方を CSS で出す */}
        <Sun size={18} strokeWidth={2} className={styles.iconSun} />
        <Moon size={18} strokeWidth={2} className={styles.iconMoon} />
      </span>
    </button>
  );
}
