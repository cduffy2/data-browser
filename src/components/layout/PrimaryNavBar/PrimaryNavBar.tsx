import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Page } from '../LeftSidebar/LeftSidebar';
import pathwaysLogo from '../../../assets/pathways-logo.svg';
import ChevronDownIcon from '../../../assets/icons/ChevronDown.svg?react';
import biharIndiaFlag from '../../../assets/icons/Bihar-India.png';
import ethiopiaFlag from '../../../assets/icons/ethiopia.png';
import indonesiaFlag from '../../../assets/icons/indonesia.png';
import kenyaFlag from '../../../assets/icons/kenya.png';
import nigeriaFlag from '../../../assets/icons/nigeria.png';
import senegalFlag from '../../../assets/icons/Senegal.png';
import { GlobalSearch } from '../GlobalSearch/GlobalSearch';
import './PrimaryNavBar.css';

// Every geography routes to the Kenya demo segmentation
const GEOGRAPHIES: { id: string; name: string; flag: string }[] = [
  { id: 'bihar-india',      name: 'Bihar, India',     flag: biharIndiaFlag },
  { id: 'ethiopia',         name: 'Ethiopia',         flag: ethiopiaFlag },
  { id: 'indonesia',        name: 'Indonesia',        flag: indonesiaFlag },
  { id: 'kenya',            name: 'Kenya',            flag: kenyaFlag },
  { id: 'northern-nigeria', name: 'Northern Nigeria', flag: nigeriaFlag },
  { id: 'senegal',          name: 'Senegal',          flag: senegalFlag },
];

interface PrimaryNavBarProps {
  currentPage?: Page;
  onNavigate?: (page: Page, tag?: string, searchTerm?: string) => void;
}

