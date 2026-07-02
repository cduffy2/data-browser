import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import heroBaby from '../../assets/new-images/Hero-Desktop/baby.svg';
import heroBigAfricanWoman from '../../assets/new-images/Hero-Desktop/big african woman blue.png';
import heroBigIndonesianWoman from '../../assets/new-images/Hero-Desktop/big indonesian woman blue.png';
import heroBlueWomanLeft from '../../assets/new-images/Hero-Desktop/blue woman left.svg';
import heroChicken from '../../assets/new-images/Hero-Desktop/chicken.svg';
import heroGroupWomenRight from '../../assets/new-images/Hero-Desktop/group 3 women right.svg';
import heroLightLilacWoman from '../../assets/new-images/Hero-Desktop/light lilac woman left.svg';
import heroMapScreen from '../../assets/new-images/Hero-Desktop/map screen.png';
import heroRedWomanLeft from '../../assets/new-images/Hero-Desktop/red woman left.svg';
import heroRedWomanLeft2 from '../../assets/new-images/Hero-Desktop/red woman left2.svg';
import heroRunningBoy from '../../assets/new-images/Hero-Desktop/running boy.svg';
import heroRuralHouse from '../../assets/new-images/Hero-Desktop/rural house bike tree.svg';
import heroScreenCheck from '../../assets/new-images/Hero-Desktop/screen check.png';
import heroScreenDonut from '../../assets/new-images/Hero-Desktop/screen donut chart.png';
import heroUrbanLeft from '../../assets/new-images/Hero-Desktop/urban environment left.svg';
import heroWomenRightRed from '../../assets/new-images/Hero-Desktop/women right red.svg';
import mobileImage from '../../assets/new-images/Hero-Mobile/Mobile-Image.png';
import mobileLine from '../../assets/new-images/Hero-Mobile/Line-Mobile.svg';
import tabletUrbanLeft from '../../assets/new-images/Hero-Tablet/Asset 111urban environment.svg';
import tabletRuralHouse from '../../assets/new-images/Hero-Tablet/Asset 112 rural environment.svg';
import tabletBlueWomanLeft from '../../assets/new-images/Hero-Tablet/Asset 114woman blue left.svg';
import tabletLilacWomanLeft from '../../assets/new-images/Hero-Tablet/Asset 115woman lilac left.svg';
import tabletRedWomanLeft from '../../assets/new-images/Hero-Tablet/Asset 116woman red left.svg';
import tabletRedWomanLeft2 from '../../assets/new-images/Hero-Tablet/Asset 117woman red left2.svg';
import tabletMapScreen from '../../assets/new-images/Hero-Tablet/Asset 118map screen.png';
import tabletIndonesianWoman from '../../assets/new-images/Hero-Tablet/Asset 119indonesian blue woman.png';
import tabletAfricanWoman from '../../assets/new-images/Hero-Tablet/Asset 120african blue woman.png';
import tabletScreenDonut from '../../assets/new-images/Hero-Tablet/Asset 121screen donut chart.png';
import tabletLilacWomanRight from '../../assets/new-images/Hero-Tablet/Asset 122lilac woman 1 right.svg';
import tabletGroupWomenRight from '../../assets/new-images/Hero-Tablet/Asset 1232 woman blue and lilac right.svg';
import tabletWomenRightRed from '../../assets/new-images/Hero-Tablet/Asset 1242 women red right.svg';
import tabletBaby from '../../assets/new-images/Hero-Tablet/Asset 126baby.svg';
import tabletScreenCheck from '../../assets/new-images/Hero-Tablet/Asset 127screen check.png';
import placeholderImg from '../../assets/Layout/374/Placeholder Image.png';
import tools1MapImg from '../../assets/new-images/tools1-map.png';
import tools1SegmentProfileImg from '../../assets/new-images/tools1-segment-profile.png';
import tools1TtImg from '../../assets/new-images/tools1-tt.png';
import tools2CtImg from '../../assets/new-images/tools2-ct.png';
import tools2CtSelectionImg from '../../assets/new-images/tools2-ct-selection.png';
import videoPlaceholderImg from '../../assets/video-thumbnail.png';
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
import logoVital from '../../assets/Logo/Vital.png';
import logoMaishaMothers from '../../assets/Logo/Header/108/Logo/3/Maisha-Mother-Logo.svg';
import logoMyItura from '../../assets/Logo/Header/108/Logo/3/MyItura-logo.svg';
import logoYux from '../../assets/Logo/Yux.png';
import iconTarget from '../../assets/Layout/497/Target.svg';
import iconSpyglass from '../../assets/Layout/497/Spyglass.svg';
import iconCog from '../../assets/Layout/497/Cog.svg';
import iconForecast from '../../assets/Layout/487/ICON - forecast 1.svg';
import iconResource from '../../assets/Layout/487/ICON - resource 1.svg';
import iconDesign from '../../assets/Layout/487/ICON  - design 1.svg';
import iconEvaluate from '../../assets/Layout/487/ICON - evaluate 1.svg';
import './WelcomePage.css';

