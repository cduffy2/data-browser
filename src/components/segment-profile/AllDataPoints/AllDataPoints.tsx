import { useState, useMemo, useRef, useEffect } from 'react';
import ChildHealthIcon from '../../../assets/icons/child-health.svg?react';
import ImmunisationIcon from '../../../assets/icons/immunisation.svg?react';
import MaternalHealthIcon from '../../../assets/icons/maternal-health.svg?react';
import NutritionIcon from '../../../assets/icons/nutrition.svg?react';
import FamilyPlanningIcon from '../../../assets/icons/family-planning.svg?react';
import './AllDataPoints.css';

type HealthArea = 'all' | 'maternal-health' | 'child-health' | 'sexual-reproductive' | 'nutrition' | 'immunisation';

interface DataPointItem {
  id: string;
  label: string;
  percentage?: number;
  medianPercentage?: number;
  value?: string | number;
  medianValue?: number;
  healthAreas: HealthArea[];
  type: 'health-outcome' | 'vulnerability';
}

interface AllDataPointsProps {
  healthOutcomes?: DataPointItem[];
  vulnerabilityFactors?: DataPointItem[];
}

const healthAreaLabels: Record<HealthArea, string> = {
  'all': 'All',
  'maternal-health': 'Maternal health',
  'child-health': 'Child health',
  'sexual-reproductive': 'Sexual and reproductive health',
  'nutrition': 'Nutrition',
  'immunisation': 'Immunisation',
};

const healthAreaTitles: Record<HealthArea, string> = {
  'all': 'All data points',
  'maternal-health': 'Maternal health data points',
  'child-health': 'Child health data points',
  'sexual-reproductive': 'Sexual and reproductive health data points',
  'nutrition': 'Nutrition data points',
  'immunisation': 'Immunisation data points',
};

