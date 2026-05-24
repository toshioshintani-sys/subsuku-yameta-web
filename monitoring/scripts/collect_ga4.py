# -*- coding: utf-8 -*-
# GA4 Data API collector. Usage: collect_ga4.py [--property-id X] [--date YYYY-MM-DD]
from __future__ import annotations
import argparse, json, os, sys
from datetime import datetime, timedelta, timezone, date as _date
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
_MONITORING_ADC = _SCRIPT_DIR.parent / "config" / "adc.json"

def _ensure_ga4_lib():
    try:
        import google.analytics.data_v1beta  # noqa
    except ImportError:
        import subprocess
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install",
             "google-analytics-data", "--break-system-packages", "-q"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def _jst_yesterday():
    jst = timezone(timedelta(hours=9))
    return (datetime.now(jst) - timedelta(days=1)).strftime("%Y-%m-%d")

def _setup_credentials():
    if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        return None
    if _MONITORING_ADC.exists():
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(_MONITORING_ADC)
        return str(_MONITORING_ADC)
    home = os.environ.get("USERPROFILE") or os.environ.get("HOME") or ""
    sa_key = Path(home) / ".life-oracle" / "ga4-sa.json"
    if sa_key.exists():
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(sa_key)
        return str(sa_key)
    return None

def _validate_adc():
    """adc.jsonの事前検証。問題があれば具体的なエラーコード文字列を返す。正常ならNone。"""
    if not _MONITORING_ADC.exists():
        return "GA4_API:ADC_MISSING"
    try:
        d = json.loads(_MONITORING_ADC.read_text(encoding="utf-8"))
    except Exception:
        return "GA4_API:ADC_CORRUPTED"
    if not d.get("refresh_token"):
        return "GA4_API:ADC_NO_REFRESH_TOKEN"
    if d.get("type") != "authorized_user":
        return "GA4_API:ADC_WRONG_TYPE"
    return None

def _emit(payload):
    print(json.dumps(payload, ensure_ascii=False), flush=True)

def fetch_ga4(property_id, target_date=None):
    if target_date is None:
        target_date = _jst_yesterday()
    out = {"date": target_date, "active_users_1d": None, "sessions_1d": None,
           "avg_engagement_sec": None, "top_sources": [],
           "diag_start": None, "diag_complete": None, "diag_completion_rate": None,
           "error": None}
    _setup_credentials()
    adc_error = _validate_adc()
    if adc_error:
        out["error"] = adc_error
        return out
    _ensure_ga4_lib()
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import (
            DateRange, Dimension, Filter, FilterExpression, Metric, RunReportRequest)
    except ImportError as e:
        out["error"] = f"GA4_API:LIB_MISSING:{e}"
        return out
    try:
        client = BetaAnalyticsDataClient()
        # ---- クエリ1: セッション・ユーザー・滞在時間 ----
        req = RunReportRequest(
            property=f"properties/{property_id}",
            date_ranges=[DateRange(start_date=target_date, end_date=target_date)],
            metrics=[Metric(name="activeUsers"), Metric(name="sessions"),
                     Metric(name="averageSessionDuration")])
        resp = client.run_report(req)
        if resp.rows:
            row = resp.rows[0]
            out["active_users_1d"] = int(row.metric_values[0].value or 0)
            out["sessions_1d"]     = int(row.metric_values[1].value or 0)
            out["avg_engagement_sec"] = float(row.metric_values[2].value or 0.0)
        # ---- クエリ2: 流入元 ----
        req2 = RunReportRequest(
            property=f"properties/{property_id}",
            date_ranges=[DateRange(start_date=target_date, end_date=target_date)],
            dimensions=[Dimension(name="sessionSource")],
            metrics=[Metric(name="sessions")])
        resp2 = client.run_report(req2)
        sources = []
        for row in resp2.rows:
            sources.append({"source": row.dimension_values[0].value,
                            "sessions": int(row.metric_values[0].value or 0)})
        sources.sort(key=lambda x: x["sessions"], reverse=True)
        out["top_sources"] = sources[:5]
        # ---- クエリ3: 診断ファネルイベント ----
        req3 = RunReportRequest(
            property=f"properties/{property_id}",
            date_ranges=[DateRange(start_date=target_date, end_date=target_date)],
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
            dimension_filter=FilterExpression(
                filter=Filter(
                    field_name="eventName",
                    in_list_filter=Filter.InListFilter(
                        values=["step_start", "step_result_shown", "step_back_pressed"]))))
        resp3 = client.run_report(req3)
        event_counts = {}
        for row in resp3.rows:
            event_counts[row.dimension_values[0].value] = int(row.metric_values[0].value or 0)
        diag_start    = event_counts.get("step_start", 0)
        diag_complete = event_counts.get("step_result_shown", 0)
        out["diag_start"]    = diag_start
        out["diag_complete"] = diag_complete
        out["diag_completion_rate"] = round(diag_complete / diag_start, 3) if diag_start > 0 else None
    except Exception as e:
        err_str = str(e)
        err_type = type(e).__name__
        # トークン失効を特定
        if "invalid_grant" in err_str or "Token has been expired" in err_str or "RefreshError" in err_type:
            out["error"] = f"GA4_API:TOKEN_EXPIRED:{err_str[:100]}"
        elif "403" in err_str or "PERMISSION_DENIED" in err_str:
            out["error"] = f"GA4_API:PERMISSION_DENIED:{err_str[:100]}"
        elif "quota" in err_str.lower():
            out["error"] = f"GA4_API:QUOTA_EXCEEDED:{err_str[:100]}"
        else:
            out["error"] = f"GA4_API:RUNTIME:{err_type}:{err_str[:200]}"
    return out

def main():
    ap = argparse.ArgumentParser()
    # GA4 プロパティID（life-oracle.jp）はメモリに 534433669 で確定済み（2026-04-24 俊雄さん決定）
    # 環境変数 GA4_PROPERTY_ID または --property-id で上書き可能
    ap.add_argument("--property-id", default=os.environ.get("GA4_PROPERTY_ID", "534433669"))
    ap.add_argument("--date", default=None, help="YYYY-MM-DD (JST). Default: JST yesterday.")
    args = ap.parse_args()
    if not args.property_id:
        _emit({"date": args.date or _jst_yesterday(), "active_users_1d": None,
               "sessions_1d": None, "avg_engagement_sec": None, "top_sources": [],
               "diag_start": None, "diag_complete": None, "diag_completion_rate": None,
               "error": "GA4_API:PROPERTY_ID_UNSET"})
        return 2
    result = fetch_ga4(args.property_id, target_date=args.date)
    _emit(result)
    return 0 if result.get("error") is None else 1

if __name__ == "__main__":
    sys.exit(main())
