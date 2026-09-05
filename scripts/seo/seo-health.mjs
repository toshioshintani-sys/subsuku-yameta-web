// SEO健全性チェック — 本番サイトを外から見て、検索側が嫌う状態になっていないか調べる
//
// なぜ要るか（2026-09-02）：
//   Bing Webmaster Tools が「meta descriptionが短い15ページ」「タイトルが短い10ページ」を
//   指摘したが、それに気づいたのは俊雄さんが管理画面を開いたからだった。
//   Bing/GSC の管理画面はログインが要るので、無人タスクからは読めない（MCPサーバ未設定）。
//   一方、**指摘の中身の大半はサイト側だけで測れる**。ログイン不要で測れるものは
//   自分で測り、劣化したらSlackで知らせる。管理画面を見に行く動機を機械が作る。
//
// 測るもの（すべて本番の実HTMLから。ビルド成果物ではなく公開されている実物を見る）：
//   - sitemap.xml が引ける／URL数
//   - 各ページの <title> と meta description の長さ
//   - canonical の有無と自己参照
//   - robots.txt の Sitemap 宣言
//   - 主要ページの HTTP ステータス
//
// 実行: node scripts/seo/seo-health.mjs [--json]
//   閾値を割ったら exit 1（呼び出し側が失敗として扱える）。
//
// ⚠️ タイトルの下限は Bing の英語前提(15字)ではなく **12字** を採用している。
//    日本語は1文字あたりの情報量が違い、「DAZNの解約方法｜サブスクやめた」(17字)は
//    過不足なく伝わる。英語基準に合わせて伸ばすとキーワードの水増しになり、
//    煽らない方針(CLAUDE.md §2-2)と衝突する。ここは意図的に緩めてある。

const SITE = process.env.SEO_SITE_URL || 'https://sabusuku-yameta.com';
const TITLE_MIN = 12;
const DESC_MIN = 50;
const SAMPLE_LIMIT = Number(process.env.SEO_SAMPLE_LIMIT || 200);

// 検索流入を狙わないページ。短くても問題にしない（水増しする意味がない）。
const EXCLUDE = [/\/contact\/?$/, /\/disclaimer\/?$/, /\/privacy\/?$/, /\/disclosure\/?$/];

const jsonMode = process.argv.includes('--json');

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'subsuku-seo-health/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

const problems = [];
const note = (kind, url, detail) => problems.push({ kind, url, detail });

async function main() {
  // 1) robots.txt に Sitemap 宣言があるか（Bing はここから自動発見する）
  let robots = '';
  try {
    robots = await fetchText(`${SITE}/robots.txt`);
    if (!/^\s*Sitemap:\s*http/im.test(robots)) {
      note('robots', `${SITE}/robots.txt`, 'Sitemap 宣言が無い（検索エンジンが sitemap を自動発見できない）');
    }
  } catch (e) {
    note('robots', `${SITE}/robots.txt`, `取得できない: ${e.message}`);
  }

  // 2) sitemap から URL を集める
  let urls = [];
  try {
    const xml = await fetchText(`${SITE}/sitemap.xml`);
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length === 0) note('sitemap', `${SITE}/sitemap.xml`, 'URLが1件も入っていない');
  } catch (e) {
    note('sitemap', `${SITE}/sitemap.xml`, `取得できない: ${e.message}`);
  }

  const targets = urls.filter((u) => !EXCLUDE.some((re) => re.test(u))).slice(0, SAMPLE_LIMIT);

  // 3) 各ページの title / description / canonical を測る
  //    同時接続は絞る（相手は自分のサイトだが、行儀よく）。
  const CONC = 6;
  let checked = 0;
  for (let i = 0; i < targets.length; i += CONC) {
    const batch = targets.slice(i, i + CONC);
    await Promise.all(
      batch.map(async (url) => {
        let html;
        try {
          html = await fetchText(url);
        } catch (e) {
          note('http', url, `取得できない: ${e.message}`);
          return;
        }
        checked += 1;
        const title = pick(html, /<title>([\s\S]*?)<\/title>/i);
        const desc = pick(html, /<meta\s+name="description"\s+content="([\s\S]*?)"/i);
        const canonical = pick(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);

        if (!title) note('title', url, 'title が無い');
        else if (title.length < TITLE_MIN) note('title', url, `title が ${title.length}字（下限${TITLE_MIN}）: ${title}`);

        if (!desc) note('description', url, 'meta description が無い');
        else if (desc.length < DESC_MIN) note('description', url, `description が ${desc.length}字（下限${DESC_MIN}）: ${desc.slice(0, 40)}`);

        if (!canonical) note('canonical', url, 'canonical が無い');
        else if (canonical.replace(/\/$/, '') !== url.replace(/\/$/, ''))
          note('canonical', url, `canonical が自分自身を指していない: ${canonical}`);
      })
    );
  }

  const byKind = {};
  for (const p of problems) (byKind[p.kind] ||= []).push(p);

  if (jsonMode) {
    console.log(JSON.stringify({ site: SITE, sitemapUrls: urls.length, checked, problems }, null, 2));
  } else {
    console.log(`===== SEO健全性チェック（${SITE}）=====`);
    console.log(`sitemap ${urls.length} URL / 実測 ${checked} ページ / 除外 ${urls.length - targets.length} ページ`);
    console.log(`閾値: title ${TITLE_MIN}字以上 / description ${DESC_MIN}字以上`);
    console.log('');
    if (problems.length === 0) {
      console.log('✅ 問題なし。');
    } else {
      console.log(`❌ ${problems.length}件の指摘\n`);
      for (const [kind, list] of Object.entries(byKind)) {
        console.log(`【${kind}】${list.length}件`);
        for (const p of list.slice(0, 8)) console.log(`  ${p.url}\n    ${p.detail}`);
        if (list.length > 8) console.log(`  …ほか${list.length - 8}件`);
        console.log('');
      }
    }
  }

  process.exit(problems.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('seo-health が異常終了:', e.message);
  process.exit(2);
});
