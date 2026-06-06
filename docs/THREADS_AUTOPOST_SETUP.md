# Threads 自動投稿セットアップ手順（俊雄さん向け・一度だけ）

> 目的：俊雄さんは **最初に2つ（アカウント作成・トークン発行）だけ** 設定すれば、
> 以後の「毎日のテキスト投稿」は Claude Code が自動で回す。
>
> **正直な線引き（盛らない）**
> - アカウント作成・トークン発行は**俊雄さんしかできない**（本人認証・規約同意・OAuth承認のため）。
> - それさえ済めば、テキスト投稿（`docs/threads-stock.md` のA-1〜A-10）は**完全自動**。
> - **4コマ画像は自動化対象外**（Threads APIは画像に「公開URL」が必要＝画像生成も別環境）。当面はテキスト自動＋画像は出したい時だけ手動、が現実解。

---

## 全体像

```
[一度だけ・俊雄さん]                         [毎日・Claude Code が自動]
①Threadsアカウント作成 ──┐
②Metaアプリ＋トークン発行 ─┴→ 認証情報を設定 → ③スクリプトが queue.json を
                                              1日1本ずつ自動投稿（本文＋リンク返信）
```

- 投稿スクリプト：`scripts/threads/post.mjs`（実装済み・新規依存ゼロ）
- 投稿ネタ：`scripts/threads/queue.json`（テキスト10本・循環）
- 認証情報が未設定の間は**何もせず正常終了**するので、先にタスク登録しても事故らない。

---

## ① Threads アカウントを作る（約5分）

**日本では Threads 単独登録（IG無し）はまだ使えない**（Instagram無しの登録は2026時点でEU/UKのテスト限定）。よって流れは：

1. **サブスクやめた用の Instagram を新規作成**（別メールでOK）。
   - これは「ログイン／身元の土台」。**空のまま・一度も投稿しなくてよい**。個人IGとは完全に別物（別メール・別ユーザー名）。
   - ⚠ 新IGに紐づけても **Instagram には投稿されない**（Threadsとは別フィード）。「個人IGから発信しない」は守られる。
2. その新IGでログインして **Threads アカウントを作成**（ここが実際の発信先）。1IG＝1Threads。
3. プロフィールに 1行説明＋ `https://sabusuku.netlify.app` を入れる。
4. これで投稿先が存在する状態になる。

> 将来オプション：4コマ画像は Instagram とも相性が良いので、その新IGを後から告知チャネルに足すこともできる（今はやらない・Threads集中）。

---

## ② Meta アプリとアクセストークンを発行（約15分・一度だけ）

Threads には公式 API があり、プログラム投稿が可能（[Meta公式: Get Access Tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/)）。

1. **Meta for Developers** にログイン → 「アプリを作成」。
   - ユースケースで **「Access the Threads API」** を選ぶ。
2. アプリに **Threads** プロダクトを追加し、上で作った Threads アカウントを**テストユーザー/対象**として紐づける。
3. **必要な権限（スコープ）** にチェック：
   - `threads_basic`
   - `threads_content_publish` ← これが投稿に必須
   - （返信の発展利用に）`threads_manage_replies`
4. OAuth の認可フローを通すと **短期トークン（1時間）** が出る → **長期トークン（60日・更新可）** に交換する（[公式: Long-Lived Tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens/)）。
   - ⚠ アプリが「テスト中」だと 7日トークンになる。**本番(公開)状態にすると60日**になる。
5. 自分の **Threads ユーザーID** を控える（Graph APIの `/me?fields=id` 等で取得できる）。

> つまずいたら、画面のスクショを Claude Code に渡せば、その時点の手順を具体的に案内します。

---

## ③ 認証情報を設定（俊雄さん・コピペ）

どちらか1つでOK（**環境変数が優先**）。

**方法A：環境変数（推奨・PowerShell でユーザー環境変数に保存）**
```powershell
setx THREADS_USER_ID "ここにThreadsユーザーID"
setx THREADS_ACCESS_TOKEN "ここに長期アクセストークン"
```

**方法B：ファイル（gitに上がらない・gitignore済）**
`scripts/threads/.credentials.json` を作って：
```json
{ "userId": "ここにThreadsユーザーID", "accessToken": "ここに長期アクセストークン" }
```

---

## ④ 動作確認 → 自動実行を登録

**まずドライラン（投稿しない・次に何を出すか確認）**
```powershell
npm run threads:dry
```
**実投稿テスト（1本だけ出る）**
```powershell
npm run threads:post
```
うまく出たら、毎朝の自動実行を登録（例：毎日 8:00）：
```powershell
$action  = New-ScheduledTaskAction -Execute "npm" -Argument "run threads:post" -WorkingDirectory "C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web"
$trigger = New-ScheduledTaskTrigger -Daily -At 8:00am
Register-ScheduledTask -TaskName "Subsuku_Threads_AutoPost_0800" -Action $action -Trigger $trigger -Description "サブスクやめた Threads 自動投稿（テキスト・1日1本）"
```
> ※ `npm` が見つからない場合は `-Execute` を node 直叩き（`-Execute "node" -Argument "scripts/threads/post.mjs"`）に変える。

---

## 運用メモ・リスクと対策（正直に）

| 項目 | 内容 | 対策 |
|---|---|---|
| **無人投稿のブランド事故** | 人の目を通さず出る | 投稿元は**俊雄さん承認済みの `queue.json` のみ**。中身を変えたい時は queue.json を編集 |
| **トークン失効** | 60日で切れる→投稿停止 | 期限前に `npm run threads:post` がエラーを出すので気づける。切れたら②の交換を再実行 |
| **レート上限** | 250投稿/24h ([出典](https://www.blotato.com/blog/threads-api-pricing)) | 1日1本運用では一切問題なし |
| **自動化検知** | 高頻度の機械投稿は嫌われる | 1日1本・固定文面ローテで低リスク。伸びたら手動で増やす |
| **4コマ画像** | API は image_url(公開URL) が必要 | 当面テキスト自動のみ。画像は出したい時に手動 or 後日 画像ホスティングを足して対応 |

---

## ネタの増やし方・差し替え方

- `scripts/threads/queue.json` の `items` を編集するだけ（本文 `body`・タグ `tag`・返信 `reply`）。
- 反応が出た言い回しは Claude Code が補充・最適化する（`docs/threads-stock.md` が母体）。
- craft 厳守：バイアス名を出さない／感情語を避ける／1行目フック／タグ1個／リンクは2投目(reply)へ。

---

*作成：2026-06-06。俊雄さんが①②を済ませた時点で自動運用開始。以後のネタ供給・最適化は Claude Code。*
