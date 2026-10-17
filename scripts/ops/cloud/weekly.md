# 【クラウド】週次レビュー（毎週月曜・毎日の当番 daily.md から呼ばれる）

あなたは「サブスクやめた」の週次レビュー担当です。最初に scripts/ops/cloud/COMMON.md を読み、そのルールに従ってください。
**1週間分の動きを確認し、直せるものは直して本番まで確認し、必ず Slack で報告する**のが仕事です。

## 手順

### 1. 機械の点検を7日分走らせる

    node scripts/ops/cloud_check.mjs --days 7 --seo

指摘の有無にかかわらず、出力は最後まで読む。

### 2. 週次だけで見るもの

- **クラウドの定期タスクが毎日動いたか**（毎日の報告は送らない決まりなので、報告ではなく記録で数える）：
  - 定期タスクの実行記録：ツール `mcp__claude-code-remote__list_triggers` で「朝の価格の巡回と判定（7:47）」と
    「毎日の当番（12:14）」の last_run を見る（直近の起動が成功しているか）。
  - 価格の台帳のコミット：`git log --since='8 days ago' --format='%ad %s' --date=short -- scripts/price-watch/state/` で、
    7日分そろっているか数える（朝の当番は毎日台帳をコミットする）。
  - GitHub Actions の `heartbeat` の直近7日の結果：`gh api 'repos/toshioshintani-sys/subsuku-yameta-web/actions/workflows/heartbeat.yml/runs?per_page=7'`。
  抜けた日・失敗した日があれば日付を挙げて報告する。
- **この1週間に無人で直したこと**：`git log --since='8 days ago' --format='%h %ad %s' --date=short` から、当番がコミットした
  改修（watch-list の取り方の修正・スクリプトの修正など）を拾い、まとめに一覧で入れる（毎日は報告していないため）。
- **直近7日にマージされたPRが本番に出ているか**：
  `gh api 'repos/toshioshintani-sys/subsuku-yameta-web/pulls?state=closed&per_page=30'` で merged_at が7日以内のものを拾い、
  その merge_commit_sha が本番のコミット（https://sabusuku-yameta.com/build.json の commit）に含まれるかを
  `git merge-base --is-ancestor <merge_commit_sha> <本番のcommit>` で確かめる（履歴が浅ければ `git fetch --unshallow origin`）。
  含まれていなければ、その変更がサイトの表示に効くもの（docs・state 以外）かを見て報告する。

### 3. 指摘ごとに、直すか・回すかを決める

基準は scripts/ops/triage_prompt.md と同じ。（冒頭の「クラウドへ移行」の注意書きは PC 向け。クラウドではその下の基準の部分だけを使う）クラウドは米国から接続しているので、日本の価格を確かめられない
サービスの価格PRはマージせず「クラウドから確認できず」と回す（COMMON.md）。

### 4. 直したら確かめて main へ

    npm ci   # 未実行なら
    npm run price:check
    npm run build

両方通ったら push し、COMMON.md の「本番に出たかの確かめ方」で本番反映を確認する。

### 5. Slack に1本報告する（指摘の有無にかかわらず必ず送る）

- 7日分の点検で出た指摘の件数と中身（1行ずつ）
- 定期タスクが何日分動いたか（例：価格 7/7・当番 7/7・見張り 7/7）
- この1週間に無人で直したことの一覧（毎日は報告していない分）
- 自分で直して本番まで確認したもの（何を・なぜ・本番の確認結果）
- 直さず回したもの（なぜ・俊雄さんに何をしてほしいか）
- 指摘が無ければ「週次レビュー（<日付範囲>）：指摘なし。本番サイト正常・為替最新・未マージPRなし・定期タスク 7/7」のように、
  **何を確認して問題なかったのか**が分かる1〜2行を書く。

## 最後に必ず出力すること

7日分の点検の指摘件数、直して本番まで確認した件数と内訳、回した件数と理由、巡回報告のそろい具合、Slack送信の成否。
