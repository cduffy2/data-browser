import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import hero2Rural1 from '../../assets/new-images/Hero 2/Rural 1.png';
import hero2ScreenCheck from '../../assets/new-images/Hero 2/Screen+check 1.png';
import hero2ScreenData from '../../assets/new-images/Hero 2/Screen+data 1.png';
import hero2ScreenMap from '../../assets/new-images/Hero 2/Screen+map 1.png';
import hero2Urban from '../../assets/new-images/Hero 2/Urban 1.png';
import hero2PalmTree from '../../assets/new-images/Hero 2/Palm tree.png';
import hero2Woman2 from '../../assets/new-images/Hero 2/Woman 2.png';
import hero2Woman1 from '../../assets/new-images/Hero 2/Woman 1.png';
import hero2Women3 from '../../assets/new-images/Hero 2/Women 3.png';
import hero2Women4 from '../../assets/new-images/Hero 2/Women 4.png';
import placeholderImg from '../../assets/Layout/374/Placeholder Image.png';
import tools1MapImg from '../../assets/new-images/tools1-map.png';
import tools1SegmentProfileImg from '../../assets/new-images/tools1-segment-profile.png';
import tools1TtImg from '../../assets/new-images/tools1-tt.png';
import tools2CtImg from '../../assets/new-images/tools2-ct.png';
import tools2CtSelectionImg from '../../assets/new-images/tools2-ct-selection.png';
import videoPlaceholderImg from '../../assets/new-images/video-image.png';
import segmentationsGif from '../../assets/segmentations.gif';
import newsletterImg from '../../assets/new-images/newsletter-image.png';
import logoAriadne from '../../assets/Logo/Ariadne labs.png';
import logoAgaKhan from '../../assets/Logo/Aga-Kahn-University.png';
import logoAISight from '../../assets/Logo/AI sight.png';
import logoBluesquare from '../../assets/Logo/Bluesquare.png';
import logoCatapult from '../../assets/Logo/Catapult.png';
import logoEPHI from '../../assets/Logo/Ethiopian Public Health Institute.png';
import logoCISDI from '../../assets/Logo/CISDI.png';
import logoDesireLine from '../../assets/Logo/DesireLine.png';
import logoFinalMile from '../../assets/Logo/Final Mile.png';
import logoGates from '../../assets/Logo/Gates_Foundation_Logo 1.png';
import logoIdeas42 from '../../assets/Logo/Ideas42.png';
import logoJacaranda from '../../assets/Logo/JacarandaHealth.png';
import logoPaukwa from '../../assets/Logo/Paukwa.png';
import logoProjectHope from '../../assets/Logo/Project Hope.png';
import logoQuicksand from '../../assets/Logo/Quicksand.png';
import logoVillageReach from '../../assets/Logo/VillageReach.png';
import logoSonder from '../../assets/Logo/Sonder Collective.png';
import logoTwilio from '../../assets/Logo/Twilio.org.png';
import logoSolina from '../../assets/Logo/Solina.png';
import logoTiko from '../../assets/Logo/Tiko.png';
import logoVihara from '../../assets/Logo/Vihara.png';
import logoYux from '../../assets/Logo/Yux.png';
import iconTarget from '../../assets/Layout/497/Target.svg';
import iconSpyglass from '../../assets/Layout/497/Spyglass.svg';
import iconCog from '../../assets/Layout/497/Cog.svg';
import iconForecast from '../../assets/Layout/487/ICON - forecast 1.svg';
import iconResource from '../../assets/Layout/487/ICON - resource 1.svg';
import iconDesign from '../../assets/Layout/487/ICON  - design 1.svg';
import iconEvaluate from '../../assets/Layout/487/ICON - evaluate 1.svg';
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
  const [newsSlide, setNewsSlide] = useState(0);

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
    <div className="welcome-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="welcome-page__main">

        {/* Hero */}
        <section className="welcome-hero welcome-hero--centered">
          <div className="welcome-hero__centered-content">
            <h1 className="welcome-hero__title">
              {'Understand communities.\nBuild health initiatives that deliver.'}
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
            <div className="welcome-hero__scene welcome-hero__scene--2">
              <svg className="welcome-hero__scene-line" viewBox="0 0 1440 529" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path className="welcome-hero__scene-line-path" pathLength="1000" d="M0.227539 158.635C40.4776 143.287 84.6494 123.029 136.746 132.185C194.703 142.373 246.121 198.958 259.383 219.658C303.238 289.064 393.159 370.235 428.971 380.858C450.202 387.153 463.081 386.386 478.045 390.146C493.01 393.906 520.831 398.027 532.272 417.392C543.713 436.758 536.71 459.367 520.964 466.422C502.763 474.583 475.399 466.157 465.322 444.122C454.986 421.52 457.559 396.169 475.886 379.125C502.446 354.422 530.113 343.792 547.141 334.644C568.372 323.232 637.321 281.987 682.495 226.05C739.641 155.288 847.756 50.5273 888.183 29.068C920.147 12.0981 948.801 -1.32597 1015.15 0.878199C1094.39 3.50993 1131.51 55.9898 1141.63 85.5581C1147.93 103.958 1149.94 123.7 1147.46 160.691C1144.97 197.683 1132.47 256.65 1116.25 285.319C1097.37 318.699 1073.3 337.121 1050.85 369.026C1028.4 400.931 1034.38 454.509 1050.85 480.067C1075.05 517.627 1132.12 532.156 1183.08 526.244C1193.78 525.006 1204.96 523.436 1216.63 519.425C1246.52 509.142 1277.72 478.18 1293.83 449.799C1312.05 417.694 1366.65 331.105 1439.91 341.028" stroke="black" strokeWidth="1.27532" strokeMiterlimit="10" strokeDasharray="1000" strokeDashoffset="1000"/>
              </svg>
              <div className="hero-layer hero-bg">
                <img src={hero2Urban}    alt="" className="welcome-hero__scene-img" style={{ left: `${17.3/1440*100}%`,   top: `${28.4/420*100}%`,  width: `${219.975/1440*100}%` }} />
                <img src={hero2PalmTree} alt="" className="welcome-hero__scene-img" style={{ left: `${165.41/1440*100}%`, top: `${44/420*100}%`,    width: `${52.363/1440*100}%` }} />
                <img src={hero2Rural1}   alt="" className="welcome-hero__scene-img" style={{ left: `${1237/1440*100}%`,   top: `${6/420*100}%`,     width: `${191.878/1440*100}%` }} />
                <img src={hero2ScreenMap}   alt="" className="welcome-hero__scene-img" style={{ left: `${209.9/1440*100}%`, top: `${216/420*100}%`, width: `${226.9/1440*100}%` }} />
                <img src={hero2Women4}   alt="" className="welcome-hero__scene-img" style={{ left: `${108/1440*100}%`,    top: `${118/420*100}%`,   width: `${309.547/1440*100}%` }} />
                <div className="welcome-hero__scene-img" style={{ left: `${968/1440*100}%`, top: `${6/420*100}%`, width: `${268.724/1440*100}%`, position: 'absolute', background: '#f3f3e6' }}>
                  <img src={hero2Women3} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
              <div className="hero-layer hero-mg">
                <img src={hero2ScreenData}  alt="" className="welcome-hero__scene-img" style={{ left: `${864/1440*100}%`,   top: `${200/420*100}%`,  width: `${231.3/1440*100}%` }} />
                <img src={hero2ScreenCheck} alt="" className="welcome-hero__scene-img" style={{ left: `${1183/1440*100}%`,  top: `${209/420*100}%`,  width: `${226.551/1440*100}%` }} />
              </div>
              <div className="hero-layer hero-fg">
                <img src={hero2Woman2} alt="" className="welcome-hero__scene-img" style={{ left: `${534.62/1440*100}%`, top: `${28/420*100}%`, width: `${175.592/1440*100}%` }} />
                <img src={hero2Woman1} alt="" className="welcome-hero__scene-img" style={{ left: `${717.86/1440*100}%`, top: `${28/420*100}%`, width: `${131.129/1440*100}%` }} />
              </div>
            </div>
            <div className="welcome-hero__logos-strip">
              <p className="welcome-logos__label">Since 2019, partners have used Pathways in over 20 projects and 7 countries, with more to come.</p>
              <div className="welcome-logos__grid">
                {[
                  logoAriadne, logoAgaKhan, logoAISight, logoCatapult, logoEPHI,
                  logoCISDI, logoDesireLine, logoFinalMile, logoIdeas42, logoJacaranda,
                  logoPaukwa, logoProjectHope, logoQuicksand, logoVillageReach, logoSolina,
                  logoTiko, logoVihara, logoYux,
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="welcome-logos__logo" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Video — below hero */}
        <section className="welcome-video">
          <div className="welcome-video__content">
            <h2 className="welcome-video__title">Imagining a world where every woman has access to healthcare that specifically meets her needs</h2>
            <p className="welcome-video__description">Pathways helps policymakers, donors, analysts, and implementing partners better understand women's diverse needs and vulnerabilities to poor health.</p>
          </div>
          <div className="welcome-video__lightbox">
            <img src={videoPlaceholderImg} alt="Video preview" className="welcome-video__poster" />
            <button className="welcome-video__play" aria-label="Play video">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="36" fill="#1e1e1b" />
                <path d="M29 22L52 36L29 50V22Z" fill="white" />
              </svg>
            </button>
          </div>
        </section>

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
            <h2 className="welcome-tools__title">Deepening analysis with interactive tools</h2>
            <div className="welcome-tools__header-right">
              <p className="welcome-tools__body">The intuitive platform makes it simple to compare geographies instantly, visualise and explore health outcomes and vulnerability factors in depth, and quickly extract insights from segmentation data—all with functionality designed to inform evidence-based decision-making.</p>
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
                { icon: iconTarget,   title: 'Tackle health inequities',                body: 'Take action to address the disproportionate burden of disease experienced by women and children.' },
                { icon: iconSpyglass, title: 'Deepen insights into population segments', body: 'Better understand the unique needs and circumstances of distinct groups with a community.' },
                { icon: iconCog,      title: 'Drive integrated health systems',          body: 'Move beyond siloed approaches and fragmented data to integrated health strategies, programmes, and interventions.' },
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
          <p className="welcome-stakeholders__label">Pathways is supported by a wide range of global stakeholders.</p>
          <div className="welcome-stakeholders__four">
            <img src={logoBluesquare} alt="Bluesquare" className="welcome-stakeholders__four-logo" />
            <img src={logoGates}      alt="Gates Foundation" className="welcome-stakeholders__four-logo" />
            <img src={logoSonder}     alt="Sonder Collective" className="welcome-stakeholders__four-logo" />
            <img src={logoTwilio}     alt="Twilio.org" className="welcome-stakeholders__four-logo" />
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
