# 独自ドメイン移行 — 外部申請やり直しチェックリスト（sabusuku-yameta.com）

> 2026-06-20 作成。ドメイン `sabusuku-yameta.com` 取得＋Netlify DNS委譲済（反映待ち）に伴い、
> 旧 `sabusuku.netlify.app` で行っていた外部登録・申請を新ドメインで整理し直す台帳。
> 技術側の本体手順は `DOMAIN_MIGRATION.md`、本書は**外部サービス申請**に特化。

---

## 🛑 鉄則（順序を絶対に守る）

**ほとんどの再申請は `https://sabusuku-yameta.com` が生きてから（HTTPS発行後）行う。**
先に申請すると審査が新ドメインを見れず、無駄になる/却下が固着する（特にAdSense）。

実行順序：
1. **Phase 1（私・コード）**：DNS反映＋HTTPS発行 → env差替で本番を新ドメインに（`DOMAIN_MIGRATION.md`）。
2. **Phase 2（外部申請）**：本番が新ドメインで生きてから、下記を順に。

※ 例外で「今」できるのは GA4 確認のみ（下記）。それ以外は Phase 1 完了が前提。

---

## Phase 2 — 外部申請やり直し（本番が新ドメインで生きてから）

### 🔁 2026-08-23 再点検（同じ依頼が来た時のための現状スナップショット）

「GA4が旧ドメインのままなので直して」という依頼を受けて**現物を確認したところ、1〜3は既に完了済み**だった。
同じ依頼が繰り返されないよう、確認した事実をここに固定する。**再調査より先にここを読むこと。**

| 項目 | 実測（2026-08-23 20時台） |
|---|---|
| GA4 データストリームURL | ✅ `https://sabusuku-yameta.com`（測定ID `G-S0H16V3WE2`・ストリームID 14921773006 は不変） |
| GA4 Search Console リンク | ✅ `sabusuku-yameta.com`（**ドメイン型**）1件のみ。旧 netlify のリンクは残っていない |
| GSC サイトマップ | ✅ 2026/06/20 送信・2026/08/14 読込成功・142ページ検出 |
| GSC アドレス変更 | ✅ 旧プロパティに「このサイトは現在、sabusuku-yameta.com に移行中です」 |
| Bing サイト登録 | ✅ 管理画面の全リンクが `siteUrl=https://sabusuku-yameta.com/`・所有権確認の要求なし |
| Bing サイトマップ | ⚠️ **未反映**（下記） |
| robots.txt | ✅ `Sitemap: https://sabusuku-yameta.com/sitemap.xml` を宣言 |
| 旧ドメイン | ✅ HTTP 301 → `https://sabusuku-yameta.com/` |

**⚠️ Bing のサイトマップだけ未確定。** GSCインポートでは引き継がれず、2026-08-23 に手動送信を
試みたが一覧に反映されなかった（Bingは反映が遅いことがあるので、後日もう一度見ること）。
ただし **robots.txt のサイトマップ宣言で自動発見される**うえ、**IndexNow が日次で142URLを
直接通知している**ので、致命的な穴ではない。

**📌 GSC に「URLプレフィックス型」を追加してはいけない。** 既に `sc-domain:sabusuku-yameta.com`
という**ドメインプロパティ**があり、こちらは http/https・www有無・全サブドメインを一括で
カバーする上位互換。URLプレフィックスを足すとプロパティが二重になり、どちらを見ればいいか
分からなくなる。**追加不要。**

**📌 Bing の「サイトの移動（Site Move）」ツールは現行UIに存在しない。** 探さないこと。
301 + サイトマップ + IndexNow で代替する（すべて設定済み）。



凡例：担当 👤=俊雄さんの原子操作（ログイン/申込）／🤖=私（Chrome/MCPで実行可）。

