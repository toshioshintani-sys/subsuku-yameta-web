# -*- coding: utf-8 -*-
# build_email_v2.py -- daily email generator with diagnostic funnel
from __future__ import annotations
import argparse, csv, json, sys, re
from pathlib import Path


def parse_pipeline_log(log_dir: str) -> str:
    import glob as _glob
    from datetime import datetime, timezone, timedelta
    JST = timezone(timedelta(hours=9))
    now = datetime.now(JST)
    today = now.strftime("%Y%m%d")
    yesterday = (now - timedelta(days=1)).strftime("%Y%m%d")
    log_path_dir = Path(log_dir)
    # 前日（12:30/18:30）＋当日（04:30）の両方を対象にする
    patterns = [
        str(log_path_dir / f"batch_{yesterday}*.json"),
        str(log_path_dir / f"batch_{today}*.json"),
    ]
    json_files = []
    for pat in patterns:
        json_files.extend(_glob.glob(pat))
    if not json_files:
        return "(自動投稿ログが見つかりません — パイプライン未実行または手動投稿)"
    # 全バッチファイルを時刻順に処理して結果を集約
    all_results = []
    for json_file in sorted(json_files):
        try:
            data = json.loads(Path(json_file).read_text(encoding="utf-8"))
            if isinstance(data, list):
                all_results.extend(data)
        except Exception:
            pass
    if not all_results:
        return "(バッチJSONなし — ログファイルは存在するが詳細データなし)"
    lines = []
    errors = []
    for r in all_results:
        status = "✅予約済" if r.get("success") else "❌失敗"
        title = (r.get("title") or r.get("filename", "不明"))[:30]
        series = r.get("series_prefix", "?")
        pub_at = r.get("publish_at", "")[:16] if r.get("publish_at") else "-"
        retry_note = "（リトライ成功）" if r.get("retry_result") == "success" else ""
        lines.append(f"| {pub_at} | {series} | {title} | {status}{retry_note} |")
        if not r.get("success"):
            step = f"[{r.get('failed_step')}] " if r.get("failed_step") else ""
            err = r.get("error", "不明なエラー")
            retry_line = ""
            if r.get("retry_result") == "failed":
                retry_line = f" → リトライも失敗（{r.get('retry_error', '')}）"
            elif r.get("retry_result") == "success":
                retry_line = " → リトライで成功"
            errors.append(f"- [{r.get('filename', r.get('title', '?'))}] {step}{err}{retry_line}")
    table_header = "| 公開予定 | シリーズ | タイトル | 状態 |\n|---|---|---|---|"
    table = table_header + "\n" + "\n".join(lines) if lines else "(投稿記録なし)"
    error_block = ""
    if errors:
        error_block = "\n\n### ❌ エラー詳細\n" + "\n".join(errors)
        error_block += "\n→ 手動確認または再実行が必要な場合があります"
    return table + error_block

def parse_todo(todo_path):
    p = Path(todo_path)
    if not p.exists(): return "(todo.md not found)"
    try:
        text = p.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return "(教訓ログの読み込みエラー)"
    high_section = re.search(r"## 優先度：高.*?(?=## 優先度|完了済み|$)", text, re.DOTALL)
    if not high_section: return "(優先度：高 section not found)"
    pending = [l.strip() for l in high_section.group(0).splitlines() if l.strip().startswith("- [ ]")]
    if not pending: return "優先度高のタスクはすべて完了しています ✅"
    return "\n".join(f"  {t}" for t in pending)

def parse_lessons(lessons_path, max_items=2):
    p = Path(lessons_path)
    if not p.exists(): return "(教訓ログが見つかりません)"
    try:
        text = p.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return "(教訓ログの読み込みエラー)"
    pat = r"(## \d{4}-\d{2}-\d{2}.*?)(?=## \d{4}-\d{2}-\d{2}|## テンプレ|$)"
    sections = re.findall(pat, text, re.DOTALL)
    if not sections: return "(教訓ログが見つかりません)"
    results = []
    for sec in sections[:max_items]:
        title_line = sec.splitlines()[0].replace("## ", "").strip()
        prevention = re.search(r"\*\*再発防止\*\*[：:] *(.+)", sec)
        if prevention:
            results.append(f"  ▸ {title_line}\n    → {prevention.group(1).strip()}")
        else:
            results.append(f"  ▸ {title_line}")
    return "\n".join(results)

def _fmt(v, suffix=""):
    if v in (None, "", "N/A"): return "N/A"
    return f"{v}{suffix}"

def _safe_float(v):
    try: return float(v)
    except (TypeError, ValueError): return None

def parse_breakdown(s):
    if not s or s == "N/A": return {}
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

