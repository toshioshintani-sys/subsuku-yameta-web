# Threads 運用 引き継ぎ書（2026-06-06 完全移譲）

> **この文書の目的**：サブスクやめたの **Threads 告知運用** を、専任chat（本ファイルを読むあなた）へ完全移譲するための自己完結ハンドオフ。
> これだけ読めば、冷えた状態から運用を継げる。**毎朝の朝会報告(subsuku-asakai)chatはThreads運用から手を引く**。Threadsの一次窓口は今後このファイルを持つchat。
>
> プロジェクト：`C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web`（ブランチ main）
> 関連：`docs/kokuchi-plan.md`（告知戦略）/ `docs/threads-stock.md`（ネタ母体）/ `docs/THREADS_AUTOPOST_SETUP.md`（俊雄さん向け初期手順）/ `docs/lessons.md`（2026-06-06 ★★★★★ 項）

---

## 0. 現在の状態（2026-06-06 時点・結論）

**Threadsへのテキスト全自動投稿が稼働開始済み。** 俊雄さんは何もしなくても毎日20:00に1本ずつ自動投稿される。初回実投稿も成功済み。

| 項目 | 値 / 状態 |
|---|---|
| Threadsアカウント | **@sabusuku.yameta**（公開アカウント） |
| ひも付くInstagram | **sabusuku.yameta**（個人垢 shinta1999 とは別の新規IG。発信はしない・ログイン/身元の土台） |
| Meta公式アプリ名 | **Subsuku Yameru Poster**（※"Yameta"は"meta"を含みNGだったため"Yameru") |
| Meta アプリID | **1013218207841843** |
| Threads アプリID | **968202846024872** |
| Threads ユーザーID | **26896560380044092** |
| 付与済み権限 | `threads_basic` / `threads_content_publish` |
| アクセストークン | 長期(60日)・`scripts/threads/.credentials.json` に保存（gitignore・**値は秘密。ここには書かない**） |
| **トークン失効目安** | **2026-08-05 頃**（取得=06-06 + 60日）。要更新（§4） |
| 自動投稿タスク | Windowsタスク **`Subsuku_Threads_AutoPost_2000`**（毎日20:00・State: Ready） |
| 初回投稿(実績) | postID `18125050879650931` ＋ 返信 `18073582376475268`（2026-06-06 公開済み） |
| 次に出るネタ | **A-2**（state の nextIndex=1。A-1は投稿済み） |

---

## 1. 今日やったこと（時系列・全工程）

1. **告知チャネルをThreadsに確定**（`docs/kokuchi-plan.md` §5・2026-06-01既定）。弾は `docs/threads-stock.md` にストック済み（テキストA-1〜A-10＋4コマ8本＋2週カレンダー）。
2. **テキスト自動投稿の仕組みを実装**（`scripts/threads/post.mjs` ＋ `queue.json`）。新規npm依存ゼロ（Node global fetch）。認証無ければ no-op で正常終了する設計。
3. 俊雄さんが **新規Instagram(sabusuku.yameta) 作成 → Threads作成**（公開）。※日本ではIG無しのThreads単独登録は不可（EU/UKテストのみ）。
4. **Meta for Developers でアプリ作成**（Subsuku Yameru Poster）。ユースケース「Threads APIにアクセス」追加、`threads_content_publish` 権限を追加。
5. **Threadsテスターに sabusuku.yameta を招待 → 本人がスマホThreadsで承認**。
6. **長期アクセストークン生成 → `/me` で userID取得 → `.credentials.json` 保存**。
7. **初回実投稿成功**（A-1本文＋リンク返信の2連投）。
8. **毎日20:00の自動投稿タスク登録**。
9. **プロフィール整備**：アイコン＝キリさん（`design-briefs/youtube-avatar.png`、デスクトップに `サブスクやめた_アイコン.png` でコピー済み）/ 表示名「サブスクやめた」/ 自己紹介・リンク `https://sabusuku.netlify.app` を IG・Threads 双方に設定。
10. 知見を `docs/lessons.md`（2026-06-06 ★★★★★）に記録・push。

---

## 2. システムの仕組み（運用の中身）

