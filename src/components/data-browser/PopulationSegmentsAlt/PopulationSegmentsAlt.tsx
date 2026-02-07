import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import './PopulationSegmentsAlt.css';
import ArrowRightIcon from '../../../assets/icons/Arrow-Right.svg?react';
import LeafIcon from '../../../assets/icons/Leaf.svg?react';
import CityIcon from '../../../assets/icons/City.svg?react';
import { SegmentTooltip } from '../PopulationSegments/SegmentTooltip';

// Portrait images
import Rural2Portrait from '../../../assets/Rural-2 less vulnerable_portrait.png';
import Rural3aPortrait from '../../../assets/Rural-3a more vulnerable_portrait.png';
import Rural3bPortrait from '../../../assets/Rural-3b more vulnerable_portrait.png';
import Rural4Portrait from '../../../assets/Rural-4 most vulnerable_portrait.png';
import Urban1Portrait from '../../../assets/Urban-1 least vulnerable_portrait.png';
import Urban2aPortrait from '../../../assets/Urban-2a less vulnerable_portrait.png';
import Urban2bPortrait from '../../../assets/Urban-2b less vulnerable_portrait.png';
import Urban4Portrait from '../../../assets/Urban-4_portrait_blue.png';

// Badge images - large (for segment cards)
import Badge1 from '../../../assets/icons/1-large.png';
import Badge2 from '../../../assets/icons/2-large.png';
import Badge2a from '../../../assets/icons/2a-large.png';
import Badge2b from '../../../assets/icons/2b-large.png';
import Badge3a from '../../../assets/icons/3a-large.png';
import Badge3b from '../../../assets/icons/3b-large.png';
import Badge4 from '../../../assets/icons/4-large.png';

// Badge images - small (for tier headers)
import Badge1Small from '../../../assets/icons/1-small.png';
import Badge2Small from '../../../assets/icons/2-small.png';
import Badge3Small from '../../../assets/icons/3-small.png';
import Badge4Small from '../../../assets/icons/4-small.png';

const tierBadgeImages: Record<number, string> = {
  1: Badge1Small,
  2: Badge2Small,
  3: Badge3Small,
  4: Badge4Small,
};

export type ViewMode = 'vulnerability' | 'urban-rural' | 'segment-size';
type VulnerabilityLevel = 1 | 2 | 3 | 4;

interface Segment {
  id: string;
  type: 'rural' | 'urban';
  badge: string;
  vulnerabilityLevel: VulnerabilityLevel;
  populationPercent: number;
  portrait: string;
  badgeImage: string;
}

const allSegments: Segment[] = [
  { id: 'u4', type: 'urban', badge: '4', vulnerabilityLevel: 4, populationPercent: 11, portrait: Urban4Portrait, badgeImage: Badge4 },
  { id: 'r4', type: 'rural', badge: '4', vulnerabilityLevel: 4, populationPercent: 12, portrait: Rural4Portrait, badgeImage: Badge4 },
  { id: 'r3a', type: 'rural', badge: '3a', vulnerabilityLevel: 3, populationPercent: 5, portrait: Rural3aPortrait, badgeImage: Badge3a },
  { id: 'r3b', type: 'rural', badge: '3b', vulnerabilityLevel: 3, populationPercent: 21, portrait: Rural3bPortrait, badgeImage: Badge3b },
  { id: 'r2', type: 'rural', badge: '2', vulnerabilityLevel: 2, populationPercent: 21, portrait: Rural2Portrait, badgeImage: Badge2 },
  { id: 'u2a', type: 'urban', badge: '2a', vulnerabilityLevel: 2, populationPercent: 12, portrait: Urban2aPortrait, badgeImage: Badge2a },
  { id: 'u2b', type: 'urban', badge: '2b', vulnerabilityLevel: 2, populationPercent: 6, portrait: Urban2bPortrait, badgeImage: Badge2b },
  { id: 'u1', type: 'urban', badge: '1', vulnerabilityLevel: 1, populationPercent: 12, portrait: Urban1Portrait, badgeImage: Badge1 },
];

interface VulnerabilityTier {
  level: VulnerabilityLevel;
  label: string;
  segments: Segment[];
  populationPercent: number;
}

