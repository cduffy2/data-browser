import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import { Checkbox } from '../../components/common/Checkbox/Checkbox';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import placeholderImg from '../../assets/Placeholder Image.png';
import newsImg1 from '../../assets/Content/30/News image 1.png';
import newsImg2 from '../../assets/Content/30/News image 2.png';
import newsImg3 from '../../assets/Content/30/News image 3.png';
import newsImg4 from '../../assets/Content/30/News image 4.png';
import wayForwardImg from '../../assets/Blog Post Header/2/WayForward Image.png';
import newsletterImg from '../../assets/new-images/newsletter-image.png';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import ChevronDownIcon from '../../assets/icons/ChevronDown.svg?react';
import ChevronRightIcon from '../../assets/icons/ChevronRight.svg?react';
import FilterIcon from '../../assets/icons/filter.svg?react';
import WaveIcon from '../../assets/Wave.svg?react';
import './NewsPage.css';

interface NewsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const TAGS = ['Article', 'Community event', 'Case study', 'Newsletter'] as const;
type NewsTag = typeof TAGS[number];

interface NewsArticle {
  id: number;
  date: string;
  title: string;
  excerpt?: string;
  tag: NewsTag;
  image: string;
  // Community events show their event date on the image
  eventDate?: { month: string; day: string; year: string };
}

const PAGE_SIZE = 9;

// Content mirrors withpathways.org/en/blog
const HIGHLIGHTS: NewsArticle[] = [
  {
    id: 1,
    date: 'Sep 23, 2026',
    title: 'Pathways primed to enter its next chapter under the leadership of the African Population and Health Research Center',
    excerpt: 'Since its launch in 2019, Pathways has helped policymakers, donors, analysts, and implementing partners better understand barriers to good health.',
    tag: 'Article',
    image: wayForwardImg,
  },
  { id: 2, date: 'Oct 27, 2026', title: 'Bringing Pathways Data to AI Tools', tag: 'Article', image: newsImg1 },
  { id: 3, date: 'Jul 16, 2026', title: 'How MSI Nigeria and Pathways Co-designed Job Aids to Improve Family Planning Support in Northern Nigeria', tag: 'Article', image: newsImg2 },
];

const UPDATES: NewsArticle[] = [
  { id: 4, date: 'Sep 29, 2026', title: 'Inside Pathways, Issue 9 (September 2026)', excerpt: 'Welcome to Inside Pathways! In this issue, we hope you enjoy reading about the next chapter for Pathways.', tag: 'Newsletter', image: placeholderImg },
  { id: 5, date: 'Aug 11, 2026', title: 'Webinar: Making an Impact: Pathways for Growing Organizations', excerpt: 'The Pathways Community webinar on August 27 featured presenters from MyItura and Thalia.', tag: 'Community event', image: placeholderImg, eventDate: { month: 'August', day: '27', year: '2026' } },
  { id: 6, date: 'Jul 30, 2026', title: 'Inside Pathways, Issue 8 (July 2026)', excerpt: 'Welcome to Inside Pathways! In this issue, we share two Pathways in Practice stories, along with new resources.', tag: 'Newsletter', image: placeholderImg },
  { id: 7, date: 'Jun 17, 2026', title: 'Ensuring Accuracy, Clarity, and Context in Data-to-Narrative Generation with AI', excerpt: 'By combining leading-edge artificial intelligence technology with human expertise, Pathways is making data easier to use.', tag: 'Article', image: newsImg3 },
  { id: 8, date: 'Jun 10, 2026', title: 'Inside Pathways, Issue 7 (June 2026)', excerpt: 'Welcome to Inside Pathways! In this issue, we share a new segmentation, new and improved platform features.', tag: 'Newsletter', image: placeholderImg },
  { id: 9, date: 'Jun 2, 2026', title: 'Project Perspectives: Insights from Pathways for Ethiopia', excerpt: 'Despite Ethiopia’s major gains in improving maternal, child, and adolescent health, deep inequities remain.', tag: 'Article', image: newsImg4 },
  { id: 10, date: 'Apr 28, 2026', title: 'How Jacaranda Health Adapted Pathways Segmentation Tools for Digital Users', excerpt: 'Jacaranda Health applied data science and machine learning to the Pathways typing tool to improve reach.', tag: 'Article', image: placeholderImg },
  { id: 11, date: 'Apr 27, 2026', title: 'Webinar: Pathways Voices: Implementation Experiences in Africa', excerpt: 'This Pathways Community webinar featured partners presentations from Kenya, Nigeria, Senegal, and more.', tag: 'Community event', image: placeholderImg, eventDate: { month: 'May', day: '21', year: '2026' } },
  { id: 12, date: 'Apr 21, 2026', title: 'Inside Pathways, Issue 6 (April 2026)', excerpt: 'Welcome to Inside Pathways! In this issue, we share a new population segmentation, along with new tools.', tag: 'Newsletter', image: placeholderImg },
  // Case studies from the live site; dates are placeholders
  { id: 13, date: 'Mar 18, 2026', title: 'Pathways in Practice: Crossing the Digital Divide to Increase Primary Healthcare Access in Lagos', excerpt: 'How a digital health programme in Lagos used Pathways segments to reach the women most likely to be left behind.', tag: 'Case study', image: placeholderImg },
  { id: 14, date: 'Feb 26, 2026', title: 'Pathways in Practice: Rethinking Family Planning to Reach More Women in Northern Nigeria', excerpt: 'Programme teams in Kano used Pathways data to redesign family planning outreach around women’s lived realities.', tag: 'Case study', image: placeholderImg },
];