### ファイル
- `scripts/threads/post.mjs` — 投稿スクリプト。1実行で queue の次の1本を投稿し、**本文(1投目)→reply_to_idで返信(2投目=リンク)**、state を前進。`--dry-run` で投稿せず確認。
- `scripts/threads/queue.json` — 投稿ネタ（テキスト10本・A-1〜A-10）。各 item は `{id, body, tag, reply}`。最後まで行くと先頭へ循環。
- `scripts/threads/.credentials.json` — `{userId, accessToken}`（**gitignore・秘密**）。
- `scripts/threads/.state.json` — `{nextIndex, history}`（gitignore）。次に出すネタの位置。
- `package.json` scripts：`npm run threads:post`（実投稿）/ `npm run threads:dry`（確認のみ）。

### API（Meta公式 Threads API）
- ベース：`https://graph.threads.net/v1.0`
- 投稿：`POST /{userId}/threads`（media_type=TEXT, text, 任意で reply_to_id）→ creation_id → `POST /{userId}/threads_publish`（creation_id）。
- 上限：250投稿/24h（1日1本運用では余裕）。
- ユーザーID取得：`GET /v1.0/me?fields=id,username&access_token=...`

### スケジュール
- Windowsタスク `Subsuku_Threads_AutoPost_2000`：毎日20:00に `node scripts/threads/post.mjs`。
- 時刻変更：`Set-ScheduledTask` か、一度 `Unregister-ScheduledTask -TaskName 'Subsuku_Threads_AutoPost_2000' -Confirm:$false` → 再登録（手順は `docs/THREADS_AUTOPOST_SETUP.md`）。
- 一時停止：`Disable-ScheduledTask -TaskName 'Subsuku_Threads_AutoPost_2000'` / 再開：`Enable-ScheduledTask ...`。

---

## 3. 日常運用（あなた＝Threads専任chatの仕事）

1. **ネタの補充・差し替え**：`scripts/threads/queue.json` の `items` を編集するだけ。craft厳守＝**バイアス名を出さない・感情語を避ける・1行目フック・タグ1個・リンクは2投目(reply)に分離・🐱を狂言回し**。母体は `docs/threads-stock.md`。
2. **反応のいい言い回しを増やす**：伸びたテキストは4コマ化候補としてメモ。`threads-stock.md` に追記。
3. **CTA先**：`sabusuku.netlify.app/games`（診断ゲーム）/ `/tracker`（棚卸し）。UTM付き（`?utm_source=threads&utm_medium=social&utm_campaign=kokuchi`）でGA4計測（測定ID G-S0H16V3WE2／プロパティ538470329＝**サブスクやめた**。G-L5V42D0116はライフオラクルなので混同しない）。
4. **手動で今すぐ1本出したい時**：`npm run threads:post`。確認だけは `npm run threads:dry`。
5. 変更を加えたら `npm run build` で破壊が無いか確認（scriptsはバンドル外なので通常影響なし）→ commit/push。

---

## 4. 🔴 定期メンテ：トークン更新（最重要・忘れると投稿停止）

長期トークンは **60日有効**（〜2026-08-05頃）。失効すると post.mjs がエラーで止まる。**24h経過後〜失効前**ならリフレッシュで延長できる。

### 方法A：手動リフレッシュ（推奨・APIで延長）
```powershell
$cred = Get-Content 'C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web\scripts\threads\.credentials.json' | ConvertFrom-Json
$new = Invoke-RestMethod -Uri "https://graph.threads.net/v1.0/refresh_access_token?grant_type=th_refresh_token&access_token=$($cred.accessToken)"
$out = [ordered]@{ userId = $cred.userId; accessToken = $new.access_token } | ConvertTo-Json
Set-Content 'C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web\scripts\threads\.credentials.json' $out -Encoding UTF8 -NoNewline
"refreshed; expires_in(sec)=$($new.expires_in)"
```
→ 成功すれば 60日延長。**これを ~50日ごとに回せばトークンは半永久に生き続ける**。

### 方法B：再生成（リフレッシュ失効後）
Meta開発者ダッシュボード → アプリ「Subsuku Yameru Poster」(ID 1013218207841843) → ユースケース「Threads API」→ 設定 → ユーザートークン生成ツール → sabusuku.yameta の「アクセストークンを生成」。**注意：ブラウザのthreads.comを sabusuku.yameta でログインした状態で**（個人垢のままだと `error 1349245`）。取得後 `.credentials.json` を更新。詳細は `docs/THREADS_AUTOPOST_SETUP.md`。

