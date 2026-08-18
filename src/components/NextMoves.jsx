import { Link } from 'react-router-dom';
import { ArrowRight, Repeat, Package } from 'lucide-react';
import styles from './NextMoves.module.css';

// やめた後の次の動き（3層モデルの B層=乗り換え / C層=買い切り の収益導線）。
// §2-2：解約導線より視覚的に控えめに置く（アフィは信頼の上に立つ二次収益）。
const MOVES = [
  {
    icon: Repeat,
    title: '合うものに乗り換える',
    desc: '解約した後の代替サブスクを、特徴と弱点つきで比較する',
    to: '/discover/',
    action: '乗り換え先を見る',
  },
  {
    icon: Package,
    title: '買い切りで済ませる',
    desc: '月額を増やさず、単発購入で足りるラインを探す',
    to: '/yamete-kau/',
    action: '買い切りを見る',
  },
];

export default function NextMoves() {
  return (
    <section className={styles.wrap} aria-label="やめた後の次の動き">
      <h2 className={styles.title}>やめた後の、次の動き</h2>
      <p className={styles.lead}>解約だけで終わらせず、固定費を組み替える。</p>
      <div className={styles.grid}>
        {MOVES.map((m) => {
          const Icon = m.icon;
          return (
            <Link to={m.to} key={m.to} className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <span className={styles.body}>
                <span className={styles.cardTitle}>{m.title}</span>
                <span className={styles.desc}>{m.desc}</span>
              </span>
              <span className={styles.action}>
                {m.action}
                <ArrowRight size={13} strokeWidth={1.9} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
