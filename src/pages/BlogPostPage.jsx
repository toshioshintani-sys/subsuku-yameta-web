import { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { POST_BY_SLUG, POSTS } from '../data/posts';
import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
import AdSlot from '../components/AdSlot';
import { SITE_URL } from '../config';
import styles from './BlogPostPage.module.css';

function renderBlock(block, i) {
  if (block.type === 'h2') {
    return <h2 key={i} className={styles.h2}>{block.text}</h2>;
  }
  if (block.type === 'ul') {
    return (
      <ul key={i} className={styles.ul}>
        {block.items.map((item, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    );
  }
  if (block.type === 'quote') {
    return <blockquote key={i} className={styles.quote}>{block.text}</blockquote>;
  }
  // default: paragraph (may contain inline HTML for links)
  return <p key={i} className={styles.p} dangerouslySetInnerHTML={{ __html: block.text }} />;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = POST_BY_SLUG[slug];

  // 関連記事は同タグ最大3件
  const related = useMemo(() => {
    if (!post) return [];
    return POSTS.filter((p) => p.slug !== post.slug && p.tags?.some((t) => post.tags?.includes(t))).slice(0, 3);
  }, [post]);

  const jsonLd = useMemo(() => {
    if (!post) return null;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.published,
        author: { '@type': 'Organization', name: 'サブスクやめた' },
        publisher: { '@type': 'Organization', name: 'サブスクやめた' },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'トップ', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'ブログ', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ],
      },
    ];
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className={styles.page}>
      <Seo
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        jsonLd={jsonLd}
      />

      <div className={styles.inner}>
        <nav className={styles.breadcrumb}>
          <Link to="/">トップ</Link>
          <span> › </span>
          <Link to="/blog">ブログ</Link>
        </nav>

        <article className={styles.article}>
          <div className={styles.head}>
            <div className={styles.meta}>
              <span className={styles.date}>{post.published}</span>
              {post.tags?.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.lead}>{post.description}</p>
          </div>

          <div className={styles.body}>
            {post.body.map((block, i) => renderBlock(block, i))}
          </div>
        </article>

        {/* 広告（記事を読み終えた自然なブレイク・解約導線より下・未設定なら非表示） */}
        <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_BLOG || import.meta.env.VITE_ADSENSE_SLOT_SERVICE} label="広告" />

        {/* シェア */}
        <ShareButtons
          path={`/blog/${post.slug}`}
          title={post.title}
          hashtags={['サブスクやめた', ...(post.tags || [])]}
        />

        {/* Tracker CTA */}
        <Link to="/tracker" className={styles.cta}>
          <div className={styles.ctaIcon}>📊</div>
          <div>
            <div className={styles.ctaTitle}>サブスクの棚卸しダッシュボード</div>
            <div className={styles.ctaSub}>月額・年額の合計と「解約しなさい順」を1分で可視化（個人情報不要）</div>
          </div>
        </Link>

        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>関連記事</h2>
            <ul className={styles.relatedList}>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/blog/${r.slug}`} className={styles.relatedCard}>
                    <span className={styles.relatedCardTitle}>{r.title}</span>
                    <span className={styles.relatedArrow}>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link to="/blog" className={styles.backLink}>← ブログ一覧に戻る</Link>
      </div>
    </div>
  );
}
