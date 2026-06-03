# デザイン大幅改善指示書
## 目標：「制作費100万円のような見た目」に引き上げる

---

## 現状診断（Claude Code on the Web が調査済み）

| 項目 | 現状 | 問題 |
|---|---|---|
| カラーシステム | OKLCHベース・完璧 | ✅ 触らない |
| フォント | Inter + Noto Sans JP（見出し専用なし） | ❌ 全部同じで平坦 |
| アニメーション | framer-motion インストール済みなのに未使用 | ❌ 静的で安っぽい |
| タイポグラフィスケール | px固定値が散在 | ❌ Hero見出しが小さい |

---

## 作業 1：見出しフォントの追加（最優先・最大インパクト）

### 1-1. index.html に Google Fonts を追加

`<head>` 内の既存 `<link rel="icon"...>` の直後に追加：

```html
<!-- 高級感フォント：見出し用セリフ体 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&display=swap" rel="stylesheet">
```

### 1-2. src/index.css に見出しフォント変数を追加

`:root` ブロック内の `--font-sans` の直下に追記：

```css
--font-display: 'Noto Serif JP', 'Hiragino Mincho ProN', 'YuMincho', 'Yu Mincho', serif;
```

### 1-3. src/index.css の h1・h2 に見出しフォントを適用

既存の `h1, h2, h3, h4 { ... }` ブロックを以下に置き換え：

```css
h1, h2, h3, h4 {
  letter-spacing: -0.02em;
  line-height: 1.3;
}

h1, h2 {
  font-family: var(--font-display);
  font-weight: 700;
}

h3, h4 {
  font-family: var(--font-sans);
  font-weight: 700;
}
```

---

## 作業 2：タイポグラフィスケールの整理

### 2-1. src/index.css の `:root` に追記

`--shadow-lg` の直下に追加：

```css
/* タイポグラフィスケール（clamp でレスポンシブ） */
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  clamp(1.75rem, 3vw, 2.25rem);
--text-hero: clamp(2.25rem, 5vw, 3.5rem);
```

### 2-2. src/pages/HomePage.module.css のメインタイトルを更新

ページ内で `font-size: 36px` となっている見出し（Top10タイル上のセクション見出し等）を
`font-size: var(--text-3xl)` に置き換える。

---

## 作業 3：Framer Motion でスクロールアニメーション

### 3-1. 共通アニメーションコンポーネントを新規作成

`src/components/FadeUp.jsx` を新規作成：

```jsx
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function FadeUp({ children, delay = 0, className }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### 3-2. HomePage のセクション見出しに適用

`src/pages/HomePage.jsx` で `FadeUp` をインポートし、
以下のセクション見出しを `<FadeUp>` で囲む：

- 「よく解約されるサービス」見出し
- 「カテゴリ別」各セクション見出し（delay を 0.05 ずつずらす）

```jsx
import FadeUp from '../components/FadeUp';

// 例
<FadeUp>
  <h2 className={styles.sectionTitle}>よく解約されるサービス</h2>
</FadeUp>
```

### 3-3. Top10 タイルにホバーエフェクト追加

`src/pages/HomePage.module.css` 内の Top10 カードの CSS に追加：

```css
.serviceCard {
  /* 既存スタイルに追加 */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.serviceCard:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
```

---

## 作業 4：ヘッダーのロゴを強化

`src/components/Header.module.css` の `.logoTitle` を更新：

```css
.logoTitle {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1.2;
}
```

---

## 作業 5：ServicePage の解約ページ見出しを強化

各サービス詳細ページ（ServicePage.jsx / ServicePage.module.css）で：
- サービス名の h1 を `font-family: var(--font-display)` + `font-size: var(--text-hero)` に
- 「解約手順」セクション見出しを `font-family: var(--font-display)` に

---

## 優先順位まとめ

| 順番 | 作業 | 所要時間目安 | 効果 |
|---|---|---|---|
| 1 | フォント追加（index.html + index.css） | 5分 | ⭐⭐⭐⭐⭐ |
| 2 | タイポスケール変数追加 | 5分 | ⭐⭐⭐ |
| 3 | FadeUp コンポーネント作成 + HomePage 適用 | 20分 | ⭐⭐⭐⭐ |
| 4 | カードホバーエフェクト | 5分 | ⭐⭐⭐ |
| 5 | ヘッダーロゴ強化 | 3分 | ⭐⭐ |
| 6 | ServicePage 見出し強化 | 15分 | ⭐⭐⭐⭐ |

---

## 注意事項

- **カラー変数（--accent, --loss 等）は絶対に変更しない**
- **既存の `--font-sans` スタックは変更しない**（本文・UIは現状維持）
- `--font-display` は見出し（h1, h2）とロゴのみに使用
- `prefers-reduced-motion` は既に index.css で対応済みなのでアニメーション追加は安全
- 変更後は `npm run dev` でローカル確認してから push

---

## ローカルClaude Codeへの指示文（コピペ用）

```
docs/DESIGN_UPGRADE_BRIEF.md の指示書に従って、
サブスクやめたのデザインを100万円感のある見た目に改善してください。
作業1〜4を順番に実装し、npm run build でエラーがないことを確認してから
コミット・push してください。
```
