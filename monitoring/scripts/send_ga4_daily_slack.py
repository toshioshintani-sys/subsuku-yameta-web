#!/usr/bin/env python3
"""
サブスクやめた GA4 の毎朝の数値を Slack（#6-subsuku-daily）へ送る — GitHub Actions 用（2026-10-17）

PC の WorldOracle_subsuku_yameta_daily_report（world-oracle-staging/notifications/subsuku_yameta/daily/send_subsuku_daily.py）
を、PC が止まっていても動くように GitHub Actions へ移したもの。中身（数字・形）は同じ。

- GA4 の取得は同じ monitoring/scripts/collect_ga4.py の fetch_ga4 を使う（プロパティ 538470329）。
- 鍵は環境変数で受け取る：
    GA4_CREDENTIALS_JSON          … authorized_user（monitoring/config/adc.json と同じ形）か service_account の JSON
    SLACK_WEBHOOK_SUBSUKU_DAILY   … #6-subsuku-daily の Incoming Webhook
- 🛑 このリポジトリは公開で、Actions のログは誰でも読める。GA4 の数字・流入元はログに出さない（Slack にだけ送る）。

手動:
  python monitoring/scripts/send_ga4_daily_slack.py --dry-run   # Slack に送らず、送る中身だけを表示（手元でだけ使う）
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

JST = timezone(timedelta(hours=9))
PROPERTY_ID = "538470329"  # サブスクやめた（G-S0H16V3WE2）。534433669 はライフオラクルなので使わない
HERE = Path(__file__).resolve().parent
ADC_PATH = HERE.parent / "config" / "adc.json"


def install_credentials() -> str | None:
    """GA4_CREDENTIALS_JSON をファイルに置き、collect_ga4 が読める状態にする。問題があればエラー文字列を返す。"""
    raw = os.environ.get("GA4_CREDENTIALS_JSON", "").strip()
    if not raw:
        return "GA4_CREDENTIALS_JSON が設定されていない"
    try:
        info = json.loads(raw)
    except json.JSONDecodeError:
        return "GA4_CREDENTIALS_JSON が JSON として読めない"
    kind = info.get("type")
    if kind == "authorized_user":
        ADC_PATH.parent.mkdir(parents=True, exist_ok=True)
        ADC_PATH.write_text(raw, encoding="utf-8")
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(ADC_PATH)
        return None
    if kind == "service_account":
        fd, path = tempfile.mkstemp(suffix=".json")
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(raw)
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path
        return None
    return f"GA4_CREDENTIALS_JSON の type が想定外（{kind}）"


def build_payload(site: dict, target_date: str) -> dict:
    now = datetime.now(JST).strftime("%Y-%m-%d %H:%M JST")
    if site.get("error"):
        text = f"⚠️ サブスクやめた日次 取得失敗 ({target_date})"
        return {
            "text": text,
            "blocks": [
                {"type": "header", "text": {"type": "plain_text", "text": f"⚠️ サブスクやめた日次 ({target_date})"}},
                {"type": "section", "text": {"type": "mrkdwn", "text": (
                    f"*データ取得エラー*\n```{site['error']}```\n\n"
                    "鍵の失効なら、PC で `monitoring/scripts/reauth_ga4.py` を実行して鍵を作り直し、"
                    "クラウドの環境変数 `GA4_CREDENTIALS_JSON` を入れ直す（docs/GA4_DAILY_ACTIONS.md）")}},
                {"type": "context", "elements": [{"type": "mrkdwn", "text": f"取得試行 {now}"}]},
            ],
        }
    users = site.get("active_users_1d", "?")
    sessions = site.get("sessions_1d", "?")
    engage = site.get("avg_engagement_sec")
    engage_str = f"{engage:.0f}秒" if isinstance(engage, (int, float)) else "?"
    sources = site.get("top_sources") or []
    source_lines = "\n".join(f"• {s.get('source', '?')}: {s.get('sessions', 0)}" for s in sources[:5]) or "_流入元データなし_"
    text = f"🟦 サブスクやめた日次 {target_date}: {users}人 / {sessions}セッション"
    return {
        "text": text,
        "blocks": [
            {"type": "header", "text": {"type": "plain_text", "text": f"🟦 サブスクやめた日次 - {target_date}"}},
            {"type": "section", "text": {"type": "mrkdwn", "text": (
                f"*📊 GA4 数値(前日)*\n• アクティブユーザー: {users}\n• セッション: {sessions}\n• 平均エンゲージ: {engage_str}")}},
            {"type": "divider"},
            {"type": "section", "text": {"type": "mrkdwn", "text": f"*🔗 流入元 TOP5*\n{source_lines}"}},
            {"type": "context", "elements": [{"type": "mrkdwn", "text": f"sabusuku-yameta.com · GA4 {PROPERTY_ID} · {now}"}]},
        ],
    }


def post_slack(payload: dict) -> bool:
    url = os.environ.get("SLACK_WEBHOOK_SUBSUKU_DAILY", "").strip()
    if not url:
        print("SLACK_WEBHOOK_SUBSUKU_DAILY が設定されていない", file=sys.stderr)
        return False
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=20) as res:
                if res.status == 200:
                    return True
        except Exception as e:  # noqa: BLE001
            print(f"Slack 送信失敗（{attempt + 1}回目）: {type(e).__name__}", file=sys.stderr)
    return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", help="YYYY-MM-DD（日本時間）。省略時は前日")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--text", action="store_true",
                    help="Slack に送らず、送る文面（プレーンテキスト）だけを出す。クラウドの当番が Slack の道具で送るとき用（ログは非公開の場所でだけ使う）")
    args = ap.parse_args()
    target_date = args.date or (datetime.now(JST) - timedelta(days=1)).strftime("%Y-%m-%d")

    err = install_credentials() if os.environ.get("GA4_CREDENTIALS_JSON") else None
    sys.path.insert(0, str(HERE))
    from collect_ga4 import fetch_ga4  # noqa: E402

    site = {"error": err} if err else fetch_ga4(PROPERTY_ID, target_date=target_date)
    payload = build_payload(site, target_date)

    if args.dry_run:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0

    if args.text:
        # blocks の中身をそのまま平文に並べる（header → 本文 → 補足）
        lines = []
        for b in payload["blocks"]:
            if b["type"] == "header":
                lines.append(f"*{b['text']['text']}*")
            elif b["type"] == "section":
                lines.append(b["text"]["text"])
            elif b["type"] == "context":
                lines.append("_" + " ".join(e["text"] for e in b["elements"]) + "_")
        print("\n\n".join(lines))
        return 1 if site.get("error") else 0

    ok = post_slack(payload)
    # 公開ログには数字を出さない。成否と、失敗の種類だけ
    if site.get("error"):
        print(f"GA4 取得失敗（種類: {str(site['error']).split(':')[0:2]}）。Slack 送信={'OK' if ok else 'NG'}")
        return 1
    print(f"{target_date} の数値を Slack に送信={'OK' if ok else 'NG'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
