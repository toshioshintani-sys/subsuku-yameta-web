#!/usr/bin/env node
// price-watch.mjs — サブスクやめた 価格偵察部隊（検知のみ・公開しない）
// =============================================================================
// stack letter の world-oracle-staging/agents/_runtime/price_watch.py を Node へ移植し、
// 日本円（¥1,200 / 1,200円）と米ドル（$12.99）の両方に対応させたもの。
//
// 仕組み：各サービスの公式料金ページを取得 → ページ内の「価格トークン集合」を署名(signature)化
//   → 前回の署名と差分（追加/消失）を取る → 変化を「検知候補(events)」として出力するだけ。
//   ★ ハッシュ全文比較はノイズ(トークン/AB/日付)で毎回変わるため使わない（並び替えに強い集合比較）。
//
// 🛑 単一責任＝「検知」だけ。**自動公開しない**。誤報ゼロ（＝収益の源泉である社会性を守る生命線）：
//   検知候補は state/candidates.json に貯まる。公開前に必ず人/Claudeが公式ページで一次確認し、
//   正しければ src/data/services.js の PRICE_HISTORY に手で追記する（AI_RADAR原則の全サービス版）。
//   このスクリプトは site を一切変更しない（サイト構造・アフィリンクを触らない＝AdSense再審査中も安全）。
//
// 使い方：
//   node scripts/price-watch/price-watch.mjs           # 全 enabled サービスを巡回（初回=ベースライン記録）
//   node scripts/price-watch/price-watch.mjs --only netflix,spotify
// 出力：state/price_watch_state.json（署名）／state/candidates.json（検知候補＝要一次確認）
// =============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const WATCH_LIST = join(__dir, 'watch-list.json');
const STATE_DIR = join(__dir, 'state');
const STATE_FILE = join(STATE_DIR, 'price_watch_state.json');
const CANDIDATES_FILE = join(STATE_DIR, 'candidates.json');

const SCRIPT_STYLE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const TAG = /<[^>]+>/g;
const WS = /\s+/g;
// 価格トークン: ¥1,200 / ¥ 1,200.00 / 1,200円 / 980 円 / $12.99 / $ 1,200
// 直後に英小文字/ハイフンが続くトークンは呼び出し側で手動除外する（下記参照）。
// 注：ここに (?![a-z-]) の否定先読みを付けると、桁数の多い数字が正規表現のバックトラックで
//   1桁ずつ短くマッチし直してしまい「除外」でなく「縮んで残る」誤りになる
//   （例: "$2722514a-..." が "$272251"+"4a..." にバックトラックして通過＝2026-07-06に発見した実バグ）。
//   そのため除外判定は matchAll 後、m[0] の直後の1文字を手動チェックする方式にする。
const PRICE_TOK = /(?:¥\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*\s?円|\$\s?\d[\d,]*(?:\.\d+)?)/g;
const FOLLOWED_BY_SLUG = /^[a-z-]/;
// 従量課金・コンピュート課金の文脈（"per hour" "per container" 等）は、サブスク価格でないので除外する。
const COMPUTE_CONTEXT = /per\s+(hour|container|token|request|minute|second|gb|call)/i;

function loadJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, 'utf-8')); } catch { return fallback; }
}
function saveJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// ページから価格トークンのユニーク集合（ソート）を作る＝署名。
// 2026-07-06 修正（俊雄さん指摘で判明したノイズの根本原因への対処。1回目は script/style を
// 一律除去したが、それが逆に playstation-plus(JSON-LD構造化データの本物の価格) や
// deepl-pro(React RSCハイドレーションデータ内の本物の価格) を壊す新規回帰を起こしたため、
// 「一律」ではなく「サービスごとのオプトイン」設計に修正した＝詳細は各項目を参照：
//   1) stripScriptStyle:true が指定された時だけ <script>/<style> の中身を除去する
//      （hulu=JSバンドルの正規表現置換文字列"$1"、figma=Next.js RSC参照ID"$56"等、
//      価格でないものを誤検出するページ**のみ**有効化。他のページは script 内の
//      JSON-LD/ハイドレーションデータに本物の価格が入っていることがあるため既定は false）。
//   2) 価格トークンの直後に英小文字/ハイフンが続く場合は除外（evernoteのUUID/スラグ断片
//      "$2722514a-15d3-..." の誤検出防止・script除去なしでも安全に効く一般則）。
//   3) "per hour"/"per container" 等の従量課金・コンピュート課金の文脈にある金額は除外。
//   4) dataPlanPrefix が指定されていれば、その data-plan="<prefix>*" 属性を持つ要素の値だけを
//      拾う「スコープ限定抽出」に切り替える（claude-pro: 1ページにFree/Pro/Team/Enterprise/APIが
//      並ぶが data-plan="pro_monthly" 等でProだけ機械的に切り出せることを診断で確認）。
// 注：script除去もdata-plan属性も無く、1ページに複数国・複数プランの価格が並ぶ場合
//   （多地域比較記事等）は、この関数だけでは対象を選り分けられない。既知の限界として残す。
function sigPrices(rawHtml, opts = {}) {
  if (opts.dataPlanPrefix) {
    const re = new RegExp(
      `data-plan="(${opts.dataPlanPrefix.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})[a-z0-9_]*"[^>]*>\\s*\\$?([\\d.,]+)`,
      'gi'
    );
    const toks = new Set();
    for (const m of rawHtml.matchAll(re)) toks.add('$' + m[2]);
    return [...toks].sort();
  }
  const base = opts.stripScriptStyle ? rawHtml.replace(SCRIPT_STYLE, ' ') : rawHtml;
  const text = base.replace(TAG, ' ').replace(WS, ' ');
  const toks = new Set();
  for (const m of text.matchAll(PRICE_TOK)) {
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 40);
    if (FOLLOWED_BY_SLUG.test(after)) continue; // UUID/スラグ断片の誤検出防止（バックトラックしない安全な除外）
    if (COMPUTE_CONTEXT.test(after)) continue;
    toks.add(m[0].replace(/\s/g, ''));
  }
  return [...toks].sort();
}

