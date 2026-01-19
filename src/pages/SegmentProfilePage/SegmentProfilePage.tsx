import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { SegmentHeader } from '../../components/segment-profile/SegmentHeader/SegmentHeader';
import { DemographicsBox } from '../../components/segment-profile/DemographicsBox/DemographicsBox';
import { AnchorNav } from '../../components/segment-profile/AnchorNav/AnchorNav';
import { KeyDataPoints } from '../../components/segment-profile/KeyDataPoints/KeyDataPoints';
import { PrevalenceMap } from '../../components/segment-profile/PrevalenceMap/PrevalenceMap';
import Rural4Illustration from '../../assets/rural-4 illustration.png';
import './SegmentProfilePage.css';

interface SegmentProfilePageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

// Dummy data for Rural-4 segment
const demographicsData = [
  { label: 'Age (median)', value: 31, range: '21 ~ 41', showInfo: true },
  { label: 'Partner age (median)', value: 34, range: '27 ~ 49', showInfo: true },
  { label: 'Household size (median)', value: 5 },
  { label: 'Birth count (median)', value: 3 },
];

const healthOutcomesData = [
  { label: 'Woman had a health check after last birth', percentage: 73, medianPercentage: 65 },
  { label: 'Latest birth delivered at home', percentage: 65, medianPercentage: 50 },
  { label: 'Zero-dose child', percentage: 21, medianPercentage: 15 },
  { label: 'Death of a child', percentage: 9, medianPercentage: 7 },
  { label: 'No PNC for mother', percentage: 19, medianPercentage: 15 },
];

const vulnerabilityFactorsData = [
  { label: 'At least primary education', percentage: 14, medianPercentage: 45 },
  { label: 'Any media exposure', percentage: 13, medianPercentage: 40 },
  { label: 'Partner FP information', percentage: 21, medianPercentage: 35 },
  {
    label: 'Educational attainment',
    segments: [
      { label: 'No education', percentage: 62, color: 'var(--data-categorical-1)' },
      { label: 'Primary', percentage: 29, color: 'var(--data-categorical-2)' },
      { label: 'Secondary', percentage: 9, color: 'var(--data-categorical-3)' },
    ],
  },
  { label: 'Age at first sex', value: 16, medianValue: 18 },
];

const anchorLinks = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'segment-prevalence', label: 'Segment prevalence' },
  { id: 'key-data-points', label: 'Key data points for this segment' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'intervention-recommendations', label: 'Intervention recommendations' },
  { id: 'all-data-points', label: 'All data points' },
];

