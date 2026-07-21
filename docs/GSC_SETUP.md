# Google Search Console + Indexing API セットアップ

「サブスクやめた」を Google 検索に最速でインデックスさせるための設定手順。

> **2026-07-20 更新**：本ドキュメントは 2026-05-22 時点（旧ドメイン `sabusuku.netlify.app`）の手順書として書かれたが、
> 2026-06-21 に独自ドメイン `sabusuku-yameta.com` へ移行済み。第1段階（GSC サイト登録・所有権確認・sitemap 送信）は
> **新ドメインで完了済み**（`docs/lessons.md` 2026-06-20 節：ドメインプロパティを Netlify DNS の TXT で検証→sitemap 送信成功114件→
> 旧→新アドレス変更 active）。以下の第1段階は**完了済みの記録**として残す。第2段階以降は現行ドメインで未着手の場合は本手順のまま使える
> （URL は `sabusuku-yameta.com` に読み替えること）。

---

## 第1段階：GSC にサイト登録（完了済み・記録）

### 1. Search Console にアクセス

https://search.google.com/search-console にログイン（toshio.shintani@gmail.com）

### 2. プロパティを追加

- ~~URL プレフィックス `https://sabusuku.netlify.app/`~~ → **ドメインプロパティ `sabusuku-yameta.com`** で登録済み（DNS TXT検証・旧プロパティは資産引き継ぎのため残置）

### 3. 所有権確認

旧 URL プレフィックスプロパティは「HTML タグ」方式で確認済み（`public/googlef48b6b57fcb30d8a.html` は旧プロパティ用に温存）。新ドメインプロパティは DNS TXT レコードで確認済み。

### 4. sitemap 登録

- ✅ **完了済み**：`sitemap.xml`（新ドメイン）を送信し、114 URL が正常に検出された（`docs/lessons.md` 2026-06-20 節）。
- 新しいルート（サービス・記事・ジャンル追加時）は `vite-plugin-sitemap.js` の `buildRoutes()` が自動反映するので、再送信は不要。

---

## 第2段階：Indexing API 自動 ping（推奨・15分）

main ブランチに push のたびに、Google にインデックス更新を自動通知する仕組み。
リポジトリには既に `.github/workflows/indexing-ping.yml` を配置済み。

### 1. Google Cloud で Service Account 作成

1. https://console.cloud.google.com/ にアクセス
2. プロジェクトを作成（名前：`subsuku-yameta-indexing` など）
3. 左メニュー「**API とサービス**」→「ライブラリ」→ **Web Search Indexing API** を有効化
4. 「**API とサービス**」→「**認証情報**」→「**サービスアカウントの作成**」
5. 名前：`indexing-ping`、ID は自動生成のままで OK
6. 権限：「**所有者**」（あるいは「サービス アカウント ユーザー」+「Search Console所有者」）
7. 作成後、サービスアカウントの「**鍵**」タブ →「**新しい鍵を作成**」→ **JSON** を選択 → ダウンロード

### 2. GSC でサービスアカウントを「所有者」として追加

1. https://search.google.com/search-console/users にアクセス（プロパティを選択）
2. 「**ユーザーを追加**」
3. メールアドレス：ダウンロードした JSON の `client_email`（`xxx@xxx.iam.gserviceaccount.com`）
4. 権限：「**所有者**」を選択
5. 追加

### 3. GitHub Secrets に登録

1. https://github.com/toshioshintani-sys/subsuku-yameta-web/settings/secrets/actions
2. 「**New repository secret**」
3. Name: `GOOGLE_SERVICE_ACCOUNT_JSON`
4. Value: ダウンロードした JSON ファイルの中身を**全文コピペ**
5. 保存

### 4. 動作確認

- リポジトリの Actions タブで「**Indexing Ping**」を「Run workflow」（手動実行）
- ログに `[200]` と表示されれば成功

以降は main への push のたびに自動実行される。

---

## 第3段階：Bing IndexNow（任意・5分）

Bing 用の即時インデックス通知。Google より仕組みが簡単。

### 1. IndexNow キーを生成

ランダムな 8〜128 文字の英数字（例：`a1b2c3d4e5f6g7h8i9j0`）を作成。

### 2. キーファイルをサイトに配置

`public/` フォルダに `<キー>.txt` ファイルを作成（中身はキー文字列）：

```
public/a1b2c3d4e5f6g7h8i9j0.txt
中身: a1b2c3d4e5f6g7h8i9j0
```

### 3. GitHub Secrets に登録

- Name: `INDEXNOW_KEY`
- Value: 生成したキー
- 保存

### 4. Bing Webmaster Tools

- https://www.bing.com/webmasters/ にアクセス
- サイト追加：`https://sabusuku-yameta.com`
- IndexNow オプションで「キー」を入力

これで Bing にも自動 ping される。

---

## 第4段階：その他の SEO 強化（オプション）

### A. Google 検索コンソールで「リッチリザルト」を確認

`/service/netflix` などで HowTo / FAQPage 構造化データが正しく認識されているかチェック。

URL Inspection ツール → 「公開URL をテスト」→ 「リッチリザルト テスト」へ。

### B. Search Console Insights を週次でチェック

- 検索クエリで上位のキーワード把握
- 改善余地のあるページ（表示回数は多いが CTR が低い）を特定
- title / description を A/B テスト的に改善

### C. Bing Webmaster Tools の sitemap 登録

GSC と同じく `sitemap.xml` を登録。

---

## 期待効果

| 項目 | 通常 | この設定後 |
|---|---|---|
| 新規 URL のインデックス完了 | 2〜4 週間 | 3〜7 日 |
| 既存 URL の更新反映 | 1〜2 週間 | 1〜3 日 |
| Bing カバレッジ | 数週間 | 即日 |

サイトの SEO 立ち上がりが 3〜5 倍速くなる。

---

## トラブルシューティング

### Indexing API が 403 を返す

- GSC でサービスアカウントが「所有者」になっているか確認
- Google Cloud で Indexing API が有効化されているか確認

### sitemap.xml が GSC で「取得できませんでした」になる

- `https://sabusuku-yameta.com/sitemap.xml` を直接ブラウザで開いて XML が返るか確認
- 返らない場合は Netlify デプロイ失敗。`netlify.toml` の SPA リダイレクトが `/sitemap.xml` を `/index.html` に飛ばしていないか確認

### GitHub Actions で「rate limit」エラー

- Indexing API は1日200リクエストまで
- workflow は主要 URL のみ通知する設定なので問題ないはず
- 万一の場合は ジョブの URL リストを減らす

---

*最終更新：2026-05-22*
