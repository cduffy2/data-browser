import { useEffect, useState, useRef } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import ChildHealthIcon from '../../assets/icons/child-health.svg?react';
import ImmunisationIcon from '../../assets/icons/immunisation.svg?react';
import MaternalHealthIcon from '../../assets/icons/maternal-health.svg?react';
import NutritionIcon from '../../assets/icons/nutrition.svg?react';
import FamilyPlanningIcon from '../../assets/icons/family-planning.svg?react';
import ShareViewIcon from '../../assets/icons/share-view.svg?react';
import DownloadIcon from '../../assets/icons/download-dark.svg?react';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import EmptyStateImg from '../../assets/Compare-Empty.png';
import CheckmarkImg from '../../assets/checkmark2x.png';
import Badge1 from '../../assets/icons/1-small.png';
import Badge2 from '../../assets/icons/2-small.png';
import Badge2a from '../../assets/icons/2a-small.png';
import Badge2b from '../../assets/icons/2b-small.png';
import Badge3a from '../../assets/icons/3a-small.png';
import Badge3b from '../../assets/icons/3b-small.png';
import Badge4 from '../../assets/icons/4-small.png';
import { AddDataModal, ALL_DATA } from '../../components/compare-segments/AddDataModal/AddDataModal';
import './CompareSegmentsPage.css';

const SEGMENT_INFO = [
  { id: 'rural-4', label: 'Rural', badge: Badge4, badgeWidth: 24, vulnerability: 'most vulnerable' },
  { id: 'rural-3a', label: 'Rural', badge: Badge3a, badgeWidth: 32, vulnerability: 'more vulnerable' },
  { id: 'rural-3b', label: 'Rural', badge: Badge3b, badgeWidth: 32, vulnerability: 'more vulnerable' },
  { id: 'rural-2', label: 'Rural', badge: Badge2, badgeWidth: 24, vulnerability: 'less vulnerable' },
  { id: 'urban-4', label: 'Urban', badge: Badge4, badgeWidth: 24, vulnerability: 'most vulnerable' },
  { id: 'urban-2a', label: 'Urban', badge: Badge2a, badgeWidth: 32, vulnerability: 'less vulnerable' },
  { id: 'urban-2b', label: 'Urban', badge: Badge2b, badgeWidth: 32, vulnerability: 'less vulnerable' },
  { id: 'urban-1', label: 'Urban', badge: Badge1, badgeWidth: 24, vulnerability: 'least vulnerable' },
];

interface CompareSegmentsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onGoBack: () => void;
}

type HealthArea = 'child-health' | 'immunisation' | 'maternal-health' | 'nutrition' | 'sexual-reproductive';

const healthAreaButtons: { id: HealthArea; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'child-health', label: 'Child health', icon: ChildHealthIcon },
  { id: 'immunisation', label: 'Immunisation', icon: ImmunisationIcon },
  { id: 'maternal-health', label: 'Maternal health', icon: MaternalHealthIcon },
  { id: 'nutrition', label: 'Nutrition', icon: NutritionIcon },
  { id: 'sexual-reproductive', label: 'Sexual and reproductive health', icon: FamilyPlanningIcon },
];

// Data point column types
interface BarDataPoint {
  type: 'bar';
  title: string;
  values: number[]; // R4, R3a, R3b, R2, U4, U2a, U2b, U1
}

interface CategoricalCategory {
  label: string;
  color: string;
}

interface CategoricalDataPoint {
  type: 'categorical';
  title: string;
  categories: CategoricalCategory[];
  values: number[][]; // Per segment: array of category percentages
}

type DataPoint = BarDataPoint | CategoricalDataPoint;

