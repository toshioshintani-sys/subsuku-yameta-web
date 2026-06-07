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
| 1 | gym-cancel-to-home-training | 買い切り・高intent | 未 | FAQ＋損益分岐の早見表化＋「向かない人」見出し化 | todo |
| 2 | water-server-cancel-to-filter | 買い切り | 未 | FAQ＋年間コスト比較表＋向く人見出し | todo |
| 3 | why-cant-cancel | 解約・高intent | 未 | FAQ＋ダークパターン別フロー＋見出し定義/原因/解決 | todo |
| 4 | how-to-survive-retention-screen | 解約 | 未 | FAQ＋引き止め文句×対処の対応表 | todo |
| 5 | auto-renewal-pitfalls | 自動更新・高intent | 未 | FAQ＋自動更新チェックリスト見出し化 | todo |
| 6 | monthly-vs-yearly-plan | 比較 | 未 | FAQ＋月額vs年額の比較表＋解約自由度 | todo |
| 7 | free-trial-strategy | 無料体験 | 未 | FAQ＋解約締切の逆算カレンダー早見表 | todo |
| 8 | best-payment-method-for-subscription | 比較 | 未 | FAQ＋支払い方法の比較表 | todo |
| - | contact-lens-spot-buy-to-subscription | 買い切り | ✅ | 済（228e116）。見出し順だけ点検 | done |
| - | electric-toothbrush-spot-buy-to-subscription | 買い切り | ✅ | 済（228e116） | done |
| - | microsoft365-vs-perpetual-office | 買い切り | ✅ | 済（bc9b0c8） | done |
| - | adobe-cc-to-buyout-alternative | 買い切り | ✅ | 済（a58e8eb） | done |

### B. SEOロングテール（既存記事の語句最適化・新規公開は週上限内）
- 低競合語をタイトル/見出し/本文に自然に：`解約 違約金`・`買い切り 損益分岐`・`サブスク 年額 計算`・`自動更新 解約 タイミング`・`ウォーターサーバー 解約金`。
- 新規記事は**週上限（質>量）を超えない**。上限到達中は既存最適化に専念（朝会判断に従う）。

### C. Phase 1 完了確認（記事部長）
- 3層モデルで書き直した **ServicePage 5本のQC**（両論併記・解約導線上部・広告枠＋収益リンク内包率100%・禁則句ゼロ）。対象5本は記事部長が特定。達成基準＝CLAUDE.md§10。

## 引くルール（差し戻し条件）
- このキューに無い記事・新規チャネル（特にX）に流れたら、WEEKLY_SPRINT/NOT_DOING に照らして秘書が差し戻す。
- 律速指標が7日変化なし → 翌週 Pinterest 素材に focus 切替（WEEKLY_SPRINT 停滞検知）。
