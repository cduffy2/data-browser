import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import placeholderImg from '../../assets/Placeholder Image.png';
import wayForwardImg from '../../assets/Blog Post Header/2/WayForward Image.png';
import newsImg1 from '../../assets/Content/30/News image 1.png';
import newsImg2 from '../../assets/Content/30/News image 2.png';
import newsImg3 from '../../assets/Content/30/News image 3.png';
import newsImg4 from '../../assets/Content/30/News image 4.png';
import newsletterImg from '../../assets/Newsletter-Image.png';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import ArrowBackIcon from '../../assets/icons/ArrowBackFilled.svg?react';
import './NewsDetailPage.css';

interface NewsDetailPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onGoBack: () => void;
}

const RELATED_ARTICLES = [
  {
    id: 0,
    date: '11 Mar 2024',
    tag: 'Article' as const,
    title: 'Article title goes here, it can be spread over two lines',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.',
    img: placeholderImg,
  },
  {
    id: 1,
    date: '4 Mar 2024',
    tag: 'Event' as const,
    title: 'Article title goes here, it can be spread over two lines',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.',
    img: placeholderImg,
  },
  {
    id: 2,
    date: '22 Feb 2024',
    tag: 'Article' as const,
    title: 'Article title goes here, it can be spread over two lines',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.',
    img: placeholderImg,
  },
];

const SHARE_X = 'https://x.com';
const SHARE_FB = 'https://facebook.com';

