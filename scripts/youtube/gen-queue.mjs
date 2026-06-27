// src/data/services.js → Shorts投稿キュー(queue.json)を自動生成。
// 各サービスの steps/note/cancelUrl（実データ）から、レンダリング用spec＋YouTubeメタ(タイトル/概要/タグ)を組む。
// フック/タイトルは difficulty で自動文言＋手書きオーバーライド（質の出る初手だけ上書き）。
//
// 使い方:
//   node gen-queue.mjs                 # 第1バッチ(既定ID)だけ生成
//   node gen-queue.mjs all             # 全サービス生成
//   node gen-queue.mjs netflix hulu    # 指定IDだけ
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICES } from '../../src/data/services.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://sabusuku-yameta.com';
const FIRST_BATCH = ['amazon-prime', 'u-next', 'spotify'];

// 手書きオーバーライド（質を担保したい動画だけ）。無ければ difficulty で自動生成。
const OVERRIDE = {
  'amazon-prime': {
    hook: 'Amazonプライム、“継続する”の大きなボタンに惑わされないで',
    title: '【惑わされない】Amazonプライムの解約方法｜“継続する”の罠',
  },
  'u-next': {
    hook: 'U-NEXTの解約リンク、わざとページ最下部に隠されてます',
    title: '【最短】U-NEXTの解約方法｜隠れた解約リンクの場所',
  },
  spotify: {
    hook: 'Spotify、アプリからは解約できません。理由はこれ',
    title: '【なぜ？】Spotifyがアプリで解約できない理由と最短手順',
  },
};

function autoHook(s) {
  if (s.difficulty === 'hard') return `${s.name}の解約は分かりにくく作られてる。最短ルートはこれ`;
  if (s.difficulty === 'medium') return `${s.name}の解約、引き止めに注意。正しい手順はこれ`;
  return `${s.name}の解約は意外とシンプル。最短ルートはこれ`;
}
function autoTitle(s) {
  if (s.difficulty === 'hard') return `【迷わない】${s.name}の解約方法｜分かりにくい導線を最短で`;
  if (s.difficulty === 'medium') return `【惑わされない】${s.name}の解約方法｜最短手順`;
  return `【最短】${s.name}の解約方法｜サクッと完了`;
}

function ctaUrl(id) {
  return `${SITE}/service/${id}?utm_source=youtube&utm_medium=social&utm_campaign=shorts&utm_content=${id}`;
}
function description(s) {
  return [
    `${s.name}の解約を最短で終わらせる手順です。`,
    '',
    '▼ 全サブスクの解約手順・無料代替・乗り換え先はこちら（煽らず両論併記）',
    ctaUrl(s.id),
    '',
    '※手順は変更される場合があります。最新は公式をご確認ください。',
    '#サブスク #解約 #節約',
  ].join('\n');
}
function tags(s) {
  return ['サブスク', '解約', '解約方法', `${s.name} 解約`, '節約', '固定費'];
}

function toItem(s) {
  const ov = OVERRIDE[s.id] || {};
  return {
    id: s.id,
    name: s.name,
    // render用
    hook: ov.hook || autoHook(s),
    steps: s.steps,
    note: s.note || '',
    // upload用
    title: (ov.title || autoTitle(s)).slice(0, 100), // YouTubeタイトル上限100
    description: description(s),
    tags: tags(s),
    ctaUrl: ctaUrl(s.id),
    status: 'pending',
  };
}

const argv = process.argv.slice(2);
let targets;
if (argv.length === 0) targets = FIRST_BATCH;
else if (argv[0] === 'all') targets = SERVICES.map((s) => s.id);
else targets = argv;

const byId = new Map(SERVICES.map((s) => [s.id, s]));
const items = [];
for (const id of targets) {
  const s = byId.get(id);
  if (!s) { console.error(`[skip] 未知のID: ${id}`); continue; }
  if (!s.steps || s.steps.length === 0) { console.error(`[skip] ${id}: steps無し`); continue; }
  items.push(toItem(s));
}

// 既存queueのstatus(done)は保持してマージ（再生成で投稿済みを巻き戻さない）
const outPath = resolve(HERE, 'queue.json');
let prev = [];
if (existsSync(outPath)) { try { prev = JSON.parse(readFileSync(outPath, 'utf-8')); } catch { /* noop */ } }
const prevStatus = new Map(prev.map((p) => [p.id, p.status]));
for (const it of items) if (prevStatus.get(it.id) === 'done') it.status = 'done';

writeFileSync(outPath, JSON.stringify(items, null, 2) + '\n');
console.log(`queue.json 生成: ${items.length}本（done保持 ${[...prevStatus.values()].filter((v) => v === 'done').length}）→ ${outPath}`);
