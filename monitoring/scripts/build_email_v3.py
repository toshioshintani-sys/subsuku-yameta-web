# -*- coding: utf-8 -*-
"""
日次メール本文生成 v3（複数サイト対応）

- ライフオラクル + サブスクやめた を1通のメールに統合
- 既存 build_email.py（v1）/ build_email_v2.py は壊さない
- 入力：collect_all_sites.py の標準出力 JSON
- 出力：subject / markdown / html を含む JSON
"""
from __future__ import annotations
import argparse
import csv
import json
import sys
from datetime import datetime
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
_LOGS_DIR = _SCRIPT_DIR.parent / "logs"


def _fmt_int(v):
    if v is None or v == "":
        return "—"
    try:
        return f"{int(float(v)):,}"
    except (TypeError, ValueError):
        return str(v)


def _fmt_sec(v):
    if v is None or v == "":
        return "—"
    try:
        s = float(v)
        if s < 60:
            return f"{s:.0f}秒"
        m = s / 60
        if m < 60:
            return f"{m:.1f}分"
        h = m / 60
        return f"{h:.1f}時間"
    except (TypeError, ValueError):
        return "—"


def _delta(curr, prev):
    """前日比のテキスト（±N / ±x.x%）を返す。"""
    if curr is None or prev is None:
        return ""
    try:
        c = float(curr)
        p = float(prev)
        if p == 0:
            return f"（前日比 {c:+.0f}）"
        diff = c - p
        pct = (diff / p) * 100
        arrow = "↑" if diff > 0 else ("↓" if diff < 0 else "→")
        return f"（前日比 {diff:+.0f} / {arrow}{abs(pct):.1f}%）"
    except (TypeError, ValueError):
        return ""


def load_prev_metrics(site_id, target_date):
    """サイト別 CSV から前日データを読む。"""
    csv_path = _LOGS_DIR / f"daily_metrics_{site_id}.csv"
    if not csv_path.exists():
        return None
    rows = list(csv.DictReader(csv_path.open(encoding="utf-8")))
    if len(rows) < 2:
        return None
    # 当日の1つ前
    for i, r in enumerate(rows):
        if r.get("date") == target_date and i > 0:
            return rows[i - 1]
    # 当日がまだ無い場合は最終行
    return rows[-1] if rows else None


def render_site_section(site_data):
    """1サイト分の Markdown セクションを返す。"""
    if not site_data:
        return ""

    name = site_data.get("site_name", site_data.get("site_id", "(不明)"))
    url = site_data.get("site_url", "")
    err = site_data.get("error")

    if err:
        return f"## {name}\n- ⚠️ 取得失敗：{err}\n\n"

    active = site_data.get("active_users_1d")
    sessions = site_data.get("sessions_1d")
    engagement = site_data.get("avg_engagement_sec")
    sources = site_data.get("top_sources", []) or []

    prev = load_prev_metrics(site_data["site_id"], site_data.get("date", ""))
    prev_active = prev.get("active_users_1d") if prev else None
    prev_sessions = prev.get("sessions_1d") if prev else None

    md = [f"## {name}（{url}）"]
    md.append(f"- アクティブユーザー：**{_fmt_int(active)}人** {_delta(active, prev_active)}")
    md.append(f"- セッション：**{_fmt_int(sessions)}** {_delta(sessions, prev_sessions)}")
    md.append(f"- 平均エンゲージメント時間：**{_fmt_sec(engagement)}**")

    if sources:
        md.append("- 流入元：")
        for src in sources[:5]:
            s = src.get("source", "(不明)")
            cnt = src.get("sessions", "—")
            md.append(f"  - {s}：{_fmt_int(cnt)} セッション")
    md.append("")
    return "\n".join(md)


