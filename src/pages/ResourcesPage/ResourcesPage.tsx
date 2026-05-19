import { useEffect, useState, useRef, useCallback } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import placeholderImg from '../../assets/Placeholder Image.png';
import supportBannerPhoto from '../../assets/support-banner-photo.png';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import FilterIcon from '../../assets/icons/filter.svg?react';
import WaveIcon from '../../assets/Wave.svg?react';
import { ALL_ARTICLES } from '../../data/articles';
import './ResourcesPage.css';

interface ResourcesPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string) => void;
}

const FILTER_OPTIONS: Record<string, string[]> = {
  'Use case': ['Getting started', 'Exploring data', 'Planning a project', 'Recruiting participants', 'Creating a segmentation', 'Conducting segmentation based research'],
  'Feature': ['Typing Tool', 'Data Browser', 'Comparison Tool', 'Segment profile', 'Prevalence map'],
  'Role': ['Data scientist', 'Researcher', 'Decision maker'],
  'Geography': ['Ethiopia', 'Indonesia', 'Kenya', 'Northern Nigeria', 'Senegal', 'Southern Nigeria'],
};

const FILTER_KEYS = Object.keys(FILTER_OPTIONS);

// ── Filter dropdown ──────────────────────────────────────────────────────────

interface FilterDropdownProps {
  label: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function FilterDropdown({ label, options, isOpen, onToggle, onClose }: FilterDropdownProps) {
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isOpen) setPending(new Set(applied));
    onToggle();
  };

  const handleApply = () => {
    setApplied(new Set(pending));
    onClose();
  };

  const handleClearAll = () => {
    setPending(new Set());
    setApplied(new Set());
  };

  const toggleOption = (opt: string) => {
    setPending(prev => {
      const next = new Set(prev);
      next.has(opt) ? next.delete(opt) : next.add(opt);
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const count = applied.size;
  const isActive = isOpen || count > 0;

  return (
    <div className="resources-filter" ref={ref}>
      <button
        className={`resources-filter__btn${isActive ? ' resources-filter__btn--active' : ''}`}
        onClick={handleToggle}
      >
        {count === 1 ? [...applied][0] : label}
        {count > 1 && (
          <span className="resources-filter__count">{count}</span>
        )}
      </button>

      {isOpen && (
        <div className="resources-filter__dropdown">
          <div className="resources-filter__options">
            {options.map(opt => (
              <label key={opt} className="resources-filter__option">
                <input
                  type="checkbox"
                  className="resources-filter__checkbox"
                  checked={pending.has(opt)}
                  onChange={() => toggleOption(opt)}
                />
                <span className="resources-filter__option-label">{opt}</span>
              </label>
            ))}
          </div>
          <div className="resources-filter__footer">
            <button className="resources-filter__clear" onClick={handleClearAll}>Clear all</button>
            <button className="resources-filter__apply" onClick={handleApply}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Article card ─────────────────────────────────────────────────────────────

interface ArticleCardProps {
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  onNavigate: (page: Page, tag?: string) => void;
}

function ArticleCard({ date, title, excerpt, tags, onNavigate }: ArticleCardProps) {
  return (
    <div className="resources-page__article-card" onClick={() => onNavigate('article-detail')}>
      <div className="resources-page__article-image">
        <img src={placeholderImg} alt="" />
        <div className="resources-page__image-overlay" />
      </div>
      <div className="resources-page__article-content">
        <span className="resources-page__article-date">{date}</span>
        <h3 className="resources-page__article-title">{title}</h3>
        <p className="resources-page__article-excerpt">{excerpt}</p>
        <div className="resources-page__article-tags">
          {tags.map(tag => (
            <span
              key={tag}
              className="resources-page__tag resources-page__tag--clickable"
              onClick={e => { e.stopPropagation(); onNavigate('resources-filtered', tag); }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="resources-page__article-action">
          <button className="resources-page__read-more" onClick={e => { e.stopPropagation(); onNavigate('article-detail'); }}>
            Read more
            <ArrowForwardIcon className="resources-page__read-more-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function ResourcesPage({ currentPage, onNavigate }: ResourcesPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Resources';
  }, []);

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleToggle = useCallback((key: string) => {
    setOpenFilter(prev => prev === key ? null : key);
  }, []);

  const handleClose = useCallback(() => {
    setOpenFilter(null);
  }, []);

  const featured = ALL_ARTICLES[0];
  const firstGrid = ALL_ARTICLES.slice(3, 9);
  const secondGrid = ALL_ARTICLES.slice(9, 15);

  return (
    <div className="resources-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      {/* Header band */}
      <div className="resources-page__header-band">
        <div className="resources-page__section-header">
          <span className="resources-page__tagline">Resources</span>
          <h1 className="resources-page__heading">
            Support and inspiration for using<br />Pathways in your work
          </h1>
        </div>
      </div>
      <div className="resources-page__wave">
        <WaveIcon className="resources-page__wave-svg" />
      </div>

      <div className="resources-page__body">
        <div className="resources-page__section">

          {/* Blog hero — 3 articles */}
          <div className="resources-page__blog-hero">
            {/* Left: large featured article */}
            <div className="resources-page__blog-hero-main" onClick={() => onNavigate('article-detail')}>
              <div className="resources-page__blog-hero-main-image">
                <img src={placeholderImg} alt="" />
                <div className="resources-page__image-overlay" />
              </div>
              <div className="resources-page__blog-hero-main-content">
                <span className="resources-page__article-date">{featured.date}</span>
                <h2 className="resources-page__featured-title">{featured.title}</h2>
                <p className="resources-page__featured-excerpt">{featured.excerpt}</p>
                <div className="resources-page__article-tags">
                  {featured.tags.map(tag => (
                    <span
                      key={tag}
                      className="resources-page__tag resources-page__tag--clickable"
                      onClick={e => { e.stopPropagation(); onNavigate('resources-filtered', tag); }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="resources-page__article-action">
                  <button className="resources-page__read-more" onClick={e => { e.stopPropagation(); onNavigate('article-detail'); }}>
                    Read more
                    <ArrowForwardIcon className="resources-page__read-more-icon" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: two smaller articles stacked */}
            <div className="resources-page__blog-hero-stack">
              {ALL_ARTICLES.slice(1, 3).map(article => (
                <div key={article.id} className="resources-page__blog-hero-item" onClick={() => onNavigate('article-detail')}>
                  <div className="resources-page__blog-hero-item-image">
                    <img src={placeholderImg} alt="" />
                    <div className="resources-page__image-overlay" />
                  </div>
                  <div className="resources-page__blog-hero-item-content">
                    <span className="resources-page__article-date">{article.date}</span>
                    <h3 className="resources-page__featured-title">{article.title}</h3>
                    <div className="resources-page__article-tags">
                      {article.tags.map(tag => (
                        <span
                          key={tag}
                          className="resources-page__tag resources-page__tag--clickable"
                          onClick={e => { e.stopPropagation(); onNavigate('resources-filtered', tag); }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="resources-page__article-action">
                      <button className="resources-page__read-more" onClick={e => { e.stopPropagation(); onNavigate('article-detail'); }}>
                        Read more
                        <ArrowForwardIcon className="resources-page__read-more-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="resources-page__filters">
            <div className="resources-page__filters-label">
              <FilterIcon className="resources-page__filters-icon" />
              <span className="resources-page__filters-text">Filters:</span>
            </div>
            {FILTER_KEYS.map(key => (
              <FilterDropdown
                key={key}
                label={key}
                options={FILTER_OPTIONS[key]}
                isOpen={openFilter === key}
                onToggle={() => handleToggle(key)}
                onClose={handleClose}
              />
            ))}
          </div>

          {/* First article grid */}
          <div className="resources-page__grid">
            {firstGrid.map(a => (
              <ArticleCard key={a.id} {...a} onNavigate={onNavigate} />
            ))}
          </div>

        </div>
      </div>

      {/* Support banner */}
      <div className="resources-page__banner">
        <div className="resources-page__banner-bg" aria-hidden="true">
          <img src={supportBannerPhoto} alt="" />
          <div className="resources-page__banner-overlay" />
        </div>
        <div className="resources-page__banner-content">
          <h2 className="resources-page__banner-heading">Looking for more support?</h2>
          <p className="resources-page__banner-body">
            Our technical assistance team offer tailored support for creating segmentations, analysing data with your team, and facilitating intervention design workshops.
          </p>
          <button className="resources-page__banner-btn" onClick={() => onNavigate('contact')}>
            Get in touch
            <ArrowForwardIcon className="resources-page__banner-btn-icon" />
          </button>
        </div>
      </div>

      {/* Second article grid + pagination */}
      <div className="resources-page__body">
        <div className="resources-page__section resources-page__section--continuation">
          <div className="resources-page__grid">
            {secondGrid.map(a => (
              <ArticleCard key={a.id} {...a} onNavigate={onNavigate} />
            ))}
          </div>
          <div className="resources-page__pagination">
            {[1, 2, 3, 4].map(n => (
              <button key={n} className={`resources-page__page-btn${n === 1 ? ' resources-page__page-btn--active' : ''}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
