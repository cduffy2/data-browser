import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import './NotFoundPage.css';

interface NotFoundPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onGoBack: () => void;
}

export function NotFoundPage({ currentPage, onNavigate, onGoBack }: NotFoundPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Page not available';
  }, []);

  return (
    <div className="not-found-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="not-found-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="not-found-page__content">
          <div className="not-found-page__message">
            <p className="not-found-page__text">This page is not part of this prototype</p>
            <button className="not-found-page__link" onClick={onGoBack}>
              Go back to last page
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
