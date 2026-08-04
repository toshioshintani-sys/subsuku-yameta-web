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

    # 為替の更新が滞っていないか（2026-08-03 追加）。
    #
    # 為替更新の手順はプロンプト §4.5 にあるが、それは claude を起動して初めて実行される。
    # 起動条件が「未判定が残っているか」だけだと、**検知がない日・すでに判定済みの日は
    # 為替チェックそのものが走らない**。前日 7:30 に判定を終えていれば、その後の再試行は
    # すべて未判定ゼロで降りるので、結果として為替は永久に更新されなかった。
    #
    # さらに公表仲値の公表は午前10時頃なので、7:30 の実行では月曜でも前営業日しか出ていない。
    # ＝為替を取りに行くべき時刻は 7:30 ではなく、10時を過ぎてからの再試行のとき。
    #
    # そこで「保存レートが直近の区切り(1日/15日)より古い」かつ「10:30 以降」なら、
    # 未判定がゼロでも claude を起動する。ただし空振りで毎回起動しないよう1日1回に絞る。
    $fxStale = $false
    try {
        $svc = Get-Content -Raw -Encoding UTF8 (Join-Path $repoRoot 'src\data\services.js')
        if ($svc -match "USD_JPY_AS_OF\s*=\s*'(\d{4}-\d{2}-\d{2})'") {
            $asOf = [datetime]::ParseExact($Matches[1], 'yyyy-MM-dd', $null)
            $now = Get-Date
            # 直近に過ぎた 1日 / 15日
            $boundary = if ($now.Day -ge 15) { Get-Date -Year $now.Year -Month $now.Month -Day 15 }
                        else { Get-Date -Year $now.Year -Month $now.Month -Day 1 }
            $fxStale = $asOf.Date -lt $boundary.Date
        }
    } catch {}
    $fxMarker = Join-Path $logDir ("fx_attempt_" + $today + ".txt")
    $fxDue = $fxStale -and ((Get-Date).TimeOfDay -ge [timespan]'10:30:00') -and -not (Test-Path $fxMarker)

    if ($beforeUnjudged -eq 0 -and -not $fxDue) {
        # 検知はあるのに今日の記録が台帳に1件も無い＝巡回側の記録/通知が失敗している。
        # 判定すべきものが本当に無いのか、記録に失敗して見えていないだけなのかは別物なので、
        # 後者は黙って緑にせず知らせる（検知が誰にも見られないまま消えるのを防ぐ）。
        if ($eventCount -gt 0 -and $todayEntries -eq 0) {
            Send-Slack "サブスクやめた 価格判定（無人）を中止`n検知 $eventCount 件があるのに、台帳に今日($today)の記録が1件もありません。7:10 の巡回が終わっていないか、記録に失敗した可能性があります。"
            exit 1
        }
        Write-Output "未判定ゼロ・為替も最新のため判定はスキップ（検知 $eventCount 件）"
        exit 0
    }
    if ($fxDue) {
        # 起動理由が為替だけの回もあるので、記録を残しておく（同日の再起動を防ぐ）
        Set-Content -Path $fxMarker -Value $today -Encoding UTF8
        Write-Output "為替が区切りより古いため起動（未判定 $beforeUnjudged 件）"
    }

    # 実行前の main の位置を控える（2026-08-05 追加）。
    # 全件偽陽性の日は無人実行が main へ直接 push してよい運用にしたので、
    # **機械が main に何を入れたか**を実行後に機械で検算する。
    # 許してよいのは台帳と巡回状態だけで、src/ に手が入っていたらルール違反。
    $shaBefore = (& git rev-parse HEAD 2>$null)

    $prompt = Get-Content -Raw -Encoding UTF8 $promptFile
    $claudeBin = (Get-Command claude -ErrorAction Stop).Source

    # サブスク課金の保証：環境に ANTHROPIC_API_KEY が居ると claude -p が API 課金に化ける
    Remove-Item Env:\ANTHROPIC_API_KEY -ErrorAction SilentlyContinue

    # claude の標準出力はUTF-8だが、Task Scheduler が起動するクラシック PowerShell は
    # 既定のコンソール符号化（日本語環境では CP932）で読むため、日本語が文字化けする。
    # 2026-08-02 のログが「## 螳御ｺ・ｱ蜻・」のように壊れていた。
    # 読めないログは、無人実行で何が起きたかを後から追えなくする＝失敗の診断が効かなくなる。
    # 入出力とも UTF-8 に固定してから呼ぶ。
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
    # -Encoding utf8 は Windows PowerShell 5.1 だと BOM 付きになるので、BOMなしで書く
    [System.IO.File]::WriteAllText($logFile, ($result | Out-String), [System.Text.UTF8Encoding]::new($false))

    if ($exitCode -ne 0) {
        # 失敗の中身を見て、**何をすればいいか**まで書く。
        #
        # 2026-07-14 にCLIの認証が失効し、7/20・7/27 の委員会と 7/31 の価格判定が全滅した。
        # 通知は出ていたのに「exit code 1」としか書いておらず、2週間気づかれなかった。
        # 原因の種類まで通知が言えば、受け取った人がその場で動ける。
        $raw = ($result | Out-String)
        if ($raw -match 'authentication_error|OAuth access token has expired|Invalid authentication credentials|401') {
            # 認証切れは「直るまで毎回同じ状態」なので、通知は1日1回に絞る。
            # 2026-08-01 にスリープ対策で4時間ごとの再試行を入れたため、これが無いと
            # 認証が切れている間ずっと同じ通知が1日4回届き、肝心な時に読み飛ばされる。
            # （2週間気づかれなかった原因が「通知が読まれなかったこと」なので、量を増やさない）
            $marker = Join-Path $logDir ("auth_alert_" + $today + ".txt")
            if (Test-Path $marker) {
                Write-Output "認証エラー（本日通知済みのためSlackは送らない）"
                exit 1
            }
            Set-Content -Path $marker -Value $today -Encoding UTF8
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

    # main に何を入れたかを検算する（2026-08-05 追加）。
    #
    # 全件偽陽性の日は無人実行が main へ直接 push してよい運用にした。表示が変わらない日に
    # PR を積み上げても、マージ作業が日課になるだけで誰の役にも立たないため（実際 8/5 に
    # 2日分が溜まった）。ただし **機械が main を触れる経路を作った以上、触った範囲は
    # 機械で確かめる**。許すのは台帳と巡回状態だけ。src/ に手が入っていたらルール違反で、
    # 表示価格が人の目を通らずに公開された可能性がある＝すぐ知らせる。
    $shaAfter = (& git rev-parse HEAD 2>$null)
    if ($shaBefore -and $shaAfter -and $shaBefore -ne $shaAfter) {
        $touched = @(& git diff --name-only $shaBefore $shaAfter 2>$null)
        $allowed = @('scripts/price-watch/state/', 'scripts/price-watch/watch-list.json')
        $violations = @($touched | Where-Object {
            $p = $_
            -not ($allowed | Where-Object { $p.StartsWith($_) })
        })
        if ($violations.Count -gt 0) {
            Send-Slack ("サブスクやめた 価格判定（無人）が**許可外のファイルを main に入れました**`n" +
                "全件偽陽性の日だけ直接pushしてよい運用ですが、その日は台帳と巡回状態しか" +
                "変えないはずです。`n`n" +
                "許可外: " + ($violations -join ', ') + "`n" +
                "コミット: $shaBefore → $shaAfter`n" +
                "表示価格が人の目を通らずに公開された可能性があります。差分を確認してください。`n" +
                "ログ: $logFile")
            exit 1
        }
        Write-Output "main に直接入れた変更: $($touched -join ', ')"
    }

    Write-Output "判定完了（検知 $eventCount 件・未判定 $beforeUnjudged → $afterUnjudged）"
} catch {
    Send-Slack "サブスクやめた 価格判定（無人）で例外`n$($_.Exception.Message)"
    exit 1
}
