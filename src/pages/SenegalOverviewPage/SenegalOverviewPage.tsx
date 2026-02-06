import { useEffect, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { PopulationSegments } from '../../components/data-browser/PopulationSegments/PopulationSegments';
import { PopulationSegmentsAlt, type ViewMode } from '../../components/data-browser/PopulationSegmentsAlt/PopulationSegmentsAlt';
import { CoverageMapModal } from '../../components/data-browser/CoverageMapModal';
import CompareIcon from '../../assets/icons/Compare.svg?react';
import DataIcon from '../../assets/icons/Data.svg?react';
import LocationOutlineIcon from '../../assets/icons/Location-Outline.svg?react';
import ArrowRightIcon from '../../assets/icons/Arrow-Right.svg?react';
import './SenegalOverviewPage.css';

interface SenegalOverviewPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function SenegalOverviewPage({ currentPage, onNavigate }: SenegalOverviewPageProps) {
  const [isCoverageMapOpen, setIsCoverageMapOpen] = useState(false);
  const [visualizationVersion, setVisualizationVersion] = useState<1 | 2>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('vulnerability');

  useEffect(() => {
    document.title = 'Pathways | Kenya overview';
  }, []);

  return (
    <div className="senegal-overview-page">
      <PrimaryNavBar />
      <div className="senegal-overview-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="senegal-overview-page__content">
          {/* Page Header */}
          <header className="senegal-overview-page__header">
            <h1 className="senegal-overview-page__title">Kenya segmentation</h1>
            <p className="senegal-overview-page__description">
              These segments show where risks to RMNCH+N outcomes concentrate and how key factors cluster. Explore the segments below or use our tools to compare data across them.
            </p>
          </header>

          {/* Metadata Section */}
          <div className="senegal-overview-page__metadata">
            <div className="senegal-overview-page__metadata-item">
              <span className="senegal-overview-page__metadata-label">Data source</span>
              <span className="senegal-overview-page__metadata-value">DHS 2022</span>
            </div>
            <div className="senegal-overview-page__metadata-item">
              <span className="senegal-overview-page__metadata-label">Sample size</span>
              <span className="senegal-overview-page__metadata-value">37,245</span>
            </div>
            <div className="senegal-overview-page__metadata-item">
              <span className="senegal-overview-page__metadata-label">Created in</span>
              <span className="senegal-overview-page__metadata-value">September 2022</span>
            </div>
            <div className="senegal-overview-page__metadata-item">
              <span className="senegal-overview-page__metadata-label">Sample population</span>
              <span className="senegal-overview-page__metadata-value">Women aged 18-49 with U5 child(ren)</span>
            </div>
            <div className="senegal-overview-page__metadata-item">
              <span className="senegal-overview-page__metadata-label">Geographic coverage</span>
              <span className="senegal-overview-page__metadata-value">43/47 counties</span>
              <button
                className="senegal-overview-page__metadata-link"
                onClick={() => setIsCoverageMapOpen(true)}
              >
                View coverage map
              </button>
            </div>
          </div>

          {/* Segmentation Visualization Section */}
          <div className="senegal-overview-page__visualization-section">
            {/* Sticky Visualization Header */}
            <div className="senegal-overview-page__visualization-header">
              <div className="senegal-overview-page__visualization-title-row">
                <h2 className="senegal-overview-page__visualization-title">
                  Population segments
                </h2>
                <button
                  className="senegal-overview-page__version-toggle"
                  onClick={() => setVisualizationVersion(visualizationVersion === 1 ? 2 : 1)}
                >
                  {visualizationVersion === 1 ? 'Switch to version 2' : 'Switch to version 1'}
                </button>
              </div>
              {visualizationVersion === 2 && (
                <div className="senegal-overview-page__visualization-controls">
                  <span className="senegal-overview-page__view-label">View by</span>
                  <div className="senegal-overview-page__toggle-group">
                    <button
                      className={`senegal-overview-page__toggle-btn ${viewMode === 'vulnerability' ? 'senegal-overview-page__toggle-btn--active' : ''}`}
                      onClick={() => setViewMode('vulnerability')}
                    >
                      Vulnerability level
                    </button>
                    <button
                      className={`senegal-overview-page__toggle-btn ${viewMode === 'urban-rural' ? 'senegal-overview-page__toggle-btn--active' : ''}`}
                      onClick={() => setViewMode('urban-rural')}
                    >
                      Urban / Rural
                    </button>
                    <button
                      className={`senegal-overview-page__toggle-btn ${viewMode === 'segment-size' ? 'senegal-overview-page__toggle-btn--active' : ''}`}
                      onClick={() => setViewMode('segment-size')}
                    >
                      Segment size
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Segmentation Visualization */}
            <div className="senegal-overview-page__visualization">
              {visualizationVersion === 1 && (
                <PopulationSegments
                  onSegmentClick={(segmentId) => {
                    if (segmentId === 'r4') {
                      onNavigate('rural-4');
                    }
                  }}
                />
              )}
              {visualizationVersion === 2 && (
                <PopulationSegmentsAlt
                  viewMode={viewMode}
                  onSegmentClick={(segmentId) => {
                    if (segmentId === 'r4') {
                      onNavigate('rural-4');
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Key Vulnerability Findings Section */}
          <section className="senegal-overview-page__findings">
            <h2 className="senegal-overview-page__findings-title">Key vulnerability findings</h2>
            <div className="senegal-overview-page__findings-list">
              <article className="senegal-overview-page__finding">
                <h3 className="senegal-overview-page__finding-title">
                  Relational autonomy and household decision-making power act as primary differentiators for health service uptake.
                </h3>
                <p className="senegal-overview-page__finding-text">
                  Across segments with similar geographic access, a woman's ability to make independent decisions—particularly regarding her own health and household purchases—strongly correlates with higher rates of modern contraceptive use and skilled birth attendance. This suggests that structural proximity to facilities is insufficient if social and relational constraints at the household level remain unaddressed.
                </p>
              </article>
              <article className="senegal-overview-page__finding">
                <h3 className="senegal-overview-page__finding-title">
                  Conventional urban-rural divides mask deep pockets of vulnerability within peri-urban and informal settlements.
                </h3>
                <p className="senegal-overview-page__finding-text">
                  Several urban segments exhibit health outcomes—such as childhood immunization gaps and home delivery rates—that mirror or exceed the deprivation seen in rural counterparts, challenging the assumption that urban residency inherently confers a health advantage. These findings highlight the role of precarious livelihoods and internal migration in creating "urban islands" of high risk within theoretically well-served regions.
                </p>
              </article>
              <article className="senegal-overview-page__finding">
                <h3 className="senegal-overview-page__finding-title">
                  Regional vulnerability pathways are shaped more by environmental and cultural contexts than by asset ownership alone.
                </h3>
                <p className="senegal-overview-page__finding-text">
                  In Northern and Arid regions, vulnerability is characterized by a compounding of extreme distance, restrictive gender norms, and high mobility, leading to the highest national rates of zero-dose children. Conversely, in Central and Western regions, vulnerability is driven by different factors such as early childbearing and income instability, necessitating a shift from blanket national interventions to region-specific, culturally-grounded strategies.
                </p>
              </article>
            </div>
          </section>

          {/* Dive Deeper Section */}
          <section className="senegal-overview-page__dive-deeper">
            <div className="senegal-overview-page__dive-deeper-header">
              <h2 className="senegal-overview-page__dive-deeper-title">Dive deeper into the data</h2>
              <p className="senegal-overview-page__dive-deeper-subtitle">
                Go beyond the key findings above with interactive tools that let you compare, map and filter segmentation data for your specific needs.
              </p>
            </div>
            <div className="senegal-overview-page__cards">
              <button className="senegal-overview-page__card">
                <div className="senegal-overview-page__card-top">
                  <div className="senegal-overview-page__card-icon">
                    <CompareIcon />
                  </div>
                  <h3 className="senegal-overview-page__card-title">Comparison tool</h3>
                  <p className="senegal-overview-page__card-description">
                    Explore patterns across population segments and health areas to inform your work.
                  </p>
                </div>
                <span className="senegal-overview-page__card-link">
                  <span className="senegal-overview-page__card-link-text">Compare segments</span>
                  <ArrowRightIcon />
                </span>
              </button>
              <button
                className="senegal-overview-page__card"
                onClick={() => onNavigate('data-browser')}
              >
                <div className="senegal-overview-page__card-top">
                  <div className="senegal-overview-page__card-icon">
                    <DataIcon />
                  </div>
                  <h3 className="senegal-overview-page__card-title">Data browser</h3>
                  <p className="senegal-overview-page__card-description">
                    Browse individual data points from this segmentation.
                  </p>
                </div>
                <span className="senegal-overview-page__card-link">
                  <span className="senegal-overview-page__card-link-text">Browse data</span>
                  <ArrowRightIcon />
                </span>
              </button>
              <button className="senegal-overview-page__card">
                <div className="senegal-overview-page__card-top">
                  <div className="senegal-overview-page__card-icon">
                    <LocationOutlineIcon />
                  </div>
                  <h3 className="senegal-overview-page__card-title">Prevalence map</h3>
                  <p className="senegal-overview-page__card-description">
                    Discover how population segments are distributed geographically.
                  </p>
                </div>
                <span className="senegal-overview-page__card-link">
                  <span className="senegal-overview-page__card-link-text">View map</span>
                  <ArrowRightIcon />
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />

      <CoverageMapModal
        isOpen={isCoverageMapOpen}
        onClose={() => setIsCoverageMapOpen(false)}
      />
    </div>
  );
}
