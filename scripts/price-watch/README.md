# 価格偵察部隊（Price Scout）— サブスクやめた

掲載58サービスの**公式料金ページを巡回し、価格の変化を検知する**バックエンド。stack letter
（`world-oracle-staging/agents/_runtime/price_watch.py`）の価格監視の仕組みを、サブスクやめた用に
Node へ移植し **日本円（¥1,200 / 1,200円）** に対応させたもの。

## 🛑 これは「検知」だけ。公開はしない（誤報ゼロ＝生命線）

価格の誤報は、このサイトの社会性（＝収益の源泉）を一発で壊す。だから設計を分業する：

```
[機械] price-watch.mjs        … 料金ページを巡回して「変化の候補」を見つける（自動・検知のみ）
        │  出力＝ state/candidates.json（＝検知候補キュー。自動公開されない）
        ▼
[人/Claude] 一次確認           … 候補を必ず公式ページで目視確認（LLMの記憶で価格を書かない）
        │  正しければ…
        ▼
[人/Claude] src/data/services.js の PRICE_HISTORY に手で追記（確認日つき・公式sourceURL・現在価格は書かず変更の事実のみ）
        ▼
        ServicePage の「価格・仕様の変更履歴」セクションに表示（本文の厚み＋鮮度＝E-E-A-T）
```

- **サイトを一切変更しない**：構造・アフィリンク・広告を触らない。よって **AdSense再審査中も安全**（検知が走っても公開サイトは不変）。
- stack letter でユーザーが「手動で見つけていた」作業を機械化し、「確認して書く」は人/Claude が担う。

## 仕組み（誤検知に強い集合比較）

各サービスの料金ページの生HTMLから **価格トークンの集合**（`¥1,200` `1,200円` `$12.99`）を抽出して
**署名(signature)** とし、前回の署名との**差分（追加/消失）**で変化を判定する。ハッシュ全文比較は
トークン/AB/日付で毎回変わるため使わない（並び替えに強い）。

- state：`state/price_watch_state.json` … `{ id: { sig:[...], checkedAt } }`
- 候補：`state/candidates.json` … 直近の検知候補（要一次確認）
- 初回はベースライン記録（イベントなし）。2回目以降で差分＝候補を出す。

## 使い方

```bash
node scripts/price-watch/price-watch.mjs                 # 全 enabled サービスを巡回
node scripts/price-watch/price-watch.mjs --only netflix,claude-pro
```

## 監視リストの精緻化（watch-list.json）

`watch-list.json` の各エントリ：`{ id, name, url, mode:"prices", enabled, stripScriptStyle?, dataPlanPrefix?, note }`。

- **url を直す/enabled にする**だけで偵察対象を増やせる。
- `enabled:false` は「JS描画で価格が生HTMLに出ない（Puppeteer未実装のため今は拾えない）」または
  「そもそも月額サブスクプランが存在しない（都度課金のみ等）」または「公式URL/アクセス手段が未確定」。
  理由は各エントリの note に明記（正直な区別。「未調査」で丸めない）。
- `stripScriptStyle: true` — `<script>/<style>` の中身を除去してから抽出する。**既定はfalse**（多くのサイトは
  script内にJSON-LD/ハイドレーションデータとして本物の価格を埋め込んでおり、一律除去すると壊れるため）。
  Next.js の React Server Components ストリーミング（`self.__next_f.push(...)`／`"$L6"`等の参照ID）や
  サードパーティ計装ライブラリの正規表現置換文字列（`"$1"`等）を価格と誤検出するページ**だけ**に絞って有効化する。
- `dataPlanPrefix: ["pro_"]` — ページに `data-plan="pro_monthly"` 等の属性がある場合、その値だけを価格として
  抽出する「スコープ限定抽出」。1ページに複数プラン（Free/Pro/Team/Enterprise等）が並び、通常の抽出では
  対象外のプランの価格まで拾ってしまう場合に使う（claude-pro専用に導入）。
- `renderMode: "headless"` — 生HTMLに価格が出ないSPA/クライアント描画サイトをPuppeteerで実際にレンダリング
  してから抽出する。起動コストがあるため、1件以上該当エントリがある時だけ遅延起動する。
