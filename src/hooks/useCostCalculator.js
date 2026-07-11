import { useCallback, useMemo, useState } from 'react';
import { SERVICES, getPlans, getDefaultMonthly, getPopularity, getKana } from '../data/services';

// Home「決定版」の固定費アンカー計算機ロジック（design_handoff_home_redesign §6 を移植）。
//
// ★最重要（バグ回避）：合計は毎レンダー `target` を直接返す。
//   requestAnimationFrame のカウントアップ等に依存させない（プロトで踏んだ
//   「表示が実値とズレる」罠の回避）。視覚アニメを足すなら表示の正しさと分離すること。

// 初期選択は空にする（2026-07-11 俊雄さん決定）。
// 以前は netflix/spotify/youtube-premium を勝手に選択して「あなたの固定費 ¥45,000」と
// 見せていたが、訪問者が契約していないものを本人の金額のように断定する形になっており、
// 特に「そのサービスが好きで続けている人」に対して信頼を壊す。合計・いちばん大きい項目は
// 本人がサービスを追加して初めて表示する（入力起点の道具に徹する）。
const DEFAULT_SEED = [];

function popularPlanIndex(id) {
  const plans = getPlans(id);
  const i = plans.findIndex((p) => p.popular);
  return i >= 0 ? i : 0;
}

const yen = (n) => '¥' + Math.round(n || 0).toLocaleString('ja-JP');

export function useCostCalculator(seedIds = DEFAULT_SEED) {
  const [q, setQ] = useState('');
  const [period, setPeriod] = useState('year'); // 'year' | 'month'
  const [on, setOn] = useState(() => {
    const init = {};
    seedIds.forEach((id) => {
      init[id] = true;
    });
    return init;
  });
  const [planIdx, setPlanIdx] = useState({}); // { id: planIndex }（未設定は人気プラン）

  const planIndexFor = useCallback(
    (id) => (id in planIdx ? planIdx[id] : popularPlanIndex(id)),
    [planIdx]
  );

  const monthlyFor = useCallback(
    (id) => {
      const plans = getPlans(id);
      if (plans.length) return plans[planIndexFor(id)]?.monthly ?? getDefaultMonthly(id);
      return getDefaultMonthly(id);
    },
    [planIndexFor]
  );

  // いま ON のサービス（SERVICE オブジェクト・人気順）
  const selectedServices = useMemo(
    () => SERVICES.filter((s) => on[s.id]).sort((a, b) => getPopularity(b.id) - getPopularity(a.id)),
    [on]
  );

  // monthly = ON の各サービスの「選択プラン月額」の合計
  const monthly = useMemo(
    () => selectedServices.reduce((sum, s) => sum + monthlyFor(s.id), 0),
    [selectedServices, monthlyFor]
  );

  const annual = monthly * 12;
  const target = period === 'year' ? annual : monthly; // 見出しに出す額（年/月トグル連動）
  const totalText = yen(target); // ★毎レンダー直接表示（即時・正確）
  const fiveYearText = yen(annual * 5); // 5年は常に年額×5（period に依存しない）

  // 「いちばん効く一手」= ON のうち年額が最大のサービス（外すと次点へ自動切替）
  const topCut = useMemo(() => {
    let best = null;
    selectedServices.forEach((s) => {
      const a = monthlyFor(s.id) * 12;
      if (!best || a > best.annual) best = { id: s.id, name: s.name, annual: a };
    });
    return best ? { ...best, annualText: yen(best.annual) } : null;
  }, [selectedServices, monthlyFor]);

  // 検索（name ＋ かな別名・部分一致・上位4件）
  const searchResults = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return SERVICES.filter((s) => (s.name + ' ' + getKana(s.id)).toLowerCase().includes(query)).slice(
      0,
      4
    );
  }, [q]);

  const toggle = useCallback((id) => setOn((prev) => ({ ...prev, [id]: !prev[id] })), []);
  const addService = useCallback((id) => setOn((prev) => ({ ...prev, [id]: true })), []);
  const removeService = useCallback((id) => setOn((prev) => ({ ...prev, [id]: false })), []);
  const setPlan = useCallback((id, idx) => setPlanIdx((prev) => ({ ...prev, [id]: idx })), []);

  return {
    q,
    setQ,
    period,
    setPeriod,
    on,
    toggle,
    addService,
    removeService,
    planIndexFor,
    setPlan,
    monthlyFor,
    selectedServices,
    monthly,
    annual,
    target,
    totalText,
    fiveYearText,
    topCut,
    searchResults,
    yen,
  };
}
