# クラウドで動く無人タスクの共通ルール（2026-10-17 制定）

この文書は scripts/ops/cloud/ の各指示書（daily.md・price.md・fx.md・watch.md・triage.md・weekly.md）から読まれる。
定期タスクは運用当番セッションへ毎朝 7:47（price.md＝価格の巡回と判定）と毎日 12:14（daily.md＝日付で fx・watch・triage・weekly を振り分ける）に届く。
PC（Windows・Task Scheduler）で動いていた為替・巡回・3日棚卸し・週次を、claude.ai のクラウドの
定期タスクへ移したもの。PC 用の指示書（scripts/price-watch/fx_update_prompt.md・scripts/ops/*_prompt.md）
とは**別物**。PC 用の指示書にある Windows のパス・python の Slack 送信・netlify CLI・schtasks は使わない。

## このクラウドの前提（2026-10-17 実測）

- 起動のたびにリポジトリを新しくクローンする。前回のログ・作業ファイルは残っていない。
  記録を残したいものは git（main）か Slack に残す。
- **米国から接続している。** 国で表示が変わるサイト（Netflix・YouTube・Google One・Dropbox・Notion 等）は
  ドル表示になることがある。**ドルが見えても「日本の価格が変わった」と判断しない。**
  日本の価格を確かめる時は、必ず `SUBSUKU_CLOUD=1` を付けて scripts/price-watch の道具を使う
  （`SUBSUKU_CLOUD=1 node scripts/price-watch/reconcile.mjs --only <id>`・`SUBSUKU_CLOUD=1 npm run price:fetch -- <id>`）。
  watch-list.json の `"cloud"` の取り方（東京の中継所・国判定の差し替え。jp-browser.mjs）で日本向けのページを読む。
  それでも日本円が読めないサービスは「クラウドから日本の価格を確認できず」と報告する（推測で判断しない）。
- 時刻は UTC で動いている。日付・時刻は必ず日本時間で考える（`TZ=Asia/Tokyo date`）。
- PowerShell・Windows のパス（C:\...）・`python ... slack_sender.py`・`netlify` CLI は無い。使わない。
- GitHub：`git push origin main` はできる。ブランチの**削除はできない**（`git push --delete` は切断される）。
  PR の一覧・中身・マージは GitHub のツール（mcp__github__*）か `gh api repos/toshioshintani-sys/subsuku-yameta-web/...`（REST）で行う。
  `gh pr list` / `gh pr merge` は GraphQL を使うので失敗する。
- 秘密情報の環境変数は無い（Slack の webhook・Netlify のトークン等）。要らない作りにしてある。

## Slack への報告（2026-10-17 俊雄さん決定：意味のない毎日の報告は送らない）

**送るのは次の4つのどれかに当てはまる時だけ。** それ以外は送らない（記録は git に残る）。

1. **俊雄さんの判断・操作が要る**（承認・ログイン・鍵の更新・止まっていて自力で直せないもの。価格・為替の PR は条件を満たせば自分でマージする＝price.md）
2. **本番サイトの表示を変えた**（価格・為替の更新、表示に効く修正を本番に出した）
3. **異常を見つけたが直せなかった**
4. **月曜の週次のまとめ**（唯一の定例報告。weekly.md）

**送らないもの**：「異常なし」「検知ゼロ」「偽陽性だけだった」「基準の取り直し」「為替は新しくなっていなかった」
「台帳・記録だけのコミット」（CLAUDE.md §11 の main push 通知も、無人の当番が台帳・docs・watch-list だけを
コミットした時は送らない。中身は週次のまとめに入れる）。

- 送り先は `#6-subsuku-daily`（チャンネルID `C0B6UG621R6`）。Slack のツール（mcp__Slack__slack_send_message）で送る。
- 送る時は1回の起動で1本だけ。1行目で「何が起きたか／俊雄さんに何をしてほしいか」を言い切る。煽らず事実だけ。直せなかったことを隠さない。
- 先頭に「【クラウド】」を付ける（PC から来た通知と見分けるため）。
- 黙って止まっていないかは、報告ではなく別の見張りで確かめる：GitHub Actions の `heartbeat`（毎日・価格の台帳が30時間以内に
  更新されていなければ失敗して俊雄さんにメールが届く）と、月曜の週次（定期タスクが7日間動いたかを数える）。

## 本番に出たかの確かめ方（push したら必ず）

「push できた」「ローカルでビルドが通った」は本番反映ではない（2026-09-22 に17日間止まっていた教訓）。

1. `https://sabusuku-yameta.com/build.json` を読む（Netlify のビルドが書く。`commit` が本番のコミット）。
   30秒おきに最大8回、`commit` が push したコミットになるまで待つ。
2. build.json が読めない時は、Netlify のツールがあれば（無い設定のこともある）それで確かめる：
   `netlify-project-services-reader` の get-project（siteId `b4ac149a-76c4-4156-9903-c2605ac17cf9`）で
   currentDeploy の id を取り、`netlify-deploy-services-reader` の get-deploy-for-site で
   `commit_ref` と `state`（ready / error）を見る。
3. docs・scripts/ops・scripts/price-watch/state・*.md だけの push は Netlify がビルドを飛ばす（scripts/netlify-ignore.sh）。
   その場合は本番のコミットが変わらないのが正常。
4. 実ページを取得して、直した内容が本番に出ていることを確かめる。

## 守ること（全タスク共通）

- **誤った価格を出さないことが最優先。** 記憶や推測で価格・為替を書かない。自信が持てなければ直さず報告。
- force push 禁止。push が non-fast-forward なら `git pull --rebase origin main` してから再 push。駄目なら止めて報告。
- git add してよいのは、直した内容に対応する最小限のファイルだけ。
- コミットメッセージの末尾に `Co-Authored-By: Claude <noreply@anthropic.com>` を付ける。
- 定期タスク・運用ルールの追加／変更／停止はしない（報告だけ）。
- docs/NOT_DOING.md・docs/WEEKLY_SPRINT.md が「やらない」としていることはしない。
- 認証情報・トークンの値を読む・表示する・書き換えることはしない。
- 迷ったら直さない。次の起動が必ず来る。
- サブエージェントを使う場合は model を claude-sonnet-5-5 に固定する。
