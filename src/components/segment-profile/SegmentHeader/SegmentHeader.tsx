import './SegmentHeader.css';
import Rural4Portrait from '../../../assets/Rural-4 most vulnerable_portrait.png';
import Rural4Illustration from '../../../assets/rural-4 illustration.png';
import Badge4 from '../../../assets/icons/4.png';
import ArrowRightIcon from '../../../assets/icons/Arrow-Right.svg?react';

interface SegmentHeaderProps {
  segmentType: 'Rural' | 'Urban';
  segmentNumber: string;
  vulnerabilityLevel: string;
  populationPercent: string;
  portraitImage?: string;
  illustrationImage?: string;
}

export function SegmentHeader({
  segmentType,
  segmentNumber,
  vulnerabilityLevel,
  populationPercent,
  portraitImage = Rural4Portrait,
  illustrationImage = Rural4Illustration,
}: SegmentHeaderProps) {
  return (
    <div className="segment-header">
      <div className="segment-header__content">
        <div className="segment-header__avatar">
          <img
            src={portraitImage}
            alt={`${segmentType} ${segmentNumber} portrait`}
            className="segment-header__portrait"
          />
        </div>
        <div className="segment-header__info">
          <div className="segment-header__title-row">
            <span className="segment-header__type">{segmentType}</span>
            <img
              src={Badge4}
              alt={segmentNumber}
              className="segment-header__badge"
            />
            <span className="segment-header__vulnerability">{vulnerabilityLevel}</span>
          </div>
          <div className="segment-header__population-row">
            <div className="segment-header__percent">
              <span className="segment-header__percent-value">{populationPercent}</span>
              <span className="segment-header__percent-label">of population</span>
            </div>
            <a href="#prevalence-map" className="segment-header__link">
              Go to prevalence map
              <ArrowRightIcon className="segment-header__link-icon" />
            </a>
          </div>
        </div>
      </div>
      <div className="segment-header__illustration">
        <img
          src={illustrationImage}
          alt={`${segmentType} ${segmentNumber} illustration`}
          className="segment-header__illustration-image"
        />
      </div>
    </div>
  );
}
