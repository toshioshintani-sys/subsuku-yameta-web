import styles from './StepsHowTo.module.css';

// 使い方3ステップ（design_handoff §5.6・不可侵：上部配置を維持）。
const STEPS = [
  { n: 1, t: '名前で探す', d: '上の検索かカテゴリから、解約したいサービスを選ぶ' },
  { n: 2, t: '解約ページへ直行', d: '3ステップ以内の手順と、引き止め画面の対策つき' },
  { n: 3, t: 'まとめて棚卸し', d: '残すものだけ決めて、年間の固定費を見直す' },
];

export default function StepsHowTo() {
  return (
    <section className={styles.wrap} aria-label="使い方">
      <h2 className={styles.title}>使い方は3ステップ</h2>
      <ol className={styles.list}>
        {STEPS.map((s) => (
          <li key={s.n} className={styles.item}>
            <span className={styles.num}>{s.n}</span>
            <span className={styles.text}>
              <span className={styles.itemTitle}>{s.t}</span>
              <span className={styles.itemDesc}>{s.d}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
