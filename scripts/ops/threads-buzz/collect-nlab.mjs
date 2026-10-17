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
// 2つの表：
//   - 公開の台帳 nlab_ledger.json（git に入れる）：ねとらぼの記事番号・日付・表示数・いいね数・投稿リンクの有無だけ。
//     Threads の投稿URL・投稿者ID・見出しは入れない（ニュースサイトに出ている事実だけ）。重複の判定はこの台帳で行う。
//   - 手元の詳しい表 data/nlab_threads_posts.json（.gitignore）：投稿URL・投稿者ID・見出しも持つ。分析のときに使う。
//     クラウドでは毎回消えるので、分析のときは台帳の記事番号から記事を読み直して作り直せる（--rebuild-detail）。
//
// 担当の切り替え：scripts/ops/cloud_jobs.json の "threads_buzz" が true ならクラウドの当番が担当。
//   PC（SUBSUKU_CLOUD が無い環境）から呼ばれたら何もせずに終わる（--force で強制）。
//
// 使い方：
//   node scripts/ops/threads-buzz/collect-nlab.mjs --pages=2   # タグの先頭2ページを見て、台帳に無い記事だけ足す
//   node scripts/ops/threads-buzz/collect-nlab.mjs             # タグの全ページを見る
//   node scripts/ops/threads-buzz/collect-nlab.mjs --report    # 件数だけ表示（取得しない）
//   node scripts/ops/threads-buzz/collect-nlab.mjs --rebuild-detail  # 台帳の全記事を読み直して手元の詳しい表を作る（分析の前）

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(HERE, 'data');
const OUT = join(DATA_DIR, 'nlab_threads_posts.json');
const LEDGER = join(HERE, 'nlab_ledger.json');
const JOBS = join(HERE, '..', 'cloud_jobs.json');
const GOAL = 500;
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

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n');
}

// 投稿URLは台帳に入れない。重複の判定にだけ使う短い指紋（元に戻せない）を持つ
function fingerprint(url) {
  return url ? createHash('sha256').update(url).digest('hex').slice(0, 16) : null;
}

function toLedgerRow(r) {
  return {
    article_id: r.article_id,
    published: r.published,
    mentions_threads: r.mentions_threads,
    has_post_link: r.threads_post_urls.length > 0,
    post_fp: fingerprint(r.threads_post_urls[0]),
    views: r.views,
    likes: r.likes,
    checked_at: r.fetched_at,
  };
}

function summarize(rows) {
  const ok = rows.filter((r) => r.mentions_threads && r.has_post_link);
  return {
    articles: rows.length,
    with_post_link: ok.length,
    unique_posts: new Set(ok.map((r) => r.post_fp)).size,
    with_numbers: ok.filter((r) => r.views || r.likes).length,
    with_views: ok.filter((r) => r.views).length,
    with_likes: ok.filter((r) => r.likes).length,
    no_post_link: rows.filter((r) => !r.has_post_link).length,
    oldest: rows.map((r) => r.published).filter(Boolean).sort()[0] || null,
    newest: rows.map((r) => r.published).filter(Boolean).sort().at(-1) || null,
    goal: GOAL,
  };
}

async function main() {
  // 手元の詳しい表から台帳を初めて作る（移行用・一度きり）
  const detail = readJson(OUT, { meta: {}, rows: [] });
  let ledger = readJson(LEDGER, null);
  if (!ledger) {
    ledger = { _note: '', rows: detail.rows.map(toLedgerRow) };
  }
  ledger._note = 'ねとらぼの「Threads」タグ（https://nlab.itmedia.co.jp/relatedtags/threads/）の記事の台帳。記事番号・日付・表示数・いいね数・投稿リンクの有無だけを持つ。Threads の投稿URL・投稿者IDは入れない（post_fp は重複判定用の指紋）。道具は collect-nlab.mjs、方針は docs/THREADS_BUZZ_SOURCES_2026-10.md。unique_posts が goal（500）に届くまで分析しない。';

  if (args.report) { console.log(JSON.stringify(summarize(ledger.rows), null, 2)); return; }

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

  if (args['rebuild-detail']) {
    // 分析の前に：台帳の全記事を読み直して、手元の詳しい表（.gitignore）を作り直す
    const rows = [];
    for (const r of ledger.rows) {
      try {
        const { status, text } = await get(`https://nlab.itmedia.co.jp/cont/articles/${r.article_id}/`);
        if (status !== 404) rows.push(parseArticle(r.article_id, text));
      } catch (e) { console.error(`article ${r.article_id}: ${e.message}`); }
      await sleep(WAIT_MS);
    }
    writeJson(OUT, { meta: { rebuilt_at: new Date().toISOString() }, rows });
    console.log(`detail rebuilt: ${rows.length} rows -> ${OUT}`);
    return;
  }

  const jobs = readJson(JOBS, {});
  if (jobs.threads_buzz === true && !process.env.SUBSUKU_CLOUD && !args.force) {
    console.log('cloud_jobs.json の threads_buzz が true（クラウドの当番が担当）なので、PC では何もしない。');
    return;
  }

  const maxPages = args.pages ? Number(args.pages) : 50;
  const have = new Set(ledger.rows.map((r) => r.article_id));
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

  const before = summarize(ledger.rows).unique_posts;
  for (const id of todo) {
    try {
      const { status, text } = await get(`https://nlab.itmedia.co.jp/cont/articles/${id}/`);
      if (status === 404) continue;
      const r = parseArticle(id, text);
      ledger.rows.push(toLedgerRow(r));
      detail.rows.push(r);
    } catch (e) {
      console.error(`article ${id}: ${e.message}`);
    }
    await sleep(WAIT_MS);
  }
  const summary = summarize(ledger.rows);
  ledger.summary = { ...summary, updated_at: new Date().toISOString() };
  writeJson(LEDGER, ledger);
  writeJson(OUT, { meta: { updated_at: new Date().toISOString() }, rows: detail.rows });
  console.log(JSON.stringify(summary, null, 2));
  if (before < GOAL && summary.unique_posts >= GOAL) {
    console.log(`GOAL_REACHED: 重複なしの投稿が ${summary.unique_posts} 件になり、${GOAL} 件に届いた。分析に入れる。`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
