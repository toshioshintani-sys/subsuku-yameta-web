import { lazy, Suspense, useState } from 'react';
import styles from './SavingsGameLauncher.module.css';

// ゲーム本体は遊ぶ時だけロード（初期バンドル増を防ぐ）
const SavingsGame = lazy(() => import('./SavingsGame'));

/**
 * HomePage 下部に置く控えめな 8bit サムネ。
 * クリックでゲームモーダル起動。
 *
 * BAE 準拠：解約導線 > アフィリ > 装飾 の視覚序列を守るため、
 * 小サイズ・ニュートラルカラー・ホバー時のみ少し光る。
 */
export default function SavingsGameLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={styles.launcher}
        aria-label="やめたつもり貯金ゲームを起動"
        title="やめたつもり貯金ゲーム（8bit）"
      >
        {/* 8bit ピクセルアート風 SVG サムネ（CSS で拡大）*/}
        <svg
          className={styles.pixelArt}
          viewBox="0 0 10 10"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {/* 背景（暗い夜空）*/}
          <rect x="0" y="0" width="10" height="10" fill="#0a1530" />
          {/* コイン（黄色・上から降ってくる）*/}
          <rect x="1" y="1" width="2" height="2" fill="#fbbf24" />
          <rect x="6" y="2" width="2" height="2" fill="#fbbf24" />
          <rect x="3" y="4" width="2" height="2" fill="#fbbf24" />
          {/* プレイヤー（下中央・ティール）*/}
          <rect x="3" y="7" width="4" height="2" fill="#5eead4" />
          <rect x="3" y="6" width="4" height="1" fill="#5eead4" />
          {/* プレイヤーの目 */}
          <rect x="4" y="7" width="1" height="1" fill="#0a1530" />
          <rect x="5" y="7" width="1" height="1" fill="#0a1530" />
        </svg>
        <span className={styles.label}>やめたつもり貯金</span>
      </button>

      {open && (
        <Suspense fallback={null}>
          <SavingsGame onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
