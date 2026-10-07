// サブスクやめた — 週次レビューランナー（無人実行・Node版）
// タスクスケジューラ Subsuku_WeeklyReview_Mon1200（毎週月曜 12:00 JST）から node.exe で直接起動される。
// 旧 run_weekly_review.ps1 の完全移植（PowerShell が固まる不具合のため・lib.mjs 冒頭参照）。
//
// 3日棚卸しは指摘ゼロの日は無言なので、「週次で確認した」という定期チェックポイントが無かった。
// この週次レビューは、指摘の有無にかかわらず claude が必ず Slack へ1本報告する（プロンプト参照）。

import path from 'node:path';
import {
  ROOT, LOG_DIR, ensureDirs, today, stamp, exists, readText, writeText, log, sendSlack, ensureMain, runClaude, isAuthError,
} from './lib.mjs';

process.chdir(ROOT);
ensureDirs();
const logFile = path.join(LOG_DIR, `weekly_${stamp()}.json`);
const marker = path.join(LOG_DIR, `weeklytask_${today()}.txt`);
const finish = (c) => { process.exitCode = c; };

try {
  if (exists(marker)) {
    log('本日は実行済みのためスキップ');
    process.exit(0);
  }
  const em = ensureMain();
  if (!em.ok) {
    sendSlack(`サブスクやめた 週次レビューを停止：${em.reason}`);
    process.exit(1);
  }
  const res = runClaude(readText(path.join(ROOT, 'scripts/ops/weekly_review_prompt.md')), { timeoutMs: 100 * 60 * 1000 });
  writeText(logFile, res.raw);
  writeText(marker, today());
  if (res.code !== 0) {
    sendSlack(isAuthError(res.raw)
      ? `サブスクやめた 週次レビューが停止：**CLIの認証が失効しています**\n長期トークン（ユーザー環境変数 CLAUDE_CODE_OAUTH_TOKEN）の期限切れの可能性があります。claude setup-token で再発行し、環境変数を更新してください。\nログ: ${logFile}`
      : `サブスクやめた 週次レビューが失敗\nclaude -p が exit code ${res.code} で終了。週次の確認・報告ができていません。\nログ: ${logFile}`);
    finish(1);
  } else {
    log(`週次レビュー完了（詳細は ${logFile}）`);
    finish(0);
  }
} catch (e) {
  sendSlack(`サブスクやめた 週次レビューで例外\n${e && e.message}`);
  finish(2);
}
