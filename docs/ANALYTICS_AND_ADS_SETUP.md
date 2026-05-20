# GA4 と Google AdSense のセットアップ手順

このドキュメントは「サブスクやめた」に Google Analytics 4（サイト分析）と Google AdSense（広告）を有効化する手順をまとめています。

コードはすでに統合済みです。**やることは「ID を取得して Netlify の環境変数に入れる」だけ**。コードに直接書き込まずに済むよう設計してあります。

---

## A. Google Analytics 4（サイト分析）の有効化

### ステップ 1：GA4 プロパティを作成（5 分）

1. https://analytics.google.com にアクセス（Google アカウントでログイン）
2. 左下「**管理（歯車）**」→「**プロパティを作成**」
3. プロパティ名：`サブスクやめた`
4. レポートのタイムゾーン：`日本`
5. 通貨：`日本円`
6. 業種：`オンラインコミュニティ` または `インターネット・通信`
7. ビジネスの目的：「**サイトのパフォーマンスを調べる**」を選択

### ステップ 2：データストリームを設定

1. プラットフォーム選択画面で「**ウェブ**」を選ぶ
2. ウェブサイトのURL：`https://sabusuku.netlify.app`
3. ストリーム名：`サブスクやめた本番`
4. 「ストリームを作成」をクリック
5. 表示される **「測定 ID」**（`G-XXXXXXXXXX` 形式）をコピー

### ステップ 3：Netlify に環境変数として登録

1. https://app.netlify.com/projects/sabusuku/configuration/env を開く
2. 「**Add a variable**」をクリック
3. Key：`VITE_GA_MEASUREMENT_ID`
4. Value：先ほどコピーした `G-XXXXXXXXXX`
5. Scope：すべて、Deploy context：`All deploy contexts`
6. 「Create variable」をクリック

### ステップ 4：再デプロイ

1. Netlify ダッシュボード → Deploys タブ
2. 「**Trigger deploy**」→「**Deploy site**」をクリック
3. デプロイ完了後（1〜2分）、本番サイトをブラウザで開く
4. GA4 のリアルタイムレポートで自分のアクセスが見えれば成功

---

## B. Google AdSense（広告）の有効化

⚠️ **AdSense は審査制です。** サイトに一定量のコンテンツと運営実績が必要で、申請から承認まで数日〜数週間かかる場合があります。

### ステップ 1：AdSense アカウントを作成（10 分）

1. https://www.google.com/adsense にアクセス
2. 「ご利用開始」→ Google アカウントでログイン
3. サイトの URL：`https://sabusuku.netlify.app`
4. 国 / 地域：`日本`
5. 「AdSense を使用する」に同意
6. 支払い情報（住所・名前）を入力
7. 「サイトの審査をリクエストする」

### ステップ 2：審査中にやること

審査中、AdSense から「サイトに以下のコードを貼り付けてください」と指示されます。

1. AdSense ダッシュボードで表示される `data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"` をコピー
2. Netlify 環境変数に追加：
   - Key：`VITE_ADSENSE_CLIENT`
   - Value：`ca-pub-XXXXXXXXXXXXXXXX`
3. Netlify で再デプロイ
4. AdSense 画面で「**コードを貼り付けました**」をクリック
5. 数日〜数週間、Google の審査を待つ

### ステップ 3：ads.txt を更新

1. AdSense 承認後、AdSense → アカウント → ads.txt から 1 行（例：`google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`）をコピー
2. このリポジトリの `public/ads.txt` を編集してその 1 行を貼り付け
3. `git commit && git push`

### ステップ 4：広告ユニットを作成

1. AdSense → 広告 → 概要 → 「広告ユニットごと」→「**ディスプレイ広告**」
2. ユニット名：`service-page-after-steps`（解約手順の下に出る広告）
3. サイズ：レスポンシブ
4. 「作成」→ 表示される `data-ad-slot="XXXXXXXXXX"`（数字10桁）をコピー
5. Netlify 環境変数に追加：
   - Key：`VITE_ADSENSE_SLOT_SERVICE`
   - Value：`XXXXXXXXXX`
6. Netlify で再デプロイ

これで、サービス詳細ページの解約手順直下に広告が表示されます。

---

## 配置のポリシー（重要）

このサイトの広告配置は **戦略ドキュメント（docs/STRATEGY.md）の方針** に従っています。

### やっていること

- ✅ ServicePage の解約手順の **直下** にだけ広告を 1 つ置く
- ✅ 「広告」ラベルを明示
- ✅ レスポンシブ広告（PC・スマホ自動最適化）

### やっていないこと（今後もやらない）

- ❌ ポップアップ・インタースティシャル広告
- ❌ サイドバーに追従する固定広告
- ❌ HomePage のサービスカードの間に広告（解約導線を邪魔するため）
- ❌ 解約ボタンの上に広告（CV を阻害するため）
- ❌ Privacy / Disclaimer / About ページの広告

---

## トラブルシューティング

### GA4 のリアルタイムに自分のアクセスが出ない

- ブラウザ拡張機能（uBlock Origin、Ghostery など）で gtag.js がブロックされていないか確認
- シークレットウィンドウで試す
- 環境変数が `VITE_` プレフィックス付きで登録されているか確認（Vite はビルド時に `VITE_` のみ埋め込む）
- Netlify Deploy log で `VITE_GA_MEASUREMENT_ID` が認識されているか確認

### AdSense の広告が表示されない

- AdSense の審査が完了しているか（メールで承認通知が来る）
- `VITE_ADSENSE_CLIENT` と `VITE_ADSENSE_SLOT_SERVICE` の両方が設定されているか
- 広告ブロッカーが有効でないか
- AdSense ダッシュボードでサイトのステータスが「準備完了」になっているか
- 公開後、最初の 24 時間は空白の場合がある（Google が在庫を集める時間）

### Privacy ポリシーの記述が現実と違う

- GA4 だけ使って AdSense は使っていない場合：Privacy の「3. 広告配信について」を削除可能
- 反対も同様。`src/pages/PrivacyPage.jsx` を編集

---

## 環境変数まとめ（コピペ用）

Netlify Site configuration → Environment variables で設定：

| Key | Value 例 | 用途 |
|---|---|---|
| `VITE_SITE_URL` | `https://sabusuku.netlify.app` | カノニカル URL（独自ドメイン化したら差し替え） |
| `VITE_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | GA4 測定 ID |
| `VITE_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX` | AdSense クライアント ID |
| `VITE_ADSENSE_SLOT_SERVICE` | `XXXXXXXXXX` | ServicePage 用の広告ユニット ID |

---

*最終更新：2026-05-20*
