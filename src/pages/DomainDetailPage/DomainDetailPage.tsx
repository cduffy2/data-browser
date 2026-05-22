import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA, type Category } from './domainData';
import { Footer } from '../../components/layout/Footer/Footer';
import ArrowForwardFilled from '../../assets/icons/ArrowForwardFilled.svg?react';
import './DomainDetailPage.css';

interface ChangeDomainModalProps {
  currentDomainId: string;
  onApply: (domainId: string) => void;
  onClose: () => void;
}

function ChangeDomainModal({ currentDomainId, onApply, onClose }: ChangeDomainModalProps) {
  const [selected, setSelected] = useState(currentDomainId);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="change-domain-modal__overlay" ref={overlayRef} onMouseDown={e => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="change-domain-modal">
        <div className="change-domain-modal__header">
          <span className="change-domain-modal__title">Change domain</span>
          <button className="change-domain-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="change-domain-modal__list">
          {DOMAIN_DATA.map(d => (
            <button
              key={d.id}
              className={`change-domain-modal__item${selected === d.id ? ' change-domain-modal__item--selected' : ''}`}
              onClick={() => setSelected(d.id)}
            >
              <span className={`change-domain-modal__radio${selected === d.id ? ' change-domain-modal__radio--selected' : ''}`} />
              <span className="change-domain-modal__item-label">{d.label}</span>
            </button>
          ))}
        </div>
        <div className="change-domain-modal__footer">
          <button className="change-domain-modal__cancel" onClick={onClose}>Cancel</button>
          <button className="change-domain-modal__apply" onClick={() => { onApply(selected); onClose(); }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

interface DomainDetailPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, term?: string, domainId?: string, categoryId?: string) => void;
  domainId: string;
  initialCategoryId?: string;
  noSidebar?: boolean;
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

export function DomainDetailPage({ currentPage, onNavigate, domainId, initialCategoryId, noSidebar }: DomainDetailPageProps) {
  const domain = DOMAIN_DATA.find(d => d.id === domainId);

  const firstCategoryId = domain?.categories[0]?.id ?? '';
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId ?? firstCategoryId);
  const [activeSubTabIndex, setActiveSubTabIndex] = useState(0);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isChangeDomainOpen, setIsChangeDomainOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = domain ? `Pathways | ${domain.label}` : 'Pathways | Vulnerability explorer';
  }, [domain]);

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
          {!noSidebar && <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />}
          <div style={{ padding: 32 }}>Domain not found.</div>
        </div>
      </div>
    );
  }

  const activeCategory: Category = domain.categories.find(c => c.id === activeCategoryId) ?? domain.categories[0];
  const activeSubTab = activeCategory.subTabs[activeSubTabIndex] ?? activeCategory.subTabs[0];

  const filteredFactors = sourceFilter === 'all'
    ? activeSubTab.factors
    : activeSubTab.factors.filter(f => f.sources.includes(sourceFilter));

  return (
    <div className="domain-detail-page" ref={pageRef}>
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="domain-detail-page__main">
        {!noSidebar && <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />}
        <div className="domain-detail-page__content">

          {/* Page header */}
          <div className="domain-detail__page-header">
            <div className="domain-detail__breadcrumb">
              <button className="domain-detail__breadcrumb-link" onClick={() => onNavigate('methodology-explainer')}>
                Methodology
              </button>
              <span className="domain-detail__breadcrumb-sep">/</span>
              <span className="domain-detail__breadcrumb-current">{domain.label}</span>
            </div>
            <div className="domain-detail__headline">
              <div className="domain-detail__title-row">
                <h1 className="domain-detail__page-title">{domain.label}</h1>
                <button className="domain-detail__change-link" onClick={() => setIsChangeDomainOpen(true)}>Change</button>
              </div>
              <p className="domain-detail__page-description">{domain.description}</p>
            </div>
          </div>

          {/* Three-column explorer */}
          <div className="domain-detail__explorer">

            {/* Column 1: Categories */}
            <div className="domain-detail__col">
              <div className="domain-detail__col-header">Categories ({domain.categories.length})</div>
              <div className="domain-detail__col-list">
                {domain.categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`domain-detail__col-item${cat.id === activeCategoryId ? ' domain-detail__col-item--active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <span className="domain-detail__col-item-label">{cat.label}</span>
                    <span className={`domain-detail__col-item-count${cat.id === activeCategoryId ? ' domain-detail__col-item-count--active' : ''}`}>
                      {cat.subTabs.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Subcategories */}
            <div className="domain-detail__col domain-detail__col--mid">
              <div className="domain-detail__col-header">Subcategories ({activeCategory.subTabs.length})</div>
              <div className="domain-detail__col-list">
                {activeCategory.subTabs.map((sub, idx) => (
                  <button
                    key={sub.label}
                    className={`domain-detail__col-item${idx === activeSubTabIndex ? ' domain-detail__col-item--active' : ''}`}
                    onClick={() => setActiveSubTabIndex(idx)}
                  >
                    <span className="domain-detail__col-item-label">{sub.label}</span>
                    <span className={`domain-detail__col-item-count${idx === activeSubTabIndex ? ' domain-detail__col-item-count--active' : ''}`}>
                      {sub.factors.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Detail panel — category desc, subcategory desc, factors */}
            <div className="domain-detail__col domain-detail__col--detail">
              <div className="domain-detail__col-header">Detail</div>
              <div className="domain-detail__col-list">
                {/* Category description */}
                <div className="domain-detail__detail-section">
                  <h2 className="domain-detail__desc-category-name">{activeCategory.label}</h2>
                  <p className="domain-detail__desc-category-text">{activeCategory.description}</p>

                  {/* Subcategory description — miniline divider then subtab */}
                  {activeCategory.subTabs.length > 1 && (
                    <>
                      <div className="domain-detail__miniline" />
                      <div className="domain-detail__desc-subtab-inner">
                        <h3 className="domain-detail__desc-subtab-name">{activeSubTab.label}</h3>
                        <p className="domain-detail__desc-subtab-text">{activeSubTab.description}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Factors heading + filter */}
                <div className="domain-detail__miniline domain-detail__miniline--factors" />
                <div className="domain-detail__detail-factors-heading">
                  <span className="domain-detail__factors-title">Vulnerability factors ({filteredFactors.length}{sourceFilter !== 'all' ? ` of ${activeSubTab.factors.length}` : ''})</span>
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
                      onApply={setSourceFilter}
                      onClose={() => setIsFilterOpen(false)}
                      buttonRef={filterButtonRef}
                    />
                  </div>
                </div>

                {/* Factors */}
                <div className="domain-detail__detail-factors domain-detail__factors-list">
                  {filteredFactors.length > 0 ? filteredFactors.map(factor => (
                    <div key={factor.name} className="domain-detail__factor-card" onClick={() => onNavigate('data-browser')}>
                      <button
                        className="domain-detail__factor-card-link"
                        onClick={e => { e.stopPropagation(); onNavigate('data-browser'); }}
                      >
                        View in data browser <ArrowForwardFilled width={14} height={14} />
                      </button>
                      <div className="domain-detail__factor-text">
                        <span className="domain-detail__factor-name">{factor.name}</span>
                        <span className="domain-detail__factor-description">{factor.description}</span>
                      </div>
                      <div className="domain-detail__factor-chips">
                        {factor.sources.map(s => <FactorChip key={s} label={s} />)}
                      </div>
                    </div>
                  )) : (
                    <p className="domain-detail__empty">
                      {activeSubTab.factors.length === 0 ? 'Factor content coming soon.' : 'No factors match the selected filter.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
      {isChangeDomainOpen && (
        <ChangeDomainModal
          currentDomainId={domainId}
          onApply={(id) => onNavigate('domain-detail', undefined, undefined, id)}
          onClose={() => setIsChangeDomainOpen(false)}
        />
      )}
    </div>
  );
}
