# サブスクやめた

解約したいのに解約ページが見つからない、を1クリックで終わらせるサブスク解約インデックスサイト。

## 開発・ビルド

```bash
npm install
npm run dev      # 開発サーバー http://localhost:5173
npm run build    # 本番ビルド（dist/ に出力）
npm run lint     # ESLint
npm run preview  # dist/ をローカルでプレビュー http://localhost:4173
```

## 環境変数

| 変数名 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `VITE_SITE_URL` | No | `https://subsuku-yameta.netlify.app` | canonical・og:url・sitemap.xml に使用するオリジン（末尾スラッシュなし）。Netlify の環境変数設定画面で本番ドメインが確定したら設定する。 |

`.env` ファイルで上書き可能：

```
VITE_SITE_URL=https://subsuku-yameta.com
```

## ビルド成果物

`npm run build` は SPA を `dist/` に出力し、加えて以下を自動生成する：

- `dist/sitemap.xml` — 公開ルート全件（`/`・全 `/service/:id`・全 `/category/:id`（`all` 除く）・静的ページ）。`vite-plugin-sitemap.js` が生成。
- `dist/robots.txt` — `Allow: /` と `Sitemap:` 行を含む標準的な内容。

**これらは自動生成なので手編集・コミット禁止**。本番ドメインが確定したら `VITE_SITE_URL` を設定して再ビルドすれば反映される。

## デプロイ（Netlify）

1. GitHub リポジトリと Netlify を接続
2. Build command: `npm run build`、Publish directory: `dist`
3. Environment variables に `VITE_SITE_URL=https://<確定ドメイン>` を設定
4. デプロイ後、`https://<確定ドメイン>/sitemap.xml` を Google Search Console に登録

## プロジェクト構成

```
src/
  config.js          # SITE_URL など全体設定（ここだけ変えれば全体に反映）
  data/services.js   # サービスデータ（SERVICES・CATEGORIES）
  components/
    Seo.jsx          # title・description・canonical・og:url・JSON-LD を管理
    Header.jsx
    Footer.jsx
    ServiceIcon.jsx
  pages/
    HomePage.jsx
    ServicePage.jsx  # HowTo JSON-LD を出力
    CategoryPage.jsx
    AboutPage.jsx / PrivacyPage.jsx / DisclaimerPage.jsx / ContactPage.jsx
    NotFoundPage.jsx
vite-plugin-sitemap.js  # ビルド時に sitemap.xml / robots.txt を生成
docs/
  STRATEGY.md   # コンセプト・収益戦略
  SITEMAP.md    # ルート設計・実装フェーズ
```
