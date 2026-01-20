import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import { AnchorNav } from '../../components/segment-profile/AnchorNav/AnchorNav';
import SenegalMapImage from '../../assets/Senegal-map-image.png';
import DottedTexture from '../../assets/Dotted-Texture.png';
import Badge3 from '../../assets/icons/3.png';
import Badge2 from '../../assets/icons/2.png';
import Badge1 from '../../assets/icons/1.png';
import './WalkInHerShoesPage.css';

const anchorLinks = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'childhood', label: 'Childhood' },
  { id: 'adolescence', label: 'Adolescence' },
  { id: 'marriage', label: 'Marriage' },
  { id: 'motherhood', label: 'Motherhood' },
  { id: 'adulthood', label: 'Adulthood' },
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
              <img src={SenegalMapImage} alt="Map of Senegal highlighting Toubacouta" className="wihs-page__map-image" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="wihs-page__body">
            <div className="wihs-page__narrative">
              {/* Introduction */}
              <section id="introduction" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Introduction</h2>
                <p className="wihs-page__text">
                  My name is Amina. I am 19-years-old from Wardey in Tana River County. I live with my husband, I'm his third wife and we have two children. My husband is our provider, making sure we have food and medicine, and makes all the big decisions. He is a livestock herder, sometimes he sells goats or cows to provide for our large family. But with the changing climate, between drought and floods, it has become harder. Our herds have reduced and minimised how much we can eat in a day. My mother-in-law and my husband's brothers and their families live next to us.
                </p>
              </section>

              {/* Childhood */}
              <section id="childhood" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Childhood</h2>
                <p className="wihs-page__text">
                  I was born in Wardey, the first born of seven children in our family. My mother is my father's second wife. Our life has been moving around and taking care of cattle for as long as I can remember. From an early age, I remember fetching water from the river—a long, exhausting walk but I always enjoyed walking with my friends.
                </p>
                <p className="wihs-page__text">
                  I didn't go to school. My mother needed my help at home—and there was always a chore waiting for me, and my six younger siblings. I attended madrasa (religious school), where I learned how to read and recite the Quran, as all other children in my community did.
                </p>
                <p className="wihs-page__text">
                  When I was 10 years old, I was circumcised. I remember the pain, my back and legs hurt so much and my bleeding wound was dressed with herbs in the forest. There were other girls nearby going through the same thing so I didn't feel so alone.
                </p>
              </section>

              {/* Adolescence */}
              <section id="adolescence" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Adolescence</h2>
                <p className="wihs-page__text">
                  I don't remember exactly when my periods started, but I do recall the moment I told my mother. Without saying much, she cut up pieces of her dera—the cotton dress that women in my community wear—so I could manage the flow.
                </p>
                <p className="wihs-page__text">
                  Women don't use sanitary pads here because it can cause cancer.
                </p>
                <p className="wihs-page__text">
                  After I turned 16, my father found a suitor for me, a man more than twice my age. I was terrified, and sad at the thought of leaving my mother and siblings behind. But I was told this was my path, a step toward starting my own family and fulfilling my religious duty. I didn't really understand what was expected as a wife. So there was a fear in me but I knew resistance wasn't an option.
                </p>
              </section>

              {/* Marriage */}
              <section id="marriage" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Marriage</h2>
                <p className="wihs-page__text">
                  In my new home, my days started early, long before the sun was fully up. I prepared meals for my husband, trying to adjust to a life that felt both foreign and isolating. We ate whatever was available, mostly fresh cow milk and ugali (maize meal). Each day, I tried to fit in with my new family by performing my tasks well.
                </p>
                <p className="wihs-page__text">
                  I share a homestead with my co-wives and their children. We work together on many things—preparing meals, fetching water, and taking care of our children. We go together to fetch water from the river, and then we boil it.
                </p>
                <p className="wihs-page__text">
                  I remember one day, one of my co-wives, Nasra, and I had to prepare a large meal for the family. We worked side by side, chopping some vegetables and stirring pots, but when it came to dividing up portions for the children, she made sure her children got bigger portions of the meal, so I quietly did the same for mine.
                </p>
              </section>

              {/* Motherhood */}
              <section id="motherhood" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Motherhood</h2>
                <p className="wihs-page__text">
                  I had my first child, a son, at home with the help of a mkunga (a traditional birth attendant). She helped deliver many children in my community.
                </p>
                <p className="wihs-page__text">
                  During my first delivery, she had to cut me with a razor blade to help the baby come out. I had heard stories about this from other women, but nothing really prepared me for the reality of it.
                </p>
                <p className="wihs-page__text">
                  My second child, another boy, came soon after, also born at home.
                </p>
                <p className="wihs-page__text">
                  The labour was so intense and longer than the first, but I made it through, surrounded by the women in my family, who were telling me not to give into my pain. But in the end, when the silence fell, after all the struggle, my child never cried, we knew that my child was no more. It was devastating.
                </p>
              </section>

              {/* Adulthood */}
              <section id="adulthood" className="wihs-page__section">
                <h2 className="wihs-page__section-title">Adulthood</h2>
                <p className="wihs-page__text">
                  The women in my homestead consoled me and told me to look ahead. Soon I was pregnant again. I was feeling dizzy and weak and most days I was so hungry but I wouldn't show it.
                </p>
                <p className="wihs-page__text">
                  When the time came and labour started, I was in pain. I kept it to myself for a couple of days because I did not want to bother them. When the pain became too much for me to bear, I told my mother-in-law. After watching me in pain for a few more days, she insisted I go to a facility.
                </p>
                <p className="wihs-page__text">
                  I walked in pain in the dead of night for 5 hours to the nearest clinic with the mkunga and my husband. No doctor was available, so someone organised a car and they took me to the nearest town. I don't know what medicines they gave me, but I remember the exhaustion and the fear of needing a C-section, something I had heard frightening stories about. Luckily my daughter was born naturally.
                </p>
                <p className="wihs-page__text">
                  I now spend my time sitting on a small mat, holding my daughter as she's only wearing a string of beads on her ankle. I made it for her for protection from any evil. I breastfeed, cool her down with a cloth, and chat with the girls and women who visit to dote on her.
                </p>
                <p className="wihs-page__text">
                  After delivery the nurse asked me to come back but how can I go when me and my baby have to be resting indoors for 40 days. After this, we will host a much anticipated celebration with the mkungas and the women from our community, giving thanks, welcoming my child and sharing the joy with family and neighbours.
                </p>
                <p className="wihs-page__text">
                  I have only ever been to ANC 1 time in all my 3 pregnancies. It happened by chance when a doctor and nurse came to our area, announcing they were there for the day to provide free check-ups as part of a government initiative. So we watched with my friend how people curiously gathered around the little tent that they had set up. Pregnant women including me had a health check. I worried about what my husband might think if he found out what I did without discussing it with him first. Luckily he didn't get to find out.
                </p>
                <p className="wihs-page__text">
                  I now have two children and I dream of having ten one day. I want a lot of children for all the hardships that I've faced in my life. The 40 days after birth are the only days in my life I ever get to do nothing but care for my child and be cared for by others. I look forward to more of those.
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
