import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 (GA4) のSPA対応トラッカー
// VITE_GA_MEASUREMENT_ID が設定されていれば自動で有効化される
// 設定方法は docs/MORNING_REPORT_2026-05-20.md 参照

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function Analytics() {
  const location = useLocation();

  // 初回ロード時に gtag.js を読み込んで GA4 を初期化
  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return;
    if (document.getElementById('ga-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    // send_page_view: false にして、ルート変更時の useEffect 側で page_view を送る
    // （SPA で初回二重計測を防ぐため）
    window.gtag('config', GA_ID, { send_page_view: false });
  }, []);

  // ルート変更（pushState）ごとに page_view イベント送信
  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined' || !window.gtag) return;
    const path = location.pathname + location.search;
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