// Health outcomes data by category
const mockHealthOutcomes: DataPointItem[] = [
  // Child health
  { id: 'ho-ch-1', label: 'Any child no fever/cough care', percentage: 34, medianPercentage: 28, healthAreas: ['child-health'], type: 'health-outcome' },
  { id: 'ho-ch-2', label: 'Cough 2 weeks last', percentage: 18, medianPercentage: 15, healthAreas: ['child-health'], type: 'health-outcome' },
  { id: 'ho-ch-3', label: 'Death of a child before 1 yr', percentage: 5, medianPercentage: 4, healthAreas: ['child-health'], type: 'health-outcome' },
  { id: 'ho-ch-4', label: 'Death of a child before 5 yrs', percentage: 9, medianPercentage: 7, healthAreas: ['child-health'], type: 'health-outcome' },
  { id: 'ho-ch-5', label: 'Diarrhea 2 weeks last', percentage: 22, medianPercentage: 18, healthAreas: ['child-health'], type: 'health-outcome' },
  { id: 'ho-ch-6', label: 'Fever 2 weeks last', percentage: 25, medianPercentage: 20, healthAreas: ['child-health'], type: 'health-outcome' },
  { id: 'ho-ch-7', label: 'Low birth weight last', percentage: 12, medianPercentage: 10, healthAreas: ['child-health'], type: 'health-outcome' },
  { id: 'ho-ch-8', label: 'No PNC for newborn', percentage: 19, medianPercentage: 15, healthAreas: ['child-health'], type: 'health-outcome' },

  // Immunisation
  { id: 'ho-im-1', label: 'Child not immunised - polio', percentage: 8, medianPercentage: 5, healthAreas: ['immunisation'], type: 'health-outcome' },
  { id: 'ho-im-2', label: 'No routine vaccination', percentage: 15, medianPercentage: 10, healthAreas: ['immunisation'], type: 'health-outcome' },
  { id: 'ho-im-3', label: 'Number not immunised - MMR', percentage: 12, medianPercentage: 8, healthAreas: ['immunisation'], type: 'health-outcome' },
  { id: 'ho-im-4', label: 'Vaccination documentation', percentage: 62, medianPercentage: 70, healthAreas: ['immunisation'], type: 'health-outcome' },
  { id: 'ho-im-5', label: 'Zero-dose child', percentage: 21, medianPercentage: 15, healthAreas: ['immunisation'], type: 'health-outcome' },

  // Maternal health
  { id: 'ho-mh-1', label: 'Latest birth delivered at home', percentage: 65, medianPercentage: 50, healthAreas: ['maternal-health'], type: 'health-outcome' },
  { id: 'ho-mh-2', label: 'Less than 4 ANC visits last', percentage: 38, medianPercentage: 30, healthAreas: ['maternal-health'], type: 'health-outcome' },
  { id: 'ho-mh-3', label: 'No ANC 1st trimester last', percentage: 42, medianPercentage: 35, healthAreas: ['maternal-health'], type: 'health-outcome' },
  { id: 'ho-mh-4', label: 'Received PNC', percentage: 73, medianPercentage: 65, healthAreas: ['maternal-health'], type: 'health-outcome' },

  // Nutrition
  { id: 'ho-nu-1', label: 'Any child not immediately breastfed', percentage: 28, medianPercentage: 22, healthAreas: ['nutrition'], type: 'health-outcome' },
  { id: 'ho-nu-2', label: 'Child not exclusively breastfed', percentage: 45, medianPercentage: 38, healthAreas: ['nutrition'], type: 'health-outcome' },
  { id: 'ho-nu-3', label: 'Stunted child', percentage: 24, medianPercentage: 19, healthAreas: ['nutrition'], type: 'health-outcome' },
  { id: 'ho-nu-4', label: 'Wasted child', percentage: 8, medianPercentage: 6, healthAreas: ['nutrition'], type: 'health-outcome' },
  { id: 'ho-nu-5', label: 'Woman is underweight', percentage: 15, medianPercentage: 12, healthAreas: ['nutrition'], type: 'health-outcome' },

  // Sexual and reproductive health
  { id: 'ho-sr-1', label: 'Never tested for HIV', percentage: 58, medianPercentage: 45, healthAreas: ['sexual-reproductive'], type: 'health-outcome' },
  { id: 'ho-sr-2', label: 'Never used modern FP method', percentage: 72, medianPercentage: 55, healthAreas: ['sexual-reproductive'], type: 'health-outcome' },
  { id: 'ho-sr-3', label: 'Non-use of modern FP method', percentage: 86, medianPercentage: 70, healthAreas: ['sexual-reproductive'], type: 'health-outcome' },
  { id: 'ho-sr-4', label: 'STI in the last 12 months', percentage: 8, medianPercentage: 6, healthAreas: ['sexual-reproductive'], type: 'health-outcome' },
];

