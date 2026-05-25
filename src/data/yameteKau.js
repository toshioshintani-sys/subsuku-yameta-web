// 「やめて買う」— 解約後の浮いたお金で買える、生活が少し豊かになる買い切りグッズ
//
// BAE 設計憲法 v2.0 § 12「discover.js 標準構造」C層（買い切り）の実装
//
// 選定基準：
//   1. 価格帯 1,500〜3,000円（俊雄さん指定「ギリギリ無駄遣いにならない」）
//   2. カテゴリ：生活ハック系（Facebook広告で見かけるような便利グッズ）
//   3. 月額サブスク1〜2ヶ月分でカバー可能
//   4. 検索URLベース → 在庫切れリスク回避・読者が選択肢から選べる
//
// 構造：
//   - amazonQuery / rakutenQuery を持つ → affiliates.js の buildAmazonSearchUrl /
//     buildRakutenSearchUrl で自動的にアフィリエイトリンクに変換
//   - why: なぜこれが「ちょっと生活が楽になる」のか（BAE 推奨語のみ）
//   - warning: 合わない人・失敗パターン（BAE 両論併記）
//
// 禁則句チェック済み：おすすめ・ベスト・No.1・神・絶対 使用なし

export const YAMETE_KAU_CATEGORIES = [
  { id: 'kitchen', name: 'キッチン', emoji: '🍳' },
  { id: 'desk', name: 'デスク周り', emoji: '💻' },
  { id: 'storage', name: '収納・整理', emoji: '📦' },
  { id: 'mobile', name: 'モバイル・充電', emoji: '🔌' },
  { id: 'outdoor', name: '外出・お出かけ', emoji: '🎒' },
  { id: 'care', name: 'からだケア', emoji: '🪥' },
];

