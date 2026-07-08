import { useEffect, useState, useRef } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import articleImg from '../../assets/new-images/newsletter-image.png';
import ChevronUpIcon from '../../assets/icons/Chevron-Up.svg?react';
import './GuideArticlePage.css';

interface GuideArticlePageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface NavChild {
  id: string;
  label: string;
}

interface NavSection {
  id: string;
  label: string;
  children: NavChild[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'understand',
    label: 'Understand Pathways',
    children: [
      { id: 'overview', label: 'Overview' },
      { id: 'what-is', label: 'What is Pathways' },
      { id: 'why-different', label: 'Why is Pathways different' },
      { id: 'approach', label: 'The Pathways approach' },
      { id: 'segmentation', label: 'How segmentation work' },
      { id: 'applying-work', label: 'Applying Pathways in your work' },
      { id: 'why-trust', label: 'Why trust Pathways' },
      { id: 'community', label: 'The Pathways community' },
      { id: 'framework', label: 'Pathways conceptual framework' },
      { id: 'came-to-be', label: 'How Pathways came to be' },
    ],
  },
  {
    id: 'creating',
    label: 'Creating a segmentation',
    children: [],
  },
  {
    id: 'applying',
    label: 'Using Pathways in your work',
    children: [],
  },
];

interface ContentSection {
  id: string;
  heading: string;
  body: string;
}

const ARTICLE_SECTIONS: ContentSection[] = [
  {
    id: 'who-it-serves',
    heading: 'Who it serves',
    body: 'Pathways provides data, insights, tools and technical assistance to donors, governments, bilateral and multilateral partners and implementation organisations.',
  },
  {
    id: 'core-approach',
    heading: 'The core approach',
    body: "At its core, Pathways identifies at-risk population groups across a variety of health outcomes based on social, environmental, economic and cultural factors that make some groups more vulnerable than others. By stratifying populations into segments defined by multidimensional vulnerability profiles, Pathways creates a woman-centred picture of health that reveals not only who is at risk, but also why, enabling better strategies to consider the complexity of women's lives in improving maternal and child health.",
  },
  {
    id: 'platform',
    heading: 'The platform',
    body: 'The Pathways Platform contains ready to use data for several geographies. In addition there are tools, guidance and resources to help users apply the available data to their work or to develop new segmentation solutions in new geographies.',
  },
  {
    id: 'applications',
    heading: 'Practical applications',
    body: 'With the help of the population representative data on health vulnerabilities, organisations can forecast potential impact of a strategy or intervention, adapt resources more effectively to reach target communities, design for the unique needs of specific population segments and evaluate actual impact against a known baseline.',
  },
  {
    id: 'methodology',
    heading: 'The methodology',
    body: 'The process Pathways uses for developing and using segmentation data has been documented as a methodological approach.',
  },
  {
    id: 'origins',
    heading: 'Origins and expansion',
    body: 'The Pathways Approach was developed as a result of a research and innovation project running from 2019 to 2026, with original data collection in Kenya and India. Since then, the approach has expanded significantly.',
  },
];

const ANCHOR_LINKS = [
  { id: 'article-top', label: 'What is Pathways' },
  ...ARTICLE_SECTIONS.map(s => ({ id: s.id, label: s.heading })),
];

export function GuideArticlePage({ currentPage, onNavigate }: GuideArticlePageProps) {
  const [expandedSection, setExpandedSection] = useState<string>('understand');
  const [activeChild, setActiveChild] = useState<string>('what-is');
  const [activeAnchor, setActiveAnchor] = useState<string>('article-top');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    document.title = 'Pathways | What is Pathways';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveAnchor(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    const els = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToAnchor = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? '' : id);
  };

  return (
    <div className="guide-article-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="guide-article-page__body">
        {/* Left nav */}
        <nav className="guide-article-page__leftnav">
          {NAV_SECTIONS.map(section => (
            <div key={section.id} className="guide-article-page__nav-section">
              <button
                className={`guide-article-page__nav-parent${expandedSection === section.id ? ' guide-article-page__nav-parent--expanded' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <ChevronUpIcon
                  className={`guide-article-page__nav-chevron${expandedSection === section.id ? ' guide-article-page__nav-chevron--open' : ''}`}
                />
                <span>{section.label}</span>
              </button>

              {expandedSection === section.id && section.children.length > 0 && (
                <ul className="guide-article-page__nav-children">
                  {section.children.map(child => (
                    <li key={child.id}>
                      <button
                        className={`guide-article-page__nav-child${activeChild === child.id ? ' guide-article-page__nav-child--active' : ''}`}
                        onClick={() => setActiveChild(child.id)}
                      >
                        <span className="guide-article-page__nav-dot" />
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* Main content */}
        <div className="guide-article-page__main" ref={contentRef}>
          <div className="guide-article-page__content">
            <h1
              id="article-top"
              className="guide-article-page__title"
              ref={el => { sectionRefs.current['article-top'] = el; }}
            >
              What is Pathways
            </h1>

            <p className="guide-article-page__lead">
              Pathways is a{' '}
              <strong className="guide-article-page__lead-em">design-oriented analytical framework</strong>
              {' '}that strengthens the design of equity-driven solutions in reproductive, maternal, child health and nutrition. It combines a vulnerability lens, data-driven population segmentation, and human-centred design into a coherent process that moves from knowing where health inequities exist to designing solutions that address them.
            </p>

            {ARTICLE_SECTIONS.map((section, i) => (
              <div
                key={section.id}
                className="guide-article-page__section"
              >
                {i === 1 && (
                  <div className="guide-article-page__image-block">
                    <img src={articleImg} alt="" className="guide-article-page__image" />
                    <div className="guide-article-page__image-caption">
                      <div className="guide-article-page__image-caption-bar" />
                      <p>Walk in Her Shoes display. Copyright: Gates Archive/Brien Otieno</p>
                    </div>
                  </div>
                )}
                <h2
                  id={section.id}
                  className="guide-article-page__section-heading"
                  ref={el => { sectionRefs.current[section.id] = el; }}
                >
                  {section.heading}
                </h2>
                <p className="guide-article-page__section-body">{section.body}</p>
              </div>
            ))}
          </div>

          {/* Right anchor links */}
          <aside className="guide-article-page__anchors">
            <p className="guide-article-page__anchors-label">On this page</p>
            {ANCHOR_LINKS.map(link => (
              <button
                key={link.id}
                className={`guide-article-page__anchor-link${activeAnchor === link.id ? ' guide-article-page__anchor-link--active' : ''}`}
                onClick={() => scrollToAnchor(link.id)}
              >
                {link.label}
              </button>
            ))}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
