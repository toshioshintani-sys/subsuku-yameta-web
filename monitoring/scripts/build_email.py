# -*- coding: utf-8 -*-
"""日次メール本文生成 v2（流入元・ページ別内訳対応）"""
from __future__ import annotations
import argparse, csv, json, sys
from pathlib import Path


def _fmt(v, suffix=""):
    if v in (None, "", "N/A"):
        return "N/A"
    return f"{v}{suffix}"


def _safe_float(v):
    try: return float(v)
    except (TypeError, ValueError): return None


def parse_breakdown(s):
    if not s or s == "N/A":
        return {}
    out = {}
    for chunk in s.split(";"):
        if ":" in chunk:
            key, body = chunk.split(":", 1)
            entries = {}
            for kv in body.split(","):
                if "=" in kv:
                    k, v = kv.split("=", 1)
                    entries[k.strip()] = v.strip()
            out[key.strip()] = entries
        elif "=" in chunk:
            k, v = chunk.split("=", 1)
            out[k.strip()] = v.strip()
    return out


def _generate_insight(row, prev, like_rate):
    tips = []
    if like_rate is not None and like_rate < 0.10:
        tips.append("- スキ率が10%を下回りました。次の投稿は共感パートを厚めに。")
    elif like_rate is not None and like_rate < 0.15:
        tips.append("- スキ率が目標15%をわずかに下回り中。タイトルのキーワード左置きを再点検。")
    x_clicks = _safe_float(row.get("x_link_clicks_24h"))
    if x_clicks is not None and x_clicks == 0:
        tips.append("- 昨日のX→noteクリックがゼロ。ティーザー型の投稿を試すタイミング。")

    bd = parse_breakdown(row.get("ga4_breakdown", ""))
    sources = bd.get("sources", {}) if isinstance(bd.get("sources"), dict) else {}
    if sources:
        keys_lower = [s.lower() for s in sources.keys()]
        if "note" in keys_lower:
            tips.append("- note→アプリの送客が計上開始。CTA配置の効果が見え始めています。")
        if "x" in keys_lower:
            tips.append("- X→アプリの送客が計上開始。固定ツイートの効果検証推奨。")
        if all(s in ("unassigned", "(direct)", "direct") for s in keys_lower):
            tips.append("- 流入元がDirect/Unassignedのみ。UTM付きURLの設置範囲を広げると経路特定できます。")
    if not tips:
        tips.append("- 特筆すべき異常なし。継続ペースで進めて問題なし。")
    return "\n".join(tips)


