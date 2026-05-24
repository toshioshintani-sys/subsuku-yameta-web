# 複数サイト対応 日次メール（v3） — 統合ガイド

> 2026-05-23 サブスクやめた を monitoring/ に統合した際の v3 パイプラインの説明。
> 既存 v2 はそのまま残してあり、いつでも切り戻せる。

---

## 1. 構成

```
config/sites.json                       ← 監視対象サイト定義
        ↓
scripts/collect_all_sites.py            ← 全サイトを順に GA4 から取得
        ↓ (stdout: { date, sites: [...] })
scripts/build_email_v3.py               ← 1通のメール本文に統合
        ↓ (stdout: { subject, markdown, html })
Gmail draft (Cowork のスケジュールタスクが作成)
```

サイト別 CSV は `logs/daily_metrics_<site_id>.csv` に追記される（前日比計算に使用）。
既存の `logs/daily_metrics.csv`（ライフオラクル単体）は触らない。

## 2. 実行コマンド

### 単発実行（手動テスト）

```bash
# 昨日（JST）の全サイト
python monitoring/scripts/collect_all_sites.py \
  | python monitoring/scripts/build_email_v3.py --out monitoring/logs/_email_v3.json

# 特定の日
python monitoring/scripts/collect_all_sites.py --date 2026-05-23 \
  | python monitoring/scripts/build_email_v3.py --out monitoring/logs/_email_v3.json

# 1サイトだけ
python monitoring/scripts/collect_all_sites.py --only sabusuku-yameta \
  | python monitoring/scripts/build_email_v3.py
```

### 出力の形

`_email_v3.json` には `subject` / `markdown` / `html` の3キー。
Cowork は `html` を Gmail draft の本文に貼り、`subject` を件名に使う想定。

## 3. v2 と v3 の切り替え

| 項目 | v2（現在運用中） | v3（新規） |
|---|---|---|
| サイト数 | 1（ライフオラクルのみ） | N（sites.json で増減） |
| 入力 | logs/daily_metrics.csv | collect_all_sites.py の stdout JSON |
| 件名 | 【日次レポート】YYYY-MM-DD のユーザー動向 | 【日次レポート】YYYY-MM-DD のユーザー動向（Nサイト） |
| 互換性 | 維持 | 別ファイル |

### 切替手順（Cowork スケジュールタスク側）

1. 朝の日次タスクで実行コマンドを差し替える：
   - v2: `python monitoring/scripts/collect_ga4.py ... && python monitoring/scripts/build_email_v2.py ...`
   - v3: `python monitoring/scripts/collect_all_sites.py | python monitoring/scripts/build_email_v3.py --out monitoring/logs/_email_v3.json`
2. Gmail MCP の `create_draft` に渡す HTML/subject を v3 の JSON から読む
3. 1週間並走させてズレがないことを確認 → v2 を退役

## 4. サイトを増やすとき

`config/sites.json` に1ブロック追加するだけ：

```json
{
  "id": "new-site",
  "name": "新サイト",
  "url": "https://example.com/",
  "ga4_property_id": "XXXXXXXXX",
  "kpi": { "primary": "session", "secondary": ["pageview"] },
  "enabled": true
}
```

GA4 サービスアカウントに Viewer 権限が付いていれば自動で次回から含まれる。

## 5. 既知の挙動

- 初日は前日比が出ない（CSV に1行しかないため）→ 2日目以降から `（前日比 +N / ↑x.x%）` が表示される
- サイト取得失敗時は `⚠️ 取得失敗：<エラー>` セクションが入る（他サイトは続行）
- `collect_ga4.py` のタイムアウトは120秒
