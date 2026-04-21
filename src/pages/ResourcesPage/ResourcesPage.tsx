import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import './ResourcesPage.css';

interface ResourcesPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function ResourcesPage({ currentPage, onNavigate }: ResourcesPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Resources';
  }, []);

  return (
    <div className="resources-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="resources-page__body" />
      <Footer />
    </div>
  );
}