def parse_series_summary(row) -> list[dict]:
    """
    note_series_summary 列（例: "yoru_:14.3%/1,post_:12.8%/10,story_:6.4%/1|paid:9.8%/2,free:12.8%/10"）
    をパースしてシリーズ別リストを返す。列が存在しない場合は空リスト。
    """
    raw = row.get("note_series_summary", "") or ""
    if not raw or raw == "N/A":
        return []
    results = []
    series_part = raw.split("|")[0]  # "|" 以前がシリーズ別
    LABELS = {
        "yoru_":   "夜のトリセツ",
        "wata_":   "私のトリセツ",
        "jin_":    "職場の隣人図鑑",
        "gachi_":  "ガチ人",
        "post_":   "汎用記事",
        "story_":  "連作小説",
    }
    SCHEDULES = {
        "yoru_":   "毎日 22:00",
        "wata_":   "完結",
        "jin_":    "火木・第2/4土 11:30",
        "gachi_":  "毎日 07:00",
        "post_":   "月水金 18:00",
        "story_":  "土 19:00",
    }
    for chunk in series_part.split(","):
        chunk = chunk.strip()
        if not chunk or ":" not in chunk:
            continue
        key, rest = chunk.split(":", 1)
        key = key.strip()
        parts = rest.strip().split("/")
        rate_str = parts[0].rstrip("%") if parts else ""
        count    = parts[1] if len(parts) > 1 else "?"
        try:
            rate = float(rate_str)
        except ValueError:
            continue
        kpi = "✅" if rate >= 15 else ("🟡" if rate >= 10 else "⚠️")
        results.append({
            "series":   key,
            "label":    LABELS.get(key, key),
            "schedule": SCHEDULES.get(key, "-"),
            "rate":     rate,
            "count":    count,
            "kpi":      kpi,
        })
    return results


def build_series_table_md(row) -> str:
    """シリーズ別スキ率テーブル（Markdown）"""
    series_list = parse_series_summary(row)
    if not series_list:
        return ""
    lines = ["| シリーズ | 投稿時刻 | 記事数 | スキ率 | 判定 |",
             "|---|---|---|---|---|"]
    for s in series_list:
        lines.append(f"| {s['label']} ({s['series']}) | {s['schedule']} | {s['count']}件 | {s['rate']:.1f}% | {s['kpi']} |")

    # 有料/無料サマリー
    raw = row.get("note_series_summary", "") or ""
    paid_free_part = raw.split("|")[1] if "|" in raw else ""
    if paid_free_part:
        lines.append("|---|---|---|---|---|")
        for chunk in paid_free_part.split(","):
            chunk = chunk.strip()
            if not chunk or ":" not in chunk:
                continue
            key, rest = chunk.split(":", 1)
            parts = rest.strip().split("/")
            rate_str = parts[0].rstrip("%") if parts else ""
            count    = parts[1] if len(parts) > 1 else "?"
            try:
                rate = float(rate_str)
            except ValueError:
                continue
            label = "有料記事計" if key.strip() == "paid" else "無料記事計"
            kpi = "✅" if rate >= 15 else ("🟡" if rate >= 10 else "⚠️")
            lines.append(f"| **{label}** | — | {count}件 | **{rate:.1f}%** | {kpi} |")
    lines.append(f"\n※ noteダッシュボード上位12件から算出（当週PV順）")
    return "\n".join(lines)


def build_story_section_md(story_json_path: str) -> str:
    """story_ シリーズ（連作小説「隣人｜Eight Biases」）の単独サマリを Markdown で返す。
    note 公開 API から取得した全件データを使う（dashboard 上位12件に依存しない）。
    """
    p = Path(story_json_path) if story_json_path else None
    if not p or not p.exists():
        return ""
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return ""
    arts = data.get("articles") or []
    if not arts:
        return ""

    def short_title(t: str) -> str:
        # "第1章　304号室　坂本 誠　｜このままでいい　Status Quo Bias" → "第1章 304号室 坂本誠"
        head = t.split("｜")[0].split("|")[0]
        head = re.sub(r"\s+", " ", head).strip()
        return head[:24]

    def short_date(iso: str) -> str:
        # "2026-05-04T19:00:00.000+09:00" → "5/4(月)"
        m = re.match(r"(\d{4})-(\d{2})-(\d{2})", iso or "")
        if not m: return "-"
        try:
            from datetime import datetime as _dt
            d = _dt(int(m.group(1)), int(m.group(2)), int(m.group(3)))
            wd = "月火水木金土日"[d.weekday()]
            return f"{d.month}/{d.day}({wd})"
        except Exception:
            return f"{m.group(2)}/{m.group(3)}"

    lines = ["| 章 | 公開日 | 価格 | スキ | コメ |",
             "|---|---|---|---|---|"]
    for a in arts:
        title = short_title(a.get("title", ""))
        date  = short_date(a.get("publish_at", ""))
        price = a.get("price", 0)
        price_str = "無料" if int(price) == 0 else f"{int(price)}円"
        likes = a.get("like_count", 0)
        comm  = a.get("comment_count", 0)
        lines.append(f"| {title} | {date} | {price_str} | {likes} | {comm} |")
    lines.append(f"| **合計** | — | — | **{data.get('total_likes', 0)}** | **{data.get('total_comments', 0)}** |")
    lines.append("")
    lines.append(f"※ {data.get('article_count', 0)}本 / note公開API 直接取得（PV非取得・要ダッシュボード）")
    return "\n".join(lines)


