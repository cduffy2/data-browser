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
import { DomainDetailPage } from './pages/DomainDetailPage/DomainDetailPage';
import { MethodologyExplainerPage } from './pages/MethodologyExplainerPage/MethodologyExplainerPage';
import { HowPathwaysDataPage } from './pages/HowPathwaysDataPage/HowPathwaysDataPage';
import { GuideArticlePage } from './pages/GuideArticlePage/GuideArticlePage';

type Page = 'kenya-overview' | 'data-browser' | 'rural-4' | 'walk-in-her-shoes' | 'not-found' | 'compare-segments' | 'segmentations' | 'assistant' | 'prevalence-map' | 'welcome' | 'news' | 'news-detail' | 'resources' | 'contact' | 'article-detail' | 'resources-filtered' | 'loading' | 'domain-detail' | 'methodology-explainer' | 'how-pathways-data' | 'guide-article';

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
  const [domainId, setDomainId] = useState<string>('');
  const [initialCategoryId, setInitialCategoryId] = useState<string>('');
  const [noSidebar, setNoSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pendingPageRef = useRef<{ page: Page; tag?: string; searchTerm?: string; domainId?: string; categoryId?: string } | null>(null);

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
    if (hash === 'domain-detail') return 'domain-detail';
    if (hash === 'methodology-explainer' || hash === 'understanding-pathways-data') return 'methodology-explainer';
    if (hash === 'how-pathways-data') return 'how-pathways-data';
    if (hash === 'guide-article') return 'guide-article';
    return 'welcome';
  });

  const previousPageRef = useRef<Page>('segmentations');
  const mepScrollYRef = useRef<number>(0);
  const restoreMepScrollRef = useRef(false);

  useEffect(() => {
    if (currentPage === 'walk-in-her-shoes') {
      window.location.hash = 'rural-4/walk-in-her-shoes';
    } else if (currentPage === 'methodology-explainer') {
      window.location.hash = 'understanding-pathways-data';
    } else {
      window.location.hash = currentPage;
    }
    if (currentPage === 'methodology-explainer' && restoreMepScrollRef.current) {
      restoreMepScrollRef.current = false;
      // Use setTimeout to ensure the page has fully rendered before scrolling
      setTimeout(() => window.scrollTo(0, mepScrollYRef.current), 0);
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
      else if (hash === 'domain-detail') { mepScrollYRef.current = window.scrollY; setCurrentPage('domain-detail'); }
      else if (hash === 'methodology-explainer' || hash === 'understanding-pathways-data') {
        restoreMepScrollRef.current = true;
        setCurrentPage('methodology-explainer');
      }
      else if (hash === 'how-pathways-data') setCurrentPage('how-pathways-data');
      else if (hash === 'guide-article') setCurrentPage('guide-article');
      else setCurrentPage('segmentations');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: Page, tag?: string, term?: string, dId?: string, catId?: string) => {
    if (currentPage !== 'not-found') previousPageRef.current = currentPage;
    setSearchTerm(term ?? '');
    setNoSidebar(currentPage === 'methodology-explainer' && page === 'domain-detail');
    if (currentPage === 'methodology-explainer' && page === 'domain-detail') {
      mepScrollYRef.current = window.scrollY;
    }

    const shouldShowSpinner = !NO_SPINNER_PAGES.includes(page) && Math.random() < 0.3;

    if (shouldShowSpinner) {
      pendingPageRef.current = { page, tag, searchTerm: term, domainId: dId, categoryId: catId };
      setIsLoading(true);
      const duration = 1000 + Math.random() * 1000;
      setTimeout(() => {
        const pending = pendingPageRef.current;
        if (pending) {
          if (pending.tag !== undefined) setSelectedTag(pending.tag);
          if (pending.searchTerm !== undefined) setSearchTerm(pending.searchTerm);
          if (pending.domainId !== undefined) setDomainId(pending.domainId);
          if (pending.categoryId !== undefined) setInitialCategoryId(pending.categoryId);
          setCurrentPage(pending.page);
          pendingPageRef.current = null;
        }
        setIsLoading(false);
        if (pending?.page === 'methodology-explainer' && previousPageRef.current === 'domain-detail') {
          restoreMepScrollRef.current = true;
        }
        window.scrollTo(0, 0);
      }, duration);
    } else {
      if (tag !== undefined) setSelectedTag(tag);
      if (dId !== undefined) setDomainId(dId);
      if (catId !== undefined) setInitialCategoryId(catId);
      if (page === 'methodology-explainer' && previousPageRef.current === 'domain-detail') {
        restoreMepScrollRef.current = true;
      } else {
        window.scrollTo(0, 0);
      }
      setCurrentPage(page);
    }
  };

  const handleGoBack = () => {
    const target = previousPageRef.current;
    if (target === 'methodology-explainer') restoreMepScrollRef.current = true;
    setCurrentPage(target);
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
          case 'domain-detail':
            return <DomainDetailPage onNavigate={handleNavigate} currentPage={currentPage} domainId={domainId} initialCategoryId={initialCategoryId} noSidebar={noSidebar} />;
          case 'methodology-explainer':
            return <MethodologyExplainerPage onNavigate={handleNavigate} currentPage={currentPage} onGoBack={handleGoBack} />;
          case 'how-pathways-data':
            return <HowPathwaysDataPage onNavigate={handleNavigate} currentPage={currentPage} />;
          case 'guide-article':
            return <GuideArticlePage onNavigate={handleNavigate} currentPage={currentPage} />;
          case 'kenya-overview':
          default:
            return <KenyaOverviewPage onNavigate={handleNavigate} currentPage={currentPage} />;
        }
      })()}
    </>
  );
}

export default App;
