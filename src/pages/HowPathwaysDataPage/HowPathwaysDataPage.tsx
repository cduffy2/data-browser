import { useEffect, useRef, useState } from 'react';
import healthAreaShowingPng from '../../assets/Health area showing.png';
import biharIndiaFlag from '../../assets/icons/Bihar-India.png';
import ethiopiaFlag from '../../assets/icons/ethiopia.png';
import indonesiaFlag from '../../assets/icons/indonesia.png';
import kenyaFlag from '../../assets/icons/kenya.png';
import nigeriaFlag from '../../assets/icons/nigeria.png';
import senegalFlag from '../../assets/icons/Senegal.png';
import ChildHealthIcon from '../../assets/icons/child-health.svg?react';
import ImmunisationIcon from '../../assets/icons/immunisation.svg?react';
import MaternalHealthIcon from '../../assets/icons/maternal-health.svg?react';
import NutritionIcon from '../../assets/icons/nutrition.svg?react';
import FamilyPlanningIcon from '../../assets/icons/family-planning.svg?react';
import ArrowBackFilledIcon from '../../assets/icons/ArrowBackFilled.svg?react';
import domainIconWoman from '../../assets/icons/vulnerability-domain-icons/woman-and-past-experience.svg';
import domainIconHealth from '../../assets/icons/vulnerability-domain-icons/health-mental-models.svg';
import domainIconHouseholdRel from '../../assets/icons/vulnerability-domain-icons/household-relationships.svg';
import domainIconHouseholdEco from '../../assets/icons/vulnerability-domain-icons/household-economics-and-living-conditions.svg';
import domainIconSocial from '../../assets/icons/vulnerability-domain-icons/social-support.svg';
import domainIconHuman from '../../assets/icons/vulnerability-domain-icons/human-and-natural-systems.svg';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA } from '../DomainDetailPage/domainData';
import howOrganisedImg from '../../assets/how-pathways-data-is-organised.png';
import vfIcon from '../../assets/icons/VF-icon.png';
import hoIcon from '../../assets/health-outcomes-and-behaviours-icon.png';
import '../MethodologyExplainerPage/MethodologyExplainerPage.css';
import './HowPathwaysDataPage.css';

interface HowPathwaysDataPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, term?: string, domainId?: string, categoryId?: string) => void;
}

// ── Scroll-reveal ─────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.unobserve(el); } },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`mep-reveal ${className}`}
      style={delay ? { '--reveal-delay': `${delay}ms` } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  );
}

// ── Domain cell colours ───────────────────────────────────────────────────────

const DOMAIN_CELL_COLOR: Record<string, string> = {
  'woman-experiences':      '#dbecfe',
  'health-mental':          '#e7d5ef',
  'household-relationships':'#d1ede4',
  'household-economics':    '#fedbdb',
  'social-support':         '#fff4c1',
  'human-natural':          '#dde3ef',
};

const DOMAIN_ICON: Record<string, string> = {
  'woman-experiences':      domainIconWoman,
  'health-mental':          domainIconHealth,
  'household-relationships':domainIconHouseholdRel,
  'household-economics':    domainIconHouseholdEco,
  'social-support':         domainIconSocial,
  'human-natural':          domainIconHuman,
};

// ── Health outcomes data ──────────────────────────────────────────────────────

interface HealthArea {
  id: string;
  label: string;
  cardBg: string;
  cardBorder: string;
  iconColor: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  dataPoints: string[];
}

