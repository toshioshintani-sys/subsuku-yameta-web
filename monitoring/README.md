# ライフオラクル 日次モニタリング

毎朝 6:30 JST に cowork が自動で GA4 / X / note の指標を収集し、俊雄さん宛にメール送信します。

## 構成

```
monitoring/
├── README.md                 この手順書
├── .gitignore                logs/ と認証情報を除外
├── logs/
│   ├── daily_metrics.csv    日次メトリクスCSV（資産）
│   └── execution.log        実行ログ
├── scripts/
│   ├── collect_ga4.py       GA4 Data API 呼出
│   ├── collect_x.md         Chrome経由 X取得 手順（cowork用）
│   ├── collect_note.md      Chrome経由 note取得 手順（cowork用）
│   └── build_email.py       CSV→メール本文生成
├── config/
│   └── thresholds.json      アラート閾値
└── docs/
    └── GA4_SETUP.md         GA4サービスアカウント作成手順
```

## 運用ルール

- **実行時刻**: 毎朝 6:30 JST（cron: `30 6 * * *`）
- **JST 0時前後は回避**（Claude利用制限）
- **Cookie/認証情報はファイルに書き出さない**（Chromeプロファイル内で保持）
- **KPI**: スキ率15%以上、X→noteクリックを送客指標として追跡

## トラブルシュート

- **noteログアウト**: メール「【要対応】noteに再ログインしてください」が届くので手動ログイン
- **GA4 API失敗**: `GA4_SETUP.md` に従ってサービスアカウント再発行
- **連続3日失敗**: 件名が「【要対応・緊急】」プレフィックスに変わる

## 参照

- 原本指示書: `C:\Users\user\Desktop\Claude_work\docs\INSTRUCTIONS_cowork_monitoring.md`
- プロジェクト憲法: `C:\Users\user\Desktop\Claude_work\CLAUDE.md`
