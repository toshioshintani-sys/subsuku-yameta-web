import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Analytics from './components/Analytics';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import './index.css';

// HomePage は最初に来る確率が高いので eager。他のルートは遅延ロードで
// 初期 JS バンドルを縮小する（SEO / Lighthouse スコア向上）
const ServicePage = lazy(() => import('./pages/ServicePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const PriceWatchPage = lazy(() => import('./pages/PriceWatchPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const DiscoverIndexPage = lazy(() => import('./pages/DiscoverIndexPage'));
const DiscoverGenrePage = lazy(() => import('./pages/DiscoverGenrePage'));
const YameteKauPage = lazy(() => import('./pages/YameteKauPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const GameDetailPage = lazy(() => import('./pages/GameDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const DisclosurePage = lazy(() => import('./pages/DisclosurePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div
      aria-live="polite"
      style={{
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-faint)',
        fontSize: '13px',
      }}
    >
      読み込み中…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Analytics />
      <Header />
      <main id="main">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/compare" element={<ComparePage />} />
          {/* 価格・仕様の変更ログ（2026-07-28 追加）。溜めた記録の置き場所 */}
          <Route path="/price-watch" element={<PriceWatchPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/discover" element={<DiscoverIndexPage />} />
          <Route path="/discover/:id" element={<DiscoverGenrePage />} />
          <Route path="/yamete-kau" element={<YameteKauPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/disclosure" element={<DisclosurePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </BrowserRouter>
  );
}
