import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import placeholderImg from '../../assets/Placeholder Image.png';
import segmentationImg from '../../assets/Content/30/Segmentation-research-image.png';
import supportBannerPhoto from '../../assets/support-banner-photo.png';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import './ArticleDetailPage.css';

interface ArticleDetailPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string) => void;
  onGoBack: () => void;
}

const SHARE_X = 'https://x.com';
const SHARE_FB = 'https://facebook.com';

const TAGS = ['Content type', 'Feature', 'Role', 'Geography', 'Tag #5', 'Tag #6', 'Tag #7', 'Tag #8'];

const RELATED = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  date: '11 Mar 2024',
  title: 'Article title goes here, it can be spread over two lines',
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.',
  tags: TAGS,
}));

const FAQ_ITEMS = [
  'How to design focused/rapid qual research building on segmentation results?',
  'How to collect the right amount of qual data to answer a question for each demographic?',
  'How to develop good discussion guides for segment-based research?',
  'How to connect quantitative data analysis, field testing, field testing rigor and speed?',
  'How to develop hypotheses based on quant and mixed methods segmentation results?',
  'How to decide whether segments are relevant to a specific outcome behaviour?',
  'How to interpret segmentation results for specific geographies including recall geographies, data populations, etc?',
  'What are best practices for mixing typing tools?',
  'How do we ensure we are confident in findings conclusions based on inputs?',
  'How do we share recommendations with partners (including considering segments)?',
  'How do we ensure Conclusions of typing end?',
];

export function ArticleDetailPage({ currentPage, onNavigate, onGoBack }: ArticleDetailPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Conducting segmentation based research';
  }, []);

  return (
    <div className="article-detail-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Hero */}
      <div className="article-detail-page__hero">
        <img src={supportBannerPhoto} alt="" className="article-detail-page__hero-bg" />
        <div className="article-detail-page__hero-overlay" />
        <div className="article-detail-page__hero-content">
          <span className="article-detail-page__tagline">Resource article</span>
          <h1 className="article-detail-page__hero-title">Conducting segmentation based research</h1>
          <span className="article-detail-page__byline">Written by Hallie Goertz</span>
        </div>
      </div>

      {/* Article body */}
      <div className="article-detail-page__body">
        <div className="article-detail-page__container">

          {/* Back + share row */}
          <div className="article-detail-page__meta-row">
            <button className="article-detail-page__back" onClick={onGoBack}>
              ← Back to Resources
            </button>
            <div className="article-detail-page__share">
              <a href={SHARE_X} target="_blank" rel="noreferrer" className="article-detail-page__share-btn" aria-label="Share on X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={SHARE_FB} target="_blank" rel="noreferrer" className="article-detail-page__share-btn" aria-label="Share on Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Intro */}
          <div className="article-detail-page__section">
            <h2 className="article-detail-page__section-title">What is it?</h2>
            <p className="article-detail-page__body-text">
              This resource is generated insights on a defined problem (e.g. child nutrition, or school dropout). Segmentation-based research can be either qualitative or quantitative, but at Pathways we have generally used qualitative research leading to segmentation results. This may involve more early theory on what we are trying to achieve, including timeline, and expected products.
            </p>
            <p className="article-detail-page__body-text">
              This phase commonly involves the following steps which are adapted for different projects:
            </p>
            <ul className="article-detail-page__list">
              <li>Agreeing on expected products and partner roles</li>
              <li>Selecting segments of interest</li>
              <li>Assessing suitability of the quantitative dataset</li>
              <li>Generating hypotheses based on segmentation results</li>
              <li>Developing a research or design brief with clear objectives and scope</li>
              <li>Conducting segmentation-based research</li>
              <li>Produce insights follow in the form of slides</li>
            </ul>
          </div>

          {/* Image */}
          <div className="article-detail-page__image-wrap">
            <img src={segmentationImg} alt="Segmentation research diagram" className="article-detail-page__image" />
            <p className="article-detail-page__caption">Caption goes here</p>
          </div>

          {/* FAQ */}
          <div className="article-detail-page__section">
            <h2 className="article-detail-page__section-title">Frequently Asked Questions</h2>
            <ul className="article-detail-page__faq-list">
              {FAQ_ITEMS.map((q, i) => (
                <li key={i} className="article-detail-page__faq-item">{q}</li>
              ))}
            </ul>
          </div>

          {/* Share this article */}
          <div className="article-detail-page__share-footer">
            <span className="article-detail-page__share-label">Share this article</span>
            <div className="article-detail-page__share">
              <a href={SHARE_X} target="_blank" rel="noreferrer" className="article-detail-page__share-btn" aria-label="Share on X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={SHARE_FB} target="_blank" rel="noreferrer" className="article-detail-page__share-btn" aria-label="Share on Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="article-detail-page__tags">
            {TAGS.map(tag => (
              <span key={tag} className="article-detail-page__tag" onClick={() => onNavigate('resources-filtered', tag)}>{tag}</span>
            ))}
          </div>

          {/* Author */}
          <p className="article-detail-page__author">Written by Hallie Goertz</p>

        </div>
      </div>

      {/* Support banner */}
      <div className="article-detail-page__banner">
        <div className="article-detail-page__banner-bg" aria-hidden="true">
          <img src={supportBannerPhoto} alt="" />
          <div className="article-detail-page__banner-overlay" />
        </div>
        <div className="article-detail-page__banner-content">
          <h2 className="article-detail-page__banner-heading">Looking for more support?</h2>
          <p className="article-detail-page__banner-body">
            Our technical assistance team offer tailored support for creating segmentations, analysing data with your team, and facilitating intervention design workshops.
          </p>
          <button className="article-detail-page__banner-btn" onClick={() => onNavigate('contact')}>
            Get in touch
            <ArrowForwardIcon className="article-detail-page__banner-btn-icon" />
          </button>
        </div>
      </div>

      {/* Related articles */}
      <div className="article-detail-page__related-wrap">
        <div className="article-detail-page__related">
          <span className="article-detail-page__related-title">Related articles</span>
          <div className="article-detail-page__related-grid">
            {RELATED.map(a => (
              <div key={a.id} className="article-detail-page__related-card" onClick={() => onNavigate('article-detail')}>
                <div className="article-detail-page__related-image">
                  <img src={placeholderImg} alt="" />
                  <div className="article-detail-page__related-overlay" />
                </div>
                <div className="article-detail-page__related-content">
                  <span className="article-detail-page__related-date">{a.date}</span>
                  <h3 className="article-detail-page__related-card-title">{a.title}</h3>
                  <p className="article-detail-page__related-excerpt">{a.excerpt}</p>
                  <div className="article-detail-page__related-tags">
                    {a.tags.map(tag => <span key={tag} className="article-detail-page__tag" onClick={e => { e.stopPropagation(); onNavigate('resources-filtered', tag); }}>{tag}</span>)}
                  </div>
                  <button className="article-detail-page__read-more" onClick={() => onNavigate('article-detail')}>
                    Read more
                    <ArrowForwardIcon className="article-detail-page__read-more-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="article-detail-page__view-all" onClick={() => onNavigate('resources')}>
            View all
            <ArrowForwardIcon className="article-detail-page__read-more-icon" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
