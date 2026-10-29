import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import understandingDataImg from '../../assets/understanding-data-image-1.png';
import howOrganisedImg from '../../assets/how-pathways-data-is-organised.png';
import typingToolsImg from '../../assets/typing-tools/typing-tools.png';
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
    title: 'Pathways segmentation process',
    body: 'Discover how segmentations are created and the foundational data concepts that underpin Pathways.',
    page: 'methodology-explainer' as Page,
  },
  {
    id: 'how-organised',
    image: howOrganisedImg,
    title: 'How Pathways data is organised',
    body: 'Learn how Pathways data is structured: the vulnerability factors that define segments and the health outcomes used to compare them.',
    page: 'how-pathways-data' as Page,
  },
  {
    id: 'typing-tools',
    image: typingToolsImg,
    title: 'Pathways typing tools',
    body: "Explore how Pathways typing tools 'type', or place an individual into a Pathways segment, using a statistical model.",
    page: 'typing-tools' as Page,
  },
];

const GUIDE_CARDS = [
  {
    id: 'what-is',
    title: 'What is Pathways?',
    body: 'Learn more about Pathways, our history, and our vulnerability-based approach to population segmentation.',
    page: 'guide-article' as Page,
    navSection: 'understand',
  },
  {
    id: 'vulnerability',
    title: 'Understanding vulnerability',
    body: 'Discover what vulnerability means in Pathways and how vulnerability factors are organised to be actionable.',
    page: 'guide-article' as Page,
    navSection: 'understand',
  },
  {
    id: 'using',
    title: 'Using Pathways in your work',
    body: 'Explore how you can use Pathways data in your work and what tools are available to support you.',
    page: 'guide-article' as Page,
    navSection: 'applying',
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
          Understand the Pathways methodology and apply segmentation in your work.
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
              Quick guides to Pathways data and tools
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
            <h2 className="resources-page__section-title">Documentation</h2>
            <p className="resources-page__section-subtitle">
              Deep-dive into important concepts that define Pathways
            </p>
          </div>
          <div className="resources-page__guides-grid">
            {GUIDE_CARDS.map(card => (
              <div
                key={card.id}
                className="resources-page__guide-card"
                onClick={() => card.page && onNavigate(card.page, card.navSection ?? undefined)}
                role={card.page ? 'button' : undefined}
                tabIndex={card.page ? 0 : undefined}
                onKeyDown={e => e.key === 'Enter' && card.page && onNavigate(card.page, card.navSection ?? undefined)}
              >
                <div className="resources-page__guide-text">
                  <h3 className="resources-page__guide-title">{card.title}</h3>
                  <p className="resources-page__guide-body">{card.body}</p>
                </div>
                <button className="resources-page__guide-link" onClick={e => { e.stopPropagation(); card.page && onNavigate(card.page, card.navSection ?? undefined); }}>
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
