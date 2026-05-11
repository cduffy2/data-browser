import { useEffect, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { PrevalenceMapSection } from './PrevalenceMapSection';
import { ShareViewModal } from './ShareViewModal';
import shareViewIcon from '../../assets/icons/share-view.svg';
import './PrevalenceMapPage.css';

interface PrevalenceMapPageProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function PrevalenceMapPage({ onNavigate, currentPage }: PrevalenceMapPageProps) {
  const [shareOpen, setShareOpen] = useState(false);

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
                <button className="prevalence-map-page__share-btn" onClick={() => setShareOpen(true)}>
                  Share this view
                  <img src={shareViewIcon} alt="" width="20" height="20" />
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
      <ShareViewModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