- `excludeTokens: ["100,000円"]` — ページ内に実在するが無関係な金額（機能説明の上限額・記事タイトルの数字等）
  を個別に除外する明示リスト。広い正規表現ヒューリスティックで誤魔化さず、監査可能な形で1件ずつ指定する。
- `noAdBlock: true` — headlessモードで広告ブロック用のrequest interceptionをスキップする。一部サイト
  （adobe.com等）はリクエスト中断があるとHTTP/2接続が壊れるため。
- 生HTMLに価格が全く出ないサイト（SPA・APIクライアント経由の描画等）は、`renderMode:"headless"`で対応する
  （本リポは prerender.mjs で既に Puppeteer に依存済みなので新規導入は不要）。

## 現在のカバレッジ（2026-07-07 実測・正直な内訳）

⚠️ **重要な教訓（2026-07-05→07に3回の指摘/深掘りで発覚）**：「価格取得できた」件数だけでは何もわからない。
07-05/06の2回の指摘（詳細は下の教訓アーカイブ参照）に続き、07-07は「JS描画で空振りだった16件」を
Puppeteer headless化した上で**個別に深掘り**した結果、**コード側の実バグ**を発見・修正した：

- **PRICE_TOKが半角¥(U+00A5)のみ対応で全角￥(U+FFE5)を検出できていなかった**。YouTube/Dropbox/Google One/
  Amazon等は全角￥を使うため、これらは「JS描画の問題」ではなく**正規表現の文字クラス漏れ**が真因だった。
  一箇所直しただけで4サービスが同時に復活し、副次的にdazn/xbox-game-pass/chatgpt-plusの検出精度も上がった。
- **spotifyはURLが壊れていた**（`jp-ja/premium`がソフト404で「お探しのページが見つかりません」に着地）。
  正しいURL(`jp/premium`)に直したら素のfetchだけで即解決（headless不要）。
- **adobe-ccのnet::ERR_HTTP2_PROTOCOL_ERRORの真因は広告ブロック用のrequest interceptionそのもの**だった。
  Adobe側のbot対策ではなかった。`noAdBlock`オプションをコードに追加して解消。
- **soundcloud-goは日本非提供が実態**（ページ本文に"still working on launching...in your country"と明記。
  このマシンのIPは既に日本）。patreonと同型の構造的監視不能として無効化。
- **nintendo-switch-onlineは価格がテキストとして存在しない**（headless化・スクロール・iframe/ShadowDOM調査
  すべて実施したが本文に金額が一切出現せず。関連リンクも全て同一URLに集約）。おそらく画像/SVG埋め込み。
- **kindle-unlimitedは匿名スクレイピングでは価格ページに到達できない**（headless化してもログイン前提と
  思われる一般ストア画面が返るのみ。代替URLは書籍個別価格に化ける無関係ページへリダイレクト）。

| 状態 | 件数 | 内容 |
|---|---|---|
| ✅ **実価格を検出**（enabled中すべて・空振りゼロ） | **48/48** | pairs(40)/1password(18)/rakuten-music(13)/nikkei(12)/rakuten-magazine(12)/linkedin-premium(12)/apple-one(11)/github-copilot(11)/microsoft-365(10)/google-one(10)/playstation-plus(9)/line-music(8)/figma(8)/chatgpt-plus(6)/deepl-pro(6)/vimeo-pro(6)/spotify(5)/youtube-premium(5)/notion(5)/evernote(5)/wowow-on-demand(5)/icloud-plus(5)/crunchyroll(5)/apple-music(4)/disney-plus(4)/u-next(4)/dazn(4)/dropbox(4)/xbox-game-pass(4)/dmagazine(4)/yahoo-premium(4)/netflix(3)/amazon-prime(3)/apple-tv-plus(3)/canva-pro(3)/danime(3)/rakuten-tv(3)/claude-pro(3)/abema-premium(2)/amazon-music-unlimited(2)/lemino(2)/dmm-premium(2)/discord-nitro(2)/hulu(1)/adobe-cc(1)/note-premium(1)/niconico-premium(1)/bookwalker(1) |
| ⏸ 除外・保留（enabled:false・理由は各noteに明記） | **10** | nhk-plus(受信料契約の特殊料金)／patreon・soundcloud-go(クリエイター毎/地域未提供で構造的に固定価格なし)／honto・rakuten-kobo(**そもそも月額読み放題プラン自体が存在しない**都度課金ストア)／nintendo-switch-online(価格がテキストで存在しない・画像の可能性)／kindle-unlimited(ログイン前提でスクレイピング到達不可)／fod・match・audible(公式URL/アクセス手段が未解決のまま) |