const HEALTH_AREAS: HealthArea[] = [
  {
    id: 'child-health',
    label: 'Child health',
    cardBg: '#E5F0F8',
    cardBorder: '#76b5e5',
    iconColor: '#2a72b5',
    Icon: ChildHealthIcon,
    dataPoints: [
      'Acute Respiratory Illness (ARI) count', 'Acute Respiratory Illness (ARI) last',
      'No PNC for newborn', 'Child no fever/cough care count', 'Chest problems count',
      'Chest problems last', 'Any child chest problem', 'Cough 2 weeks last',
      'Cough count', 'Any child cough', 'Diarrhea 2 weeks last', 'Diarrhea count',
      'Any child diarrhea', 'Difficulty breathing count', 'Difficulty breathing last',
      'Any child difficulty breathing', 'Fever 2 weeks last', 'Fever count',
      'Fever or cough 2 weeks last', 'Any child fever 2 weeks last',
      'Skin-to-skin contact', 'Any child no fever/cough care',
      'Stillbirth count', 'Pregnancy ended in stillbirth',
      'Death of child before 1 yr count', 'Death of a child before 1 yr',
      'Death of child before 5 yrs count', 'Death of a child before 5 yrs',
      'No vitamin A supplements', 'No deworming medication', 'Vaccination documentation',
    ],
  },
  {
    id: 'immunisation',
    label: 'Immunisation',
    cardBg: '#daeee3',
    cardBorder: '#71d6db',
    iconColor: '#1e7a52',
    Icon: ImmunisationIcon,
    dataPoints: [
      'Child not immunized - MMR', 'Number not immunized - MMR',
      'Child not immunized - DPT', 'Number not immunized - DPT',
      'Child not immunized - polio', 'Number not immunized - polio',
      'Zero-dose child', 'Zero-dose child (count)',
      'No routine vaccination', 'No. without any routine vaccination',
      'Vaccination documentation',
    ],
  },
  {
    id: 'maternal-health',
    label: 'Maternal health',
    cardBg: '#f1e6f4',
    cardBorder: '#b5a4ea',
    iconColor: '#6b3fa0',
    Icon: MaternalHealthIcon,
    dataPoints: [
      'ANC 1st visit', 'Less than 4 ANC visits last', 'ANC month',
      'ANC total visits', 'Home birth count', 'Latest birth delivered at home',
      'Any home birth', 'No ANC 1st trimester last', 'Received PNC',
      'Ever had birth complications', 'Pregnancy loss',
      'No privacy and no menstrual products', 'Menstruation no privacy',
      'No proper menstrual products',
    ],
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    cardBg: '#fff4c1',
    cardBorder: '#e6c84a',
    iconColor: '#8a6200',
    Icon: NutritionIcon,
    dataPoints: [
      'Number of children breastfed', 'Any child breastfed',
      'No breastfeed count', 'Youngest child never breastfed',
      'Any child not breastfed', 'No. not immediately breastfed',
      'Child not immediately breastfed', 'Any child not immediately breastfed',
      'Child not exclusively breastfed', 'Any child not exclusively breastfed',
      'Number overweight', 'Overweight child last', 'Overweight child',
      'Number stunted', 'Stunted child last', 'Stunted child',
      'Number underweight', 'Underweight child last', 'Underweight child',
      'Number wasted', 'Wasted child last', 'Wasted child',
      'Woman is underweight', 'Woman is overweight or obese', 'Woman is obese',
      'micronutrient.12m',
    ],
  },
  {
    id: 'srh',
    label: 'Sexual & reproductive health',
    cardBg: '#FFF0F1',
    cardBorder: '#f2a0ac',
    iconColor: '#b52a40',
    Icon: FamilyPlanningIcon,
    dataPoints: [
      'No fp discontinue prev 5yrs', 'Never used modern FP method',
      'Non-use of modern FP method', 'STI in the last 12 months',
      'Never tested for HIV',
    ],
  },
];

// ── Popovers ──────────────────────────────────────────────────────────────────

interface HealthAreaHovered { areaId: string; areaLabel: string; x: number; y: number; }
interface TreemapHovered { domainId: string; catId: string; catLabel: string; headerColor: string; x: number; y: number; }

