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
    renewalCheckUrl: 'https://www.netflix.com/youraccount',
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
    renewalCheckUrl: 'https://www.amazon.co.jp/gp/primecentral',
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
    renewalCheckUrl: 'https://www.spotify.com/jp/account/subscription/',
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
    renewalCheckUrl: 'https://account.apple.com/account/manage/section/subscriptions',
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
    renewalCheckUrl: 'https://www.youtube.com/paid_memberships',
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
    renewalCheckUrl: 'https://www.disneyplus.com/ja-jp/account',
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
    renewalCheckUrl: 'https://www.hulu.jp/account',
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
    renewalCheckUrl: 'https://account.microsoft.com/services',
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
    renewalCheckUrl: 'https://account.adobe.com/ja/plans',
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
    renewalCheckUrl: 'https://chat.openai.com/settings',
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
    note: '期間末まで利用可能。会社契約の場合は管理者経由。なお個人向けの新規サインアップは2026年4月以降停止中（既存ユーザーはプラン変更・解約は可）。解約すると再契約できない場合があるため、迷う場合はプラン変更（下位プラン）も検討を',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'software',
    emoji: '💻',
    domain: 'cursor.com',
    cancelUrl: 'https://cursor.com/dashboard/billing',
    renewalCheckUrl: 'https://cursor.com/dashboard/billing',
    difficulty: 'easy',
    steps: [
      'ログイン後 cursor.com/dashboard/billing の「Billing」ページを開く',
      '「Manage Subscription」をクリックしてStripeの請求ポータルへ',
      '「Cancel Subscription」をクリックして確認（期間終了後、自動でHobby無料プランへ移行）',
    ],
    note: 'iOSアプリ経由で購読した場合はApple側の設定から解約が必要（上記のWeb手順は使えない）',
  },
  {
    id: 'gemini-advanced',
    name: 'Google AI Pro（旧 Gemini Advanced）',
    category: 'software',
    emoji: '✨',
    domain: 'gemini.google.com',
    cancelUrl: 'https://one.google.com/settings',
    difficulty: 'easy',
    steps: [
      'Google One（one.google.com）にアクセスしてログイン',
      '「設定」→「メンバーシップを解約」をクリック',
      '確認画面で「メンバーシップを解約」をクリックして確定',
    ],
    note: '解約はGemini単体の画面ではなく、必ずGoogle Oneの「メンバーシップを解約」から行う',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    category: 'software',
    emoji: '📧',
    domain: 'workspace.google.com',
    cancelUrl: 'https://admin.google.com/ac/billing/subscriptions',
    difficulty: 'medium',
    steps: [
      '管理コンソール（admin.google.com）にログイン →「お支払い」→「サブスクリプション」を開く',
      '対象のサブスクリプションを選択 →「その他」→「サブスクリプションをキャンセル」をクリック',
      '解約理由を選んで続行 → 確認事項にチェックしメールアドレスを入力 →「サブスクリプションを解約する」をクリック',
    ],
    note: '解約後はWorkspaceデータが削除され復元不可。事前にデータのダウンロードが必要',
  },
  {
    id: 'google-play-pass',
    name: 'Google Play Pass',
    category: 'game',
    emoji: '🎮',
    domain: 'play.google.com',
    cancelUrl: 'https://play.google.com/store/account/subscriptions',
    difficulty: 'easy',
    steps: [
      'Playストアアプリを開き、右上のプロフィールアイコン→「お支払いと定期購入」をタップ',
      '「定期購入」→「Play Pass」を選択',
      '「定期購入を解約」をタップし、画面の指示に従って完了',
    ],
    note: null,
  },
  {
    id: 'youtube-music',
    name: 'YouTube Music Premium（単体プラン）',
    category: 'music',
    emoji: '🎵',
    domain: 'music.youtube.com',
    cancelUrl: 'https://www.youtube.com/paid_memberships',
    renewalCheckUrl: 'https://myaccount.google.com/subscriptions',
    difficulty: 'easy',
    steps: [
      'youtube.com/paid_memberships にアクセスしてログイン',
      '「メンバーシップの管理」→「無効にする」をクリック',
      '解約理由を選択して「続行」→「解約」をクリックして完了',
    ],
    note: 'YouTube Premium（動画+音楽）とは別料金の単体プラン。App Store/Google Play経由の契約は各プラットフォーム側で解約',
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro',
    category: 'software',
    emoji: '🔎',
    domain: 'perplexity.ai',
    cancelUrl: 'https://www.perplexity.ai/settings/account',
    difficulty: 'easy',
    steps: [
      '設定（Settings）画面を開き、「Perplexity Pro」内の「Subscription」欄までスクロール',
      '「Manage Subscription」をクリックしてプラン管理画面へ移動',
      '「Cancel subscription」をクリックして解約完了（次の請求日から無料版に戻る）',
    ],
    note: 'ソフトバンク/Y!mobile経由の特典契約の場合は課金元が異なるため、キャリア側の手続きが必要',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'software',
    emoji: '🎨',
    domain: 'midjourney.com',
    cancelUrl: 'https://www.midjourney.com/account',
    renewalCheckUrl: 'https://www.midjourney.com/account',
    difficulty: 'easy',
    steps: [
      'midjourney.com にログイン →「Manage Subscription」（購読管理）ページを開く',
      'プラン詳細ページの「Cancel Plan」ボタンをクリック',
      '確認ポップアップで「Confirm Cancellation」をクリックして解約完了（現在の請求サイクル終了まで利用可）',
    ],
    note: '解約はDiscordではなく公式サイト（midjourney.com）のアカウントページで行う。アップグレード/ダウングレード予約中は先に「Cancel Change」で取り消してから解約',
  },
  {
    id: 'windsurf',
    name: 'Windsurf（現Devin Desktop）',
    category: 'software',
    emoji: '🏄',
    domain: 'windsurf.com',
    cancelUrl: 'https://windsurf.com/subscription/manage-plan',
    renewalCheckUrl: 'https://windsurf.com/subscription/manage-plan',
    difficulty: 'easy',
    steps: [
      'windsurf.com/subscription/manage-plan にアクセスしてログイン',
      'プラン管理画面で対象プランの「キャンセル」を選択',
      '確認してキャンセル完了（請求期間終了まで利用可・その後Freeプランへ自動移行）',
    ],
    note: '2026年6月にブランドが「Devin Desktop」へ統合されたが、既存ユーザーの請求・解約導線はwindsurf.comのまま継続',
  },
  {
    id: 'runway',
    name: 'Runway',
    category: 'software',
    emoji: '🎬',
    domain: 'runwayml.com',
    cancelUrl: 'https://app.runwayml.com/settings/billing',
    difficulty: 'easy',
    steps: [
      '右上のアバターアイコン →「Settings」→「Billing」（または直接 app.runwayml.com/settings/billing へ）',
      '「Cancel Plan」をクリック',
      '解約理由を選択して「Continue」で確定',
    ],
    note: null,
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
  cursor: 3000,              // Pro $20/mo（1ドル=150円換算）
  'gemini-advanced': 2900,   // Google AI Pro（5TB・Gemini使用量4倍）
  'google-workspace': 800,   // Business Starter
  'google-play-pass': 600,
  'youtube-music': 1080,     // 個人プラン単体
  'perplexity-pro': 3000,    // $20/mo（1ドル=150円換算）
  midjourney: 4500,          // Standard $30/mo（1ドル=150円換算）
  windsurf: 3000,            // Pro $20/mo（1ドル=150円換算）
  runway: 2250,              // Standard $15/mo（1ドル=150円換算）
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
  'youtube-music': 52,

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
  cursor: 68,
  'gemini-advanced': 75,
  'google-workspace': 68,
  'perplexity-pro': 55,
  midjourney: 72,
  windsurf: 45,
  runway: 47,

  // ゲーム
  'nintendo-switch-online': 85,
  'playstation-plus': 80,
  'xbox-game-pass': 75,
  'discord-nitro': 50,
  'google-play-pass': 30,

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
// 検索のかな別名（ひらがな/略称入力に対応・Home typeahead 用・2026-06-26 追加）
// 主要サービスから順次拡充。未登録は '' を返し、name による検索にフォールバックする。
// ---------------------------------------------------------------------------
export const KANA = {
  netflix: 'ねっとふりっくす ねとふり',
  'amazon-prime': 'あまぞんぷらいむ ぷらいむ',
  spotify: 'すぽてぃふぁい すぽちふぁい',
  'apple-music': 'あっぷるみゅーじっく あっぷるみゅうじっく',
  hulu: 'ふーる ふうる',
  'u-next': 'ゆーねくすと ユーネクスト',
  'youtube-premium': 'ゆーちゅーぶぷれみあむ ようつべ ゆうちゅうぶ',
  'disney-plus': 'でぃずにーぷらす でぃずにー',
  dazn: 'だぞーん だ・ぞーん',
  abema: 'あべま アベマ',
};
export function getKana(serviceId) {
  return KANA[serviceId] ?? '';
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
    ],
    howToCheck: 'one.google.com にログインして「会員情報」で確認できます（Gemini込みの上位プランは「Google AI Pro」を参照）',
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
  cursor: {
    plans: [
      { name: 'Hobby', monthly: 0, note: '無料・クレジットカード登録不要・利用制限あり' },
      { name: 'Pro', monthly: 3000, popular: true, note: '$20/mo。個人向け主力プラン' },
      { name: 'Pro+', monthly: 9000, note: '$60/mo' },
      { name: 'Ultra', monthly: 30000, note: '$200/mo' },
    ],
    howToCheck: 'cursor.com にログイン →「Settings」→「Billing」で確認できます',
  },
  'gemini-advanced': {
    plans: [
      { name: 'Google AI Plus', monthly: 725, note: '400GBストレージ・Gemini使用量2倍' },
      { name: 'Google AI Pro', monthly: 2900, popular: true, note: '5TBストレージ・Gemini使用量4倍・YouTube Premium Lite付帯（旧Gemini Advanced相当）' },
      { name: 'Google AI Ultra', monthly: 14500, note: '20TB〜ストレージ・Gemini使用量20倍・YouTube Premium個人プラン付帯' },
    ],
    howToCheck: 'one.google.com にログインして「会員情報」で確認できます',
  },
  'google-workspace': {
    plans: [
      { name: 'Business Starter', monthly: 800, popular: true, note: '最安プラン。新規は最初3ヶ月50%オフ' },
      { name: 'Business Standard', monthly: 1600, note: 'ストレージ2TB・録画機能・NotebookLM利用可' },
      { name: 'Business Plus', monthly: 2500, note: 'ストレージ5TB・Vault・高度なセキュリティ' },
    ],
    howToCheck: '管理コンソール（admin.google.com）→「お支払い」→「サブスクリプション」で確認できます',
  },
  'google-play-pass': {
    plans: [
      { name: '月額プラン', monthly: 600, popular: true, note: '初回1ヶ月無料トライアルあり' },
      { name: '年額プラン', monthly: 450, yearly: 5400, note: '年払いで月額換算450円相当' },
    ],
    howToCheck: 'Playストアアプリ →「お支払いと定期購入」→「定期購入」で確認できます',
  },
  'youtube-music': {
    plans: [
      { name: '個人', monthly: 1080, popular: true, note: '初月無料トライアルあり' },
      { name: 'ファミリー', monthly: 1680, note: '家族5名まで追加可能' },
      { name: '学生', monthly: 580, note: '学生認証が必要・毎年更新' },
    ],
    howToCheck: 'youtube.com/paid_memberships で確認できます',
  },
  'perplexity-pro': {
    plans: [
      { name: '月払い', monthly: 3000, note: '$20/月' },
      { name: '年払い', monthly: 2500, yearly: 30000, popular: true, note: '$200/年（月あたり約$16.67）' },
    ],
    howToCheck: 'perplexity.ai →「Settings」→「Perplexity Pro」で確認できます',
  },
  midjourney: {
    plans: [
      { name: 'Basic', monthly: 1500, yearly: 14400, note: '$10/月、年払い$96/年' },
      { name: 'Standard', monthly: 4500, yearly: 43200, popular: true, note: '$30/月、年払い$288/年。コミュニティで最も選ばれる定番プラン' },
      { name: 'Pro', monthly: 9000, yearly: 86400, note: '$60/月、年払い$576/年' },
      { name: 'Mega', monthly: 18000, yearly: 172800, note: '$120/月、年払い$1,152/年' },
    ],
    howToCheck: 'midjourney.com →「Manage Subscription」で確認できます',
  },
  windsurf: {
    plans: [
      { name: 'Free', monthly: 0, note: '軽量クオータ・限定モデル' },
      { name: 'Pro', monthly: 3000, popular: true, note: '$20/月' },
      { name: 'Max', monthly: 30000, note: '$200/月' },
      { name: 'Teams', monthly: 12000, note: '$80/月ベース＋$40/月/席' },
    ],
    howToCheck: 'windsurf.com/subscription/manage-plan で確認できます',
  },
  runway: {
    plans: [
      { name: 'Free', monthly: 0, note: '125クレジット（買い切り・一回限り）' },
      { name: 'Standard', monthly: 2250, yearly: 21600, popular: true, note: '$15/月、年払い$12/月' },
      { name: 'Pro', monthly: 5250, yearly: 50400, note: '$35/月、年払い$28/月' },
      { name: 'Max', monthly: 14250, yearly: 136800, note: '$95/月、年払い$76/月' },
    ],
    howToCheck: 'app.runwayml.com →「Settings」→「Billing」で確認できます',
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
  cursor: 20,
  'perplexity-pro': 20,
  midjourney: 30,
  windsurf: 20,
  runway: 15,
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
// 価格・仕様の変更履歴（下層・2026-07-05〜）。EXTENDED_CONTENT と同型（id をキーにした別オブジェクト）。
// 初期データは stack letter（world-oracle-staging）の検証済み記録を「確認日つきの過去事実」として移植。
// 誤報ゼロ（生命線）：各エントリは verifiedAt 時点で公式ページ照合済み・source は公式料金ページ・
//   現在価格そのものは書かない（"何が・いつ変わったか"の事実のみ）。小さな変動はここに蓄積する。
// direction: 'up'=値上げ / 'down'=値下げ / 'new'=新プラン・新ティア / 'restructure'=料金体系の変更。
export const PRICE_HISTORY = {
  'github-copilot': [
    {
      date: '2026-06-01',
      item: '料金体系',
      direction: 'restructure',
      change:
        '従量課金制（GitHub AI クレジット・1クレジット＝$0.01）へ移行。Pro（月$10）は$15分、Pro+（月$39）は$70分の AI クレジットを内包し、コード補完・Next Edit 提案はクレジットを消費せず無制限のまま。個人向けの新規サインアップ（Pro / Pro+ / Student）は2026年4月中旬から一時停止中（既存ユーザーはプラン変更・解約は可能）。',
      source: 'https://github.com/features/copilot/plans',
      verifiedAt: '2026-07-05',
    },
    {
      date: '2026-06-01',
      item: 'プラン',
      direction: 'new',
      change: '上位ティア「Copilot Max」を月$100（$200分の AI クレジットを内包）で新設（従量課金への切替と同時）。',
      source: 'https://github.com/features/copilot/plans',
      verifiedAt: '2026-07-05',
    },
  ],
  'notion': [
    {
      date: '2026-06-10',
      item: 'AI の提供形態',
      direction: 'restructure',
      change:
        '新規ワークスペースでは Notion AI を Business / Enterprise プランに同梱化。単体の $10/メンバー add-on は新規の Free / Plus では購入不可に（既存契約者は継続利用可）。新たに従量課金の AI（Custom Agents）が登場し、無料お試し後は月1,000クレジットあたり $10。',
      source: 'https://www.notion.com/pricing',
      verifiedAt: '2026-06-10',
    },
  ],
  'chatgpt-plus': [
    {
      date: '2026-05-31',
      item: 'プラン',
      direction: 'new',
      change:
        'Plus の下位に月$8の「ChatGPT Go」ティアが定着（2026年1月中旬導入）。チャット中心の人向けの格安オプションとして確立。',
      source: 'https://openai.com/chatgpt/pricing/',
      verifiedAt: '2026-05-31',
    },
  ],
};

export const EXTENDED_CONTENT = {
  'playstation-plus': {
    summary:
      'PlayStation Plus はソニーの PS5/PS4 向け定額サービス。オンラインマルチプレイ、毎月のフリープレイ（無料配布ゲーム）、ゲームカタログなどが使える。エッセンシャル/エクストラ/プレミアムの3プランで、1ヶ月・3ヶ月・12ヶ月から選べる。',
    whyHard:
      '解約手順自体は数クリックだが、初期設定が「自動更新オン」なので、放置すると次の期間が自動課金される。解約とは実質「自動更新の停止」で、支払い済みの残り期間はそのまま使える。PS本体・PSアプリ・ブラウザのいずれからも手続きできる。',
    darkPatterns: [
      { trigger: '12ヶ月プランの「今なら割安」表示', response: '使う確証がないなら長期プランに切り替えない。まず自動更新を止めて様子を見る' },
      { trigger: '継続特典（フリープレイ等）を強調する表示', response: 'フリープレイは解約後に新規取得できなくなるだけ。惑わされず自動更新を止める' },
    ],
    afterCancel:
      '自動更新を止めても、支払い済み期間の満了までは全特典を利用できる。満了後はオンラインマルチプレイ・ゲームカタログ・フリープレイで入手したゲームが遊べなくなる（ストアで個別購入したタイトルは対象外）。クラウドのセーブ保存も対象特典のため、必要ならローカルにバックアップを。',
    faq: [
      { q: '解約したら今まで遊んでいたゲームはどうなりますか？', a: 'フリープレイやゲームカタログで入手したタイトルは加入期間中のみ遊べ、解約後はプレイできなくなります。ストアで個別購入したゲームは解約後も引き続き遊べます。' },
      { q: '残り期間の返金はありますか？', a: '原則、日割り返金はなく、支払い済み期間の満了まで使えます。誤課金など特別な場合は PlayStation サポートに相談してください。' },
      { q: '自動更新だけ止めることはできますか？', a: 'はい。「自動更新」をオフにすれば、次回課金を止めつつ残り期間は使い続けられます。これが実質の解約です。' },
    ],
  },
  'xbox-game-pass': {
    summary:
      'Xbox Game Pass はマイクロソフトの定額ゲーム遊び放題。Console/PC/Ultimate のプランがあり、Ultimate はクラウドゲーミングやオンラインマルチ（旧 Xbox Live Gold）も含む。数百本のゲームが月額で遊べ、ラインナップは随時入れ替わる。',
    whyHard:
      '手続きは Microsoft アカウントのサブスク管理から数クリック。ただし「自動更新」が既定オンで放置課金になりやすく、Ultimate へ体験加入した後の通常課金も見落としやすい。実質的には「自動請求を止める」だけで、残りの期間はそのまま遊べる。',
    darkPatterns: [
      { trigger: '「今キャンセルすると◯日分を失います」の警告', response: '解約しても支払い済み期間の満了までは遊べる。期間内に手続きしても損はしない' },
      { trigger: '「¥◯◯で1ヶ月延長」などの引き止めオファー', response: '使っていないなら延長しない。まず自動更新を止める' },
    ],
    afterCancel:
      '自動更新を無効化しても、支払い済み期間の終了までは全ゲームをプレイできる。終了後は Game Pass 対象ゲームが遊べなくなる（別途購入したゲームやセーブデータは残る）。Ultimate 解約でオンラインマルチが必要な場合は個別プランを検討。',
    faq: [
      { q: 'セーブデータは消えますか？', a: '消えません。クラウドのセーブは残り、再加入すれば続きから遊べます。ただし対象ゲーム本体は再加入するまで起動できません。' },
      { q: '体験（お試し）だけで終わらせるには？', a: '加入直後に「自動更新」をオフにしておけば、体験期間の終了時に自動課金されません。' },
      { q: 'PC とコンソールで別々に解約が必要ですか？', a: '同じ Microsoft アカウントのサブスクリプションを解約すれば1回で済みます。' },
    ],
  },
  'nintendo-switch-online': {
    summary:
      'Nintendo Switch Online は任天堂のオンラインサービス。オンライン対戦、セーブデータお預かり、ファミコン/スーファミ等の名作遊び放題が使える。個人プラン・ファミリープラン・追加パック（NINTENDO64 等）があり、1ヶ月/3ヶ月/12ヶ月から選べる。',
    whyHard:
      '解約とは「自動継続購入の解約」。手続きはニンテンドーアカウントのショップメニューから行い、Switch 本体よりブラウザ/スマホのアカウントページが確実。既定で自動継続がオンのため、放置すると期間満了時に自動更新される。',
    darkPatterns: [
      { trigger: '「自動継続でおトク」表示（自動継続だと単月より割安）', response: '割安なのは事実だが、使わないなら意味がない。使用頻度で判断して自動継続を解約' },
      { trigger: 'セーブデータお預かりの消去をにおわせる表示', response: '解約後も一定期間はデータが保持され、再加入で復元できる場合が多い。心配なら先にバックアップ' },
    ],
    afterCancel:
      '自動継続を解約しても、支払い済み期間の満了までは利用できる。満了後はオンライン対戦・セーブデータお預かり・遊び放題の名作ソフトが使えなくなる。お預かりセーブは解約後しばらく（おおむね半年）保持され、再加入で復元できる。',
    faq: [
      { q: 'オンライン対戦以外に影響はありますか？', a: 'はい。セーブデータのクラウドお預かりや、ファミコン/スーファミなどの遊び放題も利用できなくなります。' },
      { q: 'ファミリープランの解約は代表者だけで済みますか？', a: '加入者（代表）のアカウントで自動継続を解約すれば、ファミリー全体の更新が止まります。' },
      { q: '本体から解約できますか？', a: 'Switch 本体からも契約状況は確認できますが、実際の解約手続きはニンテンドーアカウントのページ（ブラウザ/スマホ）から行います。' },
    ],
  },
  'apple-tv-plus': {
    summary:
      'Apple TV+ は Apple の動画配信。『テッド・ラッソ』『セヴェランス』などオリジナル作品に特化し、他社より作品数は絞られるが独占コンテンツが強み。月額単体プランのほか、Apple One（複数サービスのセット）に含まれる場合もある。',
    whyHard:
      '解約は簡単な部類で、iPhone の「設定」→ Apple ID →「サブスクリプション」から数タップ。ただし Apple One 経由で加入している場合は TV+ 単体では解約できず、Apple One の変更・解約になる点に注意。',
    darkPatterns: [
      { trigger: '「3ヶ月無料」などの体験からの自動課金', response: '体験開始直後に解約手続きをしても無料期間の終了までは視聴できる。忘れないうちに自動更新を止めるのが安全' },
      { trigger: '端末購入特典の無料期間', response: '新端末購入で付く無料 TV+ は期間終了後に自動課金される。使わないなら早めに解約予約を' },
    ],
    afterCancel:
      '解約しても、支払い済み（または無料）期間の終了までは視聴できる。終了後はオリジナル作品とダウンロード済み作品が視聴不可になる。Apple One の一部として使っていた場合は、Apple One 側の見直しが必要。',
    faq: [
      { q: '無料期間中に解約すると、すぐ見られなくなりますか？', a: 'いいえ。解約手続きをしても無料期間の最終日までは視聴できます。期間終了時に自動課金されなくなるだけです。' },
      { q: 'Apple One に入っている場合はどう解約しますか？', a: 'TV+ 単体ではなく、「設定」→サブスクリプション→Apple One から個別サービスの変更または Apple One 自体の解約を行います。' },
      { q: '支払いはどこから請求されますか？', a: 'Apple ID（App Store）経由の請求です。解約も Apple ID のサブスクリプション管理から行います。' },
    ],
  },
  'amazon-music-unlimited': {
    summary:
      'Amazon Music Unlimited は1億曲以上が聴き放題の音楽配信。プライム会員向けの割引や、Echo 端末限定のシングルデバイスプランもある。プライムに付属する「Prime Music」とは別の有料サービスで、混同しやすい。',
    whyHard:
      '解約手順自体は数クリックで終わる。分かりにくいのはプライム特典の「Prime Music」と別料金の「Music Unlimited」の違いで、どちらを解約すればいいのか迷う人が多い。Unlimited の解約は会員情報ページの「サブスクリプションのキャンセル」から行う。',
    darkPatterns: [
      { trigger: '「今解約すると割引を失います」等の表示', response: '使っていないなら割引は無意味。惑わされずキャンセルする。残り期間は聴ける' },
      { trigger: '「◯ヶ月無料で継続」オファー', response: '無料でも期間終了後に自動課金される。使わないなら受けない' },
    ],
    afterCancel:
      '解約しても、支払い済み期間の末日までは聴き放題を利用できる。末日後は Unlimited 対象曲がフル再生できなくなる（プライム会員なら「Prime Music」の範囲は引き続き利用可）。ダウンロード済みのオフライン曲も再生不可になる。',
    faq: [
      { q: 'プライム会員をやめずに Music Unlimited だけ解約できますか？', a: 'はい。Music Unlimited はプライムとは別契約なので、Unlimited のみ解約してもプライム会員は継続します。' },
      { q: '解約したのに課金が続くのはなぜ？', a: 'プライム会費と Unlimited 料金は別請求です。プライム側の年会費/月会費が残っている可能性があるので、会員情報で両方を確認してください。' },
      { q: 'Echo だけで使う安いプランはありますか？', a: 'Echo/Fire デバイス1台限定の「シングルデバイスプラン」があります。用途が1台なら乗り換えで安くできます。' },
    ],
  },
  dropbox: {
    summary:
      'Dropbox はクラウドストレージの草分け。ファイル同期・共有・バックアップに強く、Plus（2TB）などの個人有料プランがある。無料プランは容量が小さく、写真や書類が増えると有料に誘導されやすい。',
    whyHard:
      '解約はアカウントの「プランの管理」から数クリックと簡単。ただし解約すると無料プラン（少容量）に戻る。保存量が無料枠を超えている場合、同期が止まったり一部ファイルが扱いにくくなったりするので注意したい。年間契約の途中解約は次回更新の停止という扱いになる。',
    darkPatterns: [
      { trigger: '「今なら割引で継続」などの引き止め', response: '使っていないなら不要。まず更新を止め、必要なファイルを先に別の場所へ退避' },
      { trigger: '年払いの自動更新', response: '年払いは更新日が分かりにくい。解約は更新日前に。日割り返金は基本なし' },
    ],
    afterCancel:
      '解約すると無料プラン（現行2GB 前後）に戻る。保存容量が無料枠を超えている場合、新規アップロードや同期が制限される（既存ファイルが即消えるわけではないが、超過状態では扱いにくい）。重要データは解約前にダウンロード/別サービスへ移行しておくと安全。',
    faq: [
      { q: '解約するとファイルは消えますか？', a: 'すぐには消えません。ただし無料容量を超えている場合は同期やアップロードが制限されます。必要なファイルは事前にバックアップしてください。' },
      { q: '無料プランに戻すだけならどうすれば？', a: '有料プランを解約すれば自動的に無料プランへ移行します。アカウント自体は残ります。' },
      { q: '年間プランの途中でやめたら返金は？', a: '原則、日割り返金はなく次回更新が止まる形です。更新日前の手続きなら残り期間は無駄になりません。' },
    ],
  },
  'canva-pro': {
    summary:
      'Canva Pro はデザイン作成ツール Canva の有料プラン。プレミアム素材・背景透過・ブランドキット・大容量ストレージなどが使える。無料版でも基本機能は充実しており、Pro は素材と時短機能が主な差。',
    whyHard:
      '解約はアカウント設定の「請求と料金」から数クリック。難所は少ないが、無料トライアルからの自動課金と、年払いの更新日を見落としやすい点に注意。解約後もその期間の終了までは Pro 機能を使える。',
    darkPatterns: [
      { trigger: '無料トライアル終了前の通知が控えめ', response: 'トライアル開始直後に解約予約しておけば、期間終了まで使えて自動課金も防げる' },
      { trigger: '「今解約すると素材が使えなくなる」表示', response: 'Pro で作ったデザイン自体は残る。必要な書き出しは解約前に済ませておく' },
    ],
    afterCancel:
      '解約しても支払い済み期間の終了まで Pro 機能を利用できる。終了後は無料版に戻り、Pro 限定素材・機能が使えなくなる。作成済みデザインは残るが、Pro 素材を含む部分は再編集・書き出しに制限が出ることがある。使う予定のデザインは、解約前に高解像度で書き出しておこう。',
    faq: [
      { q: '解約したら作ったデザインは消えますか？', a: 'デザイン自体は残ります。ただし Pro 限定の素材やフォントを含む場合、解約後は編集や再ダウンロードに制限が出ることがあります。' },
      { q: '無料版でどこまでできますか？', a: '基本的な作成・共有・多くのテンプレートは無料で使えます。差が出るのは有料素材・背景透過・ブランドキット・大容量保存などです。' },
      { q: '年払いの途中で解約できますか？', a: '解約手続きは可能で、次回更新が止まります。残り期間は Pro 機能を使えます。' },
    ],
  },
  'nhk-plus': {
    summary:
      'NHKプラスは NHK の見逃し配信・同時配信サービス。NHK の受信契約があれば追加料金なしで利用でき、総合・Eテレの番組を放送後一定期間視聴できる。「解約」はNHKプラスのID退会を指し、受信契約そのものの解約とは別の手続き。',
    whyHard:
      '手続き自体はマイページの「退会手続き」から2ステップと短い。難しいのはむしろ概念の整理で、「NHKプラスの退会」と「NHK受信契約の解約」は完全に別物。プラスを退会しても受信料の支払いは止まらない。受信契約の解約はNHKの窓口での手続きが必要。',
    darkPatterns: [
      { trigger: '退会ページで受信契約との関係が分かりにくい', response: 'NHKプラス退会＝IDの削除だけ。受信料を止めたい場合は受信契約の解約（別窓口）が必要と理解して進める' },
      { trigger: '確認事項の長文', response: '要点は「再登録は可能」「受信契約には影響しない」の2点。読み流して問題ない' },
    ],
    afterCancel:
      '退会するとNHKプラスのIDが削除され、見逃し配信・同時配信が利用できなくなる。受信契約と受信料の支払いはそのまま続く。再度使いたくなったら受信契約があれば無料で再登録できる。',
    faq: [
      { q: 'NHKプラスを退会すれば受信料は止まりますか？', a: '止まりません。NHKプラスは受信契約の付帯サービスで、退会してもNHK受信契約と受信料支払いは継続します。受信料を止めるには受信契約自体の解約手続き（テレビ廃棄等の要件あり）が必要です。' },
      { q: '退会後にまた使いたくなったら？', a: '受信契約が有効であれば、再度IDを登録すれば無料で利用を再開できます。' },
      { q: 'そもそも追加料金はかかっていますか？', a: 'かかっていません。NHKプラス自体は受信契約者向けの無料サービスです。固定費を見直したい場合、対象は受信契約の方になります。' },
    ],
  },
  danime: {
    summary:
      'dアニメストアはドコモが運営するアニメ特化の配信サービス。アニメ作品数は国内最大級で、声優・アニソン系のコンテンツも扱う。ドコモ回線がなくても dアカウントがあれば契約できる。',
    whyHard:
      '解約はマイページの「ご契約内容の確認・変更」から進むが、dアカウントのログインが挟まり、途中に継続を促す案内が表示される。また Apple/Google のアプリ内課金で契約した場合は手順が全く異なり、各ストアのサブスクリプション管理から解約する必要がある。',
    darkPatterns: [
      { trigger: '解約ページ手前のおすすめ作品・継続案内', response: '「この作品が見られなくなります」は引き止めの定番。見たい作品が本当にあるかで判断する' },
      { trigger: 'アプリ内に解約導線が見当たらない', response: 'Web契約はブラウザのマイページから。アプリ内課金の場合はiPhone「設定」/Google Playの定期購入から解約する' },
    ],
    afterCancel:
      '解約すると即時〜期間末で視聴できなくなる（契約経路により異なる）。ダウンロード済み作品も再生不可になる。dポイントや dアカウント自体はそのまま残る。再契約はいつでも可能。',
    faq: [
      { q: 'ドコモユーザーでなくても解約手順は同じですか？', a: 'はい。dアカウントでマイページにログインして解約します。キャリアフリーで契約した場合も同じ導線です。' },
      { q: 'アプリから解約できないのはなぜ？', a: 'App Store / Google Play 経由で課金している場合、解約は各ストアのサブスクリプション管理から行う仕組みだからです。Web（キャリア/クレカ）契約はブラウザのマイページから行います。' },
      { q: '解約したら dアカウントも消えますか？', a: '消えません。dアニメストアの契約だけが終了し、dアカウントやdポイントはそのまま使えます。' },
    ],
  },
  'rakuten-tv': {
    summary:
      '楽天TVは楽天の動画配信。作品単位のレンタル/購入と、パ・リーグ Special などの定額パックが混在するのが特徴。楽天ポイントで支払える点が楽天経済圏ユーザーに使われている。',
    whyHard:
      '「解約」の対象は定額パックごとに分かれている。マイページの「ご契約情報」で今契約しているパックを確認し、それぞれ個別に解約する必要がある。レンタル/購入は都度課金なので解約という概念がなく、混同しやすい。',
    darkPatterns: [
      { trigger: '契約中パックの一覧が見つけにくい', response: 'マイページ →「ご契約情報」で現在の定額契約を必ず一覧確認。身に覚えのないパックがないかもここで見る' },
      { trigger: 'ポイント還元・キャンペーンでの継続訴求', response: 'ポイントは使った金額の一部が返るだけ。見ていないなら解約が最も還元率が高い' },
    ],
    afterCancel:
      '定額パックを解約しても、購入済み・レンタル期間中の作品は期限まで視聴できる。楽天会員・楽天ポイントには影響しない。パ・リーグ Special などシーズン型は更新日をまたぐと損得が変わるので、手続き前に更新日を確認しておきたい。',
    faq: [
      { q: '購入した作品は解約後も見られますか？', a: 'はい。「購入」した作品は定額パック解約後も視聴できます。' },
      { q: '楽天会員をやめる必要はありますか？', a: 'ありません。定額パックの解約だけで完了します。楽天会員退会は買い物やポイントに影響するので不要に行わないでください。' },
      { q: '複数パックを契約している場合は？', a: 'パックごとに個別の解約手続きが必要です。「ご契約情報」で契約中の一覧を確認してすべて解約してください。' },
    ],
  },
  'wowow-on-demand': {
    summary:
      'WOWOWオンデマンドは WOWOW の配信サービスで、放送契約とセットで利用する形が基本。映画・ドラマ・音楽ライブ・スポーツ中継に強い。かつて解約は電話のみの時期があったが、現在はWebで完結できる。',
    whyHard:
      '難易度は高め。解約ページのログインからアンケート入力、完了まで段階が多い。月末締めの契約サイクルなので、手続きのタイミングによっては課金が1ヶ月延びることもある。放送（BS）契約とオンデマンドの関係も分かりにくい。',
    darkPatterns: [
      { trigger: 'アンケートや引き止めページで工程が長い', response: '入力は最低限でよい。「解約手続きを完了する」まで到達したかを必ず確認する' },
      { trigger: '月末近くの手続きで「今月分」の扱いが曖昧', response: 'WOWOWは月単位契約。解約したい月の締め日までに手続きを終えているか確認する' },
    ],
    afterCancel:
      '解約月の末日まで視聴できるのが基本。再加入キャンペーンの案内が届くことがある。B-CAS/ACAS 情報に紐づく放送契約を解約すればオンデマンドも使えなくなる。契約形態（放送のみ/配信のみ/セット）を解約前に確認しておくと行き違いがない。',
    faq: [
      { q: '電話しないと解約できませんか？', a: 'いいえ。現在はWebの解約ページからログインして完結できます。電話解約のみだった時期の情報が残っているだけなので、まずWebで手続きしてください。' },
      { q: 'いつまでに手続きすれば今月末で解約できますか？', a: '月末までに解約手続きを完了すれば、その月での解約になるのが基本です。月をまたぐと翌月分が発生するので、月末数日前には済ませておきたいところです。' },
      { q: '解約後すぐ見られなくなりますか？', a: '解約月の末日までは視聴できるのが基本です。' },
    ],
  },
  fod: {
    summary:
      'FOD はフジテレビの動画配信。ドラマ・バラエティの見逃し配信と独占コンテンツ、雑誌読み放題が特徴。有料の FODプレミアムと無料の見逃し配信があり、解約対象はプレミアムの方。',
    whyHard:
      'マイページから「FODプレミアム解約」→ 理由選択 → 解約と進むが、契約経路（Webクレカ/キャリア決済/App Store/Google Play/Amazon）によって解約場所が異なるのが最大の難所。自分がどこで契約したか分からなくなりやすい。',
    darkPatterns: [
      { trigger: '「解約すると見られなくなる作品」の一覧表示', response: '引き止めの定番。実際に直近1ヶ月で見た本数を思い出して判断する' },
      { trigger: '契約経路によって解約ページが違う', response: 'Web契約はFODのマイページ、アプリ課金は各ストアの定期購入、Amazon経由はAmazonのアプリライブラリから。請求元（明細の名義）で判別する' },
    ],
    afterCancel:
      '解約後は期間末（または即時、経路による）でプレミアム作品と雑誌読み放題が利用できなくなる。無料の見逃し配信は引き続き視聴可能。アカウント自体は残るので再契約は簡単。',
    faq: [
      { q: '自分がどこ経由で契約したか分かりません', a: 'クレジットカードや携帯料金の明細を見ると、請求元の名義から判別できます。表示が「APPLE」や「GOOGLE」ならアプリ内課金、「AMAZON」ならAmazon経由、どれでもなければFODと直接契約している可能性が高いです。' },
      { q: '解約しても無料分は見られますか？', a: 'はい。プレミアム解約後も、無料の見逃し配信は視聴できます。' },
      { q: '月の途中で解約したら日割りになりますか？', a: '日割り返金は基本ありません。更新日の直前まで使ってから解約すれば、支払った分を無駄にせずに済みます。' },
    ],
  },
  lemino: {
    summary:
      'Lemino はドコモの動画配信（旧dTV）。韓流・音楽ライブ・オリジナルに強く、無料広告つきの範囲と有料のLeminoプレミアムがある。解約対象はプレミアム。',
    whyHard:
      'マイページ →「解約お手続き」→ dアカウント認証 → 完了と進む。dアカウントの認証が途中に挟まるため、パスワードを忘れていると手続きが中断しやすい。旧dTVからの自動移行で「契約しているつもりがなかった」ケースも多い。',
    darkPatterns: [
      { trigger: '解約導線の途中の継続キャンペーン表示', response: '「今解約するともったいない」系の表示はスキップしてよい。「手続きを完了する」まで進んだか最後に確認' },
      { trigger: '旧dTVからの移行契約で存在を忘れている', response: '携帯料金の明細に見覚えのない項目があればマイページで契約状況を確認。使っていないなら即解約' },
    ],
    afterCancel:
      '解約後はプレミアム作品が視聴できなくなる（無料範囲は広告つきで視聴可）。dアカウント・dポイントには影響しない。ドコモ回線とのセット割引に組み込んでいた場合は料金全体がどう変わるかも確認を。',
    faq: [
      { q: 'dTV時代に契約したままですが手続きは同じですか？', a: 'はい。dTVはLeminoに移行しているため、Leminoのマイページ（またはドコモの契約管理）から解約します。' },
      { q: 'ドコモユーザーでなくても解約できますか？', a: 'できます。dアカウントでログインすれば、回線契約がなくてもマイページから解約手続きが可能です。' },
      { q: '解約後、無料で見られる範囲はありますか？', a: 'あります。Leminoは広告つきの無料配信枠があり、プレミアム解約後も対象作品は視聴できます。' },
    ],
  },
  'dmm-premium': {
    summary:
      'DMMプレミアムは DMM TV（アニメ・エンタメ配信）を中心にDMMの各サービス特典がつく月額会員。アニメの新作カバー率の高さで近年利用者を伸ばしている。',
    whyHard:
      '解約は専用ページにログインして「解約する」を押すだけと短い。ただし解約ページへの入口がサービス内から見つけにくく、実質の難所は直接URLにたどり着けるかどうかだ。DMMポイント払い・クレカ払いなど支払い方法で更新日の考え方も変わる。',
    darkPatterns: [
      { trigger: '解約ページへの導線がメニューの深い場所にある', response: '迷ったら「DMMプレミアム 解約」で解約ページに直接アクセスするのが早い（本サイトのリンクからも飛べる）' },
      { trigger: '解約前の特典喪失の警告表示', response: 'DMM TV以外の特典（ポイント還元等）を実際に使っているかで判断。使っていなければ迷わず解約' },
    ],
    afterCancel:
      '解約後は期間末までDMM TVを視聴できる。DMMアカウント自体は残り、購入済みの動画・電子書籍は引き続き利用できる。再入会もすぐできるので、見たい作品が出た月だけ入る使い方も現実的。',
    faq: [
      { q: '解約してもDMMで購入した動画や本は見られますか？', a: 'はい。プレミアム（月額）の解約と、購入済みコンテンツの利用は別です。購入分はDMMアカウントに紐づいて残ります。' },
      { q: '無料体験中に解約するとすぐ見られなくなりますか？', a: '体験期間の扱いは時期のキャンペーンによって異なりますが、多くの場合は期間末まで利用できます。忘れないうちに解約手続きだけ先に済ませておくといいでしょう。' },
      { q: '解約とアカウント退会は違いますか？', a: '違います。月額のプレミアム解約だけならアカウントも購入物も残ります。退会（アカウント削除）は購入済みコンテンツも失うので、固定費を止める目的なら解約だけにしてください。' },
    ],
  },
  'niconico-premium': {
    summary:
      'ニコニコ動画プレミアムは、動画の画質・シーク・生放送の優先入場などが強化される月額会員。ニコニコ文化圏のヘビーユーザー向けの特典が中心なので、視聴頻度が落ちるとありがたみを感じにくくなり、なんとなく続けてしまいやすい。',
    whyHard:
      '専用の解約ページにログインして「次へ」→ 理由選択 →「退会する」と進む。手順は短いが、途中でプレミアム特典の喪失を強調する画面が挟まる。アプリ内課金（App Store/Google Play）契約の場合は各ストアからの解約になる。',
    darkPatterns: [
      { trigger: '「プレミアムだけの機能が使えなくなります」の列挙', response: '直近1ヶ月で実際に使った特典を思い出す。生放送の追い出しや画質で困った記憶がなければ一般会員で十分' },
      { trigger: '解約ボタンより継続ボタンが目立つ配色', response: 'ページ最下部までスクロールして「退会する」を探す。文言は「解約」でなく「（プレミアム）退会」' },
    ],
    afterCancel:
      '解約後も支払い済み期間の末日まではプレミアム機能を使える。ニコニコのアカウント自体は一般会員として残り、投稿動画やマイリストも消えない。混雑時の画質・生放送の優先入場だけが一般会員相当に戻る。',
    faq: [
      { q: 'プレミアムをやめると投稿した動画は消えますか？', a: '消えません。アカウントは一般会員として継続し、投稿・マイリストなどのデータも残ります。' },
      { q: 'アプリから解約できますか？', a: 'アプリ内課金で契約した場合は iPhone「設定」/Google Play の定期購入から解約します。Webで契約した場合はブラウザの解約ページから行います。' },
      { q: '「退会」と書いてあるのが不安です', a: 'ニコニコの表記では「プレミアム退会」は月額課金の解約を指し、アカウント削除ではありません。' },
    ],
  },
  crunchyroll: {
    summary:
      'Crunchyroll はソニー傘下の海外向けアニメ配信サービス。日本からも利用でき、多言語字幕・海外同時配信が特徴。海外在住者や語学学習用途での契約が多い。',
    whyHard:
      '解約自体はアカウントの Membership ページから「Cancel Membership」を押すだけと簡単な部類。画面が英語基調なのと、アプリストア経由の契約だと解約場所が変わるのは他サービスと共通の注意点だ。',
    darkPatterns: [
      { trigger: '英語UIでボタンの意味が取りにくい', response: '探すのは「Cancel Membership」。Pause（一時停止）系のオファーと混同しない' },
      { trigger: '解約前の割引オファー表示', response: '使っていないなら割引でも固定費。視聴頻度で判断する' },
    ],
    afterCancel:
      '解約後も支払い済み期間の終了までは視聴できる。終了後は無料会員となり、広告つきの対象作品のみ視聴可能。アカウントと視聴履歴は残るため再開は簡単。',
    faq: [
      { q: '日本語サポートはありますか？', a: '画面は英語基調ですが、解約は「Account」→「Membership」→「Cancel Membership」の位置で完結します。アプリ経由の契約は各ストアの定期購入から解約してください。' },
      { q: '解約後は何も見られなくなりますか？', a: '無料会員として広告つきの対象作品は視聴できます。プレミアム限定・同時配信の視聴ができなくなります。' },
      { q: '返金はありますか？', a: '原則、期間途中の日割り返金はありません。次回更新日前に解約すれば残り期間は視聴できます。' },
    ],
  },
  'line-music': {
    summary:
      'LINE MUSIC は LINE と連携した音楽配信。LINE の着うた・プロフィールBGM・通話の呼出音に曲を設定できるのが独自機能で、学割プランや LINE STORE 経由の支払いに対応する。',
    whyHard:
      'Webのマイページ →「プラン」→「プランを解約する」と進めば短いが、契約経路が LINE STORE / App Store / Google Play / Webと分かれており、契約した場所でしか解約できないのが難所。特にiPhoneのアプリ内課金は LINE MUSIC 側の画面からは止められない。',
    darkPatterns: [
      { trigger: 'アプリ内にそれらしい解約ボタンが見当たらない', response: '契約経路を確認。App Store 契約は iPhone「設定」→サブスクリプション、Google Play 契約はPlayストアの定期購入、それ以外はWebのマイページから' },
      { trigger: 'プロフィールBGMが消える等の引き止め表示', response: 'BGMや呼出音は解約で標準に戻るだけ。音楽を聴く頻度で判断する' },
    ],
    afterCancel:
      '解約後も支払い済み期間の末日までフル再生できる。期間終了後は30秒試聴のみになり、ダウンロード済み楽曲も再生不可。LINEのプロフィールBGM・呼出音の設定は解除される。プレイリストはアカウントに残るので再契約すれば復元される。',
    faq: [
      { q: 'LINEアプリから解約できますか？', a: '契約経路によります。LINE STORE またはWebで契約した場合はWebのマイページから、アプリ内課金の場合は各ストアのサブスクリプション管理から解約します。' },
      { q: '解約するとプレイリストは消えますか？', a: '消えません。アカウントに残るため、再契約すればそのまま使えます。再生できなくなるのは楽曲のフル再生とダウンロード分です。' },
      { q: '学割プランの解約も同じ手順ですか？', a: 'はい。プランの種類にかかわらず、契約した経路の解約手順は共通です。' },
    ],
  },
  'rakuten-music': {
    summary:
      '楽天ミュージックは楽天の音楽配信。楽天ポイントが貯まる・使えるのが特徴で、聴く時間が短い人向けのライトプランも用意されている。楽天カード/楽天モバイルユーザー向けの割引もある。',
    whyHard:
      '解約はWebのマイページ →「ご利用プラン」→「解約する」で完了する簡単な部類。ただしアプリ内課金（App Store/Google Play）契約はストア側での解約になる。楽天の他サービスと同じく、キャンペーン経由の契約だと更新日が分かりにくいことも覚えておきたい。',
    darkPatterns: [
      { trigger: 'ポイント還元による継続訴求', response: '還元されるポイントより月額の方が大きい。聴いていないなら解約が最も得' },
      { trigger: '解約ページよりプラン変更が目立つ', response: '安いプランへの変更提案に流されない。使っていないなら0円（解約）が正解' },
    ],
    afterCancel:
      '解約後は期間末までフル再生でき、その後は再生不可になる。プレイリストや楽曲のお気に入りはアカウントに残る。楽天市場での買い物や楽天ポイントの利用には一切影響しない。',
    faq: [
      { q: '楽天会員の退会が必要ですか？', a: '不要です。楽天ミュージックのプラン解約だけで完了し、楽天市場やポイントはそのまま使えます。' },
      { q: 'ライトプランに変えるか解約か迷っています', a: '月に数回でも聴くならライトプラン、直近1ヶ月でほぼ聴いていないなら解約が目安です。解約してもプレイリストは残るので、再開のハードルは低いです。' },
      { q: 'アプリで契約した場合の解約は？', a: 'App Store / Google Play のサブスクリプション管理から解約してください。Webのマイページからは止められません。' },
    ],
  },
  'soundcloud-go': {
    summary:
      'SoundCloud Go はクリエイター投稿型の音楽プラットフォーム SoundCloud の有料プラン。広告なし・オフライン再生・カタログ拡張が主な特典。インディーズやDJミックスを聴く層に使われる。',
    whyHard:
      'Webの Subscriptions 設定から「Cancel subscription」を押せば完了と簡単な部類。ただし画面が英語で、アプリ内課金契約はストア側解約になる点は他サービスと同じ。',
    darkPatterns: [
      { trigger: '英語UIで解約導線が分かりにくい', response: '探すのは Settings →「Subscriptions」→「Cancel subscription」。似た場所にある Upgrade 系ボタンと混同しない' },
      { trigger: '解約時の割引オファー', response: '聴く頻度が落ちているなら割引でも固定費。無料プランでも大半の楽曲は聴ける' },
    ],
    afterCancel:
      '解約後は期間末まで特典が使え、その後は無料プランに戻る。広告が再び表示され、オフライン保存分は再生できなくなる。いいね・プレイリスト・フォローはそのまま残る。',
    faq: [
      { q: '無料でも聴き続けられますか？', a: 'はい。SoundCloud は無料プランでも広告つきで大半の楽曲を再生できます。Go の特典（広告なし・オフライン）が不要なら解約で困ることは少ないです。' },
      { q: 'スマホアプリだけで解約手続きは完結しますか？', a: 'アプリ内課金で契約した場合は各ストアのサブスクリプション管理から解約します。Web契約はブラウザの設定ページから行います。' },
      { q: '解約でアカウントは消えますか？', a: '消えません。無料アカウントとして継続し、プレイリストなども残ります。' },
    ],
  },
  'rakuten-magazine': {
    summary:
      '楽天マガジンは雑誌読み放題サービス。数千冊規模の雑誌をアプリ/ブラウザで読める。年額プランは月額より割安だが、その分「使っていないのに払い続ける」期間も長くなりやすい。',
    whyHard:
      'マイページ →「ご契約内容の確認・変更」と進んだ先の「解約はこちら」がページ下部の小さいリンクで見つけにくい。理由選択を挟んで完了する。年額プランの途中解約は残期間の扱いを確認してから。',
    darkPatterns: [
      { trigger: '「解約はこちら」がページ最下部の小さいテキスト', response: '大きいボタンに惑わされずページの一番下までスクロールする' },
      { trigger: '年額プランの割安さを強調した引き止め', response: '割安でも読んでいなければ全額が無駄。直近1ヶ月で開いた回数で判断' },
    ],
    afterCancel:
      '解約後は期間末まで読み放題を利用でき、その後は閲覧不可になる。ダウンロード済みの雑誌も読めなくなる。お気に入り登録はアカウントに残る。楽天会員・ポイントには影響しない。',
    faq: [
      { q: '年額プランを途中で解約したら返金されますか？', a: '原則、残期間の日割り返金はありません。期間末まで使ってから自動更新前に解約するのが損のないタイミングです。' },
      { q: '楽天会員はそのままで大丈夫ですか？', a: 'はい。楽天マガジンの契約解除だけで完了します。楽天会員の退会は不要です（むしろしないでください）。' },
      { q: 'ダウンロードした雑誌は残りますか？', a: '残りません。読み放題の権利に紐づくため、解約後はダウンロード分も閲覧できなくなります。' },
    ],
  },
  dmagazine: {
    summary:
      'dマガジンはドコモの雑誌読み放題。週刊誌・ファッション誌・ビジネス誌など幅広く、dアカウントがあればドコモ回線なしでも契約できる。美容院や待合室感覚で「たまに読む」だけの契約が残りがち。',
    whyHard:
      '解約はdマガジン公式の解約ページ → dアカウントでログイン →「手続きを完了する」の流れ。途中にdアカウントの認証が挟まるため、パスワードを忘れていると中断しやすい。最後の完了ボタンまで進みきらないと、解約されていないことがある。',
    darkPatterns: [
      { trigger: '手続き途中の継続案内・アンケート', response: '完了画面が出るまでが解約。途中で閉じると契約が残るので「手続きを完了する」を必ず押す' },
      { trigger: '契約の存在自体を忘れやすい少額課金', response: '携帯料金明細の「dマガジン」を確認。読んでいないなら即解約' },
    ],
    afterCancel:
      '解約すると読み放題は利用できなくなる（タイミングは契約形態による）。dアカウント・dポイントはそのまま。クリッピング（お気に入り記事）は失われるため、必要な情報は事前に控えを。',
    faq: [
      { q: 'ドコモを解約したらdマガジンも自動で解約されますか？', a: 'されません。dアカウントに紐づく契約のため、回線解約とは別にdマガジン自体の解約手続きが必要です。' },
      { q: '解約したのに請求が続いています', a: '完了画面まで進みきっていなかった可能性があります。再度解約ページにログインして契約状態を確認してください。' },
      { q: '月の途中で解約すると損ですか？', a: '日割り返金はないので、金額だけ見れば更新日直前の解約が一番無駄がありません。ただし「次の更新日に解約しよう」と先延ばしにして結局忘れる人も多く、それなら思い立った今のうちに済ませたほうが結果的に良いことも多いです。' },
    ],
  },
  bookwalker: {
    summary:
      'BOOK☆WALKER はKADOKAWA系の電子書籍ストア。ラノベ・コミックに強く、購入型のストアと読み放題（月額）の両方がある。「やめる」際は月額サービスの解約とアカウント退会が別物である点が最重要。',
    whyHard:
      '読み放題など月額サービスの解約は設定からすぐ行える。ただしサイトの「退会」ページはアカウント自体の削除で、**退会すると購入済みの書籍がすべて読めなくなる**。固定費を止めたいだけの人が誤って退会すると被害が大きい。',
    darkPatterns: [
      { trigger: '「解約」を探して「退会」ページにたどり着いてしまう', response: '月額を止めたいだけなら退会ではなく、読み放題等の月額サービスの解約を行う。退会は蔵書を失う最終手段' },
      { trigger: '退会の重大さが手続き中に伝わりにくい', response: '退会確認画面の注意書きを必ず読む。購入書籍が読めなくなることに同意する内容になっている' },
    ],
    afterCancel:
      '月額サービスの解約なら、購入済みの書籍はそのまま読める。アカウント退会をした場合は購入書籍・コイン残高がすべて失われ、復元できない。迷ったら退会ではなく月額解約に留めるのが安全。',
    faq: [
      { q: '買った本を残したまま月額だけやめられますか？', a: 'はい。読み放題などの月額サービスを解約すれば、購入済みの書籍は引き続き読めます。アカウント退会をしない限り蔵書は残ります。' },
      { q: '退会すると本当に本が読めなくなりますか？', a: 'はい。退会＝アカウント削除のため、購入済み書籍・コイン残高はすべて失われ、復元もできません。' },
      { q: 'コイン残高がある場合は？', a: '退会前に使い切ってください。退会と同時に失効し、返金はされません。' },
    ],
  },
  honto: {
    summary:
      'honto は大日本印刷（DNP）系のハイブリッド書店。電子書籍と丸善・ジュンク堂などリアル書店の共通ポイントが特徴。月額課金は少なく、「やめる」＝アカウント退会を指すことが多い。',
    whyHard:
      '手続き自体は退会ページからすぐ行えるが、影響範囲は電子書籍だけにとどまらない。**退会すると購入済みの電子書籍が読めなくなるうえ、共通ポイントや提携書店との連携も解除される**。ここを見落として退会してしまう人は多い。',
    darkPatterns: [
      { trigger: '退会画面だけでは影響範囲が伝わりにくい', response: '読みかけの本、ポイント残高、店舗カードとの連携——このあたりに何が起きるか、退会前に確認しておくといい' },
      { trigger: '定期購読等の課金が別管理', response: '課金だけ止めたい場合は該当サービスの解約で足りることが多い。退会は最終手段' },
    ],
    afterCancel:
      '退会すると購入済み電子書籍は読めなくなり、hontoポイントも失効する。丸善・ジュンク堂の店舗ポイントカードとの連携も解除される。書籍を読み続けたい場合は退会せず、課金サービスのみ解約する。',
    faq: [
      { q: '電子書籍を残す方法はありますか？', a: 'アカウントを残す（退会しない）ことです。月額系の課金だけ解約すれば、購入済みの書籍は引き続き読めます。' },
      { q: 'ポイントはどうなりますか？', a: '退会と同時に失効します。残高がある場合は退会前に使い切ってください。' },
      { q: '店舗のポイントカードにも影響しますか？', a: 'はい。hontoと連携している店舗カードは連携が解除されます。店舗ポイントの扱いは退会前に確認してください。' },
    ],
  },
  'rakuten-kobo': {
    summary:
      '楽天Koboは楽天の電子書籍サービス。楽天ポイントとの連携が強く、購入型が基本。注意すべきは、Koboだけをやめる公式の「解約」がなく、退会手続きが**楽天会員全体の退会**に直結している構造。',
    whyHard:
      '難易度は構造的に高い。楽天の退会ページはKobo単体でなく楽天会員そのものの退会で、実行すると**楽天市場・楽天ポイント・楽天カード連携などすべてに影響**する。Koboの購入書籍も読めなくなる。月額の固定費を止める目的で退会に進むのは完全に過剰。',
    darkPatterns: [
      { trigger: '「Koboをやめる」＝楽天会員退会しか導線がない', response: '固定費を止めたいだけなら退会しない。定期購読等の課金があるなら該当サービス側の解約で止める。Kobo購入分の相談はKoboサポートへ' },
      { trigger: '「Koboの退会」のつもりが楽天会員全体の退会になっている', response: 'ポイント残高・楽天カードとの連携・他の楽天サービスの利用状況は退会と同時に消える。心当たりがあるものは先に確認しておく' },
    ],
    afterCancel:
      '楽天会員を退会すると、Kobo購入書籍・楽天ポイント・購入履歴がすべて失われ、楽天の他サービスも使えなくなる。書籍をやめたいだけなら「買わない」だけでよく、退会は不要。定期的な課金が明細にある場合は、その課金元サービスを特定して個別に解約する。',
    faq: [
      { q: 'Koboだけ解約して楽天会員は残せますか？', a: 'Kobo単体の「解約」という手続きは基本なく、購入をやめれば費用は発生しません。読み放題等の定期課金を契約している場合は、そのサービス側で個別に解約します。' },
      { q: '退会すると買った本はどうなりますか？', a: '読めなくなります。楽天会員退会はKoboの蔵書・ポイントを含む楽天全体のデータ削除につながるため、書籍を残したいなら退会しないでください。' },
      { q: '毎月Kobo関連の請求があります。正体は？', a: '読み放題・雑誌系の定期購読や、楽天マガジン等の別サービスの可能性があります。明細のサービス名を確認し、該当サービスのマイページから解約してください。' },
    ],
  },
  'note-premium': {
    summary:
      'noteプレミアムは記事投稿プラットフォーム note の有料会員。予約投稿・定期購読マガジンの発行・販売価格の上限アップなど、主に「書き手」向けの機能拡張。読むだけなら無料会員で十分。',
    whyHard:
      '設定 →「プレミアム」→「プレミアムを解約する」で完了する、最も簡単な部類。難所はほぼないが、クリエイター活動で予約投稿や定期購読マガジンを使っている場合は解約後の機能制限を先に確認したい。',
    darkPatterns: [
      { trigger: '書き手向け機能の喪失を強調する表示', response: '直近1ヶ月で予約投稿・マガジン機能を使ったかで判断。読む専門なら迷わず解約' },
    ],
    afterCancel:
      '解約後はプレミアム機能（予約投稿・定期購読マガジン運営など）が使えなくなるが、アカウント・投稿済み記事・フォロワーはそのまま残る。定期購読マガジンを運営している場合は購読者への影響を事前に確認する。',
    faq: [
      { q: '解約すると書いた記事は消えますか？', a: '消えません。投稿済みの記事・フォロワー・スキはすべて残ります。プレミアム限定機能が使えなくなるだけです。' },
      { q: '定期購読マガジンを運営中です。解約するとどうなりますか？', a: '定期購読マガジンの運営はプレミアム機能のため、解約前に購読者対応（案内・停止手順）を確認してから解約してください。' },
      { q: '読むだけの利用なら無料で足りますか？', a: 'はい。記事の閲覧・購入・スキ・フォローは無料会員のまま利用できます。' },
    ],
  },
  evernote: {
    summary:
      'Evernote は老舗のノートアプリ。Webクリップ・書類スキャン・全文検索が強みだが、近年は無料プランの制限強化と値上げが続き、乗り換え先（Notion・Obsidian・標準メモ等）を検討する人が増えている。',
    whyHard:
      '解約はアカウントの「請求情報」から「サブスクリプションのキャンセル」で完了し、手順自体は短い。難所は解約後で、無料プランの制限（ノート数・端末数）を超えたデータをどう扱うかを先に決めておかないと、解約してから身動きが取りにくくなる。',
    darkPatterns: [
      { trigger: '「データが失われる」ように読める警告表示', response: 'ノート自体は消えない。無料枠の制限で新規作成・同期が制限されるだけ。既存ノートの閲覧とエクスポートは可能' },
      { trigger: '解約時の割引オファー', response: '割引後の金額でも、開いていない期間が長いなら払い損。まず更新を止め、必要ならエクスポートしてから移行先を試す' },
    ],
    afterCancel:
      '解約後は期間末まで有料機能が使え、その後は無料プランに戻る。無料枠の上限（ノート数・接続端末数）を超えている場合、新規作成や同期に制限がかかるが、既存ノートの閲覧・エクスポートはできる。移行するなら ENEX 形式でのエクスポートが定番。',
    faq: [
      { q: '解約するとノートは消えますか？', a: '消えません。無料プランの制限内で閲覧・編集を続けられます。制限を超えている場合も既存ノートの閲覧とエクスポートは可能です。' },
      { q: '他のアプリへ移行できますか？', a: 'できます。ENEX形式でエクスポートすれば、Notion や Obsidian など主要ノートアプリがインポートに対応しています。解約前に済ませておくとスムーズです。' },
      { q: '年間プランの途中解約は返金されますか？', a: '基本的に途中解約の返金制度はなく、キャンセルは次回更新の停止という扱いになります。更新日の少し前を狙って手続きすれば、支払った期間を無駄にせずに済みます。' },
    ],
  },
  'apple-one': {
    summary:
      'Apple One は Apple Music・Apple TV+・Apple Arcade・iCloud+ をまとめた Apple のセットプラン。個別契約より割安になる半面、「使っていないサービスまで払っている」状態になりやすいセット契約の典型でもある。',
    whyHard:
      '解約自体は iPhone の「設定」→ Apple ID →「サブスクリプション」→ Apple One から数タップで終わる。難しいのはその後で、Apple One をやめると含まれていたサービスが一括で止まる。iCloud+ の容量など残したいものがあれば、それだけを個別に契約し直すかどうかを先に決めておきたい。',
    darkPatterns: [
      { trigger: '「セットの方がお得」比較表示', response: '比較の前提は「全部使う」こと。実際に使っているのが2つ以下なら個別契約の方が安いことが多い' },
      { trigger: '解約で複数サービスが同時停止することの告知が控えめ', response: '特に iCloud+ の容量超過に注意。写真のバックアップが止まる前に、残す容量プランを決めておく' },
    ],
    afterCancel:
      '解約すると期間末で Music・TV+・Arcade・iCloud+ がまとめて止まる。iCloud の保存容量が無料5GBを超えている場合は同期・バックアップが制限されるため、iCloud+ だけ個別に契約し直すか、データを整理する。個別に使いたいサービスは同じサブスクリプション画面から単体契約できる。',
    faq: [
      { q: 'iCloudの写真は消えますか？', a: 'すぐには消えませんが、無料5GBを超えた状態では新しいバックアップや同期が止まります。写真の量が多いなら、iCloud+ だけ単体契約で残す選択肢もあります。' },
      { q: 'Apple Music だけ残せますか？', a: 'はい。Apple One を解約したうえで、Apple Music を単体で契約し直せます。合計額が下がるかは使うサービス数次第です。' },
      { q: 'ファミリープランの家族への影響は？', a: '管理者が解約すると家族全員の共有特典（容量・各サービス）も止まります。家族の利用状況を確認してから解約してください。' },
    ],
  },
  'google-one': {
    summary:
      'Google One は Gmail・Google ドライブ・Google フォト共通の追加ストレージ。無料15GBを超えた分の保存に使われ、AI機能つきの上位プランも登場している。「写真とメールのために何となく払い続ける」代表的なサブスク。',
    whyHard:
      '解約は one.google.com の設定から「メンバーシップをキャンセル」で数クリック。難所は解約そのものより解約後の容量超過だ。無料15GBを超えたままだと新しいメールの受信やファイル保存に支障が出てくるので、先にデータを整理するか移行先を決めてから手続きしたい。',
    darkPatterns: [
      { trigger: '「メールが受信できなくなります」の強い警告', response: '事実だが即時ではない。超過状態が続いた場合の話なので、まず容量を確認して大きいファイル・古いバックアップを整理する' },
      { trigger: 'AI機能つき上位プランへの誘導', response: '容量目的の契約なら不要。必要なのは容量整理か下位プランへの変更' },
    ],
    afterCancel:
      '解約後は期間末で無料15GBに戻る。超過している場合、既存データは閲覧・ダウンロードできるが、新規のアップロードやメール受信に制限がかかっていく。Google Takeout で一括エクスポートしてから整理するのが定番の手順。',
    faq: [
      { q: '解約したら写真やメールは消えますか？', a: 'すぐには消えません。ただし無料枠を超えたままだと新規保存・受信が制限されます。長期間超過した状態が続くと削除されるポリシーもあるので、早めに整理しておくほうがいいでしょう。' },
      { q: '容量を減らすコツはありますか？', a: 'Googleフォトの「大きいファイル」整理、Gmailの添付付き古いメール検索（has:attachment larger:10M）、ドライブのゴミ箱を空にする、の3つで大きく減ることが多いです。' },
      { q: '下位プランへの変更もできますか？', a: 'できます。解約でなくプラン変更なら、容量を落として費用を下げつつ超過を避けられます。' },
    ],
  },
  'icloud-plus': {
    summary:
      'iCloud+ は Apple のクラウドストレージ。iPhone のバックアップと写真の同期に使われ、無料5GBでは足りずに契約する人が大半。「解約」は正確には無料5GBプランへのダウングレード。',
    whyHard:
      '手続きは「設定」→ Apple ID →「iCloud」→ ストレージプランの変更 → 無料5GBへ、と数タップ。難所は解約そのものでなく、5GBに収まらないデータの行き先。特に写真とiPhoneバックアップの代替手段を決めずにダウングレードすると、バックアップが止まる。',
    darkPatterns: [
      { trigger: '「バックアップできなくなります」の警告で引き返させる', response: '事実なので、先に代替（パソコンへのバックアップ・Googleフォト等への移行・写真の整理）を用意してから戻ってくる' },
      { trigger: 'ワンタップで上位プランに上がる導線の近さ', response: '容量不足の通知からの誘導で必要以上のプランに上げない。実使用量を確認して最小プランを選ぶ' },
    ],
    afterCancel:
      'ダウングレード後は次回請求日から5GB枠になる。超過分のデータは即削除ではないが、新規の同期・バックアップが止まる。iPhoneのバックアップはパソコン（Finder/iTunes）でも取れるため、クラウドにこだわらなければ費用ゼロの運用も可能。',
    faq: [
      { q: '写真が5GBを超えています。解約したら消えますか？', a: 'すぐには消えませんが、新しい写真の同期が止まります。ダウングレードする前に、パソコンや外部ストレージ、他のクラウドへ写真を退避しておきましょう。' },
      { q: 'iPhoneのバックアップはどうすればいいですか？', a: 'パソコンに接続して Finder（Windows は iTunes/Appleデバイス）でローカルバックアップが取れます。定期的にパソコンへ繋ぐ習慣があれば iCloud+ なしでも運用できます。' },
      { q: 'Apple One に入っている場合は？', a: 'iCloud+ 単体でなく Apple One 側の変更・解約になります。サブスクリプション画面で契約形態を確認してください。' },
    ],
  },
  '1password': {
    summary:
      '1Password は定番のパスワード管理アプリ。強力なパスワード生成・自動入力・家族/チーム共有が特長。パスワード管理は解約の影響が「全アカウントのログイン」に及ぶため、やめ方の設計が特に重要なサブスク。',
    whyHard:
      '解約は 1Password.com の「請求」からキャンセルするだけだが、本当の難所は移行。保存したパスワードを次の管理手段（他のパスワードマネージャー・ブラウザ標準・Apple パスワード等）へエクスポートしてからでないと、解約後にログインできないサービスが出て詰む。',
    darkPatterns: [
      { trigger: '解約後のデータアクセスへの不安を煽られやすい', response: '解約してもアカウントは読み取り専用で残り、閲覧・エクスポートは可能。ただし新規保存や編集はできなくなる' },
    ],
    afterCancel:
      '解約後は読み取り専用モードになり、既存のパスワードの閲覧とエクスポートはできるが、新規追加・編集ができなくなる。移行先を決め、エクスポート（CSV等）→ インポート → 動作確認まで済ませてから解約するのが失敗しない順番だ。家族プランは共有メンバー全員に影響する。',
    faq: [
      { q: '解約するとパスワードが見られなくなりますか？', a: 'いいえ。読み取り専用で閲覧・エクスポートは可能です。ただし新規保存・編集はできないため、実用上は移行が前提になります。' },
      { q: '無料の代替はありますか？', a: 'Apple の「パスワード」アプリ、Google パスワードマネージャー、Bitwarden（無料枠）などが定番です。エクスポート/インポートで移行できます。' },
      { q: '家族プランの解約は家族にも影響しますか？', a: 'はい。共有ボルトを含めメンバー全員が読み取り専用になります。全員の移行を確認してから解約してください。' },
    ],
  },
  figma: {
    summary:
      'Figma はブラウザベースのデザインツール。有料プランは共同編集・バージョン履歴・チームライブラリなどが拡張される。個人でなくチーム単位の課金構造のため、「誰が払っているか」問題が起きやすい。',
    whyHard:
      '手続きは Settings → Plans からダウングレード/キャンセルだが、課金がチーム（組織）単位なので、支払い権限を持つ管理者しか解約できない。個人の画面には解約導線が見えないことがあり、「解約できない」と感じる原因の多くは権限の問題。',
    darkPatterns: [
      { trigger: '解約ボタンが見当たらない', response: 'まず自分がチームの支払い管理者か確認。違う場合は管理者に依頼するか、自分のチームを別途確認する' },
      { trigger: '席数（エディター数）課金の自動増加', response: 'メンバーを編集者として招待すると席数が増えて課金も増える設計。不要な編集権限を閲覧者に落とすだけで料金が下がることがある' },
    ],
    afterCancel:
      'ダウングレード後は無料プランの制限（プロジェクト数・バージョン履歴期間など）に戻るが、ファイル自体は残り閲覧・編集できる。チームライブラリなど有料機能に依存した運用をしていた場合は代替フローを決めておく。',
    faq: [
      { q: '解約するとデザインファイルは消えますか？', a: '消えません。無料プランの制限内で引き続き使えます。制限を超えるプロジェクトは閲覧可能なまま整理を促されます。' },
      { q: '請求だけ来ていて誰が契約したか分かりません', a: '請求メールの宛先アカウントでログインし、Settings → Plans で契約チームを確認してください。チームの支払い管理者だけが解約できます。' },
      { q: '席数を減らすだけでも安くなりますか？', a: 'なります。編集者（有料席）を閲覧者に変更すれば席数分の課金が減ります。実際には全員に編集権限が必要なわけではないチームも多いので、一度権限を見直す価値はあります。' },
    ],
  },
  'deepl-pro': {
    summary:
      'DeepL Pro は高精度翻訳 DeepL の有料プラン。文字数無制限・文書まるごと翻訳・用語集などが使える。無料版でも日常利用には十分なことが多く、「Pro である必要があるか」を見直しやすいサブスク。',
    whyHard:
      'アカウントの「プラン」から「プランをキャンセル」→ 理由選択で完了と手順は短い。注意点は契約期間で、年契約の場合は更新日前の解約手続きが必要。更新日を過ぎると次の1年分が確定する。',
    darkPatterns: [
      { trigger: '年契約の自動更新で解約時期を逃しやすい', response: '契約形態（月/年）と次回更新日をプランページで確認し、更新日前に手続きする' },
      { trigger: '文字数制限の不便さを思い出させる引き止め', response: '無料版の制限（文字数・文書翻訳）で実際に困った頻度で判断。たまの長文はブラウザ拡張や分割で足りることが多い' },
    ],
    afterCancel:
      '解約後は契約期間の末日まで Pro 機能が使え、その後は無料版に戻る。翻訳履歴や用語集など Pro 依存の機能は使えなくなるため、用語集はエクスポートしておく。無料版でも翻訳品質自体は同じ。',
    faq: [
      { q: '無料版と翻訳の質は違いますか？', a: '翻訳エンジンの品質は基本同じです。違いは文字数上限・文書翻訳・用語集・セキュリティ（データ保持）などの機能面です。' },
      { q: '年契約を途中でやめたら返金は？', a: '原則、期間途中の返金はなく、次回更新の停止になります。更新日を確認して期間を使い切るのが損のないやめ方です。' },
      { q: '仕事でたまに長文を訳します。Proは必要？', a: '頻度次第です。月に数回なら無料版＋分割で足りることが多いですが、毎日大量に訳す場合や機密文書を扱う場合はProの機能が生きてきます。' },
    ],
  },
  pairs: {
    summary:
      'Pairs（ペアーズ）は国内大手のマッチングアプリ。男性有料・女性基本無料の構造で、有料会員は月額のほかプレミアム等のオプションが重なりやすい。決済経路により解約手順が完全に分かれるのが最大の特徴。',
    whyHard:
      '難易度は高い。まずアプリ内に解約ボタンがない。App Store/Google Play 課金ならストアのサブスクリプション管理、クレカ（Web）決済ならブラウザ版のマイページと、契約経路によって解約場所が全く違う。さらに「有料プランの解約」と「アカウント退会」は別物で、退会だけしても課金が止まらない事故が起きやすい。',
    darkPatterns: [
      { trigger: 'アプリを削除すれば解約できると思わせる構造', response: 'アプリ削除では課金は止まらない。必ず契約経路（ストア/Web）側で解約手続きをする' },
      { trigger: '退会手続きに進んでも有料プランが残る', response: '順番が重要。先に有料プランを解約 → 期間終了を確認 → 必要ならアカウント退会' },
      { trigger: 'オプション（プレミアム等）の重ね課金', response: '本体プランとオプションは別契約。ストアのサブスクリプション一覧で全部見えるので、まとめて確認する' },
    ],
    afterCancel:
      '有料プランを解約しても期間末まで有料機能は使え、その後は無料会員に戻る（メッセージ閲覧等に制限）。恋人ができた等で完全にやめる場合は、有料解約 → 期間満了 → アカウント退会の順。退会するとマッチ・メッセージ履歴は削除される。',
    faq: [
      { q: 'アプリを消したのに請求が続いています', a: 'アプリ削除は解約ではありません。iPhoneは「設定」→サブスクリプション、Androidは Playストアの定期購入、クレカ決済はブラウザ版マイページから解約してください。' },
      { q: '退会と解約はどちらが先ですか？', a: '有料プランの解約が先です。退会だけしても課金契約が残る場合があるので、解約 → 期間終了の確認 → 退会、という順番を守ってください。' },
      { q: '解約したらすぐ使えなくなりますか？', a: 'いいえ。支払い済み期間の末日までは有料機能を使えます。' },
    ],
  },
  'github-copilot': {
    summary:
      'GitHub Copilot は AI コーディング支援。エディタ補完からエージェント機能まで広がり、個人・法人プランがある。AI ツールの進化が速く、乗り換え・重複契約の見直し対象になりやすい。',
    whyHard:
      '個人契約は GitHub の設定ページから「Cancel Copilot」を2回確認で完了と簡単。ただし会社（Organization）契約の場合は管理者経由でしか外せない。他のサブスクと違う注意点として、2026年4月以降は個人向けの新規サインアップが停止されており、一度解約すると再契約できない場合がある。',
    darkPatterns: [
      { trigger: '解約の不可逆性（再契約不可の可能性）が見えにくい', response: '完全解約の前に下位プランへの変更で足りないか検討する。迷いがあるならプラン変更が安全' },
      { trigger: '個人契約と組織付与の混在', response: '設定ページでどちらの Copilot が有効か確認。組織付与なら自分で解約は不要（管理者側の管理）' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで利用でき、その後補完・チャット機能が使えなくなる。コードやリポジトリには影響しない。新規サインアップ停止中のため、再開したくなっても個人プランには戻れない可能性があることを織り込んで判断する。',
    faq: [
      { q: '解約したら書いたコードに影響はありますか？', a: 'ありません。Copilot は支援ツールであり、リポジトリやコードはそのまま残ります。' },
      { q: '解約後にまた使いたくなったら再契約できますか？', a: '個人向けの新規サインアップは2026年4月以降停止中のため、再契約できない場合があります。迷っている場合は解約でなく下位プランへの変更を検討してください。' },
      { q: '会社のアカウントで使っています。自分で解約できますか？', a: 'できません。Organization 契約の Copilot は管理者がシート管理します。不要なら管理者にシートの解除を依頼してください。' },
    ],
  },
  'vimeo-pro': {
    summary:
      'Vimeo は広告なしの動画ホスティング。ポートフォリオや限定公開・埋め込み配信に使われ、有料プランはアップロード容量と配信機能が拡張される。制作の仕事が落ち着くと使わなくなりやすいサブスク。',
    whyHard:
      '設定の「Billing」→「Cancel plan」で手続き自体は短い。難所は解約後の保存数制限だ。無料プランの上限を超えたアップロード済み動画をどうするか決めておかないと、公開中の埋め込み動画が視聴できなくなることがある。',
    darkPatterns: [
      { trigger: '「動画が削除される可能性」の警告で引き返させる', response: '事実ベースで対処する。重要な動画はローカルへダウンロード、埋め込み利用中の動画はYouTube限定公開等の代替へ移してから解約' },
      { trigger: '年契約の自動更新', response: '更新日を Billing ページで確認し、更新前に手続き。日割り返金は基本ない' },
    ],
    afterCancel:
      '解約後は無料プランの制限（容量・機能）に戻る。上限超過分の動画は視聴・管理に制限がかかるため、必要な動画は事前にダウンロードして退避する。埋め込み先（自社サイト等）がある場合はリンク切れの確認を。',
    faq: [
      { q: 'アップロードした動画は消えますか？', a: '即削除ではありませんが、無料枠を超えた分は制限対象になります。原本は手元に残しておき、公開が必要な動画は代替先へ移してから解約してください。' },
      { q: 'サイトに埋め込んでいる動画はどうなりますか？', a: '制限対象になると再生できなくなる可能性があります。埋め込み利用中の動画は解約前に一覧化して、移行先を決めてください。' },
      { q: '無料プランに戻すだけなら退会は不要ですか？', a: '不要です。プランのキャンセルで無料プランに戻り、アカウントは残ります。' },
    ],
  },
  patreon: {
    summary:
      'Patreon はクリエイター支援プラットフォーム。月額の「サブスク」というより、クリエイターごとの支援（pledge）の集合で、複数の支援が積み重なって合計額が膨らみやすい。解約もクリエイター単位で行う。',
    whyHard:
      '手続きは Memberships の一覧から対象クリエイターの「Edit or cancel pledge」→「Cancel my pledge」でよく、1件ずつは簡単。難所は全体像の把握で、少額の支援が複数並ぶと合計を意識しなくなる。一覧で総額を確認するのが見直しの第一歩。',
    darkPatterns: [
      { trigger: '1件ごとが少額で合計が見えにくい', response: 'Memberships 一覧で支援中の全クリエイターと合計月額を確認。「応援」の気持ちと家計は分けて棚卸しする' },
      { trigger: '解約時の「クリエイターへの影響」訴求', response: '罪悪感で継続しない。支援は余裕がある時に再開できる。単発の応援（購入・投げ銭）という選択肢もある' },
    ],
    afterCancel:
      '解約したクリエイターの限定コンテンツは、支払い済み期間の扱いに応じて閲覧できなくなる。アカウントは残り、他の支援には影響しない。再支援はいつでも可能。',
    faq: [
      { q: '全部まとめて解約できますか？', a: '一括解約の機能は基本なく、クリエイターごとに Cancel my pledge を行います。Memberships 一覧から順に手続きしてください。' },
      { q: '解約すると過去の限定投稿は見られますか？', a: 'クリエイターの設定によります。支援期間中のみ閲覧可の設定が多いため、必要な情報は解約前に確認してください。' },
      { q: '請求のタイミングが分かりません', a: 'クリエイターにより毎月1日請求や加入日基準など複数の方式があります。解約前に次回請求日を確認すると二重払いを避けられます。' },
    ],
  },
  match: {
    summary:
      'マッチドットコム（Match）は歴史の長いマッチングサービス。真剣な出会い向けとされ、月額プランの自動更新が基本。海外系サービス特有の「解約導線の分かりにくさ」が国内アプリより強め。',
    whyHard:
      '難易度は高い。アプリ内では解約できず、PCブラウザで請求ページにログインして「自動更新の停止」→ 理由選択 → 引き止め画面を複数進めてようやく完了する。途中の割引オファーやアンケートで離脱させる設計が多い。',
    darkPatterns: [
      { trigger: 'アプリ内に解約導線がない', response: '必ずPCブラウザ（またはブラウザのPC表示）でログインして手続きする' },
      { trigger: '解約フロー途中の割引・一時停止オファーの連打', response: 'ゴールは「自動更新の停止が完了しました」の確認画面。オファー画面は全てスキップして先へ進む' },
      { trigger: '退会と自動更新停止の混同', response: '課金を止めるのは「自動更新の停止」。プロフィール削除（退会）だけでは課金が残る場合がある' },
    ],
    afterCancel:
      '自動更新を停止しても支払い済み期間の末日までは有料機能を使える。完全にやめる場合は、期間満了後にアカウント削除を別途行う。解約確認メールは、後で身に覚えのない請求が来たときの証拠になるので残しておこう。',
    faq: [
      { q: 'スマホしか持っていません。解約できますか？', a: 'できます。スマホのブラウザで「PC版サイトを表示」に切り替えてログインすれば、同じ手順で自動更新を停止できます。' },
      { q: '解約したつもりなのに請求が来ました', a: '引き止め画面の途中で離脱して完了していなかった可能性があります。請求ページで自動更新の状態を確認し、完了画面・確認メールまで到達してください。' },
      { q: '返金はありますか？', a: '原則、期間途中の返金はありません。次回更新日前までに自動更新を止めれば、残り期間は利用できます。' },
    ],
  },
  'discord-nitro': {
    summary:
      'Discord Nitro はチャットアプリ Discord の有料プラン。絵文字の全サーバー利用・大容量アップロード・高画質配信・サーバーブーストなどが特典。ゲーム熱が落ち着くと使わなくなりやすい。',
    whyHard:
      'ユーザー設定 →「サブスクリプション」→「Nitroをキャンセル」で完了と簡単な部類。注意したいのはサーバーブーストだ。Nitro 特典のブーストを友人のサーバーに付けている場合、解約するとブーストが外れてサーバーのレベルが下がってしまう。',
    darkPatterns: [
      { trigger: 'ブーストが外れることへの気兼ねを利用した継続', response: 'ブーストは善意の上乗せ。家計を削ってまで維持するものではない。必要ならサーバー管理者に一言伝えれば十分' },
      { trigger: 'アプリ内課金契約の解約場所の違い', response: 'iPhoneアプリから加入した場合は「設定」→サブスクリプションから。Web/PC契約はDiscordのユーザー設定から' },
    ],
    afterCancel:
      '解約後も請求期間の残り日数は特典を使える。期間終了で絵文字・アップロード上限などが無料仕様に戻り、付与していたサーバーブーストは外れる。アカウント・サーバー・メッセージには影響しない。',
    faq: [
      { q: '解約するとサーバーはどうなりますか？', a: 'サーバー自体は何も変わりません。あなたが付けていたブーストが外れるだけで、ブースト数が減るとサーバーの特典レベルが下がる場合があります。' },
      { q: 'アップロードした大容量ファイルは見られなくなりますか？', a: '過去に送信したファイルはそのまま残ります。解約後に新しく送れるファイルのサイズ上限が無料仕様に戻るだけです。' },
      { q: '期間の途中で解約すると損ですか？', a: '解約手続きをしても期間末まで特典は使えるので、思い立った時に手続きして問題ありません。' },
    ],
  },
  'linkedin-premium': {
    summary:
      'LinkedIn Premium はビジネスSNS LinkedIn の有料プラン。転職活動向け（Career）や営業向け（Sales Navigator）などプランが分かれている。無料トライアルから自動課金に切り替わるパターンが多く、月額の高さもあって見直し対象になりやすい。',
    whyHard:
      '解約ページから「Continue to cancel」→ 理由選択 →「Confirm cancel」と進むが、途中で割引・一時停止など複数の引き止めオファーが挟まる。無料トライアル中は期限内に解約しないと比較的高額な月額が自動で始まる点が最大の注意。',
    darkPatterns: [
      { trigger: '無料トライアル終了直前の自動課金', response: 'トライアル開始時点で終了日をカレンダーに入れる。解約してもトライアル期間の末日までは使える' },
      { trigger: '解約フロー内の割引・プラン変更オファー', response: '目的が「固定費を止める」なら全てスキップ。「Confirm cancel」の完了画面まで進む' },
    ],
    afterCancel:
      '解約後は請求期間の末日まで Premium 機能（閲覧者の確認・InMail など）が使え、その後無料アカウントに戻る。プロフィール・つながり・投稿には影響しない。転職活動が忙しい月だけ契約し、落ち着いたら解約する使い方をしている人も多い。',
    faq: [
      { q: '解約するとプロフィールや人脈は消えますか？', a: '消えません。無料アカウントとしてすべて残ります。Premium 限定機能が使えなくなるだけです。' },
      { q: '無料トライアルだけで終わらせるには？', a: '開始直後に解約手続きを済ませておけば、後から気づいて課金される心配がありません。解約してもトライアル期間の最終日までは Premium 機能を使えます。' },
      { q: 'InMail の未使用分はどうなりますか？', a: '解約後（期間終了後）は失効します。使い切ってから期間末を迎えるのが無駄のないやめ方です。' },
    ],
  },
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
      '支払い済み期間の終了日までは通常どおり視聴できる。プロフィールと視聴履歴は数ヶ月間保持され、再加入時に復元される。',
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
      '支払い済み期間が終わるまでは特典をフル活用できる。期間満了後は通常の Yahoo! JAPAN ID（無料）に戻る。PayPay 連携は維持。ebook japan で購入済みの書籍は引き続き読める。',
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
      '支払い済み期間の末日まではPremium機能を使い続けられる。終了するとダウンロード済み動画は即時アクセス不可になるが、視聴履歴・チャンネル登録・プレイリストは全て保持される。',
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
      { q: '料金がドル建てで、日本円の金額が分かりません', a: 'Anthropic への支払いは USD 建てのため、為替レート次第で毎月の円換算額（目安3000円前後）が上下します。実際に引き落とされる円金額はクレジットカードの利用明細で確認できます。' },
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
      { q: 'App Storeから加入した場合、どこで解約しますか？', a: 'iPhone「設定」→「サブスクリプション」から解約します。ABEMA アプリ内では解約できません。' },
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
      '支払い済み期間の末日までは引き続き視聴でき、ダウンロード再生も使える。視聴履歴・お気に入りも消えずに残る。年契約の場合は、解約前に違約金の有無と金額を確認しておこう。',
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
      { q: '無料体験期間中に解約しても期間末まで使えますか？', a: 'はい、無料体験期間中に解約しても、期間終了日まではフル機能で利用できます。体験期間が終わる前に手続きしておけば、料金は一切発生しません。' },
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


