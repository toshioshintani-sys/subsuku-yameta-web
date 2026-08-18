import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import sitemap from './vite-plugin-sitemap.js';

// PWA 設定
// - ホーム画面に追加できる（manifest）
// - オフラインでも解約手順を閲覧可能（Service Worker のプリキャッシュ）
// - ロゴ画像（Clearbit）はネット必須なので、オフライン時は emoji フォールバック
export default defineConfig({
  plugins: [
    react(),
    sitemap(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og-image.svg', 'ads.txt', 'robots.txt'],
      manifest: {
        name: 'サブスクやめた',
        short_name: 'サブスクやめた',
        description:
          'Netflix・Spotify・Amazonプライム…58以上のサブスクの解約ページへ直接ジャンプ。手順と注意点も3ステップで要約。',
        theme_color: '#1a1f2e',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'ja',
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // SPA フォールバック
        navigateFallback: '/index.html',
        // sitemap.xml と ads.txt は Netlify が直接配信するので除外
        // feed.xml / llms.txt / IndexNowキー(.txt) も同様に静的配信（SWを通さない）
        navigateFallbackDenylist: [
          /^\/sitemap\.xml/,
          /^\/ads\.txt/,
          /^\/robots\.txt/,
          /^\/feed\.xml/,
          /^\/llms\.txt/,
          /^\/[0-9a-f]{32}\.txt$/,
        ],
        runtimeCaching: [
          // ページ本体（HTML）は必ずネットワークを先に見る（2026-07-26 追加）
          //
          // これを入れる前は、デプロイ直後の**1回目のアクセスが古いキャッシュ**を表示していた。
          // 実測：価格を直して本番反映した直後にスマホ幅で開くと Spotify ¥480〜・
          // ChatGPT ¥3,100〜 と旧価格が出て、「最近の変更」も出なかった。
          // 2回目の読み込みで正しくなる（registerType:'autoUpdate' が新SWを適用するのは
          // 表示後なので、初回は古いHTMLが配られる）。
          //
          // このサイトは価格の正確さが存在意義なので、「初回だけ古い価格を見せる」のは
          // 実質的な誤報にあたる。HTMLだけ NetworkFirst にして、必ず新しい方を出す。
          // オフライン時は3秒でキャッシュに切り替わるので、
          // 「オフラインでも解約手順を読める」というPWAの利点は保たれる。
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3, // 圏外・低速時はここでキャッシュに切り替える
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ロゴ画像（Clearbit）は SWR（古いキャッシュを返しつつバックグラウンドで更新）
          {
            urlPattern: /^https:\/\/logo\.clearbit\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'clearbit-logos',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Tag / AdSense はキャッシュしない（最新バージョンを毎回取りに行く）
          {
            urlPattern: /^https:\/\/(www\.googletagmanager\.com|pagead2\.googlesyndication\.com|www\.google-analytics\.com)\/.*/,
            handler: 'NetworkOnly',
          },
        ],
      },
      // 開発時は SW を有効にしない（ホットリロードと衝突するため）
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
