import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { PopulationSegments } from '../../components/data-browser/PopulationSegments/PopulationSegments';
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
  useEffect(() => {
    document.title = 'Pathways | Senegal overview';
  }, []);

  return (
    <div className="senegal-overview-page">
      <PrimaryNavBar />
      <div className="senegal-overview-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="senegal-overview-page__content">
          {/* Page Header */}
          <header className="senegal-overview-page__header">
            <h1 className="senegal-overview-page__title">Senegal segmentation</h1>
            <p className="senegal-overview-page__description">
              These segments show where risks to RMNCH+N outcomes concentrate and how key factors cluster. Explore the segments below or use our tools to compare data across them.
            </p>
          </header>

          {/* Metadata Section */}
          <div className="senegal-overview-page__metadata">
            <div className="senegal-overview-page__metadata-item">
              <span className="senegal-overview-page__metadata-label">Data source</span>
              <span className="senegal-overview-page__metadata-value">DHS 2022</span>
              <a href="#" className="senegal-overview-page__metadata-link">Download underlying data</a>
            </div>
            <div className="senegal-overview-page__metadata-item">
              <span className="senegal-overview-page__metadata-label">Sample size</span>
              <span className="senegal-overview-page__metadata-value">7,245</span>
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
              <span className="senegal-overview-page__metadata-value">12/14 regions</span>
              <a href="#" className="senegal-overview-page__metadata-link">View coverage map</a>
            </div>
          </div>

          {/* Segmentation Visualization */}
          <div className="senegal-overview-page__visualization">
            <PopulationSegments
              onSegmentClick={(segmentId) => {
                if (segmentId === 'r4') {
                  onNavigate('rural-4');
                }
              }}
            />
          </div>

          {/* Key Vulnerability Findings Section */}
          <section className="senegal-overview-page__findings">
            <h2 className="senegal-overview-page__findings-title">Key vulnerability findings</h2>
            <div className="senegal-overview-page__findings-list">
              <article className="senegal-overview-page__finding">
                <h3 className="senegal-overview-page__finding-title">
                  Rural populations face highest vulnerability
                </h3>
                <p className="senegal-overview-page__finding-text">
                  Rural women face disproportionate vulnerability, with over 60% of the rural population falling into "more vulnerable" or "most vulnerable" categories. In contrast, over 80% of urban women belong to "less vulnerable" or "least vulnerable" segments. Only one rural segment (<span className="senegal-overview-page__segment-ref">R2</span>) achieves "less vulnerable" status, highlighting the stark urban-rural divide in health outcomes and opportunities.
                </p>
              </article>
              <article className="senegal-overview-page__finding">
                <h3 className="senegal-overview-page__finding-title">
                  Economic distress is the primary driver of vulnerability
                </h3>
                <p className="senegal-overview-page__finding-text">
                  The most vulnerable segments (<span className="senegal-overview-page__segment-ref">R4</span> at 12% and <span className="senegal-overview-page__segment-ref">U3.1</span> at 6%) are defined by extreme poverty, with nearly all women in these segments belonging to the lowest wealth quintiles. Economic stability appears to be the strongest protective factor, as evidenced by the least vulnerable segment (<span className="senegal-overview-page__segment-ref">U1</span>) having the highest concentration of middle and upper wealth quintile households.
                </p>
              </article>
              <article className="senegal-overview-page__finding">
                <h3 className="senegal-overview-page__finding-title">
                  Education and progressive beliefs don't guarantee agency
                </h3>
                <p className="senegal-overview-page__finding-text">
                  A striking paradox emerges where education and progressive gender beliefs don't automatically translate into higher agency or better outcomes. Segment <span className="senegal-overview-page__segment-ref">U2.1</span> (13% of population) demonstrates this disconnect - despite high education levels and progressive beliefs, women exhibit very low decision-making power. Conversely, segment <span className="senegal-overview-page__segment-ref">U2.2</span> shows women with minimal education but very high agency.
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
    </div>
  );
}