def _generate_insight(row, prev, like_rate):
    tips = []
    if like_rate is not None and like_rate < 0.10:
        tips.append("- スキ率が10%を下回りました。次の投稿は共感パートを厚めに。")
    elif like_rate is not None and like_rate < 0.15:
        tips.append("- スキ率が目標15%をわずかに下回り中。タイトルのキーワード左置きを再点検。")
    cr = _safe_float(row.get("ga4_completion_rate"))
    diag_start = _safe_float(row.get("ga4_diag_start"))
    if cr is not None and diag_start is not None and diag_start > 0:
        cr_pct = f"{cr*100:.0f}%"
        if cr < 0.30:
            tips.append(f"- 診断完了率が{cr_pct}と低い。フローに大きな脱落箇所がある可能性あり。")
        elif cr < 0.50:
            tips.append(f"- 診断完了率{cr_pct}。安定区域に入りつつあるが、UX改善でさらに上がる余地あり。")
    x_clicks = _safe_float(row.get("x_link_clicks_24h"))
    if x_clicks is not None and x_clicks == 0:
        tips.append("- X→noteクリックがゼロ。ティーザー型の投稿を試すタイミング。")
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

def build_markdown(row, prev_row, todo_text="", lessons_text="", pipeline_log_text="", story_json_path=""):
    date_str = row.get("date", "")
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
    cr = _safe_float(row.get("ga4_completion_rate"))
    diag_start    = row.get("ga4_diag_start", "N/A")
    diag_complete = row.get("ga4_diag_complete", "N/A")
    if cr is not None:
        cr_pct = f"{cr*100:.0f}%"
        cr_kpi = "良好" if cr >= 0.50 else ("要改善" if cr < 0.30 else "標準的")
        diag_line = f"{diag_start}件開始 / {diag_complete}件完了（完了率 {cr_pct} — {cr_kpi}）"
        cr_highlight = f"- 診断完了率：{cr_pct}（{diag_complete}件完了 / {diag_start}件開始）"
    else:
        diag_line = f"{diag_start}件開始 / {diag_complete}件完了（完了率 N/A）"
        cr_highlight = "- 診断完了率：N/A（イベントデータ未取得）"
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
    pages   = breakdown.get("pages",   {}) if isinstance(breakdown.get("pages"),   dict) else {}
    new_users  = breakdown.get("new_users",  "N/A")
    new_users  = new_users if new_users else "N/A"
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
    sep_line = "---" if errors else ""
    err_line = ("収集時エラー: " + errors) if errors else ""
    md = (
        f"# {date_str} のライフオラクル 日次レポート\n\n"
        f"## ハイライト\n"
        f"- 全体の勢い：{momentum}\n"
        f"- スキ率：{like_rate_pct}（目標15%以上 {kpi_status}）\n"
        f"{cr_highlight}\n"
        f"- X→note クリック：{x_clicks}件（送客KPI）\n\n"
        f"## アプリ（life-oracle.jp）\n"
        f"- アクティブユーザー：{active_line}\n"
        f"- 新規ユーザー：{new_users}\n"
        f"- 診断ファネル：{diag_line}\n"
        f"- 平均滞在：{_fmt(row.get('ga4_avg_engagement_sec'), '秒')}\n\n"
        f"### 流入元（セッション別）\n{sources_block}\n\n"
        f"### よく見られたページ\n{pages_block}\n\n"
        f"## X（@LifeOracle321）\n"
        f"- フォロワー：{x_followers}人（新規 +{x_new}）\n"
        f"- インプレッション：{x_impr}\n"
        f"- プロフィール訪問：{x_visits}\n"
        f"- リンククリック：{x_clicks}（note送客数）\n\n"
        f"## note（@lifeoraclejp）\n"
        f"- 全記事PV（週次）：{note_pv}\n"
        f"- スキ（週次）：{note_likes}（スキ率 {like_rate_pct}）\n"
        f"- フォロワー：{note_followers}\n"
        f"- 今週のベスト記事：「{top_title}」（PV {top_pv}）\n\n"
        f"### シリーズ別スキ率\n{build_series_table_md(row)}\n\n"
        f"{('### 連作小説「隣人｜Eight Biases」(story_) 単独サマリ' + chr(10) + build_story_section_md(story_json_path) + chr(10) + chr(10)) if story_json_path and build_story_section_md(story_json_path) else ''}"
        f"## 気づき\n{_generate_insight(row, prev_row, like_rate)}\n\n"
        f"## ワンクリック\n"
        f"- [GA4ダッシュボード](https://analytics.google.com/)\n"
        f"- [X Analytics](https://x.com/i/account_analytics)\n"
        f"- [noteダッシュボード](https://note.com/sitesettings/stats)\n\n"
        f"{sep_line}\n"
        f"{err_line}\n"
    )
    if pipeline_log_text:
        md += (
            "\n---\n\n"
            "## 📮 自動投稿ログ（前日分）\n\n"
            f"{pipeline_log_text}\n\n"
            "### ⚠️ 要確認事項\n"
            "- ❌エラーがあれば上記を確認してください。なければ特になし。\n"
        )
    if todo_text or lessons_text:
        project_header = "## 📋 プロジェクト状況（Claude.ai 貼り付け用）"
        md += (
            "\n---\n\n"
            f"{project_header}\n\n"
            f"### 今週の優先タスク\n{todo_text or 'N/A'}\n\n"
            f"### 最近の教訓（再発防止）\n{lessons_text or 'N/A'}\n\n"
            f"*↑このセクションをコピーしてClaude.aiに貼ると文脈を共有できます*\n"
        )
    return md