const HERO_LINE_PATH = "M.08,64.58c21.57-2.22,53.81-.99,86.36,5.59,62.26,12.59,141.51,77.18,155.91,93.68,35.93,66.71,145.34,120.04,184.24,128.5,23.07,5.02,55.18,1.87,71.43,4.87s46.48,6.28,58.91,21.72c12.43,15.44,10.65,43.98-14.71,53.2-27.99,10.17-53.51-4.21-64.46-21.78-11.23-18.02-1.99-48.34,17.91-61.93,28.85-19.69,40.8-25.63,59.3-32.93,23.07-9.09,97.97-41.97,147.05-86.56,62.09-56.41,154.54-134.26,215.94-154.5,81.54-26.88,165.87-10.13,209.18,15.22,42.2,24.71,72.53,55.52,69.84,85.01-2.69,29.49-6.08,78.66-23.7,101.51-20.52,26.61-46.67,41.29-71.05,66.73-25.36,26.46-17.89,68.15,0,88.52,26.3,29.94,88.29,41.52,143.66,36.81,11.63-.99,23.78-2.24,36.45-5.44,32.47-8.2,66.37-32.88,83.87-55.5,11.84-15.31,37.84-46.18,73.87-66.81";

function HeroLine() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
  }, []);

  return (
    <svg
      className="welcome-hero__scene-line--desktop"
      viewBox="0 0 1440.45 410.01"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: 'absolute', left: 0, top: `${12/422*100}%`, width: '100%', height: 'auto', overflow: 'visible' }}
    >
      <path
        ref={pathRef}
        className="welcome-hero__scene-line-path--desktop"
        d={HERO_LINE_PATH}
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const HERO_LINE_TABLET_PATH = "M.55,159.74c15.64,16.56,28.93,35.51,38.54,56.31,33.18,86.31,134.21,155.31,170.13,166.26,21.3,6.49,50.67,3.73,65.96,6.3,19.16,3.22,42.92,8.13,54.4,28.1,11.48,19.97,9.83,56.91-13.59,68.84-25.85,13.16-49.42-5.45-59.53-28.18-10.37-23.31-1.84-62.54,16.54-80.12,26.64-25.48,37.67-33.16,54.76-42.6,21.3-11.77,90.47-54.31,135.79-112,57.33-72.99,135.87-179.58,192.57-205.77,75.3-34.78,160.01-7.24,199.99,25.56,38.97,31.97,70.22,82.01,69.37,129.45-.68,38.23-10.49,82.32-26.77,111.89-18.95,34.43-43.1,53.43-65.61,86.34-23.42,34.23-16.52,88.17,0,114.53,24.28,38.74,81.53,53.72,132.66,47.63,10.74-1.28,29.55-5.65,41.98-11.3";

function HeroLineTablet() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
  }, []);

  return (
    <svg
      className="welcome-hero__scene-line--tablet"
      viewBox="0 0 1008.06 534.33"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ position: 'absolute', left: 0, top: `${70/604*100}%`, width: '100%', height: `${534.33/604*100}%`, overflow: 'visible' }}
    >
      <path
        ref={pathRef}
        className="welcome-hero__scene-line-path--tablet"
        d={HERO_LINE_TABLET_PATH}
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface WelcomePageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
}

function VideoLightbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button) return;

    const cr = container.getBoundingClientRect();
    const br = button.getBoundingClientRect();

    const btnCx = br.left + br.width / 2;
    const btnCy = br.top + br.height / 2;
    const dist = Math.hypot(e.clientX - btnCx, e.clientY - btnCy);

    // Max influence radius = half the shorter container dimension
    const maxDist = Math.min(cr.width, cr.height) / 2;
    const btnRadius = br.width / 2;

    if (dist <= maxDist) {
      // Normalise: 0 at button centre → 1 at max influence edge
      const t = Math.max(0, (dist - btnRadius) / (maxDist - btnRadius));
      // Scale: 1.25 at centre → 1.05 at edge
      setScale(1.25 - t * 0.2);
    } else {
      setScale(1);
    }
  };

  const handleMouseLeave = () => {
    setScale(1);
    setHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className="welcome-video__lightbox"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={videoPlaceholderImg} alt="Video preview" className="welcome-video__poster" />
      <button
        ref={buttonRef}
        className="welcome-video__play"
        aria-label="Play video"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ transform: `scale(${scale})`, transition: scale === 1 ? 'transform 0.4s ease' : 'transform 0.1s ease' }}
      >
        <svg width="100" height="105" viewBox="0 0 80 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="welcome-video__play-svg">
          <g filter="url(#play-shadow)">
            <rect x="12" y="4" width="56" height="56" rx="28" fill={hovered ? '#0D0C0C' : '#1F1E1C'} style={{ transition: 'fill 0.15s ease' }} shapeRendering="crispEdges" className="welcome-video__play-circle"/>
            <path d="M36 24.7419V38.7419L47 31.7419L36 24.7419Z" fill="white" className="welcome-video__play-arrow"/>
          </g>
          <defs>
            <filter id="play-shadow" x="0" y="0" width="80" height="84" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow"/>
              <feOffset dy="12"/>
              <feGaussianBlur stdDeviation="8"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0.08 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect2_dropShadow"/>
              <feOffset dy="2"/>
              <feGaussianBlur stdDeviation="4"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0 0.0823529 0 0 0 0.08 0"/>
              <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape"/>
            </filter>
          </defs>
        </svg>
      </button>
    </div>
  );
}

