# Design Briefs — Codex 発注フォルダ

> このフォルダは「サブスクやめた」サイトのデザインパーツを **Codex（OpenAI/コード生成エージェント）に発注** するための作業場です。
>
> 1ブリーフ = 1依頼。各サブフォルダの `BRIEF.md` が発注書、`output/` が納品先です。

---

## 🤖 Codex への召喚指示文（俊雄さんがそのままコピペして使う）

```
リポジトリ: https://github.com/toshioshintani-sys/subsuku-yameta-web
ブランチ: main

タスク:
1. design-briefs/README.md を読み、全体ワークフローを理解する
2. design-briefs/_STYLE_GUIDE.md を読み、サブスクやめたの世界観を頭に入れる
3. design-briefs/01-mascot/BRIEF.md の発注に着手する
   （02 以降は別ターンで指示）

納品手順（厳守）:
A. main から新ブランチ `codex/01-mascot` を切る
B. design-briefs/01-mascot/output/ 配下に BRIEF.md で指定されたファイル名で SVG を保存
   - mascot-smile.svg / mascot-thinking.svg / mascot-celebrate.svg
   - mascot-lost.svg / mascot-cutting.svg
   - DESIGN_NOTES.md（制作意図・命名提案）
C. PR を出す
   - PR タイトル: 「Codex: Mascot - 5 expressions (BRIEF 01)」
   - PR Description に DESIGN_NOTES.md の内容を貼る
   - 採用基準チェックリスト（BRIEF.md § 6）を PR Description に転記して self-check

参考にすべき既存ファイル（GitHub main ブランチで参照）:
- src/index.css（OKLCH カラー定義の正解値）
- docs/AFFILIATE_DESIGN_PRINCIPLES.md（BAE 設計憲法 v2.0）
- src/components/ServiceIcon.jsx（既存アイコン実装の参考）
- src/components/Header.jsx（ロゴ ✂ Scissors の使い方参考）

注意:
- 配色は _STYLE_GUIDE.md § 4 で指定された OKLCH パレットのみ使用
- BAE 不可侵領域（解約導線 > 装飾 / 煽り禁止 / ランキング禁止）を絶対遵守
- 「想像を超える出来栄え」を期待します。BRIEF が指定しない領域は大胆に
- PNG fallback は不要（SVG のみ納品）。レスポンシブは viewBox で対応
```

02-06 のブリーフ着手時は、上記の `01-mascot` を該当ブリーフ番号に置き換えて指示。

---

## 📁 フォルダ構造

```
[GitHub: toshioshintani-sys/subsuku-yameta-web]
└── design-briefs/
    ├── README.md ← この文書
    ├── _STYLE_GUIDE.md ← ブランド世界観・必読
    ├── 01-mascot/
    │   ├── BRIEF.md ← 発注書（プロへの依頼文）
    │   └── output/ ← Codex がここに納品
    ├── 02-hero-illustration/
    │   ├── BRIEF.md
    │   └── output/
    ├── 03-empty-state/
    ├── 04-not-found-404/
    ├── 05-category-icons/
    └── 06-yamete-kau-categories/
```

---

## 🔁 運用ワークフロー（PR ベース）

```
[1] 俊雄さんが Codex に召喚指示文を渡す
       ↓
[2] Codex が main から codex/NN-xxx ブランチを切る
       ↓
[3] Codex が design-briefs/NN-xxx/output/ に SVG を生成
       ↓
[4] Codex が PR を作成して納品報告
       ↓
[5] 俊雄さん or 私（Claude Code）がレビュー
       ├─ 採用 → main へ merge → 実装フェーズへ
       └─ 再依頼 → PR にコメント → Codex が修正 push
       ↓
[6] 採用された SVG を src/components/ や public/assets/ に組み込み（私の作業）
```

---

## 📚 重要な GitHub URL（Codex 参照用）

### リポジトリ全体
- https://github.com/toshioshintani-sys/subsuku-yameta-web

### 必読ドキュメント
- [README.md（このフォルダの使い方）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/design-briefs/README.md)
- [_STYLE_GUIDE.md（世界観の憲法）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/design-briefs/_STYLE_GUIDE.md)
- [docs/AFFILIATE_DESIGN_PRINCIPLES.md（BAE 設計憲法 v2.0）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/docs/AFFILIATE_DESIGN_PRINCIPLES.md)

### 参考にすべき既存実装
- [src/index.css（OKLCH カラー定義）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/src/index.css)
- [src/components/Header.jsx（ロゴ ✂）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/src/components/Header.jsx)
- [src/components/ServiceIcon.jsx（既存アイコン）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/src/components/ServiceIcon.jsx)
- [src/data/services.js（サービスデータ）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/src/data/services.js)

### 既存サイトの実物
- https://sabusuku.netlify.app

---

## 🎨 ブランド世界観の最重要原則（Codex 必読）

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

## 📋 ブリーフ一覧

| # | ブリーフ | 用途 | 納品形式 | 優先度 | Codex ブランチ名 |
|---|---|---|---|---|---|
| 01 | mascot | サイトの顔・404・Hero 等で再利用 | SVG 5種 | ★★★★★ | `codex/01-mascot` |
| 02 | hero-illustration | HomePage 最上部 Hero | SVG 4種 | ★★★★★ | `codex/02-hero` |
| 03 | empty-state | 検索0件・Tracker空・Bookmark空 | SVG 3種 | ★★★★ | `codex/03-empty` |
| 04 | not-found-404 | /404 専用 | SVG 2種 | ★★★★ | `codex/04-404` |
| 05 | category-icons | オリジナルアイコン8種 | SVG 8種 | ★★★ | `codex/05-icons` |
| 06 | yamete-kau-categories | やめて買う6カテゴリヘッダー | SVG 6種 | ★★★ | `codex/06-yamete-kau` |

---

## 🎯 採用 / 不採用の判断

レビューは俊雄さん or 私（Claude Code）が行います。

- **採用** → PR を main へ merge → 後で私が実装に組み込む
- **再依頼** → PR にコメント（具体的な修正点を箇条書き）→ Codex が同じブランチに修正 push
- **撤退** → PR を close → ブランチ削除（最終手段）

---

## 🔒 命名規則（Codex 厳守）

- ファイル名：小文字・ハイフン区切り（例：`mascot-smile.svg`）
- スネークケース禁止・キャメルケース禁止・日本語禁止
- 各 BRIEF.md で指定されたファイル名を **完全に一致** させること
- `viewBox` を必ず明記
- ライト/ダーク両対応が必要なものは `-light` / `-dark` サフィックスで区別

---

## 🆘 困った時

- ブランド世界観が分からない → `_STYLE_GUIDE.md`
- 既存サイトの雰囲気を見たい → https://sabusuku.netlify.app
- 設計憲法を確認したい → `docs/AFFILIATE_DESIGN_PRINCIPLES.md`
- 配色の正確な値を知りたい → `src/index.css` の `:root` ブロック
- 既存アイコンの実装を見たい → `src/components/ServiceIcon.jsx`

ブリーフが曖昧な場合は、`design-briefs/NN-xxx/QUESTIONS.md` を作成して質問を残してください。
俊雄さん or 私（Claude Code）が回答します。
