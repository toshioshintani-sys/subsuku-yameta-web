import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Plus, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import { SERVICES, getPlans, getDefaultMonthly, getPopularity } from '../data/services';
import { trackUiEvent } from '../data/analytics';
import styles from './CostAnchorCard.module.css';

const yen = (n) => '¥' + Math.round(n || 0).toLocaleString('ja-JP');

// 固定費アンカー＋行動経済学ナッジ（design_handoff §5.3・ライブ）。
// 状態は親（HomePage）の useCostCalculator から props で受ける。
// ★合計は target を毎レンダー直接表示（rAF カウントアップに依存させない＝§6 のバグ回避）。
// ※「社会的証明（今月◯人）」は最上位原則（誇大表現禁止）に反するため実装しない（俊雄さん 2.a）。
//
// ★折りたたみ招待型に変更（2026-07-16・6視点パネル判定）：
// 7/11 の空スタート化以降、初訪問者に見えるのは「¥0」と入力促しだけの614pxの空箱で、
// アンカリング・損失回避は入力完了まで一切発火していなかった（配置と機能のミスマッチ）。
// 既定は1行の招待カードに圧縮し、タップで展開。機能・ロジックは一切削らない。
export default function CostAnchorCard({
  period,
  setPeriod,
  selectedServices,
  on,
  addService,
  removeService,
  planIndexFor,
  setPlan,
  monthlyFor,
  target,
  totalText,
  fiveYearText,
  topCut,
}) {
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addQuery, setAddQuery] = useState('');

  const allPaid = useMemo(
    () =>
      SERVICES.filter((s) => getDefaultMonthly(s.id) > 0).sort(
        (a, b) => getPopularity(b.id) - getPopularity(a.id)
      ),
    []
  );
  const addResults = useMemo(() => {
    const qq = addQuery.trim().toLowerCase();
    return allPaid.filter((s) => !on[s.id] && (!qq || s.name.toLowerCase().includes(qq))).slice(0, 6);
  }, [allPaid, on, addQuery]);

  const suffix = period === 'year' ? '/年' : '/月';

  // 折りたたみ状態（既定）：問いかけ＋展開ボタンだけの招待カード
  // ※フック宣言より必ず後に置く（早期returnでフック順が変わるとReactが壊れる）
  if (!open) {
    return (
      <div className={styles.card}>
        <p className={styles.eyebrow}>ところで——</p>
        <p className={styles.question}>自分の月額・年額、ちゃんと言えますか？</p>
        <button
          type="button"
          className={styles.teaserBtn}
          onClick={() => {
            setOpen(true);
            trackUiEvent('home_calc_open', {});
          }}
        >
          3秒で計算してみる
          <ChevronDown size={15} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {/* 1. 逆説の問いかけ */}
      <p className={styles.eyebrow}>ところで——</p>
      <p className={styles.question}>自分の月額・年額、ちゃんと言えますよね？</p>
      <p className={styles.reveal}>
        ——意外と、ほとんどの人が即答できません。下で選べば、3秒で分かります。
      </p>
      <div className={styles.divider} />

      {/* 2. いまの選択だと… ＋ 年/月トグル */}
      <div className={styles.rowTop}>
        <span className={styles.rowTopLabel}>いまの選択だと…</span>
        <div className={styles.toggle} role="group" aria-label="年額／月額の切替">
          <button
            type="button"
            className={`${styles.toggleBtn} ${period === 'year' ? styles.toggleOn : ''}`}
            aria-pressed={period === 'year'}
            onClick={() => setPeriod('year')}
          >
            年額
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${period === 'month' ? styles.toggleOn : ''}`}
            aria-pressed={period === 'month'}
            onClick={() => setPeriod('month')}
          >
            月額
          </button>
        </div>
      </div>

      {/* 3. 主役の金額（★ target を直接表示・即時/正確） */}
      <div className={styles.amountWrap}>
        <span className={styles.amount}>{totalText}</span>
        <span className={styles.amountSuffix}>{suffix}</span>
      </div>
      <p className={styles.amountHint}>↓ 自分の契約に合わせて、入っているものを選ぶ</p>

      {/* 4. 損失回避バー（事実ベース：年額×5・煽らない） */}
      {target > 0 && (
        <div className={styles.lossBar}>
          <AlertTriangle size={14} strokeWidth={2} aria-hidden="true" />
          <span>
            このまま続けると、5年間で累計 <strong>{fiveYearText}</strong>。
          </span>
        </div>
      )}

      {/* 5. 事実提示（年額最大のものを可視化するだけ・解約するかどうかは本人が決める）
          ＋解約手順への直接リンク（2026-07-16追加：棚卸し→行動への橋渡しが欠落していた） */}
      {topCut && (
        <div className={styles.topCutBar}>
          <Check size={14} strokeWidth={2.4} aria-hidden="true" />
          <span>
            いちばん金額が大きいのは<strong>「{topCut.name}」</strong>（
            <strong>年{topCut.annualText}</strong>）。
            <Link
              to={`/service/${topCut.id}/`}
              className={styles.topCutLink}
              onClick={() => trackUiEvent('home_topcut_click', { service: topCut.id })}
            >
              解約方法を見る
              <ArrowRight size={12} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </span>
        </div>
      )}

      {/* 6. サービス行（ライブ：チェックで外す／プランで価格更新） */}
      <div className={styles.rows}>
        {selectedServices.map((s) => {
          const plans = getPlans(s.id);
          const idx = planIndexFor(s.id);
          return (
            <div className={styles.svcRow} key={s.id}>
              <button
                type="button"
                className={styles.check}
                aria-label={`${s.name} を外す`}
                onClick={() => removeService(s.id)}
              >
                <Check size={13} strokeWidth={3} aria-hidden="true" />
              </button>
              <span className={styles.dot}>
                <ServiceIcon
                  serviceId={s.id}
                  category={s.category}
                  domain={s.domain}
                  emoji={s.emoji}
                  size={22}
                />
              </span>
              <span className={styles.svcName}>{s.name}</span>
              {plans.length > 1 && (
                <span className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    value={idx}
                    onChange={(e) => setPlan(s.id, Number(e.target.value))}
                    aria-label={`${s.name} のプラン`}
                  >
                    {plans.map((p, j) => (
                      <option key={j} value={j}>
                        {p.name}（{yen(p.monthly)}）
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
                </span>
              )}
              <span className={styles.svcPrice}>月{yen(monthlyFor(s.id))}</span>
            </div>
          );
        })}
        {selectedServices.length === 0 && (
          <p className={styles.emptyRows}>下の「他のサブスクを追加」から、入っているものを選んでください。</p>
        )}
      </div>

      {/* ＋ 追加（全サービスから） */}
      <button
        type="button"
        className={styles.addToggle}
        aria-expanded={showAdd}
        onClick={() => setShowAdd((v) => !v)}
      >
        <Plus size={15} strokeWidth={2.3} aria-hidden="true" />
        他のサブスクを追加
      </button>
      {showAdd && (
        <div className={styles.add}>
          <div className={styles.addSearch}>
            <Search size={15} strokeWidth={1.9} aria-hidden="true" />
            <input
              type="search"
              className={styles.addInput}
              placeholder={`サービス名で検索（全${allPaid.length}件）`}
              value={addQuery}
              onChange={(e) => setAddQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className={styles.addResults}>
            {addResults.length === 0 ? (
              <span className={styles.addEmpty}>
                該当なし。棚卸しダッシュボードには全サービスがあります。
              </span>
            ) : (
              addResults.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={styles.addItem}
                  onClick={() => {
                    addService(s.id);
                    setAddQuery('');
                  }}
                >
                  <ServiceIcon
                    serviceId={s.id}
                    category={s.category}
                    domain={s.domain}
                    emoji={s.emoji}
                    size={18}
                  />
                  <span className={styles.addItemName}>{s.name}</span>
                  <Plus size={13} strokeWidth={2.3} aria-hidden="true" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <p className={styles.note}>
        タップで対象を外す・プランは選び直せる。合計は即更新（価格は参考値）。
      </p>
    </div>
  );
}
