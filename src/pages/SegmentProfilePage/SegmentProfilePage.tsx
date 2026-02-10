import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { SegmentHeader } from '../../components/segment-profile/SegmentHeader/SegmentHeader';
import { DemographicsBox } from '../../components/segment-profile/DemographicsBox/DemographicsBox';
import { AnchorNav } from '../../components/segment-profile/AnchorNav/AnchorNav';
import { KeyDataPoints } from '../../components/segment-profile/KeyDataPoints/KeyDataPoints';
import { PrevalenceMap } from '../../components/segment-profile/PrevalenceMap/PrevalenceMap';
import { WalkInHerShoes } from '../../components/segment-profile/WalkInHerShoes/WalkInHerShoes';
import { AllDataPoints } from '../../components/segment-profile/AllDataPoints/AllDataPoints';
import Rural4Illustration from '../../assets/rural-4 illustration.png';
import './SegmentProfilePage.css';

interface SegmentProfilePageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

// Dummy data for Rural-4 segment
const demographicsData = [
  { label: 'Age (median)', value: 28, range: '19 ~ 38', showInfo: true },
  { label: 'Partner age (median)', value: 38, range: '28 ~ 52', showInfo: true },
  { label: 'Household size (median)', value: 7 },
  { label: 'Birth count (median)', value: 6 },
];

const healthOutcomesData = [
  { label: 'Woman had a health check after last birth', percentage: 23, medianPercentage: 65 },
  { label: 'Latest birth delivered at home', percentage: 82, medianPercentage: 50 },
  { label: 'Zero-dose child', percentage: 34, medianPercentage: 15 },
  { label: 'Death of a child', percentage: 14, medianPercentage: 7 },
  { label: 'No PNC for mother', percentage: 71, medianPercentage: 15 },
];

const vulnerabilityFactorsData = [
  { label: 'At least primary education', percentage: 8, medianPercentage: 45 },
  { label: 'Any media exposure', percentage: 6, medianPercentage: 40 },
  { label: 'Partner FP information', percentage: 11, medianPercentage: 35 },
  {
    label: 'Educational attainment',
    segments: [
      { label: 'No education', percentage: 87, color: 'var(--data-categorical-1)' },
      { label: 'Primary', percentage: 10, color: 'var(--data-categorical-2)' },
      { label: 'Secondary', percentage: 3, color: 'var(--data-categorical-3)' },
    ],
  },
  { label: 'Age at first sex', value: 15, medianValue: 18 },
];

const anchorLinks = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'segment-prevalence', label: 'Segment prevalence' },
  { id: 'walk-in-her-shoes', label: 'Walk in her shoes' },
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
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
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
                  <span className="segment-profile-page__note-text">Looking to explore prevalence with other segments? Visit the{' '}</span>
                  <a href="#not-found" onClick={(e) => { e.preventDefault(); onNavigate('not-found'); }} className="segment-profile-page__link segment-profile-page__link--semibold">prevalence map</a>
                </p>
              </section>

              {/* Walk in Her Shoes */}
              <section id="walk-in-her-shoes" className="segment-profile-page__section">
                <WalkInHerShoes onReadStory={() => onNavigate('walk-in-her-shoes')} />
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
                  <h3 className="segment-profile-page__analysis-subtitle">Extreme geographic isolation defines the health journey.</h3>
                  <p className="segment-profile-page__section-text">
                    This segment faces the longest travel times to facilities, which aligns with their position as having the lowest national rates of 4+ ANC visits and skilled delivery.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Cultural norms and language represent significant systemic barriers.</h3>
                  <p className="segment-profile-page__section-text">
                    Concentrated in Garissa and Wajir, this group has the lowest exposure to mass media, suggesting that standard national health campaigns in Swahili or English likely miss this population.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">High parity and early marriage compound the caregiving burden.</h3>
                  <p className="segment-profile-page__section-text">
                    Women in R4 typically start childbearing in their teens and have the highest average number of children, leaving them with limited time and resources to seek preventative care.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Health mental models are shaped by traditional practices over clinical ones.</h3>
                  <p className="segment-profile-page__section-text">
                    With very low trust in formal health systems and high reliance on traditional birth attendants, clinical engagement is often reserved for emergencies rather than prevention.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Economic vulnerability is tied to pastoralist and nomadic lifestyles.</h3>
                  <p className="segment-profile-page__section-text">
                    Income is highly seasonal and unpredictable, making even "free" maternal services expensive due to the opportunity costs of travel and childcare.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Mobile phone ownership is a rare but emerging enabler.</h3>
                  <p className="segment-profile-page__section-text">
                    While formal media exposure is low, basic mobile phone ownership is present, offering a potential—though currently underutilized—channel for community-based health surveillance.
                  </p>
                </div>
              </section>

              {/* Intervention Recommendations */}
              <section id="intervention-recommendations" className="segment-profile-page__section">
                <h2 className="segment-profile-page__section-title">Intervention recommendations</h2>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Deploy mobile, language-specific health "caravans" and pastoralist-aligned clinics.</h3>
                  <p className="segment-profile-page__section-text">
                    Given the extreme distances and nomadic patterns, services must move with the population and be delivered by providers fluent in local dialects.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Integrate health services with livestock and water points.</h3>
                  <p className="segment-profile-page__section-text">
                    Leveraging the few locations where families must gather allows for opportunistic immunization and ANC screening without requiring dedicated, long-distance travel.
                  </p>
                </div>

                <div className="segment-profile-page__analysis-block">
                  <h3 className="segment-profile-page__analysis-subtitle">Empower and formalize the role of Traditional Birth Attendants (TBAs) as referral links.</h3>
                  <p className="segment-profile-page__section-text">
                    Since TBAs are the primary care providers, programs should focus on training them to recognize danger signs and providing them with incentives to accompany women to facilities.
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
            <AllDataPoints onNavigate={onNavigate} />
          </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
