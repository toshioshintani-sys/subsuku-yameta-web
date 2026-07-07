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

## 自動化（GitHub Actions）

`.github/workflows/price-watch.yml`。**AdSense再審査中は手動トリガー（workflow_dispatch）のみ**で、
検知結果を artifact（candidates.json）として出す（サイト・リポは変更しない）。**承認後に schedule を有効化**し、
毎日巡回→候補を人/Claude が確認→ PRICE_HISTORY に反映、の運用へ。

## 由来と関連

- エンジンの原型：`world-oracle-staging/agents/_runtime/price_watch.py`（stack letter）。
- 検証済み初期データの出所：同 `content/pricing/changelog.json` / `logs/verified_prices.json`。
- 表示先（器）：`src/data/services.js` の `PRICE_HISTORY` ＋ `src/pages/ServicePage.jsx`。
- 判断の記録：`docs/lessons.md` 2026-07-05（Phase前倒しの上書き＋検知の安全スコープ）。
