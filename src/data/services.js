export const CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'video', label: '動画' },
  { id: 'music', label: '音楽' },
  { id: 'shopping', label: 'ショッピング' },
  { id: 'software', label: 'ソフト' },
  { id: 'news', label: 'ニュース・読み放題' },
  { id: 'game', label: 'ゲーム' },
  { id: 'other', label: 'その他' },
];

// difficulty: 'easy' | 'medium' | 'hard'
export const SERVICES = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'video',
    emoji: '🎬',
    domain: 'netflix.com',
    cancelUrl: 'https://www.netflix.com/cancelplan',
    difficulty: 'easy',
    steps: [
      '右上のアイコン → 「アカウント」',
      'プランの管理 → 「メンバーシップのキャンセル」',
      '確認してキャンセル完了',
    ],
    note: 'キャンセル後も請求期間の末日まで視聴可能',
  },
  {
    id: 'amazon-prime',
    name: 'Amazon プライム',
    category: 'shopping',
    emoji: '📦',
    domain: 'amazon.co.jp',
    cancelUrl: 'https://www.amazon.co.jp/gp/primecentral',
    difficulty: 'medium',
    steps: [
      'アカウント＆リスト → 「プライム会員情報」',
      '「プライム会員資格を終了する」をタップ',
      '「特典を終了する」→「特典を終了する」で確定',
    ],
    note: '「継続する」ボタンが目立つので注意。解約は小さいリンク',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'music',
    emoji: '🎵',
    domain: 'spotify.com',
    cancelUrl: 'https://www.spotify.com/jp/account/subscription/',
    difficulty: 'easy',
    steps: [
      '上記URLを開く（アプリからは解約不可）',
      '「プランを変更する」→「Premiumをキャンセルする」',
      '手順に沿って完了',
    ],
    note: 'アプリからは解約できない。必ずブラウザで',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    category: 'music',
    emoji: '🍎',
    domain: 'apple.com',
    cancelUrl: 'https://support.apple.com/ja-jp/118428',
    difficulty: 'easy',
    steps: [
      'iPhoneの「設定」→ 一番上のApple ID名',
      '「サブスクリプション」→「Apple Music」',
      '「サブスクリプションをキャンセルする」',
    ],
    note: 'iOS設定アプリから直接解約できる',
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'video',
    emoji: '▶️',
    domain: 'youtube.com',
    cancelUrl: 'https://www.youtube.com/paid_memberships',
    difficulty: 'easy',
    steps: [
      '上記URLを開く、または右上アイコン → 「購入とメンバーシップ」',
      '「YouTube Premium」→「解約する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'video',
    emoji: '🏰',
    domain: 'disneyplus.com',
    cancelUrl: 'https://www.disneyplus.com/ja-jp/account',
    difficulty: 'easy',
    steps: [
      '右上アイコン → 「アカウント」',
      '「解約する」をタップ',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'hulu',
    name: 'Hulu',
    category: 'video',
    emoji: '📺',
    domain: 'hulu.jp',
    cancelUrl: 'https://help.hulu.jp/article/cancellation',
    difficulty: 'medium',
    steps: [
      'マイページ → 「登録情報」',
      '「解約手続きはこちら」',
      '理由選択 → 「解約する」',
    ],
    note: null,
  },
  {
    id: 'abema-premium',
    name: 'ABEMAプレミアム',
    category: 'video',
    emoji: '📡',
    domain: 'abema.tv',
    cancelUrl: 'https://abema.tv/account',
    difficulty: 'medium',
    steps: [
      'マイページ → 「ABEMAプレミアム」',
      '「自動更新を停止する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'u-next',
    name: 'U-NEXT',
    category: 'video',
    emoji: '🎭',
    domain: 'unext.jp',
    cancelUrl: 'https://video.unext.jp/option/my-menu',
    difficulty: 'hard',
    steps: [
      'マイメニュー → 「契約内容の確認・変更」',
      '「解約はこちら」（ページ下部にある小さいリンク）',
      '理由選択 → 「解約する」',
    ],
    note: '解約リンクがとても見つかりにくい。ページ最下部を探して',
  },
  {
    id: 'dazn',
    name: 'DAZN',
    category: 'video',
    emoji: '⚽',
    domain: 'dazn.com',
    cancelUrl: 'https://www.dazn.com/ja-JP/account',
    difficulty: 'medium',
    steps: [
      'アカウントページ → 「サブスクリプション」',
      '「キャンセル」',
      '引き止めオファーを断って完了',
    ],
    note: '引き止め画面が複数回出る',
  },
  {
    id: 'apple-tv-plus',
    name: 'Apple TV+',
    category: 'video',
    emoji: '📱',
    domain: 'apple.com',
    cancelUrl: 'https://support.apple.com/ja-jp/118428',
    difficulty: 'easy',
    steps: [
      'iPhoneの「設定」→ Apple ID名',
      '「サブスクリプション」→「Apple TV+」',
      '「サブスクリプションをキャンセルする」',
    ],
    note: null,
  },
  {
    id: 'nhk-plus',
    name: 'NHKプラス',
    category: 'video',
    emoji: '📻',
    domain: 'nhk.or.jp',
    cancelUrl: 'https://plus.nhk.jp/mypage/withdraw',
    difficulty: 'medium',
    steps: [
      'マイページ → 「退会手続き」',
      '確認事項を読んで「退会する」',
    ],
    note: null,
  },
  {
    id: 'line-music',
    name: 'LINE MUSIC',
    category: 'music',
    emoji: '🎶',
    domain: 'line.me',
    cancelUrl: 'https://music.line.me/webapp/plan',
    difficulty: 'easy',
    steps: [
      'マイページ → 「プラン」',
      '「プランを解約する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'amazon-music-unlimited',
    name: 'Amazon Music Unlimited',
    category: 'music',
    emoji: '🎧',
    domain: 'amazon.co.jp',
    cancelUrl: 'https://www.amazon.co.jp/gp/dmusic/promotions/AmazonMusicUnlimited',
    difficulty: 'medium',
    steps: [
      '「設定とサブスクリプション」',
      '「サブスクリプションのキャンセル」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'rakuten-music',
    name: '楽天ミュージック',
    category: 'music',
    emoji: '🎼',
    domain: 'rakuten.co.jp',
    cancelUrl: 'https://music.rakuten.co.jp/subscription/plan/',
    difficulty: 'easy',
    steps: [
      'マイページ → 「ご利用プラン」',
      '「解約する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'software',
    emoji: '💼',
    domain: 'microsoft.com',
    cancelUrl: 'https://account.microsoft.com/services',
    difficulty: 'medium',
    steps: [
      '「サービスとサブスクリプション」',
      'Microsoft 365の「管理」',
      '「サブスクリプションのキャンセル」',
    ],
    note: null,
  },
  {
    id: 'adobe-cc',
    name: 'Adobe Creative Cloud',
    category: 'software',
    emoji: '🎨',
    domain: 'adobe.com',
    cancelUrl: 'https://account.adobe.com/ja/plans',
    difficulty: 'hard',
    steps: [
      '「プランを管理」→「プランをキャンセル」',
      '理由を選択（複数の引き止め画面あり）',
      '最後まで「続ける」を押して完了',
    ],
    note: '年間契約の場合、違約金が発生することがある。契約終了日を確認して',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'software',
    emoji: '📝',
    domain: 'notion.so',
    cancelUrl: 'https://www.notion.so/ja-jp/help/cancel-subscription',
    difficulty: 'easy',
    steps: [
      '設定 → 「プランと請求」',
      '「プランをキャンセル」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'software',
    emoji: '📂',
    domain: 'dropbox.com',
    cancelUrl: 'https://www.dropbox.com/account/plan',
    difficulty: 'easy',
    steps: [
      'アカウント → 「プランの管理」',
      '「プランのキャンセル」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    category: 'software',
    emoji: '🖼️',
    domain: 'canva.com',
    cancelUrl: 'https://www.canva.com/settings/billing',
    difficulty: 'easy',
    steps: [
      'アカウント設定 → 「請求と料金」',
      '「プランをキャンセル」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'nintendo-switch-online',
    name: 'Nintendo Switch Online',
    category: 'game',
    emoji: '🎮',
    domain: 'nintendo.com',
    cancelUrl: 'https://accounts.nintendo.com/setting',
    difficulty: 'medium',
    steps: [
      'ニンテンドーアカウントの「ショップメニュー」',
      '「Nintendo Switch Online 加入状況の確認・解約」',
      '「自動継続購入を解約する」',
    ],
    note: null,
  },
  {
    id: 'playstation-plus',
    name: 'PlayStation Plus',
    category: 'game',
    emoji: '🕹️',
    domain: 'playstation.com',
    cancelUrl: 'https://www.playstation.com/ja-jp/support/subscriptions/cancel-playstation-plus/',
    difficulty: 'medium',
    steps: [
      'PS5/PS4の設定 → 「アカウント管理」→「サブスクリプション」',
      'またはPS Storeの「アカウント」→「サブスクリプション」',
      '「PlayStation Plus」→「キャンセル」',
    ],
    note: null,
  },
  {
    id: 'xbox-game-pass',
    name: 'Xbox Game Pass',
    category: 'game',
    emoji: '🟢',
    domain: 'xbox.com',
    cancelUrl: 'https://account.microsoft.com/services',
    difficulty: 'medium',
    steps: [
      '「サービスとサブスクリプション」',
      'Game Pass の「管理」',
      '「サブスクリプションのキャンセル」',
    ],
    note: null,
  },
  {
    id: 'nikkei',
    name: '日本経済新聞 電子版',
    category: 'news',
    emoji: '📰',
    domain: 'nikkei.com',
    cancelUrl: 'https://www.nikkei.com/service/nikkeiid/setting/contract/',
    difficulty: 'hard',
    steps: [
      'マイページ → 「ご契約内容」',
      '「解約・変更申込」（ページ下部）',
      'フォームに入力して申請',
    ],
    note: 'オンラインで即時完了しない場合がある。確認メールを要チェック',
  },
  {
    id: 'kindle-unlimited',
    name: 'Kindle Unlimited',
    category: 'news',
    emoji: '📚',
    domain: 'amazon.co.jp',
    cancelUrl: 'https://www.amazon.co.jp/hz/mycd/digital-console/contentlist/ku/ref=kinw_myk_redirect',
    difficulty: 'medium',
    steps: [
      'アカウントサービス → 「Kindle Unlimited 会員の管理」',
      '「会員資格を終了する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'danime',
    name: 'dアニメストア',
    category: 'video',
    emoji: '🌸',
    domain: 'docomo.ne.jp',
    cancelUrl: 'https://animestore.docomo.ne.jp/animestore/mypage_do',
    difficulty: 'medium',
    steps: [
      'マイページ → 「ご契約内容の確認・変更」',
      '「解約する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'rakuten-tv',
    name: '楽天TV',
    category: 'video',
    emoji: '🔴',
    domain: 'rakuten.co.jp',
    cancelUrl: 'https://tv.rakuten.co.jp/mypage/',
    difficulty: 'medium',
    steps: [
      'マイページ → 「ご契約情報」',
      '「解約する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    category: 'software',
    emoji: '🤖',
    domain: 'openai.com',
    cancelUrl: 'https://chat.openai.com/settings',
    difficulty: 'easy',
    steps: [
      '左下のアカウント名 → 「マイプラン」',
      '「プランをキャンセル」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro',
    category: 'software',
    emoji: '✨',
    domain: 'anthropic.com',
    cancelUrl: 'https://claude.ai/settings',
    difficulty: 'easy',
    steps: [
      '設定 → 「請求」',
      '「サブスクリプションをキャンセル」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'evernote',
    name: 'Evernote',
    category: 'software',
    emoji: '🐘',
    domain: 'evernote.com',
    cancelUrl: 'https://www.evernote.com/Billing.action',
    difficulty: 'medium',
    steps: [
      'アカウント → 「請求情報」',
      '「サブスクリプションのキャンセル」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'audible',
    name: 'Audible（オーディブル）',
    category: 'news',
    emoji: '🎧',
    domain: 'audible.co.jp',
    cancelUrl: 'https://www.audible.co.jp/account/cancel-membership',
    difficulty: 'hard',
    steps: [
      'PCブラウザで上記URLを開く（アプリ・スマホからは解約不可）',
      '「このまま退会手続きを行う」を繰り返し選ぶ',
      '理由を選んで「退会手続きを完了する」',
    ],
    note: 'スマホアプリからは絶対に解約できない。必ずPCブラウザで',
  },
  {
    id: 'rakuten-magazine',
    name: '楽天マガジン',
    category: 'news',
    emoji: '📖',
    domain: 'rakuten.co.jp',
    cancelUrl: 'https://magazine.rakuten.co.jp/account/setting/',
    difficulty: 'medium',
    steps: [
      'マイページ → 「ご契約内容の確認・変更」',
      '「解約はこちら」（ページ下部）',
      '理由選択 → 「解約する」',
    ],
    note: null,
  },
  {
    id: 'dmagazine',
    name: 'dマガジン',
    category: 'news',
    emoji: '📔',
    domain: 'docomo.ne.jp',
    cancelUrl: 'https://magazine.dmkt-sp.jp/mfdoc/setting/cancel',
    difficulty: 'medium',
    steps: [
      'dマガジン公式 → 「解約」',
      'dアカウントでログイン',
      '「手続きを完了する」',
    ],
    note: null,
  },
  {
    id: 'wowow-on-demand',
    name: 'WOWOWオンデマンド',
    category: 'video',
    emoji: '🎞️',
    domain: 'wowow.co.jp',
    cancelUrl: 'https://www.wowow.co.jp/customer/cancel/',
    difficulty: 'hard',
    steps: [
      '上記URL → ログイン',
      '「解約のお手続き」',
      'アンケート入力 → 「解約手続きを完了する」',
    ],
    note: '電話解約のみだった時期もあるが現在はWebで完結可能',
  },
  {
    id: 'fod',
    name: 'FOD（フジテレビオンデマンド）',
    category: 'video',
    emoji: '🎥',
    domain: 'fod.fujitv.co.jp',
    cancelUrl: 'https://fod.fujitv.co.jp/s/account/',
    difficulty: 'medium',
    steps: [
      'マイページ → 「アカウント情報」',
      '「FODプレミアム解約」',
      '理由選択 → 「解約する」',
    ],
    note: null,
  },
  {
    id: 'lemino',
    name: 'Lemino（旧dTV）',
    category: 'video',
    emoji: '📲',
    domain: 'lemino.docomo.ne.jp',
    cancelUrl: 'https://lemino.docomo.ne.jp/lemino-pc/contents/account',
    difficulty: 'medium',
    steps: [
      'マイページ → 「アカウント」',
      '「解約お手続き」',
      'dアカウントで認証 → 「手続きを完了する」',
    ],
    note: null,
  },
  {
    id: 'yahoo-premium',
    name: 'Yahoo!プレミアム',
    category: 'other',
    emoji: '🅈',
    domain: 'yahoo.co.jp',
    cancelUrl: 'https://premium.yahoo.co.jp/end/',
    difficulty: 'hard',
    steps: [
      '上記URL → Yahoo! JAPAN IDでログイン',
      '解約理由を選んで進む（引き止め画面複数）',
      '最後まで「解約する」を押し続けて完了',
    ],
    note: '引き止めバナーが何度も表示される。慌てず最下部の解約リンクを探す',
  },
  {
    id: 'dmm-premium',
    name: 'DMMプレミアム',
    category: 'video',
    emoji: '🎦',
    domain: 'dmm.com',
    cancelUrl: 'https://premium.dmm.com/account/leave/',
    difficulty: 'medium',
    steps: [
      '上記URL → DMMアカウントでログイン',
      '「解約する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'apple-one',
    name: 'Apple One',
    category: 'other',
    emoji: '🍏',
    domain: 'apple.com',
    cancelUrl: 'https://support.apple.com/ja-jp/118428',
    difficulty: 'easy',
    steps: [
      'iPhoneの「設定」→ Apple ID名',
      '「サブスクリプション」→「Apple One」',
      '「サブスクリプションをキャンセルする」',
    ],
    note: 'Apple Music・iCloud+・TV+などが個別契約に戻る点に注意',
  },
  {
    id: 'google-one',
    name: 'Google One',
    category: 'software',
    emoji: '☁️',
    domain: 'one.google.com',
    cancelUrl: 'https://one.google.com/settings',
    difficulty: 'easy',
    steps: [
      'one.google.com → 「設定」',
      '「メンバーシップをキャンセル」',
      '確認して完了',
    ],
    note: 'キャンセル後、保存容量超過分のデータは閲覧のみ可能になる',
  },
  {
    id: 'icloud-plus',
    name: 'iCloud+',
    category: 'software',
    emoji: '☁',
    domain: 'apple.com',
    cancelUrl: 'https://support.apple.com/ja-jp/HT207580',
    difficulty: 'easy',
    steps: [
      'iPhoneの「設定」→ Apple ID名 → 「iCloud」',
      '「アカウントのストレージを管理」→「ストレージプランを変更」',
      '「無料の5GBプランにダウングレード」',
    ],
    note: '完全に解約せず無料5GBに戻す形。データ容量超過分は要バックアップ',
  },
  {
    id: '1password',
    name: '1Password',
    category: 'software',
    emoji: '🔐',
    domain: '1password.com',
    cancelUrl: 'https://my.1password.com/billing',
    difficulty: 'medium',
    steps: [
      '1Password.com → サインイン → 「請求」',
      '「サブスクリプションを管理」→「キャンセル」',
      '確認して完了',
    ],
    note: 'キャンセル後も期間末まで使える。Vault データはエクスポート推奨',
  },
  {
    id: 'figma',
    name: 'Figma（有料プラン）',
    category: 'software',
    emoji: '🎯',
    domain: 'figma.com',
    cancelUrl: 'https://www.figma.com/settings',
    difficulty: 'medium',
    steps: [
      '右上アイコン → 「Settings」→「Plans」',
      '「Downgrade」または「Cancel plan」',
      '確認して完了',
    ],
    note: 'チーム単位の課金。誰が支払者か事前に確認',
  },
  {
    id: 'deepl-pro',
    name: 'DeepL Pro',
    category: 'software',
    emoji: '🌐',
    domain: 'deepl.com',
    cancelUrl: 'https://www.deepl.com/your-account/plan',
    difficulty: 'medium',
    steps: [
      'アカウント → 「プラン」',
      '「プランをキャンセル」',
      '理由選択 → 確定',
    ],
    note: null,
  },
  {
    id: 'pairs',
    name: 'Pairs（ペアーズ）',
    category: 'other',
    emoji: '💕',
    domain: 'pairs.lv',
    cancelUrl: 'https://www.pairs.lv/help/4408826555417',
    difficulty: 'hard',
    steps: [
      'アプリストア決済の場合：iPhoneの「設定」→ サブスクリプション → Pairs',
      'クレカ決済の場合：ブラウザ版 → マイページ → 「料金プランの解約」',
      '理由選択 → 解約完了',
    ],
    note: '決済方法により手順が完全に分かれる。アプリ内には解約ボタンが無い',
  },
  {
    id: 'note-premium',
    name: 'noteプレミアム',
    category: 'news',
    emoji: '📝',
    domain: 'note.com',
    cancelUrl: 'https://note.com/settings/premium',
    difficulty: 'easy',
    steps: [
      '設定 → 「プレミアム」',
      '「プレミアムを解約する」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'software',
    emoji: '🐙',
    domain: 'github.com',
    cancelUrl: 'https://github.com/settings/copilot',
    difficulty: 'easy',
    steps: [
      '上記URL → 「Cancel Copilot」',
      '理由選択 → 「Cancel Copilot」',
      '確認して完了',
    ],
    note: '期間末まで利用可能。会社契約の場合は管理者経由',
  },
  {
    id: 'niconico-premium',
    name: 'ニコニコ動画プレミアム',
    category: 'video',
    emoji: '🎴',
    domain: 'nicovideo.jp',
    cancelUrl: 'https://secure.nicovideo.jp/secure/premium_status/unregister',
    difficulty: 'medium',
    steps: [
      '上記URL → ログイン',
      '「次へ」を進める',
      '理由選択 → 「退会する」',
    ],
    note: '解約後も期間末日まで利用可能',
  },
  {
    id: 'bookwalker',
    name: 'BOOK☆WALKER',
    category: 'news',
    emoji: '📕',
    domain: 'bookwalker.jp',
    cancelUrl: 'https://bookwalker.jp/withdraw/',
    difficulty: 'medium',
    steps: [
      '上記URL → ログイン',
      '退会理由を選択',
      '「退会する」',
    ],
    note: '購入済みの書籍は退会後も読めなくなる点に注意。退会前にメモを確保',
  },
  {
    id: 'honto',
    name: 'honto',
    category: 'news',
    emoji: '📓',
    domain: 'honto.jp',
    cancelUrl: 'https://honto.jp/cart/my/withdraw.html',
    difficulty: 'medium',
    steps: [
      '上記URL → ログイン',
      '「退会の手続き」を確認',
      '「退会する」',
    ],
    note: '購入済み電子書籍も読めなくなる。共通ID（dポイント等の連携）も解除される',
  },
  {
    id: 'rakuten-kobo',
    name: '楽天Kobo（プレミアム）',
    category: 'news',
    emoji: '📒',
    domain: 'kobo.com',
    cancelUrl: 'https://my.rakuten.co.jp/rms/page/kk/withdraw.html',
    difficulty: 'medium',
    steps: [
      '楽天会員 退会ページ → ログイン',
      '退会理由を選ぶ',
      '「退会する」',
    ],
    note: '楽天会員自体の退会になる。Kobo購入書籍だけ解約したい場合はサポートへ',
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    category: 'video',
    emoji: '🍙',
    domain: 'crunchyroll.com',
    cancelUrl: 'https://www.crunchyroll.com/account/membership',
    difficulty: 'easy',
    steps: [
      '上記URL → ログイン',
      '「Cancel Membership」',
      '理由選択 → 確認',
    ],
    note: 'スマホアプリ経由で登録している場合は各ストアの設定から解約',
  },
  {
    id: 'vimeo-pro',
    name: 'Vimeo（有料プラン）',
    category: 'software',
    emoji: '🎞',
    domain: 'vimeo.com',
    cancelUrl: 'https://vimeo.com/settings/billing',
    difficulty: 'medium',
    steps: [
      '設定 → 「Billing」',
      '「Cancel plan」',
      '理由選択 → 確定',
    ],
    note: '解約後は無料プランに戻る。アップロード済み動画の保存数制限に注意',
  },
  {
    id: 'patreon',
    name: 'Patreon（サブスク支援）',
    category: 'other',
    emoji: '🎗️',
    domain: 'patreon.com',
    cancelUrl: 'https://www.patreon.com/settings/memberships',
    difficulty: 'easy',
    steps: [
      '上記URL → メンバーシップ一覧',
      '解約したいクリエイターの「⋯」→「Edit or cancel pledge」',
      '「Cancel my pledge」',
    ],
    note: '個別のクリエイター単位で解約。アカウント全体ではない',
  },
  {
    id: 'match',
    name: 'マッチドットコム（Match）',
    category: 'other',
    emoji: '💘',
    domain: 'match.com',
    cancelUrl: 'https://www.match.com/profile/billing.aspx',
    difficulty: 'hard',
    steps: [
      'PCブラウザで上記URL → ログイン（アプリからは解約不可）',
      '「自動更新の停止」',
      '理由選択 → 引き止め画面を進めて完了',
    ],
    note: 'アプリ内では解約できない。必ずPCブラウザで',
  },
  {
    id: 'soundcloud-go',
    name: 'SoundCloud Go',
    category: 'music',
    emoji: '🎚️',
    domain: 'soundcloud.com',
    cancelUrl: 'https://soundcloud.com/settings/subscriptions',
    difficulty: 'easy',
    steps: [
      '上記URL → ログイン',
      '「Cancel subscription」',
      '確認して完了',
    ],
    note: null,
  },
  {
    id: 'discord-nitro',
    name: 'Discord Nitro',
    category: 'other',
    emoji: '🎮',
    domain: 'discord.com',
    cancelUrl: 'https://discord.com/billing/premium/manage-plan',
    difficulty: 'easy',
    steps: [
      'ユーザー設定 → 「サブスクリプション」',
      '「Nitro をキャンセル」',
      '理由選択 → 確定',
    ],
    note: '請求期間の残り日数分は引き続き利用可能',
  },
  {
    id: 'linkedin-premium',
    name: 'LinkedIn Premium',
    category: 'other',
    emoji: '💼',
    domain: 'linkedin.com',
    cancelUrl: 'https://www.linkedin.com/premium/cancel/',
    difficulty: 'medium',
    steps: [
      '上記URL → 「Continue to cancel」',
      '理由選択（引き止めオファーが複数表示される）',
      '「Confirm cancel」',
    ],
    note: '無料トライアル中の場合、期間内に解約しないと自動課金',
  },
];

// ---------------------------------------------------------------------------
// 解約後の選択肢（ServicePage で表示）
// 構造：
//   id（内部リンク）または url（外部リンク）+ name + reason
// 注：
//   - id 参照は SERVICES の id と一致させる（内部リンクで /service/:id へ）
//   - 外部リンクは「無料代替」「節約系ツール」を中心に。アフィリエイトIDは後で
//     ?utm_source=subsuku のように差し替え可能なように保つ。押し売りは避ける。
// ---------------------------------------------------------------------------

export const ALTERNATIVES = {
  // 動画 — 同価格帯の乗り換え or 無料代替
  netflix: [
    { id: 'disney-plus', reason: '月額990円・ディズニー/マーベル/スターウォーズ系が好きなら' },
    { id: 'amazon-prime', reason: '月額600円・送料無料特典もまとめて' },
    { url: 'https://www.youtube.com/', name: 'YouTube（無料）', reason: '広告ありで多くのドラマ・映画コンテンツが視聴可能' },
  ],
  'amazon-prime': [
    { id: 'netflix', reason: '映画・ドラマだけなら専業の方が充実' },
  ],
  'youtube-premium': [
    { url: 'https://www.youtube.com/', name: 'YouTube（無料）', reason: '広告は入るがコンテンツは同じ' },
    { id: 'spotify', reason: '音楽だけならこちらの方が安い場合あり' },
  ],
  'disney-plus': [
    { id: 'netflix', reason: 'オリジナルドラマ・洋画中心ならこちら' },
    { id: 'u-next', reason: '見放題数31万本以上で和洋ともにカバー' },
  ],
  hulu: [
    { id: 'u-next', reason: '国内ドラマ重視ならこちらも充実' },
    { id: 'amazon-prime', reason: '値段重視ならこちらが圧倒的' },
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円とほぼ同額。ニュース・オリジナル番組・アニメ中心ならこちら。海外ドラマの厚みはHuluが上' },
  ],
  'u-next': [
    { id: 'hulu', reason: '月額料金を抑えたい場合' },
    { id: 'amazon-prime', reason: 'コスパ重視なら最安クラス' },
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円とぐっと安い。ニュース・アニメ・オリジナル番組中心。見放題本数や新作レンタルはU-NEXTが上' },
  ],
  'abema-premium': [
    { url: 'https://abema.tv/', name: 'ABEMA（無料）', reason: 'プレミアム機能不要なら無料版で十分なケースも' },
  ],
  fod: [
    { id: 'u-next', reason: 'フジ系コンテンツも見放題対象' },
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円とやや高くなる。ニュース・バラエティ・アニメの同時配信が強み。フジ系の独占作品はFODでしか見られないものが多い' },
  ],
  lemino: [
    { id: 'amazon-prime', reason: 'コスパ重視の汎用VOD' },
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円とほぼ同額。オリジナル番組・ニュース・格闘技中心なら。ドコモ系特典との連携はLeminoが上' },
  ],
  'dmm-premium': [
    { id: 'amazon-prime', reason: '一般作品中心なら定番の選択' },
  ],
  'wowow-on-demand': [
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円と割安。オリジナル番組・ニュース・アニメ中心なら。映画ラインナップの厚みはWOWOWが上' },
    { id: 'u-next', reason: '映画ラインナップ重視ならこちらも' },
  ],
  'rakuten-tv': [
    { id: 'amazon-prime', reason: '広く浅く見たいなら定番' },
  ],
  dazn: [
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円。サッカー・格闘技・スポーツニュースを安く見たいなら。ただし試合の網羅はDAZNに及ばない' },
    { url: 'https://www.youtube.com/', name: 'YouTube ライブ（無料）', reason: '一部のスポーツは公式チャンネルで無料配信' },
  ],
  danime: [
    { id: 'u-next', reason: '同じドコモグループ・アニメも見放題に多数含む' },
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円とdアニメより高くなる。アニメ専門でなくニュース・バラエティも見たい人向け。アニメ本数の深さはdアニメが上' },
  ],
  'apple-tv-plus': [
    { id: 'amazon-prime', reason: '作品数の幅と価格ならこちら。Appleオリジナルの作り込みとは方向性が違う' },
    { id: 'netflix', reason: 'オリジナル作品の本数で選ぶなら' },
    { id: 'u-next', reason: '和洋の見放題数を最大化したいなら' },
  ],

  // 音楽 — 価格帯違い or 無料プラン
  spotify: [
    { url: 'https://open.spotify.com/', name: 'Spotify Free', reason: '広告ありで完全無料。シャッフル再生のみ' },
    { id: 'youtube-premium', reason: '音楽 + 動画の両方が無料化される' },
    { id: 'amazon-music-unlimited', reason: 'プライム会員は割引' },
  ],
  'apple-music': [
    { id: 'spotify', reason: 'プレイリスト機能が強力' },
    { url: 'https://open.spotify.com/', name: 'Spotify Free', reason: '無料で試したい場合' },
  ],
  'amazon-music-unlimited': [
    { id: 'spotify', reason: '楽曲数は同等で広告ありなら無料版あり' },
  ],
  'line-music': [
    { id: 'spotify', reason: 'プレイリスト・推薦機能が強力' },
  ],
  'rakuten-music': [
    { id: 'spotify', reason: '邦楽・洋楽どちらも豊富' },
  ],

  // ソフト・ツール — 無料代替が強い領域
  'adobe-cc': [
    { url: 'https://www.figma.com/', name: 'Figma（無料プランあり）', reason: 'UI/Webデザインなら無料で十分' },
    { url: 'https://www.canva.com/', name: 'Canva（無料プランあり）', reason: 'バナー・SNS画像なら無料版で対応可' },
    { url: 'https://www.gimp.org/', name: 'GIMP（無料）', reason: '写真編集の無料代替' },
  ],
  'canva-pro': [
    { url: 'https://www.canva.com/', name: 'Canva 無料版', reason: '基本機能は無料で十分なケースも多い' },
    { url: 'https://www.figma.com/', name: 'Figma（無料）', reason: 'デザイン共有・コラボなら強力' },
  ],
  'microsoft-365': [
    { url: 'https://www.google.com/intl/ja/docs/about/', name: 'Google ドキュメント／スプレッドシート（無料）', reason: 'Excel/Word の代替として完成度高い' },
    { url: 'https://www.libreoffice.org/', name: 'LibreOffice（無料）', reason: 'オフライン・無料の Office 互換' },
  ],
  notion: [
    { url: 'https://www.notion.so/', name: 'Notion 無料プラン', reason: '個人利用なら無料で十分なことが多い' },
    { url: 'https://obsidian.md/', name: 'Obsidian（無料）', reason: 'ローカルファイル管理派ならこちら' },
  ],
  dropbox: [
    { id: 'google-one', reason: '15GB 無料・Office連携も強い' },
    { id: 'icloud-plus', reason: 'Apple ユーザーなら自動同期がラク' },
  ],
  evernote: [
    { id: 'notion', reason: 'モダンUIの統合ノート' },
    { url: 'https://keep.google.com/', name: 'Google Keep（無料）', reason: 'シンプルなメモなら無料で十分' },
  ],
  'chatgpt-plus': [
    { id: 'claude-pro', reason: 'コーディング・長文タスクなら有力候補' },
    { url: 'https://chat.openai.com/', name: 'ChatGPT 無料版', reason: 'GPT-5など最新モデルへの利用回数制限を許容できれば' },
  ],
  'claude-pro': [
    { id: 'chatgpt-plus', reason: '汎用性・周辺ツール（GPTs等）重視ならこちら' },
    { url: 'https://claude.ai/', name: 'Claude 無料版', reason: 'たまにしか使わないなら無料版で十分なケースも' },
  ],
  '1password': [
    { url: 'https://bitwarden.com/', name: 'Bitwarden（無料プランあり）', reason: '個人利用なら無料で大半カバー' },
  ],
  figma: [
    { url: 'https://www.figma.com/', name: 'Figma 無料プラン', reason: '小規模・個人なら無料で十分なことも' },
  ],
  'deepl-pro': [
    { url: 'https://www.deepl.com/translator', name: 'DeepL 無料版', reason: '短文・少量利用なら無料で十分' },
    { url: 'https://translate.google.com/', name: 'Google翻訳（無料）', reason: '対応言語数なら最大級' },
  ],
  'github-copilot': [
    { id: 'claude-pro', reason: 'コーディング用途なら同等以上の選択肢' },
    { url: 'https://codeium.com/', name: 'Codeium（無料プランあり）', reason: '個人開発なら無料で代替可能' },
  ],

  // 読み放題・ニュース
  'kindle-unlimited': [
    { id: 'amazon-prime', reason: 'Prime Reading で一部書籍が読み放題に含まれる' },
    { id: 'audible', reason: '聴くスタイルに切り替える選択肢' },
  ],
  audible: [
    { url: 'https://open.spotify.com/', name: 'Spotify ポッドキャスト（無料）', reason: '音声コンテンツなら無料で多数' },
  ],
  'rakuten-magazine': [
    { id: 'dmagazine', reason: '雑誌ラインナップが似ているドコモ系' },
  ],
  dmagazine: [
    { id: 'rakuten-magazine', reason: 'ラインナップが似ている楽天系' },
  ],
  nikkei: [
    { url: 'https://www.nikkei.com/', name: '日経電子版 無料会員', reason: '月10本まで無料で読める' },
  ],
  'nhk-plus': [
    { url: 'https://plus.nhk.jp/', name: 'NHKプラス（受信契約者は無料）', reason: '受信料を払っていれば無料で利用可能' },
  ],
  'note-premium': [
    { url: 'https://note.com/', name: 'note 無料アカウント', reason: '書く側でないなら無料で十分' },
  ],

  // ゲーム
  'nintendo-switch-online': [
    { id: 'playstation-plus', reason: 'PSユーザーへの乗り換え検討' },
  ],
  'playstation-plus': [
    { id: 'xbox-game-pass', reason: 'PCも遊ぶならゲームパスの方が遊び放題感が強い' },
  ],
  'xbox-game-pass': [
    { id: 'playstation-plus', reason: 'PS5ユーザーならこちら' },
  ],

  // バンドル系
  'apple-one': [
    { id: 'apple-music', reason: '音楽だけ必要ならこちら' },
    { id: 'icloud-plus', reason: 'ストレージだけならこちら' },
  ],
  'google-one': [
    { url: 'https://drive.google.com/', name: 'Google Drive 無料15GB', reason: 'ストレージ不要ならダウングレード' },
  ],
  'icloud-plus': [
    { id: 'google-one', reason: '汎用クラウドならこちらの方が安価な場合あり' },
    { id: 'dropbox', reason: 'デバイス間同期の老舗' },
  ],

  // その他
  'yahoo-premium': [
    { url: 'https://www.yahoo.co.jp/', name: 'Yahoo! JAPAN（無料）', reason: '通常利用なら無料アカウントで支障なし' },
  ],
  pairs: [
    { url: 'https://www.matchapp.jp/', name: 'マッチドットコム', reason: '30代以上の真剣婚活なら老舗の選択' },
    { url: 'https://withapp.jp/', name: 'with', reason: '心理テスト型のマッチング' },
  ],
  match: [
    { url: 'https://withapp.jp/', name: 'with', reason: '心理テスト型・若年層向け' },
    { id: 'pairs', reason: '会員数最大級・アプリ操作が中心の人向け' },
  ],
  'niconico-premium': [
    { id: 'youtube-premium', reason: '広告なし＋音楽が便利' },
    { url: 'https://www.nicovideo.jp/', name: 'ニコニコ動画（無料）', reason: '高画質・倍速再生だけ無くてもいい場合' },
  ],
  bookwalker: [
    { id: 'kindle-unlimited', reason: '一般書も含む読み放題' },
    { id: 'rakuten-magazine', reason: '雑誌・コミック中心ならコスパ◎' },
  ],
  honto: [
    { id: 'kindle-unlimited', reason: 'Amazon系で書籍も読み放題' },
  ],
  'rakuten-kobo': [
    { id: 'kindle-unlimited', reason: 'Amazon の電子書籍読み放題' },
  ],
  crunchyroll: [
    { id: 'danime', reason: '日本国内ならdアニメ系がコスパ◎' },
    { id: 'u-next', reason: 'アニメ含む網羅型VOD' },
    { url: 'https://abema.tv/', name: 'ABEMAプレミアム', serviceId: 'abema-premium', reason: '月1,080円とやや高い。アニメの同時配信＋ニュース・バラエティも見るなら。アニメ専門の網羅性はCrunchyrollやdアニメが上' },
  ],
  'vimeo-pro': [
    { url: 'https://www.youtube.com/', name: 'YouTube（無料）', reason: '公開動画の置き場としては圧倒的に無料で十分' },
  ],
  patreon: [
    { url: 'https://fanbox.cc/', name: 'pixiv FANBOX（日本）', reason: '国内クリエイター支援なら手数料が安く済む選択' },
  ],
  'soundcloud-go': [
    { id: 'spotify', reason: 'プレイリスト・楽曲数で優位' },
  ],
  'discord-nitro': [
    { url: 'https://discord.com/', name: 'Discord 無料版', reason: '通話・チャットなど基本機能は無料で十分' },
  ],
  'linkedin-premium': [
    { url: 'https://www.linkedin.com/', name: 'LinkedIn 無料版', reason: '転職活動は無料版で十分機能する' },
  ],
};

// ---------------------------------------------------------------------------
// 月額価格マップ（解約マネジメント・ダッシュボード /tracker で使用）
// 注：
//   - 単位は円・税込・標準プラン
//   - 学割・年契約・複数プランがある場合は最も一般的なプランを採用
//   - 価格改定が頻繁なため、参考値として扱う（正確な額は各サービス側を要確認）
// ---------------------------------------------------------------------------
export const PRICING = {
  netflix: 890,              // 広告つきベーシック。スタンダード1490、プレミアム1980
  'amazon-prime': 600,       // 年間プランは5900（月額換算492）
  spotify: 980,
  'apple-music': 1080,
  'youtube-premium': 1280,
  'disney-plus': 990,
  hulu: 1026,
  'abema-premium': 1080,
  'u-next': 2189,
  dazn: 4200,
  'apple-tv-plus': 900,
  'nhk-plus': 0,             // 受信料に内包
  'line-music': 980,
  'amazon-music-unlimited': 1080,
  'rakuten-music': 980,
  'microsoft-365': 1490,
  'adobe-cc': 6480,          // コンプリートプラン
  notion: 1500,
  dropbox: 1200,
  'canva-pro': 1500,
  'nintendo-switch-online': 306,
  'playstation-plus': 850,
  'xbox-game-pass': 1100,
  nikkei: 4277,
  'kindle-unlimited': 980,
  danime: 550,
  'rakuten-tv': 0,           // 都度課金がメイン
  'chatgpt-plus': 3000,
  'claude-pro': 3000,
  evernote: 1100,
  audible: 1500,
  'rakuten-magazine': 418,
  dmagazine: 580,
  'wowow-on-demand': 2530,
  fod: 976,
  lemino: 990,
  'yahoo-premium': 508,
  'dmm-premium': 550,
  'apple-one': 1200,
  'google-one': 250,         // 100GB プラン
  'icloud-plus': 130,        // 50GB プラン
  '1password': 450,
  figma: 1800,
  'deepl-pro': 1200,
  pairs: 3700,
  'note-premium': 500,
  'github-copilot': 1500,
  'niconico-premium': 790,
  bookwalker: 836,
  honto: 0,                  // 都度購入がメイン
  'rakuten-kobo': 0,         // 都度購入がメイン
  crunchyroll: 850,
  'vimeo-pro': 2700,
  patreon: 1500,             // 平均的なクリエイター月額
  match: 4490,
  'soundcloud-go': 770,
  'discord-nitro': 1050,
  'linkedin-premium': 4400,
};

// ---------------------------------------------------------------------------
// 人気度スコア（HomePage デフォルトソート用・2026-05-23 追加）
//
// 目的：「デタラメ順」を解消し、ユーザーが探しやすい順に並べる
// 基準：知名度・契約者数・検索ボリュームの総合判断
// スコアの目安：
//   100：誰でも知ってる超メジャー
//   90：知ってる人が多い主要サブスク
//   80：それなりに有名
//   70：一定の知名度
//   60：認知度はそこそこ
//   50以下：ニッチ・専門領域
// ---------------------------------------------------------------------------
export const POPULARITY = {
  // 動画系 Top
  netflix: 100,
  'amazon-prime': 100,
  hulu: 85,
  'disney-plus': 85,
  'u-next': 80,
  'abema-premium': 70,
  'apple-tv-plus': 65,
  dazn: 70,
  'nhk-plus': 60,
  fod: 50,
  lemino: 45,
  'wowow-on-demand': 45,
  'rakuten-tv': 40,
  danime: 60,
  crunchyroll: 40,
  'vimeo-pro': 30,

  // 音楽系
  spotify: 100,
  'apple-music': 90,
  'youtube-premium': 95,
  'amazon-music-unlimited': 75,
  'line-music': 65,
  'rakuten-music': 50,
  'soundcloud-go': 35,

  // ソフト・ツール
  'microsoft-365': 90,
  'adobe-cc': 90,
  'chatgpt-plus': 95,
  'claude-pro': 85,
  notion: 80,
  dropbox: 75,
  'canva-pro': 75,
  'github-copilot': 80,
  figma: 75,
  'deepl-pro': 70,
  '1password': 65,
  evernote: 50,

  // ゲーム
  'nintendo-switch-online': 85,
  'playstation-plus': 80,
  'xbox-game-pass': 75,
  'discord-nitro': 50,

  // ニュース・読み放題
  'kindle-unlimited': 85,
  audible: 75,
  'rakuten-magazine': 55,
  dmagazine: 55,
  bookwalker: 40,
  'rakuten-kobo': 45,
  honto: 35,
  nikkei: 50,
  'note-premium': 50,
  'niconico-premium': 65,

  // ショッピング/ストレージ複合
  'apple-one': 75,
  'google-one': 65,
  'icloud-plus': 70,
  'yahoo-premium': 60,
  'dmm-premium': 50,

  // その他
  pairs: 60,
  match: 45,
  patreon: 40,
  'linkedin-premium': 40,
};

/**
 * サービスの人気度スコアを取得（未登録は 0）
 */
export function getPopularity(serviceId) {
  return POPULARITY[serviceId] ?? 0;
}

// ---------------------------------------------------------------------------
// 料金プラン詳細（多プラン対応・2026-05-23 追加）
// PRICING は「代表月額」として後方互換で残す。PLANS は補足情報として併用する。
//
// 構造：
//   plans: [
//     { name: 'プラン名', monthly: 月額(円), yearly?: 年額(円), popular?: 一般的か, note?: '備考' }
//   ]
//
// 注：価格改定が頻繁なため、参考値として扱う（正確な額は各サービス側を要確認）
// ---------------------------------------------------------------------------
export const PLANS = {
  netflix: {
    plans: [
      { name: '広告つきスタンダード', monthly: 890 },
      { name: 'スタンダード', monthly: 1490, popular: true },
      { name: 'プレミアム', monthly: 1980, note: '4K対応・4台同時視聴' },
    ],
    howToCheck: 'Netflix にログイン →「アカウント」→「プランの詳細」で確認できます',
  },
  'amazon-prime': {
    plans: [
      { name: '月額プラン', monthly: 600, popular: true },
      { name: '年額プラン', monthly: 492, yearly: 5900, note: '月換算で月額より108円お得' },
      { name: '学生プラン（Prime Student）', monthly: 300, yearly: 2950 },
    ],
    howToCheck: 'Amazon にログイン →「アカウント＆リスト」→「プライム会員情報の管理」で確認できます',
  },
  spotify: {
    plans: [
      { name: '個人プラン（Premium）', monthly: 980, popular: true },
      { name: 'Duo（2人用）', monthly: 1280, note: '同居家族で2人まで利用可' },
      { name: 'ファミリー（最大6人）', monthly: 1580, note: '同居家族で6人まで' },
      { name: '学生プラン', monthly: 480, note: '大学生・専門学生限定' },
    ],
    howToCheck: 'Spotify にログイン →「アカウント」→「定期プラン」で確認できます',
  },
  hulu: {
    plans: [
      { name: '月額プラン', monthly: 1026, popular: true, note: '広告なし・全コンテンツ見放題' },
      { name: '年額プラン', monthly: 854, yearly: 10240, note: '月換算で月額より172円お得' },
    ],
    howToCheck: 'Hulu にログイン →「アカウント」→「契約情報」で確認できます',
  },
  'u-next': {
    plans: [
      { name: '月額プラン', monthly: 2189, popular: true, note: '1200ポイント付与・最大4アカウント' },
    ],
    howToCheck: 'U-NEXT にログイン →「アカウント・契約」→「契約内容の確認」で確認できます',
  },
  'youtube-premium': {
    plans: [
      { name: '個人プラン', monthly: 1280, popular: true },
      { name: 'ファミリープラン（最大5人）', monthly: 2280, note: '同居家族で5人まで' },
      { name: '学生プラン', monthly: 780, note: '大学生・専門学生限定' },
    ],
    howToCheck: 'YouTube にログイン →「購入とメンバーシップ」→「YouTube Premium」で確認できます',
  },
  'disney-plus': {
    plans: [
      { name: 'スタンダード', monthly: 1140, popular: true, note: 'フルHD画質・4台同時視聴' },
      { name: 'プレミアム', monthly: 1520, note: '4K画質・Dolby Atmos対応' },
    ],
    howToCheck: 'Disney+ にログイン →「アカウント」→「サブスクリプション」で確認できます',
  },
  'apple-music': {
    plans: [
      { name: '個人プラン', monthly: 1080, popular: true },
      { name: 'ファミリープラン（最大6人）', monthly: 1680, note: '同居家族で6人まで' },
      { name: '学生プラン', monthly: 580, note: '大学生・専門学生限定' },
    ],
    howToCheck: '「設定」→ Apple ID →「メディアと購入」→「サブスクリプション」で確認できます',
  },
  dazn: {
    plans: [
      { name: '月額プラン', monthly: 4200, popular: true },
      { name: '年額プラン（月払い）', monthly: 3000, yearly: 36000, note: '月額より大幅にお得・解約縛りあり' },
      { name: '年額プラン（一括払い）', monthly: 2500, yearly: 30000, note: '最もお得・全額前払い' },
    ],
    howToCheck: 'DAZN にログイン →「マイ・アカウント」→「マイ・プラン」で確認できます',
  },
  'apple-one': {
    plans: [
      { name: '個人プラン', monthly: 1200, popular: true, note: 'Music + TV+ + Arcade + iCloud 50GB' },
      { name: 'ファミリープラン', monthly: 1980, note: 'iCloud 200GB に増量・最大5人共有' },
      { name: 'プレミアプラン', monthly: 3580, note: 'iCloud 2TB・Fitness+・News+ も追加' },
    ],
    howToCheck: '「設定」→ Apple ID →「サブスクリプション」で確認できます',
  },
  // ---- Top11-30（2026-05-23 追加） ----
  'microsoft-365': {
    plans: [
      { name: 'Personal（1人用）', monthly: 1490, yearly: 14900, popular: true, note: 'Office 全アプリ + OneDrive 1TB' },
      { name: 'Family（最大6人）', monthly: 2100, yearly: 21000, note: '家族で 1TB×6 = 6TB のクラウド' },
    ],
    howToCheck: 'Microsoft アカウント →「サービスとサブスクリプション」で確認できます',
  },
  'adobe-cc': {
    plans: [
      { name: 'フォトプラン（Photoshop + Lightroom）', monthly: 1180, popular: true },
      { name: '単体プラン（Photoshop のみ等）', monthly: 2728 },
      { name: 'コンプリートプラン（全アプリ）', monthly: 6480 },
      { name: '学生・教職員向け', monthly: 1980, note: '本人確認必要・最初の1年' },
    ],
    howToCheck: 'Adobe アカウント →「プラン情報」で確認できます',
  },
  danime: {
    plans: [
      { name: '月額プラン', monthly: 550, popular: true, note: 'docomo 以外でも契約可' },
    ],
    howToCheck: 'dアニメストア →「マイページ」→「契約内容の確認」で確認できます',
  },
  notion: {
    plans: [
      { name: 'Free（無料）', monthly: 0 },
      { name: 'Plus', monthly: 1500, popular: true, note: '無制限ファイル・30日履歴' },
      { name: 'Business', monthly: 2250, note: 'SAML SSO・90日履歴' },
    ],
    howToCheck: 'Notion →「Settings & members」→「Plans」で確認できます',
  },
  dropbox: {
    plans: [
      { name: 'Plus（2TB）', monthly: 1200, popular: true },
      { name: 'Essentials（3TB）', monthly: 2400 },
      { name: 'Family（2TB・最大6人）', monthly: 2000 },
    ],
    howToCheck: 'Dropbox →「アカウント設定」→「プラン」で確認できます',
  },
  'canva-pro': {
    plans: [
      { name: 'Pro（個人）', monthly: 1500, yearly: 12000, popular: true },
      { name: 'Teams（チーム）', monthly: 1800, note: '人数分課金・最低3人〜' },
    ],
    howToCheck: 'Canva →「設定」→「請求とチーム」で確認できます',
  },
  'nintendo-switch-online': {
    plans: [
      { name: '個人プラン', monthly: 306, yearly: 2400, popular: true },
      { name: 'ファミリープラン（最大8人）', monthly: 366, yearly: 4500 },
      { name: '追加パック（個人）', monthly: 416, yearly: 4900, note: 'N64・メガドラ等の旧作も遊べる' },
    ],
    howToCheck: 'Nintendo Switch →「ニンテンドーアカウント」→「Switch Online」で確認できます',
  },
  'playstation-plus': {
    plans: [
      { name: 'Essential', monthly: 850, yearly: 8600, popular: true, note: '従来のPS Plus 相当' },
      { name: 'Extra', monthly: 1300, yearly: 13900, note: 'カタログから400本以上遊び放題' },
      { name: 'Premium', monthly: 1550, yearly: 16700, note: 'クラシックタイトル + クラウドストリーミング' },
    ],
    howToCheck: 'PlayStation →「設定」→「アカウント管理」→「サブスクリプション」で確認できます',
  },
  'xbox-game-pass': {
    plans: [
      { name: 'Core', monthly: 842, note: 'マルチプレイ + 限定タイトル' },
      { name: 'PC Game Pass', monthly: 1100, popular: true, note: 'PC ゲーム遊び放題' },
      { name: 'Ultimate', monthly: 1680, note: 'PC + Console + EA Play + クラウド' },
    ],
    howToCheck: 'Microsoft アカウント →「サービスとサブスクリプション」で確認できます',
  },
  'chatgpt-plus': {
    plans: [
      { name: 'Plus（個人）', monthly: 3000, popular: true, note: 'GPT-4o・画像生成・優先アクセス' },
      { name: 'Team（チーム）', monthly: 4500, note: '人数分課金・最低2人〜' },
      { name: 'Pro', monthly: 30000, note: 'o1 無制限・上級モデル' },
    ],
    howToCheck: 'ChatGPT →「Settings」→「Subscription」で確認できます',
  },
  'claude-pro': {
    plans: [
      { name: 'Pro', monthly: 3000, popular: true, note: '5倍多くメッセージ送信可' },
      { name: 'Max（5x）', monthly: 15000, note: 'Pro の5倍利用枠' },
      { name: 'Max（20x）', monthly: 30000, note: 'Pro の20倍利用枠' },
    ],
    howToCheck: 'Claude →「Settings」→「Plans & Billing」で確認できます',
  },
  figma: {
    plans: [
      { name: 'Starter（無料）', monthly: 0 },
      { name: 'Professional', monthly: 1800, yearly: 18000, popular: true },
      { name: 'Organization', monthly: 6750, note: 'デザインシステム機能 + SSO' },
    ],
    howToCheck: 'Figma →「Settings」→「Plan & billing」で確認できます',
  },
  'github-copilot': {
    plans: [
      { name: 'Individual', monthly: 1500, yearly: 15000, popular: true },
      { name: 'Business', monthly: 2900, note: 'ライセンス管理 + プライバシー強化' },
      { name: 'Enterprise', monthly: 5550, note: '内製モデル + ナレッジベース統合' },
    ],
    howToCheck: 'GitHub →「Settings」→「Billing and plans」→「Copilot」で確認できます',
  },
  'niconico-premium': {
    plans: [
      { name: 'プレミアム会員', monthly: 790, popular: true },
    ],
    howToCheck: 'ニコニコ →「アカウント」→「プレミアム会員」で確認できます',
  },
  crunchyroll: {
    plans: [
      { name: 'Fan', monthly: 850, popular: true, note: '広告なし・全アニメ視聴' },
      { name: 'Mega Fan', monthly: 1080, note: '同時4台 + オフライン再生' },
      { name: 'Ultimate Fan', monthly: 1280, note: '同時6台 + 限定特典' },
    ],
    howToCheck: 'Crunchyroll →「アカウント」→「メンバーシップ」で確認できます',
  },
  // ---- Top31-50（2026-05-23 追加・人気度60〜75） ----
  'amazon-music-unlimited': {
    plans: [
      { name: '個人プラン', monthly: 1080, popular: true, note: 'Prime会員は980円' },
      { name: 'ファミリープラン', monthly: 1680, note: '最大6人' },
      { name: '学生プラン', monthly: 580 },
    ],
    howToCheck: 'Amazon →「アカウントサービス」→「Music Unlimited 会員情報」で確認できます',
  },
  'line-music': {
    plans: [
      { name: '一般プラン', monthly: 980, popular: true },
      { name: '学生プラン', monthly: 580, note: '中高大生・本人確認必要' },
      { name: 'ファミリープラン', monthly: 1480, note: '最大6人' },
    ],
    howToCheck: 'LINE MUSIC アプリ →「マイページ」→「メンバーシップ」で確認できます',
  },
  'rakuten-music': {
    plans: [
      { name: 'スタンダード（楽天モバイル契約者）', monthly: 0, popular: true, note: '楽天モバイル契約で無料' },
      { name: 'スタンダード（一般）', monthly: 980 },
      { name: 'ライトプラン', monthly: 500 },
    ],
    howToCheck: '楽天ミュージック →「マイページ」→「契約情報」で確認できます',
  },
  'apple-tv-plus': {
    plans: [
      { name: '月額プラン', monthly: 900, popular: true },
      { name: '年額プラン', monthly: 750, yearly: 9000, note: '月額より150円安い' },
    ],
    howToCheck: '「設定」→ Apple ID →「サブスクリプション」で確認できます',
  },
  'icloud-plus': {
    plans: [
      { name: '50GB', monthly: 130, popular: true },
      { name: '200GB', monthly: 400, note: '家族共有可' },
      { name: '2TB', monthly: 1300, note: 'プライベートリレー対応' },
      { name: '6TB', monthly: 3900 },
      { name: '12TB', monthly: 7900 },
    ],
    howToCheck: '「設定」→ Apple ID →「iCloud」→「ストレージプラン」で確認できます',
  },
  'google-one': {
    plans: [
      { name: 'ベーシック（100GB）', monthly: 250, popular: true, yearly: 2500 },
      { name: 'プレミアム（2TB）', monthly: 1300, yearly: 13000 },
      { name: 'AI プレミアム（2TB + Gemini Advanced）', monthly: 2900 },
    ],
    howToCheck: 'one.google.com にログインして「会員情報」で確認できます',
  },
  audible: {
    plans: [
      { name: '月額プラン', monthly: 1500, popular: true, note: '聴き放題（一部対象外あり）' },
    ],
    howToCheck: 'Amazon →「アカウントサービス」→「Audible 会員情報」で確認できます',
  },
  'kindle-unlimited': {
    plans: [
      { name: '月額プラン', monthly: 980, popular: true, note: '200万冊以上が読み放題' },
    ],
    howToCheck: 'Amazon →「アカウントサービス」→「Kindle Unlimited 会員登録の管理」で確認できます',
  },
  'rakuten-magazine': {
    plans: [
      { name: '月額プラン', monthly: 418, popular: true, note: '700誌以上が読み放題' },
      { name: '年額プラン', monthly: 350, yearly: 4180 },
    ],
    howToCheck: '楽天マガジン → ログイン →「契約状況の確認」で確認できます',
  },
  dmagazine: {
    plans: [
      { name: '月額プラン', monthly: 580, popular: true, note: 'docomo以外も契約可' },
    ],
    howToCheck: 'dマガジン → My docomo or マイページで確認できます',
  },
  'yahoo-premium': {
    plans: [
      { name: '月額プラン', monthly: 508, popular: true, note: 'Yahoo!ショッピングのポイント還元含む' },
    ],
    howToCheck: 'Yahoo! JAPAN ID →「Yahoo!プレミアム会員サービス」で確認できます',
  },
  'dmm-premium': {
    plans: [
      { name: '月額プラン', monthly: 550, popular: true, note: 'DMM TV見放題・ポイント特典' },
    ],
    howToCheck: 'DMM.com →「マイアカウント」→「メンバーシップ」で確認できます',
  },
  '1password': {
    plans: [
      { name: '個人プラン', monthly: 450, popular: true, yearly: 4500 },
      { name: 'ファミリー（5人）', monthly: 750, yearly: 7500, note: '家族で共有可' },
    ],
    howToCheck: '1Password →「マイプロフィール」→「アカウント」で確認できます',
  },
  'deepl-pro': {
    plans: [
      { name: 'Starter', monthly: 1200, popular: true, note: '文字数無制限・ファイル翻訳' },
      { name: 'Advanced', monthly: 3800, note: 'カスタム用語集' },
      { name: 'Ultimate', monthly: 7500, note: 'CAT 連携・API 大規模' },
    ],
    howToCheck: 'DeepL →「アカウント」→「サブスクリプション」で確認できます',
  },
  evernote: {
    plans: [
      { name: 'Personal', monthly: 1100, popular: true },
      { name: 'Professional', monthly: 1550 },
    ],
    howToCheck: 'Evernote →「アカウント設定」→「請求情報」で確認できます',
  },
  pairs: {
    plans: [
      { name: '男性会員（クレカ）', monthly: 3700, popular: true },
      { name: '男性会員（Apple/Google）', monthly: 4300 },
      { name: '女性会員', monthly: 0, note: '基本無料（プレミアム機能のみ有料）' },
    ],
    howToCheck: 'Pairs → マイページ →「ご契約情報」で確認できます',
  },
  match: {
    plans: [
      { name: '月額プラン（1ヶ月）', monthly: 4490, popular: true },
      { name: '3ヶ月プラン', monthly: 3990, yearly: 11970 },
      { name: '12ヶ月プラン', monthly: 2390, yearly: 28680 },
    ],
    howToCheck: 'Match.com → マイページ →「ご契約状況」で確認できます',
  },
  'note-premium': {
    plans: [
      { name: 'プレミアム会員', monthly: 500, popular: true, note: '機能アップグレード・マガジン作成可' },
    ],
    howToCheck: 'note → アカウント設定 →「会員情報」で確認できます',
  },
  fod: {
    plans: [
      { name: 'プレミアム月額', monthly: 976, popular: true, note: 'フジテレビ系コンテンツ見放題' },
    ],
    howToCheck: 'FOD →「マイメニュー」→「契約状況」で確認できます',
  },
  lemino: {
    plans: [
      { name: 'プレミアム月額', monthly: 990, popular: true },
    ],
    howToCheck: 'Lemino →「マイページ」→「契約情報」で確認できます',
  },
};

// ---------------------------------------------------------------------------
// 為替レート（USD→JPY）— 2026-06-01 俊雄さん指示
// ・USD建てサブスク（ChatGPT Plus / Claude Pro 等）は ¥USD_JPY で換算する
// ・±5円超 変動するまで 155 で固定。為替が大きく動いたら、この数値だけを更新する
// ・USD_PRICED に { serviceId: 月額USD } を足すと、PRICING / 単一PLAN が自動換算される
// ---------------------------------------------------------------------------
export const USD_JPY = 155;
// 既存の PRICING / PLANS の円価格は旧レート（1ドル=150円）で作られている。
// USD建てサービスは新レートへ等比補正する（例: Plus 3000=$20 → 3100）。
// ⚠️ USD_PRICED のサービスは、PRICING/PLANS を常に「150円換算の円値」で記述すること。
//    155円で直接書くと二重換算になる。
const USD_JPY_PREV = 150;
export const USD_PRICED = {
  'chatgpt-plus': 20,
  'claude-pro': 20,
};
for (const [id] of Object.entries(USD_PRICED)) {
  const adjust = (yen) => Math.round((yen * USD_JPY) / USD_JPY_PREV);
  if (typeof PRICING[id] === 'number') PRICING[id] = adjust(PRICING[id]);
  const planEntry = PLANS[id];
  if (planEntry?.plans) {
    for (const p of planEntry.plans) {
      if (typeof p.monthly === 'number') p.monthly = adjust(p.monthly);
      if (typeof p.yearly === 'number') p.yearly = adjust(p.yearly);
    }
  }
}

// ---------------------------------------------------------------------------
// 料金プラン関連のヘルパー関数（後方互換維持）
// ---------------------------------------------------------------------------

/**
 * サービスの代表月額を取得する
 * @param {string} serviceId
 * @returns {number} 月額（円）。設定がなければ 0
 */
export function getDefaultMonthly(serviceId) {
  const plansEntry = PLANS[serviceId];
  if (plansEntry?.plans) {
    const popular = plansEntry.plans.find((p) => p.popular);
    if (popular) return popular.monthly;
    return plansEntry.plans[0]?.monthly ?? 0;
  }
  return PRICING[serviceId] ?? 0;
}

/**
 * サービスの全プランを取得する
 * @param {string} serviceId
 * @returns {Array} プラン配列。設定がなければ空配列
 */
export function getPlans(serviceId) {
  return PLANS[serviceId]?.plans || [];
}

/**
 * 「自分のプラン確認方法」テキストを取得する
 * @param {string} serviceId
 * @returns {string|null}
 */
export function getPlanCheckHint(serviceId) {
  return PLANS[serviceId]?.howToCheck || null;
}

/**
 * 月額の最小値〜最大値の表示文字列を生成する
 * 例: "¥890〜¥1,980" / "¥1,490"
 * @param {string} serviceId
 * @returns {string}
 */
export function formatMonthlyRange(serviceId) {
  const plans = getPlans(serviceId);
  if (plans.length === 0) {
    const v = getDefaultMonthly(serviceId);
    return v > 0 ? `¥${v.toLocaleString('ja-JP')}` : '';
  }
  const amounts = plans.map((p) => p.monthly).filter((v) => v > 0);
  if (amounts.length === 0) return '';
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  if (min === max) return `¥${min.toLocaleString('ja-JP')}`;
  return `¥${min.toLocaleString('ja-JP')}〜¥${max.toLocaleString('ja-JP')}`;
}

// ---------------------------------------------------------------------------
// 拡張コンテンツ（ServicePage で長文化・FAQPage JSON-LD に出力）
// Top10 サービス（流入見込み大）から優先的に充実させる
// ---------------------------------------------------------------------------
export const EXTENDED_CONTENT = {
  netflix: {
    summary:
      'Netflix は世界最大の動画配信サービス。会員数は2.7億人を超え、オリジナル作品『ストレンジャー・シングス』『イカゲーム』などで知られる。月額890円（広告つきベーシック）から1980円（プレミアム）の3プラン。',
    whyHard:
      'Netflix の解約は実は「かんたん」な部類。アカウントページから3クリックで完了する設計で、引き止めも控えめ。ただし「メンバーシップを一時停止」と「キャンセル」が並んで表示されるため、間違って一時停止を選ばないよう注意。',
    darkPatterns: [
      { trigger: '「メンバーシップを一時停止」が大きく表示される', response: '解約したいなら必ず「メンバーシップのキャンセル」を選ぶ。一時停止は10ヶ月後に自動再開する' },
      { trigger: '「再加入は簡単です」のメッセージ', response: '実際10ヶ月以内ならアカウント設定や視聴履歴も全て復元されるが、それは解約を躊躇させるための情報。気にせず進める' },
    ],
    afterCancel:
      '解約後も請求期間の末日まで視聴可能。ダウンロード済みコンテンツは即時アクセス不可になることがある。10ヶ月以内なら再加入時にプロフィールと視聴履歴が復元される。完全に消したい場合は別途「アカウントの削除」が必要。',
    faq: [
      { q: 'スマホアプリから Netflix を解約できますか？', a: 'iPhone/Android アプリでの直接解約はできません。ブラウザで netflix.com にログインしてください。ただしアプリ内課金（iTunes 決済）の場合は iPhone「設定」のサブスクリプションから解約します。' },
      { q: '請求日の前日に解約すれば翌月の請求を止められますか？', a: 'はい。請求日の前までに解約すれば次回課金は発生しません。請求日当日に解約しても翌月課金は止まりますが、当月分は返金されません。' },
      { q: '解約後にデータは消えますか？', a: 'プロフィールと視聴履歴は10ヶ月間保持されます。10ヶ月以内に再加入すれば全て復元されます。' },
    ],
  },
  'amazon-prime': {
    summary:
      'Amazon プライムは送料無料・Prime Video・Prime Music・Prime Reading など複数特典がついた月額600円（年額5900円）のサブスク。日本で最も契約者数の多いサブスクの一つ。',
    whyHard:
      'Amazon の解約ページは何度もクリックさせる UX が特徴。「特典を終了する」ボタンを3回押す必要があり、間に「継続するとお得です」のキャンペーン誘導が複数挟まる。年契約の場合は「期間途中でも解約可能だが返金は使用日数分のみ」という独自ルール。',
    darkPatterns: [
      { trigger: '「3日間無料体験を再度ご利用ください」', response: '以前無料体験を使ったアカウントは2回目以降の無料体験は基本不可。誘惑だけ' },
      { trigger: '「プライム会員のままで Music HD を試す」など別特典の案内', response: '解約意図が固いなら全部スキップ。下の方の薄い「特典を終了する」を探す' },
      { trigger: '解約完了後も「30日以内なら復活させる」ボタンが残る', response: '気にしなくてよい。再加入したくなったら普通に申し込める' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで全特典が継続。Prime Video のダウンロード済みは即時アクセス不可。Prime Reading で読み始めた本は購入扱いになっていなければ消える。Amazon フォトの容量も無制限から5GBへ。',
    faq: [
      { q: '年間プランを途中解約したら返金はありますか？', a: '使用していない期間に応じて日割り返金されます。ただし Prime 特典を使った形跡があると返金額が大きく減るので、頻繁に使うなら月額より年額の方がお得です。' },
      { q: 'Amazon アカウント自体は残りますか？', a: 'はい。Prime 会員資格だけ解除され、通常の Amazon 買い物は引き続き可能です。' },
      { q: 'プライム会員家族会員も自動的に解約されますか？', a: 'はい。家族会員（プライム共有設定）も同時に解除されます。' },
    ],
  },
  spotify: {
    summary:
      'Spotify は世界最大の音楽ストリーミングサービス。月額980円のプレミアムで広告なし・オフライン再生・高音質。無料プラン（広告あり・シャッフル制限）も継続提供。',
    whyHard:
      'Spotify の解約自体は3クリックで完了する。ただしスマホアプリからは解約できず、必ずブラウザでアクセスする必要がある。これを知らずに「設定→サブスクリプション」を探しても見つからないので、最初で詰まる人が多い。',
    darkPatterns: [
      { trigger: 'スマホアプリの設定に解約ボタンが無い', response: 'ブラウザで spotify.com にログインしてから操作する' },
      { trigger: '「無料プランに切り替えますか」の確認', response: '無料プランに切り替えるなら「ダウングレード」、完全解約は別ボタン' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで Premium 機能が継続。期間満了後は自動的に無料プランへ移行。プレイリスト・ライブラリ・フォロー履歴は全て保持される。ダウンロード済み楽曲はオフライン再生不可になる。',
    faq: [
      { q: 'アプリから解約できないのはなぜですか？', a: 'Spotify はアプリ内課金（Apple/Google への手数料）を避けるため、ブラウザ経由の解約のみ受け付けています。iTunes 経由で登録した場合のみ「設定→Apple ID→サブスクリプション」から解約します。' },
      { q: '解約後もプレイリストは残りますか？', a: 'はい。無料プランへ自動移行するので、アカウント情報・プレイリスト・ライブラリは全て残ります。' },
      { q: 'ファミリープランを家族の誰かが解約したら他の人はどうなりますか？', a: 'オーナー（決済者）が解約した場合、家族全員の Premium が同時に切れます。' },
    ],
  },
  'u-next': {
    summary:
      'U-NEXT は国内最大級の動画配信サービス。31万本以上見放題で月額2189円。毎月1200ポイント（最新作レンタル相当）が付与される。雑誌読み放題も込み。',
    whyHard:
      'U-NEXT の解約は「むずかしい」最上位。マイページの下層メニューに隠された「解約はこちら」リンクを見つけるところから始まり、進むほど「ポイントの残高がもったいない」と複数回引き止められる。ページ最下部までスクロールしないと次に進むボタンが見えない設計。',
    darkPatterns: [
      { trigger: '「解約はこちら」リンクがページ最下部に小さく配置', response: 'マイメニュー → 契約内容の確認・変更 → 一番下までスクロール' },
      { trigger: '「ポイントが消滅します（◯ポイント）」の警告', response: 'ポイントは解約と同時に失効。使ってから解約するか、消えるのを許容するか選ぶ' },
      { trigger: '「視聴中の作品が見られなくなります」', response: 'はい、その通り。それを承知で進める' },
      { trigger: '理由選択画面で30個以上の選択肢', response: '適当なもの（「あまり利用しなかった」等）を1つ選んで進める' },
    ],
    afterCancel:
      '解約と同時に全機能が利用不可になる（請求期間が残っていても）。保有ポイントは消滅。視聴履歴・お気に入りは保持されない。ファミリーアカウント（最大4人）も同時に解約。再加入時には別アカウントになる。',
    faq: [
      { q: 'U-NEXT のポイントを使い切ってから解約したい場合は？', a: '解約手続きを進めると最後に「ポイントが◯失効します」と表示されます。一度キャンセルしてポイントを使ってから戻る方法は無いので、解約する月までに計画的にポイントを消化してください。' },
      { q: '解約後、ダウンロード済みの動画は見られますか？', a: '解約と同時にアプリ内のダウンロード動画も即時アクセス不可になります。Netflix と違って期間末まで継続視聴できません。' },
      { q: 'ファミリーアカウントの追加メンバーだけ解約したい場合は？', a: '個別解約はできません。オーナー（決済者）が「ファミリーアカウント設定」から該当メンバーを削除します。' },
    ],
  },
  'adobe-cc': {
    summary:
      'Adobe Creative Cloud（CC）は Photoshop・Illustrator・Premiere Pro 等のプロ向けクリエイティブツール群。月額6480円（コンプリートプラン）。単一アプリプランは2728円から。',
    whyHard:
      'Adobe の解約は「むずかしい」。年間契約が標準で、途中解約には残り月数の50%相当の違約金が発生する場合がある。さらに引き止め画面が6〜8段階あり、Adobe側から「割引オファー」を提示されることも。',
    darkPatterns: [
      { trigger: '「残り◯ヶ月の50%相当の違約金が発生します」', response: '年間契約の場合は事実。月額換算で見直し、本当に解約すべきか判断する' },
      { trigger: '「2ヶ月無料で継続しませんか」のオファー', response: '本当に必要なら受ける、要らないなら断る。価値で判断' },
      { trigger: '理由選択 → 解決策の提示 → さらに引き止め画面', response: '6〜8回の確認を全て「続行する」「キャンセルする」で進める' },
      { trigger: '電話相談のサジェスト', response: '電話は不要。Web で完結できる' },
    ],
    afterCancel:
      '違約金（年契約途中解約時）は即時請求。月額契約は期間末まで利用可能。クラウドストレージ（100GB）に保存したファイルは解約後1年でアクセス不可。Adobe Fonts も即時アクセス不可になる。デスクトップアプリは「体験版モード」で起動する。',
    faq: [
      { q: 'Adobe の解約時の違約金を回避する方法はありますか？', a: '年間契約は契約日から14日以内なら全額返金（クーリングオフ）。それ以降は違約金が発生します。月額プランへの切り替えなら違約金なし。年契約の更新月（11ヶ月目あたり）に解約予約すれば違約金回避できます。' },
      { q: '保存したクラウドファイルはいつまで残りますか？', a: '解約後30日間は閲覧可能、その後は90日間「制限付きアクセス」、合計約120日（最長1年）でアクセス不可になります。重要なファイルは事前にダウンロード推奨。' },
      { q: '解約後、Adobe ID は残りますか？', a: 'はい。ID 自体は残り、無料の Adobe Express や Photoshop モバイル版は引き続き使えます。' },
    ],
  },
  'chatgpt-plus': {
    summary:
      'ChatGPT Plus は OpenAI が提供する月額約3100円（$20・1ドル155円換算）の ChatGPT 有料プラン。最新モデル（GPT-5等）への優先アクセス、画像生成、データ分析、メモリ機能などが利用可能。',
    whyHard:
      'ChatGPT Plus の解約は「かんたん」。設定画面から3クリックで完了。引き止めも控えめ。ただし「無料版に戻る」のか「Plus を継続する」のか分かりにくい UI なので、間違って続行ボタンを押さないよう注意。',
    darkPatterns: [
      { trigger: '「Plus の特典が使えなくなります」リスト表示', response: '無料版でも基本的な ChatGPT は使えるので、本当に Plus が必要か再確認' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで Plus 機能を継続利用可能。期間満了後は無料プランへ自動移行。会話履歴・カスタム指示・GPTs は全て保持される。',
    faq: [
      { q: 'ChatGPT Plus を解約しても作成した GPTs は使えますか？', a: '自分が作成した GPTs は無料プランでも使えますが、Plus 限定モデル（GPT-5等）を使う GPTs は無料版モデルで動くようになります。' },
      { q: '解約後、Plus に戻ることはできますか？', a: 'はい、いつでも再加入できます。会話履歴・設定もそのまま残るので、シームレスに復帰できます。' },
      { q: '請求が日本円で表示されないのですが？', a: 'ChatGPT は USD 課金なので、為替で月額3000円前後で変動します。請求書はクレジットカード明細で円換算が表示されます。' },
    ],
  },
  audible: {
    summary:
      'Audible（オーディブル）は Amazon が運営するオーディオブック聴き放題サービス。月額1500円で12万作品以上が聴き放題。月1冊の追加コインも付与（以前のプラン名残）。',
    whyHard:
      'Audible の解約は「むずかしい」最上位レベル。スマホアプリからは絶対に解約できず、PC ブラウザでないと解約ページにすらたどり着けない。さらに退会前に複数回の引き止めオファーがある。',
    darkPatterns: [
      { trigger: 'アプリ内に解約ボタンが存在しない', response: 'PC ブラウザで audible.co.jp にログイン。アプリ→「マイページ」→「アカウントサービス」→PC版へ誘導される' },
      { trigger: '「3ヶ月50%オフで継続しませんか」のオファー', response: '本当に必要か判断。気軽に受けると忘れて結局フル課金が続く' },
      { trigger: '「退会前にお伺いします」と理由を聞く画面', response: '「あまり聴かなかった」を選んで進む' },
      { trigger: '解約完了画面でも「やっぱり継続」が大きく表示', response: '完全に進み切るまで安心しない' },
    ],
    afterCancel:
      '解約と同時に聴き放題作品は再生不可。コインで購入したオーディオブックは退会後も「マイライブラリ」に残り永久所有可能。会員特典の月1冊以上のコイン購入もリセット。',
    faq: [
      { q: 'コインで買ったオーディオブックは解約後も聴けますか？', a: 'はい。コインを使って購入したタイトルは「永久所有」扱いで、解約後も自分のライブラリから再生できます。これは Audible の重要なメリット。' },
      { q: 'スマホからしか操作できない場合の解約方法は？', a: 'スマホブラウザでも PC モードに切り替えれば（Safari なら「デスクトップ用 Web サイトを表示」）解約ページに入れます。または PC を借りるか、Amazon カスタマーサービスに電話。' },
      { q: '解約後にコインは消えますか？', a: 'はい、未使用コインは即座に失効します。解約前にコインを使い切ることを推奨します。' },
    ],
  },
  hulu: {
    summary:
      'Hulu（日本版）は日本テレビが運営する動画配信サービス。月額1026円で見放題。国内ドラマ・バラエティに強く、日テレ系最新話の見逃し配信も。',
    whyHard:
      'Hulu の解約は「ふつう」レベル。マイページから「登録情報」→「解約手続きはこちら」と進む直線的なフロー。引き止めも数回程度で済む。',
    darkPatterns: [
      { trigger: 'クレカ決済以外の場合は申し込み元（iTunes/Google Play）でしか解約できない', response: 'iPhone なら「設定→Apple ID→サブスクリプション」、Android なら Play ストア→定期購入から' },
      { trigger: '「解約後はダウンロード作品も視聴不可」', response: '事実。重要な作品は解約前に視聴を済ませる' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで視聴可能。期間中はダウンロード再生も可能。視聴履歴・お気に入りは保持される。',
    faq: [
      { q: 'Hulu とディズニープラスを同時契約していますが、Hulu だけ解約できますか？', a: '日本の Hulu とディズニープラスは別契約なので個別解約可能。米国の Disney Bundle とは仕組みが異なります。' },
      { q: '無料トライアル期間中の解約は？', a: '期間内に解約すれば一切課金されません。自動更新前に解約を済ませてください。' },
      { q: '解約後に再加入する場合、視聴履歴は残っていますか？', a: 'はい、Hulu アカウント自体は残り、お気に入り・視聴履歴も保持されます。' },
    ],
  },
  'disney-plus': {
    summary:
      'Disney+ はディズニー・ピクサー・マーベル・スター・ウォーズ・ナショジオの作品が見放題。月額990円のスタンダードプランから。アニメ・洋画ファンに人気。',
    whyHard:
      'Disney+ の解約は「かんたん」。アカウントページから直接「解約する」ボタンが見える素直な UI。引き止めも控えめで2〜3ステップで完了。',
    darkPatterns: [
      { trigger: 'アプリ経由（iTunes/Google）課金の場合は Disney+ 画面で解約できない', response: '各ストアの設定から解約' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで視聴可能。プロフィールと視聴履歴は数ヶ月間保持され、再加入時に復元される。',
    faq: [
      { q: 'NTTドコモから契約した Disney+ の解約は？', a: 'ドコモ系プランの場合は My docomo から解約します。Disney+ アカウントページからは解約できません。' },
      { q: '年間プランの途中解約はできますか？', a: 'はい、いつでも解約可能ですが、年間プランの場合は残期間の返金はありません。期間末まで利用してください。' },
      { q: 'プロフィールはいつまで残りますか？', a: 'Disney+ は再加入時にプロフィール・お気に入り・視聴履歴が復元されます。期間は明示されていませんが概ね1年程度残るとされています。' },
    ],
  },
  'yahoo-premium': {
    summary:
      'Yahoo!プレミアムは月額508円で Yahoo!ショッピング・PayPay 還元アップ・Yahoo!かんたんバックアップ・ebook japan 連携などを提供。LYP会員制度（旧Yahoo!プレミアム）として継続中。',
    whyHard:
      'Yahoo!プレミアム の解約は「むずかしい」レベル。引き止めバナーが何度も表示され、ページの上下に「解約しないでください」のメッセージが散在。本物の解約ボタンを見つけるのに数分かかる。',
    darkPatterns: [
      { trigger: '「PayPay 還元率が下がります」の警告', response: '事実だが、それでも解約したいなら気にせず進む' },
      { trigger: '「もう少し続けてみませんか」の引き止め', response: '右上の「次へ」を進める' },
      { trigger: '解約画面の最下部に隠された「解約する」', response: 'ページを必ず最下部までスクロール' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで全特典が継続。期間満了後は通常の Yahoo! JAPAN ID（無料）に戻る。PayPay 連携は維持。ebook japan で購入済みの書籍は引き続き読める。',
    faq: [
      { q: 'Yahoo!プレミアムを解約しても PayPay は使えますか？', a: 'はい、PayPay 自体は独立サービスなので使えます。ただし PayPay ステップ（還元率アップ）の判定条件が変わります。' },
      { q: 'LYP プレミアムと Yahoo!プレミアムは違うのですか？', a: '2024年以降は LYP プレミアムが後継ですが、ほぼ同じサービス内容です。料金体系も508円で共通。' },
      { q: '解約後、ebook japan で買った本はどうなりますか？', a: '購入済み書籍は通常会員でも読み続けられます。月額プレミアム特典の還元クーポン等が無くなる程度です。' },
    ],
  },
  'apple-music': {
    summary:
      'Apple Music は Apple が提供する音楽ストリーミングサービス。月額1080円（個人プラン）で1億曲以上が聴き放題。空間オーディオ・ロスレス音質に対応し、iPhone との連携が抜群。',
    whyHard:
      'Apple Music の解約は「かんたん」。iPhoneの設定アプリから3クリックで完了する。ただし、登録経路（Apple経由 vs ドコモ・KDDI経由）で解約画面が完全に異なる点に注意。',
    darkPatterns: [
      { trigger: '「ファミリー共有メンバー全員が利用できなくなります」', response: '個人プランなら気にせず進む。ファミリープランなら同意確認が必要' },
      { trigger: 'iCloud ミュージックライブラリのデータ消失警告', response: '購入済み楽曲は残る。ストリーミング楽曲のみ再生不可になる' },
    ],
    afterCancel:
      '解約後は請求期間の末日までストリーミングが継続。期間後は購入済み楽曲のみ再生可能。プレイリスト・お気に入りは保持され、再登録時に復元される。',
    faq: [
      { q: 'キャリア（ドコモ・au）経由で契約した場合の解約方法は？', a: 'My docomo / My au から解約します。Apple のサブスクリプション画面には表示されません。' },
      { q: 'Apple Music と Apple One どっちで契約しているか分からない場合は？', a: 'iPhone「設定」→「Apple ID」→「サブスクリプション」で確認できます。同時には登録できないので、表示されている方が契約中です。' },
      { q: '解約後、ダウンロードした楽曲は聴けますか？', a: 'iCloud ミュージックライブラリでダウンロードした楽曲は再生不可になります。iTunes Store で購入した楽曲のみ残ります。' },
    ],
  },
  'youtube-premium': {
    summary:
      'YouTube Premium は YouTube の有料プランで、月額1280円。動画広告の非表示・バックグラウンド再生・オフライン保存・YouTube Music が利用可能。家族プラン（最大5名）も用意。',
    whyHard:
      'YouTube Premium の解約は「かんたん」。設定ページから3クリックで完了。ただし、無料トライアル期間中に解約しないと自動課金される点と、家族プランの場合は管理者からの解約が必要な点が注意。',
    darkPatterns: [
      { trigger: '「無料トライアルの残り日数がもったいない」のメッセージ', response: 'トライアル期間中の解約でも、期間末日まで Premium 機能が使える。気にしない' },
      { trigger: '「一時停止する」オプションが目立つ位置に表示', response: '一時停止は最大6ヶ月で自動再開。完全解約したいなら「キャンセル」を選ぶ' },
      { trigger: 'YouTube Music も同時に使えなくなる旨の警告', response: 'YouTube Premium には Music が含まれている。完全に止めたいなら気にしなくてOK' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで Premium 機能が継続。ダウンロード済み動画は即時アクセス不可。視聴履歴・チャンネル登録・プレイリストは全て保持される。',
    faq: [
      { q: 'iPhone アプリ経由で登録した場合の解約方法は？', a: 'iPhone「設定」→「Apple ID」→「サブスクリプション」→「YouTube Premium」から解約します。YouTube アプリ内では解約できません。' },
      { q: '家族プランで支払い者と利用者が別の場合は？', a: '支払い者（管理者）のみが解約できます。利用者は管理者に連絡してください。' },
      { q: '解約後、YouTube Music 単独で契約することはできますか？', a: 'はい、YouTube Music Premium 単独は月額980円で別途契約可能です。' },
    ],
  },
  'microsoft-365': {
    summary:
      'Microsoft 365 Personal（旧 Office 365 Solo）は Word・Excel・PowerPoint・OneDrive 1TB が含まれた月額1490円（年額12984円）のサブスク。Microsoft アカウントで管理。',
    whyHard:
      'Microsoft 365 の解約は「ふつう」レベル。「サービスとサブスクリプション」から進めば3〜5クリックで完了する。年間契約の場合は途中解約時の返金可否が混乱しやすい。',
    darkPatterns: [
      { trigger: '「OneDrive のデータが消えます（1TB→5GB に縮小）」の警告', response: '事実。重要ファイルは事前にダウンロードしておく' },
      { trigger: '「無料期間を◯ヶ月追加します」のオファー', response: '本当に使うなら受ける。一度受けると更に解約しにくくなるので慎重に判断' },
    ],
    afterCancel:
      '年契約の場合は払い戻し可能（条件あり）。月契約は期間末まで利用可能。Word/Excel は閲覧モードのみに（編集不可）。OneDrive のデータは30日後に強制削除されるため、解約前のバックアップ必須。',
    faq: [
      { q: '年契約を途中解約したら返金されますか？', a: 'はい、Microsoft Store で購入した場合は使用日数を差し引いた残額が返金されます。家電量販店のプロダクトキー版は返金対象外です。' },
      { q: 'OneDrive に1TB保存しているデータはどうなりますか？', a: '解約後30日間は5GBを超えるデータも閲覧可能、その後はファイルが「ロック」されて編集不可。さらに3ヶ月で削除されます。事前バックアップ必須。' },
      { q: 'Outlook のメールは引き続き使えますか？', a: 'Outlook.com のフリーアカウントとしては引き続き使えます。Microsoft 365 限定機能（広告非表示・大容量メールボックス等）は失われます。' },
    ],
  },
  'claude-pro': {
    summary:
      'Claude Pro は Anthropic が提供する月額約3100円（$20・1ドル155円換算）の AI チャットサービス有料プラン。最新モデル（Claude Opus 4.5以降）への優先アクセス・5倍以上のメッセージ上限・Projects 機能などが利用可能。',
    whyHard:
      'Claude Pro の解約は「かんたん」。設定画面から3クリックで完了し、引き止めも控えめ。ただし、Claude Code（CLI）と統合プランの場合は、別の解約フローになる点に注意。',
    darkPatterns: [
      { trigger: '「Pro 限定の Projects 機能が使えなくなります」のリスト', response: '無料版でも Claude は使える。本当に Projects が必要か再確認' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで Pro 機能が継続。期間後は無料プランへ自動移行。会話履歴・カスタム指示・Projects は全て保持される。再加入後シームレスに復帰可能。',
    faq: [
      { q: 'Claude Pro と Claude Max の違いは？', a: 'Pro は月額3000円で基本的な Pro 機能、Max は月額15000-30000円でさらに多い利用枠と先行機能。Max ユーザーが解約する場合も同じ画面から操作します。' },
      { q: 'Claude Code（CLI）のサブスクは別ですか？', a: 'Claude Pro / Max を契約していれば Claude Code も使えます。別途契約は不要です。' },
      { q: '請求が日本円で表示されないのですが？', a: 'Anthropic は USD 課金なので、為替で月額3000円前後で変動します。請求書はクレジットカード明細で円換算が表示されます。' },
    ],
  },
  'abema-premium': {
    summary:
      'ABEMA プレミアムはサイバーエージェント運営の動画配信サービスの有料プラン。月額1080円で見逃し配信・ダウンロード・広告非表示・倍速再生などが利用可能。バラエティとオリジナル番組に強い。',
    whyHard:
      'ABEMA プレミアムの解約は「ふつう」レベル。マイページの「ABEMAプレミアム」セクションから「自動更新を停止する」を選択。3クリック程度で完了するが、文言が分かりにくい。',
    darkPatterns: [
      { trigger: '「自動更新を停止する」と「解約する」の文言が混在', response: 'どちらを選んでも実質同じ結果になる。「自動更新を停止する」が正解' },
      { trigger: '理由選択画面で「あまり見ない」と「番組が合わない」しか選択肢がない', response: '適当に選んで進める' },
    ],
    afterCancel:
      '解約後は請求期間の末日までプレミアム機能が継続。期間後は無料プラン（広告あり）に移行。視聴履歴・お気に入り番組は保持される。',
    faq: [
      { q: 'iPhone アプリ経由で登録した場合の解約方法は？', a: 'iPhone「設定」→「サブスクリプション」から解約します。ABEMA アプリ内では解約できません。' },
      { q: '無料プラン（広告あり）でも見られる番組と、プレミアム限定の違いは？', a: '生放送はほぼ全て無料で見られます。見逃し配信・ダウンロード・倍速再生・広告非表示がプレミアム限定です。' },
      { q: 'ABEMA コインは解約後どうなりますか？', a: '購入済みコインは退会後も「コイン残高」として残り、課金番組の購入に使えます。退会後にコインが消滅することはありません。' },
    ],
  },
  dazn: {
    summary:
      'DAZN は世界最大級のスポーツ動画配信サービス。月額4200円（年契約だと月額換算3700円）でプロ野球・サッカー・F1・ボクシング・テニスなどが見放題。日本ではJリーグ独占配信で知られる。',
    whyHard:
      'DAZN の解約は「ふつう」レベルだが、引き止めオファーが複数回出る。年契約の場合は途中解約時の違約金規定が複雑で、ユーザー側で確認が必要。',
    darkPatterns: [
      { trigger: '「3ヶ月50%オフ」「特定試合の無料視聴券プレゼント」のオファー', response: '本当に観たい試合があるなら受ける、そうでないなら無視' },
      { trigger: '年契約途中の解約画面で違約金の有無が分かりにくい', response: '画面に「違約金◯円」と明示されない場合はサポートに確認。基本的に途中解約は違約金あり' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで視聴可能。期間中はダウンロード再生も可能。視聴履歴・お気に入りは保持される。年契約の場合は事前に違約金額を確認推奨。',
    faq: [
      { q: 'DAZN の年契約と月契約の違いは？', a: '年契約は月額換算3700円（年44280円一括）、月契約は月額4200円。年契約は途中解約に違約金がかかる場合あり。' },
      { q: 'ドコモ経由の DAZN（DAZN for docomo）の解約方法は？', a: 'My docomo から解約します。DAZN 公式アプリでは解約できません。料金はドコモから請求されます。' },
      { q: '解約後にダウンロード済みのコンテンツは見られますか？', a: '視聴可能期間（48時間以内）であれば見られます。期間外はアクセス不可になります。' },
    ],
  },
  nikkei: {
    summary:
      '日本経済新聞 電子版は月額4277円。日経新聞朝刊・夕刊の全紙面とウェブ限定記事、企業情報データベース、業界レポートなどが閲覧可能。ビジネスパーソン必読の有料コンテンツとして知られる。',
    whyHard:
      '日経電子版の解約は「むずかしい」最上位。Webからの解約フォーム送信後、確認メール → 電話確認 → 完了 という多段階のプロセス。即時オンライン完結しないため、解約完了まで2〜3営業日かかる場合がある。',
    darkPatterns: [
      { trigger: '解約フォームへのリンクがマイページの「ご契約内容」深部に隠されている', response: 'マイページ→「ご契約内容」→ページ下部「解約・変更申込」を探す' },
      { trigger: '解約理由のフォーム入力が必須項目だらけ', response: '簡潔に「あまり読まなかった」「無料媒体に切り替えた」と書いて進む' },
      { trigger: '解約完了メールが届かないことがある', response: '3営業日経って届かない場合はサポートへ電話確認を' },
    ],
    afterCancel:
      '解約完了後は無料会員に自動移行。月10本までの記事は引き続き読める。スクラップ機能・保存記事は無料会員でも一定数保持される。クレカ請求は次月から停止。',
    faq: [
      { q: '日経電子版の解約が即時完了しないのはなぜですか？', a: '日経の運用上の理由で、解約手続きが申込制になっています。フォーム送信後、最終確認のため事務局からメールまたは電話で連絡が来る場合があります。' },
      { q: '無料会員のままでも記事は読めますか？', a: 'はい、月10本までは無料会員でも全文閲覧可能です。「記事を読みたい時だけ」なら無料会員で十分なケースもあります。' },
      { q: '法人プランの解約も同じ流れですか？', a: '法人プランは契約担当者経由での解約となり、個人プランより手続きが複雑です。法務部や経理部経由で進める必要があります。' },
    ],
  },
  'kindle-unlimited': {
    summary:
      'Kindle Unlimited は Amazon が提供する月額980円の電子書籍読み放題サービス。和書200万冊以上、洋書を含めると数百万冊が読み放題。Amazon プライムの Prime Reading（読み放題範囲は狭い）とは別物。',
    whyHard:
      'Kindle Unlimited の解約は「ふつう」レベル。Amazon の「Kindle Unlimited 会員の管理」から3クリック程度で完了する。Amazon プライム同様、引き止めページが複数挟まる点に注意。',
    darkPatterns: [
      { trigger: '「会員資格を継続する」が大きく、「終了する」が小さい', response: '小さいリンクを探して進む。Amazon の典型的なダーク・パターン' },
      { trigger: '「特別オファー：3ヶ月99円」のキャンペーン誘導', response: '本当に使うなら受ける、そうでないなら無視' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで読み放題が継続。期間後はダウンロード済み書籍は閲覧不可（読み放題扱いのため）。購入した書籍（Kindle ストアでの個別購入）は引き続き読める。',
    faq: [
      { q: 'Amazon プライムの Prime Reading とは違うのですか？', a: 'Prime Reading は Amazon プライム会員特典の一部で、読み放題の対象範囲がずっと狭い（数百冊）。Kindle Unlimited は別途月額980円で対象が200万冊以上。' },
      { q: 'ダウンロード済みの書籍は解約後も読めますか？', a: 'Kindle Unlimited で借りた書籍は解約と同時に「返却」扱いになり読めなくなります。Kindle ストアで購入した書籍は引き続き読めます。' },
      { q: '無料体験期間中に解約しても期間末まで使えますか？', a: 'はい、無料体験期間中に解約しても、期間終了日まではフル機能で利用できます。期間内に解約すれば一切課金されません。' },
    ],
  },
  notion: {
    summary:
      'Notion はオールインワン型のドキュメント・データベース・タスク管理ツール。個人プラン（無料）でも豊富な機能、Plus プラン（月額1500円）で履歴無制限・ファイル制限解除など。ビジネス用途も拡大中。',
    whyHard:
      'Notion の有料プラン解約は「かんたん」。設定→「Plans」から「Cancel Plan」で完結。ただし、ワークスペース自体の削除と混同しやすい点に注意。',
    darkPatterns: [
      { trigger: '「無料プランに戻すと一部機能が失われます」のリスト表示', response: '個人利用なら無料で大半カバーできる。冷静に判断' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで有料機能が継続。期間後は自動的に無料プランへ移行。ページ・データベース・ワークスペース構成は全て保持される。ファイルアップロード履歴の一部に制限あり。',
    faq: [
      { q: '無料プランの容量制限はどれくらいですか？', a: 'ブロック数は無制限になりました（2022年以降）。ファイル1個あたり5MBの制限、AI機能の利用制限はあります。個人利用なら無料で十分なケースが多数。' },
      { q: 'チームプランを解約したらメンバーはどうなりますか？', a: '無料プランの上限（個人ワークスペースで複数ゲスト）に従って自動的に整理されます。チームメンバーの招待はゲスト扱いに変更されます。' },
      { q: 'Notion AI だけ解約することはできますか？', a: 'はい、Notion AI は独立した課金で（月額1500円程度の追加）、設定から個別に解約できます。' },
    ],
  },
};


