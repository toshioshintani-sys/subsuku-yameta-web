// IndexNow ping — 検索エンジンへURL更新を自動通知する（全自動集客の通知レイヤー）
//
// 仕組み: 本番の sitemap.xml を取得し、全URLを IndexNow API に1回のPOSTで送る。
//   IndexNow は Bing・Yandex 等が共有するプロトコル。Bing のインデックスは
//   ChatGPT search / Copilot 等のAI検索の引用元になるため、今週の律速
//   （AI検索引用最適化）の配信側を自動化する位置づけ。
//   ※ Google は IndexNow 非対応（Google向けは sitemap.xml ＋ 自然クロール。
//      Search Console 登録は俊雄さんのアカウント作業＝本スクリプトの対象外）。
//
// 実行: node scripts/seo/indexnow-ping.mjs [--dry-run]
//   - 本番 sitemap を読むので「実際に公開済みのURL」しか送らない（安全）。
//   - push直後に走らせた場合、そのデプロイの新URLは翌日の実行で拾われる（仕様）。
//   - 200/202 = 受理。それ以外は exit 1（朝会が失敗として報告する）。
//
// キー: public/<KEY>.txt として配信済み（IndexNow の所有権確認方式）。

const KEY = '7315f020dddb7ab2494b9c03227c43d7';
const HOST = 'sabusuku.netlify.app';
const SITE = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const dryRun = process.argv.includes('--dry-run');

async function main() {
  const res = await fetch(`${SITE}/sitemap.xml`, { headers: { 'User-Agent': 'subsuku-indexnow-ping' } });
  if (!res.ok) {
    console.error(`[indexnow] sitemap取得失敗: HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => u.startsWith(SITE));
  if (urls.length === 0) {
    console.error('[indexnow] sitemapにURLが無い');
    process.exit(1);
  }
  if (urls.length > 10000) urls.length = 10000; // IndexNow上限

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  };

  if (dryRun) {
    console.log(`[indexnow] dry-run: ${urls.length} URLs（先頭5件）`);
    urls.slice(0, 5).forEach((u) => console.log('  ' + u));
    return;
  }

  const ping = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  // 200 OK / 202 Accepted が受理。4xx はキー/形式の問題。
  if (ping.status === 200 || ping.status === 202) {
    console.log(`[indexnow] OK: ${urls.length} URLs を通知（HTTP ${ping.status}）`);
  } else {
    const body = await ping.text().catch(() => '');
    console.error(`[indexnow] 失敗: HTTP ${ping.status} ${body.slice(0, 200)}`);
    if (body.includes('UserForbiddedToAccessSite')) {
      // 共有サブドメイン(*.netlify.app)はBingがホスト未認証として弾く。
      // keyファイル自体は正常(本番200・内容一致)＝設定不備ではない。
      console.error(
        '[indexnow] → 原因: Bing/IndexNow がホスト未認証。' +
          'Bing Webmaster Tools(bing.com/webmasters)で sabusuku.netlify.app を追加し、' +
          'GSCからインポートして所有権確認を。緊急度低: Google/通常クロールは別経路で影響なし。' +
          '恒久対策はカスタムドメイン化。'
      );
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('[indexnow] 例外:', e.message);
  process.exit(1);
});