function getVulnerabilityTiers(): VulnerabilityTier[] {
  const tiers: VulnerabilityTier[] = [
    { level: 4, label: 'most vulnerable', segments: [], populationPercent: 0 },
    { level: 3, label: 'more vulnerable', segments: [], populationPercent: 0 },
    { level: 2, label: 'less vulnerable', segments: [], populationPercent: 0 },
    { level: 1, label: 'least vulnerable', segments: [], populationPercent: 0 },
  ];

  allSegments.forEach(segment => {
    const tier = tiers.find(t => t.level === segment.vulnerabilityLevel);
    if (tier) {
      tier.segments.push(segment);
      tier.populationPercent += segment.populationPercent;
    }
  });

  return tiers;
}

function getVulnerabilityClass(level: VulnerabilityLevel): string {
  switch (level) {
    case 1: return 'least';
    case 2: return 'less';
    case 3: return 'more';
    case 4: return 'most';
  }
}

function getVulnerabilityText(level: VulnerabilityLevel): string {
  switch (level) {
    case 1: return 'least vulnerable';
    case 2: return 'less vulnerable';
    case 3: return 'more vulnerable';
    case 4: return 'most vulnerable';
  }
}

// Animation configuration
const ANIMATION_DURATION = 0.4;
const ANIMATION_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]; // ease-out cubic

const cardTransition = {
  layout: {
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
  },
};

const headerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const headerTransition = {
  duration: ANIMATION_DURATION * 0.5,
  ease: 'easeOut' as const,
};

interface SegmentCardProps {
  segment: Segment;
  vulnerabilityLevel: VulnerabilityLevel;
  onSegmentClick?: (segmentId: string) => void;
  onMouseEnter?: (segment: Segment) => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  widthPercent?: number;
}

