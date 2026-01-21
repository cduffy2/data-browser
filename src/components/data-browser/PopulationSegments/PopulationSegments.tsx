import { useState, useRef, useCallback } from 'react';
import './PopulationSegments.css';
import { SegmentTooltip } from './SegmentTooltip';
import straw2 from '../../../assets/straw2.png';
import brick2 from '../../../assets/brick2.png';

// Badge images
import Badge1 from '../../../assets/icons/1-large.png';
import Badge2 from '../../../assets/icons/2-large.png';
import Badge2a from '../../../assets/icons/2a-large.png';
import Badge2b from '../../../assets/icons/2b-large.png';
import Badge3 from '../../../assets/icons/3-large.png';
import Badge3a from '../../../assets/icons/3a-large.png';
import Badge3b from '../../../assets/icons/3b-large.png';
import Badge4 from '../../../assets/icons/4-large.png';

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
  { id: 'r3b', type: 'rural', badge: '3b', vulnerabilityLevel: 3, vulnerabilityText: 'more vulnerable', populationPercent: 21 },
  { id: 'r3a', type: 'rural', badge: '3a', vulnerabilityLevel: 3, vulnerabilityText: 'more vulnerable', populationPercent: 5 },
  { id: 'r4', type: 'rural', badge: '4', vulnerabilityLevel: 4, vulnerabilityText: 'most vulnerable', populationPercent: 12 },
];

const urbanSegments: Segment[] = [
  { id: 'u1', type: 'urban', badge: '1', vulnerabilityLevel: 1, vulnerabilityText: 'least vulnerable', populationPercent: 12 },
  { id: 'u2b', type: 'urban', badge: '2b', vulnerabilityLevel: 2, vulnerabilityText: 'less vulnerable', populationPercent: 6 },
  { id: 'u2a', type: 'urban', badge: '2a', vulnerabilityLevel: 2, vulnerabilityText: 'less vulnerable', populationPercent: 12 },
  { id: 'u4', type: 'urban', badge: '4', vulnerabilityLevel: 4, vulnerabilityText: 'most vulnerable', populationPercent: 11 },
];

const badgeImages: Record<string, string> = {
  '1': Badge1,
  '2': Badge2,
  '2a': Badge2a,
  '2b': Badge2b,
  '3': Badge3,
  '3a': Badge3a,
  '3b': Badge3b,
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
  onMouseEnter: (segment: Segment) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onClick?: (segment: Segment) => void;
}

function SegmentCard({ segment, height, onMouseEnter, onMouseLeave, onMouseMove, onClick }: SegmentCardProps) {
  const vulnerabilityClass = getVulnerabilityClass(segment.vulnerabilityLevel);
  const typeLabel = segment.type === 'rural' ? 'Rural' : 'Urban';
  const texture = segment.type === 'rural' ? straw2 : brick2;
  const textureOpacity = segment.type === 'rural' ? 0.04 : 0.06;

  const handleClick = () => {
    if (onClick) {
      onClick(segment);
    }
  };

  return (
    <button
      className={`population-segments__card population-segments__card--${vulnerabilityClass}`}
      style={{ height: `${height}px` }}
      onMouseEnter={() => onMouseEnter(segment)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={handleClick}
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

interface PopulationSegmentsProps {
  onSegmentClick?: (segmentId: string) => void;
}

export function PopulationSegments({ onSegmentClick }: PopulationSegmentsProps = {}) {
  const [displayedSegment, setDisplayedSegment] = useState<Segment | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

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

  const handleMouseEnter = useCallback((segment: Segment) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setDisplayedSegment(segment);
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Small delay to allow moving between segments without flicker
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      setDisplayedSegment(null);
    }, 50);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getSegmentTitle = (segment: Segment) => {
    const typeLabel = segment.type === 'rural' ? 'Rural' : 'Urban';
    return `${typeLabel} ${segment.badge} ${segment.vulnerabilityText}`;
  };

  const handleSegmentClick = useCallback((segment: Segment) => {
    if (onSegmentClick) {
      onSegmentClick(segment.id);
    }
  }, [onSegmentClick]);

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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onClick={handleSegmentClick}
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onClick={handleSegmentClick}
              />
            );
          })}
        </div>
      </div>

      {isVisible && displayedSegment && (
        <SegmentTooltip
          segmentId={displayedSegment.id}
          segmentTitle={getSegmentTitle(displayedSegment)}
          vulnerabilityLevel={displayedSegment.vulnerabilityLevel}
          position={mousePosition}
        />
      )}
    </div>
  );
}
