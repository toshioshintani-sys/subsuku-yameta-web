import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import DifficultyBadge from './DifficultyBadge';
import { trackServiceSearch } from '../utils/analytics';
import styles from './HeroSearch.module.css';

// ヒーロー＋検索（design_handoff §5.2）。
// ★不可侵（§3）：濃紺ヒーロー・キリさんイラスト・見出し「解約したいのに、どこから？」・
//   解約を最上位に置く第一印象は現行を保持する。ここで足すのは検索の手触り（typeahead・チップ）のみ。
export default function HeroSearch({ q, setQ, searchResults, chipServices = [] }) {
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    const selected = searchResults[0];
    trackServiceSearch({
      term: q,
      resultCount: searchResults.length,
      selectedService: selected?.id,
      method: 'submit',
      position: selected ? 1 : 0,
    });
    if (selected) navigate(`/service/${selected.id}`);
  };

  const trackResultSelection = (service, position) => {
    trackServiceSearch({
      term: q,
      resultCount: searchResults.length,
      selectedService: service.id,
      method: 'result_click',
      position,
    });
  };

  const trackNoResultRequest = () => {
    trackServiceSearch({
      term: q,
      resultCount: 0,
      method: 'no_result_request',
    });
  };

  const querying = q.trim().length > 0;

  return (
    <section className={styles.hero}>
      {/* 背景：キリさんが紐を切るイラスト（第一印象=不可侵。現行を据え置き） */}
      <picture className={styles.heroBg} aria-hidden="true">
        <source media="(max-width: 600px)" srcSet="/assets/hero/hero-main-mobile-dark.svg" />
        <img src="/assets/hero/hero-main-dark.svg" alt="" loading="eager" decoding="async" />
      </picture>

      <div className={styles.inner}>
        <h1 className={styles.title}>
          解約したいのに、<span className={styles.mark}>どこから？</span>
        </h1>
        <p className={styles.sub}>サービス名を入れるだけ。その解約ページへ、最短で。</p>

        <form className={styles.searchWrap} role="search" onSubmit={onSubmit}>
          <span className={styles.searchIcon} aria-hidden="true">
            <Search size={18} strokeWidth={1.8} />
          </span>
          <label htmlFor="hero-search" className="sr-only">
            サービス名で検索
          </label>
          <input
            id="hero-search"
            className={styles.input}
            type="search"
            placeholder="例：Netflix、Spotify…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
          {q && (
            <button type="button" className={styles.clear} onClick={() => setQ('')} aria-label="検索をクリア">
              <X size={16} strokeWidth={1.9} aria-hidden="true" />
            </button>
          )}
          <button type="submit" className={styles.goBtn} aria-label="検索して解約ページへ">
            <ArrowRight size={18} strokeWidth={2.1} aria-hidden="true" />
          </button>
        </form>

        {querying ? (
          <div className={styles.results}>
            {searchResults.length === 0 ? (
              <Link to="/contact" className={styles.empty} onClick={trackNoResultRequest}>
                <span>「{q.trim()}」は準備中。リクエスト</span>
                <ArrowRight size={13} strokeWidth={1.9} aria-hidden="true" />
              </Link>
            ) : (
              searchResults.map((s, i) => (
                <Link
                  key={s.id}
                  to={`/service/${s.id}`}
                  className={styles.resultRow}
                  onClick={() => trackResultSelection(s, i + 1)}
                >
                  <ServiceIcon
                    serviceId={s.id}
                    category={s.category}
                    domain={s.domain}
                    emoji={s.emoji}
                    size={26}
                  />
                  <span className={styles.resultName}>{s.name}</span>
                  <DifficultyBadge difficulty={s.difficulty} />
                  <span className={styles.resultGo}>
                    解約ページへ
                    <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
                  </span>
                </Link>
              ))
            )}
          </div>
        ) : (
          chipServices.length > 0 && (
            <div className={styles.chipsRow}>
              <span className={styles.cutline} aria-hidden="true" />
              <div className={styles.chips}>
                {chipServices.map((s) => (
                  <Link key={s.id} to={`/service/${s.id}`} className={styles.chip}>
                    <ServiceIcon
                      serviceId={s.id}
                      category={s.category}
                      domain={s.domain}
                      emoji={s.emoji}
                      size={16}
                    />
                    <span>{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
