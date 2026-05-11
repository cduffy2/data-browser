import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { PrevalenceMapSection } from './PrevalenceMapSection';
import './PrevalenceMapPage.css';

interface PrevalenceMapPageProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function PrevalenceMapPage({ onNavigate, currentPage }: PrevalenceMapPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Prevalence map';
  }, []);

  return (
    <div className="prevalence-map-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="prevalence-map-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="prevalence-map-page__content">
          <div className="prevalence-map-page__header">
            <div className="prevalence-map-page__title-block">
              <h1 className="prevalence-map-page__title">Prevalence map</h1>
              <div className="prevalence-map-page__title-row">
                <p className="prevalence-map-page__description">See where vulnerability is most concentrated and how it breaks down by segment and region.</p>
                <button className="prevalence-map-page__share-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share this view
                </button>
              </div>
            </div>
          </div>
          <div className="prevalence-map-page__body">
            <div className="prevalence-map-page__section prevalence-map-page__section--map">
              <PrevalenceMapSection mode="vulnerability" />
            </div>
            <div className="prevalence-map-page__section prevalence-map-page__section--segments">
              <div className="prevalence-map-page__section-header">
                <h2 className="prevalence-map-page__section-title">Segment breakdown by geographic area</h2>
                <p className="prevalence-map-page__section-description">Select geographic areas to compare how population segments are distributed.</p>
              </div>
              <PrevalenceMapSection mode="segments" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
