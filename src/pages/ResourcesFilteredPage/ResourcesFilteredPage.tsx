import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import placeholderImg from '../../assets/Placeholder Image.png';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import { ALL_ARTICLES } from '../../data/articles';
import './ResourcesFilteredPage.css';

interface ResourcesFilteredPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string) => void;
  selectedTag: string;
}

function ArticleCard({ date, title, excerpt, tags, onNavigate }: {
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  onNavigate: (page: Page, tag?: string) => void;
}) {
  return (
    <div className="resources-filtered__card" onClick={() => onNavigate('article-detail')}>
      <div className="resources-filtered__image">
        <img src={placeholderImg} alt="" />
        <div className="resources-filtered__overlay" />
      </div>
      <div className="resources-filtered__content">
        <span className="resources-filtered__date">{date}</span>
        <h3 className="resources-filtered__title">{title}</h3>
        <p className="resources-filtered__excerpt">{excerpt}</p>
        <div className="resources-filtered__tags">
          {tags.map(tag => (
            <span
              key={tag}
              className="resources-filtered__tag"
              onClick={e => { e.stopPropagation(); onNavigate('resources-filtered', tag); }}
            >
              {tag}
            </span>
          ))}
        </div>
        <button className="resources-filtered__read-more" onClick={e => { e.stopPropagation(); onNavigate('article-detail'); }}>
          Read more
          <ArrowForwardIcon className="resources-filtered__read-more-icon" />
        </button>
      </div>
    </div>
  );
}

export function ResourcesFilteredPage({ currentPage, onNavigate, selectedTag }: ResourcesFilteredPageProps) {
  useEffect(() => {
    document.title = `Pathways | Resources — ${selectedTag}`;
  }, [selectedTag]);

  const filtered = ALL_ARTICLES.filter(a => a.tags.includes(selectedTag));

  return (
    <div className="resources-filtered-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="resources-filtered-page__body">
        <div className="resources-filtered-page__section">

          {/* Active tag chip */}
          <div className="resources-filtered-page__header">
            <span className="resources-filtered-page__tagline">Resources</span>
            <div className="resources-filtered-page__active-tag">
              <span className="resources-filtered-page__chip">
                {selectedTag}
                <button
                  className="resources-filtered-page__chip-remove"
                  aria-label={`Remove filter: ${selectedTag}`}
                  onClick={() => onNavigate('resources')}
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          {/* Results count */}
          <p className="resources-filtered-page__count">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="resources-filtered-page__grid">
              {filtered.map(a => (
                <ArticleCard key={a.id} {...a} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <p className="resources-filtered-page__empty">No articles found for this tag.</p>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
