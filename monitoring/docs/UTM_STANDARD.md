# ライフオラクル 流入元計測 UTM標準

## 目的
note・X・その他から life-oracle.jp への流入を **どこから来たか正確に区別** し、GA4のセッション ソース別レポートで可視化する。

## UTMパラメータの基本構造

```
https://life-oracle.jp/?utm_source=<どこ>&utm_medium=<どんな経路>&utm_campaign=<どの企画>
```

GA4 は自動的にこのパラメータを `sessionSource` / `sessionMedium` / `sessionCampaign` 次元として記録する。

---

## 標準URL一覧（コピペ用）

### note（記事内）

| 設置場所 | URL |
|---|---|
| **記事冒頭CTA** | `https://life-oracle.jp/?utm_source=note&utm_medium=article&utm_campaign=cta_top` |
| **記事末尾CTA** | `https://life-oracle.jp/?utm_source=note&utm_medium=article&utm_campaign=cta_bottom` |
| **記事中盤CTA** | `https://life-oracle.jp/?utm_source=note&utm_medium=article&utm_campaign=cta_middle` |
| **noteプロフィール欄** | `https://life-oracle.jp/?utm_source=note&utm_medium=profile&utm_campaign=bio` |
| **note固定マガジン説明** | `https://life-oracle.jp/?utm_source=note&utm_medium=magazine&utm_campaign=overview` |

### X（旧Twitter）

| 設置場所 | URL |
|---|---|
| **X固定ツイート** | `https://life-oracle.jp/?utm_source=x&utm_medium=social&utm_campaign=pinned` |
| **X通常ツイート（アプリ直リンク時）** | `https://life-oracle.jp/?utm_source=x&utm_medium=social&utm_campaign=tweet` |
| **Xプロフィール欄** | `https://life-oracle.jp/?utm_source=x&utm_medium=profile&utm_campaign=bio` |

### その他

| 設置場所 | URL |
|---|---|
| **メール署名** | `https://life-oracle.jp/?utm_source=email&utm_medium=signature` |
| **個別キャンペーン** | `https://life-oracle.jp/?utm_source=<媒体>&utm_medium=<経路>&utm_campaign=<企画名>` |

---

## 命名ルール

- `utm_source`：どのプラットフォームから（note / x / email / instagram など）
- `utm_medium`：どんな経路で（article / social / profile / signature など）
- `utm_campaign`：どの企画・配置か（cta_top / cta_bottom / pinned / 個別企画名）
- すべて**小文字**、単語区切りは**アンダースコア**（`-` ではなく `_`）

### 命名のNG例
❌ `utm_campaign=CTAtop`（大文字混在）
❌ `utm_campaign=cta-top`（ハイフン使用）
❌ `utm_campaign=トップCTA`（日本語使用）

---

## GA4 での確認方法

GA4管理画面 →「集客」→「ユーザー獲得」→ ディメンションを `セッション ソース / メディア` に設定。

例：
| ソース / メディア | セッション数 |
|---|---|
| note / article | 12 |
| x / social | 5 |
| (direct) | 8 |
| google / organic | 3 |

これで「**末尾CTA vs 冒頭CTA、どっちが効いてるか**」が記事単位で測れる。

---

## CTAテンプレート（noteブログ末尾想定）

### バリエーション1：記事文末

```markdown
あなた自身のコミュニケーションのパターンを知りたい方は、無料の性格診断「ライフオラクル」を試してみてください。

ユング心理学×行動経済学のバイアス分析で、自分では気づかなかった傾向が見えてきます。

👉 https://life-oracle.jp/?utm_source=note&utm_medium=article&utm_campaign=cta_bottom
```

### バリエーション2：記事冒頭

```markdown
> 💡 **この記事をより深く理解するには**
>
> 先に5分で自分の性格タイプを診断しておくと、記事の内容が「自分のこと」として刺さります。
> 無料・登録不要・ユング心理学×行動経済学
>
> 👉 [診断スタート](https://life-oracle.jp/?utm_source=note&utm_medium=article&utm_campaign=cta_top)
```

### バリエーション3：記事中盤（自然な切れ目で）

```markdown
（ここまで読んで「自分はどっちのタイプだろう？」と思った方は、診断ツールで答え合わせしてみてください → [ライフオラクル](https://life-oracle.jp/?utm_source=note&utm_medium=article&utm_campaign=cta_middle)）
```

---

## 運用の注意

- 既存記事のCTA URLは**少しずつ更新**でOK（一気に全記事やらなくていい）
- 新記事は**最初からUTM付きURL**を使う
- UTMパラメータが付いていても表示上は同じページなので、ユーザー体験は変わらない
- GA4で見るときは反映に**最大24時間**のラグがある
