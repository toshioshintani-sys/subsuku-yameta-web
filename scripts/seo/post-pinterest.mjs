// Pinterest API v5 でピンを自律投稿する（ブラウザ不要）。
//
// 前提:
//  1) ピン画像が公開URL化済み（public/pins/ → deploy）。imageUrl = SITE/pins/pin-<key>.png
//  2) 環境変数 PINTEREST_TOKEN（スコープ: boards:read, boards:write, pins:read, pins:write）
//     → 取得手順は docs/pinterest/API_SETUP.md（pinterest-auth.mjs が補助）
//
// 使い方:
//   $env:PINTEREST_TOKEN="xxx"; node scripts/seo/post-pinterest.mjs --dry-run   # 何を投稿するか表示のみ
//   $env:PINTEREST_TOKEN="xxx"; node scripts/seo/post-pinterest.mjs             # 実投稿（ボード自動作成→投稿）
//
// 冪等: docs/pinterest/.posted.json に投稿済みkeyを記録。再実行時はスキップ（重複投稿しない）。
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PINS, BOARDS, pinMeta } from './pins-data.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const API = 'https://api.pinterest.com/v5';
const TOKEN = process.env.PINTEREST_TOKEN;
const dryRun = process.argv.includes('--dry-run');
const POSTED = resolve(ROOT, 'docs/pinterest/.posted.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const loadPosted = () => {
  try {
    return JSON.parse(readFileSync(POSTED, 'utf-8'));
  } catch {
    return {};
  }
};
const savePosted = (o) => writeFileSync(POSTED, JSON.stringify(o, null, 2), 'utf-8');

async function api(path, method = 'GET', body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} :: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

async function ensureBoards() {
  // 既存ボード name→id を取得し、BOARDS に無いものだけ作成
  const existing = {};
  let bookmark = '';
  do {
    const r = await api(`/boards?page_size=100${bookmark ? `&bookmark=${encodeURIComponent(bookmark)}` : ''}`);
    (r.items || []).forEach((b) => (existing[b.name] = b.id));
    bookmark = r.bookmark || '';
  } while (bookmark);

  const idByKey = {};
  for (const [key, b] of Object.entries(BOARDS)) {
    if (existing[b.name]) {
      idByKey[key] = existing[b.name];
    } else if (dryRun) {
      idByKey[key] = `(would-create:${b.name})`;
    } else {
      const created = await api('/boards', 'POST', { name: b.name, description: b.description });
      idByKey[key] = created.id;
      console.log(`[board] created "${b.name}" → ${created.id}`);
      await sleep(800);
    }
  }
  return idByKey;
}

async function main() {
  if (!TOKEN) {
    console.error('PINTEREST_TOKEN 未設定。取得手順: docs/pinterest/API_SETUP.md');
    process.exit(1);
  }
  const posted = loadPosted();
  const idByKey = await ensureBoards();
  let ok = 0;
  let skip = 0;
  let fail = 0;
  for (const p of PINS) {
    const m = pinMeta(p);
    if (posted[m.key]) {
      skip++;
      continue;
    }
    const payload = {
      board_id: idByKey[m.boardKey],
      title: m.title,
      description: m.description,
      link: m.link,
      media_source: { source_type: 'image_url', url: m.imageUrl },
    };
    if (dryRun) {
      console.log(`[dry] ${m.key} → board=${m.boardKey} | "${m.title}" | ${m.link} | ${m.imageUrl}`);
      ok++;
      continue;
    }
    try {
      const r = await api('/pins', 'POST', payload);
      posted[m.key] = { id: r.id, at: new Date().toISOString() };
      savePosted(posted);
      console.log(`[pin] ${m.key} → ${r.id}`);
      ok++;
      await sleep(1500); // レート制御
    } catch (e) {
      console.error(`[fail] ${m.key}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\n完了：${dryRun ? 'DRY-RUN ' : ''}投稿 ${ok} / スキップ(投稿済) ${skip} / 失敗 ${fail}`);
}

main().catch((e) => {
  console.error('例外:', e.message);
  process.exit(1);
});
