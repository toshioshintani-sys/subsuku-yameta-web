import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { POSTS } from '../data/posts';
import Seo from '../components/Seo';
import styles from './BlogIndexPage.module.css';

export default function BlogIndexPage() {
  // 公開日の新しい順に並べる（2026-07-25 俊雄さん指示）。
  // それまでは posts.js の配列順のまま出していたため、日付を表示しているのに
  // 並びが日付と一致せず、新しく書いた記事が一覧の最下部に埋もれていた。
  // 同日に複数本ある場合は、posts.js の記載順を維持する（sort が安定ソートのため）。
  const posts = useMemo(
    () => [...POSTS].sort((a, b) => (a.published < b.published ? 1 : a.published > b.published ? -1 : 0)),
    []
  );

  return (
    <div className={styles.page}>
      <Seo
        title="サブスク解約のお役立ち記事"
        description="サブスクをやめにくくする仕組み、家計見直しの順番、引き止め画面の突破法など、解約と家計管理のコツをまとめたブログ。"
        canonical="/blog"
      />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>サブスク解約のお役立ち記事</h1>
        <p className={styles.heroDesc}>
          解約しにくい仕組みの正体、家計見直しの優先順位、引き止め画面の突破法など、
          サブスクと上手に付き合うためのガイド集。
        </p>
        <p className={styles.heroDesc}>
          全{POSTS.length}本。軸になっているのは「卒業して別のものを試した体験談」と「解約して買い切りに切り替えた損益分岐」の2系統です。ダークパターンの見抜き方や支払い方法の選び方、年契約と月契約の判断軸なども読み切りサイズでまとめています。ランキングや★評価は使わず、実際の手順と数字だけを載せる方針です。
        </p>
      </section>

      <div className={styles.content}>
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug} className={styles.item}>
              <Link to={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={styles.date}>{post.published}</span>
                  {/* 扱っているAIサービスのバッジ（2026-07-25 追加）。
                      どのAIの話かを一覧で見分けられるようにするためのもので、
                      執筆者の表示ではない。post.ai が無い記事には何も出ない。 */}
                  {post.ai?.map((name) => (
                    <span key={name} className={styles.aiTag}>
                      {name}
                    </span>
                  ))}
                  {post.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.cardDesc}>{post.description}</p>
                <span className={styles.cardArrow}>続きを読む →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
