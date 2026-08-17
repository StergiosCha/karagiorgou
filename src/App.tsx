import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import SeriesPage from './pages/SeriesPage';
import About from './pages/About';
import { JournalIndex, JournalEntryPage } from './pages/Journal';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Header />
      {/* keyed on pathname so each route dissolves in — a cut, not a slide */}
      <main id="main" className="page" key={pathname} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/series/:slug" element={<SeriesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/journal" element={<JournalIndex />} />
          <Route path="/journal/:slug" element={<JournalEntryPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ScrollToTop />
        <Shell />
      </BrowserRouter>
    </LanguageProvider>
  );
}