def build_markdown(row, prev_row):
    date = row.get("date", "")
    like_rate = _safe_float(row.get("note_like_rate"))
    breakdown = parse_breakdown(row.get("ga4_breakdown", ""))

    like_rate_pct = f"{like_rate*100:.1f}%" if like_rate is not None else "N/A"
    kpi_status = "達成" if (like_rate or 0) >= 0.15 else "未達"

    active = _safe_float(row.get("ga4_active_users_1d"))
    active_prev = _safe_float((prev_row or {}).get("ga4_active_users_1d"))
    if active is not None and active_prev:
        diff = active - active_prev
        pct = (diff / active_prev) * 100 if active_prev else 0
        momentum = "↑維持" if diff > 0 else ("↓失速" if diff < 0 else "➡横ばい")
        active_line = f"{int(active)}人（前日比 {diff:+.0f} / {pct:+.1f}%）"
    elif active is not None:
        momentum = "初回計測"
        active_line = f"{int(active)}人"
    else:
        momentum = "計測エラー"
        active_line = "N/A"

    x_clicks = _fmt(row.get("x_link_clicks_24h"))
    x_followers = _fmt(row.get("x_followers"))
    x_new = _fmt(row.get("x_new_followers_24h"))
    x_impr = _fmt(row.get("x_impressions_24h"))
    x_visits = _fmt(row.get("x_profile_visits_24h"))
    note_pv = _fmt(row.get("note_pv_24h"))
    note_likes = _fmt(row.get("note_likes_24h"))
    note_followers = _fmt(row.get("note_followers"))
    top_title = row.get("top_note_article_title") or "N/A"
    top_pv = _fmt(row.get("top_note_article_pv"))
    errors = row.get("errors", "") or ""

    sources = breakdown.get("sources", {}) if isinstance(breakdown.get("sources"), dict) else {}
    pages = breakdown.get("pages", {}) if isinstance(breakdown.get("pages"), dict) else {}
    new_users = breakdown.get("new_users", "N/A")
    events = breakdown.get("events", "N/A")
    key_events = breakdown.get("key_events", "N/A")

    sources_lines = []
    if sources:
        for src, cnt in sorted(sources.items(), key=lambda kv: -int(kv[1]) if str(kv[1]).isdigit() else 0):
            sources_lines.append(f"  - {src}：{cnt}")
    sources_block = "\n".join(sources_lines) if sources_lines else "  - データなし"

    pages_lines = []
    if pages:
        for title, views in sorted(pages.items(), key=lambda kv: -int(kv[1]) if str(kv[1]).isdigit() else 0):
            pages_lines.append(f"  - 「{title}」：{views} 表示")
    pages_block = "\n".join(pages_lines) if pages_lines else "  - データなし"

    md = (
        f"# {date} のライフオラクル 日次レポート\n\n"
        f"## ハイライト\n"
        f"- 全体の勢い：{momentum}\n"
        f"- スキ率：{like_rate_pct}（目標15%以上 {kpi_status}）\n"
        f"- X→note クリック：{x_clicks}件（送客KPI）\n\n"
        f"## アプリ（life-oracle.jp）\n"
        f"- アクティブユーザー（過去7日）：{active_line}\n"
        f"- 新規ユーザー（7日）：{new_users}\n"
        f"- イベント数（7日）：{events} / キーイベント：{key_events}\n"
        f"- 平均滞在：{_fmt(row.get('ga4_avg_engagement_sec'), '秒')}\n\n"
        f"### 流入元（セッション別）\n{sources_block}\n\n"
        f"### よく見られたページ\n{pages_block}\n\n"
        f"## X（@LifeOracle321）\n"
        f"- フォロワー：{x_followers}人（新規 +{x_new}）\n"
        f"- インプレッション：{x_impr}\n"
        f"- プロフィール訪問：{x_visits}\n"
        f"- リンククリック：{x_clicks}（note送客数）\n\n"
        f"## note（@lifeoraclejp）\n"
        f"- 全記事PV：{note_pv}\n"
        f"- スキ：{note_likes}（スキ率 {like_rate_pct}）\n"
        f"- フォロワー：{note_followers}\n"
        f"- 本日のベスト記事：「{top_title}」（PV {top_pv}）\n\n"
        f"## 気づき\n{_generate_insight(row, prev_row, like_rate)}\n\n"
        f"## ワンクリック\n"
        f"- [GA4ダッシュボード](https://analytics.google.com/)\n"
        f"- [X Analytics](https://x.com/i/account_analytics)\n"
        f"- [noteダッシュボード](https://note.com/sitesettings/stats)\n\n"
        f"{'---' if errors else ''}\n"
        f"{('収集時エラー: ' + errors) if errors else ''}\n"
    )
    return md


def md_to_html(md):
    lines = md.split("\n")
    h = ['<html><body style="font-family:-apple-system,Segoe UI,Meiryo,sans-serif;line-height:1.6;">']
    in_list = False
    def close_list():
        nonlocal in_list
        if in_list:
            h.append("</ul>")
            in_list = False
    for ln in lines:
        if ln.startswith("# "): close_list(); h.append(f"<h1>{ln[2:]}</h1>")
        elif ln.startswith("## "): close_list(); h.append(f"<h2>{ln[3:]}</h2>")
        elif ln.startswith("### "): close_list(); h.append(f"<h3>{ln[4:]}</h3>")
        elif ln.startswith("- ") or ln.startswith("  - "):
            if not in_list:
                h.append("<ul>"); in_list = True
            h.append(f"<li>{ln.lstrip(' -')}</li>")
        elif ln.startswith("---"): close_list(); h.append("<hr>")
        elif ln.strip() == "": close_list()
        else: close_list(); h.append(f"<p>{ln}</p>")
    close_list()
    h.append("</body></html>")
    return "\n".join(h)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", required=True)
    ap.add_argument("--csv", required=True)
    args = ap.parse_args()
    csv_path = Path(args.csv)
    if not csv_path.exists():
        print(json.dumps({"error": f"CSV not found: {csv_path}"})); return 1
    rows = list(csv.DictReader(csv_path.open(encoding="utf-8")))
    row = next((r for r in rows if r.get("date") == args.date), None)
    if row is None:
        print(json.dumps({"error": f"date {args.date} not in CSV"})); return 1
    idx = rows.index(row)
    prev = rows[idx - 1] if idx > 0 else None
    md = build_markdown(row, prev)
    html = md_to_html(md)
    payload = {"subject": f"【ライフオラクル日次】{args.date} のユーザー動向",
               "markdown": md, "html": html}
    print(json.dumps(payload, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
