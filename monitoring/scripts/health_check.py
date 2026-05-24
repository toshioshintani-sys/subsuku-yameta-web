# -*- coding: utf-8 -*-
"""
モニタリングシステムの健全性チェック＋自動修復。

毎朝の日次モニタリング実行前に呼び出して、検出可能な問題を自動修復し、
人の操作が必要な問題のみアラートを返す。

出力は JSON：
{
  "overall": "OK" | "DEGRADED" | "CRITICAL",
  "ga4":   {"status": "OK"|"TOKEN_EXPIRED"|"NO_CONFIG"|"ERROR", "action": "...", "detail": "..."},
  "x":     {"status": ...},
  "note":  {"status": ...},
  "auto_repaired": ["項目1", "項目2"],   # 自動修復に成功したもの
  "needs_human_action": ["項目1"],      # 人手介入が必要なもの
}

ステータス凡例：
  OK            : 正常
  TOKEN_EXPIRED : OAuth トークン失効（→ reauth_ga4.py を手動実行）
  NO_CONFIG     : 設定ファイル不在（→ 自動修復試行 or アラート）
  ERROR         : その他のエラー
"""
from __future__ import annotations
import json, os, subprocess, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

SCRIPT_DIR = Path(__file__).resolve().parent
MONITORING_ROOT = SCRIPT_DIR.parent
CONFIG_DIR = MONITORING_ROOT / "config"
LOGS_DIR = MONITORING_ROOT / "logs"
ADC_PATH = CONFIG_DIR / "adc.json"
ALERT_LOG = LOGS_DIR / "alerts.log"

JST = timezone(timedelta(hours=9))


def _now():
    return datetime.now(JST).strftime("%Y-%m-%d %H:%M:%S")


def _log_alert(level, channel, msg):
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    with open(ALERT_LOG, "a", encoding="utf-8") as f:
        f.write(f"[{_now()}] [{level}] [{channel}] {msg}\n")


def _ensure_libraries():
    """必要なPythonライブラリを自動インストール（軽い自動修復）"""
    repaired = []
    required = {
        "google.analytics.data_v1beta": "google-analytics-data",
        "google_auth_oauthlib": "google-auth-oauthlib",
    }
    for module, package in required.items():
        try:
            __import__(module)
        except ImportError:
            try:
                subprocess.check_call(
                    [sys.executable, "-m", "pip", "install", package,
                     "--break-system-packages", "-q"],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                repaired.append(f"pip install {package}")
            except Exception as e:
                _log_alert("ERROR", "SYSTEM", f"pip install {package} failed: {e}")
    return repaired


def _ensure_directories():
    """必須ディレクトリを自動作成（軽い自動修復）"""
    repaired = []
    for d in [LOGS_DIR, CONFIG_DIR]:
        if not d.exists():
            d.mkdir(parents=True, exist_ok=True)
            repaired.append(f"mkdir {d}")
    return repaired


def check_ga4():
    """GA4 API を実際に叩いて認証・接続を確認。"""
    if not ADC_PATH.exists():
        return {
            "status": "NO_CONFIG",
            "action": "monitoring/config/adc.json が存在しません。reauth_ga4.py を実行してください。",
            "detail": f"missing: {ADC_PATH}",
        }
    # 実際に1リクエスト投げて確認
    result = subprocess.run(
        [sys.executable, "-X", "utf8", str(SCRIPT_DIR / "collect_ga4.py")],
        capture_output=True, text=True, timeout=60,
    )
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"status": "ERROR", "action": "stdout parse error",
                "detail": (result.stdout or "") + "|stderr:" + (result.stderr or "")}
    err = data.get("error")
    if err is None:
        return {"status": "OK", "action": None, "detail": "API call succeeded"}
    # トークン失効パターンを検出
    err_lower = err.lower()
    if any(kw in err_lower for kw in ["invalid_grant", "expired", "revoked", "unauthorized", "401"]):
        return {
            "status": "TOKEN_EXPIRED",
            "action": "ターミナルで実行: python -X utf8 monitoring/scripts/reauth_ga4.py",
            "detail": err,
        }
    return {"status": "ERROR", "action": "上記エラーを確認", "detail": err}


def check_x():
    """X(Twitter) は Chrome MCP 経由なので静的チェックのみ。
    実際のログイン状態は本実行時に判定する。
    """
    # 最後の execution.log を見て直近の X 失敗パターンを検出
    exec_log = LOGS_DIR / "execution.log"
    if not exec_log.exists():
        return {"status": "OK", "action": None, "detail": "初回実行（履歴なし）"}
    try:
        tail = exec_log.read_text(encoding="utf-8").strip().splitlines()[-5:]
    except Exception:
        return {"status": "OK", "action": None, "detail": "log read skipped"}
    failed = sum(1 for ln in tail if "X:LOGIN_REQUIRED" in ln or "X:LOGGED_OUT" in ln)
    if failed >= 2:
        return {
            "status": "ERROR",
            "action": "Chrome で https://x.com に手動ログインしてください",
            "detail": f"直近{len(tail)}回中{failed}回 X ログアウト",
        }
    return {"status": "OK", "action": None, "detail": "ok or no recent failures"}


def check_note():
    """note も Chrome MCP 経由。同様に静的チェック。"""
    exec_log = LOGS_DIR / "execution.log"
    if not exec_log.exists():
        return {"status": "OK", "action": None, "detail": "初回実行（履歴なし）"}
    try:
        tail = exec_log.read_text(encoding="utf-8").strip().splitlines()[-5:]
    except Exception:
        return {"status": "OK", "action": None, "detail": "log read skipped"}
    failed = sum(1 for ln in tail if "NOTE:LOGIN_REQUIRED" in ln or "NOTE:LOGGED_OUT" in ln)
    if failed >= 2:
        return {
            "status": "ERROR",
            "action": "Chrome で https://note.com に手動ログインしてください",
            "detail": f"直近{len(tail)}回中{failed}回 note ログアウト",
        }
    return {"status": "OK", "action": None, "detail": "ok or no recent failures"}


def main():
    auto_repaired = []
    auto_repaired.extend(_ensure_directories())
    auto_repaired.extend(_ensure_libraries())

    ga4 = check_ga4()
    x = check_x()
    note = check_note()

    needs_human = []
    for name, ch in [("GA4", ga4), ("X", x), ("note", note)]:
        if ch["status"] in ("TOKEN_EXPIRED", "ERROR", "NO_CONFIG"):
            needs_human.append({"channel": name, "status": ch["status"],
                                "action": ch["action"], "detail": ch["detail"]})
            _log_alert("ALERT", name, f'{ch["status"]}: {ch["detail"]}')

    if not needs_human:
        overall = "OK"
    elif ga4["status"] == "OK" or x["status"] == "OK" or note["status"] == "OK":
        overall = "DEGRADED"
    else:
        overall = "CRITICAL"

    out = {
        "overall": overall,
        "checked_at": _now(),
        "ga4": ga4,
        "x": x,
        "note": note,
        "auto_repaired": auto_repaired,
        "needs_human_action": needs_human,
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0 if overall == "OK" else (1 if overall == "DEGRADED" else 2)


if __name__ == "__main__":
    sys.exit(main())