**48+10=58**。「本当に手つかず」はaudible/fod/matchの3件のみ（URL/bot対策が未解決）。他7件は
「調べた結果、監視対象になり得ないと判明した」正しい除外で、「怠慢による除外」ではない。

### 🔄 2026-07-25 更新：カバレッジ 58件 → **67件（services.js 全件）**／有効 48 → 55件

**発覚した穴**：services.jsには67サービスあるのにwatch-listは58件しかなく、**AI系9サービスが丸ごと
監視対象外**だった（services.jsへ追加した時にwatch-listへ登録する手順が無かったのが原因）。
以後は下のコマンドで差分チェックすること：

```bash
python -X utf8 -c "
import json,io,re
d=json.load(io.open('scripts/price-watch/watch-list.json',encoding='utf-8'))
watched={w['id'] for w in d['watch']}
s=io.open('src/data/services.js',encoding='utf-8').read()
seg=s[s.find('export const SERVICES = ['):s.find('export const ALTERNATIVES')]
print('未監視:', sorted(set(re.findall(r\"id: '([a-z0-9-]+)',\", seg))-watched) or 'なし')
"
```

| 今回の対応 | サービス | 結果 |
|---|---|---|
| ✅ 新規登録・有効 | cursor / gemini-advanced / google-workspace / runway / windsurf | 素のfetchで取得成功（windsurfは devin.ai へリダイレクト＝ブランド統合を裏付け） |
| ✅ **多角調査で復活** | **youtube-music** | 素のfetchは0件 → **headless化で5件**（￥580/￥1,080/￥1,680/￥10,800） |
| ✅ **多角調査で復活** | **audible** | `/ep/member-benefits`・`/ep/pricing` は0件 → **トップページ**で￥1,500/￥880。旧noteの「未着手」表記のおかげで再挑戦できた |
| ⏸ 新規登録・無効 | google-play-pass | `/about/pass/` はストアへリダイレクト。`/store/pass/getstarted` で「600 円」は取れるが**「アプリ内購入が600円オフ」の特典表記**で月額ではない（誤報の温床）。月額はログインの先 |
| ⏸ 新規登録・無効 | midjourney / perplexity-pro | 素のfetchもheadlessも403＋Cloudflare系bot検証（Ray ID付き）。**明示的な拒否なので回避策は取らない** |

**無効12件の内訳**：構造的に不可能5（nhk-plus/honto/rakuten-kobo/patreon/soundcloud-go）／
bot拒否3（match/midjourney/perplexity-pro）／要ログイン・技術的未解決4（nintendo-switch-online/
kindle-unlimited/fod/google-play-pass）。

### 既知の不安定性（バグではなく実測で確認した揺れ・候補に出ても無視してよい）
- **chatgpt-plus**: Business料金2件(￥3,050/￥3,850)が非同期読み込みで4回中2回しか出現しない(sig=4⇄6)。
- **evernote**: ¥10が同様にsig=5⇄6を往復する。
- どちらも「一次確認したら価格は変わっていなかった」という前提で処理してよい（実際に3〜4回連続実測で確認済み）。

### 修正の技術詳細（同じ轍を踏まないための記録）
- **バグA（UUID/スラグ誤検出）**：evernoteの`"id":"default_accordion$2722514a-15d3-..."`のような、Prismic CMS
  等が生成するスラグの数字部分を価格と誤検出。`(?![a-z-])`否定先読みをPRICE_TOK正規表現に組み込むと
  **バックトラックで1桁ずつ短くマッチし直し「除外」でなく「縮んで残る」**という別バグを生んだため、
  matchAll後に次の1文字を手動チェックする方式（`FOLLOWED_BY_SLUG`）に修正。
