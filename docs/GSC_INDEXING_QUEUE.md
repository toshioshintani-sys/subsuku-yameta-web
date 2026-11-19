# Google に載っていないページの再登録の依頼（台帳・2026-11-19〜）

経緯は `docs/lessons.md` の 2026-11-19 の項。Search Console の「クロール済み・インデックス未登録」48件のうち、
解約手順・図鑑・ゲーム・ブログのページを、1日の上限（5件ほど）まで毎日依頼していく。
PC の Claude のスケジュールタスク「subsuku-gsc-indexing」が毎日この台帳を読んで進める。

## やり方（毎回）
1. Chrome で Search Console（`https://search.google.com/search-console?resource_id=sc-domain%3Asabusuku-yameta.com`）を開く。
2. 上の「URL 検査」の欄に、下の「未」の行の URL を入れて Enter。
3. 「URL は Google に登録されています」なら → 依頼せず「済（すでに登録）」にする。
4. 「URL が Google に登録されていません」なら → 「インデックス登録をリクエスト」を押し、1〜2分待つ。
   「リクエスト済み」→「依頼済 日付」にする。「問題が発生しました」→ その日の上限なので、そこでやめる。
5. ページが読み込みの途中で止まったら、タブを開き直して1回だけやり直す。それでも駄目ならその日はやめる。
6. 台帳を更新して、docs だけをコミット・push（Netlify はビルドしない）。

## 未登録のページ（上から順に）

| 状態 | URL |
|---|---|
| 依頼済 2026-11-19 | https://sabusuku-yameta.com/service/netflix/ |
| 依頼済 2026-11-19 | https://sabusuku-yameta.com/service/spotify/ |
| 依頼済 2026-11-19 | https://sabusuku-yameta.com/service/u-next/ |
| 依頼済 2026-11-19 | https://sabusuku-yameta.com/service/apple-one/ |
| 依頼済 2026-11-19 | https://sabusuku-yameta.com/service/icloud-plus/ |
| 済（すでに登録） | https://sabusuku-yameta.com/service/playstation-plus/ |
| 済（すでに登録） | https://sabusuku-yameta.com/service/amazon-music-unlimited/ |
| 未 | https://sabusuku-yameta.com/service/dmm-premium/ |
| 未 | https://sabusuku-yameta.com/service/yahoo-premium/ |
| 未 | https://sabusuku-yameta.com/service/fod/ |
| 未 | https://sabusuku-yameta.com/service/wowow-on-demand/ |
| 未 | https://sabusuku-yameta.com/service/line-music/ |
| 未 | https://sabusuku-yameta.com/service/canva-pro/ |
| 未 | https://sabusuku-yameta.com/discover/flower/ |
| 未 | https://sabusuku-yameta.com/discover/water-server/ |
| 未 | https://sabusuku-yameta.com/discover/kids-toy/ |
| 未 | https://sabusuku-yameta.com/games/loss-aversion/ |
| 未 | https://sabusuku-yameta.com/games/sunk-cost/ |
| 未 | https://sabusuku-yameta.com/blog/best-payment-method-for-subscription/ |
| 未 | https://sabusuku-yameta.com/blog/water-server-cancel-to-filter/ |
| 未 | https://sabusuku-yameta.com/blog/electric-toothbrush-spot-buy-to-subscription/ |
| 未 | https://sabusuku-yameta.com/blog/summer-break-subscription-review/ |
| 未 | https://sabusuku-yameta.com/blog/mystery-charge-subscription-lookup/ |
| 未 | https://sabusuku-yameta.com/blog/payday-balance-status-quo-bias/ |
| 未 | https://sabusuku-yameta.com/blog/month-end-deadline-effect-subscription/ |
| 未 | https://sabusuku-yameta.com/blog/contact-lens-spot-buy-to-subscription/ |
| 未 | https://sabusuku-yameta.com/blog/when-to-cancel/ |
| 未 | https://sabusuku-yameta.com/blog/app-vs-browser-billing/ |
| 未 | https://sabusuku-yameta.com/blog/free-trial-commitment-reciprocity/ |
| 未 | https://sabusuku-yameta.com/blog/expensive-subscription-sunk-cost-survivorship/ |
| 未 | https://sabusuku-yameta.com/blog/auto-renewal-pitfalls/ |
| 未 | https://sabusuku-yameta.com/blog/late-night-impulse-subscribe/ |
| 未 | https://sabusuku-yameta.com/blog/family-budget-review-order/ |
| 未 | https://sabusuku-yameta.com/blog/how-to-survive-retention-screen/ |
| 未 | https://sabusuku-yameta.com/blog/monthly-vs-yearly-plan/ |
| 未 | https://sabusuku-yameta.com/blog/why-cant-cancel/ |
| 未 | https://sabusuku-yameta.com/blog/gym-cancel-to-home-training/ |
| 未 | https://sabusuku-yameta.com/blog/credit-statement-ostrich-double-charge/ |
| 未 | https://sabusuku-yameta.com/blog/coffee-subscription-cancel-to-auto-maker/ |
| 未 | https://sabusuku-yameta.com/blog/graduated-spotify-tried-coffee-subscription/ |
| 未 | https://sabusuku-yameta.com/blog/bonus-season-fixed-cost-yearly-vs-buyout/ |
| 未 | https://sabusuku-yameta.com/blog/microsoft365-vs-perpetual-office/ |
| 未 | https://sabusuku-yameta.com/blog/graduated-netflix-tried-flower-subscription/ |
| 未 | https://sabusuku-yameta.com/blog/fiber-internet-switch-fixed-cost/ |

（`/` の無い表記・feed.xml は正式なページへまとめられているので対象外）

## 別件：Nintendo Switch Online のページ（未調査）
Search Console が「表示回数が89%減った」と指摘（2026-11-16 時点）。検索パフォーマンスで、このページの表示回数・掲載順位・検索語の推移を見て、原因を下に書く。

- 調査結果：（未）

## すべて終わったら
「未」が無くなり、別件の調査も書けたら、スケジュールタスク「subsuku-gsc-indexing」を止める。
2〜3週間後に、依頼したページが「登録済み」になったかを確かめて、lessons.md に結果を書く。
