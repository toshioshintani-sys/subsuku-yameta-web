// ライフオラクルnote → サブスクやめた クロス送客フッターの「単一の正」（参照実装）。
//
// 仕様・判断軸 = docs/syndication/LIFEORACLE_NOTE_CROSS_PROMO.md。
// 実行者 = Claude（note API投稿フローが本文(free_body)末尾へ差し込む）。俊雄さんの手作業ではない。
//
// 結線（別プロジェクト = ライフオラクル側 Claude_work・本repoスコープ外）の最小形：
//   import { crossPromoFooterMarkdown, pickTheme } from './cross-promo-footer.mjs';
//   const md = articleMarkdown + '\n\n' + crossPromoFooterMarkdown(pickTheme(article));
//   // 既存の markdownToNoteHtml(md) に通すだけ（<hr>＋段落＋アンカーに変換される）。
//
// CLAUDE.md §9（別ブランド）・§2-2（当事者視点・煽らない）・§1（社会性＞一回の送客）に従う。
// 位置は記事「最下段」（本文末尾・関連リンクの後）。冒頭広告は信頼を削るので不可。

// UTM は サブスクやめた名義note転載（utm_source=note）とは別ソースにして GA4 で分離計測する。
export const CROSS_PROMO_URL =
  'https://sabusuku-yameta.com/?utm_source=note-lifeoracle&utm_medium=referral&utm_campaign=cross-promo';

// テーマ別の一言（A=汎用 / B=お金・固定費・見直し系 / C=最小・無関係記事用）。
// 文言は LIFEORACLE_NOTE_CROSS_PROMO.md と一字一句そろえる（doc が正・ここが実装）。
export const FOOTER_BODY = {
  A: `（おまけ）月額のサブスク、"なんとなく続けてる"ものはありませんか。解約・乗り換え・買い切り・お試しの「次の動き」を、煽らず・両論併記でまとめた別サイトを運営しています。合わなければ、いつでも解約導線に戻ってこれます。\n→ [サブスクやめた](${CROSS_PROMO_URL})`,
  B: `（おまけ）暮らしを軽くする話のついでに——固定費でいちばん削りやすいのが、使っていないサブスクです。解約手順・無料代替・乗り換え先を、ランキングや★スコアを使わずに淡々とまとめています。\n→ [サブスクやめた](${CROSS_PROMO_URL})`,
  C: `別運営：サブスクの解約・乗り換え・買い切りをまとめた [サブスクやめた](${CROSS_PROMO_URL})。`,
};

// B（お金・固定費・見直し系）を選ぶためのテーマ語。
const MONEY_THEME = ['お金', '固定費', '節約', '家計', '見直し', '手放す', 'ミニマル', '貯金', '支出', '断捨離'];
// C（明確に無関係 = 控えめ版）を選ぶためのテーマ語。
const UNRELATED_THEME = ['占い', 'スピリチュアル', 'タロット', '星座', '運勢', '前世', 'ヒーリング'];

// 記事の {title, tags} からテーマ('A'|'B'|'C')を判定する。
// tags は配列・カンマ区切り文字列どちらでも可。判定不能なら 'A'（汎用）。
export function pickTheme(article = {}) {
  const tags = Array.isArray(article.tags)
    ? article.tags.join(' ')
    : String(article.tags || '');
  const hay = `${article.title || ''} ${tags}`;
  if (UNRELATED_THEME.some((w) => hay.includes(w))) return 'C';
  if (MONEY_THEME.some((w) => hay.includes(w))) return 'B';
  return 'A';
}

// 最下段ブロックを markdown で返す（先頭に区切り <hr> 用の `---`）。
export function crossPromoFooterMarkdown(theme = 'A') {
  const body = FOOTER_BODY[theme] || FOOTER_BODY.A;
  return `---\n\n${body}`;
}

// 直接実行 = 自己テスト（出力確認）。`node scripts/note/cross-promo-footer.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const cases = [
    { title: 'Netflixを解約した話', tags: ['暮らし'] },
    { title: 'ボーナスで固定費の見直し', tags: ['お金', '節約'] },
    { title: '今月の運勢とタロット占い', tags: ['占い'] },
  ];
  for (const c of cases) {
    const t = pickTheme(c);
    console.log(`\n==== theme=${t}  «${c.title}» ====`);
    console.log(crossPromoFooterMarkdown(t));
  }
  // 不変条件の軽いassert（壊れたら投稿前に気づける）。
  const assert = (cond, msg) => { if (!cond) { console.error(`ASSERT FAIL: ${msg}`); process.exit(1); } };
  assert(pickTheme({ title: '家計の見直し' }) === 'B', 'money→B');
  assert(pickTheme({ title: '占いの話' }) === 'C', 'unrelated→C');
  assert(pickTheme({ title: 'ふつうの日記' }) === 'A', 'default→A');
  assert(crossPromoFooterMarkdown('A').startsWith('---'), 'starts with hr');
  assert(crossPromoFooterMarkdown('A').includes(CROSS_PROMO_URL), 'contains UTM url');
  console.log('\nOK: all asserts passed');
}
