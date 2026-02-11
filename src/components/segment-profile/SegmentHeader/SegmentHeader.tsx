import './SegmentHeader.css';
import Rural4Portrait from '../../../assets/Rural-4 most vulnerable_portrait.png';
import Badge4 from '../../../assets/icons/4.png';
import ArrowRightIcon from '../../../assets/icons/Arrow-Right.svg?react';
import InfoIcon from '../../../assets/icons/InfoOutlined.svg?react';

interface DemographicItem {
  label: string;
  value: string;
  suffix?: string;
  range?: string;
  showInfo?: boolean;
}

interface SegmentHeaderProps {
  segmentType: 'Rural' | 'Urban';
  segmentNumber: string;
  vulnerabilityLevel: string;
  populationPercent: string;
  portraitImage?: string;
  demographics?: DemographicItem[];
}

const defaultDemographics: DemographicItem[] = [
  { label: 'Age (median)', value: '31', range: '21 ~ 41', showInfo: true },
  { label: 'Partner age (median)', value: '34', range: '27 ~ 49', showInfo: true },
  { label: 'Household size (median)', value: '5' },
  { label: 'U5MR', value: '61', suffix: '/1000', showInfo: true },
];

export function SegmentHeader({
  segmentType,
  segmentNumber,
  vulnerabilityLevel,
  populationPercent,
  portraitImage = Rural4Portrait,
  demographics = defaultDemographics,
}: SegmentHeaderProps) {
  return (
    <div className="segment-header">
      <div className="segment-header__inner">
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
        <div className="segment-header__demographics">
          {demographics.map((item, index) => (
            <div key={index} className="segment-header__demo-item">
              <span className="segment-header__demo-label">{item.label}</span>
              <div className="segment-header__demo-value-row">
                <span className="segment-header__demo-value">{item.value}</span>
                {item.range && (
                  <>
                    <span className="segment-header__demo-separator">·</span>
                    <span className="segment-header__demo-range">{item.range}</span>
                  </>
                )}
                {item.suffix && (
                  <span className="segment-header__demo-suffix">{item.suffix}</span>
                )}
                {item.showInfo && (
                  <InfoIcon className="segment-header__demo-info" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
