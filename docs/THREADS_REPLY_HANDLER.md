# Threads リプライ担当（reply-handler）運用メモ

> 俊雄さん指示「リプライ担当を置いて自動でリプライ（b2）」を、stress-test（2026-06-07 通過）で安全化した実装。
> 憲法：`docs/kokuchi-plan.md §2「広報運用ルール（リプライ運用）」`。

## 何をするスクリプトか
自分の最近の投稿に付いたリプライを取得し、**種類で振り分ける**：

| 種類 | アクション | 自動送信 |
|---|---|---|
| 賞賛・共感 | 無反応＋記録（Threads APIは「いいね」未対応のため） | — |
| 明確なFAQ（診断どこ/解約方法） | 固定テンプレ（運営トーン）で返信 | `THREADS_REPLY_AUTOSEND=1` のときだけ。**既定OFF＝キュー** |
| 批判・皮肉・実在企業名・曖昧 | 運営トーンの**下書き**を承認キューに積む | しない（必ず人承認） |
| 荒らし・誹謗 | フラグ。`THREADS_REPLY_HIDE_SPAM=1` のとき hide | — |

**絶対線**：生成文を無承認で他人に送らない／どら猫キャラで応戦しない（他者へのリプは運営トーン）／特定企業名をネガ断定で返さない。

## 使い方
```bash
# 1) 取得＆分類だけ見る（送信・書込みなし）
node scripts/threads/reply-handler.mjs --dry-run

# 2) スキャン（賞賛=記録／FAQ=許可時のみ自動 or キュー／批判等=承認キューへ）
node scripts/threads/reply-handler.mjs

# 3) 承認したものだけ送信
#    reply-queue.json の pending を見て、送ってよい項目を approved:true に
#    （必要なら reply に最終文を記入＝suggestedReply より優先）
node scripts/threads/reply-handler.mjs --send-approved
```

## ファイル
- `reply-handler.mjs` … 本体（コミット対象）
- `reply-templates.json` … 分類キーワード＆固定テンプレ（コミット対象・運用しながら育てる）
- `reply-queue.json` … 承認キュー（**git管理外**＝他者コメント本文を含む）
- `.reply-state.json` … 既読リプライID（git管理外）
- 認証は `post.mjs` と共通（env or `.credentials.json`）。トークン延長は post.mjs（毎日実行）任せ。

## 段階的に自動を広げる（運用ルール）
1. 最初は**全件キュー**（AUTOSEND OFF）で、分類精度と下書き品質を人の目で確認。
2. テンプレFAQの精度が安定したら `THREADS_REPLY_AUTOSEND=1` で**FAQだけ**自動化。
3. 批判・企業名は**永久に人承認**（憲法の絶対線）。
4. 炎上時は post.mjs と同様、まず自動投稿タスクを停止 → キュー処理を止める。

## まだやっていない / 注意
- Threads APIの「いいば」非対応のため賞賛への自動いいねは不可（無反応＝記録のみ）。
- メンション（自分の投稿以外での言及）取得は未実装（v1は自投稿へのリプライのみ）。必要になれば `/{user}/mentions` を追加。
- 実トークンでの疎通は未検証（`node --check` 構文OK）。初回は必ず `--dry-run` で確認すること。
