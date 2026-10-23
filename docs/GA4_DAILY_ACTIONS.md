# GA4 の毎朝の数値通知をクラウドへ移す（2026-10-17 設計・2026-10-24 クラウドの当番に変更）

PC のタスク `WorldOracle_subsuku_yameta_daily_report`（毎朝 6:35・world-oracle-staging の `send_subsuku_daily.py`）を、
PC が止まっていても動くように、**claude.ai のクラウドの朝 7:47 の当番**（`scripts/ops/cloud/price.md` 手順6）へ移す。

## 経緯
- 2026-10-17：GitHub Actions（`.github/workflows/ga4-daily.yml`）で作った。
- 2026-10-24：GitHub の定時実行が毎日 **2〜3時間遅れていた**（6:35 の設定で、実際は 8:35〜9:35 ごろ）と分かり、クラウドの当番に移すことにした。ワークフローは止めた（`disabled_manually`・ファイルは残してある）。

## 中身
- 送るものは PC 版と同じ：前日のアクティブユーザー・セッション・平均エンゲージ・流入元 TOP5 → `#6-subsuku-daily`。届くのは **7:50 ごろ**。
- 当番が `python3 monitoring/scripts/send_ga4_daily_slack.py --text` で文面を作り、Slack のツールで送る。
- 切り替え：`scripts/ops/cloud_jobs.json` の `"ga4_daily": true`。環境変数 `GA4_CREDENTIALS_JSON` が入るまでは何もしない（PC の通知がまだ動いている）。
- 数字は git にも docs にも書かない（公開リポジトリ）。

## 俊雄さんの操作

**1. 鍵をクリップボードに写す**（PC の PowerShell・画面には出ない。権限は GA4 を読むだけ＝`analytics.readonly`）

```powershell
Get-Content "C:\Users\user\Desktop\Claude_work\monitoring\config\adc.json" -Raw | Set-Clipboard
```

**2. クラウドの環境に入れる**：claude.ai の Claude Code（クラウド）で、運用当番が使っている環境の設定を開き、環境変数に
- 名前：`GA4_CREDENTIALS_JSON`
- 値：手順1で写したもの（貼り付けるだけ）

を足して保存する。

**3. 翌朝 7:50 ごろ**、`#6-subsuku-daily` に「🟦 サブスクやめた日次」が2本届く（PC の 6:35 と、クラウドの 7:50）。

**4. クラウドから届いたのを見たら、PC のタスクを止める**（二重に届かないように。削除ではないので戻せる）

```powershell
Disable-ScheduledTask -TaskName "WorldOracle_subsuku_yameta_daily_report"
```

## 鍵が切れたとき
- 「⚠️ サブスクやめた日次 取得失敗」が届く。
- PC で `python -X utf8 C:\Users\user\Desktop\Claude_work\monitoring\scripts\reauth_ga4.py` を実行して鍵を作り直し、手順1・2をもう一度。
- 長持ちさせたいなら、サービスアカウント（`life-oracle-ga4@gen-lang-client-0791471309.iam.gserviceaccount.com`）を GA4 のプロパティ 538470329 に「閲覧者」で追加し、その鍵を `GA4_CREDENTIALS_JSON` に入れる（道具は両方の形に対応済み）。
