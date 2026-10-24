# 【クラウド】価格の巡回と判定（毎朝 7:47 日本時間・運用当番セッションで動く）

あなたは「サブスクやめた」の価格監視の担当です。最初に scripts/ops/cloud/COMMON.md を読み、そのルールに従ってください。
PC の 7:10 巡回（price-watch）と 7:30 判定（run_daily_judge）を、クラウドで1回の起動にまとめたものです。
`"price": true`（scripts/ops/cloud_jobs.json）でなければ、何もせず終了します。

## 前提（2026-10-17 実測）

- クラウドは米国から接続する。そのため **`SUBSUKU_CLOUD=1` を必ず付けて**巡回・棚卸し・公式ページ取得を動かす。
  付けると watch-list.json の `"cloud"` の取り方（東京の中継所・国判定の差し替え等。scripts/price-watch/jp-browser.mjs）で
  日本向けのページを読む。付けないと米ドルを読んで誤検知する。
- クラウドでの棚卸しは 55件中44件一致（PC は40件）。一致しない11件は日本から読んでも取れないもの（既知）。
- 起動のたびにリポジトリを新しく取る。**巡回の台帳（scripts/price-watch/state/）は毎回コミットしないと翌日に引き継がれない。**

## 手順

### 0. 準備

    TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M'
    npm ci   # node_modules が無ければ

### 1. 巡回（検知）

    SUBSUKU_CLOUD=1 node scripts/price-watch/price-watch.mjs

（その日すでに巡回済みなら自動でスキップする。やり直す時だけ `--force`。）

- 出力の `CHANGED` が検知。`rebaseline` は「クラウドで初めて読んだので基準を取り直した」もので、検知ではない（判定不要）。
- 検知があると notify.mjs が detection_log.json に未判定（verdict なし）で記録する。
  その中の「Slack通知に失敗」は PC 用の送り方が無いだけなので気にしない（報告は手順5で Slack のツールから送る）。

### 2. 掲載価格の棚卸し（毎回）

    { TZ=Asia/Tokyo date +%F; SUBSUKU_CLOUD=1 node scripts/price-watch/reconcile.mjs; } > scripts/price-watch/state/reconcile_today.txt 2>&1

（このファイルは git 管理外。判定の手順2.5で読む。）

### 3. 検索エンジンへの通知（1日1回）

    node scripts/seo/indexnow-ping.mjs

失敗しても続ける。

### 4. 判定

detection_log.json に verdict の無い検知がある、または reconcile_today.txt に ALL_MISS / PARTIAL_MISS が
**既知の11件以外で**出ている場合は、scripts/price-watch/daily_judge_prompt.md の手順1〜5に従って判定する
（冒頭の「クラウドへ移行」の注意書きは PC 向け。読み飛ばす）。次の読み替えを守る：

- 既知の11件（棚卸しで一致しない常連）：abema-premium・adobe-cc・bookwalker・canva-pro・crunchyroll・discord-nitro・
  linkedin-premium（日本からも取れない）、amazon-music-unlimited・amazon-prime（ファミリー・学生等がそのページに無い）、
  dazn（年額一括の月あたりがページに無い）。ここに挙げた分は掲載ズレとして扱わない。
- 公式ページの取得は `SUBSUKU_CLOUD=1 npm run price:fetch -- <id>`（金額の並びが要るときは `--full`）。
  **米ドルが見えても値上げと判断しない。** 日本円が読めないときは verdict を「保留」にし、理由に「クラウドから日本の価格を確認できず」と書く。
- 手順4.5（為替）はやらない（為替は当番の fx.md と巡回が担当）。
- 手順5の B（PR）は `gh pr create` が使えない（GraphQL 不可）。GitHub のツール（mcp__github__create_pull_request）か
  `gh api repos/toshioshintani-sys/subsuku-yameta-web/pulls -f title=... -f head=price/auto-<日付> -f base=main -f body=...` で作る。
  その日の `price/auto-<日付>` の PR がすでに開いていれば、新しく作らずそのブランチに積む。
  **PR は作ったら自分でマージまでする（俊雄さん決定 2026-10-24「更新する時はマージもするルール」）。** 手順：PR は draft にせず作る（draft だとマージできない）→ `mcp__github__merge_pull_request`（merge_method=merge）。
  マージしてよいのは、本物の価格改定を公式（日本円）で確認でき、`npm run price:check` と `npm run build` が通っている PR と、台帳だけの PR（保留を含んでもよい）。
  円を確認できていない価格の変更（services.js に触れるもの）は、マージせず保留として報告する。マージしたら本番に出たことを COMMON.md の手順で確かめる。
