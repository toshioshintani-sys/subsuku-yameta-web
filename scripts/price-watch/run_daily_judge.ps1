# サブスクやめた — 価格検知の判定ランナー（無人実行）
# タスクスケジューラ Subsuku_PriceJudge_0730（毎日7:30 JST）から起動される。
# 7:10 の Subsuku_PriceWatch_0710（巡回・検知）の20分後に走り、検知を公式ページで確かめて
# 本物ならサイトを直し PR まで作る。マージはしない（人のゲートを残す）。2026-07-31 制定。
#
# このファイルは UTF-8 BOM 付きで保存すること。BOM無しで日本語パスを書くと、
# Task Scheduler が起動する powershell.exe が既定コードページで誤読してパスが壊れる。

$ErrorActionPreference = "Stop"
$repoRoot = "C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web"
$promptFile = Join-Path $repoRoot "scripts\price-watch\daily_judge_prompt.md"
$logDir = Join-Path $repoRoot "scripts\price-watch\logs"
$logPath = Join-Path $repoRoot "scripts\price-watch\state\detection_log.json"
$candPath = Join-Path $repoRoot "scripts\price-watch\state\candidates.json"
$sender = "C:\Users\user\Desktop\Claude_work\world-oracle-staging\notifications\_shared\slack_sender.py"
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$logFile = Join-Path $logDir "judge_$stamp.json"

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
Set-Location $repoRoot

function Send-Slack($message) {
    try { & python -X utf8 $sender SUBSUKU_DAILY $message | Out-Null } catch {}
}

try {
    # 起動の判断は「今日の検知があるか」ではなく **「未判定が残っているか」** で行う。
    #
    # 今日の検知の有無で判断すると、次の2つで積み残しが永久に判定されなくなる。
    #   - 7:10 の巡回が長引いて 7:30 に間に合わなかった日（その日の検知が宙に浮く）
    #   - 翌日の検知がゼロだった日（前日の積み残しごとスキップされる）
    # 未判定の残数だけを見れば、いつ溜まったものでも次の実行が必ず拾う（自己修復する）。
    # 同時にこれは冪等ガードにもなる＝手動テストと定時実行が重なっても2回目は走らない。
    $today = Get-Date -Format "yyyy-MM-dd"
    $beforeUnjudged = 0
    $todayEntries = 0
    if (Test-Path $logPath) {
        try {
            $log = Get-Content -Raw -Encoding UTF8 $logPath | ConvertFrom-Json
            $beforeUnjudged = @($log | Where-Object { $null -eq $_.verdict }).Count
            $todayEntries = @($log | Where-Object { $_.date -eq $today }).Count
        } catch {}
    }

    $eventCount = 0
    if (Test-Path $candPath) {
        try {
            $cand = Get-Content -Raw -Encoding UTF8 $candPath | ConvertFrom-Json
            if ($cand.events) { $eventCount = @($cand.events).Count }
        } catch { $eventCount = -1 }
    }

    if ($beforeUnjudged -eq 0) {
        # 検知はあるのに今日の記録が台帳に1件も無い＝巡回側の記録/通知が失敗している。
        # 判定すべきものが本当に無いのか、記録に失敗して見えていないだけなのかは別物なので、
        # 後者は黙って緑にせず知らせる（検知が誰にも見られないまま消えるのを防ぐ）。
        if ($eventCount -gt 0 -and $todayEntries -eq 0) {
            Send-Slack "サブスクやめた 価格判定（無人）を中止`n検知 $eventCount 件があるのに、台帳に今日($today)の記録が1件もありません。7:10 の巡回が終わっていないか、記録に失敗した可能性があります。"
            exit 1
        }
        Write-Output "未判定ゼロのため判定はスキップ（検知 $eventCount 件・すべて判定済み）"
        exit 0
    }

    $prompt = Get-Content -Raw -Encoding UTF8 $promptFile
    $claudeBin = (Get-Command claude -ErrorAction Stop).Source

    # サブスク課金の保証：環境に ANTHROPIC_API_KEY が居ると claude -p が API 課金に化ける
    Remove-Item Env:\ANTHROPIC_API_KEY -ErrorAction SilentlyContinue

    $result = & $claudeBin -p --permission-mode bypassPermissions --model claude-sonnet-5 --output-format json $prompt 2>&1
    $exitCode = $LASTEXITCODE
    $result | Out-File -FilePath $logFile -Encoding utf8

    if ($exitCode -ne 0) {
        # 失敗の中身を見て、**何をすればいいか**まで書く。
        #
        # 2026-07-14 にCLIの認証が失効し、7/20・7/27 の委員会と 7/31 の価格判定が全滅した。
        # 通知は出ていたのに「exit code 1」としか書いておらず、2週間気づかれなかった。
        # 原因の種類まで通知が言えば、受け取った人がその場で動ける。
        $raw = ($result | Out-String)
        if ($raw -match 'authentication_error|OAuth access token has expired|Invalid authentication credentials|401') {
            Send-Slack ("サブスクやめた 価格判定（無人）が停止：**CLIの認証が失効しています**`n" +
                "検知 $eventCount 件は未判定のまま残っています。`n`n" +
                "対処（俊雄さんの操作が必要です）：ターミナルで claude auth login を実行し、" +
                "ブラウザで承認してください。`n" +
                "毎回切れるのを止めたい場合は claude setup-token で長期トークンに切り替えられます" +
                "（無人実行用・Claudeサブスクが必要）。`n`n" +
                "※ claude auth status は「ログイン済み」と出ますが、保存済みトークンが失効していると" +
                "リクエスト時に401になります。status だけでは判定できません。`n" +
                "※ 同じ認証を使うライフオラクル週次委員会も同時に止まります。`n" +
                "ログ: $logFile")
            exit 1
        }
        Send-Slack "サブスクやめた 価格判定（無人）が失敗`nclaude -p が exit code $exitCode で終了。検知 $eventCount 件は未判定のまま残っています。`nログ: $logFile"
        exit 1
    }

    # 走ったのに未判定が減っていない＝実質何もしていない。静かに緑にしない。
    $afterUnjudged = 0
    if (Test-Path $logPath) {
        try {
            $log2 = Get-Content -Raw -Encoding UTF8 $logPath | ConvertFrom-Json
            $afterUnjudged = @($log2 | Where-Object { $null -eq $_.verdict }).Count
        } catch {}
    }
    if ($afterUnjudged -ge $beforeUnjudged -and $beforeUnjudged -gt 0) {
        Send-Slack "サブスクやめた 価格判定（無人）が空振り`nexit 0 で終わったのに未判定が $beforeUnjudged 件から減っていません。`nログ: $logFile"
        exit 1
    }

    Write-Output "判定完了（検知 $eventCount 件・未判定 $beforeUnjudged → $afterUnjudged）"
} catch {
    Send-Slack "サブスクやめた 価格判定（無人）で例外`n$($_.Exception.Message)"
    exit 1
}