// Definitions for data point tooltips
const dataPointDefinitions: Record<string, string> = {
  'Diarrhea 2 weeks last': 'Percentage of children under 5 who had diarrhea in the two weeks preceding the survey.',
  'Fever 2 weeks last': 'Percentage of children under 5 who had a fever in the two weeks preceding the survey.',
  'Low birth weight': 'Percentage of live births in the last 2 years with a reported birth weight below 2,500 grams.',
  'No PNC for newborn': 'Percentage of last-born children who did not receive postnatal care within 2 days of delivery.',
  'Death of a child before 5 yrs': 'Under-five mortality rate per 1,000 live births in the 5 years preceding the survey.',
  'HH clean cooking fuel': 'Percentage of households using clean fuels (electricity, gas, biogas) for cooking.',
  'HH electricity': 'Percentage of households with access to electricity.',
  'Educational attainment': 'Distribution of women aged 15–49 by highest level of education attained.',
  'Zero-dose child': 'Percentage of children aged 12–23 months who have not received any routine vaccinations.',
  'No routine vaccination': 'Percentage of children aged 12–23 months who did not receive all basic vaccinations.',
  'Not immunized with polio': 'Percentage of children aged 12–23 months who did not receive the polio vaccine.',
  'Not immunized with MMR': 'Percentage of children aged 12–23 months who did not receive measles-containing vaccine.',
  'Vaccination docs': 'Percentage of children aged 12–23 months with a vaccination card or health document seen.',
  'Any media exposure': 'Percentage of women aged 15–49 who are exposed to newspapers, radio, television or internet at least once per week.',
  'HW visit in last yr': 'Percentage of women aged 15–49 who were visited by a community health worker in the past 12 months.',
  'Less than 4 ANC visits': 'Percentage of women who had a live birth in the last 2 years with fewer than 4 antenatal care visits.',
  'No ANC 1st trimester': 'Percentage of women who had a live birth in the last 2 years and did not receive ANC in the first trimester.',
  'Latest birth delivered at home': 'Percentage of last live births in the 2 years preceding the survey that were delivered at home.',
  'Received PNC': 'Percentage of women who received postnatal care within 2 days after their most recent delivery.',
  'Female circumcision': 'Percentage of women aged 15–49 who have undergone female genital cutting.',
  'Not living w/ partner': 'Percentage of women aged 15–49 who are married or in union but not currently living with their partner.',
  'Access problem: travel alone': 'Percentage of women aged 15–49 who reported distance or having to travel as a barrier to accessing healthcare.',
  'Stunted child': 'Percentage of children under 5 whose height-for-age is below minus 2 standard deviations from the median.',
  'Wasted child': 'Percentage of children under 5 whose weight-for-height is below minus 2 standard deviations from the median.',
  'Woman underweight': 'Percentage of women aged 15–49 with a body mass index (BMI) below 18.5.',
  'Not exclusively breastfed': 'Percentage of infants 0–5 months who are not exclusively breastfed.',
  'Not immediately breastfed': 'Percentage of last-born children who were not put to the breast within one hour of birth.',
  'Bank account (woman)': 'Percentage of women aged 15–49 who have a bank account or mobile money account in their own name.',
  'Never tested for HIV': 'Percentage of women aged 15–49 who have never been tested for HIV.',
  'Never used modern FP': 'Percentage of women aged 15–49 in union who have never used a modern family planning method.',
  'No current modern FP use': 'Percentage of women aged 15–49 in union who are not currently using a modern family planning method.',
  'STI last 12 months': 'Percentage of women aged 15–49 who self-reported a sexually transmitted infection in the past 12 months.',
};

// Also add definitions from modal data so custom selections get tooltips
ALL_DATA.forEach(item => {
  if (item.definition && !dataPointDefinitions[item.label]) {
    dataPointDefinitions[item.label] = item.definition;
  }
});

const educationDataPoint: CategoricalDataPoint = {
  type: 'categorical',
  title: 'Educational attainment',
  categories: [
    { label: 'No school', color: 'var(--data-categorical-1)' },
    { label: 'Incomplete primary school/primary', color: 'var(--data-categorical-2)' },
    { label: 'Secondary', color: 'var(--data-categorical-3)' },
    { label: 'Higher education', color: 'var(--data-categorical-4)' },
  ],
  values: [
    [8, 12, 42, 38],   // R4
    [5, 28, 22, 45],   // R3a
    [15, 22, 35, 28],  // R3b
    [25, 6, 10, 59],   // R2
    [28, 5, 16, 51],   // U4
    [40, 10, 3, 47],   // U2a
    [8, 62, 3, 27],    // U2b
    [40, 24, 10, 26],  // U1
  ],
};

