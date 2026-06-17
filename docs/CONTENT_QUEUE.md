# 記事キュー（サブスクやめた）— 機械可読・部長が"上から引く"

> 自律運用ルール原則2（計画が実行を拘束）の実装。WEEKLY_SPRINT の律速＝集客（AI検索引用最適化・SEOロングテール）を、記事単位の作業リストに落としたもの。
> **運用**：記事部長・集客部長は「どの記事をやるか」をゼロから議論せず、**このキューの上から引く**。executorは作らない（人/部長が引く・公開はBAEガード＋秘書監督が人間ゲート）。
> **更新**：1本仕上げたら status を done に。週次で WEEKLY_SPRINT と同時に並べ替え。新規記事の前に**既存最適化を優先**（質>量・週上限厳守）。
> ※ Codex が見た目（src/・CSS）を改修中 → **本キューは posts.js の本文最適化のみ**（src/components/CSS は触らない）。

## 今週（2026-06-08〜14）の律速＝集客タスク

### A. AI検索引用最適化（既存記事・優先順）
各記事に：①可視FAQ＋FAQPage構造化データ ②見出しを「定義→原因→解決」順 ③比較表/早見表 ④ROIの明示。本文由来のみ・新事実なし（Googleポリシー）。BAE厳守。

| 優先 | slug | 種別 | FAQ | やること | status |
|---|---|---|---|---|---|
| 1 | gym-cancel-to-home-training | 買い切り・高intent | ✅ | FAQ追加済（06-08 e25dbea）。早見表化は任意 | done |
| 2 | water-server-cancel-to-filter | 買い切り | ✅ | FAQ追加済（06-08 e25dbea）。年間コスト比較表は任意 | done |
| 3 | why-cant-cancel | 解約・高intent | ✅ | FAQ4問追加済（本文由来・ダークパターン/対処/法規制）。見出しの定義→原因→解決順は任意 | done |
| 4 | how-to-survive-retention-screen | 解約 | ✅ | FAQ4問追加済（06-10・本文由来＝3コツ＋確認メール）。対応表は任意 | done |
| 5 | auto-renewal-pitfalls | 自動更新・高intent | ✅ | FAQ4問追加済。チェックリスト見出し化は任意 | done |
| 6 | monthly-vs-yearly-plan | 比較 | ✅ | FAQ4問追加済（06-11・本文由来＝損得判断/計算式/5つの判断軸/デメリット）。比較表化は任意 | done |
| 7 | free-trial-strategy | 無料体験 | ✅ | 済（2026-06-12 FAQ4問＋逆算カレンダー早見表・本文由来・敵対検証pass） | done |
| 8 | best-payment-method-for-subscription | 比較 | ✅ | 済（2026-06-12 FAQ4問＋支払い方法比較早見表・本文由来・敵対検証pass） | done |
| - | contact-lens-spot-buy-to-subscription | 買い切り | ✅ | 済（228e116）。見出し順だけ点検 | done |
| - | electric-toothbrush-spot-buy-to-subscription | 買い切り | ✅ | 済（228e116） | done |
| - | microsoft365-vs-perpetual-office | 買い切り | ✅ | 済（bc9b0c8） | done |
| - | adobe-cc-to-buyout-alternative | 買い切り | ✅ | 済（a58e8eb） | done |

### B. SEOロングテール（既存記事の語句最適化・新規公開は週上限内）
- 低競合語をタイトル/見出し/本文に自然に：`解約 違約金`・`買い切り 損益分岐`・`サブスク 年額 計算`・`自動更新 解約 タイミング`・`ウォーターサーバー 解約金`。
- 新規記事は**週上限（質>量）を超えない**。上限到達中は既存最適化に専念（朝会判断に従う）。

### C. Phase 1 完了確認（記事部長）
- 3層モデルで書き直した **ServicePage 5本のQC**（両論併記・解約導線上部・広告枠＋収益リンク内包率100%・禁則句ゼロ）。対象5本は記事部長が特定。達成基準＝CLAUDE.md§10。

## 来週枠（W+1: 2026-06-15〜）承認済み新規記事 — GO 2026-06-09（俊雄さん）

