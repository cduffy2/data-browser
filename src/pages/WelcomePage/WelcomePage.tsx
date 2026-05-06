import { useEffect, useRef, useCallback, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import dataBrowserImg from '../../assets/Header/1/3. Data Browser 1.png';
import placeholderImg from '../../assets/Layout/374/Placeholder Image.png';
import videoPlaceholderImg from '../../assets/VideoPlaceholder.png';
import logoAriadne from '../../assets/Logo/3/Ariadne labs.png';
import logoAgaKhan from '../../assets/Logo/3/Aga-Kahn-University.png';
import logoAISight from '../../assets/Logo/3/AI sight.png';
import logoBluesquare from '../../assets/Logo/3/Bluesquare.png';
import logoCatapult from '../../assets/Logo/3/Catapult.png';
import logoEPHI from '../../assets/Logo/3/Ethiopian Public Health Institute.png';
import logoCISDI from '../../assets/Logo/3/CISDI.png';
import logoDesireLine from '../../assets/Logo/3/DesireLine.png';
import './WelcomePage.css';

const STORAGE_KEY = 'welcome-page-text';

const DEFAULTS: Record<string, string> = {
  'hero-title': 'Forecast with Pathways',
  'hero-description': 'Pathways segmentation data reveals barriers to good health and informs targeted approaches to overcome them.',
  'hero-btn': 'Explore segmentation data',
  'logos-label': 'Since 2019, partners have used Pathways in over 20 projects and 7 countries, with more to come.',
  'features-tagline-data-browser': 'Data browser',
  'features-title-data-browser': 'Explore health outcomes, behaviours, and vulnerabilities by population segment',
  'features-tagline-comparison': 'Comparison tool',
  'features-title-comparison': 'Build a complete picture of your population segments across multiple indicators',
  'features-tagline-segment': 'Segment profile',
  'features-title-segment': 'Qualitative insights and quantitative data, combined in one rich segment profile',
  'features-tagline-typing': 'Typing tool',
  'features-title-typing': 'Quickly assign individuals to the right population segment in the field',
  'video-title': 'Imagining a world where every woman has access to healthcare that specifically meets her needs.',
  'video-description': 'Pathways helps policymakers, donors, analysts, and implementing partners better understand women\'s diverse needs and vulnerabilities to poor health.',
};

function loadText(): Record<string, string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

interface WelcomePageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
}

