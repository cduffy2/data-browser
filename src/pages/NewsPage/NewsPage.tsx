import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import placeholderImg from '../../assets/Placeholder Image.png';
import newsletterImg from '../../assets/Newsletter-Image.png';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import WaveIcon from '../../assets/Wave.svg?react';
import './NewsPage.css';

interface NewsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

type NewsTag = 'Article' | 'Event';

interface NewsArticle {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  tag: NewsTag;
}


const LATEST_ARTICLES: NewsArticle[] = [
  {
    id: 3,
    date: '11 Mar 2024',
    title: 'How Pathways is being used in Kenya to improve health outcomes',
    excerpt: 'Field teams in Kenya are using Pathways segmentation data to design targeted health interventions.',
    tag: 'Article',
  },
  {
    id: 4,
    date: '4 Mar 2024',
    title: 'Pathways at the Gates Foundation annual convening',
    excerpt: 'Our team presented findings from the latest round of segmentation research at the Gates Foundation annual meeting.',
    tag: 'Event',
  },
  {
    id: 5,
    date: '22 Feb 2024',
    title: 'New data browser features released',
    excerpt: 'A major update to the Pathways data browser brings new filtering and comparison capabilities.',
    tag: 'Article',
  },
  {
    id: 6,
    date: '15 Feb 2024',
    title: 'Understanding vulnerability among urban women in Ethiopia',
    excerpt: 'New analysis reveals key vulnerability patterns among urban populations in Addis Ababa and surrounding areas.',
    tag: 'Article',
  },
  {
    id: 7,
    date: '8 Feb 2024',
    title: 'Sonder Collective joins global health data partnership',
    excerpt: 'Pathways creator Sonder Collective has joined a new global partnership focused on open health data standards.',
    tag: 'Article',
  },
  {
    id: 8,
    date: '1 Feb 2024',
    title: 'Webinar: Using segmentation data for programme design',
    excerpt: 'Join our upcoming webinar to learn how programme teams are using Pathways data to design more effective interventions.',
    tag: 'Event',
  },
];

const POST_BANNER_ARTICLES: NewsArticle[] = [
  {
    id: 9,
    date: '25 Jan 2024',
    title: 'Pathways reaches 1,000 active users across five countries',
    excerpt: 'A milestone for the platform as adoption grows among researchers, programme designers, and decision-makers.',
    tag: 'Article',
  },
  {
    id: 10,
    date: '18 Jan 2024',
    title: 'New case study: Reducing maternal mortality in Northern Nigeria',
    excerpt: 'How a state-level programme used Pathways segmentation to prioritise the most vulnerable women for targeted interventions.',
    tag: 'Article',
  },
  {
    id: 11,
    date: '11 Jan 2024',
    title: 'Global Health Forum 2024 — Pathways session recap',
    excerpt: 'A summary of our session at the Global Health Forum, where we presented evidence on data-driven approaches to vulnerability segmentation.',
    tag: 'Event',
  },
];

function NewsTag({ tag }: { tag: NewsTag }) {
  return <span className="news-page__tag">{tag}</span>;
}


function NewsCardGrid({ article, onNavigate }: { article: NewsArticle; onNavigate: (page: Page) => void }) {
  return (
    <div className="news-page__card-grid" onClick={() => onNavigate('article-detail')}>
      <div className="news-page__card-grid-image">
        <img src={placeholderImg} alt="" />
        <div className="news-page__image-overlay" />
      </div>
      <div className="news-page__card-grid-content">
        <div className="news-page__card-meta">
          <NewsTag tag={article.tag} />
          <span className="news-page__date">{article.date}</span>
        </div>
        <h3 className="news-page__card-grid-title">{article.title}</h3>
        <p className="news-page__card-grid-excerpt">{article.excerpt}</p>
        <button className="news-page__read-more" onClick={e => { e.stopPropagation(); onNavigate('article-detail'); }}>
          Read more <ArrowForwardIcon className="news-page__read-more-icon" />
        </button>
      </div>
    </div>
  );
}

export function NewsPage({ currentPage, onNavigate }: NewsPageProps) {
  useEffect(() => {
    document.title = 'Pathways | News';
  }, []);

  return (
    <div className="news-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Header band */}
      <div className="news-page__header-band">
        <span className="news-page__tagline">News</span>
        <h1 className="news-page__heading">Stay up-to-date on<br />Pathways news and events</h1>
      </div>
      <div className="news-page__wave">
        <WaveIcon className="news-page__wave-svg" />
      </div>

      <div className="news-page__body">
        <div className="news-page__section">

          {/* Latest articles */}
          <div className="news-page__section-header">
            <h2 className="news-page__section-title">Latest articles</h2>
          </div>

          <div className="news-page__grid">
            {LATEST_ARTICLES.map(article => (
              <NewsCardGrid key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>

        </div>
      </div>

      {/* Newsletter banner */}
      <section className="welcome-newsletter">
        <div className="welcome-newsletter__card">
          <div className="welcome-newsletter__col">
            <div className="welcome-newsletter__content">
              <h2 className="welcome-newsletter__title">Join our community to stay informed on all things Pathways</h2>
              <p className="welcome-newsletter__body">Receive news, updates, and event invitations delivered directly to your inbox.</p>
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

      {/* Post-banner articles */}
      <div className="news-page__body">
        <div className="news-page__section">
          <div className="news-page__grid">
            {POST_BANNER_ARTICLES.map(article => (
              <NewsCardGrid key={article.id} article={article} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
