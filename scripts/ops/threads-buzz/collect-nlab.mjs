#!/usr/bin/env node
// ねとらぼの「Threads」タグから、Threadsでバズった投稿の記事を集める（2026-10-17）
//
// 目的：世の中の日本のThreadsのバズ投稿を500件以上集め、傾向を分析する（docs/THREADS_BUZZ_SOURCES_2026-10.md）。
// 方針：
//   - ニュースサイトを読むだけ。threads.com には一切アクセスしない（Meta 規約 3.2 の自動収集禁止を避ける）。
//   - 保存するのは事実だけ（Threads の投稿URL・表示数・いいね数・記事の日付・記事URL）。
//     記事の本文・写真は保存しない。見出しは手元で見分けるためだけに持つ（公開しない）。
//   - 出力は data/（.gitignore 済み・公開リポジトリに他人の投稿URLを置かない）。
//   - 数字が読み取れなかった記事も行として残す（has_numbers=false）。抜き出して報告しない。
//   - 1リクエストごとに間隔を空ける（既定 4 秒）。
//
// 使い方：
//   node scripts/ops/threads-buzz/collect-nlab.mjs            # タグ全ページを読み、未取得の記事だけ追加
//   node scripts/ops/threads-buzz/collect-nlab.mjs --pages=1  # 先頭ページだけ（新着の追加用）
//   node scripts/ops/threads-buzz/collect-nlab.mjs --report   # 件数だけ表示（取得しない）

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(HERE, 'data');
const OUT = join(DATA_DIR, 'nlab_threads_posts.json');
const TAG = 'https://nlab.itmedia.co.jp/relatedtags/threads/';
const UA = 'Mozilla/5.0 (research; subsuku-yameta internal analysis)';
const WAIT_MS = Number(process.env.WAIT_MS || 4000);

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

// 全角数字・カンマを正規化し、「113万」「2万3000」「1,100」を数値にする
function toNumber(s) {
  if (!s) return null;
  const z = s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[，,]/g, '').replace(/．/g, '.');
  const m = z.match(/^(?:(\d+(?:\.\d+)?)億)?(?:(\d+(?:\.\d+)?)万)?(\d+)?$/);
  if (!m) return null;
  const oku = m[1] ? parseFloat(m[1]) * 1e8 : 0;
  const man = m[2] ? parseFloat(m[2]) * 1e4 : 0;
  const one = m[3] ? parseInt(m[3], 10) : 0;
  const v = Math.round(oku + man + one);
  return v > 0 ? v : null;
}

const NUM = '[0-9０-９][0-9０-９,，．.]*(?:億[0-9０-９,，]*)?(?:万[0-9０-９,，]*)?';

// 数値の直前直後の文脈に語が含まれるものだけを採る（関連記事の見出しを拾わないよう本文だけを見る）
function findNear(body, unitRe, ctxRe, before = 16, after = 24) {
  const re = new RegExp(`(${NUM})\\s*${unitRe}`, 'g');
  let m;
  while ((m = re.exec(body))) {
    const s = Math.max(0, m.index - before);
    const ctx = body.slice(s, m.index + m[0].length + after);
    if (ctxRe.test(ctx)) return { raw: m[1], value: toNumber(m[1]) };
  }
  return null;
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
}

function parseArticle(id, html) {
  const published = (html.match(/"datePublished"\s*:\s*"([^"]+)"/) || [])[1] || null;
  const title = ((html.match(/<title>([^<]+)<\/title>/) || [])[1] || '').replace(/\s*\|\s*ねとらぼ.*$/, '').trim();
  const postUrls = [...new Set([...html.matchAll(/https:\/\/www\.threads\.(?:com|net)\/@[A-Za-z0-9._]+\/post\/[A-Za-z0-9_-]+/g)].map((m) => m[0].replace('threads.net', 'threads.com')))];
  const profileUrls = [...new Set([...html.matchAll(/https:\/\/www\.threads\.(?:com|net)\/@([A-Za-z0-9._]+)/g)].map((m) => m[1]))];
  const text = stripTags(html);
  const i = text.indexOf('Threads');
  const body = i >= 0 ? text.slice(i, i + 4000) : '';
  const views = findNear(body, '回', /表示|閲覧/);
  const likes = findNear(body, '件', /いいね/);
  return {
    source: 'nlab',
    article_id: String(id),
    article_url: `https://nlab.itmedia.co.jp/cont/articles/${id}/`,
    published,
    title,
    mentions_threads: i >= 0,
    threads_post_urls: postUrls,
    threads_handles: profileUrls,
    views: views?.value ?? null,
    views_raw: views?.raw ?? null,
    likes: likes?.value ?? null,
    likes_raw: likes?.raw ?? null,
    has_numbers: Boolean(views || likes),
    fetched_at: new Date().toISOString(),
  };
}