export function SegmentProfilePage({ currentPage, onNavigate }: SegmentProfilePageProps) {
  useEffect(() => {
    document.title = 'Pathways | Rural 4 - Most Vulnerable';
  }, []);

  return (
    <div className="segment-profile-page">
      <PrimaryNavBar />
      <div className="segment-profile-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="segment-profile-page__content">
          {/* Header Section with overlapping demographics - full width */}
          <div className="segment-profile-page__header-wrapper">
            <SegmentHeader
              segmentType="Rural"
              segmentNumber="4"
              vulnerabilityLevel="most vulnerable"
              populationPercent="12.2%"
            />
            {/* Demographics - positioned to overlap header */}
            <div className="segment-profile-page__demographics-wrapper">
              <DemographicsBox demographics={demographicsData} />
            </div>
            {/* Illustration - positioned absolutely */}
            <div className="segment-profile-page__illustration">
              <img
                src={Rural4Illustration}
                alt="Rural 4 illustration"
                className="segment-profile-page__illustration-image"
              />
            </div>
          </div>

          <div className="segment-profile-page__content-inner">

          {/* Main Content with Anchor Nav */}
          <div className="segment-profile-page__body">
            <div className="segment-profile-page__main-content">
              {/* Introduction */}
              <section id="introduction" className="segment-profile-page__section">
                <h2 className="segment-profile-page__section-title">Introduction</h2>
                <p className="segment-profile-page__section-text">
                  Women in this segment are most likely to be the most vulnerable of all women in Senegal. This is also the least educated segment in the country, with 88% of women reporting no education at all. Only 38% have a radio in their household. This segment are currently employed - the lowest employment level seen among rural segments.
                </p>
              </section>

              {/* Segment Prevalence */}
              <section id="segment-prevalence" className="segment-profile-page__section">
                <h2 className="segment-profile-page__section-title">Segment prevalence</h2>
                <p className="segment-profile-page__section-subtitle">
                  Shows what percentage of a region's total population belongs to <strong>Rural-4 most vulnerable</strong>
                </p>
                <PrevalenceMap />
                <p className="segment-profile-page__section-note">
                  Looking to explore prevalence with other segments? Visit the{' '}
                  <a href="#" className="segment-profile-page__link">Segmentation prevalence map page</a>
                </p>
              </section>

              {/* Key Data Points */}
              <section id="key-data-points" className="segment-profile-page__section">
                <KeyDataPoints
                  healthOutcomes={healthOutcomesData}
                  vulnerabilityFactors={vulnerabilityFactorsData}
                />
              </section>

              {/* Analysis */}
              <section id="analysis" className="segment-profile-page__section">
                <h2 className="segment-profile-page__section-title">Analysis</h2>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">A path defined by early milestones</h3>
                  <p className="segment-profile-page__section-text">
                    With marriage often occurring around age 16 and limited opportunities for formal schooling, her transition into motherhood started early, shaping her reliance on traditional knowledge rather than modern systems.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Navigating a traditional hierarchy</h3>
                  <p className="segment-profile-page__section-text">
                    In her household, the responsibility for major decisions—from healthcare to purchases—rests primarily with her husband, meaning her access to services depends on his approval and resources.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Managing within limited means</h3>
                  <p className="segment-profile-page__section-text">
                    Without a personal income or home ownership, she operates within a system of financial dependency, where accessing paid health services requires negotiation within the household budget.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Rooted in faith and family</h3>
                  <p className="segment-profile-page__section-text">
                    Her preference for a large family is not a lack of planning, but a reflection of her strong religious and cultural values, which often prioritize high fertility over the spacing recommended by health workers.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Connected locally, not digitally</h3>
                  <p className="segment-profile-page__section-text">
                    While she is connected to the internet, she is not entirely unreachable; radio and her local social circle form her primary window to the wider world.
                  </p>
                </div>
              </section>

              {/* Intervention Recommendations */}
              <section id="intervention-recommendations" className="segment-profile-page__section">
                <h2 className="segment-profile-page__section-title">Intervention recommendations</h2>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Address economic barriers</h3>
                  <p className="segment-profile-page__section-text">
                    High rates of poverty (81.3% no home, 44.9% no work) mean cost and transport are primary barriers. Use mobile clinics and door-to-door campaigns to deliver immunizations and FP methods directly.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Address mental models</h3>
                  <p className="segment-profile-page__section-text">
                    The high vulnerability in Fertility preference (77.7%) and resulting low FP use (86.7%) is a key driver. Integrate FP counseling directly into child health visits, framing birth spacing as a tool for improving the health of existing children.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Address agency & social norms</h3>
                  <p className="segment-profile-page__section-text">
                    The Marital status (97.8%) and Age at first sex (16) data points to women with low agency. Interventions must engage husbands, elders, and community leaders to gain buy-in for immunizations and family planning.
                  </p>
                </div>
              </section>
            </div>

            {/* Anchor Navigation */}
            <div className="segment-profile-page__anchor-nav">
              <AnchorNav links={anchorLinks} />
            </div>
          </div>

          {/* All Data Points - Full Width */}
          <section id="all-data-points" className="segment-profile-page__all-data-section">
            <h2 className="segment-profile-page__section-title">All data points</h2>
            <div className="segment-profile-page__chips">
              <button className="segment-profile-page__chip segment-profile-page__chip--active">All</button>
              <button className="segment-profile-page__chip">Maternal health</button>
              <button className="segment-profile-page__chip">Child health</button>
              <button className="segment-profile-page__chip">Sexual and reproductive health</button>
              <button className="segment-profile-page__chip">Nutrition</button>
              <button className="segment-profile-page__chip">Immunisation</button>
              <button className="segment-profile-page__chip">Menstrual health</button>
            </div>
            <div className="segment-profile-page__data-table-placeholder">
              <span className="segment-profile-page__placeholder-text">Data table placeholder - Full width section</span>
            </div>
          </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