async function fetchHtml(url, ua, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': ua, 'Accept-Language': 'ja,en;q=0.8', Accept: 'text/html,*/*' },
      signal: ctrl.signal,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const onlyArg = process.argv.indexOf('--only');
  const onlyIds = onlyArg >= 0 ? (process.argv[onlyArg + 1] || '').split(',').map((x) => x.trim()) : null;

  const cfg = loadJson(WATCH_LIST, { watch: [], settings: {} });
  const s = cfg.settings || {};
  const ua = s.userAgent || 'SabusukuYameta-PriceScout/0.1 (+https://sabusuku-yameta.com)';
  const timeoutMs = s.timeoutMs || 20000;
  const delay = s.perHostDelayMs || 1500;

  const state = loadJson(STATE_FILE, {});
  const events = [];
  const report = [];

  for (const w of cfg.watch) {
    if (onlyIds && !onlyIds.includes(w.id)) continue;
    if (w.enabled === false) { report.push({ id: w.id, status: 'skipped' }); continue; }

    let raw;
    try {
      raw = await fetchHtml(w.url, ua, timeoutMs);
    } catch (e) {
      report.push({ id: w.id, status: 'error', error: String((e && e.message) || e) });
      await sleep(delay);
      continue;
    }
    await sleep(delay);

    const sig = sigPrices(raw, { dataPlanPrefix: w.dataPlanPrefix, stripScriptStyle: w.stripScriptStyle });
    const now = new Date().toISOString();
    const prev = state[w.id]?.sig;

    if (!prev) {
      state[w.id] = { sig, checkedAt: now };
      report.push({ id: w.id, status: sig.length ? 'baseline' : 'baseline_empty', sigSize: sig.length });
      continue;
    }

    const prevSet = new Set(prev);
    const curSet = new Set(sig);
    const added = sig.filter((x) => !prevSet.has(x));
    const removed = prev.filter((x) => !curSet.has(x));
    state[w.id] = { sig, checkedAt: now };

    if (!added.length && !removed.length) {
      report.push({ id: w.id, status: 'nochange', sigSize: sig.length });
      continue;
    }
    events.push({ id: w.id, name: w.name, url: w.url, added, removed, detectedAt: now });
    report.push({ id: w.id, status: 'CHANGED', added: added.length, removed: removed.length });
  }

  saveJson(STATE_FILE, state);
  // 検知候補キュー（＝公開せず、人/Claudeが公式で一次確認して PRICE_HISTORY に書く対象）
  saveJson(CANDIDATES_FILE, {
    generatedAt: new Date().toISOString(),
    note: '検知候補。公開前に必ず公式ページで一次確認し、正しければ src/data/services.js の PRICE_HISTORY に人/Claudeが追記する（誤報ゼロ）。このファイルは自動公開されない。',
    events,
  });

  const counts = report.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  console.log('=== サブスクやめた 価格偵察部隊（検知のみ） ===', new Date().toISOString());
  for (const r of report) {
    let line = `  [${String(r.status).padStart(14)}] ${String(r.id).padEnd(24)}`;
    if (r.status === 'CHANGED') line += ` +${r.added} / -${r.removed}`;
    else if (String(r.status).startsWith('baseline') || r.status === 'nochange') line += ` sig=${r.sigSize}`;
    else if (r.status === 'error') line += ` ${r.error}`;
    console.log(line);
  }
  console.log('--- 集計 ---', JSON.stringify(counts));
  console.log(`--- 検知候補(要一次確認): ${events.length} 件 → ${CANDIDATES_FILE}`);
  for (const ev of events) console.log(`  ⚑ ${ev.name}: 追加[${ev.added.join(', ')}] 消失[${ev.removed.join(', ')}]`);
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