- 手順6の Slack は送らない。代わりに下の手順5の基準に当てはまる時だけ、Slack のツールで1本送る。

### 5. 記録を残す（必ず）

- **巡回の状態（price_watch_state.json・candidates.json）は、判定の結果にかかわらず main へコミットする。**
  表示に影響しない台帳で、コミットしないと翌日また同じ検知が出る。
- 判定が A（全件偽陽性・services.js 無変更・保留なし・掲載ズレなし・notes なし）の日は、detection_log.json も含めて
  `scripts/price-watch/state/` を main へコミットして push（メッセージ「〇月〇日の検知N件を判定（全件偽陽性）」）。
- 判定が B の日は、detection_log.json・autofix_shadow.json・services.js を `price/auto-<日付>` の PR に入れ、
  巡回の状態（price_watch_state.json・candidates.json）だけを main に入れる。
- 検知ゼロの日も、巡回の状態を main へコミットする（メッセージ「〇月〇日の巡回（検知なし）」）。
- push の前に `git pull --rebase origin main`。force push 禁止。docs/state だけの push は Netlify がビルドしない（正常）。

Slack は COMMON.md の基準に当てはまる日だけ1本送る。この仕事で送るのは次の時だけ：
- 本物の価格改定があった（PR を作った）／保留がある／掲載ズレ（既知の11件以外の不一致）が見つかった／notes に書いた気づきがある → 俊雄さんに見てほしいこと
- 巡回の取得失敗が多い（5件以上）など、仕組みが壊れていて自力で直せなかった
例：「【クラウド】価格（<日付>）：〇〇が値上げの可能性（公式で確認済み・PR <URL> をマージ済み・本番確認済み）」
**検知ゼロ・偽陽性だけ・基準の取り直しだけの日は送らない。** 台帳のコミットだけで終える。

### 6. GA4 の前日の数値を Slack へ（毎朝・2026-10-24 追加）

`scripts/ops/cloud_jobs.json` が `"ga4_daily": true` で、環境変数 `GA4_CREDENTIALS_JSON` が入っている時だけやる。
PC の毎朝 6:35 の通知（WorldOracle_subsuku_yameta_daily_report）をクラウドへ移したもの。**これは俊雄さんが続けると決めている毎日の定例通知**で、COMMON.md の「意味のない毎日の報告は送らない」の例外。

    python3 monitoring/scripts/send_ga4_daily_slack.py --text

- 出力された文面を、そのまま `#6-subsuku-daily`（`C0B6UG621R6`）へ Slack のツールで1本送る。数字を書き換えない・足さない。先頭に「【クラウド】」は付けない（PC 時代と同じ見た目にする）。
- 価格の報告とは別の1本として送ってよい（COMMON.md の「1回の起動で1本だけ」の例外）。
- `GA4_CREDENTIALS_JSON` が入っていない → 何もしない（PC の通知がまだ動いている）。Slack も送らない。
- 終了コードが1（取得失敗）→ 出力された「⚠️ 取得失敗」の文面を送る（鍵の失効なら俊雄さんの操作が要る＝COMMON.md の基準1）。
- 数字は git にも docs にも書かない（公開リポジトリ）。
- GA4 の取得ライブラリが無ければ、道具が自分で `pip install google-analytics-data` する。

## やってはいけないこと

- `SUBSUKU_CLOUD=1` を付けずに巡回・棚卸しを動かす（米ドルを読んで誤検知する）
- 公式ページで日本円を確認できていない価格を書く・本物と判定する
- force push（PR のマージは上の条件を満たすものだけ自分でする）
- 既存の検知記録の削除や書き換え

## 最後に必ず出力すること

巡回の件数（変化・取り直し・失敗）、検知の判定内訳、棚卸しの一致数、コミットと push の成否、PR の URL、Slack 送信の成否、GA4 の数値通知を送ったか（送らなかった時はその理由）。