// Vulnerability factors with health area mappings
const mockVulnerabilityFactors: DataPointItem[] = [
  // Child health vulnerability factors
  { id: 'vf-ch-1', label: 'HH clean cooking fuel', percentage: 8, medianPercentage: 25, healthAreas: ['child-health', 'nutrition'], type: 'vulnerability' },
  { id: 'vf-ch-2', label: 'HH electricity', percentage: 12, medianPercentage: 45, healthAreas: ['child-health'], type: 'vulnerability' },
  { id: 'vf-ch-3', label: 'HH water source interrupted', percentage: 42, medianPercentage: 30, healthAreas: ['child-health', 'nutrition'], type: 'vulnerability' },
  { id: 'vf-ch-4', label: 'HH slum residence (UN definition)', percentage: 78, medianPercentage: 55, healthAreas: ['child-health'], type: 'vulnerability' },

  // Immunisation vulnerability factors
  { id: 'vf-im-1', label: 'Access problem: travel alone', percentage: 47, medianPercentage: 35, healthAreas: ['immunisation', 'maternal-health'], type: 'vulnerability' },
  { id: 'vf-im-2', label: 'HW visit in last yr', percentage: 28, medianPercentage: 40, healthAreas: ['immunisation', 'maternal-health'], type: 'vulnerability' },
  { id: 'vf-im-3', label: 'Any media exposure', percentage: 13, medianPercentage: 40, healthAreas: ['immunisation', 'sexual-reproductive'], type: 'vulnerability' },
  { id: 'vf-im-4', label: 'Media exposure: internet', percentage: 5, medianPercentage: 22, healthAreas: ['immunisation', 'sexual-reproductive'], type: 'vulnerability' },

  // Maternal health vulnerability factors
  { id: 'vf-mh-1', label: 'Age at first birth', percentage: 68, medianPercentage: 52, healthAreas: ['maternal-health'], type: 'vulnerability' },
  { id: 'vf-mh-2', label: 'Not living w/ partner', percentage: 15, medianPercentage: 12, healthAreas: ['maternal-health', 'sexual-reproductive'], type: 'vulnerability' },
  { id: 'vf-mh-3', label: 'Female circumcision', percentage: 24, medianPercentage: 18, healthAreas: ['maternal-health', 'sexual-reproductive'], type: 'vulnerability' },

  // Nutrition vulnerability factors
  { id: 'vf-nu-1', label: 'Bank account (woman)', percentage: 18, medianPercentage: 35, healthAreas: ['nutrition', 'all'], type: 'vulnerability' },
  { id: 'vf-nu-2', label: 'Mobile phone used for finances', percentage: 8, medianPercentage: 25, healthAreas: ['nutrition', 'all'], type: 'vulnerability' },
  { id: 'vf-nu-3', label: 'HH member w/o insurance', percentage: 92, medianPercentage: 78, healthAreas: ['nutrition', 'all'], type: 'vulnerability' },

  // Sexual and reproductive health vulnerability factors
  { id: 'vf-sr-1', label: 'Partner opposition to FP use', percentage: 35, medianPercentage: 25, healthAreas: ['sexual-reproductive'], type: 'vulnerability' },
  { id: 'vf-sr-2', label: 'Decision maker: family planning', percentage: 22, medianPercentage: 38, healthAreas: ['sexual-reproductive', 'all'], type: 'vulnerability' },
  { id: 'vf-sr-3', label: 'Preferred next birth interval', percentage: 45, medianPercentage: 55, healthAreas: ['sexual-reproductive'], type: 'vulnerability' },

  // Cross-cutting vulnerability factors (appear when 'all' is selected)
  { id: 'vf-cc-1', label: 'Decision maker: HH purchases', percentage: 28, medianPercentage: 42, healthAreas: ['all'], type: 'vulnerability' },
  { id: 'vf-cc-2', label: 'Decision maker: own income', percentage: 32, medianPercentage: 45, healthAreas: ['all'], type: 'vulnerability' },
  { id: 'vf-cc-3', label: 'Sex of the head of HH', percentage: 85, medianPercentage: 78, healthAreas: ['all'], type: 'vulnerability' },
  { id: 'vf-cc-4', label: 'HH member of savings club', percentage: 12, medianPercentage: 22, healthAreas: ['all'], type: 'vulnerability' },
];