// Values order: R4, R3a, R3b, R2, U4, U2a, U2b, U1
const dataPointsByHealthArea: Record<HealthArea, DataPoint[]> = {
  'child-health': [
    { type: 'bar', title: 'Diarrhea 2 weeks last', values: [24, 19, 16, 13, 21, 11, 9, 7] },
    { type: 'bar', title: 'Fever 2 weeks last', values: [31, 26, 22, 17, 28, 14, 11, 8] },
    { type: 'bar', title: 'Low birth weight', values: [19, 16, 13, 9, 15, 8, 6, 4] },
    { type: 'bar', title: 'No PNC for newborn', values: [44, 38, 29, 21, 35, 16, 12, 7] },
    { type: 'bar', title: 'Death of a child before 5 yrs', values: [8, 6, 5, 3, 7, 3, 2, 1] },
    // Vulnerability factors
    { type: 'bar', title: 'HH clean cooking fuel', values: [3, 5, 8, 14, 11, 42, 58, 78] },
    { type: 'bar', title: 'HH electricity', values: [6, 9, 15, 28, 19, 61, 72, 89] },
    educationDataPoint,
  ],
  'immunisation': [
    { type: 'bar', title: 'Zero-dose child', values: [18, 22, 12, 8, 14, 6, 5, 2] },
    { type: 'bar', title: 'No routine vaccination', values: [28, 24, 18, 12, 22, 9, 7, 3] },
    { type: 'bar', title: 'Not immunized with polio', values: [15, 19, 10, 6, 12, 5, 4, 2] },
    { type: 'bar', title: 'Not immunized with MMR', values: [22, 26, 15, 10, 18, 8, 6, 3] },
    { type: 'bar', title: 'Vaccination docs', values: [35, 42, 55, 68, 48, 72, 78, 88] },
    // Vulnerability factors
    { type: 'bar', title: 'Any media exposure', values: [22, 31, 44, 58, 39, 71, 79, 91] },
    { type: 'bar', title: 'HW visit in last yr', values: [18, 24, 32, 45, 28, 52, 61, 74] },
    educationDataPoint,
  ],
  'maternal-health': [
    { type: 'bar', title: 'Less than 4 ANC visits', values: [42, 52, 24, 21, 19, 32, 21, 11] },
    { type: 'bar', title: 'No ANC 1st trimester', values: [55, 48, 33, 29, 25, 18, 15, 9] },
    { type: 'bar', title: 'Latest birth delivered at home', values: [62, 54, 38, 25, 42, 18, 12, 5] },
    { type: 'bar', title: 'Received PNC', values: [28, 35, 48, 62, 38, 68, 75, 88] },
    // Vulnerability factors
    { type: 'bar', title: 'Female circumcision', values: [32, 28, 21, 15, 24, 11, 8, 4] },
    { type: 'bar', title: 'Not living w/ partner', values: [14, 18, 22, 28, 19, 33, 38, 45] },
    { type: 'bar', title: 'Access problem: travel alone', values: [48, 41, 32, 22, 38, 15, 10, 5] },
    educationDataPoint,
  ],
  'nutrition': [
    { type: 'bar', title: 'Stunted child', values: [38, 34, 28, 22, 31, 19, 16, 12] },
    { type: 'bar', title: 'Wasted child', values: [12, 10, 8, 5, 9, 4, 3, 2] },
    { type: 'bar', title: 'Woman underweight', values: [16, 13, 10, 7, 12, 5, 4, 3] },
    { type: 'bar', title: 'Not exclusively breastfed', values: [58, 52, 45, 38, 50, 34, 28, 22] },
    { type: 'bar', title: 'Not immediately breastfed', values: [45, 39, 32, 24, 38, 21, 16, 11] },
    // Vulnerability factors
    { type: 'bar', title: 'Bank account (woman)', values: [8, 12, 18, 31, 22, 54, 63, 81] },
    { type: 'bar', title: 'HH clean cooking fuel', values: [3, 5, 8, 14, 11, 42, 58, 78] },
    educationDataPoint,
  ],
  'sexual-reproductive': [
    { type: 'bar', title: 'Never tested for HIV', values: [61, 53, 44, 35, 48, 28, 22, 14] },
    { type: 'bar', title: 'Never used modern FP', values: [42, 36, 28, 19, 34, 15, 11, 6] },
    { type: 'bar', title: 'No current modern FP use', values: [38, 33, 26, 18, 31, 14, 10, 5] },
    { type: 'bar', title: 'STI last 12 months', values: [9, 7, 6, 4, 8, 4, 3, 2] },
    // Vulnerability factors
    { type: 'bar', title: 'Female circumcision', values: [32, 28, 21, 15, 24, 11, 8, 4] },
    { type: 'bar', title: 'Not living w/ partner', values: [14, 18, 22, 28, 19, 33, 38, 45] },
    { type: 'bar', title: 'Any media exposure', values: [22, 31, 44, 58, 39, 71, 79, 91] },
    educationDataPoint,
  ],
};

