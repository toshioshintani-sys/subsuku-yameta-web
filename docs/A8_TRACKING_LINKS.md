# A8 トラッキングURL 在庫（サブスクやめた媒体）

> 「取れるだけ取って後で考える」（俊雄さん 2026-06-06）で収集したA8追跡URLの在庫。
> 実装は `docs/A8_PROGRAM_REVIEW.md` のグレード／SRE3／§5-D を満たしてから。
>
> **⚠ 媒体トークンの確認が必須**：サブスクやめた正規は **`a8mat=4B3XB5+…`**。
> 先頭が `4B3XB5` 以外（例: `4B1DXM`＝別媒体/ライフオラクル等）のリンクは**使わない**（ブランド混同・成果誤帰属の防止）。
> 取得法：A8 `/program/create-link?programId=…`（掲載サイト＝サブスクやめた）→ textareaのテキスト素材から `px.a8.net/svt/ejp` を抽出（lessons 2026-06-06）。
>
> ※下記URLは公開前提の追跡リンク（秘密ではない）。実装時に `<a rel="sponsored nofollow noopener noreferrer">`＋（PR）で設置し、公開後 A8「広告掲載URL管理」に記事URLを提出。

## ✅ 本番実装済み（5）
| サービス | programID | 報酬 | 設置 | 追跡URL |
|---|---|---|---|---|
| ABEMAプレミアム | s00000020550001 | 902円 | DAZN/WOWOW/U-NEXTのALTERNATIVES | https://px.a8.net/svt/ejp?a8mat=4B3XB5+2HB4LU+4EKC+5YRHE |
| dicon（乱視用コンタクト定額） | s00000019683002 | 2,000円 | /blog/contact-lens-spot-buy-to-subscription | https://px.a8.net/svt/ejp?a8mat=4B3XB5+201K2A+47VI+BWVTE |
| Dentaly（電動歯ブラシ定額） | s00000023224001 | 1,000円 | /blog/electric-toothbrush-spot-buy-to-subscription | https://px.a8.net/svt/ejp?a8mat=4B3XB5+2JOV0Y+4Z74+5YJRM |
| アンドプランツ（花の定期便） | s00000022840002 | 1,500円 | /discover/flower（回数縛りなしを訴求） | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3KLQJ6+4W8G+BWVTE |
| タスハナ（+hana・花の定期便） | s00000023029001 | 1,000円 | /discover/flower（⚠5回縛りを明記＝両論併記） | https://px.a8.net/svt/ejp?a8mat=4B3XB5+37I782+4XOY+5YJRM |

> 2026-06-07 花の定期便2社を /discover/flower に実装（#7・アフィ部推奨・2,000円未満ST不要）。タスハナの5回継続縛りは cancel 欄に明記（社会性＝正直）。クリックは discover/blog とも GA4 計測（affiliate委譲・2026-06-06実装）。

## 📦 取得済み・未実装の在庫（18・すべて4B3XB5＝サブスクやめた正規）

