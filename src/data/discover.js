// サブスク図鑑（discover）データ
//
// ブランド一貫性のための設計原則：
//   - 「中立的に紹介する」スタンス。押し売りではない
//   - 各ジャンルページで必ず「やめたくなったら」セクションを併記
//   - 主要3社の比較は事実ベース・特徴ベースで提示（順位付けしない）
//   - アフィリンクは services[].affiliateUrl に入れる。未設定なら公式 URL を使う
//
// 「サブスクやめた」のユーザーは『サブスクのハードルが低い人』であり、
// 知らない世界を中立的に教えてくれる場として機能することで価値が生まれる
//
// ★★★ A8 提携状況メモ（2026-05-23）★★★
//   42件の提携承認は「ライフオラクル」サイト経由のため、現「サブスクやめた」
//   サイトでは追跡 URL を発行できない（規約違反リスク）。
//   先に A8 で「サブスクやめた」をサイト追加 → 各広告主に追加申請 →
//   承認後に affiliateUrl を埋める。詳細は docs/A8_REAPPLY_GUIDE.md 参照。
//
//   申請中の8案件と対応プログラムID：
//     HitoHana       : s00000016113004 → flower → HitoHana
//     airCloset      : s00000016856001 → fashion-rental → airCloset
//     DROBE          : s00000020848001 → fashion-rental → DROBE
//     AnotherADdress : s00000023131001 → fashion-rental → AnotherADdress
//     DELIPICKS      : s00000022857001 → frozen-meal → DELIPICKS
//     every frecious : s00000010789007 → water-server → every frecious
//     マルチピュア   : s00000024726001 → water-server → マルチピュア
//     INIC コーヒー  : s00000017094001 → coffee-subscription → INIC コーヒー

