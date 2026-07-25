import { useMemo, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { POST_BY_SLUG, POSTS } from '../data/posts';
import { detectAsp, trackAffiliateClick, sanitizeReviewHtml } from '../data/affiliates';
import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
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
          <li key={j} dangerouslySetInnerHTML={{ __html: sanitizeReviewHtml(item) }} />
        ))}
      </ul>
    );
  }
  if (block.type === 'quote') {
    return <blockquote key={i} className={styles.quote}>{block.text}</blockquote>;
  }
  // 比較表（2026-07-25 追加）。3社比較のように「並べて見る」情報を、
  // 段落に散らさず一目で比べられるようにするための最小の表ブロック。
  //   { type: 'table', caption?, head: ['項目','A','B'], rows: [['行見出し','値','値'], ...] }
  // 各行の先頭セルは行見出し（th scope="row"）として扱う。
  // 狭い画面でははみ出さずに横スクロールさせる（本文の横スクロールは絶対に起こさない）。
  // ★スコアや順位は入れないこと（BAE §5 禁則）。事実だけを並べる。
  if (block.type === 'table') {
    return (
      <div
        key={i}
        className={styles.tableWrap}
        role="region"
        aria-label={block.caption || '比較表'}
        tabIndex={0}
      >
        <table className={styles.table}>
          {block.caption && <caption className={styles.tableCaption}>{block.caption}</caption>}
          <thead>
            <tr>
              {block.head.map((h, j) => (
                <th key={j} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, j) => (
              <tr key={j}>
                {row.map((cell, k) =>
                  k === 0 ? (
                    <th
                      key={k}
                      scope="row"
                      dangerouslySetInnerHTML={{ __html: sanitizeReviewHtml(cell) }}
                    />
                  ) : (
                    <td key={k} dangerouslySetInnerHTML={{ __html: sanitizeReviewHtml(cell) }} />
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.type === 'img') {
    return (
      <figure key={i} className={styles.figure}>
        <img
          src={block.src}
          alt={block.alt || ''}
          className={styles.figureImg}
          loading="lazy"
          decoding="async"
        />
        {block.caption && <figcaption className={styles.figcaption}>{block.caption}</figcaption>}
      </figure>
    );
  }
  // default: paragraph (may contain inline HTML for links)
  return <p key={i} className={styles.p} dangerouslySetInnerHTML={{ __html: sanitizeReviewHtml(block.text) }} />;
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
    const schemas = [
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
    // FAQPage：記事内に表示する Q&A と完全一致する場合のみ出力（Google ポリシー順守＝可視テキストと一致）
    if (post.faq?.length) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    return schemas;
  }, [post]);

  // 本文（dangerouslySetInnerHTML）内のアフィリンクは React の onClick に乗らないため、
  // 本文コンテナにイベント委譲リスナーを1つ置いて affiliate_click を計測する。
  // 既存の detectAsp / trackAffiliateClick を再利用（新規依存なし）。
  const handleBodyClick = useCallback((e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const asp = detectAsp(a.href);
    if (asp === 'direct') return; // 内部リンク・非アフィは計測しない
    trackAffiliateClick({
      asp,
      service: post?.slug || 'unknown',
      placement: 'blog_inline',
      position: 0,
    });
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

          <div className={styles.body} onClick={handleBodyClick}>
            {post.body.map((block, i) => renderBlock(block, i))}
          </div>

          {/* よくある質問（記事内容に基づく・FAQPage構造化データと一致＝AI検索/リッチリザルト用） */}
          {post.faq?.length > 0 && (
            <section className={styles.faq} aria-label="よくある質問">
              <h2 className={styles.h2}>よくある質問</h2>
              {post.faq.map((f, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary className={styles.faqQ}>{f.q}</summary>
                  <p className={styles.faqA}>{f.a}</p>
                </details>
              ))}
            </section>
          )}
        </article>

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
