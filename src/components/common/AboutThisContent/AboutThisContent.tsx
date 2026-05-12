import InfoOutlinedIcon from '../../../assets/icons/InfoOutlined.svg?react';
import './AboutThisContent.css';

export function AboutThisContent() {
  return (
    <span className="about-this-content">
      <InfoOutlinedIcon width={20} height={20} />
      <span className="about-this-content__label">About this content</span>
      <span className="about-this-content__tooltip" role="tooltip">
        This content was generated using AI and reviewed by a subject matter
        expert for accuracy. Learn more about our{' '}
        <a href="/#article-detail" className="about-this-content__tooltip-link">segmentation methodology</a>.
      </span>
    </span>
  );
}
