// 無人タスク共通ライブラリ（PowerShell を使わない Node 版ランナー用）
//
// なぜ作ったか（2026-10-03）：
//   この日、powershell.exe / pwsh が「'hi' を出すだけ」で60秒以上固まる状態になった（CPU 0%・
//   OS が 26200→26300 に更新された直後）。Task Scheduler が powershell.exe 経由で起動していた
//   判定・為替・棚卸し・週次の4タスクは、起動した瞬間に巻き込まれる。10/1 11:00 の為替タスクが
//   強制終了（0xC000013A）していたのも同じ原因の可能性が高い。
//   PowerShell をやめ、Task Scheduler から node.exe を直接起動する形にした。node は固まらない。
//
//   副産物：PowerShell 版にあった落とし穴がまとめて消える。
//     - UTF-8 BOM 必須・コンソール符号化(CP932)で日本語が化ける
//     - claude.ps1 ラッパー経由の引数切り詰め／stdin の不安定さ
//   → node から claude の cli.js を直接起動し、プロンプトは stdin で渡す（文字数・引用符の制限なし）。

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = 'C:/Users/user/Desktop/Claude_work/subsukuyametaweb/subsuku-yameta-web';
export const LOG_DIR = path.join(ROOT, 'scripts/price-watch/logs');
export const SITE_ID = 'b4ac149a-76c4-4156-9903-c2605ac17cf9';

const SENDER = 'C:/Users/user/Desktop/Claude_work/world-oracle-staging/notifications/_shared/slack_sender.py';
const CLAUDE_CLI = 'C:/Users/user/AppData/Roaming/npm/node_modules/@anthropic-ai/claude-code/cli.js';
const NETLIFY_CLI = 'C:/Users/user/AppData/Roaming/npm/node_modules/netlify-cli/bin/run.js';