> 巡回部長の「買い切り化（卒業→入学）」候補2本。俊雄さんGO済み。**今週は着手しない**（WEEKLY_SPRINT 原則2＝今週focus＝既存最適化／新規は週上限厳守）。下記briefでW+1に turnkey 実行。Amazon/楽天は設定済＝提携不要＝着手摩擦ゼロ。**公開はBAEガード＋秘書監督が人間ゲート**。実装先＝`src/data/posts.js`（src/・CSSは触らない）。ヘルパー＝`src/data/affiliates.js` の `buildAmazonSearchUrl()`／`buildRakutenSearchUrl()`。

### 優先1：コーヒー定期便 → 全自動コーヒーメーカー（買い切り）
- slug: `coffee-subscription-cancel-to-auto-maker`
- title案: 「コーヒー定期便をやめて全自動メーカーに替える境界線——毎日飲む人ほど買い切りが効く」（ロングテール: `コーヒー 定期便 やめた`／`全自動 コーヒーメーカー 買い切り`／`損益分岐`）
- 両論併記: 〔買い切りが向く〕毎日飲む・年間コストを下げたい・補充を自分で回せる・据置スペースあり／〔定期便のままが向く（正直に）〕多様な豆を少量試したい・淹れる手間を増やしたくない・スペース無し・飲む頻度が不安定 → **定期便継続派は既存 `/discover/coffee-subscription` へ送客（社会性＝両収益経路を温存）**
- 損益分岐早見表: 定期便 月◯円×12 vs 本体¥◯（一度）＋豆代。「何ヶ月で回収」を表に。**価格・型番はWebSearchで実確認（捏造禁止）／「最新価格は各自確認」と明記（鮮度リスク回避）**
- funnel: `/tracker`（棚卸し）・`/discover/coffee-subscription`・`/disclosure`
- 買い切りリンク: `buildAmazonSearchUrl('全自動コーヒーメーカー')`／`buildRakutenSearchUrl('全自動コーヒーメーカー')`（`rel="sponsored nofollow noopener noreferrer"`・直後に（PR））
- FAQ(本文由来・3問): ①定期便と買い切りどっちが得（何年で回収）②全自動メーカーの手入れは大変か ③やめた後の豆はどこで買うか
- 禁則: ランキング/★/煽りなし・断定回避

### 優先2：カミソリ替刃 → 電気シェーバー（買い切り）★公開済 2026-06-18（W+1枠を出し切り・build pass sitemap 113→114・prerender 114/114）
- slug: `razor-blades-cancel-to-electric-shaver`
- title案: 「カミソリ替刃をやめて電気シェーバーに替える損益分岐——深剃り派が残る理由も正直に」（ロングテール: `替刃 高い`／`電気シェーバー 買い切り`／`カミソリ 定期便 やめた`）
- 両論併記: 〔シェーバー買い切りが向く〕替刃コストを下げたい・毎日剃る・時短・旅行/出張多い／〔替刃カミソリが向く（正直に）〕深剃り重視・敏感肌でT字の剃り味が好み・電気が肌に合わない・初期費用を抑えたい
- 損益分岐早見表: 替刃 月◯円 vs 本体¥◯＋数年に一度の刃交換。**価格はWebSearch実確認／肌・剃り味は個人差と明記（ノセボ・断定回避）**
- funnel: `/tracker`・`/disclosure`（※シェービングのdiscoverジャンルは無い＝**新規ジャンルは作らない・スコープ外**。送客は/tracker＋関連記事）
- 買い切りリンク: `buildAmazonSearchUrl('電気シェーバー')`／`buildRakutenSearchUrl('電気シェーバー')`
- FAQ(本文由来・3問): ①替刃と電気シェーバーどっちが安い（何年で回収）②電気シェーバーで深剃りできるか（正直にT字優位）③刃交換の時期と費用
- 禁則: 健康/肌の断定なし・ランキング/★なし

> 着手判断: W+1にこのキュー上位から引く。今週中に前倒す場合は、新規週上限の再配分を朝会で判断（既存最適化を削らない範囲でのみ）。

## 引くルール（差し戻し条件）
- このキューに無い記事・新規チャネル（特にX）に流れたら、WEEKLY_SPRINT/NOT_DOING に照らして秘書が差し戻す。
- 律速指標が7日変化なし → 翌週 Pinterest 素材に focus 切替（WEEKLY_SPRINT 停滞検知）。
