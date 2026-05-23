# Stress Test Protocol（GitHub Actions / CI 用・インライン版）

> このファイルは GitHub Actions や CI/CD 上で動く Claude（または人間レビュー）に対して、
> 「重要な意思決定の前に4ステップ検証を行う」プロトコルを伝えるための独立ドキュメント。
>
> ローカル Claude Code の `~/.claude/skills/proposal-stress-test/SKILL.md` と同じ思想を、
> リモート環境でも参照できる形でリポジトリ内に保存している。
>
> 共有元：`~/.claude/CLAUDE.md`（ユーザーレベル憲法）

---

## いつ発火するか

このリポジトリの GitHub Actions / CI / リモート実行環境で動く Claude は、以下のいずれかに当てはまる作業を行う前に、必ず4ステップ検証を内部で実行すること：

### A. 永続的な影響を与える変更
- 設計憲法・運用ルール・命名規約の策定/変更
- リポジトリ直下の `CLAUDE.md` 構造変更
- `docs/AFFILIATE_DESIGN_PRINCIPLES.md`（BAE 設計憲法）の改訂
- 価格戦略・収益モデルの変更
- ブランド原則の改訂

### B. 規模が大きい実装
- 5ファイル以上の同時変更
- 50行以上の構造的データ変更（services.js 全件など）
- ServicePage / HomePage / DiscoverPage の大規模リファクタ
- デザインシステム全面刷新

### C. 新規依存導入
- 新しい外部ライブラリ（特に CSS / モーション / 状態管理）
- 新規 ASP（アフィリエイトサービス）の追加 / 既存停止
- Service Worker / PWA 構成の変更

### D. 長時間自動実行
- 5h 以上のジョブを連続実行する workflow
- 大量の API 呼び出しを伴うバッチ処理

---

## 発火しないでよい場合

- 単発のコード修正・タイポ修正
- 既にIssue/PR で詳細レビューを経て承認された作業
- 情報取得・調査・read 操作のみ
- ルーチンの IndexNow / sitemap 更新 / 自動デプロイ

---

## 4ステップ検証（インライン版）

```
Step 1：答え
  自分の最良の答えを 1-2行で明確に出す（曖昧な表現禁止）
  理由を箇条書きで 3-5 個

Step 2：否定
  その答えへの反論を 5-7 個リストアップ
  自分が一番厳しい批評家のつもりで
  「長すぎる」「理論先行」「過剰」「縛りすぎ」など実質的な否定を出す

Step 3：つぶす
  それぞれの反論を表形式で検証
  | # | 否定 | 検証 | 結論 |
  「データ・実装容易性・既存事実」を根拠にする
  ✅ つぶせる / ❌ つぶせない を明示

Step 4：結論
  全部つぶせた → 答えを確定し「問題なし」と報告
  つぶせなかった否定が残った → 答えを修正して Step 1 から再実行（最大3周）
  3周しても確定しない → 人間（俊雄さん）の判断を仰ぐ
```

---

## アンチパターン

- ❌ 「全部正しい」と結論する（必ず1個は否定が成立するはず）
- ❌ 反論が形式的すぎる（「もっと考えるべき」など内容のない否定）
- ❌ 反論を立てずに「問題ありません」と結論する
- ❌ Step 3 で曖昧な反証（「たぶん大丈夫」など）

---

## このプロトコルの目的

**Claude の暴走防止 + 過剰なオーバーエンジニアリングの予防**

ユーザー（俊雄さん）は本業がサラリーマンで時間制約が厳しいため、Claude が独断で大規模な変更を加えると後戻りコストが大きい。
事前の4ステップ検証で「こじらせ」を予防し、判断ブレを最小化する。

---

## 使い方（workflow / script 内で Claude API を呼ぶ場合）

Python / JavaScript などで Anthropic API を呼ぶ際、system prompt の冒頭にこのファイルの内容を含めること：

```python
import pathlib
PROTOCOL = pathlib.Path('.github/STRESS_TEST_PROTOCOL.md').read_text(encoding='utf-8')

system_prompt = f"""
{PROTOCOL}

---

[Your actual task instructions here]
"""
```

これにより、CI 上で動く Claude も同じ思想で意思決定を検証する。

---

## 関連ファイル

- ユーザーレベル憲法：`~/.claude/CLAUDE.md`（ローカル）
- skill 本体：`~/.claude/skills/proposal-stress-test/SKILL.md`（ローカル）
- プロジェクト憲法：このリポジトリの `CLAUDE.md`
- 設計憲法：`docs/AFFILIATE_DESIGN_PRINCIPLES.md`

---

*作成日：2026-05-23*
*由来：proposal-stress-test 4階層配備（ローカル3層 + リモート1層 = 4層）*
