# -*- coding: utf-8 -*-
"""
affiliate_click（アフィリエイトのクリック）を GA4 から集計して表示する（2026-11-19）。

アフィリエイトを元に戻した日（2026-10-29・VITE_REVIEW_MODE=false）以降に、クリックが出ているかを見る。
GA4 の鍵がある環境（PC の monitoring/config/adc.json、または環境変数 GA4_CREDENTIALS_JSON を入れたクラウド）で動かす。

  python -X utf8 monitoring/scripts/ga4_affiliate_clicks.py              # 2026-10-29 から昨日まで
  python -X utf8 monitoring/scripts/ga4_affiliate_clicks.py --since 2026-11-01

🛑 このリポジトリは公開。結果はコミットしない・docs に貼らない（画面で見るだけ）。
プロパティ 538470329 = サブスクやめた（534433669 はライフオラクル）。
カスタムディメンション（イベント範囲・登録済み）：asp・placement・service・layer・position。
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

PROPERTY_ID = "538470329"
JST = timezone(timedelta(hours=9))
DEFAULT_SINCE = "2026-10-29"


def _credentials() -> str | None:
    """鍵を用意する。問題があれば理由の文字列を返す。"""
    raw = os.environ.get("GA4_CREDENTIALS_JSON", "").strip()
    if raw:
        try:
            info = json.loads(raw)
        except json.JSONDecodeError:
            return "GA4_CREDENTIALS_JSON が JSON として読めない"
        adc = HERE.parent / "config" / "adc.json"
        if info.get("type") == "authorized_user":
            adc.parent.mkdir(parents=True, exist_ok=True)
            adc.write_text(raw, encoding="utf-8")
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(adc)
            return None
        import tempfile
        fd, path = tempfile.mkstemp(suffix=".json")
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(raw)
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path
        return None
    import collect_ga4
    used = collect_ga4._setup_credentials()
    if not used:
        return "GA4 の鍵がない（monitoring/config/adc.json も GA4_CREDENTIALS_JSON も見つからない）"
    return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default=DEFAULT_SINCE, help=f"集計の開始日 YYYY-MM-DD（既定 {DEFAULT_SINCE}＝アフィリエイトを戻した日）")
    args = ap.parse_args()
    yesterday = (datetime.now(JST) - timedelta(days=1)).strftime("%Y-%m-%d")

    err = _credentials()
    if err:
        print(f"取得できません：{err}")
        return 1

    import collect_ga4
    collect_ga4._ensure_ga4_lib()
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange, Dimension, Filter, FilterExpression, Metric, OrderBy, RunReportRequest)

    client = BetaAnalyticsDataClient()
    rng = [DateRange(start_date=args.since, end_date=yesterday)]
    only_click = FilterExpression(filter=Filter(
        field_name="eventName", string_filter=Filter.StringFilter(value="affiliate_click")))

    print(f"== affiliate_click（{args.since} 〜 {yesterday}）・プロパティ {PROPERTY_ID} ==")

    # 1) 日別：セッションとクリック
    sess = {}
    for r in client.run_report(RunReportRequest(
            property=f"properties/{PROPERTY_ID}", date_ranges=rng,
            dimensions=[Dimension(name="date")], metrics=[Metric(name="sessions")])).rows:
        sess[r.dimension_values[0].value] = int(r.metric_values[0].value or 0)
    clicks = {}
    for r in client.run_report(RunReportRequest(
            property=f"properties/{PROPERTY_ID}", date_ranges=rng,
            dimensions=[Dimension(name="date"), Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")], dimension_filter=only_click)).rows:
        clicks[r.dimension_values[0].value] = int(r.metric_values[0].value or 0)
    total_s = sum(sess.values())
    total_c = sum(clicks.values())
    print("\n[日別]  日付  セッション  クリック")
    for d in sorted(sess):
        print(f"  {d[:4]}-{d[4:6]}-{d[6:]}  {sess[d]:>6}  {clicks.get(d, 0):>6}")
    rate = f"{total_c / total_s * 100:.1f}%" if total_s else "-"
    print(f"  合計  セッション {total_s} / クリック {total_c}（セッション比 {rate}）")

    # 2) 内訳：ASP・設置場所・サービス（登録済みのカスタムディメンション）
    for label, dim in (("ASP", "asp"), ("設置場所", "placement"), ("サービス", "service"), ("層", "layer")):
        try:
            resp = client.run_report(RunReportRequest(
                property=f"properties/{PROPERTY_ID}", date_ranges=rng,
                dimensions=[Dimension(name=f"customEvent:{dim}")], metrics=[Metric(name="eventCount")],
                dimension_filter=only_click,
                order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="eventCount"), desc=True)], limit=15))
            print(f"\n[{label}別]")
            if not resp.rows:
                print("  （データなし）")
            for r in resp.rows:
                print(f"  {r.dimension_values[0].value or '(not set)':<28} {int(r.metric_values[0].value or 0):>5}")
        except Exception as e:  # noqa: BLE001
            print(f"\n[{label}別] 取得できません（{type(e).__name__}）：カスタムディメンション customEvent:{dim} の登録を確認")
    return 0


if __name__ == "__main__":
    sys.exit(main())