function NewsTagPill({ tag }: { tag: NewsTag }) {
  return <span className="news-page__tag">{tag}</span>;
}

function ReadMore({ onClick }: { onClick: () => void }) {
  return (
    <button className="news-page__read-more" onClick={e => { e.stopPropagation(); onClick(); }}>
      Read more <ArrowForwardIcon className="news-page__read-more-icon" />
    </button>
  );
}

function NewsCard({ article, variant, onNavigate }: { article: NewsArticle; variant: 'grid' | 'featured' | 'compact'; onNavigate: (page: Page) => void }) {
  const open = () => onNavigate('news-detail');
  return (
    <div className={`news-page__card news-page__card--${variant}`} onClick={open}>
      <div className="news-page__card-image">
        <img src={article.image} alt="" />
        <div className="news-page__image-overlay" />
        {article.eventDate && (
          <div className="news-page__event-date">
            <span>{article.eventDate.month}</span>
            <span className="news-page__event-day">{article.eventDate.day}</span>
            <span>{article.eventDate.year}</span>
          </div>
        )}
      </div>
      <div className="news-page__card-content">
        <div className="news-page__card-text">
          <div className="news-page__card-meta">
            <NewsTagPill tag={article.tag} />
            <span className="news-page__date">{article.date}</span>
          </div>
          <h3 className="news-page__card-title">{article.title}</h3>
          {article.excerpt && variant !== 'compact' && <p className="news-page__card-excerpt">{article.excerpt}</p>}
        </div>
        <ReadMore onClick={open} />
      </div>
    </div>
  );
}

function FiltersMenu({ applied, onApply }: { applied: NewsTag[]; onApply: (tags: NewsTag[]) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<NewsTag[]>(applied);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const toggle = (tag: NewsTag) =>
    setDraft(d => (d.includes(tag) ? d.filter(t => t !== tag) : [...d, tag]));

  return (
    <div className="news-page__filters" ref={ref}>
      <button
        type="button"
        className={`news-page__filters-btn ${open ? 'news-page__filters-btn--open' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => { setDraft(applied); setOpen(o => !o); }}
      >
        <FilterIcon className="news-page__filters-icon" aria-hidden="true" />
        Filters{applied.length > 0 && ` (${applied.length})`}
        <ChevronDownIcon className="news-page__filters-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="news-page__filters-menu">
          <ul className="news-page__filters-options">
            {TAGS.map(tag => (
              <li key={tag} className="news-page__filters-option" onClick={() => toggle(tag)}>
                <Checkbox checked={draft.includes(tag)} onChange={() => toggle(tag)} />
                {tag}
              </li>
            ))}
          </ul>
          <div className="news-page__filters-actions">
            <button type="button" className="news-page__filters-reset" onClick={() => { setDraft([]); onApply([]); setOpen(false); }}>Reset</button>
            <button type="button" className="news-page__filters-apply" onClick={() => { onApply(draft); setOpen(false); }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <nav className="news-page__pagination" aria-label="Pagination">
      <button type="button" className="news-page__page-arrow news-page__page-arrow--prev" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronRightIcon aria-hidden="true" />
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          className={`news-page__page ${n === page ? 'news-page__page--current' : ''}`}
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button type="button" className="news-page__page-arrow" disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRightIcon aria-hidden="true" />
      </button>
    </nav>
  );
}

export function NewsPage({ currentPage, onNavigate }: NewsPageProps) {
  const [tags, setTags] = useState<NewsTag[]>([]);
  const [page, setPage] = useState(1);
  const updatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Pathways | Blog';
  }, []);

  const filtered = tags.length ? UPDATES.filter(a => tags.includes(a.tag)) : UPDATES;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (n: number) => {
    setPage(n);
    updatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [featured, ...compact] = HIGHLIGHTS;

  return (
    <div className="news-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Header band */}
      <div className="news-page__header-band">
        <span className="news-page__tagline">Blog</span>
        <h1 className="news-page__heading">Stay up to date on Pathways</h1>
        <p className="news-page__subheading">
          Read articles about project activities, learn from case studies, catch up on newsletters, and find webinars and other community events.
        </p>
      </div>
      <div className="news-page__wave">
        <WaveIcon className="news-page__wave-svg" />
      </div>

      <div className="news-page__body">
        <div className="news-page__section">

          {/* Highlights */}
          <section className="news-page__highlights">
            <h2 className="news-page__section-title">Highlights</h2>
            <div className="news-page__featured">
              <NewsCard article={featured} variant="featured" onNavigate={onNavigate} />
              <div className="news-page__featured-stack">
                {compact.map(article => (
                  <NewsCard key={article.id} article={article} variant="compact" onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          </section>

          {/* Latest updates */}
          <section className="news-page__updates" ref={updatesRef}>
            <div className="news-page__updates-header">
              <h2 className="news-page__section-title">Latest updates</h2>
              <FiltersMenu applied={tags} onApply={t => { setTags(t); setPage(1); }} />
            </div>
            <div className="news-page__grid">
              {visible.map(article => (
                <NewsCard key={article.id} article={article} variant="grid" onNavigate={onNavigate} />
              ))}
            </div>
            <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
          </section>

        </div>
      </div>

      {/* Newsletter banner */}
      <section className="welcome-newsletter welcome-newsletter--waved">
        <div className="welcome-newsletter__wave welcome-newsletter__wave--top">
          <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="welcome-newsletter__wave-svg">
            <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#FCFCF6" />
          </svg>
        </div>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
