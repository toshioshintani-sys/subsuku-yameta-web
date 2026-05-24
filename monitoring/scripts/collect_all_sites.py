# -*- coding: utf-8 -*-
"""
複数サイトの GA4 メトリクスを一括収集する wrapper。

- config/sites.json を読み込み、enabled: true のサイトだけ collect_ga4.py を呼ぶ
- 結果は logs/daily_metrics_<site_id>.csv に追記
- 既存 collect_ga4.py / logs/daily_metrics.csv は壊さない（ライフオラクル用は従来通り）

使い方：
  python collect_all_sites.py
  python collect_all_sites.py --date 2026-05-23
  python collect_all_sites.py --only sabusuku-yameta
"""
from __future__ import annotations
import argparse
import json
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
_MONITORING_DIR = _SCRIPT_DIR.parent
_SITES_CONFIG = _MONITORING_DIR / "config" / "sites.json"
_LOGS_DIR = _MONITORING_DIR / "logs"
_COLLECT_GA4 = _SCRIPT_DIR / "collect_ga4.py"


def _jst_yesterday():
    jst = timezone(timedelta(hours=9))
    return (datetime.now(jst) - timedelta(days=1)).strftime("%Y-%m-%d")


def load_sites():
    if not _SITES_CONFIG.exists():
        print(f"[collect_all_sites] config not found: {_SITES_CONFIG}", file=sys.stderr)
        sys.exit(1)
    cfg = json.loads(_SITES_CONFIG.read_text(encoding="utf-8"))
    return [s for s in cfg.get("sites", []) if s.get("enabled")]


def collect_one(site, target_date):
    """1サイトの GA4 を収集して JSON で返す。失敗時は error フィールドを含む dict。"""
    pid = site.get("ga4_property_id")
    if not pid or pid.startswith("PLACEHOLDER"):
        return {"site_id": site["id"], "error": "GA4_PROPERTY_ID_PLACEHOLDER"}

    try:
        result = subprocess.run(
            [sys.executable, str(_COLLECT_GA4),
             "--property-id", pid,
             "--date", target_date],
            capture_output=True, text=True, timeout=120, check=False,
        )
        if result.returncode != 0:
            return {
                "site_id": site["id"],
                "error": "COLLECT_GA4_FAILED",
                "stderr": result.stderr[:500],
            }
        try:
            data = json.loads(result.stdout)
        except json.JSONDecodeError:
            return {"site_id": site["id"], "error": "JSON_PARSE_ERROR", "raw": result.stdout[:500]}
        data["site_id"] = site["id"]
        data["site_name"] = site["name"]
        data["site_url"] = site["url"]
        return data
    except subprocess.TimeoutExpired:
        return {"site_id": site["id"], "error": "TIMEOUT_120S"}


def append_site_csv(site_id, row_data):
    """サイト別 CSV に1行追記。スキーマは collect_ga4.py の出力に追従。"""
    csv_path = _LOGS_DIR / f"daily_metrics_{site_id}.csv"
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    is_new = not csv_path.exists()

    # 主要メトリクスだけ抽出
    fields = ["date", "sessions", "users", "pageviews", "engagement_rate"]
    values = [str(row_data.get(f, "")) for f in fields]

    with csv_path.open("a", encoding="utf-8") as f:
        if is_new:
            f.write(",".join(fields) + "\n")
        f.write(",".join(values) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=_jst_yesterday())
    ap.add_argument("--only", default=None, help="site id を指定すると1サイトだけ実行")
    ap.add_argument("--no-csv", action="store_true", help="CSV 追記をスキップ")
    args = ap.parse_args()

    sites = load_sites()
    if args.only:
        sites = [s for s in sites if s["id"] == args.only]
        if not sites:
            print(f"[collect_all_sites] site not found or not enabled: {args.only}", file=sys.stderr)
            sys.exit(1)

    results = []
    for site in sites:
        print(f"[collect_all_sites] collecting {site['id']} ({site['ga4_property_id']})...", file=sys.stderr)
        data = collect_one(site, args.date)
        results.append(data)
        if "error" not in data and not args.no_csv:
            append_site_csv(site["id"], data)

    # 標準出力に全サイト結果を JSON で出す（build_email から消費）
    print(json.dumps({"date": args.date, "sites": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
