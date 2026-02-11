import { useRef, useState, useEffect } from 'react';
import ChildHealthIcon from '../../../assets/icons/child-health.svg?react';
import ImmunisationIcon from '../../../assets/icons/immunisation.svg?react';
import MaternalHealthIcon from '../../../assets/icons/maternal-health.svg?react';
import NutritionIcon from '../../../assets/icons/nutrition.svg?react';
import FamilyPlanningIcon from '../../../assets/icons/family-planning.svg?react';
import './PageHeader.css';

interface PageHeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  compareCount?: number;
  onClearCompare?: () => void;
  onCompare?: () => void;
  showStandardError?: boolean;
  onToggleStandardError?: () => void;
}

const tabs = [
  { id: 'all-data', label: 'All data', icon: null },
  { id: 'child-health', label: 'Child health', icon: ChildHealthIcon },
  { id: 'immunisation', label: 'Immunisation', icon: ImmunisationIcon },
  { id: 'maternal-health', label: 'Maternal health', icon: MaternalHealthIcon },
  { id: 'nutrition', label: 'Nutrition', icon: NutritionIcon },
  { id: 'sexual-reproductive-health', label: 'Sexual and reproductive health', icon: FamilyPlanningIcon }
];

export function PageHeader({ activeTab, onTabChange, compareCount = 0, onClearCompare, onCompare, showStandardError = false, onToggleStandardError }: PageHeaderProps) {
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

  return (
    <div className="page-header">
      <div className="page-header__content">
        <h1 className="page-header__title">Data browser</h1>
        <div className="page-header__description-row">
          <p className="page-header__description">
            Explore how population segments experience individual health outcomes, behaviours, and vulnerability factors. Browse by health area below or search for specific indicators.
          </p>
          {compareCount > 0 && (
            <div className="page-header__actions">
              <button
                className="page-header__clear-button"
                onClick={onClearCompare}
              >
                Clear selection
              </button>
              <button
                className="page-header__compare-button"
                onClick={onCompare}
              >
                Compare {compareCount}
                <svg className="page-header__compare-button-arrow" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="page-header__filter-row">
        <span className="page-header__filter-label">Explore by health area</span>
        <span className="page-header__filter-separator">·</span>
        <span className="page-header__filter-label page-header__filter-label--secondary">Standard error</span>
        <button
          className={`page-header__toggle${showStandardError ? ' page-header__toggle--active' : ''}`}
          onClick={onToggleStandardError}
          role="switch"
          aria-checked={showStandardError}
          aria-label="Toggle standard error"
        >
          <span className="page-header__toggle-thumb" />
        </button>
      </div>
      <div className="page-header__tabs-wrapper">
        {showLeftFade && <div className="page-header__fade page-header__fade--left" />}
        {showRightFade && <div className="page-header__fade page-header__fade--right" />}
        <div className="page-header__tabs" ref={scrollContainerRef}>
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isDivider = index === 1; // Add divider before "Child health"
            return (
              <button
                key={tab.id}
                className={`page-header__tab ${activeTab === tab.id ? 'page-header__tab--active' : ''} ${isDivider ? 'page-header__tab--divider' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                {Icon && <Icon className="page-header__tab-icon" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