export function PrimaryNavBar({ currentPage, onNavigate }: PrimaryNavBarProps) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [segOpen, setSegOpen] = useState(false);
  const [mobileSegOpen, setMobileSegOpen] = useState(false);
  const segRef = useRef<HTMLLIElement>(null);
  const lastScrollY = useRef(0);
  const accumulatedDelta = useRef(0);
  const triggerDistance = 20;

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Reset accumulator if direction changes
      if ((delta > 0 && accumulatedDelta.current < 0) || (delta < 0 && accumulatedDelta.current > 0)) {
        accumulatedDelta.current = 0;
      }

      accumulatedDelta.current += delta;

      if (accumulatedDelta.current > triggerDistance && currentScrollY > 16) {
        setHidden(true);
        accumulatedDelta.current = 0;
      } else if (accumulatedDelta.current < -triggerDistance) {
        setHidden(false);
        accumulatedDelta.current = 0;
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.navHidden = hidden ? 'true' : 'false';
  }, [hidden]);

  useEffect(() => {
    if (!segOpen) return;
    function handlePointer(e: MouseEvent) {
      if (!segRef.current?.contains(e.target as Node)) setSegOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSegOpen(false);
        segRef.current?.querySelector<HTMLButtonElement>('.primary-nav__seg-trigger')?.focus();
      }
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [segOpen]);

  // Close the dropdown when the nav slides away on scroll
  useEffect(() => {
    if (hidden) setSegOpen(false);
  }, [hidden]);

  const segActive = currentPage === 'segmentations' || currentPage === 'kenya-overview';
  const selectedSeg = currentPage === 'segmentations' ? 'overview' : currentPage === 'kenya-overview' ? 'kenya' : null;

  const goSeg = (target: 'overview' | string) => {
    setSegOpen(false);
    setMenuOpen(false);
    onNavigate?.(target === 'overview' ? 'segmentations' : 'kenya-overview');
  };

  const handleListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('.primary-nav__seg-option'));
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const nav = (page: Parameters<NonNullable<typeof onNavigate>>[0]) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate?.(page);
  };

  return (
    <>
    <nav className={`primary-nav ${hidden ? 'primary-nav--hidden' : ''}`}>
      <div className="primary-nav__container">
        <div className="primary-nav__logo">
          <img src={pathwaysLogo} alt="Pathways" className="primary-nav__logo-image" />
        </div>
        <ul className="primary-nav__items">
          <li><a href="#welcome" className={`primary-nav__item ${currentPage === 'welcome' ? 'primary-nav__item--active' : ''}`} onClick={nav('welcome')}>Welcome</a></li>
          <li className="primary-nav__seg" ref={segRef}>
            <button
              type="button"
              className={`primary-nav__item primary-nav__seg-trigger ${segActive ? 'primary-nav__item--active' : ''} ${segOpen ? 'primary-nav__seg-trigger--open' : ''}`}
              aria-haspopup="true"
              aria-expanded={segOpen}
              onClick={() => setSegOpen(o => !o)}
              onKeyDown={e => {
                if (e.key === 'ArrowDown' && !segOpen) {
                  e.preventDefault();
                  setSegOpen(true);
                  requestAnimationFrame(() => segRef.current?.querySelector<HTMLButtonElement>('.primary-nav__seg-option')?.focus());
                }
              }}
            >
              Segmentations
              <ChevronDownIcon className="primary-nav__seg-chevron" aria-hidden="true" />
            </button>
            {segOpen && (
              <ul className="primary-nav__seg-menu" onKeyDown={handleListKey}>
                <li>
                  <button
                    type="button"
                    className={`primary-nav__seg-option ${selectedSeg === 'overview' ? 'primary-nav__seg-option--selected' : ''}`}
                    aria-current={selectedSeg === 'overview' ? 'page' : undefined}
                    onClick={() => goSeg('overview')}
                  >
                    <span className="primary-nav__seg-globe" aria-hidden="true">🌍</span>
                    Overview
                  </button>
                </li>
                {GEOGRAPHIES.map(geo => (
                  <li key={geo.id}>
                    <button
                      type="button"
                      className={`primary-nav__seg-option ${selectedSeg === geo.id ? 'primary-nav__seg-option--selected' : ''}`}
                      aria-current={selectedSeg === geo.id ? 'page' : undefined}
                      onClick={() => goSeg(geo.id)}
                    >
                      <img src={geo.flag} alt="" className="primary-nav__seg-flag" />
                      {geo.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><a href="#resources" className={`primary-nav__item ${currentPage === 'resources' || currentPage === 'guide-article' || currentPage === 'typing-tools' || currentPage === 'how-pathways-data' || currentPage === 'methodology-explainer' ? 'primary-nav__item--active' : ''}`} onClick={nav('resources')}>Resources</a></li>
          <li><a href="#news" className={`primary-nav__item ${(currentPage === 'news' || currentPage === 'news-detail') ? 'primary-nav__item--active' : ''}`} onClick={nav('news')}>Blog</a></li>
          <li><a href="#contact" className={`primary-nav__item ${currentPage === 'contact' ? 'primary-nav__item--active' : ''}`} onClick={nav('contact')}>Contact</a></li>
        </ul>
        {onNavigate && <GlobalSearch onNavigate={onNavigate} open={searchOpen} onOpenChange={setSearchOpen} />}
        <button
          className={`primary-nav__hamburger ${menuOpen ? 'primary-nav__hamburger--open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
    {createPortal(
      <div className={`primary-nav__mobile-menu ${menuOpen ? 'primary-nav__mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="primary-nav__mobile-items">
          <li><a href="#welcome" className={`primary-nav__mobile-item ${currentPage === 'welcome' ? 'primary-nav__item--active' : ''}`} onClick={nav('welcome')}>Welcome</a></li>
          <li>
            <button
              type="button"
              className={`primary-nav__mobile-item primary-nav__mobile-item--seg ${segActive ? 'primary-nav__item--active' : ''} ${mobileSegOpen ? 'primary-nav__mobile-item--seg-open' : ''}`}
              aria-expanded={mobileSegOpen}
              onClick={() => setMobileSegOpen(o => !o)}
            >
              Segmentations
              <ChevronDownIcon className="primary-nav__seg-chevron" aria-hidden="true" />
            </button>
            {mobileSegOpen && (
              <ul className="primary-nav__mobile-sub">
                <li>
                  <button type="button" className={`primary-nav__mobile-subitem ${selectedSeg === 'overview' ? 'primary-nav__item--active' : ''}`} onClick={() => goSeg('overview')}>
                    <span className="primary-nav__seg-globe" aria-hidden="true">🌍</span>
                    Overview
                  </button>
                </li>
                {GEOGRAPHIES.map(geo => (
                  <li key={geo.id}>
                    <button type="button" className={`primary-nav__mobile-subitem ${selectedSeg === geo.id ? 'primary-nav__item--active' : ''}`} onClick={() => goSeg(geo.id)}>
                      <img src={geo.flag} alt="" className="primary-nav__seg-flag" />
                      {geo.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><a href="#resources" className={`primary-nav__mobile-item ${currentPage === 'resources' || currentPage === 'guide-article' || currentPage === 'typing-tools' || currentPage === 'how-pathways-data' || currentPage === 'methodology-explainer' ? 'primary-nav__item--active' : ''}`} onClick={nav('resources')}>Resources</a></li>
          <li><a href="#news" className={`primary-nav__mobile-item ${(currentPage === 'news' || currentPage === 'news-detail') ? 'primary-nav__item--active' : ''}`} onClick={nav('news')}>Blog</a></li>
          <li><a href="#contact" className={`primary-nav__mobile-item ${currentPage === 'contact' ? 'primary-nav__item--active' : ''}`} onClick={nav('contact')}>Contact</a></li>
          <li><button className="primary-nav__mobile-item primary-nav__mobile-item--search" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>Search</button></li>
        </ul>
      </div>,
      document.body
    )}
    </>
  );
}
