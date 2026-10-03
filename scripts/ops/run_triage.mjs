// サブスクやめた — 3日ごとの棚卸しランナー（無人実行・Node版）
// タスクスケジューラ Subsuku_Triage_1000（3日に1回・10:00 JST）から node.exe で直接起動される。
// 旧 run_triage.ps1 の完全移植（PowerShell が固まる不具合のため・lib.mjs 冒頭参照）。
//
// 流れ：①機械の点検を先に走らせて指摘の有無を確定（LLM不要）②指摘があった時だけ claude を起こして
// 直せるものを直させる ③指摘ゼロの日は claude もSlackも起こさない（毎回鳴ると肝心な日に効かなくなる）。

import path from 'node:path';
import {
  ROOT, LOG_DIR, ensureDirs, stamp, readText, writeText, log, sendSlack, runNode, ensureMain, runClaude, isAuthError,
} from './lib.mjs';

process.chdir(ROOT);
ensureDirs();
const s = stamp();
const checkLog = path.join(LOG_DIR, `triage_check_${s}.txt`);
const agentLog = path.join(LOG_DIR, `triage_agent_${s}.json`);
const finish = (c) => { process.exitCode = c; };

try {
  const em = ensureMain();
  if (!em.ok) {
    sendSlack(`サブスクやめた 3日棚卸しを停止：${em.reason}`);
    process.exit(1);
  }

  const tri = runNode(['scripts/ops/triage.mjs']);
  const seo = runNode(['scripts/seo/seo-health.mjs']);
  const combined = `===== ops:triage (exit ${tri.code}) =====\n${tri.out}\n===== seo:health (exit ${seo.code}) =====\n${seo.out}`;
  writeText(checkLog, combined);

  if (tri.code === 0 && seo.code === 0) {
    log('3日分の棚卸し：指摘なし（claudeもSlackも起こさない）');
    finish(0);
  } else {
    const res = runClaude(readText(path.join(ROOT, 'scripts/ops/triage_prompt.md')));
    writeText(agentLog, res.raw);
    const head = (tri.out + seo.out).trim().split('\n').slice(0, 14).join('\n');
    if (res.code !== 0) {
      if (isAuthError(res.raw)) {
        sendSlack('サブスクやめた 3日棚卸しが停止：**CLIの認証が失効しています**\n点検自体は動いており、指摘が出ています（下記）。直す側だけが止まりました。\n\n' +
          head + '\n対処（俊雄さんの操作が必要です）：ターミナルで claude auth login を実行し、ブラウザで承認してください。\n' + `ログ: ${checkLog}`);
      } else {
        sendSlack(`サブスクやめた 3日棚卸し：**直す側が失敗しました**（exit ${res.code}）\n点検の指摘は出ています。手で対応してください。\n\n${head}\nログ: ${checkLog} / ${agentLog}`);
      }
      finish(1);
    } else {
      log(`3日分の棚卸し完了（点検: triage=${tri.code} seo=${seo.code} / 詳細は ${checkLog}）`);
      finish(0);
    }
  }
} catch (e) {
  sendSlack(`サブスクやめた 3日棚卸しで例外\n${e && e.message}`);
  finish(2);
}
