import { useRef, useState, useEffect } from 'react';
import InfoOutlinedIcon from '../../../assets/icons/InfoOutlined.svg?react';
import DownloadIcon from '../../../assets/icons/Download.svg?react';
import ChildHealthIcon from '../../../assets/icons/child-health.svg?react';
import ImmunisationIcon from '../../../assets/icons/immunisation.svg?react';
import MaternalHealthIcon from '../../../assets/icons/maternal-health.svg?react';
import NutritionIcon from '../../../assets/icons/nutrition.svg?react';
import FamilyPlanningIcon from '../../../assets/icons/family-planning.svg?react';
import KenyaFlag from '../../../assets/icons/kenya.png';
import './PageHeader.css';

interface PageHeaderProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  compareCount?: number;
  hasSelections?: boolean;
  onClearSelection?: () => void;
  onCompare?: () => void;
  onExport?: () => void;
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

export function PageHeader({ activeTab, onTabChange, compareCount = 0, hasSelections = false, onClearSelection, onCompare, onExport, showStandardError = false, onToggleStandardError }: PageHeaderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionsOpen) return;
    function handlePointer(e: MouseEvent) {
      if (!actionsRef.current?.contains(e.target as Node)) setActionsOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActionsOpen(false);
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [actionsOpen]);

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
        {/* Below 900px the sidebar is hidden, so the geography sits above the title */}
        <div className="page-header__geo">
          <img src={KenyaFlag} alt="" className="page-header__geo-flag" />
          Kenya
        </div>
        <h1 className="page-header__title">Data browser</h1>
        <div className="page-header__description-row">
          <p className="page-header__description">
            Explore how population segments experience individual health outcomes, behaviours, and vulnerability factors. Browse by health area below or search for specific indicators.
          </p>
          <div className="page-header__actions">
            <button
              className="page-header__export-button"
              onClick={onExport}
            >
              {compareCount > 0 ? `Download ${compareCount}` : 'Download'}
              <DownloadIcon width={16} height={16} />
            </button>
            {compareCount > 0 && (
              <button
                className="page-header__compare-button"
                onClick={onCompare}
              >
                Compare {compareCount}
                <svg className="page-header__compare-button-arrow" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          {/* Tablet + mobile: actions collapse into a menu, as on the live site */}
          <div className="page-header__mobile-actions" ref={actionsRef}>
            <button
              type="button"
              className={`page-header__actions-trigger ${actionsOpen ? 'page-header__actions-trigger--open' : ''}`}
              aria-haspopup="true"
              aria-expanded={actionsOpen}
              onClick={() => setActionsOpen(o => !o)}
            >
              Actions
              {actionsOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2" fill="currentColor" /><circle cx="12" cy="12" r="2" fill="currentColor" /><circle cx="12" cy="19" r="2" fill="currentColor" /></svg>
              )}
            </button>
            {actionsOpen && (
              <div className="page-header__actions-menu" role="menu">
                <button type="button" role="menuitem" className="page-header__actions-item" onClick={() => { setActionsOpen(false); onExport?.(); }}>
                  <DownloadIcon width={20} height={20} aria-hidden="true" />
                  {compareCount > 0 ? `Download ${compareCount}` : 'Download'}
                </button>
                <button type="button" role="menuitem" className="page-header__actions-item" onClick={() => { setActionsOpen(false); onToggleStandardError?.(); }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3" fill="currentColor" /></svg>
                  {showStandardError ? 'Hide standard error' : 'Show standard error'}
                </button>
                {compareCount > 0 && (
                  <button type="button" role="menuitem" className="page-header__actions-item" onClick={() => { setActionsOpen(false); onCompare?.(); }}>
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Compare {compareCount}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="page-header__filter-row">
        <span className="page-header__health-area-label">
          <span className="page-header__filter-label">Explore by health area</span>
          <span className="page-header__info-icon" aria-label="About health areas">
            <InfoOutlinedIcon width={20} height={20} />
            <span className="page-header__tooltip" role="tooltip">
              Health areas are a curated starting point. Browse or search 'All data' to explore the complete set of indicators.
            </span>
          </span>
        </span>
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
        <span className="page-header__filter-label page-header__filter-label--secondary">
          {showStandardError ? 'on' : 'off'}
        </span>
        {hasSelections && (
          <>
            <span className="page-header__filter-separator">·</span>
            <button className="page-header__select-all-button" onClick={onClearSelection}>
              Clear selection
            </button>
          </>
        )}
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