// Task Scheduler が起動した node は PATH が最小のことがあるので、必要な場所を明示的に足す。
const EXTRA_PATH = [
  'C:/Program Files/Git/cmd',
  'C:/Program Files/GitHub CLI',
  'C:/Users/user/AppData/Local/Programs/Python/Python314',
  'C:/Users/user/AppData/Local/Programs/Python/Python314/Scripts',
  'C:/Program Files/nodejs',
].map((p) => p.replace(/\//g, '\\')).join(';');

function baseEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  env.PATH = EXTRA_PATH + ';' + (process.env.PATH || process.env.Path || '');
  env.PYTHONIOENCODING = 'utf-8';
  return env;
}

export function ensureDirs() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function today() {
  // このマシンは JST。ローカル日付を使う。
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${today()}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export function minutesOfDay() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function exists(p) {
  return fs.existsSync(p);
}

export function readText(p) {
  return fs.readFileSync(p, 'utf-8').replace(/^\uFEFF/, '');
}

export function readJson(p, fallback = null) {
  try { return JSON.parse(readText(p)); } catch { return fallback; }
}

export function writeText(p, s) {
  fs.writeFileSync(p, s, 'utf-8');
}

export function log(...a) {
  console.log(...a);
}

/** Slack（#6-subsuku-daily）へ送る。失敗してもスローしない。成否を返す。 */
export function sendSlack(message) {
  try {
    const r = spawnSync('python', ['-X', 'utf8', SENDER, 'SUBSUKU_DAILY', message],
      { encoding: 'utf-8', env: baseEnv(), timeout: 60000 });
    return r.status === 0;
  } catch {
    return false;
  }
}

export function git(args, opts = {}) {
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf-8', env: baseEnv(), timeout: opts.timeout || 120000 });
  return { code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

export function gh(args) {
  const r = spawnSync('gh', args, { cwd: ROOT, encoding: 'utf-8', env: baseEnv(), timeout: 60000 });
  return { code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

/** node スクリプトを ROOT で実行して出力を返す（npm run の代わり。npm.cmd を経由しない）。 */
export function runNode(args, opts = {}) {
  const r = spawnSync(process.execPath, args, {
    cwd: ROOT, encoding: 'utf-8', env: baseEnv(opts.env || {}), timeout: opts.timeout || 600000, maxBuffer: 64 * 1024 * 1024,
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

/**
 * 作業ツリーを main に戻して最新へ早送りする。
 * 価格判定は本物の価格変更がある日だけ price/auto-* ブランチを切ってPRにする（人がマージ）。
 * 作業ツリーがそのブランチ上に残ると、翌日以降の「main へ直接 push」がPRブランチに積まれ、
 * 2026-10-01〜10-03 の3日間 main が止まって Hulu 改定と為替が本番に出なかった。
 * --autostash：7:10の巡回が書いた未コミットの台帳(state/)があっても早送りできるようにする。
 */
export function ensureMain() {
  const cur = git(['branch', '--show-current']).out;
  if (cur !== 'main') {
    const sw = git(['switch', 'main']);
    if (sw.code !== 0) return { ok: false, reason: `作業ツリーが ${cur || '(detached)'} 上にあり main へ戻せません: ${sw.err.slice(0, 300)}` };
  }
  const pl = git(['pull', '--ff-only', '--autostash', 'origin', 'main'], { timeout: 180000 });
  if (pl.code !== 0) return { ok: false, reason: `main を最新へ早送りできません: ${pl.err.slice(0, 300)}` };
  return { ok: true };
}

/**
 * 今日の判定PR（price/auto-<day>）が未マージで開いていれば {number, url, branch} を返す。無ければ null。
 *
 * なぜ要るか（2026-10-04）：巡回は2時間おき・判定は4時間おきに走る。朝の判定がPRを開いたあと、
 * 昼の判定は main に戻ってから動くので、偽陽性だけなら main へ直pushする。すると同じ日の記録が
 * PRと main の2系統に分かれ、PRは同じ台帳を古い時点から書き換えたまま取り残される（PR#107）。
 * 「その日に人のゲートが開いたら、その日の残りの記録は全部そのPRに積む」ために使う。
 */
export function findTodayPr(day) {
  const branch = `price/auto-${day}`;
  const r = gh(['pr', 'list', '--head', branch, '--state', 'open', '--json', 'number,url']);
  if (r.code !== 0) return { error: r.err.slice(0, 300) };
  const list = JSON.parse(r.out || '[]');
  return list.length ? { number: list[0].number, url: list[0].url, branch } : null;
}

const WATCH_FILES = [
  'scripts/price-watch/state/detection_log.json',
  'scripts/price-watch/state/candidates.json',
  'scripts/price-watch/state/price_watch_state.json',
  'scripts/price-watch/state/autofix_shadow.json',
  'scripts/price-watch/watch-list.json',
];

function gitShow(ref, file) {
  const r = spawnSync('git', ['show', `${ref}:${file}`], { cwd: ROOT, encoding: 'utf-8', env: baseEnv(), maxBuffer: 64 * 1024 * 1024 });
  return r.status === 0 ? r.stdout.replace(/^﻿/, '') : null;
}

/**
 * main 上の作業ツリー（巡回が書いた未コミットの台帳つき）を、今日のPRブランチへ移す。
 *  - detection_log.json：ブランチの記録（朝の判定つき）を土台に、巡回が main 側で新しく足した検知だけを後ろへ足す。
 *  - その他の巡回状態：JSONの項目ごとに3者マージ。巡回が変えた項目は巡回側（新しい方）、触っていない項目はブランチ側を採る。
 *    （行単位のマージだと、判定がブランチで足した注記が、隣の行の巡回の更新とぶつかって消える＝2026-10-04 の試験で確認）
 * 途中で失敗したら main へ戻し、退避した変更も戻して { ok:false } を返す（中途半端な状態で claude を走らせない）。
 */
export function moveOntoTodayPr(branch) {
  const working = {};
  const base = {};
  for (const f of WATCH_FILES) {
    const p = path.join(ROOT, f);
    working[f] = fs.existsSync(p) ? readText(p) : null;
    base[f] = gitShow('HEAD', f);
  }
  const changed = git(['diff', '--name-only', 'HEAD']).out.split('\n').filter(Boolean);
  const dirty = changed.some((f) => WATCH_FILES.includes(f));
  if (changed.some((f) => !WATCH_FILES.includes(f))) {
    return { ok: false, reason: '巡回の台帳以外に未コミットの変更があるため、PRブランチへ移れません' };
  }
  if (dirty) {
    const st = git(['stash', 'push', '-m', `judge-move-${branch}`, '--', ...WATCH_FILES]);
    if (st.code !== 0) return { ok: false, reason: `巡回の台帳を退避できません: ${st.err.slice(0, 300)}` };
  }
  const restore = (reason) => {
    git(['switch', 'main']);
    if (dirty) git(['stash', 'pop']);
    return { ok: false, reason };
  };

  const fe = git(['fetch', 'origin', branch], { timeout: 180000 });
  if (fe.code !== 0) return restore(`${branch} を取得できません: ${fe.err.slice(0, 300)}`);
  const hasLocal = git(['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`]).code === 0;
  const sw = hasLocal ? git(['switch', branch]) : git(['switch', '-c', branch, '--track', `origin/${branch}`]);
  if (sw.code !== 0) return restore(`${branch} へ切り替えられません: ${sw.err.slice(0, 300)}`);
  const ff = git(['merge', '--ff-only', `origin/${branch}`]);
  if (ff.code !== 0) return restore(`${branch} を origin に早送りできません: ${ff.err.slice(0, 300)}`);

  try {
    for (const f of WATCH_FILES) {
      if (working[f] === null || working[f] === base[f]) continue; // 巡回が触っていない＝ブランチのまま
      const p = path.join(ROOT, f);
      const ours = fs.existsSync(p) ? readText(p) : null;
      const eol = /\r\n/.test(working[f]) ? '\r\n' : '\n';
      if (ours === null || base[f] === null) { writeText(p, working[f]); continue; }
      const [b, o, t] = [base[f], ours, working[f]].map((x) => JSON.parse(x));
      let merged;
      if (f.endsWith('detection_log.json')) {
        // 記録は追記型：ブランチの記録を土台に、巡回が新しく足した検知だけを後ろへ足す
        const key = (e) => JSON.stringify(e);
        const baseKeys = new Set(b.map(key));
        const have = new Set(o.map(key));
        merged = [...o];
        for (const e of t) {
          if (!baseKeys.has(key(e)) && !have.has(key(e))) { merged.push(e); have.add(key(e)); }
        }
      } else {
        merged = merge3(b, o, t);
      }
      writeText(p, JSON.stringify(merged, null, 2).replace(/\n/g, eol) + eol);
    }
  } catch (e) {
    for (const f of WATCH_FILES) git(['checkout', '--', f]);
    return restore(`台帳の合流に失敗: ${e.message}`);
  }
  if (dirty) git(['stash', 'drop']);
  return { ok: true };
}

/** JSON の3者マージ。巡回(theirs)が変えた所は巡回側、変えていない所はブランチ(ours)側。同じ長さの配列は要素ごと。 */
function merge3(base, ours, theirs) {
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  if (same(theirs, base)) return ours;
  if (same(ours, base)) return theirs;
  const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
  if (isObj(base) && isObj(ours) && isObj(theirs)) {
    const out = {};
    for (const k of new Set([...Object.keys(ours), ...Object.keys(theirs)])) {
      if (!(k in theirs) && k in base) continue; // 巡回が消した
      if (!(k in ours) && k in base && same(theirs[k], base[k])) continue; // ブランチが消した
      out[k] = !(k in ours) ? theirs[k] : !(k in theirs) ? ours[k] : merge3(base[k], ours[k], theirs[k]);
    }
    return out;
  }
  if (Array.isArray(base) && Array.isArray(ours) && Array.isArray(theirs)
    && base.length === ours.length && base.length === theirs.length) {
    return base.map((x, i) => merge3(x, ours[i], theirs[i]));
  }
  return theirs;
}

/** 判定のあと main へ戻す（PRブランチ上に居残らない）。戻せなければ理由を返す。 */
export function returnToMain() {
  if (git(['branch', '--show-current']).out === 'main') return { ok: true };
  const sw = git(['switch', 'main']);
  return sw.code === 0 ? { ok: true } : { ok: false, reason: sw.err.slice(0, 300) };
}

/**
 * claude -p を無人で起動する。
 *  - ANTHROPIC_API_KEY を除去（残っているとサブスクでなく API 課金になる）
 *  - プロンプトは stdin（長さ・引用符の制限なし）
 *  - node で cli.js を直接起動（claude.ps1 / claude.cmd を経由しない）
 */
export function runClaude(prompt, { timeoutMs = 40 * 60 * 1000 } = {}) {
  const env = baseEnv();
  delete env.ANTHROPIC_API_KEY;

  // 事前確認（2026-10-03）：OAuth が失効していると claude -p は 401 を11回リトライして**何分も固まる**
  // （exit もエラー出力も無いまま。判定・為替が「ただ止まった」ように見える）。軽い1往復で先に確かめ、
  // 応答が無ければ「認証失効の疑い」として短時間で失敗させ、通知が出せるようにする。
  const probe = spawnSync(process.execPath,
    [CLAUDE_CLI, '-p', '--model', 'claude-sonnet-5', '--output-format', 'json'],
    { cwd: ROOT, input: '1+1の答えを数字だけで', encoding: 'utf-8', env, timeout: 120 * 1000, maxBuffer: 16 * 1024 * 1024 });
  const probeRaw = (probe.stdout || '') + (probe.stderr || '');
  if (probe.status !== 0) {
    const hung = probe.error && probe.error.code === 'ETIMEDOUT';
    return {
      code: probe.status === null ? -2 : probe.status,
      raw: (hung ? 'authentication_error: claude -p が120秒応答なし（OAuth失効で401を再試行し続けている可能性が高い）\n' : '') + probeRaw,
      timedOut: !!hung,
    };
  }

  const r = spawnSync(process.execPath,
    [CLAUDE_CLI, '-p', '--permission-mode', 'bypassPermissions', '--model', 'claude-sonnet-5', '--output-format', 'json'],
    { cwd: ROOT, input: prompt, encoding: 'utf-8', env, timeout: timeoutMs, maxBuffer: 256 * 1024 * 1024 });
  const raw = (r.stdout || '') + (r.stderr || '');
  return { code: r.status === null ? -1 : r.status, raw, timedOut: r.error && r.error.code === 'ETIMEDOUT' };
}

export function isAuthError(raw) {
  return /authentication_error|OAuth access token has expired|Invalid authentication credentials|401/.test(raw);
}

/** Netlify の最新デプロイ一覧（production 優先）。取れなければ null。 */
export function listDeploys() {
  try {
    const r = spawnSync(process.execPath, [NETLIFY_CLI, 'api', 'listSiteDeploys', '--data', JSON.stringify({ site_id: SITE_ID })],
      { encoding: 'utf-8', env: baseEnv(), timeout: 120000, maxBuffer: 64 * 1024 * 1024 });
    if (r.status !== 0) return null;
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

/** 指定コミットの production デプロイが ready になるまで待つ（30秒おき・最大 tries 回）。 */
export function waitProductionReady(sha, tries = 8) {
  let state = null;
  let id = null;
  for (let i = 0; i < tries; i += 1) {
    if (i > 0) spawnSync(process.execPath, ['-e', 'setTimeout(()=>{},30000)'], { timeout: 40000 });
    const ds = listDeploys();
    const m = ds && ds.find((d) => d.commit_ref === sha && d.context === 'production');
    if (m) {
      state = m.state;
      id = m.id;
      if (state === 'ready' || state === 'error') break;
    }
  }
  return { state, id };
}

/**
 * 毎日の状況報告（1日1回）。判定の有無にかかわらず、未マージPRと本番デプロイの状態を数えて出す。
 * 10/1〜10/3、本物のHulu改定PRが誰にも見られず3日間本番に出なかった。判定通知は「今日の結果」しか
 * 言わないので、溜まったPRや本番の止まりは流れの中で消える。溜まりは静止しているので毎日数える。
 */
export function dailyStatusReport() {
  const marker = path.join(LOG_DIR, `daily_report_${today()}.txt`);
  if (exists(marker)) return;
  try {
    const pr = gh(['pr', 'list', '--state', 'open', '--json', 'number,title,createdAt']);
    const prs = pr.code === 0 && pr.out ? JSON.parse(pr.out) : [];
    const ds = listDeploys();
    const prod = ds && ds.find((d) => d.context === 'production');
    const head = git(['rev-parse', '--short', 'origin/main']).out;
    const lines = [];
    lines.push('サブスクやめた 毎日の状況報告');
    lines.push(prod
      ? `本番の最新デプロイ: ${prod.commit_ref.slice(0, 7)} ${prod.state}（${String(prod.created_at).slice(0, 16)}Z）`
      : '本番デプロイ状態: 取得できませんでした');
    lines.push(`main先頭: ${head}${prod && head && !prod.commit_ref.startsWith(head) ? '  ⚠️本番と一致していません（main の最新が本番に出ていない可能性）' : ''}`);
    if (prs.length) {
      lines.push(`未マージPR ${prs.length}本（人のマージ待ち。価格・為替の本物は放置すると本番に出ません）：`);
      for (const p of prs) {
        const age = Math.floor((Date.now() - new Date(p.createdAt)) / 86400000);
        lines.push(`  #${p.number}（${age}日） ${p.title}`);
      }
    } else {
      lines.push('未マージPRなし');
    }
    sendSlack(lines.join('\n'));
    writeText(marker, today());
  } catch { /* 報告の失敗で本処理は止めない */ }
}
