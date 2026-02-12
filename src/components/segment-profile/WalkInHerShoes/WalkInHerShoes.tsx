import './WalkInHerShoes.css';
import FootstepsImg from '../../../assets/footsteps-2.png';
import ArrowForwardIcon from '../../../assets/icons/ArrowForwardFilled.svg?react';

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
        <div className="walk-in-her-shoes__card-content">
          <p className="walk-in-her-shoes__story-title">
            Married at 16: A young mother's journey through tradition, loss, and survival
          </p>
          <button className="walk-in-her-shoes__button" onClick={onReadStory}>
            Read this story
            <ArrowForwardIcon className="walk-in-her-shoes__button-icon" />
          </button>
        </div>
        <img
          src={FootstepsImg}
          alt=""
          className="walk-in-her-shoes__footsteps"
        />
      </div>
    </div>
  );
}
