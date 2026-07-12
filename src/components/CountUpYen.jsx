import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * 損失額をカウントアップアニメーションで表示する
 *
 * BAE 設計原則：損失可視化（行動経済学のナッジ）
 * - 数字が静的に「年¥17,880」と書いてあるより、0 から動く方が
 *   損失の実感が強まる（プランニング・コミット効果）
 *
 * - 視差・モーションを減らす設定のユーザーには即座に最終値表示
 * - inView になった瞬間にアニメーション開始（初回のみ）
 * - 表示は JetBrains Mono の等幅で揃う
 *
 * ★安全網（2026-07-11追加・自動化ブラウザでの検証中に発見）：
 * タブが非表示（document.hidden）の間は IntersectionObserver（inView判定）も
 * requestAnimationFrame も止まるブラウザがある。さらに、MotionValueの内部値を
 * count.set()で直接更新しても、motion.spanがそれをDOMへ書き戻す処理自体もrAF依存
 * のため、値は正しく更新されているのに画面には反映されないまま固まる（=count.set()
 * では解決しない構造的な問題と実機検証で確認済み）。
 * そのため非表示を検知したら、rAFに依存しないプレーンなReact state（forceStatic）
 * に切り替えて通常のDOM差分更新で確定値を出す（可視状態が続く通常ケースでは
 * このフォールバックは発火せず、従来通りのカウントアップ演出のまま）。
 */
export default function CountUpYen({
  value,
  duration = 1.2,
  className,
  prefix = '¥',
  delay = 0,
  reducedMotion = false,
}) {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    `${prefix}${Math.round(latest).toLocaleString('ja-JP')}`
  );
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  // マウント時点で既に非表示なら、render中（副作用でなく初期値として）静的表示を選ぶ
  const [forceStatic, setForceStatic] = useState(
    () => typeof document !== 'undefined' && document.hidden
  );

  useEffect(() => {
    if (!inView) return;
    // 視差を減らす設定なら即座に最終値
    if (
      reducedMotion ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration,
      delay,
      ease: [0.2, 0.65, 0.3, 1], // easeOutQuart 風
    });
    return () => controls.stop();
  }, [inView, value, duration, delay, count, reducedMotion]);

  // 非表示への変化を購読するだけ（setStateは常にイベントコールバック内から）。
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibilityChange = () => {
      if (document.hidden) setForceStatic(true);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  if (forceStatic) {
    return (
      <span className={className}>
        {prefix}
        {Math.round(value).toLocaleString('ja-JP')}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
