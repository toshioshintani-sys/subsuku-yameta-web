# BRIEF 03：Empty State イラスト制作依頼

**ステータス：** `[ ] 未着手`
**優先度：** ★★★★（ユーザー体験の質を1段上げる）
**前提：** ブリーフ 01「マスコット」が制作中もしくは完成していると望ましい

---

## 1. 制作依頼の概要

「サブスクやめた」サイト内で **"何もない状態"** に出会った時に表示される救済イラスト3点を制作してください。

Empty State は **使い慣れたユーザーですら遭遇する瞬間** なので、サイト品位が問われる場所です。
「やめさせてくれるサイト」の誠実さが、この余白でこそ試されます。

---

## 2. 必要な3パターン

### A. 検索結果0件

`empty-search.svg`

- 場面：ユーザーがサイト内検索したが該当サブスクが無かった
- 感情：「ごめんなさい、でも代わりにこちらは？」という親切さ
- 構図：マスコットが虫眼鏡を持って探す姿・少し困った表情

### B. Tracker 空（まだ何も登録していない）

`empty-tracker.svg`

- 場面：`/tracker` ページで登録サブスクが0件の時
- 感情：「これから整理していきましょう」という前向きさ
- 構図：マスコットが空の引き出し or 整理ボックスを示している

### C. ブログ未読 / お気に入り空

`empty-bookmark.svg`

- 場面：将来のブックマーク機能用（先取り）
- 感情：「気になる記事を保存しておけます」という案内
- 構図：マスコットが本を抱えて整理している

---

## 3. ビジュアル仕様

### サイズ

- viewBox: `0 0 400 300`（アスペクト比 4:3）
- すべて SVG・透過背景

### 配色

`_STYLE_GUIDE.md` § 4 厳守。
- 主要：`#0a7c7c`（accent）
- 副次：`#5e6a82`（text-sub）
- アクセント：`#b85c3d`（loss）を控えめに（迷子感を和らげる）
- 線：`#1a1f2e`（text）

### スタイル方向性

- **マスコットを必ず登場させる**（ブリーフ 01 と連動）
- **要素は少なく**（メインモチーフ + 補助オブジェクト1-2個まで）
- **下半分に余白**（テキストが下に表示される設計）
- **悲しすぎない**（ユーザーを責めない・困らせない）

### 参考プロダクト

- **Notion の Empty State**（穏やかなトーン）
- **Apple Notes の Empty**（さりげない案内）

---

## 4. NG 表現

- ❌ 「データがありません」を強調する表示
- ❌ 過度に悲しい・困った表情
- ❌ エラーアイコン（×・！）の使用
- ❌ ジェネリックな「箱が空」イラスト

---

## 5. 採用基準

- [ ] 3パターン全て納品
- [ ] マスコットが一貫した姿（ブリーフ 01 と整合）
- [ ] 下半分に空白がある（テキスト挿入領域）
- [ ] 配色がスタイルガイド準拠
- [ ] SVG として viewBox 設定済み
- [ ] BAE 違反なし

---

## 6. 参考にすべき既存ファイル（GitHub main で参照）

- [_STYLE_GUIDE.md（必読）](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/design-briefs/_STYLE_GUIDE.md)
- [01-mascot/output/](https://github.com/toshioshintani-sys/subsuku-yameta-web/tree/main/design-briefs/01-mascot/output)（マスコット完成版・必須連動）
- [src/index.css](https://github.com/toshioshintani-sys/subsuku-yameta-web/blob/main/src/index.css)

## 7. 納品方法（PR ベース）

### ブランチ運用

1. `main` から `codex/03-empty` ブランチを切る
2. PR タイトル：「Codex: Empty State illustrations x3 (BRIEF 03)」
3. PR Description に DESIGN_NOTES.md ＋採用基準セルフチェック

### 納品先・ファイル名（厳守）

`design-briefs/03-empty-state/output/` 配下に：

```
output/
├── empty-search.svg
├── empty-tracker.svg
├── empty-bookmark.svg
└── DESIGN_NOTES.md
```

---

## 7. 想像を超えてください

Empty State は **見られないことが理想** の画面です。
でも見られた時、ユーザーの気持ちを和らげる **小さな贈り物** になってください。

Notion や Linear がここに手を抜かない理由を、Codex なら理解しているはず。
