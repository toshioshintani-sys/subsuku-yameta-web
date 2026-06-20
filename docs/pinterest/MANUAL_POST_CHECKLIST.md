# Pinterest 手動投稿チェックリスト（貼るだけ・ゼロ摩擦版）

> 作成 2026-06-14。開発者API（自律投稿）が通らなくても、**Pinterest流入はこの手動ルートで今すぐ始められる**。
> 画像・タイトル・説明・リンクはすべて単一ソース `scripts/seo/pins-data.mjs` から確定値を転記済み。
> **2026-06-14 実体確認済**：全20ピンの画像が `public/pins/` と `docs/pinterest/samples/` の両方に実在（欠損ゼロ）。リンクは確定URL（UTM付き）。
>
> 元気な時に上から貼るだけ。考える工程は §0（最初の1回）だけで、あとは単純作業。

---

## 画像フォルダ（ここから選ぶ）

```
C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web\public\pins\
```

各ピンの「画像: pin-xxx.png」をこのフォルダから選んでアップロード（ドラッグ&ドロップ）。
※ ネット経由でもOK：`https://sabusuku-yameta.com/pins/pin-xxx.png` をブラウザで開いて保存。

---

## §0. 最初の1回だけ（前提）

1. **Pinterestに「サブスクやめた」アカウントでログイン**しているか確認（ビジネスアカウント推奨）。
2. **（任意・後回し可）ドメイン認証**：設定 → ドメインを申請 → `sabusuku-yameta.com`。認証するとリッチピン＋解析が有効化。メタタグが要るなら index.html に1行入れる対応はこちら（Claude）でやります。**未認証でも普通のピン投稿は通る**ので、最初は飛ばしてOK。
3. **5つのボードを作る**（ピン作成時に新規ボードとして作ってもOK。先に作るなら下記の名前＋説明をコピペ）：

| # | ボード名 | ボード説明 |
|---|---|---|
| ① | 固定費の見直し・サブスク棚卸し | 使っていないサブスクの棚卸しと、固定費の見直し。煽らず・両論併記で。 |
| ② | やめて買い切り（卒業→入学） | 月額をやめて単発購入で済ます選択肢。向く人・向かない人を正直に。 |
| ③ | サブスク比較（特徴と弱点つき） | 乗り換え先を、良い点だけでなく弱点つきで。ランキングや★はつけません。 |
| ④ | 課金の心理（遊んで見抜く） | 解約をやめられない心のクセを、ミニゲームで体験して見抜く。 |
| ⑤ | サブスクのお役立ち（解約・乗り換え） | 解約・乗り換え・買い切り化を、煽りなし・両論併記で解説。 |

---

## §1. 1ピンの貼り方（毎回これの繰り返し）

1. Pinterest で **作成 → ピンを作成**
2. **画像**をアップロード（上のフォルダの `pin-xxx.png`）
3. **タイトル**を貼る
4. **説明**を貼る
5. **リンク**を貼る（リンク先URL欄）
6. **ボード**を選ぶ
7. **公開**

---

## §2. ペース & まず何から

- **立ち上げ期は1日1〜3ピン**（量より一貫性）。一気に20本貼らなくていい。
- **Day 1 は各ボードの ★（5本）** を貼って全ボードを埋める → 以降1日2〜3本ずつ残りを消化。
- 同じURLに別デザインのピンを後から足すのも可（Pinterestは重複に寛容）。

---

## §3. ピン一覧（ボード別・コピペ用）

### ① 固定費の見直し・サブスク棚卸し

**★ 画像: pin-tracker.png**
- タイトル: `使ってないサブスク、年でいくら払ってる?`
- 説明: `1分で棚卸し・無料・登録不要｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/tracker?utm_source=pinterest&utm_medium=social&utm_campaign=fixed-cost`

### ② やめて買い切り（卒業→入学）

**★ 画像: pin-buyout.png**
- タイトル: `月額をやめて、買い切りに。`
- 説明: `向く人・向かない人で正直に比較｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/yamete-kau?utm_source=pinterest&utm_medium=social&utm_campaign=buyout`

### ③ サブスク比較（特徴と弱点つき）

**★ 画像: pin-d-coffee.png**
- タイトル: `やめた月額で、コーヒー定期便。`
- 説明: `卒業→入学。向く人・向かない人｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/discover/coffee-subscription?utm_source=pinterest&utm_medium=social&utm_campaign=compare`

