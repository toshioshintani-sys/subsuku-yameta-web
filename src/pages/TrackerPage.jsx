import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, PRICING, CATEGORIES, getPlans } from '../data/services';
import { trackAffiliateClick } from '../data/affiliates';
import ServiceIcon from '../components/ServiceIcon';
import Seo from '../components/Seo';
import styles from './TrackerPage.module.css';
import { SITE_URL } from '../config';

// 解約マネジメント・ダッシュボード
// - ユーザーが契約中サブスクを選択（localStorage で永続化）
// - 月額・年額合計と「解約優先度」を可視化
// - 個人情報は一切収集しない（全てローカル）

const STORAGE_KEY = 'subsuku-yameta:tracker:v1';
const DIFFICULTY_LABEL = { easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい' };
const DIFFICULTY_COLOR = { easy: 'easy', medium: 'medium', hard: 'hard' };
const DIFFICULTY_WEIGHT = { easy: 1, medium: 0.7, hard: 0.5 };

function loadState() {
  if (typeof window === 'undefined') return { selected: {}, lastUsed: {}, plan: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { selected: {}, lastUsed: {}, plan: {} };
    const parsed = JSON.parse(raw);
    return {
      selected: parsed.selected || {},
      lastUsed: parsed.lastUsed || {},
      plan: parsed.plan || {}, // serviceId -> 選択したプランの index
    };
  } catch {
    return { selected: {}, lastUsed: {}, plan: {} };
  }
}

// プラン関連ヘルパー（多プラン対応・2026-06-01）
function defaultPlanIndex(plans) {
  const i = plans.findIndex((p) => p.popular);
  return i >= 0 ? i : 0;
}

function resolvePlanIndex(plans, stored) {
  if (!plans.length) return -1;
  if (stored != null && stored >= 0 && stored < plans.length) return stored;
  return defaultPlanIndex(plans);
}

// サービスの「選択中プラン」に応じた月額を返す。プラン未設定なら PRICING の代表額
function planMonthly(serviceId, storedIdx) {
  const plans = getPlans(serviceId);
  if (plans.length) {
    const idx = resolvePlanIndex(plans, storedIdx);
    return plans[idx]?.monthly ?? 0;
  }
  return PRICING[serviceId] ?? 0;
}

function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore (quota exceeded など)
  }
}

function monthsAgo(isoDate) {
  if (!isoDate) return null;
  const then = new Date(isoDate);
  if (Number.isNaN(then.getTime())) return null;
  const now = new Date();
  const months = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
  return Math.max(0, months);
}

function formatYen(n) {
  return `¥${n.toLocaleString('ja-JP')}`;
}

