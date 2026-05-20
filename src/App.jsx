import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './components/Analytics';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import DisclaimerPage from './pages/DisclaimerPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/service/:id" element={<ServicePage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
