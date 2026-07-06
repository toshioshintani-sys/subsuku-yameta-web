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

`watch-list.json` の各エントリ：`{ id, name, url, mode:"prices", enabled, note }`。

- **url を直す/enabled にする**だけで偵察対象を増やせる。
- `enabled:false` は「価格がJS描画で生HTMLに出ない」または「料金URL未確定」＝要URL調査。
- 生HTMLに価格が出ないサイト（SPA）は、この方式では拾えない（将来 headless 取得で対応）。

## 現在のカバレッジ（2026-07-05 baseline 実測・正直な内訳）

⚠️ **重要**：「価格取得できた」＝「信頼できる」ではない。署名(signature)の中身を目視で確認したところ、
17件中5件は**ノイズ（無関係な数値）を価格として誤検出**しており、このまま運用すると偽陽性の差分を
量産し、確認作業（誤報ゼロの砦）を疲弊させる。**次に着手する時は、まずこのノイズ5件の修正を最優先**にする。

| 状態 | 件数 | 内容 |
|---|---|---|
| ✅ **クリーン**（信頼できる価格取得） | **12** | netflix / apple-music / dazn / apple-tv+ / microsoft-365 / notion / playstation-plus / apple-one / github-copilot / deepl-pro / crunchyroll / discord-nitro |
| 🛑 **ノイズ**（取得はできるが誤検出混入・要修正） | **5** | **evernote**（`$2722514` `$60150` 等ゴミ値混入）／**icloud-plus**（署名65件中ほとんどがゴミ）／**claude-pro**（API従量課金の単価表を誤取得・実際のサブスク価格でない）／**figma**（座席計算等の値を誤って価格トークン扱い）／**hulu**（本来¥のみのはずが謎の`$`表記が混入） |
| ⚠️ 空（JS描画で価格が生HTMLに出ない） | 9 | spotify / youtube-premium / adobe-cc / dropbox / canva-pro / xbox-game-pass / google-one / vimeo / soundcloud-go（**Puppeteerは本リポの既存依存**＝新規導入なしで対応できる見込みだが未着手） |
| ⚠️ URLエラー | 4 | nintendo-switch-online(404) / nikkei(403) / chatgpt-plus(403 bot) / niconico(404)＝URL要修正（比較的安価な修正） |
| ⏸ 未着手 | 28 | enabled:false＝URLすら調べていない |

### 次に着手する時のbacklog（優先順）
1. **ノイズ5件の修正**（最優先）：署名抽出のフィルタ強化（例：$記号のみ許可し円のみのサイトでは$を無視する／価格らしくない桁数・並びを除外する）か、直しきれなければ一旦 `enabled:false` にして偽陽性を止める。
2. URLエラー4件の修正（正しい料金ページURLへ差し替え）。
3. JS描画9件：Puppeteerで生HTML化してから同じ署名ロジックを通す（技術的には既存依存で可能）。
4. 未着手28件：正しい料金ページURLの調査。

→ **58部隊のロースターは揃い、17部隊が即稼働**。残りは url の精緻化で順次オンにする（framework完成・データは育てる段階）。

## 自動化（GitHub Actions）

`.github/workflows/price-watch.yml`。**AdSense再審査中は手動トリガー（workflow_dispatch）のみ**で、
検知結果を artifact（candidates.json）として出す（サイト・リポは変更しない）。**承認後に schedule を有効化**し、
毎日巡回→候補を人/Claude が確認→ PRICE_HISTORY に反映、の運用へ。

## 由来と関連

- エンジンの原型：`world-oracle-staging/agents/_runtime/price_watch.py`（stack letter）。
- 検証済み初期データの出所：同 `content/pricing/changelog.json` / `logs/verified_prices.json`。
- 表示先（器）：`src/data/services.js` の `PRICE_HISTORY` ＋ `src/pages/ServicePage.jsx`。
- 判断の記録：`docs/lessons.md` 2026-07-05（Phase前倒しの上書き＋検知の安全スコープ）。
