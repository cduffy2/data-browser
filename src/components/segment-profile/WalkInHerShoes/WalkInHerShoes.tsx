import './WalkInHerShoes.css';
import WIHSIllustration from '../../../assets/WIHS illustration.png';
import DottedTexture from '../../../assets/Dotted-Texture.png';

interface WalkInHerShoesProps {
  onReadStory: () => void;
}

export function WalkInHerShoes({ onReadStory }: WalkInHerShoesProps) {
  return (
    <div className="walk-in-her-shoes">
      <div className="walk-in-her-shoes__header">
        <h2 className="walk-in-her-shoes__title">Walk in her shoes</h2>
        <p className="walk-in-her-shoes__description">
          Explore a fictional narrative about a woman in this segment. Discover her life's journey from childhood, through adolescence, and into motherhood.
        </p>
      </div>

      <div className="walk-in-her-shoes__card">
        <div
          className="walk-in-her-shoes__texture"
          style={{ backgroundImage: `url(${DottedTexture})` }}
        />
        <div className="walk-in-her-shoes__card-content">
          <p className="walk-in-her-shoes__story-title">
            Married at 16: A young mother's journey through tradition, loss, and survival
          </p>
          <button className="walk-in-her-shoes__button" onClick={onReadStory}>
            Read this story
            <svg className="walk-in-her-shoes__button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="walk-in-her-shoes__illustration">
          <img
            src={WIHSIllustration}
            alt="Illustration of a woman"
            className="walk-in-her-shoes__illustration-image"
          />
        </div>
      </div>
    </div>
  );
}
