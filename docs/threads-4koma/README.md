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

## 2投目リンク（UTM付き・コピペ用）
- **games**：`続ける？やめる？が30秒でわかる無料診断 → https://sabusuku.netlify.app/games?utm_source=threads&utm_medium=social&utm_campaign=kokuchi`
- **tracker**：`サブスクの棚卸し（合計・年額が一瞬で）→ https://sabusuku.netlify.app/tracker?utm_source=threads&utm_medium=social&utm_campaign=kokuchi`
- **top**：`主要サブスクの最短解約ルート → https://sabusuku.netlify.app/?utm_source=threads&utm_medium=social&utm_campaign=kokuchi`

## 計測（撤退ライン：100本×1,000超えゼロで仮説再考）
投稿したら、いいね/表示と**2投目リンクのクリック**を記録（GA4のutm_campaign=kokuchiで流入が見える）。
