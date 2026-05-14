import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA, type Category, type SubTab } from './domainData';
import './DomainDetailPage.css';

interface DomainDetailPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, term?: string, domainId?: string, categoryId?: string) => void;
  domainId: string;
  initialCategoryId?: string;
}

function FactorChip({ label }: { label: string }) {
  return <span className="domain-detail__chip">{label}</span>;
}

function RightPanel({ subTab }: { subTab: SubTab }) {
  return (
    <div className="domain-detail__right">
      <div className="domain-detail__right-header">
        <h2 className="domain-detail__subtab-title">{subTab.label}</h2>
        <p className="domain-detail__subtab-description">{subTab.description}</p>
      </div>

      {subTab.factors.length > 0 && (
        <div className="domain-detail__factors-section">
          <div className="domain-detail__factors-heading">
            <div className="domain-detail__miniline" />
            <h3 className="domain-detail__factors-title">Vulnerability factors</h3>
          </div>
          <div className="domain-detail__factors-list">
            {subTab.factors.map(factor => (
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
        </div>
      )}

      {subTab.factors.length === 0 && (
        <p className="domain-detail__empty">Factor content coming soon.</p>
      )}
    </div>
  );
}

export function DomainDetailPage({ currentPage, onNavigate, domainId, initialCategoryId }: DomainDetailPageProps) {
  const domain = DOMAIN_DATA.find(d => d.id === domainId);

  const firstCategoryId = domain?.categories[0]?.id ?? '';
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId ?? firstCategoryId);
  const [activeSubTabIndex, setActiveSubTabIndex] = useState(0);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    document.title = domain ? `Pathways | ${domain.label}` : 'Pathways | Vulnerability explorer';
  }, [domain]);

  // Scroll left panel to active category on mount / when initialCategoryId changes
  useEffect(() => {
    const el = categoryRefs.current[activeCategoryId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeCategoryId]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategoryId(catId);
    setActiveSubTabIndex(0);
  };

  const handleSubTabClick = (catId: string, subTabIndex: number) => {
    setActiveCategoryId(catId);
    setActiveSubTabIndex(subTabIndex);
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

  const activeCategory: Category = domain.categories.find(c => c.id === activeCategoryId) ?? domain.categories[0];
  const activeSubTab: SubTab = activeCategory.subTabs[activeSubTabIndex] ?? activeCategory.subTabs[0];

  return (
    <div className="domain-detail-page">
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

            {/* Left: category list */}
            <div className="domain-detail__left">
              <div className="domain-detail__categories-header">Categories</div>
              {domain.categories.map(cat => (
                <div
                  key={cat.id}
                  className={`domain-detail__category-section${cat.id === activeCategoryId ? ' domain-detail__category-section--active' : ''}`}
                  ref={el => { categoryRefs.current[cat.id] = el; }}
                >
                  <div className="domain-detail__category-meta">
                    <button
                      className="domain-detail__category-name"
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      {cat.label}
                    </button>
                    <p className="domain-detail__category-description">{cat.description}</p>
                  </div>
                  <div className="domain-detail__subtabs">
                    {cat.subTabs.map((sub, idx) => {
                      const isActive = cat.id === activeCategoryId && idx === activeSubTabIndex;
                      return (
                        <button
                          key={sub.label}
                          className={`domain-detail__subtab${isActive ? ' domain-detail__subtab--active' : ''}`}
                          onClick={() => handleSubTabClick(cat.id, idx)}
                        >
                          <span className="domain-detail__subtab-label">{sub.label}</span>
                          <span className="domain-detail__subtab-count">{sub.factors.length}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: selected sub-tab detail */}
            {activeSubTab && <RightPanel subTab={activeSubTab} />}
          </div>

        </div>
      </div>
    </div>
  );
}
