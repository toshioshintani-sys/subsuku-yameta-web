# Pinterest 素材prep（来週レバレッジのturnkey下ごしらえ）

> 作成 2026-06-14。位置づけ：律速＝流入≈0（GA4実数で確認）。品質ではなく「見つけてもらう経路」が
> ボトルネック。Pinterest は**検索＋ディスカバリ型で、ピンが長寿命（数ヶ月〜年単位で流入し続ける）**
> ＝ストック型の分配チャネル。SEO/AI検索が育つまでの「もう一つの入口」になる。
>
> **prep（この文書・画像生成）は今やる。実投稿は俊雄さんの原子操作。** これは計画拘束（原則2）に反しない
> ——禁じられているのは"実行/公開を毎日揺らすこと"であって、turnkey の事前準備は W+1 記事と同じく推奨。
> 月曜のスプリントで focus が切り替わった瞬間に、ゼロ摩擦で投稿開始できる状態にしておくのが狙い。

---

## 0. なぜ Pinterest がサブスクやめたに効くか

1. **高関心ユーザー**：Pinterest は「節約」「家計」「ミニマル」「固定費見直し」を能動的に検索する層が厚い＝当サイトのA層(離脱)/C層(整理)とドンピシャ。
2. **ピンが長寿命**：X/Threadsは数時間で流れるが、ピンは検索に乗って数ヶ月〜年で流入し続ける＝**ストック資産**。流入≈0の今に効く。
3. **被リンク的価値**：各ピンが当サイトへの導線。ドメイン認証(後述)で**リッチピン**になり信頼も上がる。
4. **画像が主役**：当サイトは lucide 線アイコン＋クリーンな配色で**ピン画像のテンプレ化がしやすい**（量産可能）。
5. **ブランド適合**：「煽らず・両論併記・やめさせてくれる信頼」をピンでもそのまま出せる（後述の禁則を守る）。

---

## 1. 俊雄さんの原子操作（私=Claudeは代行不可）

| # | 操作 | メモ |
|---|---|---|
| 1 | **Pinterest ビジネスアカウント作成**（無料） | 個人転用も可だが、analyticsとリッチピンのためビジネス推奨 |
| 2 | **ドメイン認証**（sabusuku.netlify.app を claim） | 設定 → 「ドメインを申請」。HTMLタグ/メタタグ/DNSで確認。GSCと同じ要領。認証でリッチピン＋ピン解析が有効化 |
| 3 | **ピンの投稿/予約** | 下記バッチのコピー＋生成画像で。手動 or 予約投稿 |

> 認証用メタタグが必要なら、`index.html` に1行足す対応は私がやります（GSC確認ファイルと同じ手順・言ってください）。

---

## 2. ボード構成（4枚・既存コンテンツに直結）

| ボード名 | 狙う検索 | 紐づく当サイト面 |
|---|---|---|
| **固定費の見直し・サブスク棚卸し** | 固定費 見直し / サブスク 整理 / 家計 | `/tracker`（棚卸しダッシュボード） |
| **やめて買い切り（卒業→入学）** | 買い切り / サブスク やめる / 月額 高い | `/yamete-kau` |
| **サブスク比較（特徴と弱点）** | 動画 サブスク 比較 / 乗り換え | `/discover`, `/discover/:genre` |
| **課金の心理（遊んで見抜く）** | 解約できない / もったいない 心理 | `/games`, `/games/:id` |

---

## 3. UTM 規約（GA4 で流入を分離計測）

すべてのピンのリンク末尾に付与：
```
?utm_source=pinterest&utm_medium=social&utm_campaign=<ボード英名>
```
ボード英名：`fixed-cost` / `buyout` / `compare` / `psychology`
例）`https://sabusuku.netlify.app/tracker?utm_source=pinterest&utm_medium=social&utm_campaign=fixed-cost`

GA4（プロパティ538470329）の「集客 > ソース/チャネル」で `pinterest / social` が分離表示される。

---

## 4. 第1バッチ：ピン候補（既存の公開ページのみ・即作成可）

> コピーは当サイトの作法に準拠：感情名でなく**瞬間の描写**、煽らない、断定で。タイトルは Pinterest 検索を意識し
> キーワードを左に。説明文は120〜200字目安。

### ボード①固定費の見直し・サブスク棚卸し → `/tracker`
- **Pin 1**
  - タイトル：`使ってないサブスク、年でいくら払ってる?`
  - 説明：`契約中のサブスクを入れるだけで「これからの年額」が出る無料の棚卸しツール。続けるかは、払った額ではなく"これから得る価値"で決められます。登録不要。`
  - URL：`/tracker?utm_source=pinterest&utm_medium=social&utm_campaign=fixed-cost`
- **Pin 2**
  - タイトル：`解約が面倒で放置…「動かない＝払い続ける」を断つ`
  - 説明：`解約は3クリック、継続は0クリック。何もしないと課金が続く構造を、サービス別の解約手順への近道つきで。`
  - URL：`/?utm_source=pinterest&utm_medium=social&utm_campaign=fixed-cost`

### ボード②やめて買い切り → `/yamete-kau`
- **Pin 3**
  - タイトル：`月額をやめて"買い切り"へ｜卒業→入学リスト`
  - 説明：`使うほど高くつく月額を、単発購入で済ませる選択肢。向く人・向かない人を両論併記で。合わなければ解約導線に戻れます。`
  - URL：`/yamete-kau?utm_source=pinterest&utm_medium=social&utm_campaign=buyout`

