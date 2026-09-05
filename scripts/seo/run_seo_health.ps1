# サブスクやめた — SEO健全性チェック ランナー（無人実行）
# タスクスケジューラ Subsuku_SeoHealth_1000（3日に1回・10:00 JST）から起動される。
#
# なぜ要るか（2026-09-02）：
#   Bing Webmaster Tools が「meta descriptionが短い15ページ／タイトルが短い10ページ」を
#   指摘していたが、気づいたのは俊雄さんが管理画面を開いたからだった。
#   Bing/GSC の管理画面はログインが要るので、無人タスクからは読めない
#   （このマシンには MCP サーバの設定が無く、headless の claude -p から Chrome を操作できない）。
#   だが**指摘の中身の大半はサイト側だけで測れる**。ログイン不要で測れるものは機械が測り、
#   劣化した時だけ知らせる。管理画面を見に行く動機を機械が作る、という位置づけ。
#
# 動作：
#   問題ゼロなら Slack を鳴らさない（毎回鳴ると読み飛ばされる）。
#   問題があった時だけ、件数と先頭の指摘を Slack に出す。
#   スクリプトが異常終了した時（exit 2）は、それ自体を知らせる。
#
# このファイルは UTF-8 BOM 付きで保存すること。BOM無しで日本語を書くと、
# Task Scheduler が起動する powershell.exe が既定コードページで誤読する。

$ErrorActionPreference = "Stop"
$repoRoot = "C:/Users/user/Desktop/Claude_work/subsukuyametaweb/subsuku-yameta-web"
$logDir = Join-Path $repoRoot "scripts/price-watch/logs"
$sender = "C:/Users/user/Desktop/Claude_work/world-oracle-staging/notifications/_shared/slack_sender.py"
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$logFile = Join-Path $logDir "seohealth_$stamp.txt"

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
Set-Location $repoRoot

function Send-Slack($message) {
    try { & python -X utf8 $sender SUBSUKU_DAILY $message | Out-Null } catch {}
}

try {
    # node の出力は UTF-8 だが、Task Scheduler が起動するクラシック PowerShell は
    # 既定のコンソール符号化(CP932)で読むため日本語が化ける。入出力とも UTF-8 に固定する。
    $prevOut = [Console]::OutputEncoding
    $prevOutputEncoding = $OutputEncoding
    try {
        [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        $out = & node scripts/seo/seo-health.mjs 2>&1 | Out-String
        $code = $LASTEXITCODE
    } finally {
        [Console]::OutputEncoding = $prevOut
        $OutputEncoding = $prevOutputEncoding
    }
    [System.IO.File]::WriteAllText($logFile, $out, [System.Text.UTF8Encoding]::new($false))

    if ($code -eq 0) {
        Write-Output "SEO健全性チェック：問題なし（Slackは鳴らさない）"
        exit 0
    }

    if ($code -eq 2) {
        Send-Slack ("サブスクやめた SEO健全性チェックが異常終了しました`n" +
            "サイトが落ちているか、sitemap が引けない可能性があります。`n`n" +
            ($out.Trim() -split "`n" | Select-Object -First 6 | Out-String) +
            "`nログ: $logFile")
        exit 2
    }

    # exit 1 = 指摘あり。先頭だけ出す（全部貼るとSlackが読めなくなる）。
    $head = ($out.Trim() -split "`n" | Select-Object -First 20) -join "`n"
    Send-Slack ("サブスクやめた SEO健全性チェックで指摘が出ました（3日に1回の定期実行）`n`n" +
        $head + "`n`n" +
        "全文: $logFile`n" +
        "Bing の管理画面も見る価値があります: https://www.bing.com/webmasters/home?siteUrl=https://sabusuku-yameta.com/")
    exit 1
} catch {
    Send-Slack "サブスクやめた SEO健全性チェックで例外`n$($_.Exception.Message)"
    exit 2
}
