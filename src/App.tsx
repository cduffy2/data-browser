import { useState, useEffect, useRef } from 'react';
import { DataBrowserPage } from './pages/DataBrowserPage/DataBrowserPage';
import { KenyaOverviewPage } from './pages/SenegalOverviewPage/KenyaOverviewPage';
import { SegmentProfilePage } from './pages/SegmentProfilePage/SegmentProfilePage';
import { WalkInHerShoesPage } from './pages/WalkInHerShoesPage/WalkInHerShoesPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { CompareSegmentsPage } from './pages/CompareSegmentsPage/CompareSegmentsPage';
import { SegmentationsPage } from './pages/SegmentationsPage/SegmentationsPage';
import { AssistantPage } from './pages/AssistantPage/AssistantPage';
import { PrevalenceMapPage } from './pages/PrevalenceMapPage/PrevalenceMapPage';
import { ResourcesPage } from './pages/ResourcesPage/ResourcesPage';
import { ResourcesFilteredPage } from './pages/ResourcesFilteredPage/ResourcesFilteredPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage/ArticleDetailPage';
import { ContactPage } from './pages/ContactPage/ContactPage';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import { LoadingPage, PathwaysSpinner } from './pages/LoadingPage/LoadingPage';
import { NewsPage } from './pages/NewsPage/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage/NewsDetailPage';

type Page = 'kenya-overview' | 'data-browser' | 'rural-4' | 'walk-in-her-shoes' | 'not-found' | 'compare-segments' | 'segmentations' | 'assistant' | 'prevalence-map' | 'welcome' | 'news' | 'news-detail' | 'resources' | 'contact' | 'article-detail' | 'resources-filtered' | 'loading';

// Pages that never show the loading spinner (meta/utility pages)
const NO_SPINNER_PAGES: Page[] = ['loading'];

function FullPageSpinner() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F3F3E6',
    }}>
      <PathwaysSpinner size={64} reversed />
    </div>
  );
}

function App() {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const pendingPageRef = useRef<{ page: Page; tag?: string; searchTerm?: string } | null>(null);

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'data-browser') return 'data-browser';
    if (hash === 'rural-4') return 'rural-4';
    if (hash === 'walk-in-her-shoes' || hash === 'rural-4/walk-in-her-shoes') return 'walk-in-her-shoes';
    if (hash === 'compare-segments') return 'compare-segments';
    if (hash === 'segmentations') return 'segmentations';
    if (hash === 'not-found') return 'not-found';
    if (hash === 'assistant') return 'assistant';
    if (hash === 'prevalence-map') return 'prevalence-map';
    if (hash === 'welcome') return 'welcome';
    if (hash === 'news') return 'news';
    if (hash === 'resources') return 'resources';
    if (hash === 'contact') return 'contact';
    if (hash === 'article-detail') return 'article-detail';
    if (hash === 'resources-filtered') return 'resources-filtered';
    if (hash === 'loading') return 'loading';
    if (hash === 'news-detail') return 'news-detail';
    return 'welcome';
  });

  const previousPageRef = useRef<Page>('segmentations');

  useEffect(() => {
    if (currentPage === 'walk-in-her-shoes') {
      window.location.hash = 'rural-4/walk-in-her-shoes';
    } else {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'data-browser') setCurrentPage('data-browser');
      else if (hash === 'rural-4') setCurrentPage('rural-4');
      else if (hash === 'walk-in-her-shoes' || hash === 'rural-4/walk-in-her-shoes') setCurrentPage('walk-in-her-shoes');
      else if (hash === 'compare-segments') setCurrentPage('compare-segments');
      else if (hash === 'segmentations') setCurrentPage('segmentations');
      else if (hash === 'not-found') setCurrentPage('not-found');
      else if (hash === 'kenya-overview') setCurrentPage('kenya-overview');
      else if (hash === 'assistant') setCurrentPage('assistant');
      else if (hash === 'prevalence-map') setCurrentPage('prevalence-map');
      else if (hash === 'welcome') setCurrentPage('welcome');
      else if (hash === 'news') setCurrentPage('news');
      else if (hash === 'resources') setCurrentPage('resources');
      else if (hash === 'contact') setCurrentPage('contact');
      else if (hash === 'article-detail') setCurrentPage('article-detail');
      else if (hash === 'resources-filtered') setCurrentPage('resources-filtered');
      else if (hash === 'loading') setCurrentPage('loading');
      else if (hash === 'news-detail') setCurrentPage('news-detail');
      else setCurrentPage('segmentations');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: Page, tag?: string, term?: string) => {
    if (currentPage !== 'not-found') previousPageRef.current = currentPage;
    setSearchTerm(term ?? '');

    const shouldShowSpinner = !NO_SPINNER_PAGES.includes(page) && Math.random() < 0.3;

    if (shouldShowSpinner) {
      pendingPageRef.current = { page, tag, searchTerm: term };
      setIsLoading(true);
      const duration = 1000 + Math.random() * 1000;
      setTimeout(() => {
        const pending = pendingPageRef.current;
        if (pending) {
          if (pending.tag !== undefined) setSelectedTag(pending.tag);
          if (pending.searchTerm !== undefined) setSearchTerm(pending.searchTerm);
          setCurrentPage(pending.page);
          pendingPageRef.current = null;
        }
        setIsLoading(false);
        window.scrollTo(0, 0);
      }, duration);
    } else {
      if (tag !== undefined) setSelectedTag(tag);
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleGoBack = () => {
    setCurrentPage(previousPageRef.current);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {isLoading && <FullPageSpinner />}
      {!isLoading && (() => {
        switch (currentPage) {
          case 'data-browser':
            return <DataBrowserPage onNavigate={handleNavigate} currentPage={currentPage} searchTerm={searchTerm} />;
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
          case 'assistant':
            return <AssistantPage initialQuery={searchTerm || undefined} />;
          case 'prevalence-map':
            return <PrevalenceMapPage onNavigate={handleNavigate} currentPage={currentPage} />;
          case 'resources':
            return <ResourcesPage onNavigate={handleNavigate} currentPage={currentPage} />;
          case 'resources-filtered':
            return <ResourcesFilteredPage onNavigate={handleNavigate} currentPage={currentPage} selectedTag={selectedTag} />;
          case 'article-detail':
            return <ArticleDetailPage onNavigate={handleNavigate} currentPage={currentPage} onGoBack={handleGoBack} />;
          case 'contact':
            return <ContactPage onNavigate={handleNavigate} currentPage={currentPage} />;
          case 'loading':
            return <LoadingPage />;
          case 'welcome':
            return <WelcomePage onNavigate={handleNavigate} currentPage={currentPage} />;
          case 'news':
            return <NewsPage onNavigate={handleNavigate} currentPage={currentPage} />;
          case 'news-detail':
            return <NewsDetailPage onNavigate={handleNavigate} currentPage={currentPage} onGoBack={handleGoBack} />;
          case 'kenya-overview':
          default:
            return <KenyaOverviewPage onNavigate={handleNavigate} currentPage={currentPage} />;
        }
      })()}
    </>
  );
}

export default App;
