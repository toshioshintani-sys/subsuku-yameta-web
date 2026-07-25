#!/usr/bin/env node
/**
 * fetch-pages.mjs — 調査用に公式ページの本文をまとめて取ってくる（2026-07-26 追加）
 *
 * ■ なぜ要るのか（実測にもとづく）
 *   2026-07-26、7サービスの価格調査に **36.5分** かかった。内訳を測ると、
 *   ボトルネックはモデルではなく **Web取得の往復** だった：
 *     ・1回のページ取得に約 9〜11秒
 *     ・調査役1体あたり 40〜70回叩く（検索してURLを探す往復が大半）
 *     ・→ 1体で8〜14分。並列にしても「最長の1体＋その検証」が全体時間になる
 *
 *   このスクリプトは **取得だけ** を並列でやる。20ページでも数分で終わる。
 *   取れた本文をそのまま読めば、調査エージェントを立てる必要すらなくなり、
 *   サブエージェントのトークンがゼロになる。
 *
 *   ＝ **取得（機械・速い・無料）と 判断（人/Claude・遅い・高い）を分ける。**
 *
 * ■ 使い方
 *   node scripts/price-watch/fetch-pages.mjs netflix spotify        # watch-list のURLを使う
 *   node scripts/price-watch/fetch-pages.mjs --all                  # enabled 全件
 *   node scripts/price-watch/fetch-pages.mjs --url https://example.com/pricing
 *   node scripts/price-watch/fetch-pages.mjs netflix --out tmp/pages.md
 *
 *   既定では「金額を含む行」だけを、直前の行（プラン名になりやすい）とセットで出す。
 *   全文が要るときは --full。
 *
 * ■ 注意
 *   ここで取れるのは素材であって答えではない。**誤報ゼロ原則は変わらない**——
 *   出てきた数字をそのまま services.js に書かず、プラン名との対応・割引と通常価格の別・
 *   税込税別・アプリ内課金の差を、必ず自分の目で確かめること。
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');

const MONEY = /[¥￥]\s?[\d,]+|\d[\d,]*\s?円|\$\s?[\d,.]+/;
const CONCURRENCY = 5; // 相手サイトに迷惑をかけない範囲で並列

function parseArgs(argv) {
  const ids = [];
  const urls = [];
  let out = null;
  let full = false;
  let all = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') all = true;
    else if (a === '--full') full = true;
    else if (a === '--out') out = argv[++i];
    else if (a === '--url') urls.push(argv[++i]);
    else if (!a.startsWith('--')) ids.push(a);
  }
  return { ids, urls, out, full, all };
}

async function main() {
  const { ids, urls, out, full, all } = parseArgs(process.argv.slice(2));

  const wl = JSON.parse(readFileSync(resolve(HERE, 'watch-list.json'), 'utf-8'));
  const list = wl.watch || wl.targets || [];
  const timeoutMs = wl.settings?.timeoutMs || 35000;

  let targets = [];
  if (all) targets = list.filter((w) => w.enabled !== false).map((w) => ({ id: w.id, url: w.url }));
  else if (ids.length) {
    for (const id of ids) {
      const hit = list.find((w) => w.id === id);
      if (!hit) {
        console.error(`  ⚠ watch-list に "${id}" が無い。--url で直接指定してください`);
        continue;
      }
      targets.push({ id: hit.id, url: hit.url });
    }
  }
  urls.forEach((u, i) => targets.push({ id: `url${i + 1}`, url: u }));

  if (!targets.length) {
    console.error('対象がありません。サービスidか --url か --all を指定してください。');
    process.exit(1);
  }

  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--lang=ja-JP'],
  });

  const started = Date.now();
  const results = [];

  // 並列（ただし CONCURRENCY 本まで）。相手ごとに1タブ。
  let cursor = 0;
  async function worker() {
    while (cursor < targets.length) {
      const t = targets[cursor++];
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({ 'accept-language': 'ja' });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      );
      const t0 = Date.now();
      try {
        await page.goto(t.url, { waitUntil: 'networkidle2', timeout: timeoutMs });
        await page.waitForFunction(
          () => document.body && document.body.innerText.replace(/\s/g, '').length > 80,
          { timeout: 8000 }
        ).catch(() => {});
        const text = await page.evaluate(() => (document.body ? document.body.innerText : ''));
        results.push({ ...t, ok: true, ms: Date.now() - t0, text });
      } catch (e) {
        results.push({ ...t, ok: false, ms: Date.now() - t0, error: String(e.message || e).slice(0, 120) });
      } finally {
        await page.close();
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker));
  await browser.close();

  results.sort((a, b) => targets.findIndex((t) => t.id === a.id) - targets.findIndex((t) => t.id === b.id));

  const lines = [];
  lines.push(`# 公式ページ取得結果（${targets.length}件・${((Date.now() - started) / 1000).toFixed(1)}秒）`);
  lines.push('');
  lines.push('⚠️ ここにあるのは素材であって答えではない。プラン名との対応・割引と通常価格の別・');
  lines.push('　 税込税別・アプリ内課金の差を必ず自分の目で確かめてから services.js に書くこと。');
  lines.push('');

  for (const r of results) {
    lines.push(`## ${r.id}`);
    lines.push(r.url);
    if (!r.ok) {
      lines.push(`❌ 取得失敗（${(r.ms / 1000).toFixed(1)}秒）: ${r.error}`);
      lines.push('');
      continue;
    }
    lines.push(`✅ ${(r.ms / 1000).toFixed(1)}秒 / 本文 ${r.text.length}字`);
    if (r.text.length < 300) {
      lines.push('⚠️ 本文が極端に短い＝JS/アプリ前提のページの可能性。別URLを探すこと。');
    }
    lines.push('');
    if (full) {
      lines.push('```');
      lines.push(r.text.slice(0, 20000));
      lines.push('```');
    } else {
      const L = r.text.split('\n').map((s) => s.trim()).filter(Boolean);
      let hit = 0;
      L.forEach((l, i) => {
        if (!MONEY.test(l) || l.length > 140) return;
        hit++;
        const prev = L[i - 1] && L[i - 1].length < 60 ? `[${L[i - 1]}] ` : '';
        lines.push(`- ${prev}${l}`);
      });
      if (!hit) lines.push('（金額を含む行が見つからなかった）');
    }
    lines.push('');
  }

  const body = lines.join('\n');
  if (out) {
    const p = resolve(ROOT, out);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, body + '\n', 'utf-8');
    console.log(body.split('\n').slice(0, 4).join('\n'));
    console.log(`\n→ ${out} に書き出しました`);
  } else {
    console.log(body);
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length) console.error(`\n取得できなかったもの: ${failed.map((f) => f.id).join(', ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