// Generate a plausible standard error for a given data point value and index
function getStandardError(value: number, index: number): string {
  const bases = [1.2, 0.8, 1.5, 0.6, 1.1, 0.9, 1.4, 0.7];
  const factor = 1 + Math.sin((value / 100) * Math.PI) * 0.4;
  const se = +(bases[index % bases.length] * factor).toFixed(1);
  return `±${se}`;
}

// Generate plausible per-segment values from a string ID (deterministic)
function generateValuesFromId(id: string): number[] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  // Use the hash to seed 8 values with a gradient pattern (higher vulnerability in rural)
  const base = Math.abs(hash % 40) + 10; // 10-50 base
  return [
    Math.min(99, Math.max(1, base + Math.abs((hash >> 1) % 15))),
    Math.min(99, Math.max(1, base + Math.abs((hash >> 3) % 12))),
    Math.min(99, Math.max(1, base + Math.abs((hash >> 5) % 8))),
    Math.min(99, Math.max(1, base - Math.abs((hash >> 7) % 10))),
    Math.min(99, Math.max(1, base + Math.abs((hash >> 9) % 10))),
    Math.min(99, Math.max(1, base - Math.abs((hash >> 11) % 15))),
    Math.min(99, Math.max(1, base - Math.abs((hash >> 13) % 18))),
    Math.min(99, Math.max(1, base - Math.abs((hash >> 15) % 22))),
  ];
}

// Convert modal item IDs to DataPoint objects for the compare grid
function modalIdsToDataPoints(ids: string[]): DataPoint[] {
  return ids.map(id => {
    const item = ALL_DATA.find(d => d.id === id);
    if (!item) return null;
    // Check if this label matches an existing data point in any health area
    for (const area of Object.values(dataPointsByHealthArea)) {
      const existing = area.find(dp => dp.title === item.label);
      if (existing) return existing;
    }
    // Generate values for items not already in the health area data
    return {
      type: 'bar' as const,
      title: item.label,
      values: generateValuesFromId(id),
    };
  }).filter((dp): dp is DataPoint => dp !== null);
}

// Build a reverse map: data point title → modal item id
const titleToModalId: Record<string, string> = {};
ALL_DATA.forEach(item => {
  titleToModalId[item.label] = item.id;
});

// Get modal IDs for a health area's data points
function getHealthAreaModalIds(healthArea: HealthArea): string[] {
  const dataPoints = dataPointsByHealthArea[healthArea];
  const ids: string[] = [];
  for (const dp of dataPoints) {
    const modalId = titleToModalId[dp.title];
    if (modalId) ids.push(modalId);
  }
  return ids;
}

