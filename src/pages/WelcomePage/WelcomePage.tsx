import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import heroImg from '../../assets/new-images/hero-image.png';
import placeholderImg from '../../assets/Layout/374/Placeholder Image.png';
import tools1MapImg from '../../assets/new-images/tools1-map.png';
import tools1SegmentProfileImg from '../../assets/new-images/tools1-segment-profile.png';
import tools1TtImg from '../../assets/new-images/tools1-tt.png';
import tools2CtImg from '../../assets/new-images/tools2-ct.png';
import tools2CtSelectionImg from '../../assets/new-images/tools2-ct-selection.png';
import videoPlaceholderImg from '../../assets/new-images/video-image.png';
import segmentationsGif from '../../assets/segmentations.gif';
import newsletterImg from '../../assets/new-images/newsletter-image.png';
import logo1Ariadne from '../../assets/Logo/1/Ariadne labs.png';
import logo1AgaKhan from '../../assets/Logo/1/Aga-Kahn-University.png';
import logo1AISight from '../../assets/Logo/1/AI sight.png';
import logo1Bluesquare from '../../assets/Logo/1/Bluesquare.png';
import logo1Catapult from '../../assets/Logo/1/Catapult.png';
import logo1EPHI from '../../assets/Logo/1/Ethiopian Public Health Institute.png';
import logo1CISDI from '../../assets/Logo/1/CISDI.png';
import logo1DesireLine from '../../assets/Logo/1/DesireLine.png';
import logo1FinalMile from '../../assets/Logo/1/Final Mile.png';
import logo1Gates from '../../assets/Logo/1/Gates_Foundation_Logo 1.png';
import logo1Ideas42 from '../../assets/Logo/1/Ideas42.png';
import logo1Jacaranda from '../../assets/Logo/1/JacarandaHealth.png';
import logo1Paukwa from '../../assets/Logo/1/Paukwa.png';
import logo1ProjectHope from '../../assets/Logo/1/Project Hope.png';
import logo1Quicksand from '../../assets/Logo/1/Quicksand.png';
import logo1VillageReach from '../../assets/Logo/1/VillageReach.png';
import logo1Sonder from '../../assets/Logo/1/Sonder Collective.png';
import logo1Solina from '../../assets/Logo/1/Solina.png';
import logo1Tiko from '../../assets/Logo/1/Tiko.png';
import logo1Vihara from '../../assets/Logo/1/Vihara.png';
import logo1Yux from '../../assets/Logo/1/Yux.png';
import iconTarget from '../../assets/Layout/497/Target.svg';
import iconSpyglass from '../../assets/Layout/497/Spyglass.svg';
import iconCog from '../../assets/Layout/497/Cog.svg';
import iconForecast from '../../assets/Layout/487/ICON - forecast 1.svg';
import iconResource from '../../assets/Layout/487/ICON - resource 1.svg';
import iconDesign from '../../assets/Layout/487/ICON  - design 1.svg';
import iconEvaluate from '../../assets/Layout/487/ICON - evaluate 1.svg';
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
  'tools1-title': 'Joining quantitative and qualitative data and insights into rich population segment profiles',
  'tools1-body': 'Health programme analysts, policymakers, donors, and implementers use segment profiles to examine and understand risks and trends within a population. Profiles are built using rigorous survey and typing tools and are free to access.',
  'tools1-btn': 'Explore segmentation data',
  'tools2-title': 'Deepening analysis with easy-to-use tools',
  'tools2-body': 'The intuitive platform makes it simple to compare regions instantly, explore health outcomes and vulnerability factors in depth, and quickly extract insights from segmentation data—all with functionality designed for real-world decision-making.',
  'tools2-btn': 'Explore segmentation data',
  'video-title': 'Imagining a world where every woman has access to healthcare that specifically meets her needs.',
  'video-description': 'Pathways helps policymakers, donors, analysts, and implementing partners better understand women\'s diverse needs and vulnerabilities to poor health.',
  'case-studies-tagline': 'Case studies',
  'case-studies-title': 'Discover how Pathways is being used to improve health around the world',
  'newsletter-title': 'Join our community to stay informed on all things Pathways',
  'newsletter-body': 'Receive news, updates, and event invitations delivered directly to your inbox.',
  'newsletter-btn': 'Join the Pathways Community',
  'news-tagline': 'News',
  'news-title': 'Stay up-to-date on Pathways news and events',
  'stakeholders-label': 'Pathways is supported by a wide range of global stakeholders',
  'approach-title': 'Taking a vulnerability approach to population segmentation',
  'approach-description': 'Pathways uses a set of quantitative methods to cluster or segment households into groups based on social, economic, cultural, and environmental factors. Additional qualitative research and analyses are applied to further explore vulnerability or risk factors and health outcomes experienced by specific population segments.',
  'approach-item1-title': 'Tackling health inequities',
  'approach-item1-body': 'Take action to address the disproportionate burden of disease experienced by women and children.',
  'approach-item2-title': 'Deep insights into population segments',
  'approach-item2-body': 'Better understand the unique needs and circumstances of distinct groups with a community.',
  'approach-item3-title': 'Driving integrated health systems',
  'approach-item3-body': 'Move beyond siloed approaches and fragmented data to integrated health strategies, programmes, and interventions.',
  'pillars-title': 'Providing value across all stages of a project and levels of a health system',
  'pillars-title-forecast': 'Forecast',
  'pillars-body-forecast': ' expected impact with greater precision',
  'pillars-title-resource': 'Resource',
  'pillars-body-resource': ' more effectively to reach target communities',
  'pillars-title-design': 'Design',
  'pillars-body-design': ' for the unique needs of specific population segments',
  'pillars-title-evaluate': 'Evaluate',
  'pillars-body-evaluate': ' actual impact against a known baseline',
};