function SegmentCard({ segment, vulnerabilityLevel, onSegmentClick, onMouseEnter, onMouseLeave, onMouseMove, widthPercent }: SegmentCardProps) {
  const vulnerabilityClass = getVulnerabilityClass(vulnerabilityLevel);
  const typeLabel = segment.type === 'rural' ? 'Rural' : 'Urban';

  return (
    <motion.button
      layoutId={`segment-card-${segment.id}`}
      className={`segment-card segment-card--${vulnerabilityClass}`}
      style={widthPercent !== undefined ? { width: `${widthPercent}%` } : undefined}
      onClick={() => onSegmentClick?.(segment.id)}
      onMouseEnter={() => onMouseEnter?.(segment)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      transition={cardTransition}
    >
      <div className="segment-card__top-bar">
        <div className="segment-card__top-bar-inner" />
      </div>
      <div className="segment-card__content">
        <div className="segment-card__content-row">
          <div className="segment-card__header">
            <img
              src={segment.portrait}
              alt=""
              className="segment-card__portrait"
            />
            <span className="segment-card__type">{typeLabel}</span>
            <img
              src={segment.badgeImage}
              alt={segment.badge}
              className="segment-card__badge"
            />
            <span className="segment-card__separator">·</span>
            <span className="segment-card__percent">{segment.populationPercent}%</span>
          </div>
          <ArrowRightIcon className="segment-card__arrow" />
        </div>
      </div>
    </motion.button>
  );
}

function getSegmentsSortedBySize(): Segment[] {
  return [...allSegments].sort((a, b) => b.populationPercent - a.populationPercent);
}

interface UrbanRuralGroup {
  type: 'rural' | 'urban';
  label: string;
  segments: Segment[];
  populationPercent: number;
}

function getUrbanRuralGroups(): UrbanRuralGroup[] {
  const ruralSegments = allSegments
    .filter(s => s.type === 'rural')
    .sort((a, b) => b.vulnerabilityLevel - a.vulnerabilityLevel || b.populationPercent - a.populationPercent);
  const urbanSegments = allSegments
    .filter(s => s.type === 'urban')
    .sort((a, b) => b.vulnerabilityLevel - a.vulnerabilityLevel || b.populationPercent - a.populationPercent);

  return [
    {
      type: 'rural',
      label: 'Rural',
      segments: ruralSegments,
      populationPercent: ruralSegments.reduce((sum, s) => sum + s.populationPercent, 0),
    },
    {
      type: 'urban',
      label: 'Urban',
      segments: urbanSegments,
      populationPercent: urbanSegments.reduce((sum, s) => sum + s.populationPercent, 0),
    },
  ];
}

interface PopulationSegmentsAltProps {
  viewMode: ViewMode;
  onSegmentClick?: (segmentId: string) => void;
}

// Fixed height for the content area to keep consistent sizing across views
const CONTENT_HEIGHT = 680;

export function PopulationSegmentsAlt({ viewMode, onSegmentClick }: PopulationSegmentsAltProps) {
  const [displayedSegment, setDisplayedSegment] = useState<Segment | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  const tiers = getVulnerabilityTiers();
  const urbanRuralGroups = getUrbanRuralGroups();

  const handleMouseEnter = useCallback((segment: Segment) => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setDisplayedSegment(segment);
    setIsTooltipVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsTooltipVisible(false);
      setDisplayedSegment(null);
    }, 50);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getSegmentTitle = (segment: Segment) => {
    const typeLabel = segment.type === 'rural' ? 'Rural' : 'Urban';
    return `${typeLabel} ${segment.badge} ${getVulnerabilityText(segment.vulnerabilityLevel)}`;
  };

  return (
    <div className="population-segments-alt">
      <LayoutGroup>
        {/* Content container with fixed height */}
        <div className="population-segments-alt__content" style={{ minHeight: `${CONTENT_HEIGHT}px` }}>
          <AnimatePresence mode="wait">
            {/* Vulnerability Level View */}
            {viewMode === 'vulnerability' && (
              <motion.div
                key="vulnerability-view"
                className="population-segments-alt__tiers"
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {tiers.map(tier => (
                  <div key={tier.level} className="vulnerability-tier">
                    <motion.div
                      className="vulnerability-tier__header"
                      variants={headerVariants}
                      transition={headerTransition}
                    >
                      <img
                        src={tierBadgeImages[tier.level]}
                        alt={`Level ${tier.level}`}
                        className="vulnerability-tier__badge"
                      />
                      <span className="vulnerability-tier__label">{tier.label}</span>
                      <span className="vulnerability-tier__separator">·</span>
                      <span className="vulnerability-tier__population">{tier.populationPercent}% of population</span>
                      <div className="vulnerability-tier__line" />
                    </motion.div>
                    <div className="vulnerability-tier__cards">
                      {tier.segments.map(segment => (
                        <SegmentCard
                          key={segment.id}
                          segment={segment}
                          vulnerabilityLevel={tier.level}
                          onSegmentClick={onSegmentClick}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onMouseMove={handleMouseMove}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Urban / Rural View */}
            {viewMode === 'urban-rural' && (
              <motion.div
                key="urban-rural-view"
                className="population-segments-alt__urban-rural"
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {urbanRuralGroups.map(group => {
                  const Icon = group.type === 'rural' ? LeafIcon : CityIcon;

                  return (
                    <div key={group.type} className="urban-rural-group">
                      <motion.div
                        className="urban-rural-group__header"
                        variants={headerVariants}
                        transition={headerTransition}
                      >
                        <Icon className="urban-rural-group__icon" />
                        <span className="urban-rural-group__label">{group.label}</span>
                        <span className="urban-rural-group__separator">·</span>
                        <span className="urban-rural-group__population">{group.populationPercent}% of population</span>
                        <div className="urban-rural-group__line" />
                      </motion.div>
                      <div className="urban-rural-group__cards">
                        {group.segments.map(segment => (
                          <SegmentCard
                            key={segment.id}
                            segment={segment}
                            vulnerabilityLevel={segment.vulnerabilityLevel}
                            onSegmentClick={onSegmentClick}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={handleMouseMove}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Segment Size View */}
            {viewMode === 'segment-size' && (
              <motion.div
                key="segment-size-view"
                className="population-segments-alt__segment-size"
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div
                  className="segment-size__header"
                  variants={headerVariants}
                  transition={headerTransition}
                >
                  <span className="segment-size__label">All segments</span>
                  <span className="segment-size__separator">·</span>
                  <span className="segment-size__population">100% of population</span>
                  <div className="segment-size__line" />
                </motion.div>
                <div className="segment-size__cards">
                  {(() => {
                    const sortedSegments = getSegmentsSortedBySize();
                    const maxPercent = sortedSegments[0]?.populationPercent || 1;
                    return sortedSegments.map(segment => (
                      <SegmentCard
                        key={segment.id}
                        segment={segment}
                        vulnerabilityLevel={segment.vulnerabilityLevel}
                        widthPercent={(segment.populationPercent / maxPercent) * 100}
                        onSegmentClick={onSegmentClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                      />
                    ));
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {isTooltipVisible && displayedSegment && (
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
