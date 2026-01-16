import { segmentTooltipData, type SegmentTooltipData } from './segmentTooltipData';
import { AnimatedNumber } from './AnimatedNumber';
import './SegmentTooltip.css';

// Segment portrait images
import Rural2Portrait from '../../../assets/Rural-2 less vulnerable_portrait.png';
import Rural31Portrait from '../../../assets/Rural-3.1 more vulnerable_portrait.png';
import Rural32Portrait from '../../../assets/Rural-3.2 more vulnerable_portrait.png';
import Rural4Portrait from '../../../assets/Rural-4 most vulnerable_portrait.png';
import Urban1Portrait from '../../../assets/Urban-1 least vulnerable_portrait.png';
import Urban21Portrait from '../../../assets/Urban-2.1 less vulnerable_portrait.png';
import Urban22Portrait from '../../../assets/Urban-2.2 less vulnerable_portrait.png';
import Urban31Portrait from '../../../assets/Urban-3.1 more vulnerable_portrait.png';

const segmentPortraits: Record<string, string> = {
  'r2': Rural2Portrait,
  'r3.1': Rural31Portrait,
  'r3.2': Rural32Portrait,
  'r4': Rural4Portrait,
  'u1': Urban1Portrait,
  'u2.1': Urban21Portrait,
  'u2.2': Urban22Portrait,
  'u4': Urban31Portrait, // Using Urban 3.1 as fallback for Urban 4
};

type VulnerabilityLevel = 1 | 2 | 3 | 4;

interface SegmentTooltipProps {
  segmentId: string;
  segmentTitle: string;
  vulnerabilityLevel: VulnerabilityLevel;
  position: { x: number; y: number };
}

function getVulnerabilityClass(level: VulnerabilityLevel): string {
  switch (level) {
    case 1: return 'least';
    case 2: return 'less';
    case 3: return 'more';
    case 4: return 'most';
  }
}

interface HealthBarProps {
  label: string;
  percentage: number;
  medianPercentage: number;
}

function HealthBar({ label, percentage, medianPercentage }: HealthBarProps) {
  return (
    <div className="segment-tooltip__health-bar">
      <span className="segment-tooltip__health-label">{label}</span>
      <div className="segment-tooltip__health-bar-container">
        <div className="segment-tooltip__health-bar-track">
          <div
            className="segment-tooltip__health-bar-fill"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="segment-tooltip__health-bar-median"
            style={{ left: `${medianPercentage}%` }}
          />
        </div>
        <span className="segment-tooltip__health-percentage">
          <AnimatedNumber value={percentage} suffix="%" />
        </span>
      </div>
    </div>
  );
}

export function SegmentTooltip({ segmentId, segmentTitle, vulnerabilityLevel, position }: SegmentTooltipProps) {
  const data: SegmentTooltipData | undefined = segmentTooltipData[segmentId];

  if (!data) {
    return null;
  }

  const vulnerabilityClass = getVulnerabilityClass(vulnerabilityLevel);

  // Calculate position with offset and screen boundary prevention
  const tooltipWidth = 580;
  const tooltipHeight = 350;
  const offset = 10;

  let left = position.x + offset;
  let top = position.y + offset;

  // Prevent going off right edge
  if (left + tooltipWidth > window.innerWidth - 20) {
    left = position.x - tooltipWidth - offset;
  }

  // Prevent going off bottom edge
  if (top + tooltipHeight > window.innerHeight - 20) {
    top = position.y - tooltipHeight - offset;
  }

  // Prevent going off left edge
  if (left < 20) {
    left = 20;
  }

  // Prevent going off top edge
  if (top < 20) {
    top = 20;
  }

  return (
    <div
      className={`segment-tooltip segment-tooltip--${vulnerabilityClass}`}
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div className="segment-tooltip__left">
        <img
          src={segmentPortraits[segmentId]}
          alt={segmentTitle}
          className="segment-tooltip__portrait"
        />
        <h3 className="segment-tooltip__title">{segmentTitle}</h3>
        <div className="segment-tooltip__demographics">
          <div className="segment-tooltip__demographic">
            <span className="segment-tooltip__demographic-label">Age (median)</span>
            <span className="segment-tooltip__demographic-value">
              <strong><AnimatedNumber value={data.demographics.ageMedian} /></strong> · {data.demographics.ageRange} <span className="segment-tooltip__info-icon">ⓘ</span>
            </span>
          </div>
          <div className="segment-tooltip__demographic">
            <span className="segment-tooltip__demographic-label">Partner age (median)</span>
            <span className="segment-tooltip__demographic-value">
              <strong><AnimatedNumber value={data.demographics.partnerAgeMedian} /></strong> · {data.demographics.partnerAgeRange} <span className="segment-tooltip__info-icon">ⓘ</span>
            </span>
          </div>
          <div className="segment-tooltip__demographic">
            <span className="segment-tooltip__demographic-label">Household size (median)</span>
            <span className="segment-tooltip__demographic-value">
              <strong><AnimatedNumber value={data.demographics.householdSize} /></strong>
            </span>
          </div>
          <div className="segment-tooltip__demographic">
            <span className="segment-tooltip__demographic-label">Birth count (median)</span>
            <span className="segment-tooltip__demographic-value">
              <strong><AnimatedNumber value={data.demographics.birthCount} /></strong>
            </span>
          </div>
        </div>
      </div>
      <div className="segment-tooltip__right">
        <div className="segment-tooltip__section-header">
          <h4 className="segment-tooltip__section-title">Key health outcomes</h4>
          <div className="segment-tooltip__legend">
            <span className="segment-tooltip__legend-line" />
            <span className="segment-tooltip__legend-text">sample median</span>
          </div>
        </div>
        <div className="segment-tooltip__health-bars">
          {data.healthOutcomes.map((outcome, index) => (
            <HealthBar
              key={index}
              label={outcome.label}
              percentage={outcome.percentage}
              medianPercentage={outcome.medianPercentage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
