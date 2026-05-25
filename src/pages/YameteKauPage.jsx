import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Tag, AlertCircle } from 'lucide-react';
import Seo from '../components/Seo';
import {
  YAMETE_KAU_CATEGORIES,
  getProductsByCategory,
} from '../data/yameteKau';
import {
  buildAmazonSearchUrl,
  buildRakutenSearchUrl,
  trackAffiliateClick,
} from '../data/affiliates';
import styles from './YameteKauPage.module.css';

/**
 * 「やめて買う」ページ
 *
 * BAE 設計憲法 v2.0 § 12 C 層（買い切り）の実装。
 * 解約で浮いたお金で買える 25 点の便利グッズを Amazon/楽天 で提示。
 *
 * ・禁則句なし（おすすめ・ベスト・No.1・神・絶対 使用なし）
 * ・両論併記（each product に why と warning）
 * ・PR ラベル明示
 * ・解約導線への戻り口を上下両方に配置
 */
export default function YameteKauPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const grouped = getProductsByCategory();

  const visibleGroups =
    activeCategory === 'all' ? grouped : grouped.filter((g) => g.id === activeCategory);

  return (
    <article className={styles.page}>
      <Seo
        title="やめて買う — 解約で浮いたお金で買える便利グッズ"
        description="サブスクをやめて浮いた1〜2ヶ月分で買える、生活が少し豊かになる買い切りグッズ25点。月額の重さから一度離れて、自分のペースで使えるものを選ぶための入口。"
        canonical="/yamete-kau"
      />

      <div className={styles.hero}>
        <Link to="/" className={styles.back}>
          <ArrowLeft size={14} strokeWidth={2} />
          <span>トップに戻る</span>
        </Link>
        <h1 className={styles.h1}>やめて買う</h1>
        <p className={styles.lead}>
          サブスクをやめて浮いた1〜2ヶ月分で買える、生活が少し豊かになる買い切りグッズ。
          月額の重さから一度離れて、自分のペースで使えるものを選ぶための入口です。
        </p>
        <p className={styles.note}>
          価格帯は 1,500〜3,000円。すべて Amazon / 楽天市場 の検索結果ページにリンクしています
          （在庫切れリスクを避け、複数の選択肢から選べる形にしています）。
        </p>
      </div>

      {/* カテゴリフィルタ */}
      <nav className={styles.filter} aria-label="カテゴリで絞り込む">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterBtnActive : ''}`}
        >
          すべて
        </button>
        {YAMETE_KAU_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterBtnActive : ''}`}
          >
            <span aria-hidden="true">{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </nav>

      {/* カテゴリ別商品リスト */}
      {visibleGroups.map((group) => (
        <section key={group.id} className={styles.group} aria-labelledby={`cat-${group.id}`}>
          <h2 id={`cat-${group.id}`} className={styles.groupTitle}>
            <span aria-hidden="true">{group.emoji}</span> {group.name}
          </h2>
          <ul className={styles.grid}>
            {group.products.map((product) => (
              <li key={product.id} className={styles.card}>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.cardPrice}>
                  <Tag size={12} strokeWidth={2} aria-hidden="true" />
                  <span>{product.priceHint}</span>
                </p>
                <p className={styles.cardWhy}>{product.why}</p>
                <p className={styles.cardWarn}>
                  <AlertCircle size={12} strokeWidth={2} aria-hidden="true" />
                  <span>{product.warning}</span>
                </p>
                <div className={styles.cardLinks}>
                  <a
                    href={buildAmazonSearchUrl(product.amazonQuery)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className={styles.cardLink}
                    onClick={() =>
                      trackAffiliateClick({
                        asp: 'amazon',
                        service: product.id,
                        placement: 'yamete_kau',
                        position: 1,
                      })
                    }
                  >
                    Amazonで探す <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
                  </a>
                  <a
                    href={buildRakutenSearchUrl(product.rakutenQuery)}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className={styles.cardLink}
                    onClick={() =>
                      trackAffiliateClick({
                        asp: 'rakuten',
                        service: product.id,
                        placement: 'yamete_kau',
                        position: 2,
                      })
                    }
                  >
                    楽天で探す <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
                  </a>
                  <span className={styles.prLabel} aria-label="広告">PR</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* 安全網：合わなければ解約に戻れる */}
      <aside className={styles.safety}>
        <p>
          試してみて「思っていたのと違う」と感じたら、
          いつでも <Link to="/">解約導線</Link> に戻ってこれます。
          買い切り商品も、必要なくなったらフリマで手放せます。
        </p>
      </aside>
    </article>
  );
}
