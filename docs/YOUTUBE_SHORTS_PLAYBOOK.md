# YouTube Shorts プレイブック（解約手順・誠実トーン）— v1

> 作成 2026-06-27。俊雄さん決定（AskUserQuestion）：初手チャネル＝**YouTube Shorts／コンテンツ＝解約手順**。
> 生成は外部AI（Gemini等）に投げてよい（私の動画生成が苦手な分を補う）。私は「投げれば動画になる完全キット＋正確な台本」を量産する。
> 位置づけ＝GROWTH_STRATEGY_2026 §E6（YouTube/Shortsは恒久・検索ベース・新規アカに比較的優しい）。

---

## 0. なぜ YouTube Shorts × 解約手順か（需要マッチ）
- 解約＝**検索インテント**（「〇〇 解約方法」と能動的に探す）。YouTubeは第二の検索エンジン＝**検索でevergreenに刺さる**。Pinterest/TikTok（discovery）と違い需要とズレない。
- 解約手順の短尺は**恒久ストック**（一度作れば検索で回り続ける）＋**サイト送客**の二刀流。
- ToSリスクが低い（YouTubeはData API uploadが正規。TikTok自動投稿の凍結リスクを避けた初手）。

## 1. 不可侵・トーン（CLAUDE.md）
- **誠実トーン固定**。どら猫＝毒舌ボイスは **Threads告知限定**（`docs/kokuchi-plan.md` §広報運用ルール）。**恒久メディア(YouTube)に毒を資産化しない**。淡々・実用・当事者視点。
- **手順は捏造しない**。台本は必ず `src/data/services.js` の `steps`／`note`／`cancelUrl` から引く（実価値＝社会性＝収益の源泉）。古くなったら直す。
- **両論併記**：各動画に「向かない人／注意点」を必ず1点（services.js の `note` を活用）。煽り・ランキング・★スコア禁止。
- **§4 不可逆出力ゲート**：投稿は対外公開。account/OAuthは俊雄さんの原子操作。自動化する場合はThreads 4コマ同型のローカル・スケジューラ＋kill-switch。

## 2. フォーマット仕様（毎回これ）
- 縦 9:16・**20〜35秒**・冒頭**1.5秒で結論フック**（「U-NEXTの解約リンク、わざと隠されてます」）。
- 構成：①フック（困りごと/落とし穴）→ ②手順を**オンスクリーン文字**で1ステップ1カット → ③注意点1つ（両論併記）→ ④CTA。
- 音：誠実な日本語ナレ（TTS可）。BGMは控えめ。字幕（オンスクリーン文字）は音無し視聴前提で必須。
- 右下に小さく「サブスクやめた」。

## 3. タイトル / 概要欄 / タグ テンプレ（UTM必須）
- **タイトル例**：`【最短】U-NEXTの解約方法｜隠れた解約リンクの場所`（"〇〇 解約方法/できない/最短" の検索語を先頭に）
- **概要欄テンプレ**：
  ```
  〇〇の解約を最短で終わらせる手順です。
  ▼ 全サブスクの解約手順・無料代替・乗り換え先はこちら（煽らず両論併記）
  https://sabusuku-yameta.com/service/<service-id>?utm_source=youtube&utm_medium=social&utm_campaign=shorts&utm_content=<service-id>

  ※手順は変更される場合があります。最新は公式をご確認ください。
  #サブスク #解約 #節約
  ```
- **タグ**：`サブスク, 解約, 解約方法, 〇〇 解約, 節約, 固定費`
- **計測**：GA4（プロパティ538470329）で `utm_source=youtube` を分離。`utm_content` 別にどのサービス動画が送客したか分かる。

## 4. 動画生成プロンプト（Gemini/動画AI向け・コピペ）
> 方式A（推奨・確実）＝**ステップ文字＋ナレのスライド型**。方式B＝生成クリップ型（Veo等）。まずAで品質を担保。

**方式A：スライド型（Gemini/編集AIに渡す指示）**
```
縦9:16・約30秒の解説ショート動画を作って。日本語。トーンは誠実・淡々・親切（煽らない）。
構成：
[0.0-2.0s] フック全画面テロップ：「<HOOK>」
[2.0-Xs] 手順を1ステップ1カット・大きな白文字テロップ＋簡単なアイコン：
  STEP1「<step1>」/ STEP2「<step2>」/ STEP3「<step3>」
[終盤] 注意テロップ：「⚠ <note>」
[最後2s] CTA：「全サブスクの解約手順 → サブスクやめた」＋小さくURLは出さない（概要欄誘導）
ナレーションはテロップと同内容を読み上げ。BGMは控えめ。右下に小さく「サブスクやめた」。
実在のロゴ・著作物は使わない（一般的なUIの簡易図解で表現）。
```

