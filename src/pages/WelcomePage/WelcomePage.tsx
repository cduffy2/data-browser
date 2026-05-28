import { useEffect, useRef, useState, useCallback } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import heroLine2 from '../../assets/new-images/Hero1/Line 2.png';
import heroWomenSil1 from '../../assets/new-images/Hero1/Women silohette 1.png';
import heroBinoculars from '../../assets/new-images/Hero1/Binoculars 1.png';
import heroMap from '../../assets/new-images/Hero1/map 1.png';
import heroWomanChild from '../../assets/new-images/Hero1/Woman+Child 1.png';
import heroCentralWoman from '../../assets/new-images/Hero1/Central woman.png';
import heroData from '../../assets/new-images/Hero1/Data.png';
import heroSpyglass from '../../assets/new-images/Hero1/Spyglass.png';
import heroWomanPurple from '../../assets/new-images/Hero1/Woman in purple.png';
import heroChecklist from '../../assets/new-images/Hero1/Checklist.png';
import heroPencil from '../../assets/new-images/Hero1/Pencil.png';
import heroWomenSil2 from '../../assets/new-images/Hero1/Women silohette 2.png';
import dataBrowserImg from '../../assets/Header/1/3. Data Browser 1.png';
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

interface WelcomePageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
}

export function WelcomePage({ currentPage, onNavigate }: WelcomePageProps) {
  const parallaxRafRef = useRef<number | null>(null);
  const tools1TrRef = useRef<HTMLDivElement>(null);
  const tools1BlRef = useRef<HTMLDivElement>(null);
  const tools2TlRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [newsSlide, setNewsSlide] = useState(0);
  const [heroVersion, setHeroVersion] = useState<1 | 2 | 3>(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselLeaving, setCarouselLeaving] = useState(false);

  const CAROUSEL_PHRASES = [
    'Forecast impact',
    'Resource priorities',
    'Design initiatives',
    'Evaluate results',
  ];

  useEffect(() => {
    if (heroVersion !== 2) return;
    const cycle = setInterval(() => {
      setCarouselLeaving(true);
      setTimeout(() => {
        setCarouselIndex(i => (i + 1) % CAROUSEL_PHRASES.length);
        setCarouselLeaving(false);
      }, 350);
    }, 2400);
    return () => clearInterval(cycle);
  }, [heroVersion]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (heroVersion !== 3) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = imageRef.current;
      if (!el) return;
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      el.style.transform = `perspective(1200px) rotateY(${nx * 6}deg) rotateX(${ny * -3}deg)`;
    });
  }, [heroVersion]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = imageRef.current;
    if (el) el.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
  }, []);

  useEffect(() => {
    document.title = 'Pathways | Welcome';
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

  return (
    <div className="welcome-page" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="welcome-page__main">

        {/* Hero */}
        {heroVersion === 1 ? (
          <section className="welcome-hero welcome-hero--centered">
            <div className="welcome-hero__versions">
              {([1, 2, 3] as const).map(v => (
                <button
                  key={v}
                  className={`welcome-hero__version-btn${heroVersion === v ? ' welcome-hero__version-btn--active' : ''}`}
                  onClick={() => setHeroVersion(v)}
                >
                  Version {v}
                </button>
              ))}
            </div>
            <div className="welcome-hero__centered-content">
              <h1 className="welcome-hero__title">
                Understand communities.{'\n'}Build health initiatives that deliver.
              </h1>
              <p className="welcome-hero__description">Pathways segmentation data reveals barriers to good health and informs targeted approaches to overcome them.</p>
              <button className="welcome-hero__btn" onClick={() => onNavigate('segmentations')}>
                <span>Explore segmentation data</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="welcome-hero__full-image">
              <div className="welcome-hero__scene">

                <img src={heroLine2}        alt="" className="welcome-hero__scene-img" style={{ left: '0%',      top: '0%',     width: '100%',    height: `${343/419*100}%` }} />
                <img src={heroWomenSil1}    alt="" className="welcome-hero__scene-img" style={{ left: `${86/1440*100}%`,    top: `${9.8/419*100}%`,   width: `${147/1440*100}%` }} />
                <img src={heroBinoculars}   alt="" className="welcome-hero__scene-img" style={{ left: `${197.5/1440*100}%`, top: `${192/419*100}%`,   width: `${93.1/1440*100}%`, zIndex: 1 }} />
                <img src={heroMap}          alt="" className="welcome-hero__scene-img" style={{ left: `${244/1440*100}%`,   top: `${237/419*100}%`,   width: `${188.7/1440*100}%` }} />
                <img src={heroWomanChild}   alt="" className="welcome-hero__scene-img" style={{ left: `${458.2/1440*100}%`,top: `${46.4/419*100}%`,  width: `${101.5/1440*100}%` }} />
                <img src={heroCentralWoman} alt="" className="welcome-hero__scene-img" style={{ left: `${603/1440*100}%`,  top: `${58/419*100}%`,    width: `${121.9/1440*100}%` }} />
                <img src={heroData}         alt="" className="welcome-hero__scene-img" style={{ left: `${736/1440*100}%`,  top: `${93/419*100}%`,    width: `${173.2/1440*100}%` }} />
                <img src={heroSpyglass}     alt="" className="welcome-hero__scene-img" style={{ left: `${833/1440*100}%`,  top: `${216/419*100}%`,   width: `${89/1440*100}%` }} />
                <img src={heroWomanPurple}  alt="" className="welcome-hero__scene-img" style={{ left: `${1051/1440*100}%`, top: `${155/419*100}%`,   width: `${84.4/1440*100}%`, zIndex: 2 }} />
                <img src={heroChecklist}    alt="" className="welcome-hero__scene-img" style={{ left: `${1068.4/1440*100}%`,top: `${10/419*100}%`,  width: `${157.3/1440*100}%` }} />
                <img src={heroPencil}       alt="" className="welcome-hero__scene-img" style={{ left: `${1210/1440*100}%`, top: `${41/419*100}%`,    width: `${80/1440*100}%` }} />
                <img src={heroWomenSil2}    alt="" className="welcome-hero__scene-img" style={{ left: `${1157.6/1440*100}%`,top:`${145/419*100}%`,   width: `${169.1/1440*100}%` }} />
              </div>
              <div className="welcome-hero__logos-strip">
                <p className="welcome-logos__label">Since 2019, partners have used Pathways in over 20 projects and 7 countries, with more to come.</p>
                <div className="welcome-logos__track-wrapper">
                  <div className="welcome-logos__track">
                    {[logoAriadne, logoAgaKhan, logoAISight, logoBluesquare, logoCatapult, logoEPHI, logoCISDI, logoDesireLine,
                      logoAriadne, logoAgaKhan, logoAISight, logoBluesquare, logoCatapult, logoEPHI, logoCISDI, logoDesireLine].map((src, i) => (
                      <img key={i} src={src} alt="" className="welcome-logos__logo" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="welcome-hero">
            <div className="welcome-hero__col">
              <div className="welcome-hero__content">
                <h1 className={`welcome-hero__title${heroVersion === 2 ? ' welcome-hero__title--nowrap' : ''}`}>
                  {heroVersion === 2 && (
                    <>
                      <span
                        key={carouselIndex}
                        className={`welcome-hero__carousel-phrase${carouselLeaving ? ' welcome-hero__carousel-phrase--leaving' : ' welcome-hero__carousel-phrase--entering'}`}
                      >
                        {CAROUSEL_PHRASES[carouselIndex]}
                      </span>
                      {' with Pathways'}
                    </>
                  )}
                  {heroVersion === 3 && 'Understand communities.\nBuild health initiatives that deliver.'}
                </h1>
                <p className="welcome-hero__description">Pathways segmentation data reveals barriers to good health and informs targeted approaches to overcome them.</p>
              </div>
              <button className="welcome-hero__btn" onClick={() => onNavigate('segmentations')}>
                <span>Explore segmentation data</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="welcome-hero__versions">
              {([1, 2, 3] as const).map(v => (
                <button
                  key={v}
                  className={`welcome-hero__version-btn${heroVersion === v ? ' welcome-hero__version-btn--active' : ''}`}
                  onClick={() => setHeroVersion(v)}
                >
                  Version {v}
                </button>
              ))}
            </div>

            {heroVersion === 3 ? (
              <div className="welcome-hero__image-tilt" ref={imageRef}>
                <div className="welcome-hero__image-border">
                  <img src={dataBrowserImg} alt="Pathways data browser screenshot" className="welcome-hero__image" />
                </div>
              </div>
            ) : null}
          </section>
        )}

        {/* Partner logos wave */}
        <section className="welcome-logos">
          <div className="welcome-logos__wave">
            <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="welcome-logos__wave-svg">
              <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#FCFCF6" />
            </svg>
          </div>
        </section>

        {/* Tools 1 — segment profiles */}
        <section className="welcome-tools">
          <div className="welcome-tools__header">
            <h2 className="welcome-tools__title">Joining quantitative and qualitative data and insights into rich population segment profiles</h2>
            <div className="welcome-tools__header-right">
              <p className="welcome-tools__body">Health programme analysts, policymakers, donors, and implementers use segment profiles to examine and understand risks and trends within a population. Profiles are built using rigorous survey and typing tools and are free to access.</p>
              <button className="welcome-tools__btn" onClick={() => onNavigate('segmentations')}>
                <span>Explore segmentation data</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="welcome-tools__images welcome-tools__images--1">
            <div className="welcome-tools__img-frame">
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
          </div>
        </section>

        {/* Tools 2 — analysis tools */}
        <section className="welcome-tools">
          <div className="welcome-tools__header">
            <h2 className="welcome-tools__title">Deepening analysis with easy-to-use tools</h2>
            <div className="welcome-tools__header-right">
              <p className="welcome-tools__body">The intuitive platform makes it simple to compare regions instantly, explore health outcomes and vulnerability factors in depth, and quickly extract insights from segmentation data—all with functionality designed for real-world decision-making.</p>
              <button className="welcome-tools__btn" onClick={() => onNavigate('data-browser')}>
                <span>Explore segmentation data</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="welcome-tools__images welcome-tools__images--2">
            <div className="welcome-tools__img-frame">
              <div className="welcome-tools__img-main">
                <img src={tools2CtImg} alt="" className="welcome-tools__img welcome-tools__img--fit" />
              </div>
              <div className="welcome-tools__img-tl" ref={tools2TlRef}>
                <img src={tools2CtSelectionImg} alt="" className="welcome-tools__img welcome-tools__img--fit" />
              </div>
            </div>
          </div>
        </section>

        {/* Video section */}
        <section className="welcome-video">
          <div className="welcome-video__content">
            <h2 className="welcome-video__title">Imagining a world where every woman has access to healthcare that specifically meets her needs.</h2>
            <p className="welcome-video__description">Pathways helps policymakers, donors, analysts, and implementing partners better understand women's diverse needs and vulnerabilities to poor health.</p>
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
          <h2 className="welcome-pillars__title">Providing value across all stages of a project and levels of a health system</h2>
          <div className="welcome-pillars__cols">
            {([
              { icon: iconForecast, title: 'Forecast', body: ' expected impact with greater precision' },
              { icon: iconResource, title: 'Resource', body: ' more effectively to reach target communities' },
              { icon: iconDesign,   title: 'Design',   body: ' for the unique needs of specific population segments' },
              { icon: iconEvaluate, title: 'Evaluate', body: ' actual impact against a known baseline' },
            ] as const).map(({ icon, title, body }) => (
              <div key={title} className="welcome-pillars__col">
                <img src={icon} alt="" className="welcome-pillars__icon" />
                <p className="welcome-pillars__text">
                  <strong className="welcome-pillars__text-bold">{title}</strong>
                  <span className="welcome-pillars__text-body">{body}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Approach section */}
        <section className="welcome-approach">
          <div className="welcome-approach__content">
            <div className="welcome-approach__text">
              <h2 className="welcome-approach__title">Taking a vulnerability approach to population segmentation</h2>
              <p className="welcome-approach__description">Pathways uses a set of quantitative methods to cluster or segment households into groups based on social, economic, cultural, and environmental factors. Additional qualitative research and analyses are applied to further explore vulnerability or risk factors and health outcomes experienced by specific population segments.</p>
            </div>
            <div className="welcome-approach__items">
              {([
                { icon: iconTarget,   title: 'Tackling health inequities',            body: 'Take action to address the disproportionate burden of disease experienced by women and children.' },
                { icon: iconSpyglass, title: 'Deep insights into population segments', body: 'Better understand the unique needs and circumstances of distinct groups with a community.' },
                { icon: iconCog,      title: 'Driving integrated health systems',      body: 'Move beyond siloed approaches and fragmented data to integrated health strategies, programmes, and interventions.' },
              ] as const).map(({ icon, title, body }) => (
                <div key={title} className="welcome-approach__item">
                  <div className="welcome-approach__item-icon">
                    <img src={icon} alt="" width="32" height="32" />
                  </div>
                  <div className="welcome-approach__item-text">
                    <h3 className="welcome-approach__item-title">{title}</h3>
                    <p className="welcome-approach__item-body">{body}</p>
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
          <p className="welcome-stakeholders__label">Pathways is supported by a wide range of global stakeholders</p>
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
                  <span className="welcome-news__tagline">News</span>
                  <h2 className="welcome-news__title">Stay up-to-date on Pathways news and events</h2>
                </div>
                <button className="welcome-news__view-all" onClick={() => onNavigate('news')}>
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
          <div className="welcome-newsletter__wave welcome-newsletter__wave--bottom">
            <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="welcome-newsletter__wave-svg">
              <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#FCFCF6" />
            </svg>
          </div>
        </section>

        {/* Case studies */}
        <section className="welcome-cases">
          <div className="welcome-cases__header">
            <span className="welcome-cases__tagline">Case studies</span>
            <h2 className="welcome-cases__title">Discover how Pathways is being used to improve health around the world</h2>
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
    </div>
  );
}
