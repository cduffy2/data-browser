import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import RightArrowIcon from '../../assets/icons/Right-arrow.svg?react';
import mapIllustration from '../../assets/Map-illustration.png';
import biharIndiaFlag from '../../assets/icons/Bihar-India.png';
import ethiopiaFlag from '../../assets/icons/ethiopia.png';
import indonesiaFlag from '../../assets/icons/indonesia.png';
import kenyaFlag from '../../assets/icons/kenya.png';
import nigeriaFlag from '../../assets/icons/nigeria.png';
import senegalFlag from '../../assets/icons/Senegal.png';
import './SegmentationsPage.css';

interface SegmentationsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const GEOGRAPHIES = [
  { id: 'bihar-india', name: 'Bihar, India', count: '1 segmentation', color: '#DBECFE', borderColor: '#88C1FD', flagImg: biharIndiaFlag },
  { id: 'ethiopia', name: 'Ethiopia', count: '1 segmentation', color: '#E7D5EF', borderColor: '#AF73C8', flagImg: ethiopiaFlag },
  { id: 'indonesia', name: 'Indonesia', count: '1 segmentation', color: '#D1EDE4', borderColor: '#66C2A5', flagImg: indonesiaFlag },
  { id: 'kenya', name: 'Kenya', count: '1 segmentation', color: '#FEDBDB', borderColor: '#FB8686', flagImg: kenyaFlag },
  { id: 'northern-nigeria', name: 'Northern Nigeria', count: '2 segmentations', color: '#FFF4C1', borderColor: '#FFD92F', flagImg: nigeriaFlag },
  { id: 'senegal', name: 'Senegal', count: '2 segmentations', color: '#DDE3EF', borderColor: '#8DA0CB', flagImg: senegalFlag },
];

const RESOURCES = [
  { title: 'About Pathways', description: 'Resources to help you understand what Pathways is and how it might be applied to your work.' },
  { title: 'Using the typing tool', description: 'A guide on best practices when using Typing Tools' },
  { title: 'Recruitment guide', description: 'Practical guides and resources for research teams utilising the Insite segmentation approach and Typing Tool.' },
  { title: 'Ethics guidelines', description: 'Best practices to follow while collecting, storing, or utilising Pathways data.' },
];

export function SegmentationsPage({ currentPage, onNavigate }: SegmentationsPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Segmentations';
  }, []);

  const handleCardClick = (id: string) => {
    if (id === 'kenya') {
      onNavigate('kenya-overview');
    } else {
      onNavigate('not-found');
    }
  };

  return (
    <div className="segmentations-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Header */}
      <div className="segmentations-page__header">
        <div className="segmentations-page__header-left">
          <div className="segmentations-page__header-text">
            <h1 className="segmentations-page__title">Segmentations</h1>
            <p className="segmentations-page__description">
              Understand the diverse health needs within populations. Our segmentations identify distinct groups facing similar barriers to good health, helping you target interventions more effectively and equitably. Select a geography below to explore the unique challenges and opportunities in each segment.
            </p>
          </div>
          <div className="segmentations-page__miniline" />
          <div className="segmentations-page__cta">
            <span className="segmentations-page__cta-text">Not sure where to start?</span>
            <span className="segmentations-page__cta-link">
              Read our getting started guide
              <RightArrowIcon className="segmentations-page__cta-arrow" />
            </span>
          </div>
        </div>
        <div className="segmentations-page__header-right">
          <img src={mapIllustration} alt="" className="segmentations-page__map-illustration" />
        </div>
      </div>

      {/* Wave divider */}
      <div className="segmentations-page__wave">
        <svg viewBox="0 0 1917 70" fill="none" preserveAspectRatio="none" className="segmentations-page__wave-svg">
          <path d="M0 70V31.5C160 10.5 320 0 480 0C640 0 800 10.5 960 31.5C1120 52.5 1280 63 1440 63C1600 63 1760 52.5 1917 31.5V70H0Z" fill="var(--background-page)" />
        </svg>
      </div>

      {/* Content area */}
      <div className="segmentations-page__content">
        <div className="segmentations-page__two-col">
          {/* Left: Geography cards */}
          <div className="segmentations-page__geographies">
            <div className="segmentations-page__section-header">
              <div className="segmentations-page__miniline" />
              <h2 className="segmentations-page__section-title">Select a geography</h2>
            </div>
            <div className="segmentations-page__cards">
              {GEOGRAPHIES.map((geo) => (
                <button
                  key={geo.id}
                  className="segmentations-page__card"
                  style={{ backgroundColor: geo.color, '--card-border-color': geo.borderColor } as React.CSSProperties}
                  onClick={() => handleCardClick(geo.id)}
                >
                  <div className="segmentations-page__card-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="segmentations-page__card-bottom">
                    <img src={geo.flagImg} alt="" className="segmentations-page__card-flag" />
                    <span className="segmentations-page__card-name">{geo.name}</span>
                    <span className="segmentations-page__card-count">{geo.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Resources */}
          <div className="segmentations-page__resources">
            <div className="segmentations-page__section-header">
              <div className="segmentations-page__miniline" />
              <h2 className="segmentations-page__section-title">Resources</h2>
            </div>
            <div className="segmentations-page__resources-list">
              {RESOURCES.map((resource) => (
                <div key={resource.title} className="segmentations-page__resource">
                  <div className="segmentations-page__resource-header">
                    <h3 className="segmentations-page__resource-title">{resource.title}</h3>
                    <svg className="segmentations-page__resource-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 21C4.45 21 3.979 20.804 3.587 20.413C3.196 20.021 3 19.55 3 19V5C3 4.45 3.196 3.979 3.587 3.587C3.979 3.196 4.45 3 5 3H12V5H5V19H19V12H21V19C21 19.55 20.804 20.021 20.413 20.413C20.021 20.804 19.55 21 19 21H5ZM9.7 15.7L8.3 14.3L17.6 5H14V3H21V10H19V6.4L9.7 15.7Z" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="segmentations-page__resource-text">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
