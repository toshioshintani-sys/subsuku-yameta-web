# ナビ改修＋収益化最大化 実装ブリーフ（Opus実装用・2026-06-11）

> 経緯：俊雄さん「ヘッダー（図鑑/棚卸し/ゲーム/記事/ダークモード）が分かりづらく初見が見逃す。ここが最大の収益ポイント。全体の収益化最大化も提案せよ」。
> Fable 5 で12エージェントのワークフロー（現状読解3＋設計3案＋収益監査2＋審査3レンズ＋ストレステスト）を実行した統合結論。
> **審査は3レンズ（収益/信頼・憲法/実装コスト）全会一致でC案が勝者。ストレステスト判定＝条件付きGO（順序厳守）。**

---

## 0. 統合判断（時間軸の分離が最適解）

母数が月数百view・GA4計測待ちの現状では、ナビ/出口改修の「今の収益」効果は ≒0×改善率。
しかし**集客が立ち上がる前に"器"を安く作り置く価値はある**。よって3段階に分離：

| 段 | 内容 | 着手条件 |
|---|---|---|
| **今週OK** | 策3: abema ALTERNATIVES横展開（既配線・902円・無リスク） | 集客タスクを削らない範囲で即可 |
| **承認後に実装（本ブリーフの主体）** | C案ヘッダー＋移植要素／tracker出口（器＋計測値1つ） | 俊雄さんの明示承認（WEEKLY_SPRINT逸脱回避） |
| **AdSense承認まで凍結** | 全記事末尾の収益CTA標準化・アフィ密度の全面上昇・ASP案件拡充 | AdSense「準備中」→承認後に段階導入 |

**絶対順序：集客（AI検索引用最適化）＞器づくり＞密度上げ。逆転させない。**

---

## 1. ヘッダー改修＝C案（全会一致勝者）＋移植要素

### 1-1. デスクトップ（Header.jsx / Header.module.css）

ナビを `NAV_ITEMS` 配列化（to/label/short/Icon/aria）して map 描画。**5項目・左から収益寄与順**：

| # | to | 可視ラベル | 短縮(モバイル) | アイコン | aria-label |
|---|---|---|---|---|---|
| 1 | /tracker | 固定費の棚卸し | 棚卸し | ListChecks | 固定費の棚卸し（契約中サブスクを年額で見る） |
| 2 | /discover | 乗り換え先を探す | 乗り換え | LayoutGrid | サブスク図鑑（乗り換え先を特徴と弱点つきで比較） |
| 3 | /yamete-kau | 買い切りで探す | 買い切り | ShoppingBag(新import) | やめて買う（月額をやめて単発購入で済ます） |
| 4 | /blog | お役立ち記事 | 記事 | FileText | 解約・乗り換えのお役立ち記事 |
| 5 | /games | 判断ゲーム | ゲーム | Gamepad2 | サブスク判断ゲーム |

- **/yamete-kau のナビ昇格が収益上の本丸**（現状Footerと本文カード1枚のみ＝Amazon/楽天24商品×2リンク面がヘッダー未到達）。
- ThemeToggle分離（B案仕様を採用）：nav と Toggle の間に **span要素のdivider（width:1px/height:16px/var(--border)/margin:0 4px）**。トグルは --text-sub トーンの装飾扱い。
- ロゴサブテキスト変更（B案graft・1行）：「解約ページへすぐ飛べるサイト」→**「解約・乗り換え・買い切りができるサイト」**（3秒で3機能が伝わる）。
- navLink の color は **現状 var(--text-sub) 維持を既定**（濃色化は解約CTA優位の再確認なしにやらない）。
- NavLink(active) 化は**第2コミット（任意）**：color:var(--accent)＋控えめ下線のみ。塗りつぶし禁止。

### 1-2. モバイル ≤640px（本丸＝「無言化」の廃止）

現状: logoSub と navLink span が display:none → 16pxアイコン4個だけ＝初見に意味不明。これを：

- `.navLink` を縦積み（flex-direction:column, gap:2px）：アイコン16px＋**短縮ラベル 10px**（上表のshort）。
- 幅が375pxに収まらない場合のフォールバック＝**ナビ内横スクロール許容**（overflow-x:auto・スクロールバー非表示・ページ全体には波及させない）＋**右端フェードグラデ（::after）で「続きがある」示唆（B案graft・必須）**。
- 360px級では2文字短縮（棚卸/乗換/買切/記事/ゲム・9px）を併用可。
- **実機検証マトリクス必須（lessons 2026-06-07再発防止）**：375/390/360px × light/dark で「ロゴ折れ無し・ページ横スクロール無し・トグル画面外に出ない」を目視。
- ハンバーガー/ドロワーは**作らない**（スコープ外・保守負債回避）。

### 1-3. 周辺の整合（同コミットに含めてよい軽微変更）

