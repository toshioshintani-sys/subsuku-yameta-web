# Pinterest 自律投稿（API）セットアップ — 一度だけ

> 目的：ブラウザ自動化（画像アップロードのサンドボックスで詰まる）を捨て、**Pinterest API v5** でピンを自律投稿する。
> 一度トークンを発行すれば、`post-pinterest.mjs` が20ピンを各ボードに投稿（ボードも自動作成）。以後はThreadsのように自律で回せる。

## 🛑 現状（2026-07-14 確認）：本番投稿には使えない（Trialアクセスのまま）

`https://developers.pinterest.com/apps/1582125/` で確認済み。**現在のアクセスレベル＝「Trialのアクセスが許可されました」**。
発行できるトークンのスコープは読み取り系のみ（`pins:read, boards:read, user_accounts:read, ads:read, catalogs:read`）で、
**`pins:write` / `boards:write` が含まれない**＝下記「3. 投稿する」を実行しても `HTTP 403 Apps with Trial access may not create Pins in production` で確実に失敗する（2026-07-08 に実測済み・`docs/lessons.md` 参照）。

**Standardアクセスへのアップグレードには審査が必要**（`/apps/1582125/upgrade` で確認済み・実際のフォーム項目）：
- **デモ動画（.mp4・2GB未満）必須** — 「アプリがPinterestユーザーを認証する仕組み」「ユーザーが使うPinterestの主な機能」を映すこと。ボイスオーバー任意
- アプリ名・ビジネス名・ビジネスサイトURL・プライバシーポリシーURL・アプリの目的（自由記述）・使用目的/オーディエンス（チェックボックス）
- **ビジネスサイトURL・プライバシーポリシーURLの入力欄が旧ドメイン `sabusuku.netlify.app` のまま**（現行は `sabusuku-yameta.com`）になっている点は提出前に要修正

この審査は「自社アカウントへの投稿専用の内部スクリプト」というこのアプリの実態と噛み合っているとは限らない（Pinterestの審査項目はユーザー向け一般公開アプリを前提にした質問が多い＝ユーザー認証フロー・広告主/マーチャント/ユーザー等のオーディエンス選択）。動画撮影・審査提出は俊雄さんの原子操作（ORG運用モデル＝アカウント操作・法的身元に相当）。**Claude側だけでは完成できない**。

再開する時は、上記チェックを済ませてから審査を提出し、承認後に「3. 投稿する」に進むこと。承認が下りない/見送る場合は、2026-07-08に実施した手動「Pin It」URL方式（`docs/pinterest/MANUAL_POST_CHECKLIST.md`）が引き続き唯一の投稿経路になる。

## 仕組み（前工程はすべて用意済み）
- ピン画像は **公開URL** 化済み：`https://sabusuku-yameta.com/pins/pin-<key>.png`（`public/pins/`・deploy済）
- ピンのタイトル/説明/リンク/ボードは `scripts/seo/pins-data.mjs`（画像生成と同じ単一ソース）
- 投稿器 `scripts/seo/post-pinterest.mjs`：ボード5枚を自動作成 → 20ピンを投稿。`--dry-run` で事前確認。再実行は投稿済みをスキップ（`docs/pinterest/.posted.json`）。

## 俊雄さんがやること（一度だけ）

### 1. Pinterest 開発者アプリを作る
- https://developers.pinterest.com/apps/ → 「Create app」（サブスクやめたアカウントで）
- アプリの **Redirect URIs** に `https://sabusuku-yameta.com/` を登録
- **App ID** と **App secret** を控える

### 2. アクセストークンを取る（補助スクリプトあり）
PowerShell（プロジェクト直下）で：
```powershell
$env:PINTEREST_APP_ID="<App ID>"
node scripts/seo/pinterest-auth.mjs
```
表示された認可URLをブラウザで開く →「許可」→ 飛んだ先URLの `?code=XXXX` をコピー。続けて：
```powershell
$env:PINTEREST_APP_SECRET="<App secret>"
node scripts/seo/pinterest-auth.mjs <コピーしたcode>
```
出力の `access_token` を控える（スコープ：boards:read/write・pins:read/write）。

### 3. 投稿する
```powershell
$env:PINTEREST_TOKEN="<access_token>"
node scripts/seo/post-pinterest.mjs --dry-run    # 何を投稿するか確認（投稿しない）
node scripts/seo/post-pinterest.mjs              # 実投稿（ボード作成→20ピン）
```

> これで「準備」が「稼働」に変わる。あとは Claude 側で定期実行（新ピン追加→投稿）に載せられる。

## 補足
- **ドメイン認証（リッチピン）は任意・後回しでOK**。基本のピン投稿は認証なしで通る。
- トークンが切れたら（期限あり）2 をやり直す。長期運用は refresh token 対応を後で足す。
- 画像URLが 404 だと投稿が失敗する（必ず deploy 後に実行）。`--dry-run` の imageUrl をブラウザで開いて表示されればOK。
