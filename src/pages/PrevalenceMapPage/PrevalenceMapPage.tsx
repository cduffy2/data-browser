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
              <p className="prevalence-map-page__description">Compare the prevalence of vulnerability levels across geographic areas. Select a region on the map or search for a specific area.</p>
            </div>
          </div>
          <div className="prevalence-map-page__body">
            <div className="prevalence-map-page__section prevalence-map-page__section--map">
              <PrevalenceMapSection mode="vulnerability" />
            </div>
            <div className="prevalence-map-page__section prevalence-map-page__section--segments">
              <div className="prevalence-map-page__section-header">
                <h2 className="prevalence-map-page__section-title">Segment breakdown by region</h2>
                <p className="prevalence-map-page__section-description">Select regions to see how population segments are distributed across urban and rural areas.</p>
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
