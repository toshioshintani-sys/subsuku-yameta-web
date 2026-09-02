# サブスクやめた — 為替レート更新ランナー（無人実行）
# タスクスケジューラ Subsuku_FxUpdate_1100（毎月1日・15日 11:00 JST）から起動される。
#
# なぜ専用タスクにするか（2026-09-02）：
#   為替は毎朝の判定(§4.5)でも更新できるが、判定は7:30起動で公表仲値の発表(午前10時頃)より
#   早く、未公表＝前営業日の値を掴んでいた。実際 AS_OF 9/1 を名乗るPRが 159.80 と 159.70 の
#   二通りできた。加えて判定は「検知があった日」に動くので、為替の更新時期と噛み合わない。
#   結果、レートは 8/18 のまま15日間据え置かれ、ドル建て8サービスの円換算がずれ続けた。
#   区切り(1日・15日)の公表後に、為替だけを見る専用タスクを置く。
#
# このファイルは UTF-8 BOM 付きで保存すること。BOM無しで日本語を書くと、
# Task Scheduler が起動する powershell.exe が既定コードページで誤読する。

$ErrorActionPreference = "Stop"
$repoRoot = "C:/Users/user/Desktop/Claude_work/subsukuyametaweb/subsuku-yameta-web"
$promptFile = Join-Path $repoRoot "scripts/price-watch/fx_update_prompt.md"
$logDir = Join-Path $repoRoot "scripts/price-watch/logs"
$sender = "C:/Users/user/Desktop/Claude_work/world-oracle-staging/notifications/_shared/slack_sender.py"
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$logFile = Join-Path $logDir "fx_$stamp.json"

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
Set-Location $repoRoot

function Send-Slack($message) {
    try { & python -X utf8 $sender SUBSUKU_DAILY $message | Out-Null } catch {}
}

try {
    # 公表仲値の発表は午前10時頃。11:00起動なので通常は問題ないが、遅延起動
    # （スリープ復帰など）に備えて10:30より前なら何もしない。
    # 未公表の時刻に取ると前営業日の値を掴み、同じ相場日に別の値が入る原因になる。
    if ((Get-Date).TimeOfDay -lt [timespan]'10:30:00') {
        Write-Output "10:30より前のため為替更新はしない（公表前の値を掴まないため）"
        exit 0
    }

    # 同じ日に二重で走らせない（手動テストと定時実行が重なった時の冪等ガード）
    $today = Get-Date -Format "yyyy-MM-dd"
    $marker = Join-Path $logDir ("fxtask_" + $today + ".txt")
    if (Test-Path $marker) {
        Write-Output "本日は実行済みのためスキップ"
        exit 0
    }

    # 実行前の main の位置を控える。このタスクは PR までで main を触らない約束なので、
    # main が動いていたら約束破りとして知らせる。
    $shaBefore = (& git rev-parse HEAD 2>$null)

    $prompt = Get-Content -Raw -Encoding UTF8 $promptFile
    $claudeBin = (Get-Command claude -ErrorAction Stop).Source

    # サブスク課金の保証：環境に ANTHROPIC_API_KEY が居ると claude -p が API 課金に化ける
    Remove-Item Env:\ANTHROPIC_API_KEY -ErrorAction SilentlyContinue

    # claude の出力は UTF-8 だが、Task Scheduler が起動するクラシック PowerShell は
    # 既定のコンソール符号化(CP932)で読むため日本語が化ける。入出力とも UTF-8 に固定する。
    $prevOut = [Console]::OutputEncoding
    $prevOutputEncoding = $OutputEncoding
    try {
        [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        $result = & $claudeBin -p --permission-mode bypassPermissions --model claude-sonnet-5 --output-format json $prompt 2>&1
        $exitCode = $LASTEXITCODE
    } finally {
        [Console]::OutputEncoding = $prevOut
        $OutputEncoding = $prevOutputEncoding
    }
    [System.IO.File]::WriteAllText($logFile, ($result | Out-String), [System.Text.UTF8Encoding]::new($false))
    Set-Content -Path $marker -Value $today -Encoding UTF8

    if ($exitCode -ne 0) {
        $raw = ($result | Out-String)
        if ($raw -match 'authentication_error|OAuth access token has expired|Invalid authentication credentials|401') {
            Send-Slack ("サブスクやめた 為替更新（無人）が停止：**CLIの認証が失効しています**`n" +
                "対処（俊雄さんの操作が必要です）：ターミナルで claude auth login を実行し、ブラウザで承認してください。`n" +
                "毎回切れるのを止めたい場合は claude setup-token で長期トークンに切り替えられます。`n" +
                "※ claude auth status は「ログイン済み」と出ますが、保存済みトークンが失効していると401になります。`n" +
                "ログ: $logFile")
            exit 1
        }
        Send-Slack "サブスクやめた 為替更新（無人）が失敗`nclaude -p が exit code $exitCode で終了。レートは更新されていません。`nログ: $logFile"
        exit 1
    }

    # 約束どおり main を触っていないか検算する。
    # このタスクは PR を作るまでが仕事で、main へ直接 push はしない。
    $shaAfter = (& git rev-parse HEAD 2>$null)
    if ($shaBefore -and $shaAfter -and $shaBefore -ne $shaAfter) {
        $touched = @(& git diff --name-only $shaBefore $shaAfter 2>$null)
        Send-Slack ("サブスクやめた 為替更新（無人）が **main を直接変更しました**`n" +
            "このタスクは PR までで main を触らない約束です。`n`n" +
            "変わったファイル: " + ($touched -join ', ') + "`n" +
            "コミット: $shaBefore -> $shaAfter`n" +
            "ログ: $logFile")
        exit 1
    }

    Write-Output "為替更新タスク完了（詳細は $logFile）"
} catch {
    Send-Slack "サブスクやめた 為替更新（無人）で例外`n$($_.Exception.Message)"
    exit 1
}
