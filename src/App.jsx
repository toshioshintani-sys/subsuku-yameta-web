import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './components/Analytics';
import HomePage from './pages/HomePage';
import './index.css';

// HomePage は最初に来る確率が高いので eager。他のルートは遅延ロードで
// 初期 JS バンドルを縮小する（SEO / Lighthouse スコア向上）
const ServicePage = lazy(() => import('./pages/ServicePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const DiscoverIndexPage = lazy(() => import('./pages/DiscoverIndexPage'));
const DiscoverGenrePage = lazy(() => import('./pages/DiscoverGenrePage'));
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
        color: '#6b7280',
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
      <Analytics />
      <Header />
      <main id="main">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/discover" element={<DiscoverIndexPage />} />
          <Route path="/discover/:id" element={<DiscoverGenrePage />} />
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
    </BrowserRouter>
  );
}
