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

凡例：担当 👤=俊雄さんの原子操作（ログイン/申込）／🤖=私（Chrome/MCPで実行可）。

### 1. Google Search Console（GSC）　担当 👤+🤖　最優先
- 現状：URLプレフィックス型で `https://sabusuku.netlify.app/` を登録・検証済（`public/googlef48b6b57fcb30d8a.html`）。
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
