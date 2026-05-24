# GA4 Data API サービスアカウント設定手順

**所要時間：約15分**
**実行者：俊雄さん（Google Cloud Console操作のため）**

---

## 1. Google Cloud プロジェクトの準備

1. https://console.cloud.google.com/ にログイン
2. 上部プロジェクトメニュー → 「新しいプロジェクト」
3. 名前: `life-oracle-monitoring`（任意）→ 作成

## 2. 必要なAPIを有効化

左メニュー「APIとサービス」→「ライブラリ」から、以下の **2つ** を有効化する：

| API名 | 用途 |
|---|---|
| `Google Analytics Data API` | GA4メトリクス取得 |
| `Google Sheets API` | 日次メトリクスをスプレッドシートに書き込み |

各APIで「有効にする」ボタンをクリック。

## 3. サービスアカウント作成

1. 左メニュー「IAMと管理」→「サービスアカウント」
2. 上部「サービスアカウントを作成」
3. サービスアカウント名: `life-oracle-monitoring-sa`
4. 「作成して続行」→ ロール付与はスキップでOK（GA4側で権限付与するため）→ 「完了」

## 4. JSONキーをダウンロード

1. 作成したサービスアカウント一覧から該当行をクリック
2. 「キー」タブ → 「鍵を追加」→ 「新しい鍵を作成」
3. キーのタイプ: JSON → 作成
4. JSONファイルが自動ダウンロードされる

## 5. キーファイルを所定の場所に配置

**ファイル名**：`ga4-sa.json`（リネーム）
**配置先**：

```
C:\Users\user\.life-oracle\ga4-sa.json
```

PowerShell で実行：

```powershell
# フォルダ作成
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.life-oracle"

# ダウンロードフォルダから移動（ファイル名は実際のダウンロード名に合わせる）
Move-Item "$env:USERPROFILE\Downloads\life-oracle-monitoring-*.json" "$env:USERPROFILE\.life-oracle\ga4-sa.json"
```

## 6. GA4 プロパティ側で権限付与

1. https://analytics.google.com/ にログイン
2. 管理（歯車アイコン）→ プロパティ設定 → 「プロパティのアクセス管理」
3. 右上「+」→ 「ユーザーを追加」
4. メールアドレス欄：**手順3でコピーしたサービスアカウントのメールアドレス**
   （例: `life-oracle-monitoring-sa@life-oracle-monitoring.iam.gserviceaccount.com`）
5. 権限：**閲覧者** のみチェック → 「追加」

## 7. GA4 プロパティID を控える

1. 管理 → プロパティ設定 → 「プロパティの詳細」
2. 「プロパティID」の数値（例: `123456789`）をメモ
3. 環境変数で設定（PowerShell管理者）:

```powershell
[System.Environment]::SetEnvironmentVariable("GA4_PROPERTY_ID", "123456789", "User")
```

## 8. Google Sheets の準備

1. https://sheets.google.com/ にアクセスし、新しいスプレッドシートを作成
2. タイトルを「LifeOracle Daily Metrics」に変更
3. URLからスプレッドシートIDをコピー
   - URL例: `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`**`/edit`
   - 太字部分がスプレッドシートID
4. 右上「共有」→ 手順3のサービスアカウントメールアドレスを追加（**編集者**権限）
5. 環境変数として設定（PowerShell管理者）：

```powershell
[System.Environment]::SetEnvironmentVariable("SHEETS_METRICS_ID", "スプレッドシートID", "User")
```

## 9. 動作確認

PowerShell を新規に開き直してから：

```powershell
pip install google-analytics-data gspread
cd C:\Users\user\Desktop\Claude_work\monitoring\scripts
python collect_ga4.py
python sync_to_sheets.py
```

GA4成功例：

```json
{"date": "2026-04-23", "active_users_1d": 42, "sessions_1d": 58, ...}
```

Sheets成功例：

```
[OK] 2026-04-23 のデータを Google Sheets に書き込みました（行 5）
```

---

## トラブルシュート

| エラー | 対処 |
|---|---|
| `GA4_API:KEY_NOT_FOUND` | 手順5のパスを確認 |
| `GA4_API:LIB_MISSING` | `pip install google-analytics-data` |
| `GA4_API:PROPERTY_ID_UNSET` | 手順7の環境変数を設定し、PowerShellを再起動 |
| `permission denied` (GA4) | 手順6のGA4側での権限付与を再確認 |
| `SHEETS_ID_UNSET` | 手順8-5の環境変数を設定し、PowerShellを再起動 |
| `SHEETS_LIB_MISSING` | `pip install gspread` |
| `SpreadsheetNotFound` | スプレッドシートのIDと共有設定（手順8-4）を再確認 |
| `APIError: 403` | Google Cloud ConsoleでSheets APIが有効か確認（手順2）|

---

## セキュリティメモ

- `ga4-sa.json` は **絶対に Git に push しない**
- 配置場所が `monitoring/` の外（`C:\Users\user\.life-oracle\`）なのは、誤って push されないため
- 漏洩した場合：Google Cloud Console の「キー」タブから該当鍵を削除し、再発行