### 自動リフレッシュ化（✅ 2026-06-06 実装済・post.mjs に統合）
`post.mjs` の `ensureFreshToken()` が**本番投稿の直前に「残り≤10日 or 期限不明なら refresh_access_token で自動延長」**し、`.credentials.json` を `{userId, accessToken, expiresAt, refreshedAt}` で更新する。
- 失敗してもその日の投稿は止めない（現行トークンで継続）。dry-run / env由来では延長しない（副作用なし）。
- 毎日20:00の自動投稿が走るたびに残量を見て、~50日ごとに自動延長＝**人手のトークン管理は不要**になった。
- ⚠ 取得から24h未満は延長不可（Threads仕様）。初回取得当日の延長は失敗扱いで投稿だけ継続→翌日以降に自動延長が成功し expiresAt が入る。完全失効後だけ方法B（再生成）。

---

## 5. 落とし穴（今日溶かした時間＝再発防止）

1. **アプリ名に「meta」を含むとMetaに弾かれる**（"Ya**meta**"がNG）。FB/Insta/Book/Gram/Rift等も同様。
2. **ブラウザ自動入力(form_input)はReact検証が発火せず誤エラーが残る** → 実キーボード入力(type)で解消。
3. **Threadsテスターは generic FBテスターと別物**：役割追加ダイアログ下部の「**Threadsテスター**」を選び、Threadsユーザー名で招待 → 本人がThreadsで承認。
4. **トークン生成は「ブラウザでログイン中のThreadsアカウント」に対して走る**。個人垢ログインのままだと `error_code 1349245: user has not accepted the invite`。→ threads.com を **sabusuku.yameta でログインし直してから**生成。
5. **個人IG(shinta1999)とサブ垢(sabusuku.yameta)の取り違い**に注意。アカウント作業前に必ず対象を確認。

---

## 6. 自動化できないこと・制約（正直な線引き）

- **4コマ画像の自動投稿は不可**：Threads APIは画像に **image_url(公開URL)** が必要で、画像生成もこの環境では不可。→ 画像を出す日は「私(chat)がプロンプト → 俊雄さんが生成 → 手動投稿」または「画像を公開URLにホスティングしてから image投稿を実装」。当面**テキスト自動＋画像は手動**が現実解。
- **アカウント作成・OAuth承認・FBパスワード入力・トークンのコピー**は俊雄さん本人作業（権限/認証/規約同意のため）。
- Slack自動投稿はauto mode分類器でブロックされる既知制約（朝会chi側の話・Threadsには無関係）。

---

## 7. 残タスク / 次の一手（Threads専任chatが持つ）

- [x] **トークン自動リフレッシュ実装**（§4）。2026-06-06 完了＝`post.mjs` の `ensureFreshToken()`。人手のトークン管理が不要に。
- [ ] 反応データを見てネタ拡充（`queue.json` を10本→増やす）。伸びた文は4コマ化。
- [ ] 投稿時刻/本数の最適化（今は1日1本20:00。エンゲージ次第で朝夜2本等）。
- [ ] 4コマ画像投稿の経路を作るか判断（画像ホスティング＋image投稿 or 手動継続）。
- [ ] GA4(プロパティ538470329)で `utm_source=threads` 流入を週次チェック → games/tracker への転換を見る。
- [ ] （任意）将来IG(sabusuku.yameta)自体も告知チャネルに足すか判断。今はThreads集中。

---

## 8. 朝会報告(subsuku-asakai)chatとの分界点

- **Threads運用（ネタ・投稿・トークン・改善）＝本ファイルを持つ専任chatが担当**。
- **朝会chatは「毎日更新（記事・収益・巡回・集客の朝会報告）」に徹する**。朝会の「📣告知レポート」節は、Threadsが自動化＆専任chat移譲済みのため、**「Threadsは自動運用中（専任chat管理）」の一行ステータスに縮小**してよい（4コマ脚本の都度提示は不要に）。※朝会のSKILL.md構成変更は俊雄さんの承認案件なので、変えるなら proposal-stress-test を通すこと。

---

*作成：2026-06-06。Threads全自動投稿の稼働開始と同時に、運用窓口を本ファイル所持chatへ移譲。次担当は §0 の現状と §4 のトークン更新を最初に確認すること。*
