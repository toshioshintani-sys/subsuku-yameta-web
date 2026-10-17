# Threads 公式APIの審査申請：準備の記録（2026-10-17・PCのClaude）

> 対象アプリ：Subsuku Yameru Poster（MetaアプリID 1013218207841843／ThreadsアプリID 968202846024872）
> 状態：**フォームには何も入れていない。送信前に俊雄さんが決めることが4つある**（§2）。
> 秘密の値（トークン・アプリシークレット）はこの文書に書いていない。

---

## 0. 結論（先に）

1. **検索で取れる他人の投稿には、いいね数・表示数・返信数などの数字が付かない。** 数字が取れるのは自分の投稿だけ。
   「人気順（TOP）に並んだ投稿500件」は集められるが、「その投稿がどれくらい伸びたか」は分からない。
   → 500件の集め方・確認のしかたを、クラウド側で考え直す必要がある（§2-1）。
2. **審査が通るには、ビジネス認証がほぼ確実に要る。** Meta の権限一覧に「高度なアクセスを求めるすべてのアプリに必要」と書かれている。
   俊雄さんに認証済みのビジネスがあるかは、画面が読めず確認できていない（§2-2）。
3. **画面録画には「アプリの画面」が要る。** 内容は、ThreadsのOAuthログイン → 権限の許可 → キーワード入力 → 公開投稿の表示。
   今はスクリプトしかなく、見せられる画面がない。小さなWebページを作る必要がある（クラウド側の作業・§2-3）。
4. **`threads_manage_insights` は審査なしで使える。** sabusuku.yameta はテスターなので、自分の投稿の成績はすぐ測れる。
   申請に入れると「不要な権限」として却下されやすくなる、と公式に書かれている。→ **申請からは外すことを提案**（§2-4）。

Metaの開発者画面は、今日はどのページも読み込みが終わらず（Chrome拡張から中身が読めない状態が30分以上続いた）、設定の確認と入力はできなかった。
読めたのは1回だけ。その時点で分かったのは、アプリが **「未公開」**（開発モード）であること、ユースケースが「Threads APIにアクセス」の1つだけであること。

---

## 1. 公式ドキュメントで確かめたこと（2026-10-17 時点）

