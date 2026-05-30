// プリレンダ（SSG）スクリプト
// 目的：純CSRのSPAだとクローラーが空のHTML（<div id="root"></div>）を見て
//       AdSense「有用性の低いコンテンツ」と判定する。実描画したHTMLを各ルートの
//       index.html に焼き込み、クローラー/AI検索にも中身を見せる。
//
// 方式：vite build 後に `vite preview` を起動 → Puppeteer で各URLを実描画 →
//       document 全体のHTMLを dist/<route>/index.html に保存。
//       バージョン依存の脆いSSGプラグインを使わず、実ブラウザ描画なので堅牢。
//
// 安全性：Netlify はビルド失敗時に前回の正常デプロイを維持するため本番は落ちない。
//         netlify.toml の SPA フォールバックは force=false ＝ 静的ファイル優先なので
//         焼き込んだ per-route HTML がそのまま配信される。

import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const PORT = 4317;
const DIST = 'dist';

function getRoutes() {
  // dist/sitemap.xml（vite build で生成済み）から URL を取得
  const smPath = join(DIST, 'sitemap.xml');
  if (!existsSync(smPath)) {
    console.warn('[prerender] sitemap.xml が無いため / のみ対象にします');
    return ['/'];
  }
  const xml = readFileSync(smPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => {
    try {
      return new URL(m[1]).pathname;
    } catch {
      return null;
    }
  });
  const routes = Array.from(new Set(locs.filter(Boolean)));
  return routes.length ? routes : ['/'];
}

function outPathFor(route) {
  if (route === '/' || route === '') return join(DIST, 'index.html');
  const clean = route.replace(/^\/+/, '').replace(/\/+$/, '');
  return join(DIST, clean, 'index.html');
}

async function main() {
  const routes = getRoutes();
  console.log(`[prerender] 対象 ${routes.length} ルート`);

  const server = await preview({ preview: { port: PORT, strictPort: true } });
  const base = `http://localhost:${PORT}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const results = [];
  let ok = 0;
  let fail = 0;

  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 45000 });
      // React 描画 + Seo 副作用の完了を待つ（#main に十分な本文が入るまで）
      await page
        .waitForFunction(
          () => {
            const m = document.querySelector('#main');
            return m && m.innerText && m.innerText.replace(/\s/g, '').length > 40;
          },
          { timeout: 15000 }
        )
        .catch(() => {});
      const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML);
      results.push({ route, html });
      ok++;
      process.stdout.write(`\r[prerender] ${ok}/${routes.length} ...`);
    } catch (e) {
      fail++;
      console.warn(`\n[prerender] 失敗 ${route}: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  // すべて描画し終えてから書き出す（描画中の dist 上書きによる相互影響を避ける）
  for (const { route, html } of results) {
    const out = outPathFor(route);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }

  await browser.close();
  await server.httpServer.close();

  console.log(`\n[prerender] 完了：成功 ${ok} / 失敗 ${fail}`);
  // 致命的（1ページも描画できない）の時だけビルドを失敗させる
  if (ok === 0) {
    console.error('[prerender] 0ページ。プリレンダ失敗としてビルドを中断します。');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('[prerender] 例外：', e);
  process.exit(1);
});
