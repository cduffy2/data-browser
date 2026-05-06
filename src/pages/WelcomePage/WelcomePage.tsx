import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import './WelcomePage.css';

interface WelcomePageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
}

export function WelcomePage({ currentPage, onNavigate }: WelcomePageProps) {
  useEffect(() => {
    document.title = 'Pathways | Welcome';
  }, []);

  return (
    <div className="welcome-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="welcome-page__main">
        {/* Sections will be added here */}
      </main>
      <Footer />
    </div>
  );
}
