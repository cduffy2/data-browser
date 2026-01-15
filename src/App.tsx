import { useState, useEffect } from 'react';
import { DataBrowserPage } from './pages/DataBrowserPage/DataBrowserPage';
import { SenegalOverviewPage } from './pages/SenegalOverviewPage/SenegalOverviewPage';

type Page = 'senegal-overview' | 'data-browser';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Check URL hash for initial page
    const hash = window.location.hash.slice(1);
    if (hash === 'data-browser') return 'data-browser';
    return 'senegal-overview';
  });

  useEffect(() => {
    // Update URL hash when page changes
    window.location.hash = currentPage;
  }, [currentPage]);

  useEffect(() => {
    // Listen for hash changes (browser back/forward)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'data-browser') {
        setCurrentPage('data-browser');
      } else {
        setCurrentPage('senegal-overview');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    // Scroll to top of page on navigation
    window.scrollTo(0, 0);
  };

  switch (currentPage) {
    case 'data-browser':
      return <DataBrowserPage onNavigate={handleNavigate} currentPage={currentPage} />;
    case 'senegal-overview':
    default:
      return <SenegalOverviewPage onNavigate={handleNavigate} currentPage={currentPage} />;
  }
}

export default App;
