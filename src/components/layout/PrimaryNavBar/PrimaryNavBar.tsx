import { useState, useEffect, useRef } from 'react';
import type { Page } from '../LeftSidebar/LeftSidebar';
import pathwaysLogo from '../../../assets/pathways-logo.svg';
import './PrimaryNavBar.css';

interface PrimaryNavBarProps {
  currentPage?: Page;
  onNavigate?: (page: Page) => void;
}

export function PrimaryNavBar({ currentPage, onNavigate }: PrimaryNavBarProps) {
  const [hidden, setHidden] = useState(false);
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

  const handleSegmentationsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('segmentations');
  };

  return (
    <nav className={`primary-nav ${hidden ? 'primary-nav--hidden' : ''}`}>
      <div className="primary-nav__container">
        <div className="primary-nav__logo">
          <img src={pathwaysLogo} alt="Pathways" className="primary-nav__logo-image" />
        </div>
        <ul className="primary-nav__items">
          <li><a href="/" className="primary-nav__item">Welcome</a></li>
          <li><a href="#segmentations" className={`primary-nav__item ${currentPage === 'segmentations' ? 'primary-nav__item--active' : ''}`} onClick={handleSegmentationsClick}>Segmentations</a></li>
          <li><a href="/news" className="primary-nav__item">News</a></li>
          <li><a href="/contact" className="primary-nav__item">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
