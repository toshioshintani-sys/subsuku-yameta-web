# PC（ローカル）専用部分の棚卸し：Threads 自動投稿・YouTube ショート・SEO 点検（2026-10-17）

> クラウド引っ越し作戦のための現状メモ。**秘密情報は名前だけを書き、値は書かない**（このメモ作成時も値は読んでいない）。
> 対象PC：俊雄さんの Windows PC。リポジトリ `C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web`。

## 1. Threads 自動投稿

| 項目 | 内容 |
|---|---|
| スクリプト | `scripts/threads/post.mjs`（テキスト投稿・トークン自動延長）／`post-4koma.mjs`（4コマ画像投稿）／`reply-handler.mjs`（コメント監視・返信） |
| 定期タスク（Task Scheduler・node.exe 直接起動・作業ディレクトリ＝リポジトリ） | `Subsuku_Threads_4koma_1200`（毎日12:00・**有効**）／`Subsuku_Threads_ReplyHandler_2030`（毎日20:30・**有効**）／`Subsuku_Threads_AutoPost_2000`（**無効**） |
| 秘密情報の名前 | 環境変数 `THREADS_ACCESS_TOKEN` `THREADS_USER_ID`（優先）、無ければファイル `scripts/threads/.credentials.json`（キー：userId・accessToken・expiresAt・refreshedAt）。このPCでは **ファイル方式**で動いている |
| 設定（秘密ではない） | `THREADS_REPLY_AUTOSEND` `THREADS_REPLY_HIDE_SPAM` |
| PC 専用ファイル（git 管理外） | `scripts/threads/.credentials.json`（トークン・post.mjs が延長時に書き戻す）／`.state.json` `.4koma-state.json` `.reply-state.json`（どこまで投稿・返信したかの記録）／`reply-queue.json`（承認待ちの返信） |
| PC 専用の手作業 | `scripts/save-4koma.ps1`：Downloads にある Gemini 生成の4コマ画像を `docs/threads-4koma/` に改名保存（PowerShell・手動） |
| 画像の置き場 | `docs/threads-4koma/`（git 管理・GitHub raw URL で Threads に渡す＝リポジトリ公開が前提） |
| クラウド移行の論点 | ①トークンと state が PC のファイルにある（クラウドは毎回まっさらなクローン）→ 秘密は環境変数、state は git 管理か外部保存へ ②`post.mjs` がトークンを延長してファイルへ書き戻す仕組み→クラウドでは書き戻し先が無い ③緊急停止は今 `Disable-ScheduledTask`（PC） |

## 2. YouTube ショート（解約手順の自動動画）

| 項目 | 内容 |
|---|---|
| スクリプト | `scripts/youtube/`：`gen-queue.mjs`（services.js→queue.json）／`render-short.mjs`（SVG→sharp→ffmpeg で 1080x1920 mp4）／`upload-short.mjs`（YouTube Data API v3）／`run.mjs`（オーケストレータ・kill-switch）／`get-token.mjs`（初回OAuth） |
| 独立した依存 | このフォルダ専用の `package.json`（sharp・@ffmpeg-installer/ffmpeg・googleapis）。サイト本体のビルドとは別 |
| 秘密情報の名前 | `scripts/youtube/.env` の `YT_CLIENT_ID` `YT_CLIENT_SECRET` `YT_REFRESH_TOKEN` |
| 設定（秘密ではない） | `YT_PRIVACY` `YT_AUTOPOST_ENABLED`（緊急停止スイッチ） `YT_MAX_PER_RUN` `YT_CATEGORY` |
| **このPCの現状** | **未稼働**：`scripts/youtube/.env` が無い・`node_modules` が無い・定期タスクも無い（README の手順「一度だけの準備」が未実施） |
| PC 専用ファイル（git 管理外） | `.env`・`node_modules/`・`*.mp4`（生成物）・`queue.local.json` |
| クラウド移行の論点 | まだ PC でも動いていないので、最初からクラウド前提で組める。ffmpeg は npm 同梱版なのでクラウドでも動く見込み（未検証）。OAuth の初回承認だけは人の操作 |

## 3. SEO 点検（PC 版）

| 項目 | 内容 |
|---|---|
| スクリプト | `scripts/seo/seo-health.mjs`（公開HTMLの title/description/canonical/sitemap を点検・ログイン不要） |
| 起動のされ方（現状） | 単独のタスクは**無い**。3日棚卸し `Subsuku_Triage_1000`（`scripts/ops/run_triage.mjs`）と毎日の巡回 `Subsuku_Watch_1214` の中で呼ばれる |
| 旧ランナー | `scripts/seo/run_seo_health.ps1`（PowerShell・旧 `Subsuku_SeoHealth_1000` 用。そのタスクは既に無い）＝**使われていない残骸**。消してよい候補 |
| 秘密情報 | seo-health は不要。設定 `SEO_SITE_URL` `SEO_SAMPLE_LIMIT`（任意） |
| 同じフォルダの別用途スクリプトの秘密 | Pinterest 投稿：`PINTEREST_APP_ID` `PINTEREST_APP_SECRET` `PINTEREST_REDIRECT` `PINTEREST_TOKEN`（`pinterest-auth.mjs` `post-pinterest.mjs`）／IndexNow の鍵は `public/7315f020…txt`（仕組み上公開される） |
| クラウド移行の論点 | seo-health はそのまま動く（ネット上の公開ページを読むだけ）。米国接続でも影響なし |

## 4. ほかに PC にしか無いもの（参考）

- ルートの `.env`：`NOTE_SESSION_TOKEN`（note 連携用）。`scripts/seo/site-url.mjs` もここを読む。
- 無人ランナーの認証：Windows のユーザー環境変数 `CLAUDE_CODE_OAUTH_TOKEN`（`claude -p` 用の長期トークン）。
- Slack 送信：`C:\Users\user\Desktop\Claude_work\world-oracle-staging\notifications\_shared\slack_sender.py`（別リポジトリ・webhook は環境変数 `SLACK_WEBHOOK_SUBSUKU_DAILY`）。クラウドでは Slack コネクタで代替できることを確認済み。
- Netlify CLI の認証（`netlify api listSiteDeploys` 用）：PC にログイン済みの状態。クラウドには無い。
