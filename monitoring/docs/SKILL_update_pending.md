# lifeoracle-daily-metrics タスク定義 更新内容
# 更新日: 2026-05-01
# 通常の Cowork セッションで以下の内容に差し替えること

---
name: lifeoracle-daily-metrics
description: ライフオラクル日次メトリクス収集（GA4/X/note）→CSV→Google Sheets同期→日次メール（プロジェクト状況付き）を毎朝6:30 JSTに実行
---

ライフオラクル日次メトリクス収集タスクです。毎朝6:30 JSTに以下の手順を実行してください。

詳細な手順は C:\Users\user\Desktop\Claude_work\docs\INSTRUCTIONS_cowork_monitoring.md を参照してください。

## 実行手順

### ステップ1：GA4データ取得
- 認証方式: OAuth ADC（Application Default Credentials）
  - ADCファイル: C:\Users\user\AppData\Roaming\gcloud\application_default_credentials.json
  - サービスアカウントキー（ga4-sa.json）は不要・使用しない
- 以下のコマンドをBashツールで実行して前日分を取得：
  ```
  python3 /sessions/focused-sweet-franklin/mnt/Claude_work/monitoring/scripts/collect_ga4.py --property-id 534433669
  ```
- 出力はJSON1行（date, active_users_1d, sessions_1d, avg_engagement_sec, top_sources, error）
- error が null なら成功。null 以外なら該当列を N/A にして処理継続

### ステップ2：X データ取得（API方式・2026-05-01更新）
- Chrome MCPは使わない（x.com/i/analytics は Premium+ 専用となり取得不可）
- 以下のコマンドをBashツールで実行：
  ```
  python3 /sessions/focused-sweet-franklin/mnt/Claude_work/monitoring/scripts/collect_x.py
  ```
- 出力はJSON1行（date, followers, tweet_count, impressions_1d, likes_1d, retweets_1d, url_clicks_1d, profile_clicks_1d, new_followers_1d, top_tweets, error）
- 認証: x_posting_system/.env の X_API_KEY / X_API_SECRET から Bearer Token を自動生成。外部ライブラリ不要。
- url_clicks_1d / profile_clicks_1d は常に null（note送客は GA4 の top_sources で代替計測）
- error が null なら成功。null 以外なら該当列を N/A にして処理継続

### ステップ3：noteダッシュボードデータ取得
- Chrome MCP で https://note.com/sitesettings/stats を開いて数値を取得
  ※ URL は /stats（/stats/pv は 404 になるため注意。2026-05-01 変更確認済み）
- ログイン状態を確認（未ログインの場合はエラーメールを送って停止）
- 「週」タブのPV・スキ数を取得（日次タブは廃止済みのため週次データを使用）
- 記事別テーブルをスクロールして上位5件（タイトル・PV・スキ数）を取得
- https://note.com/lifeoraclejp でフォロワー数を取得

### ステップ4：CSVログ追記
- 保存先: C:\Users\user\Desktop\Claude_work\monitoring\logs\daily_metrics.csv
- 同日付の行がすでに存在する場合は追記せず上書き更新する
- CSVへのマッピング（collect_x.py出力 → CSV列名）:
  - impressions_1d    → x_impressions_24h
  - profile_clicks_1d → x_profile_visits_24h（通常 null）
  - url_clicks_1d     → x_link_clicks_24h（通常 null）

### ステップ5：メール本文生成
以下のコマンドを実行してください（--todo と --lessons を必ず渡すこと）：

```
python3 /sessions/focused-sweet-franklin/mnt/Claude_work/monitoring/scripts/build_email_v2.py --date {今日のYYYY-MM-DD} --csv "/sessions/focused-sweet-franklin/mnt/Claude_work/monitoring/logs/daily_metrics.csv" --todo "/sessions/focused-sweet-franklin/mnt/Claude_work/ライフオラクル/tasks/todo.md" --lessons "/sessions/focused-sweet-franklin/mnt/Claude_work/ライフオラクル/tasks/lessons.md"
```

このコマンドの出力JSONから subject・html を取得してください。

### ステップ6：Gmail下書き作成
- Gmail MCP の create_draft ツールで下書きを作成
- 宛先: toshio.shintani@gmail.com
- 件名: ステップ5のJSONから取得した subject
- 本文: ステップ5のJSONから取得した html（HTML形式）

### ステップ7：実行ログ記録
- C:\Users\user\Desktop\Claude_work\monitoring\logs\execution.log に結果を記録
- 形式: [YYYY-MM-DD HH:MM:SS] [SUCCESS|PARTIAL|FAILED] 詳細メッセージ

## 注意事項
- 各ステップが失敗しても処理を継続し、該当列はN/Aとする
- noteがログアウト状態の場合は処理を中断してエラーメールを送る
- メール末尾の「📋 プロジェクト状況」セクションは --todo / --lessons を渡すことで自動生成される（削除しないこと）
- Bashコマンドは必ずLinuxサンドボックスパス（/sessions/...）で実行する