export function NewsDetailPage({ currentPage, onNavigate, onGoBack }: NewsDetailPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Pathways WayForward: Connecting Community to Shape the Future of Global Health';
  }, []);

  return (
    <div className="news-detail-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Header */}
      <div className="news-detail-page__header">
        <div className="news-detail-page__header-inner">

          <div className="news-detail-page__header-top">
          {/* Back link */}
          <button className="news-detail-page__back" onClick={onGoBack}>
            <ArrowBackIcon className="news-detail-page__back-icon" />
            All News articles
          </button>

          {/* Title + date widget */}
          <div className="news-detail-page__title-row">
            <h1 className="news-detail-page__title">Pathways WayForward: Connecting Community to Shape the Future of Global Health</h1>
            <div className="news-detail-page__date-widget">
              <span className="news-detail-page__date-day-name">Fri</span>
              <span className="news-detail-page__date-day">09</span>
              <span className="news-detail-page__date-month">Feb 2024</span>
            </div>
          </div>
          </div>{/* end header-top */}

          {/* Hero image */}
          <div className="news-detail-page__hero">
            <img src={wayForwardImg} alt="" className="news-detail-page__hero-img" />
          </div>

          {/* Author + share row */}
          <div className="news-detail-page__byline-row">
            <div className="news-detail-page__byline-cols">
              <div className="news-detail-page__byline-col">
                <span className="news-detail-page__byline-label">Written by</span>
                <span className="news-detail-page__byline-value">Hallie Goertz</span>
              </div>
              <div className="news-detail-page__byline-col">
                <span className="news-detail-page__byline-label">Published on</span>
                <span className="news-detail-page__byline-value">22 January 2021</span>
              </div>
            </div>
            <div className="news-detail-page__share">
              <a href={SHARE_X} target="_blank" rel="noreferrer" className="news-detail-page__share-btn" aria-label="Share on X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={SHARE_FB} target="_blank" rel="noreferrer" className="news-detail-page__share-btn" aria-label="Share on Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Article body */}
      <div className="news-detail-page__body">
        <div className="news-detail-page__container">

          <p className="news-detail-page__body-text news-detail-page__body-text--lg">
            Since 2019, Pathways has been used by partners to inform strategies and design, test, and implement health solutions focused on improving reproductive, maternal, newborn, and child health and nutrition outcomes in seven countries – with more to come.
          </p>

          <p className="news-detail-page__body-text">
            Methodology. Approach. Tools. Insights. Pathways is all these things. But importantly, Pathways is also a vibrant community made up of government representatives, ministerial officials, thought leaders, researchers, and practitioners who are collectively exploring how to narrow the gap between social determinants of health and health outcomes.
          </p>
          <p className="news-detail-page__body-text">
            In November, this community came together in-person for the first time at WayForward 2024, a convening hosted by Sonder Collective and the Gates Foundation, to connect, inspire, and imagine how to better address health inequities. Over 150 members of the Pathways community of changemakers assembled at Shamba, a serene event space just outside of Nairobi, Kenya to participate in hands-on workshops, explore real-world use cases, hear from global health leaders, and gain hands-on expertise with innovative tools.
          </p>

          <div className="news-detail-page__image-wrap">
            <img src={newsImg1} alt="Group activity during WayForward 2024" className="news-detail-page__image" />
            <div className="news-detail-page__caption-figure">
              <div className="news-detail-page__caption-bar" />
              <p className="news-detail-page__caption">Group activity during WayForward 2024. Copyright: Gates Archive/Brien Otieno.</p>
            </div>
          </div>

          <p className="news-detail-page__body-text">Below are just a few highlights from WayForward 2024:</p>

          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Walk in Her Shoes</h2>
            <p className="news-detail-page__body-text">
              Participants took part in an immersive experience, including audio and rich visual components, designed to help better understand the realities of women's lives and how Pathways can be used to tailor solutions to their lived experiences. Following this session, they reflected on how vulnerability shifts over time and is shaped by social connections, cultural expectations and economic pressures.
            </p>
          </div>

          <div className="news-detail-page__image-wrap">
            <img src={newsImg2} alt="Walk in Her Shoes display" className="news-detail-page__image" />
            <div className="news-detail-page__caption-figure">
              <div className="news-detail-page__caption-bar" />
              <p className="news-detail-page__caption">Walk in Her Shoes display. Copyright: Gates Archive/Brien Otieno</p>
            </div>
          </div>

          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Pathways Approach</h2>
            <p className="news-detail-page__body-text">
              Presenters discussed the Pathways <a href="#" className="news-detail-page__link">women-centered vulnerability approach</a> that provides precision through segmentation, including four real world use cases:
            </p>
            <ol className="news-detail-page__list">
              <li>Identifying where, why, and how health outcomes are distributed in a community.</li>
              <li>Designing products and services for unique segments.</li>
              <li>Better understanding the level of effort needed to reach target segments for more effective resourcing.</li>
              <li>Evaluating impact of interventions using segment specific data.</li>
            </ol>
          </div>

          <div className="news-detail-page__image-wrap">
            <img src={newsImg3} alt="Panel discussion during WayForward 2024" className="news-detail-page__image" />
            <div className="news-detail-page__caption-figure">
              <div className="news-detail-page__caption-bar" />
              <p className="news-detail-page__caption">Panel discussion during WayForward 2024. Copyright: Gates Archive/Brien Otieno</p>
            </div>
          </div>

          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">World café</h2>
            <p className="news-detail-page__body-text">
              Community members shared a variety of applications and illustrated impact from <a href="#" className="news-detail-page__link">Pathways projects</a> around the world. Presentations covered many topics including how the Pathways data collection tool is used in Indonesia, how SMS messages can be more effectively targeted to help young mothers in Kenya seek care at key moments during and after pregnancy, and how Pathways was used to refine and implement the Family Planning policy in Senegal.
            </p>
          </div>

          <blockquote className="news-detail-page__blockquote">
            <div className="news-detail-page__blockquote-bar" />
            <p className="news-detail-page__blockquote-text">
              I plan to use the insights from the Pathways report in northern Nigeria to guide the next phase of my work in developing family planning plans. By crafting messages that provide women with relevant, context-specific information, I aim to ensure that these interventions resonate deeply and drive meaningful change." - Dr. Sada Danmusa, Kano State Ministry of Health, Nigeria
            </p>
          </blockquote>

          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Pathways Methods</h2>
            <p className="news-detail-page__body-text">
              Panelists shared how quantitative and qualitative data underlie the Pathways segmentation approach with a deep dive into the <a href="#" className="news-detail-page__link">methods</a> — from principal component analyses to applied behavioral research — that are used to better understand vulnerability factors and build unique segmentation profiles.
            </p>
          </div>

          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Pathways Platform</h2>
            <p className="news-detail-page__body-text">
              Participants also discussed the future of Pathways – including the vision for the soon-to-be launched <a href="#" className="news-detail-page__link">Pathways platform</a> and its 3 components:
            </p>
            <div className="news-detail-page__platform-list">
              <p className="news-detail-page__body-text"><strong>Segment Explorer:</strong> A digital space to explore segments in focus geographies, including data, key insights, actionable findings, recommendations, and existing research.</p>
              <p className="news-detail-page__body-text"><strong>Knowledge Base:</strong> A <a href="#" className="news-detail-page__link">centralized repository</a> of curated materials that make it easier for partners to apply Pathways with consistency and high fidelity, including best practices that have been proven to be impactful.</p>
              <p className="news-detail-page__body-text"><strong>Typing Tool:</strong> The primary way that Pathways is brought into health programming, linking research with program planning and implementation.</p>
            </div>
          </div>

          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Charting the WayForward</h2>
            <p className="news-detail-page__body-text">
              The convening concluded with the Pathways community envisioning the role of Pathways in shaping health equity over the next decade as pragmatic visionaries committed to: building deeper collaboration across communities, harnessing technology as a force for empowerment, supporting environmental and community health together, and creating systems that bend toward resilience.
            </p>
            <p className="news-detail-page__body-text">
              WayForward 2024 illustrated the diversity and commitment of the Pathways community, as well as the strength and value of the Pathways approach. By working together to find new ways to better address the social complexities that impact health outcomes we know we can make progress in reaching our ultimate goal of health for all.
            </p>
          </div>

          <div className="news-detail-page__image-wrap">
            <img src={newsImg4} alt="Participants at WayForward 2024" className="news-detail-page__image" />
            <div className="news-detail-page__caption-figure">
              <div className="news-detail-page__caption-bar" />
              <p className="news-detail-page__caption">Participants at WayForward 2024. Copyright: Gates Archive/Brien Otieno</p>
            </div>
          </div>

          <p className="news-detail-page__body-text">
            For more information please email: <a href="mailto:contact@projectpathways.org" className="news-detail-page__link">contact@projectpathways.org</a>
          </p>

          {/* Share footer */}
          <div className="news-detail-page__share-footer">
            <span className="news-detail-page__share-label">Share this post</span>
            <div className="news-detail-page__share">
              <a href={SHARE_X} target="_blank" rel="noreferrer" className="news-detail-page__share-btn" aria-label="Share on X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={SHARE_FB} target="_blank" rel="noreferrer" className="news-detail-page__share-btn" aria-label="Share on Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          <p className="news-detail-page__author">Written by Hallie Goertz</p>

        </div>
      </div>

      {/* Newsletter banner */}
      <section className="welcome-newsletter">
        <div className="welcome-newsletter__card">
          <div className="welcome-newsletter__col">
            <div className="welcome-newsletter__content">
              <h2 className="welcome-newsletter__title">Join our community to get more involved with Pathways</h2>
              <p className="welcome-newsletter__body">The Pathways Community is made up of Pathways users, contributors, developers, and supporters around the world.</p>
            </div>
            <button className="welcome-newsletter__btn" onClick={() => onNavigate('contact')}>
              <span>Join the Pathways Community</span>
            </button>
          </div>
          <div className="welcome-newsletter__image">
            <img src={newsletterImg} alt="" className="welcome-newsletter__img" />
            <div className="welcome-newsletter__overlay" />
            <div className="welcome-newsletter__fade" />
            <p className="welcome-newsletter__credit">© Gates Archive/Brian Otieno</p>
          </div>
        </div>
      </section>

      {/* Related articles */}
      <div className="news-detail-page__related-wrap">
        <div className="news-detail-page__related">
          <span className="news-detail-page__related-label">More news</span>
          <div className="news-detail-page__related-grid">
            {RELATED_ARTICLES.map(article => (
              <div key={article.id} className="news-detail-page__related-card" onClick={() => onNavigate('news-detail')}>
                <div className="news-detail-page__related-image">
                  <img src={article.img} alt="" />
                  <div className="news-detail-page__related-overlay" />
                </div>
                <div className="news-detail-page__related-content">
                  <div className="news-detail-page__related-meta">
                    <span className="news-detail-page__tag">{article.tag}</span>
                    <span className="news-detail-page__date">{article.date}</span>
                  </div>
                  <h3 className="news-detail-page__related-title">{article.title}</h3>
                  <p className="news-detail-page__related-excerpt">{article.excerpt}</p>
                  <button className="news-detail-page__read-more" onClick={e => { e.stopPropagation(); onNavigate('news-detail'); }}>
                    Read more <ArrowForwardIcon className="news-detail-page__read-more-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="news-detail-page__view-all" onClick={() => onNavigate('news')}>
            View all <ArrowForwardIcon className="news-detail-page__read-more-icon" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