- **バグB（Next.js RSCストリーミング誤検出）**：`self.__next_f.push(...)`が運ぶReact Server Componentsの
  参照ID（`"$L6"` `"$56"` `"$1"`等・SVGパスデータの`"$57"`等も含む）を価格と誤検出。figma/evernote/u-next/pairsで発見。
  **`stripScriptStyle: true`のオプトインで対処**（既定offなのは、他サイトではscript内のJSON-LD/ハイドレーション
  データに**本物の価格**が入っており、一律除去するとplaystation-plus/deepl-pro/crunchyroll/github-copilotの
  正しい価格まで壊す回帰を実際に起こしたため＝この回帰は一度発生させてから気づいて直した）。
- **バグC（サードパーティ計装ライブラリ誤検出）**：hulu/rakuten-tv/bookwalkerで共通して発見。New Relic系と
  思われるAPM/RUMライブラリの正規表現置換文字列（`.replace(t?n:i,"$1")`等）や`.log()`/`.addRelease()`
  メソッド呼び出しの引数（`$9`等）を価格と誤検出。同じく`stripScriptStyle: true`で解決。
- **バグD（複数プラン混在）**：claude-proはFree/Pro/Team/Enterprise/APIの価格が1ページに列挙され、
  単純な全文抽出では対象外プランの価格まで拾ってしまう。`data-plan="pro_monthly"`等の属性を発見し
  `dataPlanPrefix: ["pro_"]`でスコープ限定抽出するよう対応（Pro単体=$17/$20/$200の3件のみに）。
- **バグE（誤った公式URL）**：icloud-plusは旧URLが「多国比較の一覧記事」で65個中ほぼ全てが日本以外の
  通貨だった。`apple.com/jp/icloud/`という別の公式ページに差し替えて解決（コードでなくデータの誤り）。
- **バグF（全角￥の文字クラス漏れ・2026-07-07発見）**：PRICE_TOKが半角¥(U+00A5)のみで、YouTube/Dropbox/
  Google One/Amazonが使う全角￥(U+FFE5)を検出できていなかった。`[¥￥]`に拡張して解決。「JS描画で価格が
  出ない」と思っていた案件の半分は、実際はレンダリングの問題ではなく**この文字コード漏れ**が真因だった。
  日本語サイトの価格抽出では常に全角/半角の両方をカバーすること。
- **バグG（request interceptionがHTTP/2を壊す・2026-07-07発見）**：adobe-ccでheadless化時に
  `net::ERR_HTTP2_PROTOCOL_ERROR`が3回連続発生し、当初「Adobe側のbot対策」と誤診断していた。実際は
  広告ブロック用の`page.setRequestInterception(true)`自体が原因で、外すと解決した。`noAdBlock: true`
  オプションを追加（該当ページだけインターセプトをスキップ）。「JSエラーの見た目」を安易にサイト側の
  せいにせず、まず自分のコードの副作用を疑うこと。

### 残るbacklog（優先順）
1. **fod・match・audibleの公式URL確定**：WebSearchでも直接アクセスできず／未着手のまま。
2. **予告済みの将来の価格変動を監視**（発生後にPRICE_HISTORYへ追記）：
   - Notion「Workers」機能がベータ無料→**2026-08-11に有料化**（Custom Agentsと同じ$10/1,000クレジット）。
   - ニコニコプレミアムが**2026-08-01に料金改定予定**（blog.nicovideo.jp/niconews/1841で告知）。

## 自動化（2026-07-25 全面更新）

### ✅ 現在の本番運用＝ローカルのWindowsタスク（毎朝7:10）

```powershell
Get-ScheduledTask     -TaskName "Subsuku_PriceWatch_0710" | Select-Object TaskName, State
Get-ScheduledTaskInfo -TaskName "Subsuku_PriceWatch_0710" | Select-Object LastRunTime, LastTaskResult, NextRunTime
```

