# 【クラウド】毎日の当番（毎日 12:14 日本時間・1本の定期タスクで為替・巡回・3日棚卸し・週次をまとめて回す）

あなたは「サブスクやめた」（このリポジトリ・本番 https://sabusuku-yameta.com）の無人運用の当番です。
最初に scripts/ops/cloud/COMMON.md を読み、そのルールに従ってください。

## なぜ1本にまとめているか（2026-10-17）

クラウドの定期タスクは、リポジトリと Slack のつながった設定を持つものしか仕事ができない。
その設定を持つタスクは1本だけなので、日付で仕事を振り分ける当番にした。
PC 時代の4つの仕事（為替・巡回・3日棚卸し・週次）は、それぞれの指示書（fx.md・watch.md・triage.md・weekly.md）が正本で、
この文書は「今日どれをやるか」だけを決める。

## 手順

### 0. 今日を確かめる

    TZ=Asia/Tokyo date '+%Y-%m-%d %a %H:%M'

日付（日）と曜日を控える。scripts/ops/cloud_jobs.json で true になっている仕事だけを担当する
（false の仕事は PC が担当している。やらない）。

### 1. 為替（1日・15日だけ）

その日が **1日か15日**で、`"fx": true` なら、scripts/ops/cloud/fx.md の手順を最後までやる（Slack は fx.md の基準どおり、更新した時と失敗した時だけ）。
それ以外の日はやらない（為替が古いときは手順2の巡回が「為替が古い」として拾い、fx.md の手順で直す）。

### 2. その日の点検（毎日・必ず1つだけ）

- **月曜日**で `"weekly": true` → scripts/ops/cloud/weekly.md をやる（7日分。指摘が無くても必ず Slack に1本＝唯一の定例報告）。
  この日は巡回を兼ねる。
- **日が 1・4・7・10・13・16・19・22・25・28・31 のどれか**で `"triage": true` → scripts/ops/cloud/watch.md をやる。
  ただし点検のコマンドは `node scripts/ops/cloud_check.mjs --days 3 --seo` にする（3日棚卸しを兼ねる。直す基準は triage.md と同じ）。
  Slack は COMMON.md の基準に当てはまる時だけ（見出し「【クラウド】巡回・3日棚卸し（<日付>）」）。
- **それ以外の日**で `"watch": true` → scripts/ops/cloud/watch.md をやる（`node scripts/ops/cloud_check.mjs`）。

### 2.5 Threads のバズ投稿の記事集め（3日棚卸しの日だけ・2026-10-17 追加）

**日が 1・4・7・10・13・16・19・22・25・28・31 のどれか**で `"threads_buzz": true` なら、手順2のあとに次をやる。
目的は「世の中の日本の Threads のバズ投稿を500件以上集めて傾向を分析する」こと（docs/THREADS_BUZZ_SOURCES_2026-10.md）。

    SUBSUKU_CLOUD=1 node scripts/ops/threads-buzz/collect-nlab.mjs --pages=2

- ねとらぼ（nlab.itmedia.co.jp）の「Threads」タグを読み、台帳 `scripts/ops/threads-buzz/nlab_ledger.json` に無い記事だけを足す。1件4秒の間隔で、数分で終わる。
- **threads.com・threads.net は開かない**（Meta 規約 3.2 が自動の読み取りを禁じている）。業者のデータも使わない。
- 台帳が変わったら、その1ファイルだけを add してコミットする（例：`ledger: ねとらぼ Threads 記事 +3件（重複なし 381件）`）。scripts/ops/ なので Netlify はビルドしない。
- Slack は送らない（台帳だけのコミット）。例外は2つ：
  - 出力に `GOAL_REACHED` が出た → 「【クラウド】Threads のバズ投稿が重複なしで500件に届いた。分析に入れる」と1本送る（俊雄さんの判断が要る）。
  - ねとらぼが読めない・道具がエラーで止まる → COMMON.md の基準3（直せなかった）として送る。
- 台帳に Threads の投稿URL・投稿者IDを書き足さない（公開リポジトリのため。post_fp は重複判定用の指紋）。
- 500件に届くまで分析はしない（俊雄さんの決まり）。

### 3. 最後に

この起動でやった仕事（為替・巡回・3日棚卸し・週次・Threads の記事集め・異常が無い日の改修のどれをやったか）と、それぞれの結果・
Slack に送ったか（送らなかった時はその理由＝基準に当てはまらなかった）を出力して終わる。
送るべき報告を Slack に送れなかった場合は、出力の先頭に「🚨 Slack 送信失敗」と書き、次の起動でもう一度送る。
