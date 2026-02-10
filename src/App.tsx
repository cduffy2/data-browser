import { useState, useEffect, useRef } from 'react';
import { DataBrowserPage } from './pages/DataBrowserPage/DataBrowserPage';
import { SenegalOverviewPage } from './pages/SenegalOverviewPage/SenegalOverviewPage';
import { SegmentProfilePage } from './pages/SegmentProfilePage/SegmentProfilePage';
import { WalkInHerShoesPage } from './pages/WalkInHerShoesPage/WalkInHerShoesPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { CompareSegmentsPage } from './pages/CompareSegmentsPage/CompareSegmentsPage';
import { SegmentationsPage } from './pages/SegmentationsPage/SegmentationsPage';

type Page = 'kenya-overview' | 'data-browser' | 'rural-4' | 'walk-in-her-shoes' | 'not-found' | 'compare-segments' | 'segmentations';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Check URL hash for initial page
    const hash = window.location.hash.slice(1);
    if (hash === 'data-browser') return 'data-browser';
    if (hash === 'rural-4') return 'rural-4';
    if (hash === 'walk-in-her-shoes' || hash === 'rural-4/walk-in-her-shoes') return 'walk-in-her-shoes';
    if (hash === 'compare-segments') return 'compare-segments';
    if (hash === 'segmentations') return 'segmentations';
    if (hash === 'not-found') return 'not-found';
    return 'segmentations';
  });

  // Track previous page for "Go back" functionality
  const previousPageRef = useRef<Page>('segmentations');

  useEffect(() => {
    // Update URL hash when page changes
    // Use special path for walk-in-her-shoes
    if (currentPage === 'walk-in-her-shoes') {
      window.location.hash = 'rural-4/walk-in-her-shoes';
    } else {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  useEffect(() => {
    // Listen for hash changes (browser back/forward)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'data-browser') {
        setCurrentPage('data-browser');
      } else if (hash === 'rural-4') {
        setCurrentPage('rural-4');
      } else if (hash === 'walk-in-her-shoes' || hash === 'rural-4/walk-in-her-shoes') {
        setCurrentPage('walk-in-her-shoes');
      } else if (hash === 'compare-segments') {
        setCurrentPage('compare-segments');
      } else if (hash === 'segmentations') {
        setCurrentPage('segmentations');
      } else if (hash === 'not-found') {
        setCurrentPage('not-found');
      } else {
        setCurrentPage('segmentations');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: Page) => {
    // Store current page before navigating (but not if we're on not-found)
    if (currentPage !== 'not-found') {
      previousPageRef.current = currentPage;
    }
    setCurrentPage(page);
    // Scroll to top of page on navigation
    window.scrollTo(0, 0);
  };

  const handleGoBack = () => {
    setCurrentPage(previousPageRef.current);
    window.scrollTo(0, 0);
  };

  switch (currentPage) {
    case 'data-browser':
      return <DataBrowserPage onNavigate={handleNavigate} currentPage={currentPage} />;
    case 'rural-4':
      return <SegmentProfilePage onNavigate={handleNavigate} currentPage={currentPage} />;
    case 'walk-in-her-shoes':
      return <WalkInHerShoesPage onNavigate={handleNavigate} currentPage={currentPage} />;
    case 'compare-segments':
      return <CompareSegmentsPage onNavigate={handleNavigate} currentPage={currentPage} onGoBack={handleGoBack} />;
    case 'segmentations':
      return <SegmentationsPage onNavigate={handleNavigate} currentPage={currentPage} />;
    case 'not-found':
      return <NotFoundPage onNavigate={handleNavigate} currentPage={currentPage} onGoBack={handleGoBack} />;
    case 'kenya-overview':
    default:
      return <SenegalOverviewPage onNavigate={handleNavigate} currentPage={currentPage} />;
  }
}

export default App;
