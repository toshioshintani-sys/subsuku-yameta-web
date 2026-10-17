# クラウド移行：海外（米国）接続から日本の価格を取る方法の調査結果（2026-10-17）

> 引っ越し作戦を進めるセッションへの引き継ぎ。調査したセッションはここで手を止めた。
> 手法そのものは skill `~/.claude/skills/jp-price-from-overseas/SKILL.md` にまとめた。

## 前提（実測）

- claude.ai のクラウドルーティンは**米国から接続**する。Netflix の日本ページを Puppeteer で開くと、JavaScript が米ドル（$7.99〜$26.99）へ書き換える。
- 掲載価格の棚卸し（reconcile）は、日本(PC)で55件中40一致、米国(クラウド)で28一致だった。
- クラウドでできること：外部接続◯（openai.com は403）・Puppeteer◯・branch への push◯・**branch 削除✕（PCから消す）**・Slack コネクタで送信◯（秘密情報不要）。
- RemoteTrigger で create すると**頼んでいないコネクタが14個自動で付く**。作成直後に `clear_mcp_connections: true`。

## 道具

- `scripts/price-watch/geo-probe.mjs`：取り方ごとに、掲載価格（services.js の円）がページに何件出るかを数える。
  - S1 素の取得（Chrome と名乗る）／S2 最初の HTML（JS 書き換え前）／S3 日本設定のブラウザ／S4 描画後／**S5 curl と名乗る素の取得**
  - `--variants scripts/price-watch/geo-variants.json` で候補URLを総当たり、`--strategies S1,S5,S4` で取り方を絞る、`--json` で保存。
- 日本(PC)と米国(クラウド)で同じ数になる取り方＝米国から使える取り方。

## 結果（48サービス）

### A. 米国からでも日本価格が取れる（30）

今の watch-list の URL・取り方のまま取れる 26 件：
amazon-music-unlimited, amazon-prime, apple-music, apple-one, apple-tv-plus, audible（S1/S2 のみ）, danime, dmagazine, dmm-premium, hulu, icloud-plus, lemino, line-music, microsoft-365, niconico-premium, nikkei, note-premium（S3/S4）, pairs（S2〜S4）, playstation-plus, rakuten-magazine, rakuten-music, spotify, u-next, wowow-on-demand, xbox-game-pass（S3/S4）, yahoo-premium

**URL か取り方を変えれば取れる 4 件**（watch-list の変更が必要）：

| id | 米国で効いた URL | 取り方 | 一致 |
|---|---|---|---|
| netflix | https://www.netflix.com/jp/ （`?locale=ja-JP` 付きでも可） | S5 curl と名乗る素の取得 | 3/3 |
| disney-plus | https://www.disneyplus.com/ja-jp | S1 素の取得（S5 も可） | 4/4 |
| dazn | https://www.dazn.com/ja-JP/help/articles/16308524311581 | S5 curl | 4/5 |
| gemini-advanced | https://one.google.com/about/google-ai-plans/?hl=ja&gl=JP | S4 描画後 | 4/4 |

※ Netflix は今の watch-list がヘルプセンター（help.netflix.com/ja/node/24926）で、米国では米ドルになる。トップの /jp/ に変える。

### B. 試した候補では米国から取れない（11）

youtube-premium, youtube-music, google-one, google-workspace（`?gl=JP&hl=ja` も効かず）, dropbox, notion, figma, evernote, vimeo-pro, deepl-pro（`currency=JPY` 系も効かず）, chatgpt-plus（403）

### C. 日本からでも取れない（7・以前から棚卸しで既知）

abema-premium, adobe-cc, bookwalker, canva-pro, crunchyroll, discord-nitro, linkedin-premium

## 次の一手（引っ越し作戦への提案）

1. A の30件はクラウドの価格監視・判定に移せる。うち4件は watch-list の URL と取り方（S5 curl を選べるようにする）を変えてから。
2. B の11件は、当面 PC で見るか、別の「日本固定」の情報源を探す：App Store 日本ストア（apps.apple.com/jp/…、Netflix では ¥1,590/¥2,290 を確認）、特定商取引法に基づく表記、日本の公式ヘルプ・報道発表。アプリ内課金の価格はウェブ価格と違うことがあるので、裏付け用に限る。
3. 判定エージェントがクラウドで公式ページを確かめる時も、米ドル表示を「改定」と誤認しないよう、プロンプトに「米国接続」と「取り方」を明記する。