export function WelcomePage({ currentPage, onNavigate }: WelcomePageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState<Record<string, string>>(loadText);

  useEffect(() => {
    document.title = 'Pathways | Welcome';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = imageRef.current;
      if (!el) return;
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      const rotateY = nx * 6;
      const rotateX = ny * -3;
      el.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = imageRef.current;
    if (el) el.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
  }, []);

  const handleSave = () => {
    const updated: Record<string, string> = {};
    document.querySelectorAll<HTMLElement>('[data-edit-key]').forEach(el => {
      const key = el.dataset.editKey!;
      updated[key] = el.innerText.trim();
    });
    const merged = { ...text, ...updated };
    setText(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setIsEditing(false);
  };

  const handleToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const editable = (key: string) => isEditing ? ({
    contentEditable: true as const,
    suppressContentEditableWarning: true,
    'data-edit-key': key,
  } as React.HTMLAttributes<HTMLElement> & { 'data-edit-key': string }) : ({ 'data-edit-key': key } as React.HTMLAttributes<HTMLElement> & { 'data-edit-key': string });

  const t = (key: string) => text[key] ?? DEFAULTS[key];

  return (
    <div
      className={`welcome-page${isEditing ? ' welcome-page--editing' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="welcome-page__main">

        {/* Hero */}
        <section className="welcome-hero">
          <div className="welcome-hero__col">
            <div className="welcome-hero__content">
              <h1 className="welcome-hero__title" {...editable('hero-title')}>{t('hero-title')}</h1>
              <p className="welcome-hero__description" {...editable('hero-description')}>{t('hero-description')}</p>
            </div>
            <button className="welcome-hero__btn" onClick={() => !isEditing && onNavigate('segmentations')}>
              <span {...editable('hero-btn')}>{t('hero-btn')}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="welcome-hero__image-tilt" ref={imageRef}>
            <div className="welcome-hero__image-border">
              <img
                src={dataBrowserImg}
                alt="Pathways data browser screenshot"
                className="welcome-hero__image"
              />
            </div>
          </div>
        </section>

        {/* Partner logos */}
        <section className="welcome-logos">
          <p className="welcome-logos__label" {...editable('logos-label')}>{t('logos-label')}</p>
          <div className="welcome-logos__track-wrapper">
            <div className="welcome-logos__track">
              {[logoAriadne, logoAgaKhan, logoAISight, logoBluesquare, logoCatapult, logoEPHI, logoCISDI, logoDesireLine,
                logoAriadne, logoAgaKhan, logoAISight, logoBluesquare, logoCatapult, logoEPHI, logoCISDI, logoDesireLine].map((src, i) => (
                <img key={i} src={src} alt="" className="welcome-logos__logo" />
              ))}
            </div>
          </div>
          <div className="welcome-logos__wave">
            <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="welcome-logos__wave-svg">
              <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#FCFCF6" />
            </svg>
          </div>
        </section>

        {/* Feature cards */}
        <section className="welcome-features">
          <div className="welcome-features__row">

            {/* Left: Data browser — tall card */}
            <div className="welcome-features__card welcome-features__card--tall">
              <div className="welcome-features__card-content">
                <div className="welcome-features__card-top">
                  <span className="welcome-features__tagline" {...editable('features-tagline-data-browser')}>{t('features-tagline-data-browser')}</span>
                  <p className="welcome-features__title welcome-features__title--lg" {...editable('features-title-data-browser')}>{t('features-title-data-browser')}</p>
                </div>
                <button className="welcome-features__link" onClick={() => !isEditing && onNavigate('data-browser')}>
                  <span className="welcome-features__link-inner">
                    Get started
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="welcome-features__link-underline" />
                </button>
              </div>
              <div className="welcome-features__card-image welcome-features__card-image--360">
                <img src={placeholderImg} alt="" className="welcome-features__img" />
              </div>
            </div>

            {/* Right: two rows */}
            <div className="welcome-features__col">
              <div className="welcome-features__row welcome-features__row--gap">

                {/* Comparison tool */}
                <div className="welcome-features__card welcome-features__card--small">
                  <div className="welcome-features__card-content welcome-features__card-content--sm">
                    <div className="welcome-features__card-top">
                      <span className="welcome-features__tagline" {...editable('features-tagline-comparison')}>{t('features-tagline-comparison')}</span>
                      <p className="welcome-features__title welcome-features__title--md" {...editable('features-title-comparison')}>{t('features-title-comparison')}</p>
                    </div>
                    <button className="welcome-features__link" onClick={() => !isEditing && onNavigate('compare-segments')}>
                      <span className="welcome-features__link-inner">
                        Get started
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="welcome-features__link-underline" />
                    </button>
                  </div>
                  <div className="welcome-features__card-image welcome-features__card-image--171">
                    <img src={placeholderImg} alt="" className="welcome-features__img" />
                  </div>
                </div>

                {/* Segment profile */}
                <div className="welcome-features__card welcome-features__card--small">
                  <div className="welcome-features__card-content welcome-features__card-content--sm">
                    <div className="welcome-features__card-top">
                      <span className="welcome-features__tagline" {...editable('features-tagline-segment')}>{t('features-tagline-segment')}</span>
                      <p className="welcome-features__title welcome-features__title--md" {...editable('features-title-segment')}>{t('features-title-segment')}</p>
                    </div>
                    <button className="welcome-features__link" onClick={() => !isEditing && onNavigate('rural-4')}>
                      <span className="welcome-features__link-inner">
                        Get started
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="welcome-features__link-underline" />
                    </button>
                  </div>
                  <div className="welcome-features__card-image welcome-features__card-image--171">
                    <img src={placeholderImg} alt="" className="welcome-features__img" />
                  </div>
                </div>

              </div>

              {/* Typing tool */}
              <div className="welcome-features__card welcome-features__card--wide">
                <div className="welcome-features__card-content welcome-features__card-content--sm">
                  <div className="welcome-features__card-top">
                    <span className="welcome-features__tagline" {...editable('features-tagline-typing')}>{t('features-tagline-typing')}</span>
                    <p className="welcome-features__title welcome-features__title--md" {...editable('features-title-typing')}>{t('features-title-typing')}</p>
                  </div>
                  <button className="welcome-features__link" onClick={() => !isEditing && onNavigate('segmentations')}>
                    <span className="welcome-features__link-inner">
                      Get started
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="welcome-features__link-underline" />
                  </button>
                </div>
                <div className="welcome-features__card-image welcome-features__card-image--171">
                  <img src={placeholderImg} alt="" className="welcome-features__img" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Video section */}
        <section className="welcome-video">
          <div className="welcome-video__content">
            <h2 className="welcome-video__title" {...editable('video-title')}>{t('video-title')}</h2>
            <p className="welcome-video__description" {...editable('video-description')}>{t('video-description')}</p>
          </div>
          <div className="welcome-video__lightbox">
            <img src={videoPlaceholderImg} alt="Video preview" className="welcome-video__poster" />
            <div className="welcome-video__overlay" />
            <button className="welcome-video__play" aria-label="Play video">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(30,30,30,0.6)" />
                <path d="M19 15L35 24L19 33V15Z" fill="white" />
              </svg>
            </button>
          </div>
        </section>

      </main>
      <Footer />

      {/* Edit text FAB */}
      <button className={`welcome-edit-fab${isEditing ? ' welcome-edit-fab--active' : ''}`} onClick={handleToggle}>
        {isEditing ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save text
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit text
          </>
        )}
      </button>
    </div>
  );
}
