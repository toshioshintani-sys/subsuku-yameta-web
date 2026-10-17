#!/usr/bin/env node
// Hint-Pot の SNS タグ記事から、Threads（スレッズ）でバズった投稿の記事を集める（2026-10-17）
//
// 目的・方針は collect-nlab.mjs と同じ（docs/THREADS_BUZZ_SOURCES_2026-10.md）。
//   - ニュースサイトの記事を読むだけ。threads.com には一切アクセスしない。
//   - hint-pot.jp/robots.txt が許可している範囲（タグ一覧のページ・記事）だけを読む。サイト内検索（?s=）は使わない。
//   - 名乗りは研究用。1リクエストごとに間隔を空ける（既定 3 秒）。
//   - 記事の本文・写真は保存しない。台帳に残すのは記事番号・日付・数字・投稿者IDの指紋（重複判定用）だけ。
//
// Hint-Pot に Threads 専用のタグは無い。SNS タグ（https://hint-pot.jp/archives/tag/sns/page/N・1ページ15件）を
// さかのぼり、記事の本文に「スレッズ／Threads」がある記事だけを台帳に残す。
// 文字の投稿は、記事の写真がストック写真（「写真はイメージ」「写真AC」等）のことが多い → stock_image で目印を付ける。
//
// 台帳：hintpot_ledger.json（git に入れる・公開してよい形）。見た記事は Threads でなくても article_id を残し、二度読まない。
//
// 使い方：
//   node scripts/ops/threads-buzz/collect-hintpot.mjs --pages=2            # 先頭2ページ（日々の更新）
//   node scripts/ops/threads-buzz/collect-hintpot.mjs --from=3 --to=40     # 過去分をさかのぼる（回数を分けて実行）
//   node scripts/ops/threads-buzz/collect-hintpot.mjs --report             # 件数だけ（取得しない）

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const LEDGER = join(HERE, 'hintpot_ledger.json');
const NLAB_LEDGER = join(HERE, 'nlab_ledger.json');
const JOBS = join(HERE, '..', 'cloud_jobs.json');
const GOAL = 500;
const LIST = (p) => (p <= 1 ? 'https://hint-pot.jp/archives/tag/sns' : `https://hint-pot.jp/archives/tag/sns/page/${p}`);
const ART = (id) => `https://hint-pot.jp/archives/${id}`;
const UA = 'Mozilla/5.0 (research; subsuku-yameta internal analysis)';
const WAIT_MS = Number(process.env.WAIT_MS || 3000);

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.status === 404) return { status: 404, text: '' };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { status: res.status, text: await res.text() };
    } catch (e) {
      if (i === 2) throw e;
      await sleep(WAIT_MS * (i + 2));
    }
  }
}

// --- 数字の読み取り（collect-nlab.mjs と同じ型。意図的な複製） ---
function toNumber(s) {
  if (!s) return null;
  const z = s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[，,]/g, '').replace(/．/g, '.');
  const m = z.match(/^(?:(\d+(?:\.\d+)?)億)?(?:(\d+(?:\.\d+)?)万)?(\d+)?$/);
  if (!m) return null;
  const v = Math.round((m[1] ? parseFloat(m[1]) * 1e8 : 0) + (m[2] ? parseFloat(m[2]) * 1e4 : 0) + (m[3] ? parseInt(m[3], 10) : 0));
  return v > 0 ? v : null;
}
const NUM = '[0-9０-９][0-9０-９,，．.]*(?:億[0-9０-９,，]*)?(?:万[0-9０-９,，]*)?';
function findNear(body, unitRe, ctxRe, before = 16, after = 24) {
  const re = new RegExp(`(${NUM})\\s*${unitRe}`, 'g');
  let m;
  while ((m = re.exec(body))) {
    const ctx = body.slice(Math.max(0, m.index - before), m.index + m[0].length + after);
    if (ctxRe.test(ctx)) return { raw: m[1], value: toNumber(m[1]) };
  }
  return null;
}
const stripTags = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const fp = (s) => (s ? createHash('sha256').update(s.toLowerCase()).digest('hex').slice(0, 16) : null);

function parseArticle(id, html) {
  const published = (html.match(/"datePublished"\s*:\s*"([^"]+)"/) || [])[1] || null;
  const text = stripTags(html);
  const i = text.search(/スレッズ|Threads|threads/);
  const mentions = i >= 0 && /スレッズ|Threads/.test(text.slice(0, 6000));
  const body = i >= 0 ? text.slice(Math.max(0, i - 300), i + 3500) : '';
  const handle = (html.match(/https:\/\/(?:www\.)?threads\.(?:com|net)\/@([A-Za-z0-9._]+)/) || [])[1] || null;
  const views = findNear(body, '回', /表示|閲覧|再生|インプレッション/);
  const likes = findNear(body, '(?:件|個|人)', /いいね/);
  const stock = /写真はイメージ|イメージ画像|写真AC|ぱくたそ|PIXTA|ピクスタ|Adobe Firefly|イラストAC|Photo[ -]?AC|Getty|Adobe Stock/i.test(text.slice(0, 5000));
  return {
    article_id: String(id), published, mentions_threads: mentions, handle,
    views: views?.value ?? null, likes: likes?.value ?? null, stock_image: stock,
  };
}

