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
    # 検知がゼロなら claude を起動しない（無駄なトークンを使わない）
    $eventCount = 0
    if (Test-Path $candPath) {
        try {
            $cand = Get-Content -Raw -Encoding UTF8 $candPath | ConvertFrom-Json
            if ($cand.events) { $eventCount = @($cand.events).Count }
        } catch { $eventCount = -1 }
    }
    if ($eventCount -eq 0) {
        Write-Output "検知ゼロのため判定はスキップ"
        exit 0
    }

    # 判定前の未判定件数を数えておく（罠4：成果ゼロでも exit 0 で緑になる事故の検出用）
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

    # 検知はあるのに今日の記録が台帳に1件も無い＝7:10 の巡回で通知/記録が失敗している。
    # ここで黙って終わると、検知が誰にも見られないまま消える。
    if ($todayEntries -eq 0) {
        Send-Slack "サブスクやめた 価格判定（無人）を中止`n検知 $eventCount 件があるのに、台帳に今日($today)の記録が1件もありません。7:10 の巡回側で記録に失敗した可能性があります。"
        exit 1
    }

    # 未判定がゼロ＝すでに判定済み。二重起動（手動テストと定時実行が重なる等）で
    # 同じ検知をもう一度 claude に投げないための冪等ガード。
    if ($beforeUnjudged -eq 0) {
        Write-Output "未判定ゼロのため判定はスキップ（すでに判定済み）"
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
