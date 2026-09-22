#!/usr/bin/env bash
# Netlify のビルド前判定（netlify.toml の [build].ignore から呼ばれる）
#
#   exit 0 → ビルドをスキップ（デプロイなし・クレジット消費なし）
#   exit 1 → ビルドする
#
# なぜ要るか（2026-08-26）：
#   Netlify Pro のクレジット消費は 99% が本番デプロイ回数（1回≒15）で、
#   2026-08-22 に 199回で 3,000/月 を使い切りサイトが公開停止になった。
#   一方、毎朝の価格判定は「全件偽陽性」の日も台帳(state/)だけを main に push し、
#   docs や lessons の push も日常的にある。実測では直近30 push のうち16回が
#   表示の変わらない無駄なデプロイ（≒240クレジット）だった。
#   push の習慣を変えるのではなく、機械にビルド要否を判定させる。
#
# 判定：前回ビルドとの差分が「サイトの出力に影響しないファイル」だけなら exit 0。
#   スキップ対象は最小限のホワイトリストにする。迷ったらビルドする側に倒す
#   （ビルドし過ぎはクレジットの無駄だが、ビルドし損ねは誤報の公開継続になる）。
#
# 注意：
#   - CACHED_COMMIT_REF が無い（初回・キャッシュ破棄後）や diff が取れない
#     （shallow clone で古い ref に届かない）場合は必ずビルドする。
#   - スキップが続くと CACHED_COMMIT_REF は最後にビルドした位置に留まるので、
#     次の本ビルドは溜まった差分をまとめて拾う（取りこぼしなし）。
set -u

if [ -z "${CACHED_COMMIT_REF:-}" ] || [ -z "${COMMIT_REF:-}" ]; then
  echo "[ignore] CACHED_COMMIT_REF/COMMIT_REF が無い → ビルドする"
  exit 1
fi

# 🛑 致命的だった罠（2026-09-22 発覚・17日間本番が凍結）：
#   Netlify公式ドキュメント「ビルドキャッシュが無い状態で走ると、
#   CACHED_COMMIT_REF は COMMIT_REF と同じ値になる」。
#   このスクリプトがexit 0(スキップ)を返す設計のせいで、スキップした回は
#   ビルドキャッシュが更新されない。一度キャッシュが失効すると、次の実行が
#   「CACHED_COMMIT_REF=COMMIT_REF(自分自身)」を受け取り→diffが常に空→
#   必ずスキップ→キャッシュは永久に更新されない、という自己成就する無限ループに陥る。
#   実際 2026-09-05 01:02 のスキップを境に、9/22まで17日間・全コミットが
#   本番に反映されなかった（services.js の変更を含む致命的な回も含む）。
#   このガード1つで、上のような「同じ値なら診断不能→ビルドする」に倒す。
if [ "$CACHED_COMMIT_REF" = "$COMMIT_REF" ]; then
  echo "[ignore] CACHED_COMMIT_REF=COMMIT_REF（ビルドキャッシュ無し・診断不能）→ ビルドする"
  exit 1
fi

changed=$(git diff --name-only "$CACHED_COMMIT_REF" "$COMMIT_REF" 2>/dev/null) || {
  echo "[ignore] git diff 失敗（shallow clone 等） → ビルドする"
  exit 1
}

if [ -z "$changed" ]; then
  echo "[ignore] 差分なし → スキップ"
  exit 0
fi

# サイトの出力に影響しないと確認済みのパスだけを列挙（ホワイトリスト）。
#   docs/                          … ドキュメント
#   scripts/price-watch/state|logs … 価格監視の台帳・ログ（毎朝の判定が push する）
#   scripts/price-watch/watch-list.json … 巡回の取得プロファイル
#   *.md                           … src からの参照はコメントのみと確認済み（2026-08-26）
#   .gitignore
SAFE='^(docs/|scripts/price-watch/(state|logs)/|scripts/price-watch/watch-list\.json$|.*\.md$|\.gitignore$)'

if echo "$changed" | grep -qvE "$SAFE"; then
  echo "[ignore] ビルドに影響しうる変更あり → ビルドする"
  echo "$changed" | grep -vE "$SAFE" | head -10 | sed 's/^/[ignore]   /'
  exit 1
fi

echo "[ignore] 台帳・docs・md のみの変更（$(echo "$changed" | wc -l) files） → スキップ"
exit 0
