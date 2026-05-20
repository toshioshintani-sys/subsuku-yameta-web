# サブスクやめた — サイトマップ・設計

## 1. ルート構成

| パス | コンポーネント | 役割 | SEO 主要 KW |
|---|---|---|---|
| `/` | `HomePage` | サービス一覧・検索・カテゴリフィルタ | `サブスク 解約 まとめ` |
| `/service/:id` | `ServicePage` | サービス別の解約手順・直リンク | `<service> 解約` |
| `/category/:id` | `CategoryPage`（新規） | カテゴリ別ランディング（動画／音楽…） | `動画 サブスク 解約` |
| `/about` | `AboutPage`（新規） | サイトの目的・運営方針 | （指名検索） |
| `/privacy` | `PrivacyPage`（新規） | プライバシーポリシー | （法的必須） |
| `/disclaimer` | `DisclaimerPage`（新規） | 免責事項 | （法的必須） |
| `/contact` | `ContactPage`（新規） | お問い合わせ／追加リクエスト | （信頼性シグナル） |
| `*` | `NotFoundPage`（新規） | 404 + 一覧へ戻る導線 | — |

## 2. グローバルレイアウト

```
<BrowserRouter>
  <Header />              ← 既存（ロゴ）
  <Routes>... </Routes>
  <Footer />              ← 新規
</BrowserRouter>
```

### Footer の内容

- ナビゲーション：トップ／このサイトについて／プライバシー／免責／問い合わせ
- カテゴリショートカット（動画・音楽・ソフト・ゲーム・ニュース）
- コピーライト

## 3. コンポーネント分割

### 既存（流用）

- `components/Header.jsx` — そのまま
- `components/ServiceIcon.jsx` — そのまま（Clearbit ロゴ → emoji フォールバック）

### 新規

- `components/Footer.jsx` — グローバルフッタ
- `components/Seo.jsx` — `useEffect` で `document.title` と `meta[name=description]` を書き換える軽量 SEO ヘルパー（react-helmet 不要、依存追加なし）
- `components/ServiceCard.jsx` — `HomePage` のカード描画を切り出し（CategoryPage で再利用）

## 4. データ拡張プラン

`src/data/services.js` は現状 31 サービス。100 サービスまで段階的に追加。

将来の拡張フィールド：

```js
{
  id, name, category, emoji, domain, cancelUrl, difficulty, steps, note,
  monthlyPriceJpy: 1490,        // 月額（棚卸し機能で使う）
  hasDarkPattern: true,         // 引き止め画面の有無
  alternatives: ['hulu', ...],  // Stage 2 でアフィ導線に使う
  updatedAt: '2026-05-19',      // 手順の鮮度
}
```

## 5. SEO 実装方針

### index.html

- `<html lang="ja">`
- `<title>` と `<meta name="description">` の初期値
- OGP（`og:title` `og:description` `og:image` `og:url`）
- Twitter Card
- `theme-color`、`canonical`、`robots`

### ページ別タイトル（`Seo` コンポーネント）

| ページ | title | description |
|---|---|---|
| `/` | `サブスクやめた｜解約ページへ1クリックで飛べるサイト` | `Netflix・Spotify・Amazonプライム…30以上のサブスクの解約ページへ直接ジャンプ。手順と注意点も3ステップで要約。` |
| `/service/:id` | `〇〇の解約方法｜サブスクやめた` | `〇〇の解約ページへの直リンクと3ステップの手順。引き止め画面・アプリ解約不可などの注意点も。` |
| `/category/:id` | `〇〇サブスクの解約方法まとめ｜サブスクやめた` | `動画／音楽／ソフト…のサブスク解約ページをカテゴリ別にまとめ。難度ラベル付き。` |

### 構造化データ（Phase 2 で追加）

ServicePage に `HowTo` JSON-LD を挿入。Google の「リッチリザルト」候補。

## 6. 実装フェーズ

### Phase A（今回）

1. `index.html` の SEO 基本（lang・title・description・OGP）
2. `Seo` コンポーネント追加・各ページで利用
3. `Footer` 追加
4. `AboutPage` `PrivacyPage` `DisclaimerPage` `ContactPage` `NotFoundPage` 追加
5. `CategoryPage` 追加 + ルーティング
6. HomePage にソート UI（五十音／難度）
7. 不要な `App.css` 削除

### Phase B（次回以降）

- データ拡張（→ 100 サービス）
- `HowTo` JSON-LD
- `sitemap.xml` `robots.txt` 自動生成
- アフィリエイト導線（Stage 2 ）
- サブスク棚卸しツール（Stage 3 ）

## 7. 検証手順

```bash
cd C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web
npm install   # 初回のみ
npm run dev
# → http://localhost:5173/ で動作確認
npm run build
npm run lint
```

確認項目：

- 全ルートが 200 で開く
- カテゴリフィルタ・検索・ソートが組み合わせて動く
- 404 が NotFoundPage を表示する
- `<title>` がページ毎に切り替わる（devtools で確認）

---

*最終更新：2026-05-19*
