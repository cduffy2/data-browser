import { useEffect, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import './CompareSegmentsPage.css';

interface CompareSegmentsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onGoBack: () => void;
}

export function CompareSegmentsPage({ currentPage, onNavigate, onGoBack }: CompareSegmentsPageProps) {
  const [items, setItems] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Pathways | Compare segments';
    // Get selected items from sessionStorage
    const storedItems = sessionStorage.getItem('compareItems');
    setItems(storedItems);
  }, []);

  return (
    <div className="compare-segments-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="compare-segments-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="compare-segments-page__content">
          <div className="compare-segments-page__message">
            <p className="compare-segments-page__text">Compare segments</p>
            {items && (
              <p className="compare-segments-page__subtext">
                Selected items: {items}
              </p>
            )}
            <button className="compare-segments-page__link" onClick={onGoBack}>
              Go back to last page
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