export function WelcomePage({ currentPage, onNavigate }: WelcomePageProps) {
  const parallaxRafRef = useRef<number | null>(null);
  const tools1TrRef = useRef<HTMLDivElement>(null);
  const tools1BlRef = useRef<HTMLDivElement>(null);
  const tools2TlRef = useRef<HTMLDivElement>(null);
  const [newsSlide, setNewsSlide] = useState(0);
  const waveBorder = true;

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
              <span>Explore segmentations by country</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="welcome-hero__full-image">
            <div className="welcome-hero__scene welcome-hero__scene--desktop">
              {/* Positions from Figma node 1197-7677, canvas 1440×422 */}
              {/* Background — silhouettes, cityscape */}
              <div className="hero-layer hero-bg">
                <img src={heroUrbanLeft}       alt="" className="welcome-hero__scene-img" style={{ left: 0,                      top: `${2/422*100}%`,   width: `${217.74/1440*100}%` }} />
                <img src={heroRuralHouse}      alt="" className="welcome-hero__scene-img" style={{ right: 0,                     top: `${3/422*100}%`,   width: `${11.42/100*100}%` }} />
                <img src={heroChicken}         alt="" className="welcome-hero__scene-img" style={{ left: `${1396/1440*100}%`,    top: `${162/422*100}%`, width: `${34.23/1440*100}%` }} />
                <img src={heroRunningBoy}      alt="" className="welcome-hero__scene-img" style={{ left: `${88/1440*100}%`,      top: `${141/422*100}%`, width: `${40/1440*100}%` }} />
              </div>
              {/* Line — drawn in on top of cityscape, behind midground */}
              <HeroLine />
              {/* Midground — screens and smaller figures */}
              <div className="hero-layer hero-mg">
                <img src={heroGroupWomenRight} alt="" className="welcome-hero__scene-img" style={{ left: `${1169/1440*100}%`,    top: `${85/422*100}%`,  width: `${128.12/1440*100}%` }} />
                <img src={heroScreenDonut}     alt="" className="welcome-hero__scene-img" style={{ left: `${914/1440*100}%`,    top: `${1/422*100}%`,   width: `${221.5/1440*100}%` }} />
                <img src={heroScreenCheck}     alt="" className="welcome-hero__scene-img" style={{ left: `${67.55/100*100}%`,   top: `${217/422*100}%`, width: `${229/1440*100}%` }} />
                <img src={heroMapScreen}       alt="" className="welcome-hero__scene-img" style={{ left: `${15.9/100*100}%`,    top: `${217/422*100}%`, width: `${229/1440*100}%` }} />
                <img src={heroLightLilacWoman} alt="" className="welcome-hero__scene-img" style={{ left: `${198/1440*100}%`,    top: `${100/422*100}%`, width: `${79.29/1440*100}%` }} />
                <img src={heroRedWomanLeft}    alt="" className="welcome-hero__scene-img" style={{ left: `${299/1440*100}%`,    top: `${64/422*100}%`,  width: `${70/1440*100}%` }} />
                <img src={heroRedWomanLeft2}   alt="" className="welcome-hero__scene-img" style={{ left: `${374/1440*100}%`,    top: `${94/422*100}%`,  width: `${65/1440*100}%` }} />
                <img src={heroBlueWomanLeft}   alt="" className="welcome-hero__scene-img" style={{ left: `${130/1440*100}%`,    top: `${149/422*100}%`, width: `${73.79/1440*100}%` }} />
                <img src={heroWomenRightRed}   alt="" className="welcome-hero__scene-img" style={{ right: `${34/1440*100}%`,    top: `${147/422*100}%`, width: `${110.31/1440*100}%` }} />
                <img src={heroBaby}            alt="" className="welcome-hero__scene-img" style={{ left: `${1274/1440*100}%`,   top: `${337/422*100}%`, width: `${60.4/1440*100}%` }} />
              </div>
              {/* Foreground — hero figures */}
              <div className="hero-layer hero-fg">
                <img src={heroBigIndonesianWoman} alt="" className="welcome-hero__scene-img" style={{ left: `${557/1440*100}%`, top: `${2/422*100}%`,   width: `${162.5/1440*100}%` }} />
                <img src={heroBigAfricanWoman}    alt="" className="welcome-hero__scene-img" style={{ left: `${727/1440*100}%`, top: `${0/422*100}%`,    width: `${156.5/1440*100}%` }} />
              </div>
            </div>
            {/* ── Tablet scene (641–1007px) — Figma node 1197-7989, canvas 1008×604 ── */}
            <div className="welcome-hero__scene welcome-hero__scene--tablet">
              {/* Background — cityscape, running boy */}
              <div className="hero-layer hero-bg">
                <img src={tabletUrbanLeft}  alt="" className="welcome-hero__scene-img" style={{ left: 0,                    top: `${40/604*100}%`,  width: `${291.64/1008*100}%` }} />
                <img src={tabletRuralHouse} alt="" className="welcome-hero__scene-img" style={{ left: `${813/1008*100}%`,   top: `${30/604*100}%`,  width: `${172.06/1008*100}%` }} />
              </div>
              {/* Line */}
              <HeroLineTablet />
              {/* Midground — smaller figures and screens */}
              <div className="hero-layer hero-mg">
                <img src={tabletBlueWomanLeft}   alt="" className="welcome-hero__scene-img" style={{ left: `${34/1008*100}%`,  top: `${247/604*100}%`, width: `${68.23/1008*100}%` }} />
                <img src={tabletLilacWomanLeft}   alt="" className="welcome-hero__scene-img" style={{ left: `${98/1008*100}%`,  top: `${201/604*100}%`, width: `${73.32/1008*100}%` }} />
                <img src={tabletRedWomanLeft}     alt="" className="welcome-hero__scene-img" style={{ left: `${205/1008*100}%`, top: `${190/604*100}%`, width: `${64.67/1008*100}%` }} />
                <img src={tabletRedWomanLeft2}    alt="" className="welcome-hero__scene-img" style={{ left: `${276/1008*100}%`, top: `${205/604*100}%`, width: `${60/1008*100}%` }} />
                <img src={tabletMapScreen}        alt="" className="welcome-hero__scene-img" style={{ left: `${64/1008*100}%`,  top: `${436/604*100}%`, width: `${210/1008*100}%` }} />
                <img src={tabletScreenDonut}      alt="" className="welcome-hero__scene-img" style={{ left: `${618/1008*100}%`, top: `${15/604*100}%`,  width: `${204.5/1008*100}%` }} />
                <img src={tabletLilacWomanRight}  alt="" className="welcome-hero__scene-img" style={{ left: `${691/1008*100}%`, top: `${240/604*100}%`, width: `${69.46/1008*100}%` }} />
                <img src={tabletGroupWomenRight}  alt="" className="welcome-hero__scene-img" style={{ left: `${760/1008*100}%`, top: `${199/604*100}%`, width: `${88.94/1008*100}%` }} />
                <img src={tabletWomenRightRed}    alt="" className="welcome-hero__scene-img" style={{ left: `${843/1008*100}%`, top: `${236/604*100}%`, width: `${91.83/1008*100}%` }} />
                <img src={tabletBaby}             alt="" className="welcome-hero__scene-img" style={{ left: `${883/1008*100}%`, top: `${439/604*100}%`, width: `${57.64/1008*100}%` }} />
                <img src={tabletScreenCheck}      alt="" className="welcome-hero__scene-img" style={{ left: `${689/1008*100}%`, top: `${461/604*100}%`, width: `${198/1008*100}%` }} />
              </div>
              {/* Foreground — hero figures */}
              <div className="hero-layer hero-fg">
                <img src={tabletIndonesianWoman} alt="" className="welcome-hero__scene-img" style={{ left: `${340/1008*100}%`, top: `${140/604*100}%`, width: `${169.5/1008*100}%` }} />
                <img src={tabletAfricanWoman}    alt="" className="welcome-hero__scene-img" style={{ left: `${505/1008*100}%`, top: `${127/604*100}%`, width: `${162.5/1008*100}%` }} />
              </div>
            </div>
            {/* Mobile scene (≤640px) */}
            <div className="welcome-hero__scene--mobile">
              <img src={mobileLine} alt="" className="welcome-hero__mobile-line" />
              <img src={mobileImage} alt="" className="welcome-hero__mobile-image" />
            </div>
            <div className="welcome-hero__logos-strip">
              <p className="welcome-logos__label">Since 2019, partners have used Pathways in over 20 projects and 7 countries, with more to come.</p>
              <div className="welcome-logos__grid">
                {[
                  logoAriadne, logoAgaKhan, logoAISight, logoCatapult, logoEPHI,
                  logoCISDI, logoDesireLine, logoFinalMile, logoIdeas42, logoJacaranda,
                  logoMaishaMothers, logoMyItura, logoPaukwa, logoProjectHope, logoQuicksand,
                  logoVillageReach, logoSolina, logoTiko, logoVihara, logoVital, logoYux,
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="welcome-logos__logo" />
                ))}
              </div>
            </div>
            {/* Wave transition to video section */}
            <div className="welcome-logos__wave welcome-logos__wave--hero">
              <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="welcome-logos__wave-svg">
                <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#FCFCF6" />
              </svg>
            </div>
          </div>
        </section>

        {/* Video — below hero */}
        <section className="welcome-video">
          <div className="welcome-video__content">
            <h2 className="welcome-video__title">Imagining a world where every woman has access to healthcare that specifically meets her needs</h2>
            <p className="welcome-video__description">Pathways helps policymakers, donors, analysts, and implementing partners better understand women's diverse needs and vulnerabilities to poor health.</p>
          </div>
          <VideoLightbox />
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
        <section className="welcome-tools welcome-tools--pre-pillars">
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
          <svg viewBox="0 0 1440 54" preserveAspectRatio="none" aria-hidden="true" className="welcome-pillars__wave welcome-pillars__wave--top">
            <path d="M723.023 17.7182C1022 70.7953 1349.25 31.2767 1440 18.3417V52.8125H0V52.3994C89.2831 34.6719 451.118 -30.5515 723.023 17.7182Z" fill="white"/>
            {waveBorder && <path d="M1440 18.5878C1349.25 31.5228 1022 71.0414 723.023 17.9643C451.118 -30.3054 89.2831 34.918 0 52.6455V53.0586" stroke="#E6E6DC" fill="none"/>}
          </svg>
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
          <svg viewBox="0 0 1440 54" preserveAspectRatio="none" aria-hidden="true" className="welcome-pillars__wave welcome-pillars__wave--bottom">
            <path d="M723.023 17.7182C1022 70.7953 1349.25 31.2767 1440 18.3417V52.8125H0V52.3994C89.2831 34.6719 451.118 -30.5515 723.023 17.7182Z" fill="white"/>
            {waveBorder && <path d="M1440 18.5878C1349.25 31.5228 1022 71.0414 723.023 17.9643C451.118 -30.3054 89.2831 34.918 0 52.6455V53.0586" stroke="#E6E6DC" fill="none"/>}
          </svg>
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
          <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" aria-hidden="true" className="welcome-stakeholders__wave welcome-stakeholders__wave--top">
            <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#FCFCF6" />
          </svg>
          <div className="welcome-stakeholders__content">
            <p className="welcome-stakeholders__label">Pathways is supported by a wide range of global stakeholders.</p>
            <div className="welcome-stakeholders__four">
              <img src={logoBluesquare} alt="Bluesquare" className="welcome-stakeholders__four-logo" />
              <img src={logoGates}      alt="Gates Foundation" className="welcome-stakeholders__four-logo" />
              <img src={logoSonder}     alt="Sonder Collective" className="welcome-stakeholders__four-logo" />
              <img src={logoTwilio}     alt="Twilio.org" className="welcome-stakeholders__four-logo" />
            </div>
          </div>
          <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" aria-hidden="true" className="welcome-stakeholders__wave welcome-stakeholders__wave--bottom">
            <rect width="1917" height="70" fill="#FCFCF6" />
            <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="#F3F3E6" />
          </svg>
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