function HealthOutcomesPopover({ hovered }: { hovered: HealthAreaHovered }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: hovered.x + 16, top: hovered.y + 16 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos({
      left: Math.min(hovered.x + 16, window.innerWidth - width - 12),
      top: Math.min(hovered.y + 16, window.innerHeight - height - 12),
    });
  }, [hovered.x, hovered.y]);
  const area = HEALTH_AREAS.find(a => a.id === hovered.areaId);
  const twoCol = (area?.dataPoints.length ?? 0) > 10;
  return (
    <div ref={ref} className={`mep__popover${twoCol ? ' mep__popover--wide' : ''}`} style={{ left: pos.left, top: pos.top }}>
      <div className="mep__popover-title">{hovered.areaLabel}</div>
      {area && (
        <ul className={`mep__popover-subcat-list${twoCol ? ' mep__popover-subcat-list--two-col' : ''}`}>
          {area.dataPoints.map(dp => (
            <li key={dp} className="mep__popover-subcat-item">
              <span className="mep__popover-subcat-name">{dp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TreemapPopover({ hovered }: { hovered: TreemapHovered }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: hovered.x + 16, top: hovered.y + 16 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos({
      left: Math.min(hovered.x + 16, window.innerWidth - width - 12),
      top: Math.min(hovered.y + 16, window.innerHeight - height - 12),
    });
  }, [hovered.x, hovered.y]);
  const domain = DOMAIN_DATA.find(d => d.id === hovered.domainId);
  const cat = domain?.categories.find(c => c.id === hovered.catId);
  return (
    <div ref={ref} className="mep__popover" style={{ left: pos.left, top: pos.top }}>
      <div className="mep__popover-title">{hovered.catLabel}</div>
      {cat?.description && <p className="mep__popover-description">{cat.description}</p>}
      {cat && cat.subTabs.length > 0 && (
        <>
          <div className="mep__popover-section-label">Subcategories</div>
          <ul className="mep__popover-subcat-list">
            {[...cat.subTabs].sort((a, b) => b.factors.length - a.factors.length).map(s => (
              <li key={s.label} className="mep__popover-subcat-item">
                <span className="mep__popover-subcat-name">{s.label}</span>
                <span className="mep__popover-subcat-count">· {s.factors.length} factor{s.factors.length !== 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mep__popover-footer">Click to explore →</div>
    </div>
  );
}

// ── Search helpers ────────────────────────────────────────────────────────────

interface FactorResult {
  domainId: string;
  domainLabel: string;
  domainColor: string;
  catId: string;
  catLabel: string;
  cellColor: string;
  subTabLabel: string;
  factorName: string;
  factorDesc: string;
}

function buildFactorIndex(): FactorResult[] {
  const results: FactorResult[] = [];
  for (const domain of DOMAIN_DATA) {
    const cellColor = DOMAIN_CELL_COLOR[domain.id] ?? '#f0f0e8';
    for (const cat of domain.categories) {
      for (const sub of cat.subTabs) {
        for (const f of sub.factors) {
          results.push({
            domainId: domain.id,
            domainLabel: domain.label,
            domainColor: domain.headerColor,
            catId: cat.id,
            catLabel: cat.label,
            cellColor,
            subTabLabel: sub.label,
            factorName: f.name,
            factorDesc: f.description,
          });
        }
      }
    }
  }
  return results;
}

const FACTOR_INDEX = buildFactorIndex();

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="hpd-detail__highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Overlay drawer ────────────────────────────────────────────────────────────

function CategoryDrawer({ drawerState, onClose, onNavigateToCategory }: {
  drawerState: DetailState;
  onClose: () => void;
  onNavigateToCategory: (domainId: string, catId: string) => void;
}) {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const domain = DOMAIN_DATA.find(d => d.id === drawerState.domainId);
  const cat = domain?.categories.find(c => c.id === drawerState.catId);
  const totalFactors = cat?.subTabs.reduce((n, s) => n + s.factors.length, 0) ?? 0;

  const isSearching = query.trim().length > 0;
  const q = query.trim();
  const searchResults = isSearching
    ? FACTOR_INDEX.filter(r =>
        r.factorName.toLowerCase().includes(q.toLowerCase()) ||
        r.factorDesc.toLowerCase().includes(q.toLowerCase()) ||
        r.catLabel.toLowerCase().includes(q.toLowerCase()) ||
        r.subTabLabel.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 40)
    : [];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!domain || !cat) return null;

  return (
    <div className="hpd-drawer-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="hpd-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={isSearching ? 'Search factors' : cat.label}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="hpd-drawer__header">
          {isSearching ? (
            <div className="hpd-drawer__header-meta">
              <button className="hpd-drawer__search-back" onClick={() => setQuery('')} aria-label="Back">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="hpd-drawer__cat-crumb">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <div className="hpd-drawer__domain-identity">
              <div className="hpd-drawer__domain-icon-wrap">
                <img src={DOMAIN_ICON[domain.id] ?? vfIcon} alt="" className="hpd-drawer__domain-icon" />
              </div>
              <span className="hpd-drawer__domain-name">{domain.label}</span>
            </div>
          )}
          <button className="hpd-drawer__close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Search bar */}
        <div className="hpd-drawer__search-wrap">
          <svg className="hpd-drawer__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={searchRef}
            className="hpd-drawer__search-input"
            type="search"
            placeholder="Search all factors…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search all vulnerability factors"
          />
          {query && (
            <button className="hpd-drawer__search-clear" onClick={() => { setQuery(''); searchRef.current?.focus(); }} aria-label="Clear">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {isSearching ? (
          <div className="hpd-drawer__body">
            {searchResults.length === 0 ? (
              <p className="hpd-drawer__search-empty">No factors match "{q}"</p>
            ) : (
              <div className="hpd-drawer__search-results">
                {searchResults.map((r, i) => (
                  <button key={i} className="hpd-drawer__search-result"
                    onClick={() => { setQuery(''); onNavigateToCategory(r.domainId, r.catId); }}>
                    <span className="hpd-drawer__item-type-label">Factor</span>
                    <span className="hpd-drawer__factor-name">{highlight(r.factorName, q)}</span>
                    {r.factorDesc && <span className="hpd-drawer__factor-desc">{highlight(r.factorDesc, q)}</span>}
                    <div className="hpd-drawer__result-breadcrumb">
                      <span className="hpd-drawer__result-crumb-dot" style={{ backgroundColor: r.domainColor }} />
                      <span className="hpd-drawer__result-crumb-text">{r.domainLabel} › {r.catLabel}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="hpd-drawer__columns">
            {/* Sidebar */}
            <nav className="hpd-drawer__sidebar" aria-label="Categories in this domain">
              <span className="hpd-drawer__sidebar-heading">Categories</span>
              {domain.categories.map((c) => (
                <button
                  key={c.id}
                  className={`hpd-drawer__sidebar-item${c.id === cat.id ? ' hpd-drawer__sidebar-item--active' : ''}`}
                  onClick={() => onNavigateToCategory(domain.id, c.id)}
                >
                  {c.label}
                </button>
              ))}
            </nav>

            {/* Main */}
            <div className="hpd-drawer__main">
              <div className="hpd-drawer__cat-head">
                <h2 className="hpd-drawer__cat-title">{cat.label}</h2>
                <p className="hpd-drawer__cat-stats">
                  {cat.subTabs.length} subcategor{cat.subTabs.length !== 1 ? 'ies' : 'y'} · {totalFactors} factor{totalFactors !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="hpd-drawer__body">
                {cat.description && <p className="hpd-drawer__cat-description">{cat.description}</p>}
                <p className="hpd-drawer__section-heading">Subcategories ({cat.subTabs.length})</p>
                <div className="hpd-drawer__subtabs">
                  {cat.subTabs.map((sub) => (
                    <div key={sub.label} className="hpd-drawer__subtab">
                      <div className="hpd-drawer__subtab-header">
                        <span className="hpd-drawer__subtab-label">{sub.label}</span>
                      </div>
                      {sub.description && <p className="hpd-drawer__subtab-description">{sub.description}</p>}
                      {sub.factors.length > 0 && <p className="hpd-drawer__factors-heading">Factors ({sub.factors.length})</p>}
                      <ul className="hpd-drawer__factors-list">
                        {sub.factors.map(f => (
                          <li key={f.name} className="hpd-drawer__factor">
                            <span className="hpd-drawer__factor-name">{f.name}</span>
                            {f.description && <span className="hpd-drawer__factor-desc">{f.description}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Detail state ──────────────────────────────────────────────────────────────

interface DetailState { domainId: string; catId: string; }

// ── Treemap section ───────────────────────────────────────────────────────────

function TreemapSection({ activeState, onCellClick }: {
  activeState: DetailState | null;
  onCellClick: (domainId: string, catId: string) => void;
}) {
  const [hovered, setHovered] = useState<TreemapHovered | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, domainId: string, catId: string, catLabel: string, headerColor: string) => {
    setHovered({ domainId, catId, catLabel, headerColor, x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (hovered) setHovered(h => h ? { ...h, x: e.clientX, y: e.clientY } : h);
  };

  const DOMAIN_ORDER = [
    'woman-experiences', 'health-mental', 'household-relationships',
    'household-economics', 'social-support', 'human-natural',
  ];

  const renderDomain = (domain: typeof DOMAIN_DATA[number]) => {
    const cellColor = DOMAIN_CELL_COLOR[domain.id] ?? '#f0f0e8';
    const icon = DOMAIN_ICON[domain.id];
    return (
      <div key={domain.id} className="hpd-domain-card">
        <div className="hpd-domain-card__header">
          {icon && <img src={icon} alt="" className="hpd-domain-card__icon" />}
          <h4 className="hpd-domain-card__name">{domain.label}</h4>
        </div>
        <div className="hpd-domain-card__tiles">
          {domain.categories.map(cat => {
            const isActive = activeState?.domainId === domain.id && activeState?.catId === cat.id;
            return (
              <button
                key={cat.id}
                className={`mep__treemap-cell${isActive ? ' mep__treemap-cell--active' : ''}`}
                style={{ backgroundColor: cellColor }}
                onClick={() => onCellClick(domain.id, cat.id)}
                onMouseEnter={e => !isActive && handleMouseEnter(e, domain.id, cat.id, cat.label, domain.headerColor)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHovered(null)}
              >
                {isActive && <div className="mep__treemap-cell__overlay" />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <section id="hpd-treemap" className="mep__section mep__section--treemap" aria-labelledby="hpd-treemap-title">
        <div className="mep__section-inner mep__section-inner--wide">
          <Reveal className="mep__s1-header">
            <h2 id="hpd-treemap-title" className="mep__s1-title">How vulnerability factors are organised</h2>
            <p className="mep__s1-intro">
              Vulnerability Factors are grouped into six domains. Each domain covers a distinct area of a woman's life that research has shown to shape her health-seeking behaviour and outcomes.
            </p>
          </Reveal>
          <div className="mep__treemap-wrap">
            <div className="hpd-domains-grid">
              {DOMAIN_ORDER.map(id => {
                const domain = DOMAIN_DATA.find(d => d.id === id);
                return domain ? renderDomain(domain) : null;
              })}
            </div>
          </div>
        </div>
      </section>
      {hovered && !activeState && <TreemapPopover hovered={hovered} />}
    </>
  );
}

// ── Health outcomes section ───────────────────────────────────────────────────

function HealthOutcomesSection() {
  const [hovered, setHovered] = useState<HealthAreaHovered | null>(null);
  return (
    <>
      <section className="mep__section mep__section--treemap" aria-labelledby="hpd-ho-title">
        <div className="mep__section-inner mep__section-inner--wide">
          <Reveal className="mep__s1-header">
            <h2 id="hpd-ho-title" className="mep__s1-title">How health outcomes and behaviours are organised</h2>
            <p className="mep__s1-intro">
              Health outcomes and behaviours are grouped into five health areas. These data points are used to rank segments by vulnerability, not to define them.
            </p>
          </Reveal>
          <div className="mep__ho-grid">
            <div className="mep__ho-row">
              <div className="mep__ho-label-cell">
                <span className="mep__ho-axis-label">Health areas</span>
              </div>
              {HEALTH_AREAS.slice(0, 2).map(area => {
                const Icon = area.Icon;
                return (
                  <div
                    key={area.id}
                    className="mep__ho-card"
                    style={{ backgroundColor: area.cardBg }}
                    onMouseEnter={e => setHovered({ areaId: area.id, areaLabel: area.label, x: e.clientX, y: e.clientY })}
                    onMouseMove={e => setHovered(h => h ? { ...h, x: e.clientX, y: e.clientY } : h)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="mep__ho-card-icon-wrap">
                      <Icon width={24} height={24} style={{ color: area.iconColor }} />
                    </div>
                    <span className="mep__ho-card-label">{area.label}</span>
                    <span className="mep__ho-card-count">{area.dataPoints.length} data points</span>
                  </div>
                );
              })}
            </div>
            <div className="mep__ho-row">
              {HEALTH_AREAS.slice(2).map(area => {
                const Icon = area.Icon;
                return (
                  <div
                    key={area.id}
                    className="mep__ho-card"
                    style={{ backgroundColor: area.cardBg }}
                    onMouseEnter={e => setHovered({ areaId: area.id, areaLabel: area.label, x: e.clientX, y: e.clientY })}
                    onMouseMove={e => setHovered(h => h ? { ...h, x: e.clientX, y: e.clientY } : h)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="mep__ho-card-icon-wrap">
                      <Icon width={24} height={24} style={{ color: area.iconColor }} />
                    </div>
                    <span className="mep__ho-card-label">{area.label}</span>
                    <span className="mep__ho-card-count">{area.dataPoints.length} data points</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {hovered && <HealthOutcomesPopover hovered={hovered} />}
    </>
  );
}

// ── CTA geographies ───────────────────────────────────────────────────────────

const CTA_GEOGRAPHIES = [
  { id: 'bihar-india',      name: 'Bihar, India',      flag: biharIndiaFlag },
  { id: 'ethiopia',         name: 'Ethiopia',           flag: ethiopiaFlag },
  { id: 'indonesia',        name: 'Indonesia',          flag: indonesiaFlag },
  { id: 'kenya',            name: 'Kenya',              flag: kenyaFlag },
  { id: 'northern-nigeria', name: 'Northern Nigeria',   flag: nigeriaFlag },
  { id: 'senegal',          name: 'Senegal',            flag: senegalFlag },
];

function CtaSection({ onNavigate }: { onNavigate: HowPathwaysDataPageProps['onNavigate'] }) {
  const [geo, setGeo] = useState<typeof CTA_GEOGRAPHIES[number] | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [showError, setShowError] = useState(false);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const geoBtnRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = (e.clientX - left) / width - 0.5;
    const cy = (e.clientY - top) / height - 0.5;
    setImgOffset({ x: cx * 8, y: cy * -5 });
  };

  const handleMouseLeave = () => setImgOffset({ x: 0, y: 0 });

  return (
    <section
      ref={sectionRef}
      className="mep__section mep__section--cta"
      aria-labelledby="hpd-cta-title"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mep__section-inner mep__cta-inner">
        <div className="mep__cta-left">
          <Reveal>
            <h2 id="hpd-cta-title" className="mep__cta-title">Explore data points in the comparison tool</h2>
            <p className="mep__cta-body">
              When you explore by health area in Pathways, you'll see a mix of health outcomes and behaviours alongside vulnerability factors. The vulnerability factors shown for each health area are a curated starting point, selected by segmentation editors as likely to be of interest to practitioners working in that area.
            </p>
          </Reveal>
          <div className="mep__cta-action-wrap">
            <div className="mep__cta-action">
              <div className="mep__cta-geo-wrap" ref={dropdownRef}>
                <button
                  ref={geoBtnRef}
                  className={`mep__cta-geo-btn${geo ? ' mep__cta-geo-btn--active' : ''}`}
                  onClick={() => {
                    if (!dropdownOpen && geoBtnRef.current) {
                      const r = geoBtnRef.current.getBoundingClientRect();
                      setDropdownPos({ top: r.bottom + 6, left: r.left });
                    }
                    setDropdownOpen(o => !o);
                  }}
                  aria-expanded={dropdownOpen}
                >
                  {geo && <img src={geo.flag} alt="" className="mep__cta-geo-flag" />}
                  <span className="mep__cta-geo-label">{geo ? geo.name : 'Select a geography'}</span>
                  <svg className="mep__cta-geo-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="mep__cta-geo-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
                    {CTA_GEOGRAPHIES.map(g => (
                      <button
                        key={g.id}
                        className={`mep__cta-geo-option${geo?.id === g.id ? ' mep__cta-geo-option--active' : ''}`}
                        onClick={() => { setGeo(g); setDropdownOpen(false); setShowError(false); }}
                      >
                        <img src={g.flag} alt="" className="mep__cta-geo-option-flag" />
                        {g.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="mep__cta-btn"
                onClick={() => { if (geo) { onNavigate('compare-segments'); } else { setShowError(true); } }}
              >
                Explore in comparison tool
              </button>
            </div>
            {showError && <p className="mep__cta-error">Please select a geography first.</p>}
          </div>
        </div>
        <div className="mep__cta-image-wrap">
          <div
            className="mep__cta-image-border"
            style={{ transform: `perspective(800px) rotateY(${imgOffset.x}deg) rotateX(${imgOffset.y}deg)`, transition: imgOffset.x === 0 && imgOffset.y === 0 ? 'transform 0.6s ease' : 'transform 0.1s linear' }}
          >
            <img src={healthAreaShowingPng} alt="Comparison tool showing health area data" className="mep__cta-image" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function HowPathwaysDataPage({ currentPage, onNavigate }: HowPathwaysDataPageProps) {
  useEffect(() => { document.title = 'Pathways | How Pathways data is organised'; }, []);
  const [detailState, setDetailState] = useState<DetailState | null>(null);

  return (
    <div className="mep hpd">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <main id="main-content">

        {/* Hero */}
        <div className="mep__hero-wrap">
          <header className="mep__hero" aria-labelledby="hpd-hero-title">
            <div className="mep__hero-content">
              <button className="mep__back-btn" onClick={() => onNavigate('resources')}>
                <ArrowBackFilledIcon width={16} height={16} />
                Resources
              </button>
              <h1 id="hpd-hero-title" className="mep__hero-title">
                How Pathways data is organised
              </h1>
              <p className="mep__hero-subtitle">
                Pathways data is structured around two distinct types of data points — vulnerability factors and health outcomes — organised into domains and health areas to make exploration intuitive.
              </p>
            </div>
            <div className="mep__hero-visual">
              <img src={howOrganisedImg} alt="" className="mep__hero-image" />
            </div>
          </header>
          <div className="mep__hero-wave">
            <svg viewBox="0 0 1440 53" fill="none" preserveAspectRatio="none" className="mep__hero-wave-svg">
              <path d="M716.977 35.0943C417.999 -17.9828 90.7479 21.5358 1.76793e-05 34.4708V53H1440V0.413139C1350.72 18.1406 988.882 83.364 716.977 35.0943Z" fill="var(--background-page, #fcfcf6)" />
            </svg>
          </div>
        </div>

        {/* Two types of data */}
        <section className="mep__section" aria-labelledby="hpd-s1-title">
          <div className="mep__section-inner">
            <Reveal className="mep__s1-header">
              <h2 id="hpd-s1-title" className="mep__s1-title">Two types of data</h2>
              <p className="mep__s1-intro">
                Pathways segmentations use two distinct types of data points. Understanding this distinction is key to understanding Pathways.
              </p>
            </Reveal>
            <div className="mep__two-col">
              <Reveal className="mep__data-type-col">
                <div className="mep__data-type-icon">
                  <img src={vfIcon} alt="" className="mep__data-type-icon-img" />
                </div>
                <div className="mep__data-type-content">
                  <h3 className="mep__data-type-title">Vulnerability factors</h3>
                  <p className="mep__data-type-body">
                    Social, cultural, economic, and environmental circumstances that shape a woman's life outside the health system.
                  </p>
                  <p className="mep__data-type-label">↳ Group women into segments</p>
                </div>
              </Reveal>
              <Reveal delay={80} className="mep__data-type-col">
                <div className="mep__data-type-icon">
                  <img src={hoIcon} alt="" className="mep__data-type-icon-img" />
                </div>
                <div className="mep__data-type-content">
                  <h3 className="mep__data-type-title">Health outcomes and behaviours</h3>
                  <p className="mep__data-type-body">
                    Measurable indicators such as antenatal care attendance, child vaccinations, malnutrition, or child death.
                  </p>
                  <p className="mep__data-type-label">↳ Rank segments from least to most vulnerable</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* How vulnerability factors are organised */}
        <TreemapSection
          activeState={detailState}
          onCellClick={(domainId, catId) => setDetailState({ domainId, catId })}
        />

        {/* How health outcomes and behaviours are organised */}
        <HealthOutcomesSection />

        {/* Explore data points CTA */}
        <CtaSection onNavigate={onNavigate} />

      </main>

      <Footer />

      {detailState && (
        <CategoryDrawer
          drawerState={detailState}
          onClose={() => setDetailState(null)}
          onNavigateToCategory={(domainId, catId) => setDetailState({ domainId, catId })}
        />
      )}
    </div>
  );
}
