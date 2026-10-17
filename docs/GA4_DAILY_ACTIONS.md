# GA4 の毎朝の数値通知を GitHub Actions へ移す（2026-10-17）

PC のタスク `WorldOracle_subsuku_yameta_daily_report`（毎朝 6:35・world-oracle-staging の `send_subsuku_daily.py`）を、
PC が止まっていても動くように GitHub Actions（`.github/workflows/ga4-daily.yml`）へ移す。

## なぜ claude.ai のクラウドの当番ではなく GitHub Actions か
- GA4 から数字を取るには鍵が要る。クラウドの当番は秘密の値を持たない作り（`scripts/ops/cloud/COMMON.md`）。
- GitHub Actions は秘密を安全に預かれて、毎日決まった時刻に動き、失敗すると持ち主にメールが届く（heartbeat と同じ仕組み）。

## 中身
- 送るものは PC 版と同じ：前日のアクティブユーザー・セッション・平均エンゲージ・流入元 TOP5 → `#6-subsuku-daily`。
- 道具：`monitoring/scripts/send_ga4_daily_slack.py`（GA4 の取得は `monitoring/scripts/collect_ga4.py`・プロパティ 538470329）。
- 🛑 **このリポジトリは公開で、Actions のログは誰でも読める。**数字・流入元はログに出さず、Slack にだけ送る。
- 秘密が未登録のあいだは、何もせず成功で終わる（PC の通知がまだ動いているので途切れない）。

## 俊雄さんの操作（PC の PowerShell・鍵の値は画面に出ない）

**1. GA4 の鍵を登録**（今 PC で使っている鍵。権限は GA4 を読むだけ＝`analytics.readonly`）

```powershell
Get-Content "C:\Users\user\Desktop\Claude_work\monitoring\config\adc.json" -Raw | gh secret set GA4_CREDENTIALS_JSON --repo toshioshintani-sys/subsuku-yameta-web
```

**2. Slack の送り先を登録**（world-oracle-staging の .env に入っている #6-subsuku-daily の Webhook）

```powershell
(Select-String -Path "C:\Users\user\Desktop\Claude_work\world-oracle-staging\.env" -Pattern '^SLACK_WEBHOOK_SUBSUKU_DAILY=').Line.Split('=',2)[1].Trim() | gh secret set SLACK_WEBHOOK_SUBSUKU_DAILY --repo toshioshintani-sys/subsuku-yameta-web
```

**3. 試しに1回動かす** → `#6-subsuku-daily` に「🟦 サブスクやめた日次」が届けば成功（PC の通知と同じ日の数字が2本並ぶ）

```powershell
gh workflow run ga4-daily.yml --repo toshioshintani-sys/subsuku-yameta-web
```

**4. 届いたら、PC のタスクを止める**（二重に届かないように。削除ではないので戻せる）

```powershell
Disable-ScheduledTask -TaskName "WorldOracle_subsuku_yameta_daily_report"
```

戻すとき：`Enable-ScheduledTask -TaskName "WorldOracle_subsuku_yameta_daily_report"`

## 鍵が切れたとき
- Slack に「⚠️ サブスクやめた日次 取得失敗」が届き、GitHub からも失敗のメールが届く。
- PC で `python -X utf8 C:\Users\user\Desktop\Claude_work\monitoring\scripts\reauth_ga4.py` を実行して鍵を作り直し、手順1をもう一度。
- もっと長持ちさせたいなら、サービスアカウント（`life-oracle-ga4@gen-lang-client-0791471309.iam.gserviceaccount.com`）を GA4 のプロパティ 538470329 に「閲覧者」で追加し、その鍵を `GA4_CREDENTIALS_JSON` に登録する（道具は両方の形に対応済み）。このサービスアカウントは、2026-06-19 の調べでは GA4 の権限が付いていなかった。

## 補足
- GitHub の定時実行は混雑で数分〜数十分遅れることがある。
- この通知は毎日の定例報告。クラウドの当番の「意味のない毎日の報告は送らない」（COMMON.md）とは別の、俊雄さんが続けると決めている通知。