> 🛑 **2026-07-25に発覚した最大の事故：このタスクが存在せず、偵察部隊は2026-07-07から18日間まったく
> 動いていなかった。** その空白期間にAppleが日本の全サブスクを値上げしたが、**「いつ変わったか」は
> 永久に特定できなくなった**（前回観測7/7・今回7/25なので「18日間のどこか」としか書けない）。
> `candidates.json` にも7/7の検知が未処理のまま放置されていた。
> **時系列データは、取らなかった瞬間に永久に失われる。作業の最後に必ず「動いているか」を確認すること。**

登録コマンド（再登録が必要になった時）：

```powershell
$repo = "C:\Users\user\Desktop\Claude_work\subsukuyametaweb\subsuku-yameta-web"
$action  = New-ScheduledTaskAction -Execute "C:\Program Files\nodejs\node.exe" -Argument "scripts\price-watch\price-watch.mjs" -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -Daily -At 7:10am
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName "Subsuku_PriceWatch_0710" -Action $action -Trigger $trigger -Settings $settings -Force
```

### ✅ 判定担当＝ローカルのWindowsタスク（毎朝7:30・2026-07-31 追加・意図的な登録）

巡回（7:10）が検知を出しても、**それを公式ページで確かめて判定する人が居ないと何も起きない。**
実際 2026-07-28〜30 の3日間、監視は無人で正常に走り続けていたのに検知12件が未判定のまま溜まり、
サイトの情報は7/28から一度も更新されなかった。**監視の律速は検知ではなく判定だった。**
そこで判定を無人ルーティンに載せた（俊雄さん指示「ルーティーン作業に登録・情報更新と改修をセットで」）。

| | |
|---|---|
| タスク名 | `Subsuku_PriceJudge_0730`（毎日7:30 JST・7:10の巡回の20分後） |
| 実体 | `run_daily_judge.ps1` → `claude -p` に `daily_judge_prompt.md` を渡す |
| 課金 | Maxサブスク枠（ランナー冒頭で `ANTHROPIC_API_KEY` を除去。残すとAPI課金に化ける） |
| やること | 検知を公式ページで確認 → `detection_log.json` に verdict/evidence を記入 → 本物なら `services.js` と `PRICE_HISTORY` を修正 → **PR作成まで** |
| やらないこと | **main への直接push・PRのマージ**。誤報ゼロは最上位原則なので、公開に出る一歩手前で必ず人が止める |

```powershell
Get-ScheduledTask     -TaskName "Subsuku_PriceJudge_0730" | Select-Object TaskName, State
Get-ScheduledTaskInfo -TaskName "Subsuku_PriceJudge_0730" | Select-Object LastRunTime, LastTaskResult, NextRunTime
Start-ScheduledTask   -TaskName "Subsuku_PriceJudge_0730"   # 手動で走らせる（動作確認は必ずこの経路で）
Disable-ScheduledTask -TaskName "Subsuku_PriceJudge_0730"   # 止める（削除しない）
```

> ⚠️ **なぜマージまで自動化しないか。** 検知の的中率は実測で4%（25件中1件・2026-07-31時点）。
> 判定を誤った1件がそのまま公開価格になる経路を作ると、**機械が単独で誤報を出せてしまう**。
> このサイトの収益は信頼の上にしか立たないので、そこだけは人のゲートを残す。
> 自動マージまで進めたい場合は `proposal-stress-test` を経由すること（憲法§5-B）。

無人実行で踏みうる罠と対処は `~/.claude/skills/headless-claude-runner/SKILL.md` に集約されている。
特に **`.ps1` は UTF-8 BOM 付きで保存**（BOM無しだとTask Scheduler経由の `powershell.exe` が
日本語パスを誤読して落ちる）、**動作確認は `Start-ScheduledTask` で実タスクを起動**（対話PowerShellでの
実行は別経路なので確認にならない）の2点は、このランナーでも同じように効く。

ランナー側のガード（無人で静かに死なせないため）：

