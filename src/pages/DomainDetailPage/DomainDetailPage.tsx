import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA, type Category, type SubTab } from './domainData';
import { Footer } from '../../components/layout/Footer/Footer';
import './DomainDetailPage.css';

interface DomainDetailPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, term?: string, domainId?: string, categoryId?: string) => void;
  domainId: string;
  initialCategoryId?: string;
}

const FilterListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="currentColor" />
  </svg>
);

type SourceFilter = 'all' | 'DHS' | 'Pathways' | 'Qualitative';

interface FilterMenuProps {
  isOpen: boolean;
  selected: SourceFilter;
  onApply: (val: SourceFilter) => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

function FilterMenu({ isOpen, selected, onApply, onClose, buttonRef }: FilterMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [tempSelected, setTempSelected] = useState<SourceFilter>(selected);

  useEffect(() => {
    setTempSelected(selected);
  }, [selected, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const options: { value: SourceFilter; label: string }[] = [
    { value: 'all', label: 'All factors' },
    { value: 'DHS', label: 'DHS availability' },
    { value: 'Pathways', label: 'Pathways survey availability' },
    { value: 'Qualitative', label: 'Qualitative' },
  ];

  return (
    <div ref={menuRef} className="domain-detail__filter-menu">
      <div className="domain-detail__filter-menu-heading">Data source</div>
      {options.map(opt => (
        <button
          key={opt.value}
          className="domain-detail__filter-menu-item"
          onClick={() => setTempSelected(opt.value)}
        >
          <span className={`domain-detail__radio${tempSelected === opt.value ? ' domain-detail__radio--selected' : ''}`} />
          <span className="domain-detail__filter-menu-item-label">{opt.label}</span>
        </button>
      ))}
      <div className="domain-detail__filter-menu-footer">
        <button className="domain-detail__filter-menu-apply" onClick={() => { onApply(tempSelected); onClose(); }}>
          Apply
        </button>
      </div>
    </div>
  );
}

function FactorChip({ label }: { label: string }) {
  return <span className="domain-detail__chip">{label}</span>;
}

function RightPanel({ category, activeSubTabIndex, onSubTabClick, sourceFilter, onFilterChange }: {
  category: Category;
  activeSubTabIndex: number;
  onSubTabClick: (idx: number) => void;
  sourceFilter: SourceFilter;
  onFilterChange: (val: SourceFilter) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [isSubcatsStuck, setIsSubcatsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsSubcatsStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  const activeSubTab = category.subTabs[activeSubTabIndex] ?? category.subTabs[0];

  const filteredFactors = sourceFilter === 'all'
    ? activeSubTab.factors
    : activeSubTab.factors.filter(f => f.sources.includes(sourceFilter));

  return (
    <div className="domain-detail__right">
      {/* Category description */}
      <div className="domain-detail__right-header">
        <h2 className="domain-detail__subtab-title">{category.label}</h2>
        <p className="domain-detail__subtab-description">{category.description}</p>
      </div>

      {/* Sentinel for detecting when subcategories bar becomes sticky */}
      <div ref={sentinelRef} style={{ height: 0 }} />

      {/* Sticky subcategories header + horizontal tab bar */}
      <div className={`domain-detail__subcategories-sticky${isSubcatsStuck ? ' domain-detail__subcategories-sticky--stuck' : ''}`}>
        <div className="domain-detail__subcategories-header">
          Subcategories ({category.subTabs.length})
        </div>
        {category.subTabs.length > 1 && (
          <div className="domain-detail__horiz-tabs">
            <div className="domain-detail__horiz-tabs-inner">
              {category.subTabs.map((sub, idx) => (
                <button
                  key={sub.label}
                  className={`domain-detail__horiz-tab${idx === activeSubTabIndex ? ' domain-detail__horiz-tab--active' : ''}`}
                  onClick={() => onSubTabClick(idx)}
                  title={sub.label}
                >
                  <span className="domain-detail__horiz-tab-label">{sub.label}</span>
                  <span className={`domain-detail__horiz-tab-count${idx === activeSubTabIndex ? ' domain-detail__subtab-count--active' : ''}`}>
                    {sub.factors.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active sub-tab name and description */}
      <div className={`domain-detail__subtab-header${category.subTabs.length === 1 ? ' domain-detail__subtab-header--single' : ''}`}>
        <h3 className="domain-detail__subtab-name">{activeSubTab.label}</h3>
        <p className="domain-detail__subtab-description">{activeSubTab.description}</p>
      </div>

      {/* Factors */}
      <div className="domain-detail__factors-section">
        <div className="domain-detail__factors-heading">
          <div className="domain-detail__miniline" />
          <div className="domain-detail__factors-title-row">
            <h4 className="domain-detail__factors-title">Vulnerability factors ({activeSubTab.factors.length})</h4>
            <div className="domain-detail__filter-trigger-wrapper">
              <div className="domain-detail__filter-label-group">
                <FilterListIcon />
                <span className="domain-detail__filter-static-label">Filter:</span>
                <button
                  ref={filterButtonRef}
                  className="domain-detail__filter-button"
                  onClick={() => setIsFilterOpen(o => !o)}
                >
                  {sourceFilter === 'all' ? 'All factors' : sourceFilter === 'Pathways' ? 'Pathways survey availability' : sourceFilter === 'DHS' ? 'DHS availability' : 'Qualitative'}
                </button>
              </div>
              <FilterMenu
                isOpen={isFilterOpen}
                selected={sourceFilter}
                onApply={onFilterChange}
                onClose={() => setIsFilterOpen(false)}
                buttonRef={filterButtonRef}
              />
            </div>
          </div>
        </div>

        {filteredFactors.length > 0 ? (
          <div className="domain-detail__factors-list">
            {filteredFactors.map(factor => (
              <div key={factor.name} className="domain-detail__factor-card">
                <div className="domain-detail__factor-text">
                  <span className="domain-detail__factor-name">{factor.name}</span>
                  <span className="domain-detail__factor-description">{factor.description}</span>
                </div>
                <div className="domain-detail__factor-chips">
                  {factor.sources.map(s => <FactorChip key={s} label={s} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="domain-detail__empty">
            {activeSubTab.factors.length === 0 ? 'Factor content coming soon.' : 'No factors match the selected filter.'}
          </p>
        )}
      </div>
    </div>
  );
}

export function DomainDetailPage({ currentPage, onNavigate, domainId, initialCategoryId }: DomainDetailPageProps) {
  const domain = DOMAIN_DATA.find(d => d.id === domainId);

  const firstCategoryId = domain?.categories[0]?.id ?? '';
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId ?? firstCategoryId);
  const [activeSubTabIndex, setActiveSubTabIndex] = useState(0);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = domain ? `Pathways | ${domain.label}` : 'Pathways | Vulnerability explorer';
  }, [domain]);

  // Keep --sticky-top in sync with the nav's hidden/visible state
  useEffect(() => {
    const nav = document.querySelector('.primary-nav');
    if (!nav) return;
    const update = () => {
      const hidden = nav.classList.contains('primary-nav--hidden');
      pageRef.current?.style.setProperty('--sticky-top', hidden ? '0px' : 'var(--nav-height)');
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(nav, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const handleCategoryClick = (catId: string) => {
    setActiveCategoryId(catId);
    setActiveSubTabIndex(0);
  };

  if (!domain) {
    return (
      <div className="domain-detail-page">
        <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="domain-detail-page__main">
          <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
          <div style={{ padding: 32 }}>Domain not found.</div>
        </div>
      </div>
    );
  }

  const activeCategory = domain.categories.find(c => c.id === activeCategoryId) ?? domain.categories[0];

  return (
    <div className="domain-detail-page" ref={pageRef}>
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="domain-detail-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="domain-detail-page__content">

          {/* Page header */}
          <div className="domain-detail__page-header">
            <div className="domain-detail__breadcrumb">
              <button className="domain-detail__breadcrumb-link" onClick={() => onNavigate('vulnerability-explorer')}>
                Vulnerability explorer
              </button>
              <span className="domain-detail__breadcrumb-sep">/</span>
              <span className="domain-detail__breadcrumb-current">{domain.label}</span>
            </div>
            <div className="domain-detail__headline">
              <h1 className="domain-detail__page-title">{domain.label}</h1>
              <p className="domain-detail__page-description">{domain.description}</p>
            </div>
          </div>

          {/* Two-column body */}
          <div className="domain-detail__body">

            {/* Left: flat category tab list */}
            <div className="domain-detail__left">
              <div className="domain-detail__categories-header">Categories ({domain.categories.length})</div>
              {domain.categories.map(cat => (
                <button
                  key={cat.id}
                  className={`domain-detail__category-tab${cat.id === activeCategoryId ? ' domain-detail__category-tab--active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="domain-detail__category-tab-label">{cat.label}</span>
                  <span className={`domain-detail__subtab-count${cat.id === activeCategoryId ? ' domain-detail__subtab-count--active' : ''}`}>
                    {cat.subTabs.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: category description + horizontal sub-tabs + factors */}
            <RightPanel
              key={activeCategoryId}
              category={activeCategory}
              activeSubTabIndex={activeSubTabIndex}
              onSubTabClick={setActiveSubTabIndex}
              sourceFilter={sourceFilter}
              onFilterChange={setSourceFilter}
            />
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
