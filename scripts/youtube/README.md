# 解約手順 YouTube Shorts 全自動パイプライン

> 俊雄さん決定（2026-06-27）：YouTube Shorts × 解約手順を**全自動（生成→投稿）**で。
> 設計：映像生成AI(Veo等)は使わず、**ステップ文字カードをffmpegでプログラム合成**（品質安定・コストゼロ・ToS安全・ブランド統制可）。
> 戦略・台本仕様＝`docs/YOUTUBE_SHORTS_PLAYBOOK.md`。本READMEは実行系。

## 構成（全部このフォルダ・アプリ本体とは独立＝Vite/Netlifyビルド非影響）
- `gen-queue.mjs` … `src/data/services.js`（実データ）→ `queue.json`（spec＋タイトル/概要/タグ）。
- `render-short.mjs` … spec → 1080x1920 mp4（SVGカード→sharp→ffmpeg）。生成AI不使用。
- `upload-short.mjs` … YouTube Data API v3 で resumable アップロード（OAuth）。
- `run.mjs` … オーケストレータ（render→upload→done記録）＋ **kill-switch**。スケジューラから定期実行。
- `get-token.mjs` … 初回OAuthリフレッシュトークン取得ヘルパ。

## 一度だけの準備（俊雄さんの原子操作）
1. **Google Cloud**：プロジェクト作成 → 「YouTube Data API v3」を有効化 → OAuth同意画面（外部/テスト可）→ OAuthクライアント（種類：デスクトップ）を作成し **Client ID / Secret** を取得。
2. `scripts/youtube/.env` を作成（gitignore済・コミットされない）：
   ```
   YT_CLIENT_ID=xxxx
   YT_CLIENT_SECRET=xxxx
   YT_PRIVACY=private          # 既定private。確信できたら public に
   YT_AUTOPOST_ENABLED=false   # 緊急停止スイッチ。投稿開始時に true
   YT_MAX_PER_RUN=1
   ```
3. `npm install`（このフォルダ）→ `node get-token.mjs` → 表示URLを**サブスクやめたのYouTubeアカウント**で承認 → 出力された `YT_REFRESH_TOKEN=...` を `.env` に貼る。

## 動かす
```
npm install                 # 初回のみ（sharp / ffmpeg static / googleapis）
node gen-queue.mjs          # 第1バッチ(amazon-prime/u-next/spotify)。`all`で全サービス
node run.mjs --dry-run      # レンダリングのみ・投稿しない・認証不要（必ず先に目視確認）
# 内容OK → .env で YT_AUTOPOST_ENABLED=true（まず YT_PRIVACY=private で1本上げて確認）
node run.mjs                # kill-switch ONのとき queue先頭からYT_MAX_PER_RUN本を投稿
```

## 自動運用（ローカル・スケジューラ＝Threads 4コマ同型）
- 例：1日1本。Windowsタスク（PowerShell）：
  ```
  schtasks /Create /TN Subsuku_YT_Shorts /SC DAILY /ST 19:10 ^
    /TR "node \"<repo>\scripts\youtube\run.mjs\""
  ```
  （PCが起動している前提。Threads自動投稿と同じ運用思想）
- **緊急停止**：`.env` の `YT_AUTOPOST_ENABLED=false`（または `schtasks /Change /TN Subsuku_YT_Shorts /DISABLE`）。

## 安全・段階導入（不可侵§4ゲートに対応）
- **既定は投稿しない**：`YT_AUTOPOST_ENABLED` が `true` でなければ run.mjs は投稿せず終了。
- **既定は非公開**：`YT_PRIVACY=private`。数本を private で確認 → 品質OKなら public。
- **失敗で停止**：upload失敗時はその回で停止（quota/権限切れの無限ループ防止）。
- **手順の正確性＝社会性**：台本は services.js から自動生成＝捏造なし。両論併記は `note` を「⚠注意」カードに必ず表示。
- **トーン**：誠実・淡々（どら猫毒舌はThreads限定）。

## quota メモ
- `videos.insert` は 1回 ≈ 1600 quota units。既定の1日10,000 units ≈ 1日6本まで。1日1本運用なら余裕。

## 品質ロードマップ（v1の次）
- BGM：`assets/bgm.m4a`（ロイヤリティフリー）を置けば run で合成（次コミットで対応）。
- ナレーション：日本語TTS（クラウドAPI）を差せば読み上げ追加。無くても字幕主体で成立（無音許容）。
- カードデザイン：`render-short.mjs` の `cardSvg` を調整（色/フォント/レイアウト）。
