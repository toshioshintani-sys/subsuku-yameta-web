// 地の文（ALTERNATIVES.reason / EXTENDED_CONTENT.summary）に書かれた金額が、
// そのサービスの PRICING と食い違っていないかを機械で検査する。
//
// なぜ要るか（2026-08-19）：
//   価格は3か所にある。PRICING / PLANS / 地の文。
//   check-consistency.mjs は PRICE_HISTORY と表示価格しか見ておらず、**地の文は無防備**だった。
//   その結果、ABEMAプレミアムが4/1に1,080円→1,180円へ改定され PRICING は更新されたのに、
//   他サービスの ALTERNATIVES の地の文8箇所が旧価格のまま残り、8ページで誤報になっていた。
//   同時に Disney+（2世代前の990円）と ChatGPT Plus / Claude Pro（古い為替を焼き込んだ文）も
//   同じ理由で古いままだった。人が読んで気づくのを待つ設計では、また同じことが起きる。
//
// 判定できないもの：
//   複数プランがあるサービスは、代表価格でない別プラン（年額・上位版・広告つき等）を
//   地の文で語っていることがあり、それは正しい。機械にその区別はつかないので、
//   **一度人が確認したものを KNOWN_OK に理由つきで登録する**方式にした。
//   登録されていない食い違いが出たら止める＝新しく古くなった金額は必ず人の目に触れる。
import { ALTERNATIVES, PRICING, EXTENDED_CONTENT, SERVICES } from '../../src/data/services.js';

// 「このサービスの地の文にこの金額が出るのは正しい」と人が確認済みのもの。
// 新しいプランを地の文に書いたら、ここに理由を添えて足すこと。
const KNOWN_OK = {
  netflix: { 1590: 'スタンダード', 2290: 'プレミアム（代表は広告つき890円）' },
  'amazon-prime': { 5900: '年額（月額は600円）' },
  'adobe-cc': { 3280: '単一アプリプラン', 9080: 'Creative Cloud Pro（代表はStandard 6,480円）' },
  'microsoft-365': { 21300: '年額（月額は2,130円）' },
  'abema-premium': { 680: '広告つきABEMAプレミアム（代表は1,180円）' },
  dazn: { 3200: '年契約の月額換算（月々払いは4,200円）' },
};

const nameOf = (id) => SERVICES.find((s) => s.id === id)?.name ?? id;
const YEN = /([0-9][0-9,]{2,})\s*円/g;
const found = [];

const scan = (where, target, text) => {
  const official = PRICING[target];
  if (official == null) return;
  for (const m of String(text ?? '').matchAll(YEN)) {
    const v = Number(m[1].replace(/,/g, ''));
    if (v === official || v <= 99) continue;
    if (KNOWN_OK[target]?.[v]) continue;
    found.push({ where, target, prose: v, pricing: official, text: String(text) });
  }
};

for (const [host, list] of Object.entries(ALTERNATIVES)) {
  for (const alt of list) {
    const target = alt.serviceId || alt.id;
    if (target) scan(`ALTERNATIVES.${host}`, target, alt.reason);
  }
}
for (const [id, ext] of Object.entries(EXTENDED_CONTENT)) {
  scan(`EXTENDED_CONTENT.${id}.summary`, id, ext.summary);
}

console.log('===== 地の文の金額 vs PRICING =====');
if (found.length === 0) {
  console.log('✅ 地の文に、表示価格と食い違う金額はありません。\n');
  process.exit(0);
}

console.log(`❌ ${found.length}件、地の文の金額が表示価格と違います。\n`);
for (const h of found) {
  console.log(`【${nameOf(h.target)}】(${h.target})  地の文 ¥${h.prose.toLocaleString()} / 表示 ¥${h.pricing.toLocaleString()}`);
  console.log(`   ${h.where}`);
  console.log(`   「${h.text.slice(0, 76)}」`);
}
console.log('\n公式で確かめたうえで、');
console.log('  ・地の文が古い  → 地の文を直す');
console.log('  ・別プランの正しい金額 → このファイルの KNOWN_OK に理由つきで登録する');
process.exit(1);