| 項目 | 内容 | 出典 |
|---|---|---|
| 未承認だと検索はどうなるか | 承認前は、ログイン中のユーザー自身の投稿しか検索されない。承認後に公開投稿が検索できる | [Keyword Search](https://developers.facebook.com/docs/threads/keyword-search/) |
| 検索の上限 | 1ユーザーあたり24時間で2,200回。結果0件の検索は数えない。1回あたり最大100件（既定25件） | 同上 |
| 検索の並び | `search_type=TOP`（人気順・既定）／`RECENT`（新しい順）。`media_type`、`since`/`until`、`author_username` で絞れる | 同上 |
| 検索結果に付く項目 | 本文・投稿URL・日時・ユーザー名・メディアの種類など。**いいね数・表示数・返信数・再投稿数は無い**。投稿者IDの項目は返らない | 同上／[投稿の項目一覧](https://developers.facebook.com/documentation/threads/retrieve-and-discover-posts/retrieve-posts) |
| 数字（インサイト） | 「ユーザー自身の投稿のインサイトを読む」ためのAPI。他人の投稿には使えない（明記はないが、全文がそう読める） | [Insights](https://developers.facebook.com/docs/threads/insights) |
| `threads_keyword_search` の使い道 | 許可されているのは「ユーザーのSNSでの存在感の管理を助けること」。具体的には、検索した公開投稿とその返信の表示、自分が言及された投稿の整理、検索した投稿への返信。分析に使えるのは「集計し、個人を特定できない形にした情報」だけ | [Threads の権限一覧](https://developers.facebook.com/docs/permissions/threads) |
| 審査が要るか | アプリに役割を持つユーザー（テスター等）だけが使うなら、審査は不要。ただし keyword_search の公開投稿の検索だけは、承認が無いと自分の投稿しか返らない | [App Review](https://developers.facebook.com/documentation/resp-plat-initiatives/individual-processes/app-review)／Keyword Search |
| ビジネス認証 | 「高度なアクセスを求めるすべてのアプリに必要」 | [権限一覧](https://developers.facebook.com/docs/permissions/threads)／[Business Verification](https://developers.facebook.com/documentation/development/release/business-verification) |
| 公開状態 | 役割の無いユーザーに権限を出してもらうには、審査の承認と公開状態の両方が要る。**今回の利用者はテスター本人だけなので、公開状態にする必要はない** | [Get Started](https://developers.facebook.com/documentation/threads/get-started) |
| 事前に整える項目 | アイコン（512〜1024px・5MB未満・JPEG/GIF/PNG）、プライバシーポリシーのURL、データ削除の案内URLまたはコールバック | [アプリの作成](https://developers.facebook.com/documentation/threads/get-started/create-an-app) |
| カテゴリ | Threads のドキュメントには記載なし（画面で確認できず） | — |
| 申請で書くもの | 権限ごとに「使い道の説明（具体例）」と「画面録画」 | 権限一覧 |
| 不要な権限 | 「不要な権限を選ぶことは、審査で却下される主な理由の1つ」 | 権限一覧 |
| 権限の有効期間 | 90日使わない権限は、ユーザーが許可し直す必要がある | 権限一覧 |

**画面録画の条件（`threads_keyword_search`・原文の要旨）**
1. アプリ上での Threads の OAuth ログインを最初から最後まで見せ、利用者がこの権限を許可する場面を映す
2. Threads アカウントをアプリにつなぐ流れ全体と、求めている権限を見せる
3. キーワードを入力し、そのキーワードに関する公開投稿を検索する様子を見せる
4. 「投稿の結果」をアプリと Threads の公式アプリの両方で見せる（※返信を投稿する機能を前提にした書き方。私たちは返信しないので、「検索で出た投稿が Threads の公式アプリにも同じく出ている」ことを見せる形にする）

---

## 2. 送信前に俊雄さんが決めること

### 2-1. 検索結果に数字が無い（いちばん大きい）
- 取れるもの：人気順に並んだ投稿の本文・URL・日時。
- 取れないもの：それぞれの投稿のいいね数・表示数。
- 数字を見るには、投稿URLを開いて人が目で見るしかない（500件×目視）。または「人気順の上位に出た」こと自体を伸びた印として扱う。
- 別の権限 `threads_profile_discovery` なら、先行アカウント（フォロワー100人以上の公開アカウント）について **直近7日の合計**（表示・いいね・再投稿・引用）とフォロワー数が取れる。投稿ごとの数字はこちらも無い。
- → **このまま申請する価値があるかは、クラウド側で500件の使い方を決め直してから判断するのがよい。**

### 2-2. ビジネス認証
- 審査で承認される「高度なアクセス」には、認証済みのビジネスにアプリがつながっている必要がある。
- 個人（事業の登録なし）で通るか、どの書類が使えるかは、今日は確かめていない。Threads の文書にも個人の扱いは書かれていない。
- 開発者コミュニティには「ビジネス認証が60日以上審査中のまま」という報告もある（検索結果の要約で見ただけ・原文は未確認）。
- → 俊雄さんに、Meta のビジネス・ポートフォリオ（旧ビジネスマネージャ）で認証を進めるかを決めてもらう。**会社員の副業規程に触れないか**も合わせて確認。

### 2-3. 画面録画用の「アプリの画面」が無い
- 今の仕組みは、開発者画面のトークン生成ツールで作ったトークンを使うスクリプトだけ。OAuth ログインの画面も、検索結果を見せる画面も無い。
- 録画には、最低限これだけのWebページが要る：
  1. 「Threadsでログイン」ボタン（Threads の認可URLへ飛ぶ）
  2. 戻ってきたら、コードをトークンに交換（サーバー側＝Netlify の関数。秘密は環境変数）
  3. キーワード入力欄 → `keyword_search`（TOP）→ 結果の一覧（本文・日時・投稿へのリンク）
- 置き場所の案：`sabusuku-yameta.com/tools/threads-research`（検索エンジンには載せない・誰でも使える状態にはしない）。
- 開発者画面に、そのページの「有効なOAuthリダイレクトURI」を登録する必要がある。
- → **クラウド側で作るか決める。** 作るなら、録画の台本（§5）はそのページを前提に書いてある。

### 2-4. `threads_manage_insights` は申請から外す（提案・依頼文からの変更）
- テスター（sabusuku.yameta）の自分の投稿なら、審査なしで成績が測れる。
- やること：ユースケース「Threads APIにアクセス」で `threads_manage_insights` を追加 → トークンを作り直す（作戦案 §3 の「俊雄さんの1回だけの操作」と同じ）。
- **権限の追加は取り消しにくい操作なので、俊雄さんの了解を得てから押す。** 今日は押していない。

---

## 3. 申請に書く「使い道の説明」（英語・下書き）

> 方針：正直に書く。自社アカウントの運用のための社内ツールで、検索結果は投稿の型を調べるためだけに使い、第三者に公開・再配布しない。
> 許可された使い道（「ユーザーのSNSでの存在感の管理」「検索した公開投稿の表示」「集計し個人を特定できない分析」）の範囲に収まるように書いた。範囲を広げる書き方はしていない。

### threads_keyword_search

```
Subsuku Yameru Poster is an internal tool used only by the operator of one Threads account, @sabusuku.yameta. The account belongs to "Sabusuku Yameta" (https://sabusuku-yameta.com), a Japanese website that helps people find how to cancel subscriptions and review their fixed monthly costs.

We need threads_keyword_search to manage our own presence on Threads. Our posts have received very little engagement, and we want to understand which kinds of public posts people on Threads in Japan actually engage with on our topics (subscriptions, fixed costs, cancelling services, household money).

How we use it:
1. The operator logs in with their own Threads account and grants the permission.
2. The operator enters a keyword related to our topic, for example "サブスク" (subscription) or "解約" (cancel), and searches with search_type=TOP.
3. The app shows the matching public posts (text, posting time and a link to the post on Threads) to the operator only. The operator reads them to see which formats work, for example short jokes, questions to readers, or before/after stories.
4. We keep only aggregated, de-identified notes, such as "question-style posts appeared N times in the top results for this keyword". We do not store usernames, and we do not build profiles of any user.
5. We use what we learn only to plan and write our own original posts on our own account.

What we do not do:
- We do not show search results to anyone other than the operator, and we do not publish, sell or redistribute them.
- We do not reply to, like, repost or follow other users through this app.
- We do not contact the authors of the posts we find.
- The app has one user (the operator). It is not offered to other people.
```

### threads_basic（keyword_search の前提として必要。申請画面で一緒に求められた場合）

```
threads_basic is required for every Threads API call, including keyword search. The operator also uses it to view the list of our own posts (@sabusuku.yameta) inside the app, visible only to the operator, to review what we have already published before planning new posts.
```

### threads_manage_insights（§2-4 のとおり申請しない案。俊雄さんが入れると決めた場合だけ使う）

```
We use threads_manage_insights to track the performance of our own account, @sabusuku.yameta. The operator views profile-level metrics (followers, views) and post-level metrics (views, likes, replies, reposts, quotes) for posts we published, and compares them week by week to decide which kinds of posts to keep writing. We only read insights for our own account and our own posts.
```

---

## 4. 審査担当者向けの手順（英語・下書き・§2-3 のページがある前提）

```
Test account: please use the Threads tester account we provide in the "Test credentials" field.

1. Open https://sabusuku-yameta.com/tools/threads-research
2. Click "Log in with Threads". You are redirected to the Threads authorization screen.
3. Review the requested permissions (threads_basic, threads_keyword_search) and click "Allow".
4. You are redirected back to the tool. The top of the page shows the connected account name.
5. In the "Keyword" box, enter サブスク (or any keyword) and click "Search (Top)".
6. The tool lists public posts matching the keyword: post text, posting time and a link to the post.
7. Click any link to open the same post on Threads and confirm it matches.
8. The tool has no buttons for replying, liking, reposting or following. It only reads and displays results to the logged-in operator.
```

※ 「Test credentials」に入れるテスト用アカウントのログイン情報は、**俊雄さんが自分で入力する**（パスワードを Claude は扱わない）。

---

## 5. 画面録画の台本（録画は俊雄さん・§2-3 のページがある前提）

- 長さの目安：2〜3分。字幕またはマウスで操作箇所を示す。画面の言語は英語にしておくと審査担当者に伝わりやすい（Threads／ブラウザとも）。
- 映してはいけないもの：アクセストークン・アプリシークレット・パスワード（入力欄は伏せ字のまま）。ブラウザのアドレスバーに `code=` や `access_token=` が出る瞬間は、すぐ次の画面に進めるか、その部分を切る。

| # | 画面 | 操作 | 見せたいこと |
|---|---|---|---|
| 1 | ブラウザ（ログアウト状態） | `sabusuku-yameta.com/tools/threads-research` を開く | アプリの入口 |
| 2 | 同上 | 「Log in with Threads」を押す | OAuth の開始 |
| 3 | Threads の認可画面 | テスターの sabusuku.yameta でログイン（パスワードは伏せ字） | 誰がログインするか |
| 4 | Threads の認可画面 | 求められている権限の一覧をゆっくり映してから「許可」 | 権限の許可（条件1・2） |
| 5 | アプリに戻る | つながったアカウント名の表示を映す | アカウント連携の完了（条件2） |
| 6 | アプリ | キーワード欄に「サブスク」と入力 →「Search (Top)」 | キーワード検索（条件3） |
| 7 | アプリ | 結果の一覧をスクロール | 公開投稿の表示（条件3） |
| 8 | Threads の公式アプリ（スマホ画面の録画でもよい） | 一覧の1件を、Threads の公式アプリでも開いて同じ投稿だと見せる | アプリと公式アプリの両方で見せる（条件4） |
| 9 | アプリ | 返信・いいね等のボタンが無いことを映して終わる | 読むだけのツールであること |

---

## 6. プライバシーポリシーの追記案（サイトの変更はクラウド側）

今の `https://sabusuku-yameta.com/privacy`（`src/pages/PrivacyPage.jsx`）には、Threads のデータの扱いと、データ削除の窓口が無い。
Meta の要件（プライバシーポリシーのURL＋データ削除の案内）を満たすため、次の2節の追加を提案する。

```
## Threads API で取得する情報について
当サイトの運営者は、自社の Threads アカウント（@sabusuku.yameta）の運用のため、Meta 社の Threads API を利用する社内ツールを使っています。
- 取得する情報：運営者自身のアカウントの投稿と、その表示数・いいね数などの成績。キーワード検索で表示される公開投稿の本文・投稿日時・投稿へのリンク。
- 利用目的：運営者自身の投稿の改善のためだけに使います。
- 保存：検索で表示された他の方の投稿は、ユーザー名を含めて保存しません。保存するのは、投稿の型ごとの件数など、個人を特定できない集計だけです。
- 第三者への提供：取得した情報を公開・販売・第三者へ提供することはありません。
- このツールは運営者だけが使うもので、一般の方は利用できません。

## データの削除について
このツールでご自身の Threads アカウントを連携した方（現在は運営者のみ）は、Threads の「設定 → アカウント → ウェブサイトのアクセス許可」から連携を解除できます。
解除すると、当ツールが保存したそのアカウントのトークンと情報を削除します。
削除のご依頼は、お問い合わせ（本ページ「5. お問い合わせ」）からも受け付けます。
```

※ データ削除の案内URLは、この節のアンカー（例 `https://sabusuku-yameta.com/privacy#data-deletion`）を開発者画面に登録する想定。

---

## 7. 残っている俊雄さんの操作

1. §2 の4つを決める（数字が無い件はクラウド側と相談）
2. ビジネス認証を進めるなら、Meta のビジネス・ポートフォリオで本人が手続き（書類の提出）
3. `threads_manage_insights` の追加とトークンの作り直し（了解をもらえれば、追加ボタンまでは私が進められる）
4. §2-3 のページができたら、§5 の台本で録画
5. 申請フォームのテスト用アカウント欄の入力と、最後の「送信」

## 8. 今日やっていないこと（意図的）

- 申請フォームへの入力（画面が読めなかった。かつ §2 の判断前に入れても無駄になりうる）
- 権限の追加・公開状態の切り替え（取り消しにくい操作のため）
- トークンやアプリシークレットの表示・記録
- Threads 上での操作（閲覧も含めて今日は無し）