export default function TrackerPage() {
  const [state, setState] = useState(() => loadState());
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const toggle = (id) => {
    setState((prev) => ({
      ...prev,
      selected: { ...prev.selected, [id]: !prev.selected[id] },
    }));
  };

  const updateLastUsed = (id, value) => {
    setState((prev) => ({
      ...prev,
      lastUsed: { ...prev.lastUsed, [id]: value || undefined },
    }));
  };

  const updatePlan = (id, idx) => {
    setState((prev) => ({
      ...prev,
      plan: { ...prev.plan, [id]: idx },
    }));
  };

  const clearAll = () => {
    if (confirm('チェック中のサブスクをすべてクリアしますか？（ローカル保存のみ消えます）')) {
      setState({ selected: {}, lastUsed: {}, plan: {} });
    }
  };

  // 選択中サービスと月額情報
  const enriched = useMemo(() => {
    return SERVICES.map((s) => {
      const plans = getPlans(s.id);
      const planIdx = resolvePlanIndex(plans, state.plan[s.id]);
      const monthly = planMonthly(s.id, state.plan[s.id]);
      const planName = plans.length ? plans[planIdx]?.name : null;
      const monthsUnused = monthsAgo(state.lastUsed[s.id]);
      // 解約優先度スコア：価格が高い × 解約しやすい × 使ってない期間が長い
      const usageBonus = monthsUnused == null ? 1 : Math.min(3, 1 + monthsUnused * 0.15);
      const priority = (monthly || 0) * (DIFFICULTY_WEIGHT[s.difficulty] || 0.5) * usageBonus;
      return { ...s, monthly, plans, planIdx, planName, monthsUnused, priority };
    });
  }, [state.lastUsed, state.plan]);

  const selectedItems = useMemo(
    () => enriched.filter((s) => state.selected[s.id]),
    [enriched, state.selected]
  );

  const totalMonthly = selectedItems.reduce((sum, s) => sum + s.monthly, 0);
  const totalYearly = totalMonthly * 12;
  const total5Years = totalYearly * 5;
  const total10Years = totalYearly * 10;

  // フィルタ・ソート（チェックリスト側）
  const visibleList = useMemo(() => {
    let list = enriched;
    if (filterCategory !== 'all') list = list.filter((s) => s.category === filterCategory);
    if (sortBy === 'priority') {
      list = [...list].sort((a, b) => b.priority - a.priority);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.monthly - a.monthly);
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    }
    return list;
  }, [enriched, filterCategory, sortBy]);

  // 選択中の「解約しなさい順」リスト
  const recommendedOrder = useMemo(
    () => [...selectedItems].sort((a, b) => b.priority - a.priority),
    [selectedItems]
  );

  // エクスポート
  const exportMarkdown = () => {
    const lines = [
      '# 私のサブスク棚卸し',
      '',
      `合計：月 ${formatYen(totalMonthly)} / 年 ${formatYen(totalYearly)}`,
      '',
      '## 解約しなさい順',
      '',
      ...recommendedOrder.map((s, i) =>
        `${i + 1}. **${s.name}** — ${formatYen(s.monthly)}/月（解約難度: ${DIFFICULTY_LABEL[s.difficulty]}） → [${s.cancelUrl}](${s.cancelUrl})`
      ),
      '',
      `_作成: サブスクやめた（${SITE_URL}/tracker）_`,
    ];
    downloadText('subsuku-yametai.md', lines.join('\n'));
  };

  const exportCsv = () => {
    const header = '名前,カテゴリ,月額,年額,解約難度,優先度スコア,解約URL';
    const rows = recommendedOrder.map((s) =>
      [
        s.name,
        s.category,
        s.monthly,
        s.monthly * 12,
        DIFFICULTY_LABEL[s.difficulty],
        Math.round(s.priority),
        s.cancelUrl,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    downloadText('subsuku-yametai.csv', '﻿' + [header, ...rows].join('\n'));
  };

  return (
    <div className={styles.page}>
      <Seo
        title="サブスク棚卸しダッシュボード"
        description="契約中のサブスクをチェックして月額・年額の合計と解約優先度を可視化。個人情報は一切保存しません（ローカル保存のみ）。"
        canonical="/tracker"
        noindex
      />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>あなたのサブスク、年いくら払ってる？</h1>
        <p className={styles.heroDesc}>
          契約中のサブスクをチェックするだけで、合計額と「解約しなさい順」が一瞬で出ます。
          <br />
          <strong>個人情報は一切保存しません。</strong>すべてあなたのブラウザ内（localStorage）に保存されます。
        </p>
      </section>

      <div className={styles.summary}>
        <div className={styles.summaryInner}>
          <div className={styles.summaryStat}>
            <div className={styles.statLabel}>選択中</div>
            <div className={styles.statValue}>{selectedItems.length}<span className={styles.statUnit}>件</span></div>
          </div>
          <div className={styles.summaryStat}>
            <div className={styles.statLabel}>月額合計</div>
            <div className={styles.statValueAccent}>{formatYen(totalMonthly)}</div>
          </div>
          <div className={styles.summaryStat}>
            <div className={styles.statLabel}>年額合計</div>
            <div className={styles.statValueAccent}>{formatYen(totalYearly)}</div>
          </div>
          {selectedItems.length > 0 && (
            <div className={styles.summaryActions}>
              <button className={styles.exportBtn} onClick={exportMarkdown}>📝 Markdown</button>
              <button className={styles.exportBtn} onClick={exportCsv}>📊 CSV</button>
              <button className={styles.clearBtn} onClick={clearAll}>🗑 クリア</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* 節約効果可視化（選択中があるときだけ） */}
        {selectedItems.length > 0 && (
          <section className={styles.savings} aria-label="長期累計コスト">
            <h2 className={styles.savingsTitle}>このまま続けると…</h2>
            <p className={styles.savingsLead}>
              選択中の {selectedItems.length} サービスを今後も払い続けた場合の累計額です。
            </p>
            <div className={styles.savingsGrid}>
              <div className={styles.savingsCard}>
                <div className={styles.savingsLabel}>5 年で</div>
                <div className={styles.savingsValue}>{formatYen(total5Years)}</div>
                <div className={styles.savingsSub}>軽自動車 1 台分</div>
              </div>
              <div className={styles.savingsCard}>
                <div className={styles.savingsLabel}>10 年で</div>
                <div className={styles.savingsValue}>{formatYen(total10Years)}</div>
                <div className={styles.savingsSub}>家族旅行 数回分</div>
              </div>
            </div>
            <p className={styles.savingsHint}>
              💡 全部解約する必要はありません。使っていないものから順に整理すれば、十分な節約効果があります。
            </p>
          </section>
        )}

        {/* 解約しなさい順（選択中があるときだけ） */}
        {recommendedOrder.length > 0 && (
          <section className={styles.recommended}>
            <h2 className={styles.recommendedTitle}>解約しなさい順（おすすめの順番）</h2>
            <p className={styles.recommendedLead}>
              「価格が高い × 解約しやすい × 使ってない期間が長い」で優先度を計算しています。
              上から順に解約するのが最もムダを減らせる順番です。
            </p>
            <ol className={styles.recList}>
              {recommendedOrder.map((s, i) => (
                <li key={s.id} className={styles.recItem}>
                  <div className={styles.recRank}>{i + 1}</div>
                  <div className={styles.recBody}>
                    <div className={styles.recHead}>
                      <ServiceIcon serviceId={s.id} category={s.category} domain={s.domain} emoji={s.emoji} size={32} />
                      <span className={styles.recName}>{s.name}</span>
                      <span className={`${styles.recBadge} ${styles[DIFFICULTY_COLOR[s.difficulty]]}`}>
                        {DIFFICULTY_LABEL[s.difficulty]}
                      </span>
                    </div>
                    <div className={styles.recMeta}>
                      月 {formatYen(s.monthly)} / 年 {formatYen(s.monthly * 12)}
                      {s.planName && s.plans.length > 1 && (
                        <span className={styles.recUnused}> · {s.planName}</span>
                      )}
                      {s.monthsUnused != null && s.monthsUnused >= 1 && (
                        <span className={styles.recUnused}> · 最後の利用から{s.monthsUnused}ヶ月</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.recActions}>
                    <Link to={`/service/${s.id}`} className={styles.recDetailBtn}>手順を見る</Link>
                    <a
                      href={s.cancelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.recCancelBtn}
                    >
                      解約 ↗
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 解約のあとの選択肢（B=乗換/C=買い切りの出口。解約導線より視覚的に弱く・末尾配置） */}
        {recommendedOrder.length > 0 && (
          <section className={styles.nextMoves} aria-label="解約のあとの選択肢">
            <h2 className={styles.nextMovesTitle}>解約のあと、どう動く？</h2>
            <p className={styles.nextMovesLead}>
              乗り換える必要はありません。このまま整理を続けるだけでも十分です。
              ただ「やめたら困るかも」で手が止まっているなら、次の2つが判断材料になります。
            </p>
            <div className={styles.nextMovesGrid}>
              <Link
                to="/discover"
                className={styles.nextMoveCard}
                onClick={() => trackAffiliateClick({ asp: 'internal', service: 'tracker', placement: 'tracker_exit', position: 1, layer: 'B' })}
              >
                <div className={styles.nextMoveTitle}>合うものに乗り換える</div>
                <div className={styles.nextMoveDesc}>近い代替を特徴と弱点つきで比較（サブスク図鑑）</div>
              </Link>
              <Link
                to="/yamete-kau"
                className={styles.nextMoveCard}
                onClick={() => trackAffiliateClick({ asp: 'internal', service: 'tracker', placement: 'tracker_exit', position: 2, layer: 'C' })}
              >
                <div className={styles.nextMoveTitle}>買い切りで済ませる</div>
                <div className={styles.nextMoveDesc}>月額を増やさず、単発購入で足りるラインを探す（やめて買う）</div>
              </Link>
            </div>
          </section>
        )}

        {/* チェックリスト */}
        <section className={styles.checklist}>
          <div className={styles.checklistHead}>
            <h2 className={styles.checklistTitle}>契約中のサブスクをチェック</h2>
            <div className={styles.checklistTools}>
              <select
                className={styles.toolSelect}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <select
                className={styles.toolSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="priority">優先度順</option>
                <option value="price-desc">価格が高い順</option>
                <option value="name">五十音順</option>
              </select>
            </div>
          </div>

          <ul className={styles.list}>
            {visibleList.map((s) => {
              const isSelected = !!state.selected[s.id];
              return (
                <li
                  key={s.id}
                  className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
                >
                  <label className={styles.rowLabel}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(s.id)}
                      className={styles.checkbox}
                    />
                    <ServiceIcon serviceId={s.id} category={s.category} domain={s.domain} emoji={s.emoji} size={28} />
                    <span className={styles.rowName}>{s.name}</span>
                    <span className={styles.rowPrice}>
                      {s.monthly ? formatYen(s.monthly) + '/月' : '都度課金'}
                    </span>
                  </label>
                  {isSelected && (
                    <div className={styles.rowExtra}>
                      {s.plans.length > 1 && (
                        <label className={styles.lastUsedLabel}>
                          プラン：
                          <select
                            value={s.planIdx}
                            onChange={(e) => updatePlan(s.id, Number(e.target.value))}
                            className={styles.toolSelect}
                          >
                            {s.plans.map((p, i) => (
                              <option key={p.name} value={i}>
                                {p.name}（{p.monthly ? formatYen(p.monthly) + '/月' : '都度'}）
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <label className={styles.lastUsedLabel}>
                        最後に使った月：
                        <input
                          type="month"
                          value={state.lastUsed[s.id] || ''}
                          onChange={(e) => updateLastUsed(s.id, e.target.value)}
                          className={styles.lastUsedInput}
                        />
                      </label>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* 注意書き */}
        <div className={styles.note}>
          <p>
            <strong>個人情報は一切送信しません。</strong>
            選択状態と「最後に使った月」はあなたのブラウザ内（localStorage）にのみ保存されます。
            別のブラウザや端末では引き継がれません。
          </p>
          <p>
            複数プランがあるサービスは、チェック後に表示される「プラン」から自分の契約プランを選べます（合計額・年額に反映されます）。
            海外サービス（ChatGPT Plus・Claude Pro 等）の $ 表記は 1ドル＝155円で換算しています。
            実際の請求額は各サービスの請求明細をご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}

function downloadText(filename, text) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
