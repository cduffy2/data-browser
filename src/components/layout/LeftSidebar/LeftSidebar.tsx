import './LeftSidebar.css';
import LocationIcon from '../../../assets/icons/Location.svg?react';
import CompareIcon from '../../../assets/icons/Compare.svg?react';
import FolderIcon from '../../../assets/icons/Folder.svg?react';
import DataIcon from '../../../assets/icons/Data.svg?react';
import LeafIcon from '../../../assets/icons/Leaf.svg?react';
import CityIcon from '../../../assets/icons/City.svg?react';
import KenyaFlag from '../../../assets/icons/kenya.png';
import Badge1 from '../../../assets/icons/1-small.png';
import Badge2 from '../../../assets/icons/2-small.png';
import Badge2a from '../../../assets/icons/2a-small.png';
import Badge2b from '../../../assets/icons/2b-small.png';
import Badge3a from '../../../assets/icons/3a-small.png';
import Badge3b from '../../../assets/icons/3b-small.png';
import Badge4 from '../../../assets/icons/4-small.png';
import { populationSegments } from '../../../data/segments';

export type Page = 'senegal-overview' | 'data-browser' | 'rural-4' | 'walk-in-her-shoes' | 'not-found';

interface LeftSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

// Map badge values to image imports with width info
const badgeImages: Record<string, { src: string; width: number }> = {
  '1': { src: Badge1, width: 24 },
  '2': { src: Badge2, width: 24 },
  '2a': { src: Badge2a, width: 32 },
  '2b': { src: Badge2b, width: 32 },
  '3a': { src: Badge3a, width: 32 },
  '3b': { src: Badge3b, width: 32 },
  '4': { src: Badge4, width: 24 }
};

export function LeftSidebar({ currentPage, onNavigate }: LeftSidebarProps) {
  const handleNavClick = (e: React.MouseEvent, page: Page) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <nav className="sidebar__nav">
          <a
            href="#senegal-overview"
            className={`sidebar__nav-item ${currentPage === 'senegal-overview' ? 'sidebar__nav-item--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'senegal-overview')}
          >
            <img src={KenyaFlag} alt="Kenya" className="sidebar__flag" />
            <span>Kenya overview</span>
          </a>
          <a
            href="#not-found"
            className="sidebar__nav-item"
            onClick={(e) => handleNavClick(e, 'not-found')}
          >
            <CompareIcon className="sidebar__nav-icon" />
            <span>Compare segments</span>
          </a>
          <a
            href="#data-browser"
            className={`sidebar__nav-item ${currentPage === 'data-browser' ? 'sidebar__nav-item--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'data-browser')}
          >
            <DataIcon className="sidebar__nav-icon" />
            <span>Data browser</span>
          </a>
          <a
            href="#not-found"
            className="sidebar__nav-item"
            onClick={(e) => handleNavClick(e, 'not-found')}
          >
            <LocationIcon className="sidebar__nav-icon" />
            <span>Prevalence map</span>
          </a>
          <a
            href="#not-found"
            className="sidebar__nav-item"
            onClick={(e) => handleNavClick(e, 'not-found')}
          >
            <FolderIcon className="sidebar__nav-icon" />
            <span>Typing tools</span>
          </a>
        </nav>
      </div>

      <div className="sidebar__segments">
        <div className="sidebar__segments-title">Population segments</div>
        <div className="sidebar__segments-list">
          {populationSegments.map((segment) => {
            const Icon = segment.icon === 'Leaf' ? LeafIcon : CityIcon;
            const badgeInfo = badgeImages[segment.badge];
            const isActive = segment.id === 'rural-4' && currentPage === 'rural-4';
            const handleSegmentClick = (e: React.MouseEvent) => {
              e.preventDefault();
              if (segment.id === 'rural-4') {
                onNavigate('rural-4');
              } else {
                onNavigate('not-found');
              }
            };
            return (
              <a
                key={segment.id}
                href={segment.id === 'rural-4' ? '#rural-4' : '#not-found'}
                className={`sidebar__segment ${isActive ? 'sidebar__segment--active' : ''}`}
                onClick={handleSegmentClick}
              >
                <Icon className="sidebar__segment-icon" />
                <div className="sidebar__segment-content">
                  <span className="sidebar__segment-label">{segment.label}</span>
                  {badgeInfo && (
                    <img
                      src={badgeInfo.src}
                      alt={segment.badge}
                      className="sidebar__segment-badge"
                      style={{ width: `${badgeInfo.width}px`, height: '24px' }}
                    />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