export function CompareSegmentsPage({ currentPage, onNavigate }: CompareSegmentsPageProps) {
  const [activeHealthArea, setActiveHealthArea] = useState<HealthArea | null>(null);
  const [showStandardError, setShowStandardError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);
  const [customSelectedIds, setCustomSelectedIds] = useState<string[]>([]);
  const [customDataPoints, setCustomDataPoints] = useState<DataPoint[]>([]);
  const [pendingHealthArea, setPendingHealthArea] = useState<HealthArea | null>(null);
  const [showSwitchWarning, setShowSwitchWarning] = useState(false);
  const [isHideShowOpen, setIsHideShowOpen] = useState(false);
  const [visibleSegments, setVisibleSegments] = useState<Set<number>>(new Set(SEGMENT_INFO.map((_, i) => i)));
  const [pendingVisibleSegments, setPendingVisibleSegments] = useState<Set<number>>(new Set(SEGMENT_INFO.map((_, i) => i)));

  useEffect(() => {
    document.title = 'Pathways | Compare segments';
  }, []);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftFade(scrollLeft > 0);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScroll();
    const handleScroll = () => checkScroll();
    const handleResize = () => checkScroll();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleModalConfirm = (ids: string[]) => {
    setCustomSelectedIds(ids);
    setCustomDataPoints(modalIdsToDataPoints(ids));
    // Always clear health area when user confirms from modal — it's now a custom view
    setActiveHealthArea(null);
  };

  // Compute what IDs the modal should start with
  const getModalInitialSelected = (): string[] => {
    // If there's already custom data, use those IDs
    if (customSelectedIds.length > 0) return customSelectedIds;
    // If a health area is active, pre-select its data points in the modal
    if (activeHealthArea) return getHealthAreaModalIds(activeHealthArea);
    return [];
  };

  // Whether the user has a custom (non-health-area) selection active
  const hasCustomSelection = customSelectedIds.length > 0;

  // Handle health area button click — may need to show warning
  const handleHealthAreaClick = (healthArea: HealthArea) => {
    if (hasCustomSelection) {
      setPendingHealthArea(healthArea);
      setShowSwitchWarning(true);
    } else {
      setActiveHealthArea(healthArea);
      setCustomDataPoints([]);
      setCustomSelectedIds([]);
    }
  };

  const handleSwitchAnyway = () => {
    if (pendingHealthArea) {
      setActiveHealthArea(pendingHealthArea);
      setCustomDataPoints([]);
      setCustomSelectedIds([]);
    }
    setPendingHealthArea(null);
    setShowSwitchWarning(false);
  };

  const handleKeepSelection = () => {
    setPendingHealthArea(null);
    setShowSwitchWarning(false);
  };

  // Remove a single data point by title
  const handleRemoveDataPoint = (title: string) => {
    if (activeHealthArea) {
      // Transition from health area view to custom view minus this data point
      const allIds = getHealthAreaModalIds(activeHealthArea);
      const removedId = titleToModalId[title];
      const remainingIds = allIds.filter(id => id !== removedId);
      setCustomSelectedIds(remainingIds);
      setCustomDataPoints(modalIdsToDataPoints(remainingIds));
      setActiveHealthArea(null);
    } else {
      // Already in custom view — remove this item
      const removedId = titleToModalId[title];
      const remainingIds = customSelectedIds.filter(id => id !== removedId);
      setCustomSelectedIds(remainingIds);
      setCustomDataPoints(modalIdsToDataPoints(remainingIds));
    }
  };

  // Show custom data if selected, otherwise health area data
  const activeDataPoints = customDataPoints.length > 0
    ? customDataPoints
    : activeHealthArea
      ? dataPointsByHealthArea[activeHealthArea]
      : [];

  const showGrid = activeDataPoints.length > 0;

  return (
    <div className="compare-segments-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="compare-segments-page__main">
        <LeftSidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          onHideShowSegments={() => { setPendingVisibleSegments(new Set(visibleSegments)); setIsHideShowOpen(true); }}
          visibleSegments={visibleSegments}
          onRestoreSegments={() => setVisibleSegments(new Set(SEGMENT_INFO.map((_, i) => i)))}
        />
        <div className="compare-segments-page__content">
          {/* Sticky Header */}
          <div className="compare-segments-page__header">
            <div className="compare-segments-page__title-row">
              <h1 className="compare-segments-page__title">Compare segments</h1>
            </div>
            <div className="compare-segments-page__description-row">
              <p className="compare-segments-page__description">
                Compare health outcomes, behaviours and vulnerabilities across segments. Browse by health area or add and remove data points individually.
              </p>
              <div className="compare-segments-page__actions">
                <button className="compare-segments-page__icon-button" aria-label="Share view">
                  <ShareViewIcon className="compare-segments-page__icon-button-svg" />
                </button>
                <button className="compare-segments-page__icon-button" aria-label="Download">
                  <DownloadIcon className="compare-segments-page__icon-button-svg" />
                </button>
                <button className="compare-segments-page__add-data-button" onClick={() => setIsAddDataModalOpen(true)}>
                  Add / remove data
                  <ArrowForwardIcon className="compare-segments-page__add-data-arrow" />
                </button>
              </div>
            </div>

            <div className="compare-segments-page__filter-row">
              <span className="compare-segments-page__filter-label">Explore by health area</span>
              <span className="compare-segments-page__filter-separator">·</span>
              <span className="compare-segments-page__filter-label compare-segments-page__filter-label--secondary">Standard error</span>
              <button
                className={`compare-segments-page__toggle${showStandardError ? ' compare-segments-page__toggle--active' : ''}`}
                onClick={() => setShowStandardError(prev => !prev)}
                role="switch"
                aria-checked={showStandardError}
                aria-label="Toggle standard error"
              >
                <span className="compare-segments-page__toggle-thumb" />
              </button>
              <span className="compare-segments-page__toggle-label">{showStandardError ? 'on' : 'off'}</span>
            </div>

            <div className="compare-segments-page__filters-wrapper">
              {showLeftFade && <div className="compare-segments-page__fade compare-segments-page__fade--left" />}
              {showRightFade && <div className="compare-segments-page__fade compare-segments-page__fade--right" />}
              <div className="compare-segments-page__filters" ref={scrollContainerRef}>
                {healthAreaButtons.map((button) => {
                  const Icon = button.icon;
                  return (
                    <button
                      key={button.id}
                      className={`compare-segments-page__filter-button${activeHealthArea === button.id ? ' compare-segments-page__filter-button--active' : ''}`}
                      onClick={() => handleHealthAreaClick(button.id)}
                    >
                      <Icon className="compare-segments-page__filter-button-icon" />
                      <span>{button.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Empty State or Data Grid */}
          {!showGrid ? (
            <div className="compare-segments-page__empty-state">
              <div className="compare-segments-page__empty-state-content">
                <img src={EmptyStateImg} alt="" className="compare-segments-page__empty-state-img" />
                <h2 className="compare-segments-page__empty-state-title">Data will show once you choose a health area</h2>
                <p className="compare-segments-page__empty-state-description">
                  If you'd prefer to select data points individually yourself you can <a href="#" className="compare-segments-page__empty-state-link" onClick={(e) => { e.preventDefault(); setIsAddDataModalOpen(true); }}>add data here</a>
                </p>
              </div>
            </div>
          ) : (
            <div className="compare-segments-page__data-grid">
              {activeDataPoints.map((dp) => {
                if (dp.type === 'categorical') {
                  return (
                    <div key={dp.title} className="compare-segments-page__data-column compare-segments-page__data-column--categorical">
                      <div className="compare-segments-page__data-column-title">
                        {dp.title}
                        <button className="compare-segments-page__remove-btn" aria-label={`Remove ${dp.title}`} onClick={() => handleRemoveDataPoint(dp.title)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/></svg>
                        </button>
                        {dataPointDefinitions[dp.title] && (
                          <div className="compare-segments-page__title-tooltip">
                            {dataPointDefinitions[dp.title]}
                          </div>
                        )}
                      </div>
                      <div className="compare-segments-page__data-column-rows">
                        {dp.values.map((segments, index) => {
                          if (!visibleSegments.has(index)) return null;
                          return (
                          <div key={index} className="compare-segments-page__data-cell compare-segments-page__data-cell--categorical">
                            <div className="compare-segments-page__stacked-track">
                              {segments.map((pct, catIndex) => (
                                <div
                                  key={catIndex}
                                  className="compare-segments-page__stacked-segment"
                                  style={{
                                    flex: `${pct} 0 0`,
                                    backgroundColor: dp.categories[catIndex].color,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          );
                        })}
                      </div>
                      <div className="compare-segments-page__legend">
                        {dp.categories.map((cat, i) => (
                          <div key={i} className="compare-segments-page__legend-item">
                            <span
                              className="compare-segments-page__legend-swatch"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="compare-segments-page__legend-label">{cat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                const visibleValues = dp.values.filter((_, i) => visibleSegments.has(i));
                const median = visibleValues.length > 0
                  ? Math.round(visibleValues.reduce((a, b) => a + b, 0) / visibleValues.length)
                  : 0;
                return (
                  <div key={dp.title} className={`compare-segments-page__data-column${showStandardError ? ' compare-segments-page__data-column--se' : ''}`}>
                    <div className="compare-segments-page__data-column-title">
                      {dp.title}
                      <button className="compare-segments-page__remove-btn" aria-label={`Remove ${dp.title}`} onClick={() => handleRemoveDataPoint(dp.title)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/></svg>
                      </button>
                      {dataPointDefinitions[dp.title] && (
                        <div className="compare-segments-page__title-tooltip">
                          {dataPointDefinitions[dp.title]}
                        </div>
                      )}
                    </div>
                    <div className="compare-segments-page__data-column-rows">
                      <div
                        className="compare-segments-page__median-group"
                        style={{ left: `calc(16px + (100% - ${showStandardError ? '108px' : '72px'}) * ${median / 100})` }}
                      >
                        <div className="compare-segments-page__median-highlight" />
                        <div className="compare-segments-page__median-line" />
                        <div className="compare-segments-page__median-tooltip">
                          Sample median: {median}%
                        </div>
                      </div>
                      {dp.values.map((value, index) => {
                        if (!visibleSegments.has(index)) return null;
                        return (
                          <div key={index} className="compare-segments-page__data-cell">
                            <div className="compare-segments-page__bar-track">
                              <div
                                className="compare-segments-page__bar-fill"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <div className="compare-segments-page__bar-values">
                              <span className="compare-segments-page__bar-value">{value}%</span>
                              {showStandardError && (
                                <span className="compare-segments-page__bar-se">{getStandardError(value, index)}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {isAddDataModalOpen && (
        <AddDataModal
          onClose={() => setIsAddDataModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialSelected={getModalInitialSelected()}
        />
      )}
      {showSwitchWarning && pendingHealthArea && (
        <div className="compare-segments-page__warning-overlay" onClick={handleKeepSelection}>
          <div className="compare-segments-page__warning-modal" onClick={e => e.stopPropagation()}>
            <div className="compare-segments-page__warning-top">
              <div className="compare-segments-page__warning-header">
                <h3 className="compare-segments-page__warning-title">
                  Switch to {healthAreaButtons.find(b => b.id === pendingHealthArea)?.label}?
                </h3>
                <button className="compare-segments-page__warning-close" onClick={handleKeepSelection}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <p className="compare-segments-page__warning-text">
                You've have data selected. Switching to {healthAreaButtons.find(b => b.id === pendingHealthArea)?.label} will replace your current selection.
              </p>
            </div>
            <div className="compare-segments-page__warning-actions">
              <button className="compare-segments-page__warning-btn compare-segments-page__warning-btn--outlined" onClick={handleKeepSelection}>
                Keep my selection
              </button>
              <button className="compare-segments-page__warning-btn compare-segments-page__warning-btn--solid" onClick={handleSwitchAnyway}>
                Switch anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {isHideShowOpen && (
        <div className="compare-segments-page__hideshow-overlay" onClick={() => { setIsHideShowOpen(false); setPendingVisibleSegments(new Set(visibleSegments)); }}>
          <div className="compare-segments-page__hideshow-modal" onClick={e => e.stopPropagation()}>
            <div className="compare-segments-page__hideshow-content">
              <div className="compare-segments-page__hideshow-header">
                <h3 className="compare-segments-page__hideshow-title">Hide / show segments</h3>
                <button className="compare-segments-page__hideshow-close" onClick={() => { setIsHideShowOpen(false); setPendingVisibleSegments(new Set(visibleSegments)); }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="compare-segments-page__hideshow-list">
                {SEGMENT_INFO.map((seg, index) => (
                  <div
                    key={seg.id}
                    className="compare-segments-page__hideshow-row"
                    onClick={() => {
                      const next = new Set(pendingVisibleSegments);
                      if (next.has(index)) {
                        next.delete(index);
                      } else {
                        next.add(index);
                      }
                      setPendingVisibleSegments(next);
                    }}
                  >
                    <div className="compare-segments-page__hideshow-checkbox">
                      {pendingVisibleSegments.has(index) && <img src={CheckmarkImg} alt="" className="compare-segments-page__hideshow-checkmark" />}
                    </div>
                    <span className="compare-segments-page__hideshow-label">{seg.label}</span>
                    <img src={seg.badge} alt="" style={{ width: seg.badgeWidth, height: 24 }} />
                    <span className="compare-segments-page__hideshow-vuln">{seg.vulnerability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="compare-segments-page__hideshow-actions">
              <button className="compare-segments-page__hideshow-btn compare-segments-page__hideshow-btn--outlined" onClick={() => { setIsHideShowOpen(false); setPendingVisibleSegments(new Set(visibleSegments)); }}>
                Cancel
              </button>
              <button className="compare-segments-page__hideshow-btn compare-segments-page__hideshow-btn--solid" onClick={() => { setVisibleSegments(new Set(pendingVisibleSegments)); setIsHideShowOpen(false); }}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
