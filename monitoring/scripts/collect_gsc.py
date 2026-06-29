# -*- coding: utf-8 -*-
# GSC (Google Search Console) Search Analytics collector.
#
# 目的：日報で繰り返し欲しがっていた「配布律速の切り分け」をコストゼロで取る。
#   - impression が 0       → まだ検索結果に出ていない（権威/インデックス律速＝被リンク・時間が必要）
#   - impression>0 / click=0 → 出てはいるがクリックされない（順位/タイトル/CTR 律速）
#   - click>0               → 検索流入が流れ始めている
#
# 認証：Indexing API と同じサービスアカウント（GSC の「所有者」）を再利用する。
#   所有者は Search Analytics(webmasters.readonly) を読めるため、追加の原子操作は不要。
#   優先順：(1) 環境変数 GOOGLE_SERVICE_ACCOUNT_JSON（CIの既存 secret・JSON全文）
#           (2) 環境変数 GOOGLE_APPLICATION_CREDENTIALS（SA鍵ファイルのパス）
#           (3) monitoring/config/sa.json（ローカル・gitignore 済）
#
# Usage: collect_gsc.py [--site sc-domain:sabusuku-yameta.com] [--days 28] [--top 10]
from __future__ import annotations
import argparse, json, os, sys, tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
_LOCAL_SA = _SCRIPT_DIR.parent / "config" / "sa.json"

# GSC のデータ反映は2〜3日遅れる。終端を「今日-3日」に置く。
_DATA_LAG_DAYS = 3
_SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
_API = "https://searchconsole.googleapis.com/webmasters/v3"


def _jst_today():
    return datetime.now(timezone(timedelta(hours=9))).date()


def _ensure_libs():
    try:
        import google.oauth2.service_account  # noqa
        import google.auth.transport.requests  # noqa
        import requests  # noqa
    except ImportError:
        import subprocess
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install",
             "google-auth", "requests", "--break-system-packages", "-q"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def _emit(payload):
    print(json.dumps(payload, ensure_ascii=False), flush=True)


def _load_sa_info():
    """サービスアカウント情報(dict)を返す。見つからなければ None。"""
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    if raw:
        try:
            return json.loads(raw)
        except Exception:
            return "CRED_INVALID"
    path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if path and Path(path).exists():
        try:
            return json.loads(Path(path).read_text(encoding="utf-8"))
        except Exception:
            return "CRED_INVALID"
    if _LOCAL_SA.exists():
        try:
            return json.loads(_LOCAL_SA.read_text(encoding="utf-8"))
        except Exception:
            return "CRED_INVALID"
    return None


def _verdict(totals):
    imp = totals.get("impressions") or 0
    clk = totals.get("clicks") or 0
    if imp <= 0:
        return "NOT_SHOWN"          # 検索結果に出ていない＝権威/インデックス律速
    if clk <= 0:
        return "SHOWN_NO_CLICK"     # 出てはいる＝順位/タイトル/CTR 律速
    return "CLICKS_FLOWING"         # 検索流入が流れている


