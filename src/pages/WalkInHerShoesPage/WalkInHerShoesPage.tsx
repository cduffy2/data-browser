import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { AnchorNav } from '../../components/segment-profile/AnchorNav/AnchorNav';
import KenyaMapImage from '../../assets/Kenya-map.png';
import DottedTexture from '../../assets/Dotted-Texture.png';
import Badge3 from '../../assets/icons/3.png';
import Badge2 from '../../assets/icons/2.png';
import Badge1 from '../../assets/icons/1.png';
import './WalkInHerShoesPage.css';

const anchorLinks = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'marriage', label: 'Marriage' },
  { id: 'motherhood', label: 'Motherhood' },
  { id: 'daily-challenges', label: 'Daily challenges' },
];

interface WalkInHerShoesPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function WalkInHerShoesPage({ currentPage, onNavigate }: WalkInHerShoesPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Walk in Her Shoes - Rural 4';
  }, []);

  return (
    <div className="wihs-page">
      <PrimaryNavBar />
      <div className="wihs-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="wihs-page__content">
          {/* Hero Section */}
          <div className="wihs-page__hero">
            <div className="wihs-page__hero-content">
              <div className="wihs-page__hero-text">
                <div className="wihs-page__breadcrumb">
                  <a href="#rural-4" onClick={(e) => { e.preventDefault(); onNavigate('rural-4'); }} className="wihs-page__breadcrumb-link">
                    Rural 4 most vulnerable
                  </a>
                  <span className="wihs-page__breadcrumb-separator">/</span>
                  <span className="wihs-page__breadcrumb-current">Walk in her shoes</span>
                </div>
                <h1 className="wihs-page__title">
                  Married at 16: A young mother's journey through tradition, loss, and survival
                </h1>
              </div>
            </div>
            <div className="wihs-page__hero-map">
              <img src={KenyaMapImage} alt="Map of Kenya highlighting Tana River County" className="wihs-page__map-image" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="wihs-page__body">
            <div className="wihs-page__narrative">
              {/* Introduction */}
              <section id="introduction" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Introduction</h2>
                <p className="wihs-page__text">
                  My name is Fatuma, and the horizon is the only map I have ever known. I was born in a small settlement near the border in Wajir, where the dust stays in your throat long after the wind has died down. I never went to school; there wasn't one nearby, and besides, my hands were needed for the water and the animals. My mother always said that a woman's education is found in her resilience, not in books.
                </p>
              </section>

              {/* Marriage */}
              <section id="marriage" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Marriage</h2>
                <p className="wihs-page__text">
                  I was married when I was fifteen. It was not a choice, but a transition, like the coming of the rains. My husband is often away with the herds for weeks at a time. My first child came a year later. I remember the pain starting as the sun was setting. My mother and an aunt stayed with me in our hut. There was no talk of a hospital; the nearest one is a day's journey by foot, and we had no way to get there. My son was born on the floor of our home, the same way I was.
                </p>
              </section>

              {/* Motherhood */}
              <section id="motherhood" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Motherhood</h2>
                <p className="wihs-page__text">
                  Now, I have six children. Each pregnancy feels heavier than the last. I have heard the radio sometimes when I am at the market—the voices talking about "four visits" to the clinic. I laughed the first time I heard it. How can I go four times when I cannot even leave my children for one day? The one time I did try to go, when my third child had a fever, the nurse spoke to me in a way that made me feel small. I haven't been back since.
                </p>
              </section>

              {/* Daily challenges */}
              <section id="daily-challenges" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Daily challenges</h2>
                <p className="wihs-page__text">
                  None of my children have had all their "jabs." The health workers come to the village sometimes, but we are often moving the animals when they arrive. My youngest daughter is two now, and she has never seen a doctor. She is thin and gets tired easily. I worry, but then I look at the sky and wait for the season to change. My husband makes the decisions about money, and right now, the money is for grain and for the goats. I have a phone, a small one, but I cannot read the messages. My life is lived in the gaps between what the government says we should do and what the land allows us to do.
                </p>
              </section>
            </div>

            {/* Anchor Navigation */}
            <div className="wihs-page__anchor-nav">
              <AnchorNav links={anchorLinks} />
            </div>
          </div>

          {/* More Stories Section */}
          <div className="wihs-page__more-stories">
            <h2 className="wihs-page__more-stories-title">More stories from this segmentation</h2>
            <p className="wihs-page__more-stories-subtitle">
              Explore a fictional narrative about a woman in this segment. Discover her life's journey from childhood, through adolescence, and into motherhood.
            </p>
            <div className="wihs-page__story-cards">
              <a
                href="#not-found"
                className="wihs-page__story-card wihs-page__story-card--more"
                onClick={(e) => { e.preventDefault(); onNavigate('not-found'); }}
              >
                <div
                  className="wihs-page__story-card-texture"
                  style={{ backgroundImage: `url(${DottedTexture})` }}
                />
                <div>
                  <span className="wihs-page__story-card-tag wihs-page__story-card-tag--more">
                    Rural <img src={Badge3} alt="3" className="wihs-page__story-card-tag-badge" />&nbsp;more vulnerable
                  </span>
                  <h3 className="wihs-page__story-card-title">Breaking Silence: A Survivor's Path from Gender-Based Violence to Healthcare Access</h3>
                </div>
                <span className="wihs-page__story-card-link">
                  Read this story
                  <svg className="wihs-page__story-card-link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33333 8H12.6667M12.6667 8L8 3.33333M12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
              <a
                href="#not-found"
                className="wihs-page__story-card wihs-page__story-card--less"
                onClick={(e) => { e.preventDefault(); onNavigate('not-found'); }}
              >
                <div
                  className="wihs-page__story-card-texture"
                  style={{ backgroundImage: `url(${DottedTexture})` }}
                />
                <div>
                  <span className="wihs-page__story-card-tag wihs-page__story-card-tag--less">
                    Rural <img src={Badge2} alt="2" className="wihs-page__story-card-tag-badge" />&nbsp;less vulnerable
                  </span>
                  <h3 className="wihs-page__story-card-title">When School Ends, Health Risks Begin: A Girl's Story of Early Marriage and Reproductive Challenges</h3>
                </div>
                <span className="wihs-page__story-card-link">
                  Read this story
                  <svg className="wihs-page__story-card-link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33333 8H12.6667M12.6667 8L8 3.33333M12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
              <a
                href="#not-found"
                className="wihs-page__story-card wihs-page__story-card--least"
                onClick={(e) => { e.preventDefault(); onNavigate('not-found'); }}
              >
                <div
                  className="wihs-page__story-card-texture"
                  style={{ backgroundImage: `url(${DottedTexture})` }}
                />
                <div>
                  <span className="wihs-page__story-card-tag wihs-page__story-card-tag--least">
                    Rural <img src={Badge1} alt="1" className="wihs-page__story-card-tag-badge" />&nbsp;least vulnerable
                  </span>
                  <h3 className="wihs-page__story-card-title">Childbirth at a Crossroads: One Woman's Fight for Safe Maternal Care in Rural Communities</h3>
                </div>
                <span className="wihs-page__story-card-link">
                  Read this story
                  <svg className="wihs-page__story-card-link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33333 8H12.6667M12.6667 8L8 3.33333M12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
