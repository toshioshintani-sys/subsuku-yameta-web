# 朝の報告書 — 2026-05-20 深夜作業分

おはようございます。寝ている間に Phase B（戦略ドキュメントで「次のフェーズ」として書いた SEO 強化＋アフィリエイト導線の土台）まで完成させて本番デプロイ済みです。

## 公開URL（朝イチで動作確認してほしい）

- **本番サイト**: https://sabusuku.netlify.app
- **GitHub**: https://github.com/toshioshintani-sys/subsuku-yameta-web
- **サイトマップ**: https://sabusuku.netlify.app/sitemap.xml
- **robots.txt**: https://sabusuku.netlify.app/robots.txt

## 今夜やったこと（自動）

### 1. 死んだチャットが作っていた PR #1 の救出

`claude/check-computer-connection-YfLz8` ブランチを main にマージ。netlify.toml を維持しつつ、以下を本番に統合：

- `vite-plugin-sitemap.js` — ビルド時に sitemap.xml と robots.txt を 59 URL 分自動生成
- `src/config.js` — `SITE_URL` を一元管理（環境変数 `VITE_SITE_URL` で上書き可）
- `Seo.jsx` を拡張 — `canonical`・`ogUrl`・`jsonLd` プロパティに対応
- 全ページに canonical URL を追加（404 を除く）
- ServicePage に HowTo JSON-LD（Google リッチリザルト対応）を埋め込み

ただし PR が `subsuku-yameta.netlify.app` という存在しない URL をハードコードしていたので、実際の本番 URL `sabusuku.netlify.app` に修正しました。

### 2. データ拡張：31 → 47 サービス（+16）

人気の日本系サブスクを 16 件追加：

| カテゴリ | 追加したサービス |
|---|---|
| 動画 | WOWOWオンデマンド・FOD・Lemino（旧dTV）・DMMプレミアム |
| 音楽 | （特になし — 主要は網羅済み） |
| 読み放題・ニュース | Audible・楽天マガジン・dマガジン・noteプレミアム |
| ソフト・ツール | 1Password・Figma・DeepL Pro・GitHub Copilot |
| バンドル・その他 | Apple One・Google One・iCloud+・Yahoo!プレミアム・Pairs |

特に **Audible は「アプリから絶対に解約できない」「PC ブラウザ必須」という落とし穴を明記** しました。これは SEO 流入後の「あ、ここは違う」と離脱を防ぐ重要情報。

### 3. 解約後の選択肢セクション（アフィリエイト導線の土台）

ServicePage 末尾に「**解約したあなたへ：別の選択肢**」セクションを追加。47 サービス中 46 件に代替案を設定済み。

設計の特徴：
- **押し売り厳禁**：「無理に乗り換える必要はありません」という前置きを付ける
- **内部リンク**（他サービスの解約ページへ）と **外部リンク**（無料代替）を混在させる
- 外部リンクには `rel="sponsored noopener noreferrer"` を付与済み → **後からアフィリエイトID を URL に差し込むだけ** で収益化可能
- 例：Netflix 解約者 → Disney+・Amazon Prime・YouTube（無料） の3択
- 例：Adobe CC 解約者 → Figma・Canva・GIMP（全て無料）の3択

データは `src/data/services.js` の `ALTERNATIVES` マップで一元管理。新サービス追加時に編集しやすい構造。

### 4. SEO 仕上げ

- **OG 画像**：プレースホルダの SVG（`public/og-image.svg`）を追加。X・Discord・Slack でリンクを貼ると見栄えするデザインカード
- **Google Search Console verification 用コメント** を `index.html` 内に配置。GSC で取得した meta タグを差し込む位置を明示
- **description / OGP 説明文** を「30以上」→「48以上」に更新

## あなたが朝にやること（合計 10 分）

### 必須（5 分）

1. 本番 URL `https://sabusuku.netlify.app` を開いて、件数が **47件** になっているか確認
2. 適当なサービス（例：`/service/netflix`）を開いて、ページ末尾に「解約したあなたへ：別の選択肢」セクションが出ているか確認
3. `/about` `/category/video` を直接 URL 叩いて 404 にならないか確認（SPA リダイレクト動作確認）

### 推奨（10 分）

1. **Google Search Console** で `sabusuku.netlify.app` のサイト登録：
   - https://search.google.com/search-console にアクセス
   - 「プロパティを追加」→「URL プレフィックス」→ `https://sabusuku.netlify.app` 入力
   - HTML タグ方式を選択 → 表示される `<meta name="google-site-verification" content="..." />` を `index.html` の指定位置（コメントで明示済み）に貼り付け
   - git push → Netlify 再デプロイ → 「確認」ボタンで完了
   - その後 sitemap.xml を登録（`https://sabusuku.netlify.app/sitemap.xml`）

2. **アフィリエイト ID の発行**（時間があるとき）：
   - **A8.net** または **もしもアフィリエイト** に登録
   - 動画系（U-NEXT, Hulu, Disney+ など）、音楽系（Spotify）の提携を申請
   - 承認後、`src/data/services.js` の ALTERNATIVES 内の url に `?a8mat=YOUR_ID` などのパラメータを追加

## 残課題（朝以降の作業候補）

優先度順：

1. **GSC 登録 + sitemap 送信** — 上記 1（10 分・最重要）
2. **アフィリエイト ID 発行 + URL 差し替え** — 上記 2（30〜60 分）
3. **データ拡張 47 → 60+** — まだ抜けている人気サブスク（マッチドットコム、メルカリプレミアム、Discord Nitro、Linkedin Premium 等）
4. **OG 画像の本番品質化** — 現状 SVG のプレースホルダなので、Canva などで PNG 版を作って `public/og-image.png` に差し替え + index.html を更新
5. **独自ドメイン取得** — `subsuku-yameta.com` などを Namecheap / お名前.com で取得し Netlify Domain management で接続。SEO 信頼性が一段上がる
6. **棚卸しツール（`/tracker`）** — 戦略の Stage 3、ローカルストレージでサブスク合計月額を可視化するミニアプリ

## ファイルの場所

- 戦略ドキュメント：`docs/STRATEGY.md`
- サイト設計：`docs/SITEMAP.md`
- 今朝の報告書：`docs/MORNING_REPORT_2026-05-20.md`（このファイル）
- メインデータ：`src/data/services.js`（SERVICES + ALTERNATIVES）

---

おやすみなさい 🌙 → おはようございます ☀️

— Claude（Opus 4.7）
