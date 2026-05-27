# BRIEF 05：カテゴリアイコン制作依頼（8種）

**ステータス：** `[ ] 未着手`
**優先度：** ★★★（既存 lucide-react で代替可・差別化要素として効果大）

---

## 1. 制作依頼の概要

「サブスクやめた」HomePage および discover ページで使われる **カテゴリ別アイコン8種** を制作してください。

現在は lucide-react（既製アイコン）を使用していますが、これを **オリジナルアイコンセット** に置き換えることで、サイトのブランド独自性が一段上がります。

---

## 2. 必要な8カテゴリ

| ファイル名 | カテゴリ | 既存メタファー | 新提案（任意）|
|---|---|---|---|
| `category-video.svg` | 動画 | 再生ボタン△ | 映画館の座席・スクリーン等 |
| `category-music.svg` | 音楽 | 音符♪ | レコード・ヘッドフォン等 |
| `category-shopping.svg` | ショッピング | 買物袋 | ギフトボックス等 |
| `category-software.svg` | ソフト・ツール | 歯車⚙ | 工具・ペン等 |
| `category-news.svg` | ニュース・読み放題 | 新聞 | 開いた本・コラム |
| `category-game.svg` | ゲーム | コントローラー | キューブ・サイコロ |
| `category-lifestyle.svg` | ライフスタイル | 家🏠 | 鉢植え・ティーカップ |
| `category-education.svg` | 教育・学習 | 卒業帽🎓 | 鉛筆と本・電球 |

既存メタファーは「無難」です。**新提案** で独自性を狙ってください。

---

## 3. ビジュアル仕様

### サイズと形式

- viewBox: `0 0 32 32`（pixel-perfect な小サイズ）
- すべて SVG・stroke ベース推奨
- ストローク幅 1.5-2px・線色 `currentColor`（テーマ追従可能）

### 統一スタイル（全8個で完璧に揃える）

- **stroke ベース**（fill ベースではない・スカッとした印象）
- **角は丸める**（rounded line cap・join）
- **対称性は崩す**（完璧な対称はロゴ感がでる・少し動きを）
- **詳細は最小限**（小サイズで見える範囲のみ）

### 参考スタイル

- **Lucide（Feather 系）** の精度・但しもう少し個性を
- **Heroicons** の outline 版
- **Phosphor Icons** の柔らかさ
- ※ どれかに寄せすぎず、独自性を出す

---

## 4. 採用基準

- [ ] 8個すべて納品
- [ ] **全8個が同じスタイルで揃っている**（最重要・一目で「同じセット」と分かる）
- [ ] stroke ベース・ストローク幅統一
- [ ] viewBox `0 0 32 32`
- [ ] currentColor が機能する設計（テーマ追従可能）
- [ ] ファイル名規則準拠

---

## 5. NG 表現

- ❌ カテゴリごとに違うスタイル（fill / stroke 混在等）
- ❌ サイズが揃っていない（同じ viewBox 内でも視覚的にバラバラ）
- ❌ 既存のフリーアイコンセットからのコピー
- ❌ 過度に細かいディテール（16px 表示で潰れる）

---

## 6. 納品方法

`design-briefs/05-category-icons/output/` 配下に：

```
output/
├── category-video.svg
├── category-music.svg
├── category-shopping.svg
├── category-software.svg
├── category-news.svg
├── category-game.svg
├── category-lifestyle.svg
├── category-education.svg
├── preview.svg ← 全8個を1枚に並べたプレビュー（採用判断用）
└── DESIGN_NOTES.md
```

---

## 7. 想像を超えてください

カテゴリアイコンは **無難になりやすい** ジャンル。
「動画＝再生ボタン」は誰でも思いつく。Codex なら **一目で印象に残る、しかし機能性を失わない** メタファーを発明できるはず。