const GIST_RAW_URL = 'https://gist.githubusercontent.com/cduffy2/349e27c8fec9a5668da4b008998f40b5/raw/pathways-text.json';
const SAVE_API_URL = '/api/save-text';

function loadText(): Record<string, string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function localSavedAt(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    return Number(JSON.parse(stored)._savedAt ?? 0);
  } catch {
    return 0;
  }
}

async function fetchRemoteText(): Promise<Record<string, string>> {
  const res = await fetch(GIST_RAW_URL + '?t=' + Date.now());
  if (!res.ok) throw new Error(`Failed to fetch text (${res.status})`);
  return res.json();
}

async function saveRemoteText(text: Record<string, string>): Promise<void> {
  const res = await fetch(SAVE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(text),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `Save failed (${res.status})`);
  }
}

interface WelcomePageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
}

export function WelcomePage({ currentPage, onNavigate }: WelcomePageProps) {
  const parallaxRafRef = useRef<number | null>(null);
  const tools1TrRef = useRef<HTMLDivElement>(null);
  const tools1BlRef = useRef<HTMLDivElement>(null);
  const tools2TlRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newsSlide, setNewsSlide] = useState(0);
  const [text, setText] = useState<Record<string, string>>(loadText);

  useEffect(() => {
    document.title = 'Pathways | Welcome';
  }, []);

  useEffect(() => {
    fetchRemoteText()
      .then(remote => {
        // Only apply remote if it was saved more recently than local.
        // GitHub's raw Gist URL is CDN-cached and can serve stale content
        // for several minutes after a save, so local wins on ties.
        const remoteSavedAt: number = Number(remote._savedAt ?? 0);
        if (remoteSavedAt > localSavedAt()) {
          const merged = { ...DEFAULTS, ...remote };
          setText(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => {
        // silently fall back to localStorage / DEFAULTS already loaded
      });
  }, []);

  useEffect(() => {
    const targets = [
      { ref: tools1TrRef, speed: 0.12 },
      { ref: tools1BlRef, speed: 0.08 },
      { ref: tools2TlRef, speed: 0.10 },
    ];
    const onScroll = () => {
      if (parallaxRafRef.current) cancelAnimationFrame(parallaxRafRef.current);
      parallaxRafRef.current = requestAnimationFrame(() => {
        targets.forEach(({ ref, speed }) => {
          if (!ref.current) return;
          const rect = ref.current.parentElement!.getBoundingClientRect();
          const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
          ref.current.style.transform = `translateY(${centerOffset * speed}px)`;
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (parallaxRafRef.current) cancelAnimationFrame(parallaxRafRef.current);
    };
  }, []);


  const handleSave = async () => {
    const updated: Record<string, string> = {};
    document.querySelectorAll<HTMLElement>('[data-edit-key]').forEach(el => {
      const key = el.dataset.editKey!;
      updated[key] = el.innerText.trim();
    });
    const merged = { ...text, ...updated, _savedAt: String(Date.now()) };
    setText(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveRemoteText(merged);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not sync to shared prototype. Your changes are saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setSaveError(null);
      setIsEditing(true);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const editable = (key: string) => isEditing ? ({
    contentEditable: true as const,
    suppressContentEditableWarning: true,
    'data-edit-key': key,
    onKeyDown: handleEditKeyDown,
  } as React.HTMLAttributes<HTMLElement> & { 'data-edit-key': string }) : ({ 'data-edit-key': key } as React.HTMLAttributes<HTMLElement> & { 'data-edit-key': string });

  const t = (key: string) => text[key] ?? DEFAULTS[key];

  return (
    <div className={`welcome-page${isEditing ? ' welcome-page--editing' : ''}`}>
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

          <div className="welcome-hero__image-wrap">
            <img
              src={heroImg}
              alt=""
              className="welcome-hero__image"
            />
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

        {/* Tools 1 — segment profiles */}
        <section className="welcome-tools">
          <div className="welcome-tools__header">
            <h2 className="welcome-tools__title" {...editable('tools1-title')}>{t('tools1-title')}</h2>
            <div className="welcome-tools__header-right">
              <p className="welcome-tools__body" {...editable('tools1-body')}>{t('tools1-body')}</p>
              <button className="welcome-tools__btn" onClick={() => !isEditing && onNavigate('segmentations')}>
                <span {...editable('tools1-btn')}>{t('tools1-btn')}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="welcome-tools__images welcome-tools__images--1">
            <div className="welcome-tools__img-main">
              <img src={tools1SegmentProfileImg} alt="" className="welcome-tools__img welcome-tools__img--fit" />
            </div>
            <div className="welcome-tools__img-tr" ref={tools1TrRef}>
              <img src={tools1TtImg} alt="" className="welcome-tools__img welcome-tools__img--fit" />
            </div>
            <div className="welcome-tools__img-bl" ref={tools1BlRef}>
              <img src={tools1MapImg} alt="" className="welcome-tools__img welcome-tools__img--fit" />
            </div>
          </div>
        </section>

        {/* Tools 2 — analysis tools */}
        <section className="welcome-tools">
          <div className="welcome-tools__header">
            <h2 className="welcome-tools__title" {...editable('tools2-title')}>{t('tools2-title')}</h2>
            <div className="welcome-tools__header-right">
              <p className="welcome-tools__body" {...editable('tools2-body')}>{t('tools2-body')}</p>
              <button className="welcome-tools__btn" onClick={() => !isEditing && onNavigate('data-browser')}>
                <span {...editable('tools2-btn')}>{t('tools2-btn')}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="welcome-tools__images welcome-tools__images--2">
            <div className="welcome-tools__img-main">
              <img src={tools2CtImg} alt="" className="welcome-tools__img welcome-tools__img--fit" />
            </div>
            <div className="welcome-tools__img-tl" ref={tools2TlRef}>
              <img src={tools2CtSelectionImg} alt="" className="welcome-tools__img welcome-tools__img--fit" />
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

        {/* Use cases */}
        <section className="welcome-pillars">
          <h2 className="welcome-pillars__title" {...editable('pillars-title')}>
            Providing value across all stages of a project and levels of a health system
          </h2>
          <div className="welcome-pillars__cols">
            {([
              { icon: iconForecast, titleKey: 'pillars-title-forecast', bodyKey: 'pillars-body-forecast' },
              { icon: iconResource, titleKey: 'pillars-title-resource', bodyKey: 'pillars-body-resource' },
              { icon: iconDesign,   titleKey: 'pillars-title-design',   bodyKey: 'pillars-body-design' },
              { icon: iconEvaluate, titleKey: 'pillars-title-evaluate', bodyKey: 'pillars-body-evaluate' },
            ] as const).map(({ icon, titleKey, bodyKey }) => (
              <div key={titleKey} className="welcome-pillars__col">
                <img src={icon} alt="" className="welcome-pillars__icon" />
                <p className="welcome-pillars__text">
                  <strong className="welcome-pillars__text-bold" {...editable(titleKey)}>{t(titleKey)}</strong>
                  <span className="welcome-pillars__text-body" {...editable(bodyKey)}>{t(bodyKey)}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Approach section */}
        <section className="welcome-approach">
          <div className="welcome-approach__content">
            <div className="welcome-approach__text">
              <h2 className="welcome-approach__title" {...editable('approach-title')}>{t('approach-title')}</h2>
              <p className="welcome-approach__description" {...editable('approach-description')}>{t('approach-description')}</p>
            </div>
            <div className="welcome-approach__items">
              {([
                { icon: iconTarget,   titleKey: 'approach-item1-title', bodyKey: 'approach-item1-body' },
                { icon: iconSpyglass, titleKey: 'approach-item2-title', bodyKey: 'approach-item2-body' },
                { icon: iconCog,      titleKey: 'approach-item3-title', bodyKey: 'approach-item3-body' },
              ] as const).map(({ icon, titleKey, bodyKey }) => (
                <div key={titleKey} className="welcome-approach__item">
                  <div className="welcome-approach__item-icon">
                    <img src={icon} alt="" width="32" height="32" />
                  </div>
                  <div className="welcome-approach__item-text">
                    <h3 className="welcome-approach__item-title" {...editable(titleKey)}>{t(titleKey)}</h3>
                    <p className="welcome-approach__item-body" {...editable(bodyKey)}>{t(bodyKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="welcome-approach__image">
            <img src={segmentationsGif} alt="Segmentations illustration" className="welcome-approach__gif" />
          </div>
        </section>

        {/* Stakeholders logos */}
        <section className="welcome-stakeholders">
          <p className="welcome-stakeholders__label" {...editable('stakeholders-label')}>{t('stakeholders-label')}</p>
          <div className="welcome-stakeholders__grid">
            {[
              logo1Ariadne, logo1AgaKhan, logo1AISight, logo1Bluesquare, logo1Catapult,
              logo1EPHI, logo1CISDI, logo1DesireLine, logo1FinalMile, logo1Gates,
              logo1Ideas42, logo1Jacaranda, logo1Paukwa, logo1ProjectHope, logo1Quicksand,
              logo1VillageReach, logo1Sonder, logo1Solina, logo1Tiko, logo1Vihara, logo1Yux,
            ].map((src, i) => (
              <div key={i} className="welcome-stakeholders__logo-wrap">
                <img src={src} alt="" className="welcome-stakeholders__logo" />
              </div>
            ))}
          </div>
        </section>

        {/* News section */}
        {(() => {
          const newsItems = [
            { dateTop: 'October', dateMid: '12–14', dateBot: '2025', date: '11 Mar 2024', title: 'World Health Summit', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
            { dateTop: 'Dec – Jan', dateMid: '31–6', dateBot: '2025 – 2026', date: '11 Mar 2024', title: 'International Conference on Family Planning', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
            { dateTop: '', dateMid: '', dateBot: '', date: '11 Mar 2024', title: 'Article title goes here, it can be spread over two lines', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
            { dateTop: '', dateMid: '', dateBot: '', date: '11 Mar 2024', title: 'Article title goes here, it can be spread over two lines', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
            { dateTop: '', dateMid: '', dateBot: '', date: '11 Mar 2024', title: 'Article title goes here, it can be spread over two lines', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
            { dateTop: '', dateMid: '', dateBot: '', date: '11 Mar 2024', title: 'Article title goes here, it can be spread over two lines', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
          ];
          const totalSlides = newsItems.length - 3;
          return (
            <section className="welcome-news">
              <div className="welcome-news__header">
                <div className="welcome-news__header-text">
                  <span className="welcome-news__tagline" {...editable('news-tagline')}>{t('news-tagline')}</span>
                  <h2 className="welcome-news__title" {...editable('news-title')}>{t('news-title')}</h2>
                </div>
                <button className="welcome-news__view-all" onClick={() => !isEditing && onNavigate('news')}>
                  View all
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="welcome-news__body">
                <div className="welcome-news__track-wrapper">
                  <div
                    className="welcome-news__track"
                    style={{ transform: `translateX(calc(-${newsSlide} * 422px))` }}
                  >
                    {newsItems.map((item, i) => (
                      <div key={i} className="welcome-news__card">
                        <div className="welcome-news__card-image">
                          <img src={placeholderImg} alt="" className="welcome-news__card-img" />
                          {item.dateMid && (
                            <div className="welcome-news__date-badge">
                              <span className="welcome-news__date-top">{item.dateTop}</span>
                              <span className="welcome-news__date-mid">{item.dateMid}</span>
                              <span className="welcome-news__date-bot">{item.dateBot}</span>
                            </div>
                          )}
                        </div>
                        <div className="welcome-news__card-content">
                          <span className="welcome-news__card-date">{item.date}</span>
                          <h3 className="welcome-news__card-title">{item.title}</h3>
                          <p className="welcome-news__card-body">{item.body}</p>
                          <button className="welcome-news__read-more">
                            <span className="welcome-news__read-more-inner">
                              Read more
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span className="welcome-news__read-more-underline" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="welcome-news__controls">
                  <div className="welcome-news__dots">
                    {Array.from({ length: totalSlides + 1 }).map((_, i) => (
                      <button
                        key={i}
                        className={`welcome-news__dot${i === newsSlide ? ' welcome-news__dot--active' : ''}`}
                        onClick={() => setNewsSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="welcome-news__nav">
                    <button
                      className="welcome-news__nav-btn"
                      onClick={() => setNewsSlide(s => Math.max(0, s - 1))}
                      disabled={newsSlide === 0}
                      aria-label="Previous"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      className="welcome-news__nav-btn"
                      onClick={() => setNewsSlide(s => Math.min(totalSlides, s + 1))}
                      disabled={newsSlide === totalSlides}
                      aria-label="Next"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="welcome-news__wave">
                <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="welcome-news__wave-svg">
                  <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#F3F3E6" />
                </svg>
              </div>
            </section>
          );
        })()}

        {/* Newsletter CTA */}
        <section className="welcome-newsletter">
          <div className="welcome-newsletter__col">
            <div className="welcome-newsletter__content">
              <h2 className="welcome-newsletter__title" {...editable('newsletter-title')}>{t('newsletter-title')}</h2>
              <p className="welcome-newsletter__body" {...editable('newsletter-body')}>{t('newsletter-body')}</p>
            </div>
            <button className="welcome-newsletter__btn" onClick={() => !isEditing && onNavigate('contact')}>
              <span {...editable('newsletter-btn')}>{t('newsletter-btn')}</span>
            </button>
          </div>
          <div className="welcome-newsletter__image">
            <img src={newsletterImg} alt="" className="welcome-newsletter__img" />
          </div>
          <div className="welcome-newsletter__wave welcome-newsletter__wave--bottom">
            <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="welcome-newsletter__wave-svg">
              <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#FCFCF6" />
            </svg>
          </div>
        </section>

        {/* Case studies */}
        <section className="welcome-cases">
          <div className="welcome-cases__header">
            <span className="welcome-cases__tagline" {...editable('case-studies-tagline')}>{t('case-studies-tagline')}</span>
            <h2 className="welcome-cases__title" {...editable('case-studies-title')}>{t('case-studies-title')}</h2>
          </div>
          <div className="welcome-cases__grid">
            {[
              { location: 'Lagos, Nigeria', title: 'Ensuring Digital Primary Health Care Solutions Meet the Needs of the Most Vulnerable', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
              { location: 'Kano State, Nigeria', title: 'Developing the Kano State Family Planning 2025 Operating Strategy', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.' },
            ].map((item, i) => (
              <div key={i} className="welcome-cases__card">
                <div className="welcome-cases__card-image">
                  <img src={placeholderImg} alt="" className="welcome-cases__card-img" />
                </div>
                <div className="welcome-cases__card-content">
                  <span className="welcome-cases__card-location">{item.location}</span>
                  <h3 className="welcome-cases__card-title">{item.title}</h3>
                  <p className="welcome-cases__card-body">{item.body}</p>
                  <button className="welcome-cases__read-more">
                    <span className="welcome-cases__read-more-inner">
                      Read more
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#185ea5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="welcome-cases__read-more-underline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />

      {/* Edit text FAB */}
      {saveError && (
        <div className="welcome-save-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {saveError}
          <button className="welcome-save-error__dismiss" onClick={() => setSaveError(null)}>✕</button>
        </div>
      )}
      <button
        className={`welcome-edit-fab${isEditing ? ' welcome-edit-fab--active' : ''}${isSaving ? ' welcome-edit-fab--saving' : ''}`}
        onClick={handleToggle}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="welcome-edit-fab__spinner">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" strokeDasharray="28" strokeDashoffset="10" />
            </svg>
            Saving…
          </>
        ) : isEditing ? (
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