// タグ一覧の本体（1ページ50件のブロック）からだけ記事IDを取る。関連記事・ランキング欄は除く
function listIds(html) {
  const blocks = html.split('bg-white flex items-start gap-[10px]').slice(1);
  const ids = [];
  for (const b of blocks) {
    const m = b.match(/\/cont\/articles\/(\d+)\//);
    if (m && !ids.includes(m[1])) ids.push(m[1]);
  }
  return ids;
}

function load() {
  if (!existsSync(OUT)) return { meta: {}, rows: [] };
  return JSON.parse(readFileSync(OUT, 'utf8'));
}

function save(db) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(OUT, JSON.stringify(db, null, 2));
}

function summarize(db) {
  const rows = db.rows;
  const ok = rows.filter((r) => r.mentions_threads && r.threads_post_urls.length > 0);
  const uniquePosts = new Set(ok.flatMap((r) => r.threads_post_urls.slice(0, 1)));
  return {
    articles: rows.length,
    threads_articles_with_post_link: ok.length,
    unique_posts: uniquePosts.size,
    with_numbers: ok.filter((r) => r.has_numbers).length,
    with_views: ok.filter((r) => r.views).length,
    with_likes: ok.filter((r) => r.likes).length,
    no_threads_mention: rows.filter((r) => !r.mentions_threads).length,
    no_post_link: rows.filter((r) => r.mentions_threads && r.threads_post_urls.length === 0).length,
    oldest: rows.map((r) => r.published).filter(Boolean).sort()[0] || null,
    newest: rows.map((r) => r.published).filter(Boolean).sort().at(-1) || null,
  };
}

async function main() {
  const db = load();
  if (args.report) { console.log(JSON.stringify(summarize(db), null, 2)); return; }
  if (args.ids) {
    // 読み取りの確認用：保存せずに指定記事の解析結果だけを出す
    for (const id of String(args.ids).split(',')) {
      const { text } = await get(`https://nlab.itmedia.co.jp/cont/articles/${id}/`);
      const r = parseArticle(id, text);
      console.log(JSON.stringify({ id, published: r.published, post: r.threads_post_urls[0] || null, views: r.views, views_raw: r.views_raw, likes: r.likes, likes_raw: r.likes_raw }));
      await sleep(WAIT_MS);
    }
    return;
  }

  const maxPages = args.pages ? Number(args.pages) : 50;
  const have = new Set(db.rows.map((r) => r.article_id));
  const ids = [];
  for (let p = 1; p <= maxPages; p++) {
    const url = p === 1 ? TAG : `${TAG}page/${p}/`;
    const { status, text } = await get(url);
    if (status === 404) break;
    const found = listIds(text);
    console.log(`tag page ${p}: ${found.length} articles`);
    if (found.length === 0) break;
    ids.push(...found);
    await sleep(WAIT_MS);
  }
  const todo = [...new Set(ids)].filter((id) => !have.has(id));
  console.log(`listed ${new Set(ids).size}, new ${todo.length}`);

  let n = 0;
  for (const id of todo) {
    try {
      const { status, text } = await get(`https://nlab.itmedia.co.jp/cont/articles/${id}/`);
      if (status === 404) continue;
      db.rows.push(parseArticle(id, text));
    } catch (e) {
      console.error(`article ${id}: ${e.message}`);
    }
    n++;
    if (n % 25 === 0) { save(db); console.log(`  ${n}/${todo.length}`); }
    await sleep(WAIT_MS);
  }
  db.meta = { updated_at: new Date().toISOString(), tag: TAG, summary: summarize(db) };
  save(db);
  console.log(JSON.stringify(db.meta.summary, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
