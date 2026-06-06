# 悪態どら猫4コマ 画像フォルダ（Threads告知用）

> Geminiで生成した確定版4コマ。**投稿時はこの表どおり**：画像を投稿（本文＝フック）→ 返信で2投目リンク。
> 脚本・画風プロンプト・運用憲法は `../kokuchi-plan.md` §2-3、④〜⑧の脚本は `../threads-stock.md` §B。
> 新規追加は `pwsh ../../scripts/save-4koma.ps1 -No NN -Bias 名 -Theme 名`（Downloadsの最新Gemini画像を自動リネーム保存）。

| No | ファイル | バイアス | フック（1投目本文） | タグ | 2投目リンク |
|---|---|---|---|---|---|
| 01 | dora_No01_サンクコスト_ジム.png | サンクコスト | ジムの幽霊会員、3ヶ月でいくら溶かした…？🐱 | #サブスク | games |
| 02 | dora_No02_現状維持_また今度.png | 現状維持 | "また今度"の解約、気づけば半年。総額みた…？🐱 | #サブスク解約 | top |
| 03 | dora_No03_損失回避_今やめると損.png | 損失回避 | 「今やめると損」で指が止まった人へ🐱 | #節約 | games |
| 04 | dora_No04_デフォルト効果_自動更新.png | デフォルト効果 | 無料体験のあと、勝手に課金されてた人…🐱 | #サブスク | tracker |
| 05 | dora_No05_プランニング誤謬_全部見なきゃ.png | プランニング誤謬 | 「週末で見終わる」、何回ハズした？🐱 | #節約 | games |
| 06 | dora_No06_おとり効果_松竹梅.png | おとり効果 | 真ん中のプラン選んだ人、容量の使用率みてごらん？🐱 | #サブスク | tracker |
| 07 | dora_No07_認知的不協和_元を取らなきゃ.png | 認知的不協和 | 元を取るために、観たくない動画を流してませんか🐱 | #節約術 | games |
| 08 | dora_No08_社会的証明_みんな入ってる.png | 社会的証明 | 「みんな入ってる」で増やしたサブスク、使ってる？🐱 | #固定費見直し | games |
| 09 | dora_No09_フレーミング_1日33円.png | フレーミング効果 | 「1日33円」のサブスク、年でいくらか数えた？🐱 | #節約 | tracker |
| 10 | dora_No10_重複_全部入り.png | 重複/正常性 | 動画アプリ、何個入って何個見てる？🐱 | #サブスク | games |
| 11 | dora_No11_アンカリング_値上げ据え置き.png | アンカリング | 「会員は据え置き」で継続した人、先月使った？🐱 | #固定費見直し | tracker |
| 12 | dora_No12_保有効果_お気に入り.png | 保有効果 | “消えるのが惜しくて”解約できてないサブスク、ない？🐱 | #サブスク解約 | games |
| 13 | dora_No13_ツァイガルニク_続きが気になる.png | ツァイガルニク | 「続きが気になる」で何ヶ月、止まってる？🐱 | #節約 | games |
| 14 | dora_No14_リアクタンス_解約迷路.png | リアクタンス/ダークパターン | 解約しようとして“迷路”に飛ばされた経験、ない？🐱 | #サブスク解約 | top |
| 15 | dora_No15_過信バイアス_全機能.png | 過信バイアス | 上位プラン、ほんとに上位の機能つかってる？🐱 | #固定費見直し | tracker |

## 2投目リンク（UTM付き・コピペ用）
> **必ず末尾に `&utm_content=dora_NoXX` を付ける**（XX＝投稿する4コマ番号）。これで「どの4コマが釣れたか」がGA4で分かる＝撤退ライン判定が機能する。付け忘れると全部 kokuchi にまとまって、ネット別の効果が消える。
- **games**：`続ける？やめる？が30秒でわかる無料診断 → https://sabusuku.netlify.app/games?utm_source=threads&utm_medium=social&utm_campaign=kokuchi&utm_content=dora_NoXX`
- **tracker**：`サブスクの棚卸し（合計・年額が一瞬で）→ https://sabusuku.netlify.app/tracker?utm_source=threads&utm_medium=social&utm_campaign=kokuchi&utm_content=dora_NoXX`
- **top**：`主要サブスクの最短解約ルート → https://sabusuku.netlify.app/?utm_source=threads&utm_medium=social&utm_campaign=kokuchi&utm_content=dora_NoXX`

例：No04（自動更新）を投稿 → `…&utm_campaign=kokuchi&utm_content=dora_No04`

## 計測（撤退ライン：100本×1,000超えゼロで仮説再考）
GA4（プロパティ538470329）で以下が見える：
- **流入**：`utm_source=threads` / `utm_campaign=kokuchi` / **`utm_content=dora_NoXX`（4コマ別）**
- **ファネル**：セッション → `diagnosis_start`（診断開始）→ `diagnosis_complete`（診断完了）※BiasGameに計測実装済（2026-06-06）
- **収益接続**：記事経由なら `affiliate_click`（`placement=blog_inline`）※BlogPostPageに委譲計測実装済（2026-06-06）

→ 追うのは「いいね総数」でなく **utm_content別のクリック→diagnosis_start率**。どのネタ（バイアス）が診断に繋がったかで弾を選別する。