### 1. Google Search Console（GSC）　担当 👤+🤖　最優先
- 現状：URLプレフィックス型で `https://sabusuku.netlify.app/` を登録・検証済（`public/googlef48b6b57fcb30d8a.html`）。
- **✅ 2026-08-23 完了（GSC本体は元から完了していた／GA4連携だけ張り替えた）**：
  ※ 当初この節を 2026-08-20 付で書いたが誤り。実際の作業日は 2026-08-23（コミット時刻で確認）。
    セッションが数日にまたがり、私が会話の途中の日付を引きずったまま書いた。
  - GSC ドメインプロパティ `sc-domain:sabusuku-yameta.com` は**既に存在し確認済み**だった
    （オーナー: toshio.shintani@gmail.com。Indexing API 用サービスアカウント
    `life-oracle-ga4@...` もフル権限で登録済＝チェックリスト項目3も実質完了）。
  - **サイトマップも 2026/06/20 に送信済み**・最終読込 2026/08/14・成功・142ページ検出。
  - **検索データも正常に溜まっていた**（直近28日：表示1,080回・クリック10・CTR 0.9%・
    平均掲載順位 17.5。上位クエリ「apple tv 解約」54回、「楽天マガジン 解約」36回など）。
    → 当初懸念した「移行後2か月ぶんの検索データが空」は**誤り**だった。
  - **実際に欠けていたのは GA4 の Search Console 連携だけ**。旧
    `https://sabusuku.netlify.app/`(URL-prefix) が 2026/06/13 から繋がったままだった。
    GA4 は**1プロパティにつき1リンクまで**（「リンク数の上限に達しました」）なので、
    旧リンクを削除 → `sabusuku-yameta.com`(ドメイン型) を新規リンクして張り替えた。
    2026/08/23 リンク済み・ストリーム「サブスクやめた本番」(14921773006)。
  - ✅ **GA4 のデータストリームURLも `https://sabusuku-yameta.com` に更新済み**
    （2026-08-23。測定ID `G-S0H16V3WE2`・ストリームID 14921773006 は不変）。
  - ✅ **アドレス変更ツールも実行済みだった**。旧 netlify プロパティの設定に
    「このサイトは現在、sabusuku-yameta.com に移行中です」と表示される＝項目1の
    1〜3はすべて完了している。
  - ✅ **IndexNow が独自ドメインで初めて通った**（2026-08-23 実行・HTTP 200・142URL受理）。
    旧 netlify の共有サブドメインでは Bing に弾かれていたもので、チェックリストが
    予告していた「独自ドメインの隠れた最大の効用」が実測で確認できた。
    ただし **スクリプトはどこからも呼ばれていなかった**ので、日次ルーチン
    （`run_daily_judge.ps1`）に1日1回で組み込み、`npm run seo:indexnow` も追加した。
  - ✅ **Bing Webmaster Tools も完了**（2026-08-23）。俊雄さんが Microsoft アカウントで
    ログイン → GSC からインポートで `https://sabusuku-yameta.com/` を登録。
    Google 側には `webmasters.readonly`（確認済みサイトの Search Console データの表示）を
    bing.com に付与済み。取り消しは Google アカウントの設定からいつでも可能。
    - ⚠️ **私の操作ミスの記録**：インポート対象を選び直す際にチェックボックスのクリックが
      1行ずれ、`jimoto-no-oya.netlify.app`（地元の親）と `sabusuku.netlify.app`（旧ドメイン）が
      意図せず登録された。実害はない（どちらも俊雄さんのサイトで、旧ドメインは301で新へ飛ぶ）が、
      **別プロジェクトのサイトをこのセッションから登録してしまった**のは越権。消したい場合は
      サイト一覧の各行「⋮」から削除できる。
    - 📌 Bing 管理画面に **AI Performance（ベータ）** がある。Copilot / Bing のAI回答で
      自サイトが引用された回数と対象URLが見える。pull型に一本化した現状で
      **AI検索の引用を測れる唯一の窓**なので、データが溜まったら最初に見ること
      （反映まで最大48時間）。
