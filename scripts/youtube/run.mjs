// 全自動オーケストレータ：queue.json から未投稿を取り、レンダリング→YouTube投稿→done記録。
// kill-switch と段階安全を内蔵。ローカルのスケジューラ（Threads 4コマ同型）から定期実行する想定。
//
// 環境変数（安全既定＝何もしなければ投稿しない）:
//   YT_AUTOPOST_ENABLED = true     # これが true でなければ投稿せず終了（緊急停止スイッチ）
//   YT_MAX_PER_RUN      = 1        # 1回の実行で投稿する最大本数
//   YT_PRIVACY          = private  # 既定private（確信後 public）
//   YT_CLIENT_ID/SECRET/REFRESH_TOKEN  # OAuth（原子操作）
//
// 使い方:
//   node run.mjs --dry-run   # レンダリングのみ・投稿しない・認証不要（検証用）
//   node run.mjs             # kill-switch ON のとき1本投稿
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderShort } from './render-short.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const QUEUE = resolve(HERE, 'queue.json');
const dryRun = process.argv.includes('--dry-run');

function loadEnv() {
  const f = resolve(HERE, '.env');
  try {
    for (const line of readFileSync(f, 'utf-8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#') || !t.includes('=')) continue;
      const i = t.indexOf('=');
      const k = t.slice(0, i).trim();
      if (k && !process.env[k]) process.env[k] = t.slice(i + 1).trim();
    }
  } catch { /* .env 無くてもよい */ }
}
loadEnv();

const log = (...a) => console.log(new Date().toISOString(), ...a);

const queue = JSON.parse(readFileSync(QUEUE, 'utf-8'));
const pending = queue.filter((q) => q.status !== 'done');
const maxPerRun = Number(process.env.YT_MAX_PER_RUN || 1);

if (pending.length === 0) { log('投稿待ちなし。終了。'); process.exit(0); }

// kill-switch：dry-run以外は YT_AUTOPOST_ENABLED=true を要求
if (!dryRun && process.env.YT_AUTOPOST_ENABLED !== 'true') {
  log('YT_AUTOPOST_ENABLED!=true → kill-switch作動。投稿せず終了（緊急停止中）。');
  process.exit(0);
}

let uploadShort = null;
if (!dryRun) ({ uploadShort } = await import('./upload-short.mjs'));

const dir = mkdtempSync(join(tmpdir(), 'ytrun-'));
let done = 0;
try {
  for (const item of pending) {
    if (done >= maxPerRun) break;
    const mp4 = join(dir, `${item.id}.mp4`);
    log(`render: ${item.id} …`);
    await renderShort(item, mp4);
    if (dryRun) { log(`[dry-run] rendered ${item.id} → ${mp4}（投稿スキップ）`); done++; continue; }
    log(`upload: ${item.id} …`);
    try {
      const r = await uploadShort(item, mp4);
      item.status = 'done';
      item.youtube = { id: r.id, url: r.url, privacy: r.privacyStatus, postedAt: new Date().toISOString() };
      writeFileSync(QUEUE, JSON.stringify(queue, null, 2) + '\n');
      log(`[ok] ${item.id} → ${r.url}（${r.privacyStatus}）`);
      done++;
    } catch (e) {
      log(`[fail] ${item.id}: ${e.message}`);
      break; // 失敗時は止める（API quota/権限の可能性・無限ループ防止）
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
log(`完了：${dryRun ? 'DRY-RUN ' : ''}処理 ${done} 本 / 残り ${queue.filter((q) => q.status !== 'done').length}`);