function DataCard({ item }: { item: DataPointItem }) {
  const isVulnerability = item.type === 'vulnerability';

  if (item.value !== undefined) {
    return (
      <div className="all-data-points__card">
        <span className="all-data-points__card-label">{item.label}</span>
        <div className="all-data-points__card-bar-wrapper">
          <span className="all-data-points__card-value">{item.value}</span>
          {item.medianValue !== undefined && (
            <div className="all-data-points__tooltip">
              <div className="all-data-points__tooltip-content">
                <div className="all-data-points__tooltip-indicator">
                  <div className="all-data-points__tooltip-line" />
                </div>
                <span className="all-data-points__tooltip-text">
                  Median across sample population: {item.medianValue}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="all-data-points__card">
      <span className="all-data-points__card-label">{item.label}</span>
      <div className="all-data-points__card-bar-wrapper">
        <div className="all-data-points__card-bar-container">
          <div className="all-data-points__card-bar-track">
            <div
              className={`all-data-points__card-bar-fill${isVulnerability ? ' all-data-points__card-bar-fill--vulnerability' : ''}`}
              style={{ width: `${item.percentage}%` }}
            />
            {item.medianPercentage !== undefined && (
              <div
                className="all-data-points__card-bar-median"
                style={{ left: `${item.medianPercentage}%` }}
              />
            )}
          </div>
          <span className="all-data-points__card-percentage">{item.percentage}%</span>
        </div>
        {item.medianPercentage !== undefined && (
          <div className="all-data-points__tooltip">
            <div className="all-data-points__tooltip-content">
              <div className="all-data-points__tooltip-indicator">
                <div className="all-data-points__tooltip-line" />
              </div>
              <span className="all-data-points__tooltip-text">
                Median across sample population: {item.medianPercentage}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const healthAreaButtons = [
  { id: 'all' as HealthArea, label: 'All data', icon: null },
  { id: 'child-health' as HealthArea, label: 'Child health', icon: ChildHealthIcon },
  { id: 'immunisation' as HealthArea, label: 'Immunisation', icon: ImmunisationIcon },
  { id: 'maternal-health' as HealthArea, label: 'Maternal health', icon: MaternalHealthIcon },
  { id: 'nutrition' as HealthArea, label: 'Nutrition', icon: NutritionIcon },
  { id: 'sexual-reproductive' as HealthArea, label: 'Sexual and reproductive health', icon: FamilyPlanningIcon }
];

export function AllDataPoints({
  healthOutcomes = mockHealthOutcomes,
  vulnerabilityFactors = mockVulnerabilityFactors
}: AllDataPointsProps) {
  const [activeHealthArea, setActiveHealthArea] = useState<HealthArea>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

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

  const filteredHealthOutcomes = useMemo(() => {
    if (activeHealthArea === 'all') return healthOutcomes;
    return healthOutcomes.filter(item => item.healthAreas.includes(activeHealthArea));
  }, [healthOutcomes, activeHealthArea]);

  const filteredVulnerabilityFactors = useMemo(() => {
    if (activeHealthArea === 'all') {
      // When 'all' is selected, show all vulnerability factors
      return vulnerabilityFactors;
    }
    // Filter by health area
    return vulnerabilityFactors.filter(item =>
      item.healthAreas.includes(activeHealthArea) || item.healthAreas.includes('all')
    );
  }, [vulnerabilityFactors, activeHealthArea]);

  const pageTitle = healthAreaTitles[activeHealthArea];

  return (
    <div className="all-data-points">
      <div className="all-data-points__header">
        <div className="all-data-points__title-row">
          <h2 className="all-data-points__title">{pageTitle}</h2>
        </div>
        <div className="all-data-points__health-filters-wrapper">
          {showLeftFade && <div className="all-data-points__fade all-data-points__fade--left" />}
          {showRightFade && <div className="all-data-points__fade all-data-points__fade--right" />}
          <div className="all-data-points__health-filters" ref={scrollContainerRef}>
            {healthAreaButtons.map((button, index) => {
              const Icon = button.icon;
              const isDivider = index === 1;
              return (
                <button
                  key={button.id}
                  className={`all-data-points__health-button ${activeHealthArea === button.id ? 'all-data-points__health-button--active' : ''} ${isDivider ? 'all-data-points__health-button--divider' : ''}`}
                  onClick={() => setActiveHealthArea(button.id)}
                >
                  {Icon && <Icon className="all-data-points__health-button-icon" />}
                  <span>{button.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="all-data-points__content">
        {/* Health Outcomes Section */}
        <div className="all-data-points__section">
          <div className="all-data-points__section-header">
            <h3 className="all-data-points__section-title">
              Health outcomes and behaviours ({filteredHealthOutcomes.length})
            </h3>
          </div>
          {filteredHealthOutcomes.length > 0 ? (
            <div className="all-data-points__grid">
              {filteredHealthOutcomes.map((item) => (
                <DataCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="all-data-points__empty">
              <span className="all-data-points__empty-text">No health outcomes for this filter</span>
            </div>
          )}
        </div>

        {/* Vulnerability Factors Section */}
        <div className="all-data-points__section">
          <div className="all-data-points__section-header">
            <h3 className="all-data-points__section-title">
              Vulnerability factors ({filteredVulnerabilityFactors.length})
            </h3>
          </div>
          {filteredVulnerabilityFactors.length > 0 ? (
            <div className="all-data-points__grid">
              {filteredVulnerabilityFactors.map((item) => (
                <DataCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="all-data-points__empty">
              <span className="all-data-points__empty-text">No vulnerability factors for this filter</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
