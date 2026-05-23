# サブスクやめた プロジェクト憲法

> このファイルは Claude が「サブスクやめた」プロジェクトで作業を始めるときに必ず最初に読む。
> ライフオラクルの `Claude_work/CLAUDE.md` とは別物。サブスクやめた固有の運用が書かれている。

---

## 0. セッション開始プロトコル

新しいチャット・セッションを「サブスクやめた」関連の作業で始めるとき、**最初に以下を読む**：

1. **`docs/lessons.md`** — 過去の発見・失敗・判断軸。重要度 ★ 順にスキャン
2. **`docs/AFFILIATE_DESIGN_PRINCIPLES.md`** — アフィリエイト設計の実装憲法（BAE）
3. **`docs/STRATEGY.md`** — 当初の戦略文書（背景把握）

「サブスクやめた」関連かどうかの判定基準：
- ユーザーの依頼に「サブスクやめた」「sabusuku」「subsuku」「解約」のいずれかが含まれる
- またはファイル操作の対象が `subsuku-yameta-web/` 配下である

ライフオラクル関連の場合は `C:\Users\user\Desktop\Claude_work\CLAUDE.md` を読む（こちらは読まない）。

---

## 1. プロジェクト概要

**サイト名：** サブスクやめた
**URL：** https://sabusuku.netlify.app
**コア概念：** サブスクの解約導線を集約したインデックスサイト
**派生機能：**
- `/discover` サブスク図鑑（A8 / もしも 経由のアフィリエイト含む）
- `/tracker` サブスク棚卸しダッシュボード
- `/blog` 「卒業→入学」記事シリーズ

**収益モデル：**
- Google AdSense（控えめ配置）
- アフィリエイト：A8.net / もしもアフィリエイト / Amazon アソシエイト / 楽天アフィリエイト
- 実装フレームワーク：BAE（Behavioral Affiliate Engine、`docs/AFFILIATE_DESIGN_PRINCIPLES.md` 参照）

---

## 2. ブランドの核心（変えてはいけないもの）

1. **「やめさせてくれるサイト」としての信頼が最優先**
2. アフィリエイトはその信頼の上に立つ二次収益（順序を絶対に逆転させない）
3. 「煽り」「ランキング」「★スコア」を一切使わない（競合との差別化軸）
4. 解約導線のビジュアルがアフィリエイトより常に強い
5. ライフオラクルとは別ブランド。思想層を持ち込みすぎない（実利特化）

---

## 3. アフィリエイト ASP 構成（2026-05-23 時点）

| ASP | 状態 | 用途 |
|---|---|---|
| A8.net | 42案件提携済（うち8案件はサブスクやめた媒体で追加申請中） | 主要サブスク提携 |
| もしもアフィリエイト | メディア登録済（ID: 673448）+ 5案件提携 | 楽天市場・補完案件 |
| Amazon アソシエイト | StoreID: `shinta1999-22` | Amazon 全商品 |
| 楽天アフィリエイト | ID: `039b7990.875038c7.0ab5f5c4.4f8cf5a9` + サブスクやめたサイト登録済 | 楽天市場全商品 |

詳細は `docs/lessons.md` に蓄積。

---

## 4. 設計原則の所在

- `docs/AFFILIATE_DESIGN_PRINCIPLES.md` ← アフィリエイトの実装憲法（BAE）
- `docs/lessons.md` ← 発見・失敗・判断軸の蓄積
- `docs/STRATEGY.md` ← 戦略文書

「実装で迷ったら設計原則 → 過去の判断は lessons → 戦略を再確認したら STRATEGY」の順で参照する。

---

## 5. 重要な意思決定をする時のプロトコル

設計憲法・運用ルール・新機能の方針など、**永続的な影響を与える意思決定**をする時は、必ず以下を呼ぶ：

**Claude Code skill: `proposal-stress-test`**

これは「答え→否定→否定つぶし」の4ステップ弁証法検証。`~/.claude/skills/proposal-stress-test/SKILL.md` に永続化済み。
ユーザーが「断言できるか」「こじらせていないか」と問うた時にも自動的に発火する。

---

## 6. lessons.md への追記ルール

新しい知見・失敗・判断軸を発見したら、その日のうちに `docs/lessons.md` に追記する。
形式：
```
## YYYY-MM-DD ★（重要度1-5）見出し

### 発見
[具体的に何を発見したか]

### なぜ重要か
[将来の判断にどう影響するか]

### 永続化（あれば）
[skill / docs / コードへの反映場所]
```

「ユーザーに聞かれなくても」書く。これがプロジェクトの長期資産になる。

---

## 7. 技術スタック（変更時要注意）

- React 19 + Vite 8 + react-router-dom 7
- vite-plugin-pwa（manifest + Service Worker）
- React.lazy + Suspense
- CSS Modules
- Google Analytics 4 + AdSense
- Netlify（環境変数で ASP の ID を管理）

---

## 8. Netlify 環境変数（2026-05-23 時点）

```
VITE_GA_MEASUREMENT_ID=（設定済）
VITE_ADSENSE_CLIENT=（設定済）
VITE_ADSENSE_SLOT_SERVICE=4506595525
VITE_SITE_URL=https://sabusuku.netlify.app
VITE_AMAZON_ASSOCIATE_ID=shinta1999-22  ← 設定予定
VITE_RAKUTEN_AFFILIATE_ID=039b7990.875038c7.0ab5f5c4.4f8cf5a9  ← 設定予定
VITE_A8_MEDIA_ID=（俊雄さんのメディアID）
VITE_MOSHIMO_MEDIA_ID=673448
```

---

## 9. ライフオラクルとの関係

サブスクやめた と ライフオラクル は**別ブランド**として運営する。
ただし将来オプションとして「現代人解放プラットフォーム連合」が **保留中**（判断時期：BAE 実装後1ヶ月の数値結果）。
この保留は `docs/lessons.md` に記録済み。今は触らない。

---

*作成日：2026-05-23*
*最終更新：2026-05-23*
