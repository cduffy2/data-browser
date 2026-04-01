import { useEffect, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { PrevalenceMapSection } from './PrevalenceMapSection';
import './PrevalenceMapPage.css';

type PrevalenceMode = 'vulnerability' | 'segments';

interface PrevalenceMapPageProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function PrevalenceMapPage({ onNavigate, currentPage }: PrevalenceMapPageProps) {
  const [prevalenceMode, setPrevalenceMode] = useState<PrevalenceMode>('vulnerability');

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
            <div className="prevalence-map-page__headline">
              <div className="prevalence-map-page__title-block">
                <h1 className="prevalence-map-page__title">Prevalence map</h1>
                <p className="prevalence-map-page__description">
                  Compare the prevalence of population segments across geographic areas. Select one or more regions on the map below or search for a specific area.
                </p>
              </div>
              <div className="prevalence-map-page__show-prevalence">
                <span className="prevalence-map-page__show-prevalence-label">Show prevalence of:</span>
                <div className="prevalence-map-page__button-group">
                  <button
                    className={`prevalence-map-page__button-group-item${prevalenceMode === 'vulnerability' ? ' prevalence-map-page__button-group-item--active' : ''}`}
                    onClick={() => setPrevalenceMode('vulnerability')}
                  >
                    Vulnerability
                  </button>
                  <button
                    className={`prevalence-map-page__button-group-item${prevalenceMode === 'segments' ? ' prevalence-map-page__button-group-item--active' : ''}`}
                    onClick={() => setPrevalenceMode('segments')}
                  >
                    Segments
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="prevalence-map-page__body">
            <PrevalenceMapSection mode={prevalenceMode} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
