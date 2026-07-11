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
// ★★★ A8 提携 URL 反映済み（2026-05-23）★★★
//   A8 では「サイト追加申請」は不要だった。サブスクやめたを A8 にサイト登録 (006) し、
//   「広告リンク作成」画面の掲載サイト切替で 8 案件すべての追跡 URL を取得して反映済み。
//   各 affiliateUrl は「サブスクやめた」用に発行されたもので、A8 規約準拠。
//
//   反映済みの 8 案件：
//     HitoHana       : s00000016113004 (flower)              → 4B3XB5+30CZYQ+3GBU+NTJWY
//     airCloset      : s00000016856001 (fashion-rental)      → 4B3XB5+2VLJ4I+3M28+61Z83
//     DROBE          : s00000020848001 (fashion-rental)      → 4B3XB5+3QK2KY+4GV4+5YJRM
//     AnotherADdress : s00000023131001 (fashion-rental)      → 4B3XB5+2WSEC2+4YHA+60H7M
//     DELIPICKS      : s00000022857001 (frozen-meal)         → 4B3XB5+3ITFPU+4WD6+61Z81
//     every frecious : s00000010789007 (water-server)        → 4B3XB5+3PD7DE+2B8Y+15OK2A
//     マルチピュア   : s00000024726001 (water-server)        → 4B3XB5+3BO8GI+5ASC+5YRHE
//     INIC コーヒー  : s00000017094001 (coffee-subscription) → 4B3XB5+383MTU+3NWC+63H8H

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
    priceRange: '550〜4,980円/月',
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
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+30CZYQ+3GBU+NTJWY',
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
      {
        name: 'AND PLANTS（アンドプランツ）',
        domain: 'andplants.jp',
        monthly: 1980,
        usp: 'STANDARD1,980円〜（6本目安）。頻度を毎週/2週/4週で選べ、回数縛りなしでいつでも解約・スキップできる',
        cancel: 'マイページからいつでも解約・スキップ可。最低継続回数なし（次回お届け前に手続き）',
        officialUrl: 'https://andplants.jp/',
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+3KLQJ6+4W8G+BWVTE',
      },
      {
        name: '+hana（タスハナ）',
        domain: 'tasuhana.com',
        monthly: 858,
        usp: '月858円〜（送料込）の最安級・全プランポスト投函。ロスフラワー活用',
        cancel: '⚠️最低5回の継続が必要。5回目の出荷後にマイページから解約可（次回配送10日前まで）。スキップは半年に1回は注文が要る',
        officialUrl: 'https://tasuhana.com/Landing/Formlp/hana_lp.aspx',
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+37I782+4XOY+5YJRM',
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
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+2VLJ4I+3M28+61Z83',
      },
      {
        name: 'DROBE（ドローブ）',
        domain: 'drobe.jp',
        monthly: 13800,
        usp: 'プロスタイリストがコーディネートを提案。買い取りベース型',
        cancel: 'マイページからスタイリング停止。買い取り済みは返金対象外',
        officialUrl: 'https://drobe.jp/',
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+3QK2KY+4GV4+5YJRM',
      },
      {
        name: 'AnotherADdress（アナザーアドレス）',
        domain: 'anotheraddress.jp',
        monthly: 5500,
        usp: '百貨店初のサブスク。ハイブランド～セレクトショップ系',
        cancel: 'マイページ「会員情報」から「退会手続き」。次回更新日の前日まで',
        officialUrl: 'https://anotheraddress.jp/',
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+2WSEC2+4YHA+60H7M',
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
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+3ITFPU+4WD6+61Z81',
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
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+3PD7DE+2B8Y+15OK2A',
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
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+3BO8GI+5ASC+5YRHE',
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
        affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B3XB5+383MTU+3NWC+63H8H',
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
        name: 'デジハリ・オンラインスクール',
        domain: 'online.dhw.co.jp',
        monthly: 10000,
        usp: 'Web・CG・映像・プログラミング。卒業後の転職実績豊富な老舗オンラインスクール',
        cancel: '受講期間内のコース変更不可。期間満了で自動終了',
        officialUrl: 'https://online.dhw.co.jp/',
        affiliateUrl: 'https://af.moshimo.com/af/c/click?a_id=5581467&p_id=3193&pc_id=7476&pl_id=41798',
      },
      {
        name: 'デジタネ（旧D-SCHOOL）',
        domain: 'digitane.jp',
        monthly: 2500,
        usp: '小中学生向けプログラミング。Scratch・マイクラ・Roblox 等を体系的に学べる',
        cancel: 'マイページから「退会手続き」。次回更新日の前日まで',
        officialUrl: 'https://digitane.jp/',
        affiliateUrl: 'https://af.moshimo.com/af/c/click?a_id=5581466&p_id=4975&pc_id=13311&pl_id=65311',
      },
      {
        name: 'Schoo（スクー）',
        domain: 'schoo.jp',
        monthly: 1078,
        usp: 'ビジネス・教養・キャリア系の生配信授業＋8000本以上の録画',
        cancel: 'マイページから「プレミアム会員停止」。次回更新日の3日前まで',
        officialUrl: 'https://schoo.jp/',
        affiliateUrl: null,
      },
    ],
    cancelGuide:
      '学び系は「3ヶ月続けば習慣化、続かなければ気軽に止められる」スタンスがおすすめ。多くのサービスが月単位の課金で違約金なし。「今月忙しい」と思ったら迷わず一時停止できる柔軟性が魅力。',
  },
  {
    id: 'kids-toy',
    name: '子育て・知育玩具',
    emoji: '🧸',
    tagline: '買って後悔より、定額レンタルで「飽きたら返却」',
    summary:
      '0〜6歳の知育玩具は月齢に合わせて頻繁に入れ替えが必要。1個3,000〜10,000円する木のおもちゃをすべて買うのは現実的ではない。月額制レンタルなら、子どもの成長に合わせて毎月新しいおもちゃが届き、飽きたものは返却できる。',
    targets: ['知育玩具にこだわりたい', '部屋がおもちゃで溢れがち', '何を買えばいいか分からない'],
    notFor: ['お下がりが豊富にある', '子どもの好みが定まっている', 'おもちゃは買って所有したい'],
    priceRange: '2,000〜5,000円/月',
    services: [
      {
        name: 'トイサブ！ファーストセレクション',
        domain: 'toysub.net',
        monthly: 3674,
        usp: '業界最大手・延べ会員数2万人以上。月齢に合わせたプロ選定の知育玩具',
        cancel: 'マイページから「サービス停止」。返却完了後に手続き',
        officialUrl: 'https://toysub.net/',
        affiliateUrl: 'https://af.moshimo.com/af/c/click?a_id=5581465&p_id=4587&pc_id=11989&pl_id=61358',
      },
    ],
    cancelGuide:
      '知育玩具レンタルは「子どもの興味が変わるタイミング」での解約が定番。3ヶ月使ってみて、お気に入りが出てこなければ別ジャンルに切り替えるか、買い切り型に移行する判断がしやすい。',
  },
  {
    id: 'sake-subscription',
    name: 'お酒定期便',
    emoji: '🍶',
    tagline: '「いつもと違う一杯」を月1回ポストに届ける',
    summary:
      '日本酒・クラフトビール・ワインの定期便サービスが台頭。お店で買うと選びきれない多銘柄を、プロが厳選して少量ずつ届けてくれる。週末の一杯を「今月のテーマ」として楽しめる。買い切りだとなかなか手が伸びない高価格帯のお酒が試せるのが魅力。',
    targets: ['お酒の知識を広げたい', '毎月新しい味を試したい', '酒蔵応援したい'],
    notFor: ['特定の銘柄しか飲まない', '量を飲みたい', '価格重視'],
    priceRange: '1,800〜5,000円/月',
    services: [
      {
        name: 'SAKEPOST（日本酒定期便）',
        domain: 'sakepost.jp',
        monthly: 1980,
        usp: 'ポスト投函型・100ml×3種の日本酒が毎月届く・全国の酒蔵から厳選',
        cancel: 'マイページから「定期便を停止」。次回発送の3日前まで',
        officialUrl: 'https://sakepost.jp/',
        affiliateUrl: 'https://af.moshimo.com/af/c/click?a_id=5581468&p_id=5618&pc_id=15457&pl_id=72438',
      },
    ],
    cancelGuide:
      'お酒定期便は「好みの方向性が見えてきた」段階で解約し、その後は単品購入に移行する人が多い。3〜6回試して、自分の好みのジャンル（純米吟醸 / にごり / 山廃 等）が分かれば、卒業の合図。',
  },
];

export const DISCOVER_GENRES_BY_ID = Object.fromEntries(DISCOVER_GENRES.map((g) => [g.id, g]));