- 検知ゼロの日は `claude` を起動しない（トークンを使わない）
- 検知はあるのに台帳に今日の記録が無い＝巡回側の記録失敗 → Slackに投げて中止
- 未判定ゼロ＝すでに判定済み → スキップ（手動テストと定時実行の二重起動を防ぐ）
- exit 0 なのに未判定が減っていない → 空振りとしてSlack通知して exit 1

### ⏸ GitHub Actions（`.github/workflows/price-watch.yml`）は現状 手動トリガーのみ

scheduleがコメントアウトされており、その理由は「**AdSense承認後に有効化**」。
しかし **AdSenseは2026-07-15に休眠決定済み**（`docs/NOT_DOING.md`）なので、**この待機理由は既に消滅している**。

ただし有効化する前に、以下の設計上の穴を先に塞ぐ必要がある（2026-07-25 発見）：

- 現ワークフローは `permissions: contents: read` で、実行後に **`state/price_watch_state.json` をコミットして
  戻していない**。このままscheduleを有効化すると、毎回リポジトリ上の古いstateと比較することになり、
  **同じ差分を毎日検知し続ける**（＝候補が永久に消えない）。
- 対処するなら「実行後にstateをコミットするステップ追加＋`contents: write`」が要るが、CIに書き込み権限を
  与える変更なので、着手前に是非を判断すること。
- **当面はローカルのWindowsタスクが本番**（stateがローカルに正しく蓄積されるため）。Actionsは手動の予備。

## 3つのツールの役割分担（2026-07-25 追加・混同すると穴が開く）

| ツール | 比べるもの | 見つかるもの | 実行 |
|---|---|---|---|
| `price-watch.mjs` | 公式ページの**今日 vs 前回スナップショット** | **変化**（値上げ・値下げが起きた瞬間） | 毎日7:10（Windowsタスク） |
| `reconcile.mjs` | 公式ページ **vs うちの `PRICING`/`PLANS`** | **ズレ**（表示価格がそもそも古い） | 随時 `npm run price:reconcile` |
| `check-consistency.mjs` | `PRICE_HISTORY` **vs `PRICING`/`PLANS`** | **直し忘れ**（履歴だけ更新して表示が古い） | `npm run build` に組込み済 |

**なぜ3つ要るのか。** `price-watch.mjs` は *変化* しか見ていない。初回スナップショットの時点で
services.js が既に古ければ、その誤りは**永遠に「変化なし」と報告され続ける**。実際2026-07-25に
Netflix（1,490→実1,590）・Spotify（980→実1,080）・iCloud+（130円＝2世代前）が、監視が緑のまま
長期間の誤報になっていたことが判明した。**時間軸の監視（watch）と在庫の棚卸し（reconcile）は別物。**

`check-consistency.mjs` は `npm run build` の先頭で走るので、「値上げしました」と履歴に書いたのに
表示価格が古いままの状態では**ビルドが落ちてデプロイされない**＝矛盾したサイトは公開できない。

```bash
npm run price:reconcile                    # 全サービスの棚卸し
npm run price:reconcile -- --only netflix  # 1件だけ
npm run price:check                        # 履歴と表示の整合（build時に自動実行）
```

⚠️ reconcile の出力は**疑い候補**であって断定ではない。年額のみ表示・税別・JS描画・ログイン必須の
ページでは正常でも不一致になる。**必ず公式を目視で一次確認してから直す**（誤報ゼロ）。

## 由来と関連

- エンジンの原型：`world-oracle-staging/agents/_runtime/price_watch.py`（stack letter）。
- 検証済み初期データの出所：同 `content/pricing/changelog.json` / `logs/verified_prices.json`。
- 表示先（器）：`src/data/services.js` の `PRICE_HISTORY` ＋ `src/pages/ServicePage.jsx`。
- 判断の記録：`docs/lessons.md` 2026-07-05（Phase前倒しの上書き＋検知の安全スコープ）・2026-07-07（全角￥バグ等）。
- **調査の実務手順（右往左往防止）**：`~/.claude/skills/subsuku-price-scout/SKILL.md`
  （ライフオラクルのAI_RADARの方法論をサブスクやめた向けに再定義したスキル・2026-07-07作成）。
