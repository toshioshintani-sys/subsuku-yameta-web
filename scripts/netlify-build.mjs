// Netlify ビルドラッパー — 失敗時に実際のエラーを Slack へ自動報告する
//
// 背景: 2026-06-03〜06-11、Netlifyビルドが全件失敗していたが（exit 2・本番が
//   5/31版に固定）、失敗が9日間誰にも通知されず「静かに死んで」いた。
//   Netlify はビルドログをAPIで公開しないため、原因調査すら難航した。
//   このラッパーは ①ビルド出力を中継しつつ ②失敗時に出力末尾を
//   Slack Webhook（env: BUILD_FAILURE_WEBHOOK）へ POST する。
//   ＝ 自律運用ルール原則7「無人で静かに死なない」のビルド版。
//
// netlify.toml: command = "node scripts/netlify-build.mjs"
// env: BUILD_FAILURE_WEBHOOK（Netlify env var・未設定なら通知スキップで挙動不変）

import { spawn, spawnSync } from 'node:child_process';

const CHUNK_LIMIT = 64 * 1024; // 末尾64KBだけ保持（メモリ節約）
let tail = '';

// Netlify 上では puppeteer の Chrome を先に確保する。
// 根因（2026-06-12 特定）: 6/3頃のビルドイメージ更新で ~/.cache/puppeteer が消えた後、
// node_modules はキャッシュ復元される＝puppeteer の postinstall（Chrome DL）が走らず、
// prerender が「Could not find Chrome」で全ビルド失敗し続けた（自己回復しない構造）。
// `puppeteer browsers install` は冪等：キャッシュ済みなら数秒、無ければDLして
// ~/.cache/puppeteer に置く（Netlifyがビルドキャッシュとして保存→次回は高速）。
if (process.env.NETLIFY === 'true') {
  console.log('[netlify-build] puppeteer Chrome を確認/インストール…');
  const r = spawnSync('npx', ['puppeteer', 'browsers', 'install', 'chrome'], {
    shell: true,
    stdio: 'inherit',
    env: process.env,
  });
  if (r.status !== 0) {
    keep(`[netlify-build] Chrome install failed (exit ${r.status})\n`);
    console.error(`[netlify-build] Chrome インストール失敗 (exit ${r.status}) — ビルドは続行（prerenderで失敗すれば通知される）`);
  }
}

function keep(s) {
  tail += s;
  if (tail.length > CHUNK_LIMIT) tail = tail.slice(-CHUNK_LIMIT);
}

async function notifyFailure(code) {
  const hook = process.env.BUILD_FAILURE_WEBHOOK;
  if (!hook) {
    console.log('[netlify-build] BUILD_FAILURE_WEBHOOK 未設定のため通知スキップ');
    return;
  }
  const excerpt = tail.slice(-1800);
  const text =
    `🛑 Netlifyビルド失敗 (exit ${code})\n` +
    `commit: ${process.env.COMMIT_REF || '?'} / branch: ${process.env.BRANCH || '?'}\n` +
    `node: ${process.version}\n` +
    '--- build output (tail) ---\n' +
    '```' + excerpt + '```';
  try {
    const res = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ text }),
    });
    console.log(`[netlify-build] 失敗をSlackへ通知: HTTP ${res.status}`);
  } catch (e) {
    console.log(`[netlify-build] Slack通知も失敗: ${e.message}`);
  }
}

const child = spawn('npm', ['run', 'build'], {
  shell: true,
  env: process.env,
});

child.stdout.on('data', (d) => {
  process.stdout.write(d);
  keep(d.toString());
});
child.stderr.on('data', (d) => {
  process.stderr.write(d);
  keep(d.toString());
});

child.on('close', async (code) => {
  if (code !== 0) await notifyFailure(code);
  process.exit(code ?? 1);
});
