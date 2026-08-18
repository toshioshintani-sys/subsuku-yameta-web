import { DIRECTION_LABEL } from '../data/services';
import styles from './DirectionBadge.module.css';

/**
 * 価格変更の方向バッジ（2026-08-04 共通化）
 *
 * 以前は ServicePage / PriceWatchPage が同じ意味のバッジを別々に定義しており、
 * 色の規則も個別に書かれていた。その結果 PriceWatchPage だけ
 * 「値上げ＝緑（プライマリ）」になり、上がるほうに良い色が付いていた。
 *
 * ラベル文字列は data/services.js（PRICE_HISTORY の隣）に置く。
 * ここに置くとコンポーネント以外をexportすることになり Fast Refresh が壊れる。
 */

/**
 * @param {{ direction: 'up'|'down'|'new'|'restructure', variant?: 'filled'|'outlined' }} props
 *   variant … filled=面（ServicePageの履歴・12px）／outlined=線（PriceWatchPageの記録・11px）
 */
export default function DirectionBadge({ direction, variant = 'filled' }) {
  const tone = styles[direction] || '';
  return (
    <span className={`${styles.base} ${styles[variant]} ${tone}`}>
      {DIRECTION_LABEL[direction] || '変更'}
    </span>
  );
}
