import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import placeholderImg from '../../assets/Placeholder Image.png';
import understandingDataImg from '../../assets/understanding-data-image-1.png';
import howOrganisedImg from '../../assets/how-pathways-data-is-organised.png';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import ArrowRightSmallIcon from '../../assets/icons/Arrow-Right.svg?react';
import WaveIcon from '../../assets/Wave.svg?react';
import './ResourcesPage.css';

interface ResourcesPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string) => void;
}

const EXPLAINERS = [
  {
    id: 'understanding-data',
    image: understandingDataImg,
    title: 'Understanding Pathways data',
    body: 'Read about how Pathways segments are created and the foundational data concepts that underpin Pathways.',
    page: 'methodology-explainer' as Page,
  },
  {
    id: 'how-organised',
    image: howOrganisedImg,
    title: 'How Pathways data is organised',
    body: 'Learn how Pathways data is structured: the vulnerability factors that define segments, and the health outcomes used to compare them.',
    page: 'how-pathways-data' as Page,
  },
  {
    id: 'mcp-server',
    image: placeholderImg,
    title: 'Pathways MCP server',
    body: 'Read about how Pathways segments are created and the foundational data concepts that underpin Pathways.',
    page: 'methodology-explainer' as Page,
  },
];

const GUIDE_CARDS = [
  {
    id: 'understand',
    title: 'Understand Pathways',
    body: 'Explore the methodology, evidence base, and principles behind Pathways segmentation',
    page: 'guide-article' as Page,
  },
  {
    id: 'creating',
    title: 'Creating a segmentation',
    body: 'Learn how to build a segmentation for a new geography using population data and the Pathways approach.',
    page: null,
  },
  {
    id: 'research',
    title: 'Segmentation-based research',
    body: 'Understand how to conduct and interpret research using Pathways segments.',
    page: null,
  },
  {
    id: 'applying',
    title: 'Applying Pathways',
    body: 'Find practical guidance on using Pathways data and insights in programme design, advocacy, and decision-making.',
    page: null,
  },
];

export function ResourcesPage({ currentPage, onNavigate }: ResourcesPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Resources';
  }, []);

  return (
    <div className="resources-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Hero */}
      <div className="resources-page__hero">
        <h1 className="resources-page__hero-title">Pathways resources</h1>
        <p className="resources-page__hero-subtitle">
          Guides, tools, and methodology references to help you understand and apply Pathways segmentation in your work.
        </p>
      </div>
      <div className="resources-page__wave">
        <WaveIcon className="resources-page__wave-svg" />
      </div>

      {/* Interactive explainers */}
      <section className="resources-page__explainers">
        <div className="resources-page__explainers-inner">
          <div className="resources-page__section-header">
            <h2 className="resources-page__section-title">Interactive explainers</h2>
            <p className="resources-page__section-subtitle">
              Guided explainers covering data foundations, segment logic, and integration patterns.
            </p>
          </div>
          <div className="resources-page__explainers-grid">
            {EXPLAINERS.map(item => (
              <div key={item.id} className="resources-page__explainer-card" onClick={() => onNavigate(item.page)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onNavigate(item.page)}>
                <div className="resources-page__explainer-image">
                  <img src={item.image} alt="" />
                  <div className="resources-page__explainer-image-overlay" />
                </div>
                <div className="resources-page__explainer-content">
                  <div className="resources-page__explainer-text">
                    <h3 className="resources-page__explainer-title">{item.title}</h3>
                    <p className="resources-page__explainer-body">{item.body}</p>
                  </div>
                  <button
                    className="resources-page__explainer-btn"
                    onClick={e => { e.stopPropagation(); onNavigate(item.page); }}
                  >
                    Read more
                    <ArrowForwardIcon className="resources-page__explainer-btn-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides and documentation */}
      <section className="resources-page__guides">
        <div className="resources-page__guides-inner">
          <div className="resources-page__section-header">
            <h2 className="resources-page__section-title">Guides and documentation</h2>
            <p className="resources-page__section-subtitle">
              Choose a topic to explore articles, methodology notes, and practical guidance.
            </p>
          </div>
          <div className="resources-page__guides-grid">
            {GUIDE_CARDS.map(card => (
              <div
                key={card.id}
                className="resources-page__guide-card"
                onClick={() => card.page && onNavigate(card.page)}
                role={card.page ? 'button' : undefined}
                tabIndex={card.page ? 0 : undefined}
                onKeyDown={e => e.key === 'Enter' && card.page && onNavigate(card.page)}
              >
                <div className="resources-page__guide-text">
                  <h3 className="resources-page__guide-title">{card.title}</h3>
                  <p className="resources-page__guide-body">{card.body}</p>
                </div>
                <button className="resources-page__guide-link" onClick={e => { e.stopPropagation(); card.page && onNavigate(card.page); }}>
                  Read more
                  <ArrowRightSmallIcon className="resources-page__guide-link-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