### A級（積極推奨候補）— ただし報酬2,000円超は §5-D で“推し採用前に stress-test”
| サービス | programID | 報酬 | 2000超? | 追跡URL |
|---|---|---|---|---|
| every frecious（浄水サーバー） | s00000010789007 | 5,000円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3PD7DE+2B8Y+15OK2A |
| comam（浄水サーバー） | s00000023645001 | 5,000円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3ENEHE+52G2+5YJRM |
| マルチピュア（浄水器） | s00000024726001 | 5,000円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3BO8GI+5ASC+5YRHE |
| Cha Cha Cha（知育玩具定額） | s00000021840001 | 3,000円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+325AS2+4OIO+5YRHE |
| And TOYBOX（知育玩具定額） | s00000024193001 | 2,500円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+2J3FF6+56OA+5YRHE |
| IMANO MANABI（知育玩具定額） | s00000027442001 | 3,000円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3I8042+5VQS+5YJRM |
| airCloset（服サブスク） | s00000016856001 | 2,500〜3,300円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+2VLJ4I+3M28+61Z83 |
| 家電レンタルみんなのHappy | s00000026260001 | 2,100円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+2V03IQ+5MMG+5YJRM |
| HitoHana（花の定期便） | s00000016113004 | 新規注文40% | 変動 | https://px.a8.net/svt/ejp?a8mat=4B3XB5+30CZYQ+3GBU+NTJWY |
| アンドプランツ（花の定期便） | s00000022840002 | 1,500円 | — | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3KLQJ6+4W8G+BWVTE |
| タスハナ（花の定期便） | s00000023029001 | 1,000円 | — | https://px.a8.net/svt/ejp?a8mat=4B3XB5+37I782+4XOY+5YJRM |
| dicon（通常コンタクト定額） | s00000019683001 | 1,500円 | — | https://px.a8.net/svt/ejp?a8mat=4B3XB5+2XDTXU+47VI+5YRHE |

### B級（情報＋軽いアフィ候補）
| サービス | programID | 報酬 | 2000超? | 追跡URL |
|---|---|---|---|---|
| DROBE（服スタイリング） | s00000020848001 | 1,500円 | — | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3QK2KY+4GV4+5YJRM |
| AnotherADdress（服レンタル） | s00000023131001 | 2,307円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+2WSEC2+4YHA+60OXE |
| カリトケ（腕時計レンタル） | s00000020878001 | 2,500円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+36WRMA+4H3G+60OXE |
| スマイルサイクル（電アシ自転車定額） | s00000024907001 | 1,500円 | — | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3L764Y+5C6M+5YJRM |
| Loop Laundry（宅配クリーニング月額） | s00000026065001 | 1,500円 | — | https://px.a8.net/svt/ejp?a8mat=4B3XB5+33C6RE+5L4A+5YJRM |
| DELIPICKS（冷凍弁当定期） | s00000022857001 | 2,272〜2,500円 | ★要ST | https://px.a8.net/svt/ejp?a8mat=4B3XB5+3ITFPU+4WD6+5YJRM |

## ❌ 取得したが除外
| サービス | 理由 |
|---|---|
| オンスク.JP（s00000018694001） | 取得トークンが **`4B1DXM`＝別媒体**（サブスクやめた未承認の可能性）。サブスクやめた掲載サイトで再生成しない限り使用不可 |

## 🔲 未取得（必要になったら同手順で取得）
- カーリース×3：エンキロ s00000026472001（15,000円）／ニコノリ s00000022169001（17,500円）／オリコで乗ーる s00000021239001（30,000円）＝**高単価・§5-D stress-test 必須**
- Panasonic家電/食サブスク×6（s00000025109001〜012系・各5,000円）
- SPU スタイルアップ便 s00000011369002（3,007円）／IBJ結婚相談所 s00000021605001（18,500円）
- ブリッジWiFi s00000016921008（2,000円）／WiFi東京プリペイド s00000016921007（2,700円）／Glocal VPN s00000023372001／INICコーヒー s00000017094001（10%）

## 次の実装の最有力（2,000円未満＝stress-test不要・即着手可）
- **アンドプランツ / タスハナ（花の定期便 1,000〜1,500円）** → 花ジャンル（既存discover）or 記事
- **dicon通常（1,500円）** → 既存の乱視用記事に通常プランも併記、or コンタクト記事を1本に統合
- **DROBE / スマイルサイクル / Loop Laundry（各1,500円）** → 「買う/所有をやめて借りる・定額」C層記事
- 2,000円超（浄水・知育・airCloset・家電・カリトケ・AnotherADdress・DELIPICKS）は**推し採用前に proposal-stress-test**。

---
*収集日 2026-06-06。媒体トークン 4B3XB5 の確認を毎回行うこと（オンスクで別媒体4B1DXMを検知）。*