def fetch_gsc(site, days=28, top=10):
    end = _jst_today() - timedelta(days=_DATA_LAG_DAYS)
    start = end - timedelta(days=days - 1)
    out = {
        "site": site,
        "date_start": start.isoformat(),
        "date_end": end.isoformat(),
        "totals": {"clicks": None, "impressions": None, "ctr": None, "position": None},
        "top_queries": [],
        "top_pages": [],
        "verdict": None,
        "error": None,
    }

    sa_info = _load_sa_info()
    if sa_info is None:
        out["error"] = "GSC_API:CRED_MISSING"
        return out
    if sa_info == "CRED_INVALID":
        out["error"] = "GSC_API:CRED_INVALID"
        return out

    _ensure_libs()
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession
    except ImportError as e:
        out["error"] = f"GSC_API:LIB_MISSING:{e}"
        return out

    try:
        creds = service_account.Credentials.from_service_account_info(sa_info, scopes=_SCOPES)
        session = AuthorizedSession(creds)
        url = f"{_API}/sites/{_quote(site)}/searchAnalytics/query"
        base = {"startDate": start.isoformat(), "endDate": end.isoformat()}

        # クエリ1: 合計（dimension なし）＝切り分けの本体
        r0 = session.post(url, json={**base, "rowLimit": 1}, timeout=30)
        _raise_for_gsc(r0)
        rows0 = (r0.json() or {}).get("rows", [])
        if rows0:
            t = rows0[0]
            out["totals"] = {
                "clicks": int(t.get("clicks", 0)),
                "impressions": int(t.get("impressions", 0)),
                "ctr": round(float(t.get("ctr", 0.0)), 4),
                "position": round(float(t.get("position", 0.0)), 1),
            }
        else:
            out["totals"] = {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": None}

        # クエリ2: 上位クエリ
        r1 = session.post(url, json={**base, "dimensions": ["query"], "rowLimit": top}, timeout=30)
        _raise_for_gsc(r1)
        for row in (r1.json() or {}).get("rows", []):
            out["top_queries"].append({
                "query": (row.get("keys") or [""])[0],
                "clicks": int(row.get("clicks", 0)),
                "impressions": int(row.get("impressions", 0)),
                "ctr": round(float(row.get("ctr", 0.0)), 4),
                "position": round(float(row.get("position", 0.0)), 1),
            })

        # クエリ3: 上位ページ
        r2 = session.post(url, json={**base, "dimensions": ["page"], "rowLimit": top}, timeout=30)
        _raise_for_gsc(r2)
        for row in (r2.json() or {}).get("rows", []):
            out["top_pages"].append({
                "page": (row.get("keys") or [""])[0],
                "clicks": int(row.get("clicks", 0)),
                "impressions": int(row.get("impressions", 0)),
                "ctr": round(float(row.get("ctr", 0.0)), 4),
                "position": round(float(row.get("position", 0.0)), 1),
            })

        out["verdict"] = _verdict(out["totals"])
    except _GscError as e:
        out["error"] = str(e)
    except Exception as e:
        err_str, err_type = str(e), type(e).__name__
        if "invalid_grant" in err_str or "RefreshError" in err_type:
            out["error"] = f"GSC_API:TOKEN_INVALID:{err_str[:120]}"
        else:
            out["error"] = f"GSC_API:RUNTIME:{err_type}:{err_str[:200]}"
    return out


class _GscError(Exception):
    pass


def _raise_for_gsc(resp):
    if resp.status_code == 200:
        return
    body = ""
    try:
        body = json.dumps(resp.json().get("error", {}), ensure_ascii=False)[:200]
    except Exception:
        body = (resp.text or "")[:200]
    if resp.status_code == 403:
        # SA がそのプロパティの所有者でない（= 俊雄さんの「所有者追加」がまだ）
        raise _GscError(f"GSC_API:PERMISSION_DENIED:{body}")
    if resp.status_code == 404:
        # site 文字列がプロパティと一致しない（sc-domain: か URLプレフィックスか）
        raise _GscError(f"GSC_API:SITE_NOT_FOUND:{body}")
    raise _GscError(f"GSC_API:HTTP_{resp.status_code}:{body}")


def _quote(site):
    from urllib.parse import quote
    return quote(site, safe="")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", default=os.environ.get("GSC_SITE", "sc-domain:sabusuku-yameta.com"),
                    help="GSC property. domain property は 'sc-domain:example.com'、URLプレフィックスは 'https://example.com/'。")
    ap.add_argument("--days", type=int, default=int(os.environ.get("GSC_DAYS", "28")))
    ap.add_argument("--top", type=int, default=10)
    args = ap.parse_args()
    result = fetch_gsc(args.site, days=args.days, top=args.top)
    _emit(result)
    return 0 if result.get("error") is None else 1


if __name__ == "__main__":
    sys.exit(main())