export const YAMETE_KAU_PRODUCTS = [
  // ─── キッチン ───
  {
    id: 'spice-bottles',
    name: 'スパイスボトルセット（統一感のある透明ボトル）',
    category: 'kitchen',
    priceHint: '1,500〜2,800円',
    why: '調味料の見た目が揃うと、毎日のキッチンに小さな心地よさが生まれる',
    warning: '中身の移し替え作業が面倒に感じる人もいる',
    amazonQuery: 'スパイスボトル セット 詰め替え 統一感',
    rakutenQuery: 'スパイスボトル セット 詰め替え',
  },
  {
    id: 'kitchen-shears',
    name: '多機能キッチンバサミ（分解して洗える）',
    category: 'kitchen',
    priceHint: '1,800〜2,500円',
    why: 'まな板を出さずに肉・野菜が切れる。後片付けが早い',
    warning: '刃が薄手のものは硬い食材に不向き',
    amazonQuery: 'キッチンバサミ 分解 洗える ステンレス',
    rakutenQuery: 'キッチンバサミ 分解 ステンレス',
  },
  {
    id: 'silicone-stretch-lid',
    name: 'シリコン伸縮フタ（食品ラップ代替）',
    category: 'kitchen',
    priceHint: '1,500〜2,200円',
    why: 'ラップ消費が減る。冷蔵庫内の食品保存がきれいになる',
    warning: '角ばった容器にはフィットしにくい',
    amazonQuery: 'シリコン 伸縮 蓋 ストレッチ 食品保存',
    rakutenQuery: 'シリコン 伸縮 蓋 食品',
  },
  {
    id: 'microwave-steamer',
    name: '電子レンジ蒸し器（折りたたみ式）',
    category: 'kitchen',
    priceHint: '1,800〜2,800円',
    why: '野菜を5分でホクホクに。蒸し料理のハードルが下がる',
    warning: '大きな食材は入らない・耐熱皿との相性確認が必要',
    amazonQuery: '電子レンジ 蒸し器 シリコン 折りたたみ',
    rakutenQuery: '電子レンジ 蒸し器 シリコン',
  },

  // ─── デスク周り ───
  {
    id: 'monitor-shelf',
    name: 'モニター上収納シェルフ',
    category: 'desk',
    priceHint: '2,000〜3,000円',
    why: 'デスク上のデッドスペースが棚になる。書類・小物を視界の端に置ける',
    warning: '画面サイズ・厚みの確認必須・耐荷重に注意',
    amazonQuery: 'モニター上 ラック 収納 デスク',
    rakutenQuery: 'モニター上 ラック 収納',
  },
  {
    id: 'cable-organizer-box',
    name: 'ケーブル整理ボックス（電源タップごと隠す）',
    category: 'desk',
    priceHint: '1,500〜2,500円',
    why: '足元のごちゃつきが見えなくなる。掃除機がけが楽になる',
    warning: '熱がこもりやすいので、放熱口の位置をチェック',
    amazonQuery: 'ケーブル ボックス 電源タップ 収納',
    rakutenQuery: 'ケーブル ボックス 電源タップ',
  },
  {
    id: 'laptop-stand-foldable',
    name: '折りたたみ式ノートPCスタンド',
    category: 'desk',
    priceHint: '1,800〜2,800円',
    why: '画面の高さが上がって首が楽になる。在宅勤務の疲労が変わる',
    warning: '15インチ以上の重いPCには安定性確認が必要',
    amazonQuery: 'ノートパソコン スタンド 折りたたみ アルミ',
    rakutenQuery: 'ノートパソコン スタンド 折りたたみ',
  },
  {
    id: 'desk-foot-rest',
    name: '足置き（フットレスト・低反発）',
    category: 'desk',
    priceHint: '1,800〜2,800円',
    why: '長時間座っていても膝・腰の負担が減る。地味だが効果は持続',
    warning: '床の素材によっては滑り止めが弱いと感じる場合あり',
    amazonQuery: 'フットレスト 低反発 デスク 足置き',
    rakutenQuery: 'フットレスト 低反発',
  },
  {
    id: 'silent-mouse',
    name: '静音マウス（ワイヤレス）',
    category: 'desk',
    priceHint: '1,500〜2,800円',
    why: 'カチカチ音が消えてオンライン会議の雑音が減る',
    warning: '電池式の場合は単4電池の予備管理が要る',
    amazonQuery: '静音 マウス ワイヤレス',
    rakutenQuery: '静音 マウス ワイヤレス',
  },

  // ─── 収納・整理 ───
  {
    id: 'packing-cubes',
    name: 'パッキングキューブ（旅行用圧縮ポーチ）',
    category: 'storage',
    priceHint: '1,500〜2,800円',
    why: 'スーツケースの中身がカテゴリ別に整理される。出張・旅行が楽になる',
    warning: '圧縮しすぎるとシワになりやすい服もある',
    amazonQuery: 'パッキングキューブ 圧縮 旅行 セット',
    rakutenQuery: 'パッキングキューブ 圧縮 旅行',
  },
  {
    id: 'fridge-organizer',
    name: '冷蔵庫整理トレー（取っ手付き）',
    category: 'storage',
    priceHint: '1,500〜2,500円',
    why: '奥の食材が取り出しやすくなる。賞味期限切れが減る',
    warning: '冷蔵庫の棚高さ・幅をメジャーで測ってから購入',
    amazonQuery: '冷蔵庫 収納 トレー 取っ手 引き出し',
    rakutenQuery: '冷蔵庫 収納 トレー',
  },
  {
    id: 'hanging-shoe-rack',
    name: 'クローゼット吊り下げ収納（ジャージ・ニット用）',
    category: 'storage',
    priceHint: '1,800〜2,800円',
    why: 'たたまない服でもグチャグチャにならない。たんすの中身が減る',
    warning: '突っ張り棒の耐荷重を超えないよう注意',
    amazonQuery: 'クローゼット 吊り下げ 収納 多段',
    rakutenQuery: 'クローゼット 吊り下げ 収納',
  },
  {
    id: 'magnetic-spice-rack',
    name: 'マグネット式調味料ラック（冷蔵庫横活用）',
    category: 'storage',
    priceHint: '1,800〜2,500円',
    why: 'デッドスペースが調味料置き場になる。シンク横がスッキリする',
    warning: '冷蔵庫がマグネット対応か事前確認',
    amazonQuery: 'マグネット ラック 冷蔵庫 横 調味料',
    rakutenQuery: 'マグネット ラック 冷蔵庫',
  },

  // ─── モバイル・充電 ───
  {
    id: 'usb-c-hub',
    name: 'USB-C ハブ（HDMI・USB-A・SD カード）',
    category: 'mobile',
    priceHint: '1,800〜2,800円',
    why: 'ポートが少ない MacBook・iPad で外部機器が一気に繋がる',
    warning: '電源供給に対応してないモデルは長時間使用で接続が不安定になる場合',
    amazonQuery: 'USB-C ハブ HDMI 4K SDカード',
    rakutenQuery: 'USB-C ハブ HDMI',
  },
  {
    id: 'magnetic-cable-organizer',
    name: 'マグネット式ケーブルホルダー（デスク貼付け）',
    category: 'mobile',
    priceHint: '1,500〜2,200円',
    why: '充電ケーブルがデスクから落ちなくなる。地味な毎日ストレスが消える',
    warning: '吸盤式と粘着式があり、デスク材質で選ぶ',
    amazonQuery: 'ケーブル ホルダー マグネット デスク',
    rakutenQuery: 'ケーブル ホルダー マグネット',
  },
  {
    id: 'portable-fan',
    name: 'モバイルファン（首掛け・ハンディ2WAY）',
    category: 'mobile',
    priceHint: '1,800〜2,800円',
    why: '夏の通勤・屋外作業で体感温度が下がる。USB充電で繰り返し使える',
    warning: 'バッテリー持ちは弱風で6〜8時間程度・予備バッテリーがあると安心',
    amazonQuery: 'ハンディファン 首掛け 充電式 静音',
    rakutenQuery: 'ハンディファン 首掛け',
  },
  {
    id: 'magsafe-stand',
    name: 'MagSafe対応スマホスタンド（折りたたみ式）',
    category: 'mobile',
    priceHint: '1,500〜2,800円',
    why: 'iPhone がワンタッチでスタンドになる。テーブル・キッチン・寝室で使い回せる',
    warning: 'iPhone 12 以降のみ対応（Android はマグネット式ケース併用要）',
    amazonQuery: 'MagSafe スタンド 折りたたみ iPhone',
    rakutenQuery: 'MagSafe スタンド 折りたたみ',
  },

  // ─── 外出・お出かけ ───
  {
    id: 'compact-umbrella',
    name: '超軽量折りたたみ傘（晴雨兼用・100g台）',
    category: 'outdoor',
    priceHint: '2,000〜3,000円',
    why: '常にカバンに入れても重さを感じない。突然の雨・日差しの両方に対応',
    warning: '強風時は骨が弱い。普段の小雨〜中雨向け',
    amazonQuery: '折りたたみ傘 軽量 100g 晴雨兼用',
    rakutenQuery: '折りたたみ傘 軽量 晴雨兼用',
  },
  {
    id: 'cooling-towel',
    name: '冷感タオル（水に濡らすだけで冷却）',
    category: 'outdoor',
    priceHint: '1,500〜2,200円',
    why: 'スポーツ・通勤・キャンプで首に巻くと長時間ひんやり。電池・電源不要',
    warning: '繰り返し洗濯すると冷感が徐々に弱くなる消耗品',
    amazonQuery: '冷感タオル ひんやり スポーツ',
    rakutenQuery: '冷感タオル ひんやり',
  },
  {
    id: 'tote-bag-collapsible',
    name: '折りたたみエコバッグ（自立する大容量）',
    category: 'outdoor',
    priceHint: '1,500〜2,500円',
    why: 'スーパー・コストコ・コンビニ全部対応。レジ袋代の節約にも繋がる',
    warning: '自立タイプはやや重め。ポーチサイズも事前チェック',
    amazonQuery: 'エコバッグ 大容量 自立 折りたたみ',
    rakutenQuery: 'エコバッグ 大容量 自立',
  },
  {
    id: 'pocket-tripod',
    name: 'スマホ三脚（コンパクト・360度回転）',
    category: 'outdoor',
    priceHint: '1,800〜2,800円',
    why: '旅行・YouTube撮影・オンライン会議の固定撮影が安定する',
    warning: '重いスマホ＋大きいケースだとバランス取りにくい場合あり',
    amazonQuery: 'スマホ 三脚 軽量 折りたたみ',
    rakutenQuery: 'スマホ 三脚 折りたたみ',
  },

  // ─── からだケア ───
  {
    id: 'scalp-massager',
    name: '頭皮マッサージブラシ（シャンプー時用）',
    category: 'care',
    priceHint: '1,500〜2,500円',
    why: '指洗いより気持ちいい。地肌の汚れ落ちも実感しやすい',
    warning: '電動タイプは防水等級を確認・敏感肌の人は手動から試す',
    amazonQuery: '頭皮 マッサージ ブラシ シャンプー',
    rakutenQuery: '頭皮 マッサージ ブラシ',
  },
  {
    id: 'tongue-cleaner',
    name: '舌クリーナー（ステンレス・繰り返し使える）',
    category: 'care',
    priceHint: '1,500〜2,000円',
    why: '口臭ケアの基本。歯ブラシで舌を磨くより効率良く・刺激少ない',
    warning: '最初は嘔吐反射に注意・優しく少しずつ',
    amazonQuery: '舌クリーナー ステンレス',
    rakutenQuery: '舌クリーナー ステンレス',
  },
  {
    id: 'eye-mask-heat',
    name: 'ホットアイマスク（USB充電・繰り返し使える）',
    category: 'care',
    priceHint: '2,000〜3,000円',
    why: '使い捨てタイプから移行できる。長期コスト下がる・寝る前のルーティンに',
    warning: '温度設定の調整幅が小さい商品もある・低温やけど注意',
    amazonQuery: 'ホットアイマスク USB 充電 繰り返し',
    rakutenQuery: 'ホットアイマスク USB 繰り返し',
  },
  {
    id: 'foot-roller',
    name: '足裏ローラー（木製・電源不要）',
    category: 'care',
    priceHint: '1,500〜2,500円',
    why: 'デスクワークの足の疲れに。テレビを見ながら使える',
    warning: '硬すぎる商品もある・最初は布越しで様子見',
    amazonQuery: '足裏 ローラー 木製',
    rakutenQuery: '足裏 ローラー',
  },
];

/**
 * カテゴリ別にグループ化した商品リスト
 */
export function getProductsByCategory() {
  return YAMETE_KAU_CATEGORIES.map((cat) => ({
    ...cat,
    products: YAMETE_KAU_PRODUCTS.filter((p) => p.category === cat.id),
  }));
}
