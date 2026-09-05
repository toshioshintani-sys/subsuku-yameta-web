# サブスクやめた — 3日ごとの棚卸しランナー（無人実行）
# タスクスケジューラ Subsuku_Triage_1000（3日に1回・10:00 JST）から起動される。
#
# なぜ要るか（2026-09-05）：
#   9/2の点検で見つかった不具合は、どれも状態を見れば分かるものだった
#   （為替が15日据え置き／同じ相場日で違う値のPRが2本／judgeのPRが4本滞留）。
#   Slack には毎日通知が流れていたのに気づけなかったのは、**流れるものは
#   溜まりを可視化しない**から（docs/lessons.md 2026-08-19）。
#   溜まりは静止しているので、定期的に数えに行くしかない。これがその役。
#
# 流れ：
#   1. 機械の点検を先に走らせて、今日の指摘の有無を確定する（LLM不要・確実）
#   2. 指摘があった時だけ claude を起こし、直せるものを直させる
#      （指摘ゼロの日に毎回LLMを起こすのは無駄。3日に1回×指摘ありの日だけ）
#   3. Slack は claude が送る。claude を起こさなかった日は鳴らさない
#
# このファイルは UTF-8 BOM 付きで保存すること。BOM無しで日本語を書くと、
# Task Scheduler が起動する powershell.exe が既定コードページで誤読する。

$ErrorActionPreference = "Stop"
$repoRoot = "C:/Users/user/Desktop/Claude_work/subsukuyametaweb/subsuku-yameta-web"
$promptFile = Join-Path $repoRoot "scripts/ops/triage_prompt.md"
$logDir = Join-Path $repoRoot "scripts/price-watch/logs"
$sender = "C:/Users/user/Desktop/Claude_work/world-oracle-staging/notifications/_shared/slack_sender.py"
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$checkLog = Join-Path $logDir "triage_check_$stamp.txt"
$agentLog = Join-Path $logDir "triage_agent_$stamp.json"

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
    # 1. 機械の点検（LLM不要・ここで指摘の有無が確定する）
    $triageOut = ''
    $triageCode = 0
    Invoke-Utf8 { $script:triageOut = (& node scripts/ops/triage.mjs 2>&1 | Out-String); $script:triageCode = $LASTEXITCODE }

    $seoOut = ''
    $seoCode = 0
    Invoke-Utf8 { $script:seoOut = (& node scripts/seo/seo-health.mjs 2>&1 | Out-String); $script:seoCode = $LASTEXITCODE }

    $combined = "===== ops:triage (exit $triageCode) =====`n$triageOut`n===== seo:health (exit $seoCode) =====`n$seoOut"
    [System.IO.File]::WriteAllText($checkLog, $combined, [System.Text.UTF8Encoding]::new($false))

    if ($triageCode -eq 0 -and $seoCode -eq 0) {
        # 指摘ゼロ。claude を起こさず、Slack も鳴らさない。
        # 毎回鳴ると読み飛ばされ、肝心な日に効かなくなる。
        Write-Output "3日分の棚卸し：指摘なし（claudeもSlackも起こさない）"
        exit 0
    }

    # 2. 指摘あり → claude を起こして直せるものを直させる
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
    [System.IO.File]::WriteAllText($agentLog, ($result | Out-String), [System.Text.UTF8Encoding]::new($false))

    if ($exitCode -ne 0) {
        $raw = ($result | Out-String)
        if ($raw -match 'authentication_error|OAuth access token has expired|Invalid authentication credentials|401') {
            Send-Slack ("サブスクやめた 3日棚卸しが停止：**CLIの認証が失効しています**`n" +
                "点検自体は動いており、指摘が出ています（下記）。直す側だけが止まりました。`n`n" +
                (($triageOut + $seoOut).Trim() -split "`n" | Select-Object -First 12 | Out-String) + "`n" +
                "対処（俊雄さんの操作が必要です）：ターミナルで claude auth login を実行し、ブラウザで承認してください。`n" +
                "ログ: $checkLog")
            exit 1
        }
        # claude が落ちても、点検結果そのものは価値があるので必ず届ける
        Send-Slack ("サブスクやめた 3日棚卸し：**直す側が失敗しました**（exit $exitCode）`n" +
            "点検の指摘は出ています。手で対応してください。`n`n" +
            (($triageOut + $seoOut).Trim() -split "`n" | Select-Object -First 16 | Out-String) + "`n" +
            "ログ: $checkLog / $agentLog")
        exit 1
    }

    Write-Output "3日分の棚卸し完了（点検: triage=$triageCode seo=$seoCode / 詳細は $checkLog）"
} catch {
    Send-Slack "サブスクやめた 3日棚卸しで例外`n$($_.Exception.Message)"
    exit 2
}
