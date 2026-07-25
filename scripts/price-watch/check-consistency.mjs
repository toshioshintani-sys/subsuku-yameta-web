#!/usr/bin/env node
/**
 * check-consistency.mjs — 「値上げと書いたのに表示価格が古いまま」を機械で弾く（2026-07-25 追加）
 *
 * ■ 何を防ぐのか
 *   2026-07-25、PRICE_HISTORY に Apple 3社の値上げを書いたのに、
 *   PLANS / PRICING の表示価格を直し忘れた。この状態でトップページの「最近の変更」を出すと、
 *   サイトは「値上げしました」と宣言しながら**古い金額を表示する**。
 *   誤報ゼロ原則（＝社会性が収益の唯一の必要条件）に真正面から反する、最悪の状態。
 *
 *   人間の注意力に頼る限り必ず再発するので、機械で落とす。
 *
 * ■ 判定ロジック
 *   PRICE_HISTORY[].change の本文から「A円→B円」形式の**変更後の値 B** を全部拾い、
 *   その B が PLANS[serviceId].plans[].monthly / .yearly / PRICING[serviceId] の
 *   どれかに存在するかを確認する。1つも無ければ NG。
 *
 *   例）change: "個人 1,080円→1,180円、学生 580円→680円"
 *       → 変更後の値 {1180, 680} が PLANS['apple-music'] に在るか確認する。
 *
 * ■ 意図的に「ゆるい」判定にしている理由
 *   history の本文には、うちが表示していないプラン（提供終了・日本未提供・法人プラン等）が
 *   出てくることがある。全値の完全一致を要求すると運用が回らないので、
 *   「**変更後の値が1つも表示に反映されていない**」＝明らかな直し忘れ、だけを NG にする。
 *   厳しくしすぎて無視されるlinterは、無いのと同じ。
 *
 * 使い方:
 *   node scripts/price-watch/check-consistency.mjs        # NG があれば exit 1
 *   node scripts/price-watch/check-consistency.mjs --warn  # 常に exit 0（様子見用）
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');

// 「1,080円→1,180円」「150円 → 180円」「1,080→1,180円」を拾う（→ の直後の値＝変更後）
const ARROW_PAIR = /(\d[\d,]*)\s*円?\s*(?:→|->|＝>)\s*(\d[\d,]*)\s*円/g;

const num = (s) => Number(String(s).replace(/,/g, ''));

function displayedValues(id, { PRICING, PLANS }) {
  const set = new Set();
  if (typeof PRICING[id] === 'number') set.add(PRICING[id]);
  const entry = PLANS[id];
  if (entry && Array.isArray(entry.plans)) {
    for (const p of entry.plans) {
      if (typeof p.monthly === 'number') set.add(p.monthly);
      if (typeof p.yearly === 'number') set.add(p.yearly);
    }
  }
  return set;
}

const svc = await import(pathToFileURL(resolve(ROOT, 'src/data/services.js')).href);
const { PRICE_HISTORY, PRICING, PLANS, SERVICES } = svc;
const nameById = new Map(SERVICES.map((s) => [s.id, s.name]));

const problems = [];
const checked = [];

for (const [id, entries] of Object.entries(PRICE_HISTORY || {})) {
  if (!Array.isArray(entries)) continue;
  const shown = displayedValues(id, { PRICING, PLANS });

  for (const h of entries) {
    const text = String(h?.change || '');
    const after = [];
    for (const m of text.matchAll(ARROW_PAIR)) after.push(num(m[2]));
    if (after.length === 0) continue; // 「A円→B円」形式が無い履歴（体系変更の説明文等）は対象外

    const hit = after.filter((v) => shown.has(v));
    const row = {
      id,
      name: nameById.get(id) || id,
      date: h.date,
      item: h.item || '',
      after,
      hit,
      shown: [...shown].sort((a, b) => a - b),
    };
    checked.push(row);
    if (hit.length === 0) problems.push(row);
  }
}

console.log('===== PRICE_HISTORY と表示価格の整合チェック =====');
console.log(`「A円→B円」を含む履歴 ${checked.length}件を検査\n`);

for (const p of problems) {
  console.log(`❌ ${p.name} (${p.id}) ${p.date} ${p.item}`);
  console.log(`   履歴が言う変更後の価格: ${p.after.join(', ')}円`);
  console.log(`   実際にサイトが表示している価格: ${p.shown.join(', ')}円`);
  console.log(`   → PLANS / PRICING を新価格に更新してください（履歴だけ直しても表示は変わりません）\n`);
}

if (problems.length === 0) {
  console.log('✅ 直し忘れなし。履歴が言う新価格は、すべて表示価格に反映されています。');
} else {
  console.log(`❌ ${problems.length}件、履歴と表示がズレています。`);
}

if (problems.length > 0 && !process.argv.includes('--warn')) process.exit(1);
