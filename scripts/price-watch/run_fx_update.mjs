// サブスクやめた — 為替レート更新ランナー（無人実行・Node版）
// タスクスケジューラ Subsuku_FxUpdate_1100（毎月1日・15日 11:00 JST）から node.exe で直接起動される。
// 旧 run_fx_update.ps1 の完全移植（PowerShell が固まる不具合のため・lib.mjs 冒頭参照）。
//
// 設計（2026-09-23 俊雄さん承認）：妥当性チェックを通ったら main へ直接 push → デプロイ確認まで自動。
// PRで止めると人が押すまで古いレートが出続ける（実際 2026-09-02〜09-22 の20日間据え置かれた）。
// push後は「本当にNetlifyへデプロイされたか」を、エージェントの自己申告に頼らずランナー側でも検算する
// （2026-09-22 に「ローカルビルド成功」を「本番デプロイ成功」と誤認し17日間凍結していた反省）。

import path from 'node:path';
import {
  ROOT, LOG_DIR, ensureDirs, today, stamp, minutesOfDay, exists, readText, writeText,
  log, sendSlack, git, ensureMain, runClaude, isAuthError, waitProductionReady,
} from '../ops/lib.mjs';

process.chdir(ROOT);
ensureDirs();

const promptFile = path.join(ROOT, 'scripts/price-watch/fx_update_prompt.md');
const logFile = path.join(LOG_DIR, `fx_${stamp()}.json`);
const day = today();
const finish = (c) => { process.exitCode = c; };

try {
  main();
} catch (e) {
  sendSlack(`サブスクやめた 為替更新（無人）で例外\n${e && e.stack ? e.stack.split('\n').slice(0, 4).join('\n') : e}`);
  finish(1);
}

function main() {
  // 公表仲値の発表は午前10時頃。遅延起動に備えて10:30より前なら何もしない
  // （未公表の時刻に取ると前営業日の値を掴み、同じ相場日に別の値が入る）。
  if (minutesOfDay() < 10 * 60 + 30) {
    log('10:30より前のため為替更新はしない（公表前の値を掴まないため）');
    return finish(0);
  }

  // 同じ日に二重で走らせない（手動テストと定時実行が重なった時の冪等ガード）
  const marker = path.join(LOG_DIR, `fxtask_${day}.txt`);
  if (exists(marker)) {
    log('本日は実行済みのためスキップ');
    return finish(0);
  }

  // PRブランチ上に居残らない。main に戻せないなら止めて知らせる（lib.ensureMain 参照）
  const em = ensureMain();
  if (!em.ok) {
    sendSlack(`サブスクやめた 為替更新（無人）を停止：${em.reason}\n直pushがPRブランチに積まれて本番に出ない危険があるため続行しません。`);
    return finish(1);
  }

  const shaBefore = git(['rev-parse', 'HEAD']).out;
  const res = runClaude(readText(promptFile));
  writeText(logFile, res.raw);
  writeText(marker, day);

  if (res.code !== 0) {
    if (isAuthError(res.raw)) {
      sendSlack('サブスクやめた 為替更新（無人）が停止：**CLIの認証が失効しています**\n' +
        '対処（俊雄さんの操作が必要です）：長期トークン（ユーザー環境変数 CLAUDE_CODE_OAUTH_TOKEN）の期限切れの可能性があります。ターミナルで claude setup-token を実行して再発行し、その値でユーザー環境変数を更新してください。\n' +
        `ログ: ${logFile}`);
      return finish(1);
    }
    sendSlack(`サブスクやめた 為替更新（無人）が失敗\nclaude -p が exit code ${res.code} で終了。レートは更新されていません。\nログ: ${logFile}`);
    // 取りこぼしは 7:30 判定タスクの為替フォールバック(fx_attempt)と、12時のSlack巡回が拾う。
    return finish(1);
  }

  const shaAfter = git(['rev-parse', 'HEAD']).out;
  if (!shaBefore || !shaAfter || shaBefore === shaAfter) {
    // 妥当性チェックで更新を見送った・または既に最新、という正常系。push が無いのでデプロイ確認は不要。
    log(`為替更新タスク完了（コミットなし・詳細は ${logFile}）`);
    return finish(0);
  }

  // main が動いた＝push が発生した。ランナー側でも独立にデプロイを検算する。
  const touched = git(['diff', '--name-only', shaBefore, shaAfter]).out.split('\n').filter(Boolean);
  const dep = waitProductionReady(shaAfter, 8);
  const url = `https://github.com/toshioshintani-sys/subsuku-yameta-web/commit/${shaAfter}`;
  if (dep.state === 'ready') {
    log(`為替更新タスク完了・本番デプロイ確認済み（state=ready, deploy=${dep.id}）`);
    return finish(0);
  }
  if (dep.state === 'error') {
    sendSlack(`サブスクやめた 為替更新：push はできましたが**本番デプロイが失敗**しました（state=error）\n` +
      `コミット: ${shaBefore.slice(0, 7)} -> ${shaAfter.slice(0, 7)}（変更: ${touched.join(', ')}）\n${url}\n` +
      `https://app.netlify.com/projects/sabusuku/deploys/${dep.id}\nレートは本番に出ていない可能性があります。手動確認をお願いします。`);
    return finish(1);
  }
  sendSlack(`サブスクやめた 為替更新：push はできましたが、約4分待ってもNetlifyの**production デプロイを確認できませんでした**\n` +
    `コミット: ${shaBefore.slice(0, 7)} -> ${shaAfter.slice(0, 7)}（変更: ${touched.join(', ')}）\n${url}\n` +
    'https://app.netlify.com/projects/sabusuku/deploys を手動で確認してください。');
  finish(1);
}