- **2026-08-23 実測で分かったこと（俊雄さんがGA4側で発見・私がDNSで裏取り）**：
  - 新ドメインの DNS TXT `google-site-verification=8JT-NTXoiTkXrA-XBPsBL1KJpFBpOCFaPO9CQbcxzsA` は
    **既に入っている**（`nslookup -type=TXT sabusuku-yameta.com` で確認）。TXT は GSC がドメイン
    プロパティ追加を開始した時に発行するものなので、**途中まで進めた形跡がある**。
  - ただし GSC 側で「確認」まで押されたかは、この方法では分からない。下のチェックはまだ空のまま。
  - **GA4 の Search Console 連携は旧 `https://sabusuku.netlify.app/` を指したまま**で、新ドメインは
    未連携（俊雄さんが GA4 のプロパティ一覧で確認）。
  - 影響：**新ドメインのプロパティが未確認なら、2026-06-21 の移行以降の検索データが GSC に
    一切溜まっていない**ことになる。旧 netlify は301で新ドメインへ飛ぶので旧プロパティにも
    データは入らない。pull型（SEO）に一本化した現在の方針で、**その唯一のチャネルの計測が
    欠けている**ことになるため、Phase2 の中でも最優先。
  - 新ドメインで `googlef48b6b57fcb30d8a.html` / `sitemap.xml` / IndexNowキーの3つが HTTP 200 で
    配信されていることは確認済み（＝ファイル検証型でも通せる状態）。
- やること：
  1. **ドメインプロパティ**で `sabusuku-yameta.com` を新規追加（DNS TXT検証）。TXTは**Netlify DNSに私が追加**できる（委譲済のため）。
  2. `sitemap.xml` を送信（新ドメイン）。
  3. **アドレス変更ツール**（旧 netlify プロパティ → 新ドメイン）で評価シグナルを引き継ぐ。※旧プロパティは消さず残す。
  4. 主要ページを「インデックス登録をリクエスト」。

### 2. Bing Webmaster Tools / IndexNow　担当 👤+🤖
- 現状：Bing は `sabusuku.netlify.app` 登録。**IndexNow ping は共有サブドメインをBingが弾いて失敗していた**（`indexnow-ping.mjs` の UserForbiddedToAccessSite）。
- やること：
  1. Bing Webmaster に `sabusuku-yameta.com` を追加（GSCからインポート可）。
  2. IndexNowキー `7315f020dddb7ab2494b9c03227c43d7`（`public/7315f020dddb7ab2494b9c03227c43d7.txt`）は新ドメイン直下に自動配信される。
  3. → **これで IndexNow が初めて通る**（独自ドメインの隠れた最大の効用）。`indexnow-ping.mjs` は VITE_SITE_URL 駆動済。

### 3. Google Indexing API（GitHub Actions）　担当 👤
- 現状：`.github/workflows/indexing-ping.yml` ＋ サービスアカウント（GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON`）。URLは旧ドメイン直書き（Phase1で私が新ドメインに更新）。
- やること：新GSCドメインプロパティに**同じサービスアカウントを「所有者」で追加**（`client_email`）。workflowのURLはPhase1で更新済。

### 4. Google AdSense　担当 👤　★本命
- 現状：`VITE_ADSENSE_CLIENT`(ca-pub-…)・SLOT 4506595525 設定済だが**審査が通っていない/準備中**（再判断トリガー 2026-07-11）。無料サブドメインが一因の可能性大。
- やること：AdSense → サイト → **`sabusuku-yameta.com` を追加して審査リクエスト**。承認後 `public/ads.txt` を更新（`git push`）。配置ポリシーは不変（ServicePage解約手順直下・1枠・両論併記）。
- ※ AdSense は独自ドメイン＋実コンテンツで承認率が上がる。**移行の本丸の一つ**。

### 5. A8.net　担当 👤　（やり直しが綺麗）
- 現状：**サブスクやめたは未だA8にサイト未登録**（提携42件は「ライフオラクル」側）。＝旧ドメインで登録していないので**新ドメインで新規登録すればよい**。
- やること：
  1. A8 → サイト管理 → **「新しいサイトを登録」**：サイト名「サブスクやめた」・URL **`https://sabusuku-yameta.com`**・カテゴリ=ライフスタイル/ハウツー・月間PV 1000未満。
  2. discover 掲載8案件に「サブスクやめた」で**提携申請**（HitoHana / airCloset / DROBE / AnotherADdress / DELIPICKS / every frecious / マルチピュア / INIC）。
  3. 承認後、追跡URLを `src/data/discover.js`／`affiliates.js` に反映（🤖私が可）。
