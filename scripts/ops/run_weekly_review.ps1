# サブスクやめた — 週次レビューランナー（無人実行）
# タスクスケジューラ Subsuku_WeeklyReview_Mon1200（毎週月曜 12:00 JST）から起動される。
#
# なぜ要るか（2026-09-23）：
#   Subsuku_Triage_1000（3日ごと）は指摘ゼロの日は無言で終わるため、「本当に週次で
#   確認されている」という定期チェックポイントが無かった。また Slack 本体は送信専用
#   （webhook・読み返しAPI無し）なので、「1週間分のSlack通知を読む」という依頼は文字通り
#   には実行できない。代わりに、その通知の元になったローカルの状態を7日分まとめて見て、
#   直せるものは直してデプロイまで済ませ、指摘の有無にかかわらず必ずSlackへ1本報告する
#   （詳細は weekly_prompt.md 内の前提を参照）。
#
# このファイルは UTF-8 BOM 付きで保存すること。BOM無しで日本語を書くと、
# Task Scheduler が起動する powershell.exe が既定コードページで誤読する。

$ErrorActionPreference = "Stop"
$repoRoot = "C:/Users/user/Desktop/Claude_work/subsukuyametaweb/subsuku-yameta-web"
$promptFile = Join-Path $repoRoot "scripts/ops/weekly_review_prompt.md"
$logDir = Join-Path $repoRoot "scripts/price-watch/logs"
$sender = "C:/Users/user/Desktop/Claude_work/world-oracle-staging/notifications/_shared/slack_sender.py"
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$logFile = Join-Path $logDir "weekly_$stamp.json"

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
Set-Location $repoRoot

function Send-Slack($message) {
    try { & python -X utf8 $sender SUBSUKU_DAILY $message | Out-Null } catch {}
}

# node / claude の出力は UTF-8 だが、Task Scheduler が起動するクラシック PowerShell は
# 既定のコンソール符号化(CP932)で読むため日本語が化ける。入出力とも UTF-8 に固定する。
function Invoke-Utf8($block) {
    $prevOut = [Console]::OutputEncoding
    $prevOutputEncoding = $OutputEncoding
    try {
        [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        & $block
    } finally {
        [Console]::OutputEncoding = $prevOut
        $OutputEncoding = $prevOutputEncoding
    }
}

try {
    # 同じ日に二重で走らせない（手動テストと定時実行が重なった時の冪等ガード）
    $today = Get-Date -Format "yyyy-MM-dd"
    $marker = Join-Path $logDir ("weeklytask_" + $today + ".txt")
    if (Test-Path $marker) {
        Write-Output "本日は実行済みのためスキップ"
        exit 0
    }

    $prompt = Get-Content -Raw -Encoding UTF8 $promptFile
    $claudeBin = (Get-Command claude -ErrorAction Stop).Source

    # サブスク課金の保証：環境に ANTHROPIC_API_KEY が居ると claude -p が API 課金に化ける
    Remove-Item Env:\ANTHROPIC_API_KEY -ErrorAction SilentlyContinue

    $result = ''
    $exitCode = 0
    Invoke-Utf8 {
        $script:result = & $claudeBin -p --permission-mode bypassPermissions --model claude-sonnet-5 --output-format json $prompt 2>&1
        $script:exitCode = $LASTEXITCODE
    }
    [System.IO.File]::WriteAllText($logFile, ($result | Out-String), [System.Text.UTF8Encoding]::new($false))
    Set-Content -Path $marker -Value $today -Encoding UTF8

    if ($exitCode -ne 0) {
        $raw = ($result | Out-String)
        if ($raw -match 'authentication_error|OAuth access token has expired|Invalid authentication credentials|401') {
            Send-Slack ("サブスクやめた 週次レビューが停止：**CLIの認証が失効しています**`n" +
                "対処（俊雄さんの操作が必要です）：ターミナルで claude auth login を実行し、ブラウザで承認してください。`n" +
                "毎回切れるのを止めたい場合は claude setup-token で長期トークンに切り替えられます。`n" +
                "ログ: $logFile")
            exit 1
        }
        Send-Slack "サブスクやめた 週次レビューが失敗`nclaude -p が exit code $exitCode で終了。週次の確認・報告ができていません。`nログ: $logFile"
        exit 1
    }

    Write-Output "週次レビュー完了（詳細は $logFile）"
} catch {
    Send-Slack "サブスクやめた 週次レビューで例外`n$($_.Exception.Message)"
    exit 2
}