const listIds = (html) => [...new Set([...html.matchAll(/https:\/\/hint-pot\.jp\/archives\/(\d+)"/g)].map((m) => m[1]))];

const readJson = (p, f) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : f);
function writeJson(p, o) { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); }

function summarize(rows) {
  const th = rows.filter((r) => r.mentions_threads);
  const uniq = new Set(th.map((r) => r.handle_fp || `a${r.article_id}`));
  return {
    articles_seen: rows.length,
    threads_articles: th.length,
    unique_posts: uniq.size,
    with_numbers: th.filter((r) => r.views || r.likes).length,
    stock_image_posts: th.filter((r) => r.stock_image).length,
    oldest: th.map((r) => r.published).filter(Boolean).sort()[0] || null,
    newest: th.map((r) => r.published).filter(Boolean).sort().at(-1) || null,
  };
}

function combined(hintRows) {
  const nl = readJson(NLAB_LEDGER, { rows: [] }).rows.filter((r) => r.mentions_threads && r.has_post_link);
  const hp = hintRows.filter((r) => r.mentions_threads);
  // ねとらぼは投稿URLの指紋、Hint-Pot は投稿者IDの指紋なので相互の重複は判定できない（別々に数える・重なりは少数と見込む）
  return { nlab_unique: new Set(nl.map((r) => r.post_fp)).size, hintpot_unique: new Set(hp.map((r) => r.handle_fp || `a${r.article_id}`)).size };
}

async function main() {
  const jobs = readJson(JOBS, {});
  if (!process.env.SUBSUKU_CLOUD && !args.force && jobs.threads_buzz === true) {
    console.log('Threads のバズ投稿の記事集めはクラウドの当番が担当（scripts/ops/cloud_jobs.json の threads_buzz）。PC では実行しない（--force で強制）');
    return;
  }
  const ledger = readJson(LEDGER, { _note: '', rows: [] });
  ledger._note = 'Hint-Pot の SNS タグ記事のうち、Threads（スレッズ）を扱うものの台帳。記事番号・日付・数字・投稿者IDの指紋（重複判定用）だけ。Threads の投稿URL・投稿者ID・見出しは入れない。道具は collect-hintpot.mjs。見た記事は Threads でなくても残し二度読まない。';
  const seen = new Set(ledger.rows.map((r) => r.article_id));

  if (args.report) {
    console.log(JSON.stringify({ hintpot: summarize(ledger.rows), combined: combined(ledger.rows), goal: GOAL }, null, 2));
    return;
  }

  const from = Number(args.from || 1);
  const to = Number(args.pages ? from + Number(args.pages) - 1 : args.to || from);
  let added = 0, readCount = 0, consecutiveKnown = 0;
  for (let p = from; p <= to; p++) {
    const { text: list, status } = await get(LIST(p));
    if (status === 404) break;
    const ids = listIds(list);
    if (!ids.length) break;
    await sleep(WAIT_MS);
    let newOnPage = 0;
    for (const id of ids) {
      if (seen.has(id)) continue;
      newOnPage++;
      const { text: html, status: st } = await get(ART(id));
      readCount++;
      await sleep(WAIT_MS);
      if (st === 404) { seen.add(id); continue; }
      const r = parseArticle(id, html);
      ledger.rows.push({
        article_id: r.article_id, published: r.published, mentions_threads: r.mentions_threads,
        handle_fp: fp(r.handle), views: r.views, likes: r.likes, stock_image: r.stock_image,
        checked_at: new Date().toISOString(),
      });
      seen.add(id);
      if (r.mentions_threads) added++;
    }
    // 日々の更新（--pages）で、既知の記事だけのページが続いたら深追いしない
    consecutiveKnown = newOnPage === 0 ? consecutiveKnown + 1 : 0;
    if (args.pages && consecutiveKnown >= 1) break;
    writeJson(LEDGER, { ...ledger, summary: { ...summarize(ledger.rows), updated_at: new Date().toISOString() } });
    console.log(`page ${p}: 新しく読んだ ${newOnPage} 件 / Threads 記事 累計 ${summarize(ledger.rows).threads_articles}`);
  }
  ledger.summary = { ...summarize(ledger.rows), updated_at: new Date().toISOString() };
  writeJson(LEDGER, ledger);
  const c = combined(ledger.rows);
  console.log(JSON.stringify({ read: readCount, threads_added: added, ...ledger.summary, ...c }, null, 2));
  if (c.nlab_unique + c.hintpot_unique >= GOAL) console.log('GOAL_REACHED');
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