- ※ 高CPA固定費案件（格安SIM/光）も本サイトで提携申請（6/19 方針・BAEガード遵守）。

### 6. もしもアフィリエイト　担当 👤
- 現状：メディア登録済（ID 673448）。サイトURLが旧ドメイン。
- やること：メディア管理でサイトURLを **`https://sabusuku-yameta.com`** に更新（または新メディア登録）。

### 7. Amazon アソシエイト　担当 👤
- 現状：StoreID `shinta1999-22`（タグ式・ドメイン非依存）。
- やること：アソシエイト・アカウントの**登録サイト一覧に新ドメインを追加**（規約上の登録。タグ自体はドメイン非依存で稼働継続）。

### 8. 楽天アフィリエイト　担当 👤
- 現状：ID `039b7990.875038c7.0ab5f5c4.4f8cf5a9`（ID式・概ねドメイン非依存）。
- やること：登録サイトURLを新ドメインに更新（任意だが整合のため）。

### 9. バリューコマース　担当 👤
- 現状：登録済・申請準備中（v2.0新規ASP）。
- やること：サイトURLを新ドメインで登録 → 代替サブスク案件に提携申請（SRE3条件遵守）。

### 10. Pinterest　担当 👤+🤖
- 現状：手動投稿運用（API投稿は審査保留で損切り済）。dev app redirect は VITE_SITE_URL 駆動済。
- やること：Pinterest で **`sabusuku-yameta.com` をドメイン申請（claim）**＝ピンの帰属・分析が新ドメインに。手動投稿チェックリスト（`docs/pinterest/MANUAL_POST_CHECKLIST.md`）のUTM先URLも新ドメインに更新（🤖）。

### 11. GA4　担当 👤（今でも可・任意）
- 現状：測定ID `G-S0H16V3WE2`／プロパティ 538470329。**ドメインが変わっても計測は継続**（gtagはホスト非依存）。
- やること：任意で、データストリームの規定URLを新ドメインに更新（表示用）。再申請不要。

### 12. SNS プロフィール / note　担当 👤+🤖
- Threads/将来X のプロフィールリンクを新ドメインに（👤）。
- note転載フッター・Threads告知文（`scripts/threads/*.json`）のURLはPhase1で新ドメイン化、既存投稿は**301でカバー**。

---

## 別件・必須（申請ではないが今すぐ）

- **ICANN 登録者メール認証**：お名前.comから届く「登録者メールアドレスの有効性認証」メールのリンクをクリック（**15日以内**・未認証でドメイン停止）。過去に認証済みなら来ないこともある。

---

## 実行順序サマリ

| 順 | 何を | 担当 | 前提 |
|---|---|---|---|
| 0 | ICANN登録者メール認証 | 👤 | 今すぐ |
| 1 | DNS反映＋HTTPS発行を待つ | （自動） | NS委譲済 |
| 2 | Phase1 env差替・301・コード新ドメイン化 → push | 🤖 | HTTPS発行後 |
| 3 | GSCドメインプロパティ＋TXT＋sitemap＋アドレス変更 | 👤+🤖 | 本番が新ドメインで生きる |
| 4 | Bing/IndexNow 新ドメイン | 👤+🤖 | 同上 |
| 5 | AdSense 新ドメインで審査リクエスト | 👤 | 同上 |
| 6 | A8新規サイト登録＋8案件提携申請 | 👤 | 同上 |
| 7 | もしも/Amazon/楽天/バリューコマース サイトURL更新 | 👤 | 同上 |
| 8 | Pinterest ドメインclaim | 👤+🤖 | 同上 |
| 9 | 承認後の追跡URLをコードに反映 → push | 🤖 | 各承認後 |

*最終更新：2026-06-20*
