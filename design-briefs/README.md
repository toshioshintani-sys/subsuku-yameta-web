# Design Briefs — Codex 発注フォルダ

> このフォルダは「サブスクやめた」サイトのデザインパーツを **Codex（画像生成エージェント）に発注** するための作業場です。
>
> 1ブリーフ = 1依頼。各サブフォルダの `BRIEF.md` が発注書、`output/` が納品先です。

---

## ワークフロー

```
[design-briefs/]
├── README.md ← 全体の使い方（このファイル）
├── _STYLE_GUIDE.md ← ブランド世界観・必読
├── 01-mascot/
│   ├── BRIEF.md ← 発注書（プロへの依頼文）
│   └── output/ ← Codex がここに納品（PNG / SVG / WebP）
├── 02-hero-illustration/
│   ├── BRIEF.md
│   └── output/
└── ...
```

### Codex への依頼手順

1. **Codex に当該サブフォルダを開かせる**（例：`design-briefs/01-mascot/`）
2. **Codex に `BRIEF.md` を読ませる**
3. **Codex が `output/` 配下に指定ファイル名で納品**
4. **俊雄さん or 私（Claude Code）がレビュー** → 採用なら `subsuku-yameta-web/public/assets/` に移動して実装で参照

### 採用基準

各 BRIEF.md の末尾「採用基準」を満たすこと。満たさない場合は再依頼。

---

## ブランド世界観の最重要原則（Codex 必読）

**「サブスクやめた」は "やめさせてくれるサイト" として信頼を獲得することが最優先です。**

| OK | NG |
|---|---|
| 静かで知的な印象 | 派手・煽り・「絶対」「No.1」表現 |
| 信頼感のあるトーン | チャラい・軽い・ふざけすぎ |
| 解放感（自由になる） | 攻撃的（敵を倒す・破壊） |
| 大人びた配色（OKLCH ベース） | ネオン・蛍光色・派手なグラデーション |
| ミニマル（必要なものだけ） | 装飾過剰・ノイズ多い |
| 人間味（温かい）| 無機質・冷たい |

詳細は `_STYLE_GUIDE.md` を必ず読むこと。

---

## 現在のブリーフ一覧

| # | ブリーフ | 用途 | 納品形式 | 優先度 |
|---|---|---|---|---|
| 01 | mascot | サイト全体の顔・404・Hero 等で再利用 | SVG + PNG | ★★★★★ |
| 02 | hero-illustration | HomePage 最上部 Hero セクション | SVG / PNG（透過） | ★★★★★ |
| 03 | empty-state | 検索0件・Tracker空状態 | SVG | ★★★★ |
| 04 | not-found-404 | /404 ページ専用 | SVG / PNG | ★★★★ |
| 05 | category-icons | カテゴリ別アイコン8種 | SVG（統一スタイル） | ★★★ |
| 06 | yamete-kau-categories | やめて買う6カテゴリのイラスト | SVG / PNG | ★★★ |

---

## 命名規則

納品ファイルは BRIEF.md で指定された名前を使用してください：

- マスコット：`mascot-{表情}.svg` / `mascot-{表情}.png`
- Hero：`hero-{バリアント}.svg`
- カテゴリ：`category-{ジャンル名}.svg`
- 等

詳細は各 BRIEF.md を参照。

---

## カラーパレット（厳守）

「サブスクやめた」のカラーシステム（OKLCH）：

```
プライマリ（"自由" のティール）:
  --accent:        #0a7c7c  (OKLCH 54% 0.13 200)
  --accent-hover:  #0d6868
  --accent-soft:   #e6f4f4  (背景・ホバー)

ロス（"重力" のテラコッタ・赤じゃない）:
  --loss:        #b85c3d  (OKLCH 52% 0.13 35)

ニュートラル（温かみグレー）:
  --bg:        #fbf8f3  (温かい白)
  --surface:   #ffffff
  --text:      #1a1f2e  (深い藍黒)
  --text-sub:  #5e6a82
  --border:    #e5e8f0

ダークモード:
  --bg:        #131c2e  (深い藍夜空)
  --surface:   #1a2540
  --text:      #f0f3f8
  --accent:    #5cb9b9  (明るめのティール)
```

イラスト・マスコットは **この6色＋影色** のみで構成すること（カラフルすぎ防止）。

---

## ステータス管理

各 BRIEF.md の冒頭にステータスを記載：

- `[ ] 未着手`
- `[~] 制作中`
- `[✓] 納品済み・採用`
- `[×] 納品済み・再依頼`

---

## 困った時

- ブランド世界観が分からない → `_STYLE_GUIDE.md`
- 既存サイトの雰囲気を見たい → https://sabusuku.netlify.app
- 設計憲法を確認したい → `../docs/AFFILIATE_DESIGN_PRINCIPLES.md`