def build_markdown(payload):
    date = payload.get("date", "")
    sites = payload.get("sites", []) or []

    # ハイライト：全サイト合計
    total_users = 0
    total_sessions = 0
    site_count = 0
    for s in sites:
        if not s.get("error"):
            total_users += int(float(s.get("active_users_1d") or 0))
            total_sessions += int(float(s.get("sessions_1d") or 0))
            site_count += 1

    md = [f"# {date} の日次レポート（{site_count}サイト）", ""]
    md.append("## ハイライト")
    md.append(f"- 合計アクティブユーザー：**{total_users}人**")
    md.append(f"- 合計セッション：**{total_sessions}**")
    md.append("")

    # 各サイトのセクション
    for site in sites:
        md.append(render_site_section(site))

    md.append("## ワンクリック")
    md.append("- [GA4ダッシュボード](https://analytics.google.com/)")
    md.append("- [Netlify サブスクやめた](https://app.netlify.com/projects/sabusuku)")
    md.append("- [X Analytics](https://x.com/i/account_analytics)")
    md.append("")

    return "\n".join(md)


_LINK_RE = __import__("re").compile(r"\[([^\]]+)\]\(([^)]+)\)")


def _inline(txt):
    """Markdown inline → HTML：**bold** と [text](url) を変換。"""
    while "**" in txt:
        txt = txt.replace("**", "<strong>", 1).replace("**", "</strong>", 1)
    txt = _LINK_RE.sub(
        r'<a href="\2" style="color:#0a7c7c;text-decoration:underline;">\1</a>',
        txt,
    )
    return txt


def md_to_html(md):
    lines = md.split("\n")
    h = [
        '<html><body style="font-family:-apple-system,Segoe UI,Meiryo,sans-serif;'
        'line-height:1.6;color:#1a1f2e;max-width:680px;margin:0 auto;padding:16px;">'
    ]
    list_depth = 0  # 0=閉, 1=トップ, 2=ネスト

    def open_to(target):
        nonlocal list_depth
        while list_depth < target:
            h.append("<ul>")
            list_depth += 1
        while list_depth > target:
            h.append("</ul>")
            list_depth -= 1

    def close_all():
        open_to(0)

    for ln in lines:
        if ln.startswith("# "):
            close_all()
            h.append(f'<h1 style="color:#0a7c7c;border-bottom:2px solid #0a7c7c;padding-bottom:6px;">{_inline(ln[2:])}</h1>')
        elif ln.startswith("## "):
            close_all()
            h.append(f'<h2 style="color:#1a1f2e;margin-top:24px;">{_inline(ln[3:])}</h2>')
        elif ln.startswith("### "):
            close_all()
            h.append(f"<h3>{_inline(ln[4:])}</h3>")
        elif ln.startswith("  - "):
            open_to(2)
            h.append(f"<li>{_inline(ln[4:])}</li>")
        elif ln.startswith("- "):
            open_to(1)
            h.append(f"<li>{_inline(ln[2:])}</li>")
        elif ln.startswith("---"):
            close_all()
            h.append("<hr>")
        elif ln.strip() == "":
            close_all()
        else:
            close_all()
            h.append(f"<p>{_inline(ln)}</p>")
    close_all()
    h.append("</body></html>")
    return "\n".join(h)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", help="collect_all_sites.py の出力 JSON ファイル (省略時は stdin)")
    ap.add_argument("--out", help="出力 JSON ファイル (省略時は stdout)")
    args = ap.parse_args()

    if args.input:
        payload = json.loads(Path(args.input).read_text(encoding="utf-8"))
    else:
        payload = json.loads(sys.stdin.read())

    date = payload.get("date", datetime.now().strftime("%Y-%m-%d"))
    sites_count = len(payload.get("sites", []))

    md = build_markdown(payload)
    html = md_to_html(md)
    subject = f"【日次レポート】{date} のユーザー動向（{sites_count}サイト）"

    out = {"subject": subject, "markdown": md, "html": html}

    if args.out:
        Path(args.out).write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"[build_email_v3] wrote: {args.out}", file=sys.stderr)
    else:
        print(json.dumps(out, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    sys.exit(main())
