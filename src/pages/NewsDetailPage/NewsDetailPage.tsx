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

      {/* Hero */}
      <div className="news-detail-page__hero">
        <img src={wayForwardImg} alt="" className="news-detail-page__hero-img" />
      </div>

      {/* Article body */}
      <div className="news-detail-page__body">
        <div className="news-detail-page__container">

          {/* Back + share */}
          <div className="news-detail-page__meta-row">
            <button className="news-detail-page__back" onClick={onGoBack}>← Back to News</button>
            <div className="news-detail-page__share">
              <a href={SHARE_X} target="_blank" rel="noreferrer" className="news-detail-page__share-btn" aria-label="Share on X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={SHARE_FB} target="_blank" rel="noreferrer" className="news-detail-page__share-btn" aria-label="Share on Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Article header */}
          <div className="news-detail-page__article-header">
            <div className="news-detail-page__article-meta">
              <span className="news-detail-page__tag">Event</span>
              <span className="news-detail-page__date">24 Apr 2024</span>
            </div>
            <h1 className="news-detail-page__title">Pathways WayForward: Connecting Community to Shape the Future of Global Health</h1>
          </div>

          {/* Body text */}
          <div className="news-detail-page__section">
            <p className="news-detail-page__body-text">
              Last April, Pathways brought community together at WayForward 2024–3, a vibrant gathering designed to foster connection, celebrate achievements, and align on strategy to help us maximise impact and transform the future of global health.
            </p>
            <p className="news-detail-page__body-text">
              The event took place over two days and was attended by Pathways users, contributors, developers, and supporters from around the world — including representatives from the Gates Foundation, Sonder Collective, and partner organisations across Sub-Saharan Africa and South Asia.
            </p>
          </div>

          {/* Image 1 */}
          <div className="news-detail-page__image-wrap">
            <img src={newsImg1} alt="WayForward 2024 attendees" className="news-detail-page__image" />
            <p className="news-detail-page__caption">© Gates Archive/Brian Otieno — WayForward 2024 community gathering</p>
          </div>

          {/* What's next section */}
          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">What's next?</h2>
            <p className="news-detail-page__body-text">
              The Pathways team is focused on deepening the platform's reach across new geographies. Following the success of the Kenya rollout, programme teams in Nigeria, Ethiopia, and India are preparing to begin using Pathways segmentation data in their programme design cycles.
            </p>
            <p className="news-detail-page__body-text">
              Several new features are also in development, including improved filtering and comparison tools, deeper integration with partner data systems, and expanded vulnerability domain coverage.
            </p>
          </div>

          {/* Pathways Summary section */}
          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Pathways Summary</h2>
            <p className="news-detail-page__body-text">
              Pathways is a data platform developed by <a href="#" className="news-detail-page__link">Sonder Collective</a> and supported by the <a href="#" className="news-detail-page__link">Gates Foundation</a>, designed to help programme teams understand and respond to vulnerability among women and girls. The platform provides segmentation data, vulnerability profiles, and analytical tools to support evidence-based programme design.
            </p>
          </div>

          {/* Image 2 */}
          <div className="news-detail-page__image-wrap">
            <img src={newsImg2} alt="Pathways session at WayForward" className="news-detail-page__image" />
            <p className="news-detail-page__caption">© Gates Archive/Brian Otieno</p>
          </div>

          {/* Black Lab section */}
          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Black Lab</h2>
            <p className="news-detail-page__body-text">
              One of the highlights of WayForward was the Black Lab session — a hands-on workshop where participants worked directly with Pathways data to explore real-world programme design challenges. Teams from Kenya, Nigeria, and Ethiopia used the platform's segmentation tools to identify the most vulnerable women in their target geographies and develop targeted intervention strategies.
            </p>
            <p className="news-detail-page__body-text">
              Participants noted that the session helped them understand not just how to use the platform, but how to translate data insights into actionable programme decisions.
            </p>
          </div>

          {/* Image 3 */}
          <div className="news-detail-page__image-wrap">
            <img src={newsImg3} alt="Black Lab workshop session" className="news-detail-page__image" />
            <p className="news-detail-page__caption">© Gates Archive/Brian Otieno</p>
          </div>

          {/* Sharing the WayForward section */}
          <div className="news-detail-page__section">
            <h2 className="news-detail-page__section-title">Sharing the WayForward</h2>
            <p className="news-detail-page__body-text">
              A key theme throughout the event was the importance of community and shared learning. Participants were encouraged to take what they had learned back to their teams and share it broadly — helping to build a culture of data-driven programme design across the global health community.
            </p>
            <p className="news-detail-page__body-text">
              The Pathways team will be sharing a full summary of the event, including presentations, session recordings, and key insights, in the coming weeks. Follow us on <a href="#" className="news-detail-page__link">pathways.sondercollective.com</a> to stay up to date.
            </p>
          </div>

          {/* Image 4 */}
          <div className="news-detail-page__image-wrap">
            <img src={newsImg4} alt="WayForward community gathering" className="news-detail-page__image" />
            <p className="news-detail-page__caption">© Gates Archive/Brian Otieno</p>
          </div>

          {/* Share footer */}
          <div className="news-detail-page__share-footer">
            <span className="news-detail-page__share-label">Share this article</span>
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