**画像: pin-d-frozen.png**
- タイトル: `冷凍弁当・宅食、自炊と比べてどう?`
- 説明: `特徴と弱点で比較｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/discover/frozen-meal?utm_source=pinterest&utm_medium=social&utm_campaign=compare`

**画像: pin-d-water.png**
- タイトル: `ウォーターサーバー、浄水ポットとどっち?`
- 説明: `年いくら変わるか正直に｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/discover/water-server?utm_source=pinterest&utm_medium=social&utm_campaign=compare`

### ④ 課金の心理（遊んで見抜く）

**★ 画像: pin-games.png**
- タイトル: `「解約できない」は、意志の弱さじゃない。`
- 説明: `課金のクセを30秒ゲームで見抜く｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/games?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

**画像: pin-g-sunk.png**
- タイトル: `8ヶ月払って、一度も開いてない。`
- 説明: `「もったいない」で続けてない? 30秒で｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/games/sunk-cost?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

**画像: pin-g-status.png**
- タイトル: `解約3クリック、継続0クリック。`
- 説明: `動かない=払い続ける、の正体｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/games/status-quo?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

**画像: pin-g-loss.png**
- タイトル: `「今やめると損」で、足が止まってない?`
- 説明: `引き止め画面の心理を見抜く｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/games/loss-aversion?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

**画像: pin-g-default.png**
- タイトル: `チェックは、最初から入ってた。`
- 説明: `"何もしない"を向こうは計算してる｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/games/default-effect?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

**画像: pin-g-plan.png**
- タイトル: `「来月こそ使う」、毎月言ってない?`
- 説明: `未来の自分を、少し過信してる｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/games/planning-fallacy?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

**画像: pin-g-decoy.png**
- タイトル: `なぜいつも、真ん中のプラン?`
- 説明: `松竹梅の"竹"は仕組まれてる｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/games/decoy-effect?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

### ⑤ サブスクのお役立ち（解約・乗り換え）

**★ 画像: pin-b-whycant.png**
- タイトル: `サブスクは、わざとやめにくい。`
- 説明: `ダークパターンの仕組みと対策｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/why-cant-cancel?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

**画像: pin-b-retention.png**
- タイトル: `引き止め画面で、心を折られない。`
- 説明: `突破する3つのコツ｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/how-to-survive-retention-screen?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

**画像: pin-b-yearly.png**
- タイトル: `年契約と月契約、結局どっちが得?`
- 説明: `判断軸と計算式を公開｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/monthly-vs-yearly-plan?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

**画像: pin-b-whencancel.png**
- タイトル: `解約は、いつ押すのが正解?`
- 説明: `請求日・月末・更新月の使い分け｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/when-to-cancel?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

**画像: pin-b-autorenew.png**
- タイトル: `「気づいたら課金されてた」を防ぐ`
- 説明: `自動更新の落とし穴と対策｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/auto-renewal-pitfalls?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

**画像: pin-b-gym.png**
- タイトル: `ジムをやめて、自宅トレに。`
- 説明: `何ヶ月で元が取れる? 向き不向きも｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/gym-cancel-to-home-training?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

**画像: pin-b-adobe.png**
- タイトル: `Adobe CCが高い人へ。買い切りで済む線。`
- 説明: `現実的なラインを正直に｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/adobe-cc-to-buyout-alternative?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

**画像: pin-b-budget.png**
- タイトル: `家計の見直し、どこから手をつける?`
- 説明: `優先順位の決め方｜サブスクやめた（解約・乗り換え・買い切り）`
- リンク: `https://sabusuku-yameta.com/blog/family-budget-review-order?utm_source=pinterest&utm_medium=social&utm_campaign=blog`

---

## §4. 投稿後（任意・1〜2週後）

- GA4（プロパティ538470329）→ 集客 > ソース/チャネルで **`pinterest / social`** を確認。
- `utm_campaign` 別（fixed-cost / buyout / compare / psychology / blog）でどのボードが伸びたか分かる。伸びるテーマに寄せる。

---

## メモ
- リンクは全て **確定URL（公開ページ）**。万一どれかが開かない／404なら、その場で直すので教えてください（こちらで修正→再デプロイ）。
- 開発者API（自律投稿）を再挑戦する時の直し方：**アプリ名はクリーンなASCII（例 `Subsuku Poster`、"meta"を含めない）を実キー打鍵**。詳細は `docs/pinterest/API_SETUP.md` と lessons.md 2026-06-06。
</content>
</invoke>