def md_to_html(md):
    lines_in = md.split("\n")
    h = ['<html><body style="font-family:-apple-system,Segoe UI,Meiryo,sans-serif;line-height:1.6;">']
    in_list = False
    in_table = False
    def close_list():
        nonlocal in_list
        if in_list:
            h.append("</ul>"); in_list = False
    def close_table():
        nonlocal in_table
        if in_table:
            h.append("</table>"); in_table = False
    for ln in lines_in:
        # Markdown table
        if ln.strip().startswith("|") and "|" in ln[1:]:
            close_list()
            if not in_table:
                h.append('<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;font-size:0.9em;">')
                in_table = True
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            # 区切り行はスキップ
            if all(re.match(r"^[-:]+$", c) for c in cells if c):
                continue
            last_rows = " ".join(h[-5:])
            tag = "th" if "<th>" not in last_rows else "td"
            def _inline(s):
                s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
                s = re.sub(r"\*(.+?)\*", r"<em>\1</em>", s)
                s = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", r'<a href="\2">\1</a>', s)
                return s
            h.append("<tr>" + "".join(f"<{tag}>{_inline(c)}</{tag}>" for c in cells) + "</tr>")
            continue
        else:
            close_table()

        if ln.startswith("# "): close_list(); h.append(f"<h1>{ln[2:]}</h1>")
        elif ln.startswith("## "): close_list(); h.append(f"<h2>{ln[3:]}</h2>")
        elif ln.startswith("### "): close_list(); h.append(f"<h3>{ln[4:]}</h3>")
        elif ln.startswith("- ") or ln.startswith("  - "):
            if not in_list:
                h.append("<ul>"); in_list = True
            content = ln.lstrip(" -")
            content = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", r'<a href="\2">\1</a>', content)
            h.append(f"<li>{content}</li>")
        elif ln.startswith("---"): close_list(); h.append("<hr>")
        elif ln.strip() == "": close_list(); close_table()
        else: close_list(); h.append(f"<p>{ln}</p>")
    close_list()
    close_table()
    h.append("</body></html>")
    return "\n".join(h)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", required=True)
    ap.add_argument("--csv", required=True)
    ap.add_argument("--todo", default="")
    ap.add_argument("--lessons", default="")
    ap.add_argument("--pipeline-log-dir", default="", help="pipeline/logs/ のパス（自動投稿ログ）")
    ap.add_argument("--story-json", default="", help="story_ 単独サマリ JSON のパス（collect_story_stats.py の出力）")
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
    todo_text      = parse_todo(args.todo) if args.todo else ""
    lessons_text   = parse_lessons(args.lessons) if args.lessons else ""
    pipeline_text  = parse_pipeline_log(args.pipeline_log_dir) if args.pipeline_log_dir else ""
    md   = build_markdown(row, prev, todo_text=todo_text, lessons_text=lessons_text, pipeline_log_text=pipeline_text, story_json_path=args.story_json)
    html = md_to_html(md)
    subject = f"[ライフオラクル日次]{args.date} のユーザー動向"
    print(json.dumps({"subject": subject, "markdown": md, "html": html}, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
