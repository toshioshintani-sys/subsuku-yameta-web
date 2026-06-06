# save-4koma.ps1
# Downloads にある最新の Gemini 生成4コマ画像を docs/threads-4koma/ に
# 「dora_NoXX_バイアス_テーマ.png」の名前でリネーム保存する。
#
# 使い方（プロジェクト直下で実行）:
#   pwsh ./scripts/save-4koma.ps1 -No 11 -Bias アンカリング -Theme 値上げスルー
#
#   -No    : 連番（重複は弾く）
#   -Bias  : 行動経済学バイアス名（例: フレーミング）
#   -Theme : 4コマのテーマ（例: 1日33円）
#   -Copy  : 付けると元ファイルを Downloads に残す（既定は移動）
#   -Downloads : 既定 %USERPROFILE%\Downloads。別場所なら指定
#
# 仕組み: Downloads の Gemini_Generated_Image_*.png のうち最終更新が
#         いちばん新しい1枚＝「たった今ダウンロードした4コマ」を拾う。

param(
  [Parameter(Mandatory)][int]$No,
  [Parameter(Mandatory)][string]$Bias,
  [Parameter(Mandatory)][string]$Theme,
  [string]$Downloads = "$env:USERPROFILE\Downloads",
  [switch]$Copy
)

$ErrorActionPreference = 'Stop'

$dst = (New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "..\docs\threads-4koma")).FullName

$img = Get-ChildItem $Downloads -Filter "Gemini_Generated_Image_*.png" -ErrorAction SilentlyContinue |
       Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $img) {
  Write-Error "Downloads に Gemini_Generated_Image_*.png が見つかりません: $Downloads"
  return
}

$name = "dora_No{0:D2}_{1}_{2}.png" -f $No, $Bias, $Theme
$out  = Join-Path $dst $name
if (Test-Path $out) {
  Write-Error "既に存在します（No番号の重複かも）: $name"
  return
}

if ($Copy) { Copy-Item $img.FullName $out } else { Move-Item $img.FullName $out }
$verb = if ($Copy) { "copied" } else { "moved" }
Write-Host "OK $verb : $($img.Name)  ->  docs/threads-4koma/$name" -ForegroundColor Green
