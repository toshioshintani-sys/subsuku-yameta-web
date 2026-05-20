import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { SERVICES, CATEGORIES } from '../data/services';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import styles from './CategoryPage.module.css';

const DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };
const DIFFICULTY_COLOR = { easy: 'easy', medium: 'medium', hard: 'hard' };

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

export default function CategoryPage() {
  const { id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);

  const services = useMemo(() => {
    if (!category || category.id === 'all') return [];
    return SERVICES.filter((s) => s.category === category.id).sort(
      (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
    );
  }, [category]);

  if (!category || category.id === 'all') {
    return <Navigate to="/" replace />;
  }

  const title = `${category.label}サブスクの解約方法まとめ`;
  const description = `${category.label}サブスクの解約ページへの直リンクと、3ステップの解約手順を一覧にまとめています。`;

  return (
    <div className={styles.page}>
      <Seo title={title} description={description} />

      <section className={styles.hero}>
        <nav className={styles.breadcrumb}>
          <Link to="/">トップ</Link>
          <span> › </span>
          <span>{category.label}</span>
        </nav>
        <h1 className={styles.title}>{category.label}サブスクの解約方法まとめ</h1>
        <p className={styles.desc}>
          {category.label}カテゴリの{services.length}サービスの解約ページへ、ここから直接ジャンプできます。
        </p>
      </section>

      <div className={styles.content}>
        {services.length === 0 ? (
          <p className={styles.empty}>このカテゴリのサービスはまだ登録されていません。</p>
        ) : (
          <div className={styles.grid}>
            {services.map((s) => (
              <Link to={`/service/${s.id}`} key={s.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <ServiceIcon domain={s.domain} emoji={s.emoji} size={44} />
                  <span className={`${styles.badge} ${styles[DIFFICULTY_COLOR[s.difficulty]]}`}>
                    {DIFFICULTY_LABEL[s.difficulty]}
                  </span>
                </div>
                <div className={styles.cardName}>{s.name}</div>
                <div className={styles.cardMeta}>{s.steps.length}ステップで完了</div>
                <div className={styles.cardArrow}>解約手順を見る →</div>
              </Link>
            ))}
          </div>
        )}

        <Link to="/" className={styles.backLink}>← すべてのカテゴリを見る</Link>
      </div>
    </div>
  );
}
