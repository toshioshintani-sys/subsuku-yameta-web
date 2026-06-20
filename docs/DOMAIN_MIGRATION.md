# 独自ドメイン移行キット（サブスクやめた）— 2026-06-20

> 律速＝集客。その中でも**検索インデックス≈0**（GA4: 自然検索1/28日・`site:sabusuku.netlify.app`で自社ページ0件）。
> 原因はサイトの作りではない（sitemap全網羅・robots・GSC検証済・IndexNow・RSS・llms.txt・prerender・HowTo/FAQ/Breadcrumb構造化データ＝**基盤は完成・優秀**）。
> 原因は**ドメイン権威の天井**＝`sabusuku.netlify.app`（無料サブドメイン）。他2PJ（life-oracle.jp / thestackletter.com）は独自ドメイン済。ここだけ未取得。
> **＝独自ドメイン移行が最大の一手。** ただし効きは遅い（再インデックス＋順位は数週間〜・権威は時間で積む）。天井を外す必要条件であって、即流入ではない。

---

## 俊雄さんがやること（原子操作＝決定/購入のみ）
1. **ドメインを取得**（年1,000〜4,000円）。候補例（早い者勝ち・要空き確認）：
   - `sabusuku-yameta.com` / `subsuku-yameta.com`（ブランド一致）
   - `sabusuku.jp`（短い・日本特化・.jpは信頼高だが高め）
   - ※ ブランド名「サブスクやめた」と整合する短いものを。ハイフン1個までが無難。
   レジストラ例：お名前.com / Cloudflare Registrar（原価・推奨）/ Google Domains後継(Squarespace)。
2. ドメインを決めたら**私に伝える**→ 下記の技術移行を私が一括実行（DNS手順は私が用意・DNS設定の最終クリックは俊雄さん）。

## 私がやること（ドメイン確定後・一括）
- [ ] **Netlify**：Domain management → 独自ドメイン追加 → DNS（Netlify DNS or 既存レジストラにCNAME/A）→ 自動HTTPS(Let's Encrypt)。
- [ ] **`VITE_SITE_URL`** を Netlify 環境変数に `https://<新ドメイン>` で設定（→ `config.js`・`vite-plugin-sitemap.js` が全URL・canonical・sitemap・feed・llms.txt を自動で新ドメインに）。
- [ ] **index.html の静的タグ更新**（env非適用の4箇所）：`canonical` / `og:url` / `og:image` / `twitter:image`(L49,50,56,57) を新ドメインに。
- [ ] **ハードコードURLの掃除**（移行で旧ドメインが漏れるとcanonical分裂＝SEO悪化）：
      `scripts/seo/indexnow-ping.mjs`(HOST)・`pins-data.mjs`(SITE)・`gen-syndication.mjs`(SITE)・`pinterest-auth.mjs`(REDIRECT)・`monitoring/config/sites.json`・`TrackerPage.jsx`(L178)。
      → これらは **VITE_SITE_URL から読む形に私がパラメータ化**（次回から二度と直さなくて済む）。画像生成の透かし(note/pin)は順次。
- [ ] **301リダイレクト**：`sabusuku.netlify.app/*` → `https://<新ドメイン>/:splat`（netlify.toml `[[redirects]] force=true` or Netlify Domain設定）。重複コンテンツ回避＋わずかな旧リンク資産の引継ぎ。
- [ ] **GSC**：新ドメインを**ドメインプロパティ**で追加（DNS TXT検証）→ sitemap.xml 送信 → 主要ページに「インデックス登録をリクエスト」。旧プロパティで**アドレス変更ツール**(旧→新)。
- [ ] **Bing Webmaster / IndexNow**：HOSTを新ドメインに。IndexNowキーファイルは新ドメイン直下に配置。
- [ ] **GA4**：プロパティ(538470329)は不変。新ホスト名でデータ継続（必要なら hostname を確認用に）。
- [ ] **告知面の更新**：note転載フッター・Pinterest透かし・llms.txt（自動更新）・SNSプロフィール。

## 移行後の検証（私が実測）
- `site:<新ドメイン>` で自社ページが出るか（数日〜数週間）。
- GSC「ページ」レポート：**登録済み(indexed)** か **検出-インデックス未登録** か。後者が続く＝まだ権威/信頼が足りない（時間＋被リンク）。
- GA4：自然検索セッションの推移。

## 正直な期待値（誇張しない）
- ドメイン移行は**天井を外す必要条件**であって、**即・流入増ではない**。再クロール＋順位形成に数週間。競合"解約"クエリは強く、長期は被リンク/権威/コンテンツ深さも要る。
- ただし**今はその土台（独自ドメイン）自体が無い**＝伸びる前提が欠けている。だから最優先で外す。

---
## 移行前にやっておけること（ドメイン未確定でも私が今できる）
- 上記「ハードコードURLの掃除」を **VITE_SITE_URL 駆動にパラメータ化**しておく（挙動不変・移行時に env 1個で全置換）。
- → これを今やるか、ドメイン確定時にまとめてやるかは俊雄さん次第（どちらでも結果は同じ）。

*記録 2026-06-20 / 診断はGA4実測＋site:検索＋コード監査に基づく*
