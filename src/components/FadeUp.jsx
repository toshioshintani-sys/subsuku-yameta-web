import { motion, useReducedMotion } from 'framer-motion';

// DESIGN_UPGRADE 作業3：スクロールで「すっと現れる」共通アニメーション。
// 見出しやカード群を <FadeUp> で囲むだけ。once:true で1回だけ再生。
// 注：framer-motion は JS でトランスフォームするため index.css の
//     prefers-reduced-motion（CSS）では止まらない。ここで明示的に無効化する。
const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FadeUp({ children, delay = 0, className }) {
  const reduce = useReducedMotion();

  // モーション削減設定のユーザーには、アニメーションせずそのまま表示
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