## 5. 第1バッチ台本（実データ・そのまま方式Aに差し込み）

### ① Amazon プライム（difficulty: medium・ダークパターン注意）
- HOOK：`Amazonプライム、"継続する"の大きなボタンに惑わされないで`
- STEP1：`アカウント＆リスト →「プライム会員情報」`
- STEP2：`「プライム会員資格を終了する」をタップ`
- STEP3：`「特典を終了する」→「特典を終了する」で確定`
- ⚠note：`「継続する」が目立つ作り。解約は小さいリンクを探す`
- CTA URL：`https://sabusuku-yameta.com/service/amazon-prime?utm_source=youtube&utm_medium=social&utm_campaign=shorts&utm_content=amazon-prime`
- タイトル：`【惑わされない】Amazonプライムの解約方法｜"継続する"の罠`

### ② U-NEXT（difficulty: hard・解約リンクが激ムズ）
- HOOK：`U-NEXTの解約リンク、わざとページ最下部に隠されてます`
- STEP1：`マイメニュー →「契約内容の確認・変更」`
- STEP2：`「解約はこちら」（ページ下部の小さいリンク）`
- STEP3：`理由を選択 →「解約する」`
- ⚠note：`解約リンクがとても見つかりにくい。ページ最下部を探して`
- CTA URL：`https://sabusuku-yameta.com/service/u-next?utm_source=youtube&utm_medium=social&utm_campaign=shorts&utm_content=u-next`
- タイトル：`【最短】U-NEXTの解約方法｜隠れた解約リンクの場所`
- ※id は services.js で確認済み（`u-next`）。CTA URLはそのまま使用可。

### ③ Spotify（difficulty: easy・アプリから解約できない落とし穴）
- HOOK：`Spotify、アプリからは解約できません。理由はこれ`
- STEP1：`ブラウザで account の subscription ページを開く（アプリ不可）`
- STEP2：`「プランを変更する」→「Premiumをキャンセルする」`
- STEP3：`手順に沿って完了`
- ⚠note：`アプリ内課金だとアプリから解約不可。必ずブラウザで`
- CTA URL：`https://sabusuku-yameta.com/service/spotify?utm_source=youtube&utm_medium=social&utm_campaign=shorts&utm_content=spotify`
- タイトル：`【なぜ？】Spotifyがアプリで解約できない理由と最短手順`

## 6. ワークフロー（手間の分担）
1. **私**：services.js から台本＋概要欄＋タグ＋方式Aプロンプトを生成（このプレイブックの形で量産）。
2. **生成**：俊雄さん or 私が Gemini/動画AIに方式Aプロンプトを投げて動画化（外部AI可）。
3. **投稿（原子操作）**：YouTubeアカウント（@subsukuyameta 開設済）へアップ。OAuth/account操作は俊雄さん。
4. **計測**：投稿1〜2週後、GA4で `utm_source=youtube` / `utm_content` 別の送客を確認。

## 7. 段階導入・撤退ライン（いきなり全自動にしない）
- **まず手動投稿で3〜5本**（第1バッチ）→ 再生・サイト送客(UTM)・維持率を見る。
- 勝ち筋が出たら、**YouTubeだけ**ローカル・スケジューラで半自動化（Threads 4コマ同型＋kill-switch）。Data API uploadは正規だが、品質ゲート（誠実トーン・手順正確性）を人間が崩さない範囲で。
- **撤退/見直し**：3〜5本で送客ゼロ＆視聴維持が低い → タイトルの検索語/フックを見直す。改善なければ note名義転載・SEO・AI引用の本命へ資源を戻す。
- **TikTokは第二段**（あるある/節約＝どら猫ボイス流用可・discovery前提）。本プレイブックで勝ち筋を掴んでから判断。

---
*正データ＝`src/data/services.js`（steps/note/cancelUrl）。トーン規律＝`docs/kokuchi-plan.md`（どら猫はThreads限定）。戦略上位＝`docs/GROWTH_STRATEGY_2026.md` §E6。*