export const DISCOVER_GENRES = [
  {
    id: 'flower',
    name: '花の定期便',
    emoji: '💐',
    tagline: '玄関やリビングに、季節の花が定期的に届くサブスク',
    summary:
      '月550円から始められて、暮らしの「小さな非日常」を作るサブスク。ポスト投函型と直接受取型があり、自宅にいる時間が少ない人でも続けやすい。花瓶が付属するプランも多く、初めての人でも始めやすい。',
    targets: ['部屋の雰囲気を変えたい', '気分を上げたい', '気軽な贅沢が欲しい'],
    notFor: ['花粉症がひどい', '猫を飼っている（一部の花は猫に有害）', '長期不在が多い'],
    priceRange: '550〜4,950円/月',
    services: [
      {
        name: 'Bloomee（ブルーミー）',
        domain: 'bloomee.life',
        monthly: 550,
        usp: '業界最安値クラス。ポスト投函で受取簡単',
        cancel: 'マイページから「お休み」または「解約」。次回配送4日前までに手続き',
        officialUrl: 'https://bloomee.life/',
        affiliateUrl: null,
      },
      {
        name: 'HitoHana（ひとはな）',
        domain: 'hitohana.tokyo',
        monthly: 1320,
        usp: '色やボリュームを5パターンから選べる。初回花瓶プレゼント',
        cancel: 'マイページ「定期便管理」から解約。次回配送5日前まで',
        officialUrl: 'https://hitohana.tokyo/teikibin',
        affiliateUrl: null, // A8 承認済み（s00000016113004）→ 後で実 URL 反映
      },
      {
        name: 'medelu（メデル）',
        domain: 'medelu.life',
        monthly: 698,
        usp: 'Mini プラン698円〜の低価格、ポスト投函対応',
        cancel: 'マイページから1回スキップまたは解約',
        officialUrl: 'https://medelu.life/',
        affiliateUrl: null,
      },
    ],
    cancelGuide:
      '花の定期便は「次回配送日の数日前まで」に解約手続きをすれば、それ以降の課金は止まります。受取済みの花はそのまま使えます。もし合わなかったら、ほとんどのサービスが1ヶ月単位でやめられるので、気軽に試せます。',
  },
  {
    id: 'fashion-rental',
    name: '洋服のサブスク・レンタル',
    emoji: '👗',
    tagline: '毎月違う服が届く、または借り放題のサブスク',
    summary:
      '購入ではなく月額で「借りる」スタイル。買うとクローゼットが溢れる、毎日違う服を着たい、トレンドを試したいけど買うのは怖い、という層に支持されている。プロのスタイリストが選ぶタイプと、自分で選ぶタイプの2系統がある。',
    targets: ['服を買うクセを直したい', '毎日違う服を着たい', 'クローゼットを減らしたい'],
    notFor: ['好みがピンポイントで決まっている', 'ブランド志向が強い', '汚れやすい仕事'],
    priceRange: '10,800〜22,000円/月',
    services: [
      {
        name: 'airCloset（エアークローゼット）',
        domain: 'air-closet.com',
        monthly: 11800,
        usp: '国内最大級・大人女性向け。プロのスタイリストが選定',
        cancel: 'マイページから解約。月額プランは月単位、年契約は更新月のみ違約金なし',
        officialUrl: 'https://www.air-closet.com/',
        affiliateUrl: null, // A8: s00000016856001
      },
      {
        name: 'DROBE（ドローブ）',
        domain: 'drobe.jp',
        monthly: 13800,
        usp: 'プロスタイリストがコーディネートを提案。買い取りベース型',
        cancel: 'マイページからスタイリング停止。買い取り済みは返金対象外',
        officialUrl: 'https://drobe.jp/',
        affiliateUrl: null, // A8: s00000020848001
      },
      {
        name: 'AnotherADdress（アナザーアドレス）',
        domain: 'anotheraddress.jp',
        monthly: 5500,
        usp: '百貨店初のサブスク。ハイブランド～セレクトショップ系',
        cancel: 'マイページ「会員情報」から「退会手続き」。次回更新日の前日まで',
        officialUrl: 'https://anotheraddress.jp/',
        affiliateUrl: null, // A8: s00000023131001
      },
    ],
    cancelGuide:
      '洋服レンタルは「月単位での休会」が用意されている場合が多いです。完全解約しなくても、忙しい月はスキップできる柔軟性があります。借りた服はクリーニング不要で返却 OK。',
  },
  {
    id: 'frozen-meal',
    name: '冷凍弁当・宅食',
    emoji: '🍱',
    tagline: '冷凍庫からチンするだけ、栄養バランス取れた1食',
    summary:
      '毎日の自炊が大変、外食ばかりだと栄養が偏る、という人にハマる。冷凍庫さえ確保できれば、1食600〜1000円台で栄養バランスの取れた食事が手に入る。シェフ監修やヘルシー系など、各社特徴がある。',
    targets: ['仕事が忙しくて自炊できない', '外食を減らしたい', '体型管理したい'],
    notFor: ['家族で食卓を囲みたい派', '冷凍庫の容量が小さい', '自炊を楽しみたい'],
    priceRange: '4,200〜12,800円/月（10食前後）',
    services: [
      {
        name: 'nosh（ナッシュ）',
        domain: 'nosh.jp',
        monthly: 5990,
        usp: '糖質30g以下・塩分2.5g以下の健康設計。メニュー60種以上',
        cancel: 'マイページから「定期便スキップ」または「停止」。次回配送4-5日前まで',
        officialUrl: 'https://nosh.jp/',
        affiliateUrl: null, // A8 or afb で取扱
      },
      {
        name: 'DELIPICKS（デリピックス）',
        domain: 'delipicks.com',
        monthly: 6800,
        usp: 'フレンチシェフ監修・国産食材中心',
        cancel: 'マイページから「スキップ」「お休み」「解約」を選択。次回配送5日前まで',
        officialUrl: 'https://delipicks.com/',
        affiliateUrl: null, // A8: s00000022857001
      },
      {
        name: 'オイシックス Kit Oisix',
        domain: 'oisix.com',
        monthly: 5000,
        usp: '冷凍弁当ではなく「20分で2品作れる」ミールキット。手作り感を残せる',
        cancel: 'マイページから「定期便スキップ」または「解約」',
        officialUrl: 'https://www.oisix.com/',
        affiliateUrl: null,
      },
    ],
    cancelGuide:
      '冷凍弁当系は「スキップ」が標準機能。完全解約より「来週はスキップ」を使う方が、生活リズムに合わせやすい。解約しても冷凍庫に届いた分は最後まで食べられる。',
  },
  {
    id: 'water-server',
    name: '浄水型ウォーターサーバー',
    emoji: '💧',
    tagline: '水道水を浄水して冷水・温水で使える定額レンタル',
    summary:
      '従来のボトル交換型と違い、水道水を直接浄水する新世代型。ボトル受取・在庫管理・交換の手間が無く、月額3000-5000円程度で使い放題。家族の飲料水・コーヒー・ご飯炊き・スープなど用途多数。',
    targets: ['ペットボトル代を減らしたい', 'ボトル交換が面倒', '家族の水分摂取量が多い'],
    notFor: ['ほとんど水を飲まない', '電気代を厳密に管理したい', '設置スペースが極狭'],
    priceRange: '3,000〜5,000円/月',
    services: [
      {
        name: 'every frecious（エブリィフレシャス）',
        domain: 'every-frecious.com',
        monthly: 3300,
        usp: '据置・卓上両モデル。レンタル料に水道代以外の全額込み',
        cancel: '電話または問い合わせフォームから。最低利用期間3年あり（途中解約は違約金）',
        officialUrl: 'https://every-frecious.com/',
        affiliateUrl: null, // A8: s00000010789007
      },
      {
        name: 'ハミングウォーター',
        domain: 'hummingwater.com',
        monthly: 3300,
        usp: '冷水・常温水・温水の3温度、据置タイプのみ',
        cancel: 'マイページまたは電話で解約。最低契約期間2年あり',
        officialUrl: 'https://hummingwater.com/',
        affiliateUrl: null,
      },
      {
        name: 'マルチピュア',
        domain: 'multipure.co.jp',
        monthly: 3300,
        usp: '据置・卓上両モデル。1日110円の浄水型',
        cancel: 'マイページから解約申請',
        officialUrl: 'https://www.multipure.co.jp/',
        affiliateUrl: null, // A8: s00000024726001
      },
    ],
    cancelGuide:
      'ウォーターサーバーは **「最低契約期間」のあるサービスが大半** です。3年契約なら2年で解約すると違約金が発生します。契約前に「最低利用期間」を必ず確認しましょう。返却時は本体を業者が引き取りに来ます。',
  },
  {
    id: 'coffee-subscription',
    name: 'コーヒー定期便',
    emoji: '☕',
    tagline: '毎月違う豆が届く、自宅で世界中のコーヒーを試せる',
    summary:
      '自分でカフェに行かなくても、毎月違う産地・焙煎の豆が届く。コーヒー専門店のサブスクは「飲み比べ」を楽しめる教養的な側面もある。豆・粉・ドリップバッグ・パウダーなど形態を選べる。',
    targets: ['コーヒー好きで毎日飲む', '色々な豆を試したい', '在宅勤務で自宅コーヒーが増えた'],
    notFor: ['1日1杯以下しか飲まない', '味の好みが固まっている'],
    priceRange: '1,500〜3,500円/月',
    services: [
      {
        name: 'PostCoffee（ポストコーヒー）',
        domain: 'postcoffee.co',
        monthly: 1980,
        usp: '世界中の独立系ロースターの豆。テイスト診断で自分好みに最適化',
        cancel: 'マイページから次回スキップまたは解約。次回配送日4日前まで',
        officialUrl: 'https://postcoffee.co/',
        affiliateUrl: null,
      },
      {
        name: 'INIC コーヒー',
        domain: 'inic-coffee.com',
        monthly: 1500,
        usp: 'たった5秒で本格コーヒー。粉末タイプで持ち運び・ホテル滞在にも',
        cancel: 'マイページから解約申請',
        officialUrl: 'https://inic-coffee.com/',
        affiliateUrl: null, // A8: s00000017094001
      },
      {
        name: 'TAILORED CAFE',
        domain: 'tailored.cafe',
        monthly: 1280,
        usp: '20問の診断結果に基づいてあなた専用の豆を毎月届ける',
        cancel: 'マイページから次回スキップまたは解約',
        officialUrl: 'https://tailored.cafe/',
        affiliateUrl: null,
      },
    ],
    cancelGuide:
      'コーヒー系は「1ヶ月だけお試し」がしやすいジャンル。次回スキップ機能が標準。豆が届くたびに「来月はどうしようか」を考えれば、合わなかった時はすぐに止められます。',
  },
  {
    id: 'learning',
    name: 'おうち学び・習い事',
    emoji: '📚',
    tagline: '通学不要、自分のペースで学べる定額制サブスク',
    summary:
      '英会話・プログラミング・資格試験・ヨガ・絵画など、自宅で気軽に始められる学び系サブスクが急増している。通学の往復時間が不要・録画見直し可能・複数ジャンルを横断学習できる、というのが大きな魅力。',
    targets: ['通勤時間を活用したい', '体系的な学びをしたい', '気軽に始めたい'],
    notFor: ['対面で励まし合いたい', '自己管理が苦手', '完全に手取り足取り教わりたい'],
    priceRange: '980〜10,000円/月',
    services: [
      {
        name: 'Schoo（スクー）',
        domain: 'schoo.jp',
        monthly: 1078,
        usp: 'ビジネス・教養・キャリア系の生配信授業＋8000本以上の録画',
        cancel: 'マイページから「プレミアム会員停止」。次回更新日の3日前まで',
        officialUrl: 'https://schoo.jp/',
        affiliateUrl: null,
      },
      {
        name: 'Udemy Personal Plan',
        domain: 'udemy.com',
        monthly: 2800,
        usp: '世界最大級のオンライン講座プラットフォームの定額版',
        cancel: 'マイページ「設定」→「サブスクリプション」から解約',
        officialUrl: 'https://www.udemy.com/personal-plan/',
        affiliateUrl: null,
      },
      {
        name: 'オンライン英会話 DMM',
        domain: 'eikaiwa.dmm.com',
        monthly: 7900,
        usp: '24時間365日、毎日25分英会話できる定額制',
        cancel: 'マイページから「自動更新停止」または「退会」',
        officialUrl: 'https://eikaiwa.dmm.com/',
        affiliateUrl: null,
      },
    ],
    cancelGuide:
      '学び系は「3ヶ月続けば習慣化、続かなければ気軽に止められる」スタンスがおすすめ。多くのサービスが月単位の課金で違約金なし。「今月忙しい」と思ったら迷わず一時停止できる柔軟性が魅力。',
  },
];

export const DISCOVER_GENRES_BY_ID = Object.fromEntries(DISCOVER_GENRES.map((g) => [g.id, g]));
