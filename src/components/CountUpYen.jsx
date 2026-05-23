import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

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

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