### ボード③サブスク比較 → `/discover`
- **Pin 4**
  - タイトル：`動画サブスク、どれを残す?｜特徴と"弱点"で比較`
  - 説明：`乗り換え先を、良い点だけでなく弱点つきで。ランキングや星はつけません。あなたの使い方で選べる比較図鑑。`
  - URL：`/discover?utm_source=pinterest&utm_medium=social&utm_campaign=compare`

### ボード④課金の心理 → `/games`
- **Pin 5**
  - タイトル：`"もったいない"でやめられない心理、30秒で体験`
  - 説明：`サンクコスト・現状維持・損失回避…課金をやめられない心のクセを、遊んで見抜く無料ミニゲーム。知らなくても遊べます。`
  - URL：`/games?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`
- **Pin 6**
  - タイトル：`「8ヶ月払って、未起動」あなたは続ける?`
  - 説明：`払った分はもう戻らない。それでも続けてしまう"サンクコスト"を、3つの場面で試す30秒ゲーム。`
  - URL：`/games/sunk-cost?utm_source=pinterest&utm_medium=social&utm_campaign=psychology`

> **W+1（6/15以降公開後に追加）**：コーヒー定期便→全自動メーカー／カミソリ替刃→電気シェーバーの記事ピン。
> 公開URL確定後に同フォーマットで追記する（未公開URLのピンは作らない）。

---

## 5. ピン画像テンプレート仕様（Gemini生成用・全ピン共通の"家族感"）

- **サイズ**：1000 × 1500 px（2:3・Pinterest推奨）
- **構成**：上1/3＝大きく読める日本語タイトル（モバイルのサムネでも読める太さ）／中央＝1つの明快なビジュアル（当サイトと同じ**線アイコン調・teal accent**、ごちゃつかせない）／下＝`サブスクやめた` ロゴ＋`sabusuku.netlify.app`
- **配色**：白/オフホワイト背景＋teal(accent)＋濃紺テキスト。サイトと同系。
- **禁則**：派手な煽り装飾・「衝撃」「ヤバい」系・ランキング数字・星。誠実でクリーンに。
- **Geminiプロンプト雛形**：
  ```
  Pinterest pin, 1000x1500 vertical, clean minimal Japanese editorial style.
  Top third: large bold Japanese headline "<タイトル>", highly legible.
  Center: single clear line-icon style illustration of <テーマの具体物>, teal accent on off-white.
  Bottom: small wordmark "サブスクやめた" and url "sabusuku.netlify.app".
  Palette: off-white background, teal accent, dark-navy text. No clutter, no hype, no stars/ranking.
  ```
  （`<タイトル>`＝各ピンのタイトル、`<テーマの具体物>`＝例: wallet / armchair / price tags / dumbbell など本文と対応）

---

## 5.5 マスコット「チョキくん」運用（全広報の標準キャラ・2026-06-14 俊雄さん GO）

ブランドの顔＝公式マスコット **チョキくん**（頭=正面チョキ型はさみ／体=人間型・`public/assets/mascot/mascot-*.svg`）を、ピン画像の標準要素にする。無味な数字ピンより、止まる・覚えられる・シェアされる。

**テーマ別 表情の使い分け：**

| 表情 | ファイル | 使うテーマ |
|---|---|---|
| cutting（紐を切る） | `mascot-cutting` | 解約・買い切り（卒業→入学） |
| thinking（考える） | `mascot-thinking` | 比較・判断・心理ゲーム |
| lost（きょとん/肩すくめ） | `mascot-lost` | 「まだ払ってる?」棚卸し・気づき系 |
| celebrate（喜ぶ） | `mascot-celebrate` | 節約達成・解約完了 |
| smile（微笑む） | `mascot-smile` | デフォルト・汎用 |

**生成**：`node scripts/seo/gen-pin-samples.mjs`（フレーム＋淡いティールの丸＋チョキくんを合成して 1000x1500 PNG）。サンプル＝`docs/pinterest/samples/pin-*.png`。Gemini手生成に頼らず**コードで量産**できる（テーマを `PINS` 配列に足すだけ）。
- レイアウト：上＝見出し2行（瞬間の描写・煽らない）＋ sub（両論併記/正直）／中下＝チョキくん（淡いティール丸の上）／下＝url。
- OG画像も同方針でチョキくん（cutting）入りに更新済（`og-image.png`）。

---

## 6. 運用メモ
- **頻度**：立ち上げ期は1日1〜3ピン（量より一貫性）。同一URLに複数デザインのピンを当てるのは可（Pinterest は重複に寛容・むしろ推奨）。
- **計測**：投稿1〜2週後に GA4 `pinterest / social` の流入と、各 `utm_campaign` 別のクリックを確認。伸びるボード/テーマに寄せる。
- **ブランド序列**：Pinterest はあくまで**入口**。着地後はサイトの解約導線（不可侵）が主役。ピンで誇大に釣って中身が薄い、は厳禁（信頼>分配）。

---

*次アクション：俊雄さん＝アカウント作成＋ドメイン認証（§1）。私＝認証メタタグ対応（依頼時）＋画像生成プロンプトの個別出し＋W+1公開後のピン追記。*
