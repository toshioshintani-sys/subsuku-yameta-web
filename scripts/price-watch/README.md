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

## 現在のカバレッジ（2026-07-05 baseline 実測）

| 状態 | 件数 | 意味 |
|---|---|---|
| ✅ 稼働（価格取得） | **17** | netflix / apple-music / hulu / dazn / apple-tv+ / microsoft-365 / notion / playstation-plus / claude-pro / evernote / apple-one / icloud+ / figma / deepl-pro / github-copilot / crunchyroll / discord-nitro |
| ⚠️ 空（JS描画） | 9 | spotify / youtube-premium / adobe-cc / dropbox / canva-pro / xbox-game-pass / google-one / vimeo / soundcloud-go（要 headless か別URL） |
| ⚠️ エラー | 4 | nintendo-switch-online(404) / nikkei(403) / chatgpt-plus(403 bot) / niconico(404)＝URL要修正 |
| ⏸ 未設定 | 28 | enabled:false＝要URL調査（JS描画/URL不明） |

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
