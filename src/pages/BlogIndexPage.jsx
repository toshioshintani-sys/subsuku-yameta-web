import { Link } from 'react-router-dom';
import { POSTS } from '../data/posts';
import Seo from '../components/Seo';
import styles from './BlogIndexPage.module.css';

export default function BlogIndexPage() {
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
          {POSTS.map((post) => (
            <li key={post.slug} className={styles.item}>
              <Link to={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={styles.date}>{post.published}</span>
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
