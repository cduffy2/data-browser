import './PopulationSegments.css';
import straw2 from '../../../assets/straw2.png';
import brick2 from '../../../assets/brick2.png';

// Badge images
import Badge1 from '../../../assets/icons/1.png';
import Badge2 from '../../../assets/icons/2.png';
import Badge21 from '../../../assets/icons/2.1.png';
import Badge22 from '../../../assets/icons/2.2.png';
import Badge3 from '../../../assets/icons/3.png';
import Badge31 from '../../../assets/icons/3.1.png';
import Badge32 from '../../../assets/icons/3.2.png';
import Badge4 from '../../../assets/icons/4.png';

type VulnerabilityLevel = 1 | 2 | 3 | 4;

interface Segment {
  id: string;
  type: 'rural' | 'urban';
  badge: string;
  vulnerabilityLevel: VulnerabilityLevel;
  vulnerabilityText: string;
  populationPercent: number;
}

const ruralSegments: Segment[] = [
  { id: 'r2', type: 'rural', badge: '2', vulnerabilityLevel: 2, vulnerabilityText: 'less vulnerable', populationPercent: 21 },
  { id: 'r3.2', type: 'rural', badge: '3.2', vulnerabilityLevel: 3, vulnerabilityText: 'more vulnerable', populationPercent: 21 },
  { id: 'r3.1', type: 'rural', badge: '3.1', vulnerabilityLevel: 3, vulnerabilityText: 'more vulnerable', populationPercent: 5 },
  { id: 'r4', type: 'rural', badge: '4', vulnerabilityLevel: 4, vulnerabilityText: 'most vulnerable', populationPercent: 12 },
];

const urbanSegments: Segment[] = [
  { id: 'u1', type: 'urban', badge: '1', vulnerabilityLevel: 1, vulnerabilityText: 'least vulnerable', populationPercent: 12 },
  { id: 'u2.2', type: 'urban', badge: '2.2', vulnerabilityLevel: 2, vulnerabilityText: 'less vulnerable', populationPercent: 6 },
  { id: 'u2.1', type: 'urban', badge: '2.1', vulnerabilityLevel: 2, vulnerabilityText: 'less vulnerable', populationPercent: 12 },
  { id: 'u4', type: 'urban', badge: '4', vulnerabilityLevel: 4, vulnerabilityText: 'most vulnerable', populationPercent: 11 },
];

const badgeImages: Record<string, string> = {
  '1': Badge1,
  '2': Badge2,
  '2.1': Badge21,
  '2.2': Badge22,
  '3': Badge3,
  '3.1': Badge31,
  '3.2': Badge32,
  '4': Badge4,
};

const TOTAL_HEIGHT = 540; // Total height in pixels for the visualization
const MIN_HEIGHT = 80; // Minimum height for any segment (two lines + 8px padding)
const GAP = 4; // Gap between segments

function getVulnerabilityClass(level: VulnerabilityLevel): string {
  switch (level) {
    case 1: return 'least';
    case 2: return 'less';
    case 3: return 'more';
    case 4: return 'most';
  }
}

interface SegmentCardProps {
  segment: Segment;
  height: number;
}

function SegmentCard({ segment, height }: SegmentCardProps) {
  const vulnerabilityClass = getVulnerabilityClass(segment.vulnerabilityLevel);
  const typeLabel = segment.type === 'rural' ? 'Rural' : 'Urban';
  const texture = segment.type === 'rural' ? straw2 : brick2;
  const textureOpacity = segment.type === 'rural' ? 0.04 : 0.06;

  return (
    <button
      className={`population-segments__card population-segments__card--${vulnerabilityClass}`}
      style={{ height: `${height}px` }}
    >
      <div
        className="population-segments__texture"
        style={{
          backgroundImage: `url(${texture})`,
          opacity: textureOpacity,
        }}
      />
      <div className="population-segments__card-content">
        <div className="population-segments__card-header">
          <div className="population-segments__card-title-row">
            <span className="population-segments__card-type">{typeLabel}</span>
            <img
              src={badgeImages[segment.badge]}
              alt={segment.badge}
              className="population-segments__card-badge"
            />
            <span className="population-segments__card-vulnerability">{segment.vulnerabilityText}</span>
          </div>
          <div className="population-segments__card-population">
            <span className="population-segments__card-percent">{segment.populationPercent}%</span>
            <span className="population-segments__card-label">of population</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function PopulationSegments() {
  // Calculate heights proportionally
  const ruralTotal = ruralSegments.reduce((sum, s) => sum + s.populationPercent, 0);
  const urbanTotal = urbanSegments.reduce((sum, s) => sum + s.populationPercent, 0);

  // Account for gaps in total height
  const ruralGapsHeight = (ruralSegments.length - 1) * GAP;
  const urbanGapsHeight = (urbanSegments.length - 1) * GAP;
  const availableRuralHeight = TOTAL_HEIGHT - ruralGapsHeight;
  const availableUrbanHeight = TOTAL_HEIGHT - urbanGapsHeight;

  const calculateHeight = (percent: number, total: number, availableHeight: number) => {
    const proportionalHeight = (percent / total) * availableHeight;
    return Math.max(MIN_HEIGHT, proportionalHeight);
  };

  return (
    <div className="population-segments">
      <div className="population-segments__headers">
        <div className="population-segments__header population-segments__header--rural">
          <div className="population-segments__header-accent" />
          <div className="population-segments__header-text">
            <span className="population-segments__header-title">Rural</span>
            <span className="population-segments__header-subtitle">70% of population</span>
          </div>
        </div>
        <div className="population-segments__header population-segments__header--urban">
          <div className="population-segments__header-accent" />
          <div className="population-segments__header-text">
            <span className="population-segments__header-title">Urban</span>
            <span className="population-segments__header-subtitle">30% of population</span>
          </div>
        </div>
      </div>
      <div className="population-segments__columns">
        <div className="population-segments__column population-segments__column--rural">
          {ruralSegments.map((segment) => {
            const height = calculateHeight(segment.populationPercent, ruralTotal, availableRuralHeight);
            return (
              <SegmentCard
                key={segment.id}
                segment={segment}
                height={height}
              />
            );
          })}
        </div>
        <div className="population-segments__column population-segments__column--urban">
          {urbanSegments.map((segment) => {
            const height = calculateHeight(segment.populationPercent, urbanTotal, availableUrbanHeight);
            return (
              <SegmentCard
                key={segment.id}
                segment={segment}
                height={height}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
