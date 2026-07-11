// 解約手順Short を spec から完全プログラム合成（生成AI不使用＝品質安定・コストゼロ・ToS安全）。
//
// 方式：各カード（フック/STEP/注意/CTA）をSVGで描画 → sharpでPNG化 → ffmpegでクリップ化＋concat
//       → 無音AAC付与で 1080x1920 mp4。日本語は IPAGothic（環境にインストール済）でlibrsvgが描画。
//
// 使い方:
//   node render-short.mjs <spec.json> [out.mp4]
//   node render-short.mjs --sample            # 内蔵サンプル(Amazonプライム)で1本出す＝検証用
//
// spec 形:
//   { id, name, hook, steps:[...], note, brand }
import { mkdtempSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const sharp = require('sharp');

const W = 1080, H = 1920, FPS = 30;
// ブランド色（HomePageの濃紺基調に合わせる・第一印象の不可侵に寄せる）
const BG = '#0d1b3e', BG2 = '#13245a', INK = '#ffffff', SUB = '#aab4d4', ACCENT = '#4ea1ff', WARN = '#ffd166';
const FONT = 'IPAGothic';

// --- 文字を行に折る（SVGは自動改行しないので手動）。日本語は概ね等幅。---
function wrap(text, perLine) {
  const out = [];
  let line = '';
  for (const ch of String(text)) {
    if (ch === '\n') { out.push(line); line = ''; continue; }
    line += ch;
    if ([...line].length >= perLine) { out.push(line); line = ''; }
  }
  if (line) out.push(line);
  return out;
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- 1枚のカードSVG ---
function cardSvg({ label, labelColor = ACCENT, title, titleSize = 76, perLine = 13, footer = 'サブスクやめた' }) {
  const lines = wrap(title, perLine);
  const lineH = titleSize * 1.45;
  const blockH = lines.length * lineH;
  const startY = H / 2 - blockH / 2 + titleSize;
  const tspans = lines
    .map((l, i) => `<tspan x="${W / 2}" y="${startY + i * lineH}">${esc(l)}</tspan>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${BG}"/><stop offset="1" stop-color="${BG2}"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="60" y="190" width="${W - 120}" height="8" rx="4" fill="${labelColor}" opacity="0.9"/>
  ${label ? `<text x="${W / 2}" y="300" font-family="${FONT}" font-size="56" font-weight="bold" fill="${labelColor}" text-anchor="middle">${esc(label)}</text>` : ''}
  <text font-family="${FONT}" font-size="${titleSize}" font-weight="bold" fill="${INK}" text-anchor="middle">${tspans}</text>
  <text x="${W / 2}" y="${H - 90}" font-family="${FONT}" font-size="40" fill="${SUB}" text-anchor="middle">${esc(footer)}</text>
</svg>`;
}

// --- spec → カード配列（フック/STEP×n/注意/CTA）---
function cardsFromSpec(spec) {
  const cards = [];
  cards.push({ svg: cardSvg({ label: '解約のはなし', title: spec.hook, titleSize: 72, perLine: 12 }), dur: 2.6 });
  spec.steps.forEach((s, i) =>
    cards.push({ svg: cardSvg({ label: `STEP ${i + 1}`, title: s, titleSize: 66, perLine: 13 }), dur: 3.0 }),
  );
  if (spec.note) cards.push({ svg: cardSvg({ label: '⚠ 注意', labelColor: WARN, title: spec.note, titleSize: 60, perLine: 14 }), dur: 3.0 });
  cards.push({ svg: cardSvg({ label: '', title: '全サブスクの解約手順は\n「サブスクやめた」へ', titleSize: 70, perLine: 12, footer: 'sabusuku-yameta.com' }), dur: 2.6 });
  return cards;
}

function ff(args) {
  const r = spawnSync(ffmpegPath, args, { encoding: 'utf-8' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}\n${r.stderr?.slice(-800)}`);
}

export async function renderShort(spec, outPath) {
  const dir = mkdtempSync(join(tmpdir(), 'short-'));
  try {
    const cards = cardsFromSpec(spec);
    const clips = [];
    for (let i = 0; i < cards.length; i++) {
      const png = join(dir, `c${i}.png`);
      await sharp(Buffer.from(cards[i].svg)).png().toFile(png);
      const clip = join(dir, `c${i}.mp4`);
      const fadeOut = Math.max(0, cards[i].dur - 0.4).toFixed(2);
      ff(['-y', '-loop', '1', '-t', String(cards[i].dur), '-i', png,
        '-vf', `scale=${W}:${H},fade=t=in:st=0:d=0.3,fade=t=out:st=${fadeOut}:d=0.4,format=yuv420p`,
        '-r', String(FPS), '-an', clip]);
      clips.push(clip);
    }
    const listFile = join(dir, 'list.txt');
    writeFileSync(listFile, clips.map((c) => `file '${c}'`).join('\n'));
    const vOnly = join(dir, 'v.mp4');
    ff(['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', vOnly]);
    // 無音AACを付与（YouTube投稿の安定のため）
    ff(['-y', '-i', vOnly, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
      '-c:v', 'copy', '-c:a', 'aac', '-shortest', resolve(outPath)]);
    return resolve(outPath);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const SAMPLE = {
  id: 'amazon-prime', name: 'Amazon プライム',
  hook: 'Amazonプライム、“継続する”の大きなボタンに惑わされないで',
  steps: ['アカウント＆リスト →「プライム会員情報」', '「プライム会員資格を終了する」をタップ', '「特典を終了する」→「特典を終了する」で確定'],
  note: '「継続する」が目立つ作り。解約は小さいリンクを探す',
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2];
  const out = process.argv[4] || process.argv[3] || 'sample-short.mp4';
  const spec = !arg || arg === '--sample' ? SAMPLE
    : JSON.parse(readFileSync(resolve(arg), 'utf-8'));
  const outPath = arg && arg !== '--sample' ? (process.argv[3] || `${spec.id || 'short'}.mp4`) : out;
  console.log(`rendering ${spec.id || 'short'} → ${outPath} ...`);
  renderShort(spec, outPath).then((p) => console.log('OK:', p)).catch((e) => { console.error(e.message); process.exit(1); });
}