- HomePage NEXT_MOVES のBボタン文言「図鑑を見る」→「乗り換え先を見る」（ヘッダーと用語統一・構造non-touch）。
- HomePage に /blog への控えめテキストリンク1行追加（guideLink様式・広告は足さない）。
- **Footer説明子（B案graft）**：ツール欄見出しを「このサイトでできること」にし、各リンクに11px/--text-sub の1行説明を追加。Footerは正式名（サブスク図鑑/サブスク棚卸し）を維持＝ヘッダー動詞ラベルとの用語ガバナンス（ヘッダー=動詞、Footer/aria=正式名）。この方針をlessonsに記録すること。

**工数：正味+60〜80行/-15行・2ファイル＋軽微2ファイル・2時間以内。ロールバックはrevertで完結。**

---

## 2. 収益化最大化（ナビ以外の「真の漏れ」）

ワークフローの最重要発見：**構造的な収益漏れはナビではなく「高intent地点の出口欠落」に集中**。

### 2-1.【器・最優先】/tracker 結果画面に「次の動き」A→B→C出口
- 場所：TrackerPage.jsx の savingsHint〜recommendedOrder 直後（263〜313行付近）。
- 仕様：HomePage NEXT_MOVES と同型の三分岐（A=このまま整理を続ける／B=合うものに乗り換える→/discover／C=買い切りで済ませる→/yamete-kau）。**recCancelBtn（解約・外部）より視覚的に弱く**・末尾配置・「乗り換える必要はありません」調のlead（両論併記の精神）。
- 計測：affiliates.js の placement enum に **'tracker_exit'** を追加し、内部遷移でも trackAffiliateClick(placement:'tracker_exit', layer:'B'|'C') を発火→GA4で前後比較可能に。
- 根拠：解約intent最大の地点に3層モデルB(50%)+C(20%)＝70%分の出口がゼロ。将来集客が立った時の取りこぼしを防ぐ器。工数0.5〜1日。

### 2-2.【今週でも安全】abema ALTERNATIVES 横展開（クイックウィンの唯一の即GO）
- services.js の **hulu / lemino / danime / crunchyroll / fod** の ALTERNATIVES に abema-premium（ASP_FULL_URLS 配線済・A8報酬902円・<2000円でstress-test不要）を追加。netflixは3枠埋まり済＝触らない（slice(0,3)制約）。
- reason は必ず両論併記（「ただし○○は△△より劣る」）。禁則句（おすすめ/ベスト/最強/No.1）をgrepで最終確認。
- 既存のPRラベル・placement='service_page_bottom'・layer='B' 計測にそのまま乗る。俊雄さんの操作不要。

### 2-3.【器・第2弾】games / blog の出口
- GamesPage：trackerCta単一（→収益ゼロ面）＝二重デッドエンド。各ゲームの行動経済学termに対応する /service・/discover へのセカンダリ導線＋placement='game_post'。
- BlogPostPage：末尾CTAが/tracker単一→A→B→C三分岐に。＋trackAffiliateClickに layer 未指定（unknown固定）問題をtagsから推定して渡す。

### 2-4.【俊雄さんの原子操作が必要（待ち）】
- kids-toy ジャンル拡充（Cha Cha Cha / And TOYBOX 追加・現状トイサブ1社で「比較」体裁が崩れている）と water-server null枠の comam 差し替え → **A8管理画面で追跡URL取得が必要**＝俊雄さん作業。報酬2000円超なら proposal-stress-test 発火（BAE§8-1）。
- 取得後の埋め込み自体は discover.js 数行＝agentが即実装可。

### 2-5.【AdSense承認まで凍結】
- 全21記事末尾への収益CTA標準化・アフィ密度の全面上昇・TrackerPageへのAdSlot追加。承認後に1ページ1枠・解約導線より下の原則で段階導入。

---

## 3. ストレステストで生き残った懸念（実装時の必須対処）

1. **着手前に俊雄さんの明示承認**（WEEKLY_SPRINT〜06-14の3本に含まれない＝計画拘束）。
2. モバイル横スクロールは**フェードグラデ必須**＋実機3幅×light/dark検証（「続きがある」が伝わらないと5項目めの発見性が崩れる）。
3. ラベル正名化の**用語ガバナンス**をlessonsに明記（ヘッダー=動詞／Footer・aria=正式名）。
4. 「初見が見逃す」の真因検証は**GA4計測が立ってから**entry別ナビクリック率で実証（placement='tracker_exit'等が前後比較の物差し）。
5. アフィ密度の一斉上昇はAdSense審査（thin-content判定）と緊張→凍結リストを守る。

## 4. 実装順（Opusセッションへの指示）

1. コミット1：ヘッダーC案＋ロゴサブテキスト＋ThemeToggle分離＋モバイル無言化廃止（§1-1/1-2）
2. コミット2：Footer説明子＋HomePage用語統一・/blogリンク（§1-3）
3. コミット3：tracker出口＋placement='tracker_exit'（§2-1）
4. コミット4：abema横展開（§2-2・これは独立なので最初でも可）
5. （任意）コミット5：NavLink active／games・blog出口（§2-3）
- 各コミット後：`npm run build`（prerender 111/111）＋ eslint ＋ §11 Webhook通知。
- 検証：実機3幅×2テーマ目視＋ /yamete-kau へのヘッダー到達確認。
