// 「ひとこと」ページの正本（2026-10-17）。Threads に出す一言（neta）と、笑ったあとの回収（insight→body→next）を1か所で持つ。
// 4段：ネタ → 示唆 → 本体 → 次の一手。橋が一言で架からないネタはここに載せず、Threads だけに出す。
// 守ること：企業名・サービス名・実在の人・金額の数字を書かない。両論併記。煽らない。docs/THREADS_NETA_BOOK_2026-10.md 参照。
export const HITOKOTO = [
  // 笑えると判定されたネタだけをここに置く（下書きは docs/hitokoto-drafts.md）。空のあいだはフッター・サイトマップに出さない。
];

export const getHitokoto = (id) => HITOKOTO.find((h) => h.id === id);
