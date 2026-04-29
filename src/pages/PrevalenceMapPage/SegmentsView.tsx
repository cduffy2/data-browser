import { useState, useRef } from 'react';
import kenyaGeoJson from '../../assets/kenya.json';
import Badge1 from '../../assets/icons/1-small.png';
import Badge2 from '../../assets/icons/2-small.png';
import Badge31 from '../../assets/icons/3.1.png';
import Badge32 from '../../assets/icons/3.2.png';
import Badge4 from '../../assets/icons/4-small.png';
import Badge21 from '../../assets/icons/2.1.png';
import Badge22 from '../../assets/icons/2.2.png';
import DownloadIcon from '../../assets/icons/download-dark.svg?react';
import CancelFilledIcon from '../../assets/icons/CancelFilled.svg?react';
import SearchIcon from '../../assets/icons/Search.svg?react';
import StackedBarChartIcon from '../../assets/icons/Stacked-bar-chart.svg?react';
import PieChartIcon from '../../assets/icons/Pie-chart.svg?react';
import WarningFilledIcon from '../../assets/icons/WarningFilled.svg?react';
import { SourceDataModal } from '../../components/data-browser/SourceDataModal/SourceDataModal';
import './SegmentsView.css';

type PopulationType = 'both' | 'urban' | 'rural';
type ChartType = 'bar' | 'pie';

type SegmentKey = 'rural-4' | 'rural-3a' | 'rural-3b' | 'rural-2' | 'urban-4' | 'urban-2a' | 'urban-2b' | 'urban-1';

interface SegmentInfo {
  key: SegmentKey;
  label: string;
  shortLabel: string;
  vulnerabilityLabel: string;
  badge: string;
  color: string;
  pattern?: 'crosshatch' | 'diagonal';
  type: 'rural' | 'urban';
}

export const SEGMENTS: SegmentInfo[] = [
  { key: 'rural-4',  label: 'Rural 4',   shortLabel: 'R4',   vulnerabilityLabel: 'most vulnerable',  badge: Badge4,  color: '#FF858B', type: 'rural' },
  { key: 'rural-3a', label: 'Rural 3.1', shortLabel: 'R3.1', vulnerabilityLabel: 'more vulnerable', badge: Badge31, color: '#E594FF', pattern: 'crosshatch', type: 'rural' },
  { key: 'rural-3b', label: 'Rural 3.2', shortLabel: 'R3.2', vulnerabilityLabel: 'more vulnerable', badge: Badge32, color: '#E594FF', pattern: 'diagonal', type: 'rural' },
  { key: 'rural-2',  label: 'Rural 2',   shortLabel: 'R2',   vulnerabilityLabel: 'less vulnerable',  badge: Badge2,  color: '#4EB9F2', type: 'rural' },
  { key: 'urban-4',  label: 'Urban 4',   shortLabel: 'U4',   vulnerabilityLabel: 'most vulnerable',  badge: Badge4,  color: '#FF9FA4', type: 'urban' },
  { key: 'urban-2a', label: 'Urban 2.1', shortLabel: 'U2.1', vulnerabilityLabel: 'less vulnerable', badge: Badge21, color: '#9CD7FF', pattern: 'crosshatch', type: 'urban' },
  { key: 'urban-2b', label: 'Urban 2.2', shortLabel: 'U2.2', vulnerabilityLabel: 'less vulnerable', badge: Badge22, color: '#9CD7FF', pattern: 'diagonal', type: 'urban' },
  { key: 'urban-1',  label: 'Urban 1',   shortLabel: 'U1',   vulnerabilityLabel: 'least vulnerable', badge: Badge1,  color: '#81F3BC', type: 'urban' },
];

type RegionSegments = Record<SegmentKey, number>;

function rand(seed: number, salt: number): number {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function makeSegmentData(seed: number): RegionSegments {
  const keys: SegmentKey[] = ['rural-4', 'rural-3a', 'rural-3b', 'rural-2', 'urban-4', 'urban-2a', 'urban-2b', 'urban-1'];
  const raw = {} as RegionSegments;
  keys.forEach((k, i) => {
    const exp = 0.4 + rand(seed, i + 10) * 2.1;
    raw[k] = Math.pow(rand(seed, i), exp);
  });
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  const result = {} as RegionSegments;
  for (const k of keys) {
    result[k] = (raw[k] / total) * 100;
  }
  return result;
}

const ALL_KENYA_REGIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'UasinGishu', 'Kiambu',
  'Machakos', 'Kajiado', 'Kilifi', 'Kwale', 'TanaRiver', 'Garissa',
  'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Turkana', 'WestPokot',
  'Samburu', 'Baringo', 'Laikipia', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  "Murang'a", 'Embu', 'Kitui', 'Makueni', 'TaitaTaveta', 'Lamu',
  'Meru', 'Tharaka-Nithi', 'Bungoma', 'Busia', 'Kakamega', 'Vihiga',
  'TransNzoia', 'Nandi', 'Elgeyo-Marakwet', 'Kericho', 'Bomet',
  'Narok', 'Siaya', 'HomaBay', 'Migori', 'Kisii', 'Nyamira',
];

export const REGION_DATA: Record<string, RegionSegments> = Object.fromEntries(
  ALL_KENYA_REGIONS.map((name, i) => [name, makeSegmentData(i + 1)])
);

const coordinatesToPath = (coordinates: number[][][]): string =>
  coordinates.map(ring =>
    ring.map((coord, i) => {
      const [lng, lat] = coord;
      const x = ((lng - 33.91) / 8.02) * 320;
      const y = ((5.06 - lat) / 9.78) * 400;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ') + 'Z'
  ).join(' ');

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  regionName: string;
}

type PanelView = 'list' | 'map';

const SORTED_REGIONS = [...ALL_KENYA_REGIONS].sort((a, b) => a.localeCompare(b));

// ── Pie chart helper ──────────────────────────────────────────────────────────

interface PieSlice {
  key: SegmentKey;
  label: string;
  shortLabel: string;
  color: string;
  pattern?: 'crosshatch' | 'diagonal';
  pct: number;
  startAngle: number;
  endAngle: number;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describePieSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToXY(cx, cy, r, startAngle);
  const end = polarToXY(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function describeRingArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number): string {
  const outerStart = polarToXY(cx, cy, outerR, startAngle);
  const outerEnd = polarToXY(cx, cy, outerR, endAngle);
  const innerStart = polarToXY(cx, cy, innerR, startAngle);
  const innerEnd = polarToXY(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

interface RegionPieProps {
  region: string;
  filteredSegments: SegmentInfo[];
  populationType: PopulationType;
}

// Threshold below which labels go outside with a leader line
const INSIDE_LABEL_MIN_PCT = 11;
// The pie sits in a 170×170 box, outer ring brings it to 180×180
// SVG is rendered at 180×180 with overflow:visible for outside labels
const PIE_R = 82;        // inner pie radius
const RING_GAP = 4;      // white gap between pie and outer ring
const RING_WIDTH = 6;    // outer urban/rural band width
const RING_INNER_R = PIE_R + RING_GAP;   // gap start
const RING_OUTER_R = RING_INNER_R + RING_WIDTH; // ring outer edge — fits in ~188px
const SVG_SIZE = RING_OUTER_R * 2;       // SVG canvas matches circle

function RegionPie({ region, filteredSegments, populationType }: RegionPieProps) {
  const [hoveredSlice, setHoveredSlice] = useState<SegmentKey | null>(null);
  const data = REGION_DATA[region];
  if (!data) return null;

  const cx = SVG_SIZE / 2;
  const cy = SVG_SIZE / 2;
  const pieR = PIE_R;
  const ringInnerR = RING_INNER_R;
  const ringOuterR = RING_OUTER_R;

  // Build slices
  const total = filteredSegments.reduce((sum, s) => sum + data[s.key], 0);
  let cursor = 0;
  const slices: PieSlice[] = filteredSegments
    .filter(s => data[s.key] / total > 0.001)
    .map(s => {
      const pct = (data[s.key] / total) * 100;
      const sweep = (pct / 100) * 360;
      const slice: PieSlice = { ...s, pct, startAngle: cursor, endAngle: cursor + sweep };
      cursor += sweep;
      return slice;
    });

  // Urban/rural outer ring
  const urbanTotal = SEGMENTS.filter(s => s.type === 'urban').reduce((sum, s) => sum + data[s.key], 0);
  const ruralTotal = SEGMENTS.filter(s => s.type === 'rural').reduce((sum, s) => sum + data[s.key], 0);
  const grandTotal = urbanTotal + ruralTotal;
  const urbanSweep = (urbanTotal / grandTotal) * 360;
  const ruralSweep = (ruralTotal / grandTotal) * 360;
  const showOuterRing = populationType === 'both';

  return (
    <div className="segments-pie__region">
      <div className="segments-pie__region-title">{region}</div>
      <div className="segments-pie__chart-wrap">
        <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} overflow="visible">
          <defs>
            <pattern id={`pie-crosshatch-${region}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0,0 L8,8 M8,0 L0,8" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" />
            </pattern>
            <pattern id={`pie-diagonal-${region}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,0,0,0.22)" strokeWidth="3" />
            </pattern>
          </defs>

          {/* Solid pie slices */}
          {slices.map(slice => {
            const isHovered = hoveredSlice === slice.key;
            const patId = slice.pattern === 'crosshatch'
              ? `pie-crosshatch-${region}`
              : slice.pattern === 'diagonal'
              ? `pie-diagonal-${region}`
              : null;
            return (
              <g key={slice.key}
                onMouseEnter={() => setHoveredSlice(slice.key)}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{ cursor: 'default' }}
              >
                <path
                  d={describePieSlice(cx, cy, pieR, slice.startAngle, slice.endAngle)}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 1 : 0.9}
                />
                {patId && (
                  <path
                    d={describePieSlice(cx, cy, pieR, slice.startAngle, slice.endAngle)}
                    fill={`url(#${patId})`}
                    stroke="white"
                    strokeWidth={isHovered ? 2 : 1}
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}

          {/* Outer urban/rural ring */}
          {showOuterRing && (
            <>
              <path d={describeRingArc(cx, cy, ringOuterR, ringInnerR, 0, urbanSweep)} fill="#B3B3B3" />
              <path d={describeRingArc(cx, cy, ringOuterR, ringInnerR, urbanSweep, urbanSweep + ruralSweep)} fill="#E8A651" />
            </>
          )}

          {/* Labels */}
          {(() => {
            const edgeR = showOuterRing ? ringOuterR + 3 : pieR + 3;
            const leaderR = edgeR + 28; // where the elbow lands
            const LABEL_H = 30; // height of one label block (name + pct)
            const TICK = 14;

            // Separate inside and outside slices
            const insideSlices = slices.filter(s => s.pct >= INSIDE_LABEL_MIN_PCT);
            const outsideSlices = slices.filter(s => s.pct < INSIDE_LABEL_MIN_PCT);

            // For outside labels, compute initial elbow position, then push apart vertically
            // Split into left (angle 180–360) and right (0–180) sides
            type OutsideLabel = {
              key: string;
              shortLabel: string;
              pct: number;
              midAngle: number;
              edgePt: { x: number; y: number };
              elbowPt: { x: number; y: number };
              isRight: boolean;
              y: number; // final adjusted y
            };

            const makeOutside = (slice: PieSlice): OutsideLabel => {
              const midAngle = (slice.startAngle + slice.endAngle) / 2;
              const edgePt = polarToXY(cx, cy, edgeR, midAngle);
              const elbowPt = polarToXY(cx, cy, leaderR, midAngle);
              const isRight = elbowPt.x >= cx;
              return { key: slice.key, shortLabel: slice.shortLabel, pct: slice.pct, midAngle, edgePt, elbowPt, isRight, y: elbowPt.y };
            };

            const leftLabels = outsideSlices.filter(s => {
              const mid = (s.startAngle + s.endAngle) / 2;
              const norm = ((mid % 360) + 360) % 360;
              return norm > 180;
            }).map(makeOutside).sort((a, b) => a.elbowPt.y - b.elbowPt.y);

            const rightLabels = outsideSlices.filter(s => {
              const mid = (s.startAngle + s.endAngle) / 2;
              const norm = ((mid % 360) + 360) % 360;
              return norm <= 180;
            }).map(makeOutside).sort((a, b) => a.elbowPt.y - b.elbowPt.y);

            // Push overlapping labels apart — forward then backward pass to center the cluster
            const spread = (labels: OutsideLabel[]) => {
              // Forward pass: push down
              for (let i = 1; i < labels.length; i++) {
                if (labels[i].y - labels[i - 1].y < LABEL_H) {
                  labels[i].y = labels[i - 1].y + LABEL_H;
                }
              }
              // Backward pass: pull up so the cluster sits centred around natural positions
              for (let i = labels.length - 2; i >= 0; i--) {
                if (labels[i + 1].y - labels[i].y < LABEL_H) {
                  labels[i].y = labels[i + 1].y - LABEL_H;
                }
              }
            };
            spread(leftLabels);
            spread(rightLabels);

            const renderOutside = (lbl: OutsideLabel) => {
              const tickEndX = lbl.elbowPt.x + (lbl.isRight ? TICK : -TICK);
              const anchor = lbl.isRight ? 'start' : 'end';
              const labelX = tickEndX + (lbl.isRight ? 2 : -2);
              return (
                <g key={`lbl-${lbl.key}`} pointerEvents="none">
                  <polyline
                    points={`${lbl.edgePt.x},${lbl.edgePt.y} ${lbl.elbowPt.x},${lbl.y} ${tickEndX},${lbl.y}`}
                    fill="none"
                    stroke="#999"
                    strokeWidth="0.75"
                  />
                  <text x={labelX} y={lbl.y - 6} textAnchor={anchor} dominantBaseline="middle" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif" fill="#171a1c">
                    {lbl.shortLabel}
                  </text>
                  <text x={labelX} y={lbl.y + 6} textAnchor={anchor} dominantBaseline="middle" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif" fill="#32383e">
                    {Math.round(lbl.pct)}%
                  </text>
                </g>
              );
            };

            return (
              <>
                {insideSlices.map(slice => {
                  const midAngle = (slice.startAngle + slice.endAngle) / 2;
                  const pos = polarToXY(cx, cy, pieR * 0.58, midAngle);
                  return (
                    <g key={`lbl-${slice.key}`} pointerEvents="none" textAnchor="middle">
                      <text x={pos.x} y={pos.y - 7} dominantBaseline="middle" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif" fill="#171a1c">
                        {slice.shortLabel}
                      </text>
                      <text x={pos.x} y={pos.y + 7} dominantBaseline="middle" fontSize="10" fontWeight="500" fontFamily="Inter, sans-serif" fill="#32383e">
                        {Math.round(slice.pct)}%
                      </text>
                    </g>
                  );
                })}
                {leftLabels.map(renderOutside)}
                {rightLabels.map(renderOutside)}
              </>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SegmentsView() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(SORTED_REGIONS.slice(0, 2));
  const [panelView, setPanelView] = useState<PanelView>('list');
  const [regionSearch, setRegionSearch] = useState('');
  const [populationType, setPopulationType] = useState<PopulationType>('both');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isDataSourceOpen, setIsDataSourceOpen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{ region: string; segment: SegmentKey } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [scale, setScale] = useState(0.85);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, regionName: '' });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleRegionClick = (name: string) => {
    setSelectedRegions(prev =>
      prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]
    );
  };

  const handleMouseMove = (e: React.MouseEvent, regionName: string) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top - 40, regionName });
    }
  };

  const filteredSegments = SEGMENTS.filter(s =>
    populationType === 'both' ? true : s.type === populationType
  );

  const getBarWidth = (region: string, seg: SegmentKey): number => {
    const data = REGION_DATA[region];
    if (!data) return 0;
    const total = filteredSegments.reduce((sum, s) => sum + data[s.key], 0);
    return total > 0 ? (data[seg] / total) * 100 : 0;
  };

  const getUrbanRuralSplit = (region: string): { urbanPct: number; ruralPct: number } => {
    const data = REGION_DATA[region];
    if (!data) return { urbanPct: 50, ruralPct: 50 };
    const urbanTotal = SEGMENTS.filter(s => s.type === 'urban').reduce((sum, s) => sum + data[s.key], 0);
    const ruralTotal = SEGMENTS.filter(s => s.type === 'rural').reduce((sum, s) => sum + data[s.key], 0);
    const total = urbanTotal + ruralTotal;
    return {
      urbanPct: total > 0 ? (urbanTotal / total) * 100 : 50,
      ruralPct: total > 0 ? (ruralTotal / total) * 100 : 50,
    };
  };

  const renderRegions = (filterFn: (name: string) => boolean) =>
    (kenyaGeoJson as any).features
      .filter((f: any) => filterFn(f.properties.NAME_1))
      .flatMap((f: any) => {
        const name = f.properties.NAME_1;
        const isSelected = selectedRegions.includes(name);
        const isHovered = hoveredRegion === name;
        const fill = isSelected ? '#8DA0CB' : isHovered ? 'rgba(141,160,203,0.35)' : 'rgba(141,160,203,0.2)';
        const stroke = isHovered ? '#026acc' : '#677BA1';
        const strokeWidth = isHovered ? 2 : 0.5;

        const paths: string[] = [];
        if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach((p: number[][][]) => paths.push(coordinatesToPath(p)));
        else if (f.geometry.type === 'Polygon') paths.push(coordinatesToPath(f.geometry.coordinates));

        return paths.map((d, i) => (
          <path
            key={`${name}-${i}`}
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            className="segments-view__region"
            onClick={() => handleRegionClick(name)}
            onMouseEnter={() => setHoveredRegion(name)}
            onMouseMove={e => handleMouseMove(e, name)}
            onMouseLeave={() => {
              setHoveredRegion(null);
              setTooltip(prev => ({ ...prev, visible: false }));
            }}
          />
        ));
      });

  return (
    <div className="segments-view">
      <div className="segments-view__card">
        {/* Left: panel */}
        <div className="segments-view__map-panel">
          <div className="segments-view__map-toolbar">
            <span className="segments-view__panel-title">Select a geographic area</span>
            <div className="segments-view__panel-toggle">
              <button
                className={`segments-view__panel-toggle-btn${panelView === 'list' ? ' segments-view__panel-toggle-btn--active' : ''}`}
                onClick={() => setPanelView('list')}
              >
                List
              </button>
              <button
                className={`segments-view__panel-toggle-btn${panelView === 'map' ? ' segments-view__panel-toggle-btn--active' : ''}`}
                onClick={() => setPanelView('map')}
              >
                Map
              </button>
            </div>
          </div>

          {panelView === 'list' ? (
            <div className="segments-view__list-panel">
              <div className="segments-view__list-search-row">
                <input
                  type="text"
                  className="segments-view__list-search"
                  placeholder="Search this list"
                  value={regionSearch}
                  onChange={e => setRegionSearch(e.target.value)}
                />
                {regionSearch ? (
                  <button className="segments-view__list-search-cancel" onClick={() => setRegionSearch('')}>
                    <CancelFilledIcon className="segments-view__list-search-cancel-icon" />
                  </button>
                ) : (
                  <SearchIcon className="segments-view__list-search-icon" />
                )}
              </div>
              <div className="segments-view__list">
                {SORTED_REGIONS
                  .filter(r => r.toLowerCase().includes(regionSearch.toLowerCase()))
                  .map(region => {
                    const isChecked = selectedRegions.includes(region);
                    const q = regionSearch;
                    const idx = q ? region.toLowerCase().indexOf(q.toLowerCase()) : -1;
                    const label = idx >= 0 ? (
                      <>
                        {region.slice(0, idx)}
                        <span className="segments-view__list-match">{region.slice(idx, idx + q.length)}</span>
                        {region.slice(idx + q.length)}
                      </>
                    ) : region;
                    return (
                      <label key={region} className="segments-view__list-item">
                        <input
                          type="checkbox"
                          className="segments-view__list-checkbox"
                          checked={isChecked}
                          onChange={() => handleRegionClick(region)}
                        />
                        <span className="segments-view__list-label">{label}</span>
                      </label>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="segments-view__map-wrap" ref={mapContainerRef}>
              {selectedRegions.length > 0 && (
                <div className="segments-view__map-clear-row">
                  <button className="segments-view__clear-btn segments-view__clear-btn--floating" onClick={() => setSelectedRegions([])}>
                    Clear all
                  </button>
                </div>
              )}
              <div className="segments-view__map-area">
                <svg
                  viewBox="0 0 320 400"
                  className="segments-view__svg"
                  style={{ transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)` }}
                >
                  {renderRegions(name => name !== hoveredRegion)}
                  {hoveredRegion && renderRegions(name => name === hoveredRegion)}
                </svg>
              </div>
              <div className="segments-view__controls">
                <button className="segments-view__control-btn" onClick={() => setScale(s => Math.min(s * 1.3, 4))} aria-label="Zoom in">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
                <button className="segments-view__control-btn" onClick={() => setScale(s => Math.max(s / 1.3, 0.5))} aria-label="Zoom out">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
                <button className="segments-view__control-btn" onClick={() => { setScale(0.85); setTranslate({ x: 0, y: 0 }); }} aria-label="Reset view">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10C3 6.13401 6.13401 3 10 3C12.7614 3 15.1429 4.68519 16.2 7.09999M17 10C17 13.866 13.866 17 10 17C7.23858 17 4.85714 15.3148 3.8 12.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M17 3V7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 17V13H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              {tooltip.visible && (
                <div className="segments-view__tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                  <span className="segments-view__tooltip-text">
                    {tooltip.regionName}{selectedRegions.includes(tooltip.regionName) ? ' · selected' : ' · click to select'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: chart or empty */}
        <div className="segments-view__chart-panel">
          <div className="segments-view__toolbar">
            <div className="segments-view__pop-group">
              {(['both', 'urban', 'rural'] as PopulationType[]).map((type, i, arr) => (
                <button
                  key={type}
                  className={`segments-view__pop-btn${populationType === type ? ' segments-view__pop-btn--active' : ''}${i === 0 ? ' segments-view__pop-btn--first' : ''}${i === arr.length - 1 ? ' segments-view__pop-btn--last' : ''}`}
                  onClick={() => setPopulationType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="segments-view__chart-type-group">
              <div className="segments-view__chart-type-wrap">
                <button
                  className={`segments-view__chart-type-btn${chartType === 'bar' ? ' segments-view__chart-type-btn--active' : ''}`}
                  onClick={() => setChartType('bar')}
                  aria-label="Stacked bar charts"
                >
                  <StackedBarChartIcon className="segments-view__chart-type-icon" />
                </button>
                <div className="segments-view__chart-type-tooltip">Stacked bar charts</div>
              </div>
              <div className="segments-view__chart-type-wrap">
                <button
                  className={`segments-view__chart-type-btn${chartType === 'pie' ? ' segments-view__chart-type-btn--active' : ''}`}
                  onClick={() => setChartType('pie')}
                  aria-label="Pie charts"
                >
                  <PieChartIcon className="segments-view__chart-type-icon" />
                </button>
                <div className="segments-view__chart-type-tooltip">Pie charts</div>
              </div>
            </div>

            <button className="segments-view__download-btn" aria-label="Download">
              <span>Download</span>
              <DownloadIcon className="segments-view__download-icon" />
            </button>
          </div>

          {/* SVG pattern defs (used by bar view) */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <pattern id="sv-crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0,0 L8,8 M8,0 L0,8" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
              </pattern>
              <pattern id="sv-diagonal" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
              </pattern>
            </defs>
          </svg>

          {/* Info banner — shown in both bar and pie views */}
          {!bannerDismissed && (
            <div className="segments-view__banner">
              <WarningFilledIcon className="segments-view__banner-icon" />
              <p className="segments-view__banner-text">
                This segmentation is based on the Pathways survey, which provides valuable insights into state segment patterns. It is not designed to yield exact state-level results. Interpret this data with caution.{' '}
                <button className="segments-view__banner-link" onClick={() => setIsDataSourceOpen(true)}>View source data details</button>
              </p>
              <button className="segments-view__banner-close" onClick={() => setBannerDismissed(true)} aria-label="Dismiss">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          {selectedRegions.length === 0 ? (
            <div className="segments-view__empty">
              <p className="segments-view__empty-text">Select one or more regions to see a segment breakdown</p>
            </div>
          ) : chartType === 'bar' ? (
            <div className="segments-view__chart-area">
              {/* Scale ticks */}
              <div className="segments-view__scale">
                <div className="segments-view__scale-spacer" />
                <div className="segments-view__scale-ticks">
                  {[0, 25, 50, 75, 100].map(v => (
                    <span key={v} className="segments-view__scale-tick">{v}%</span>
                  ))}
                </div>
              </div>

              {/* Bars */}
              <div className="segments-view__bars">
                {selectedRegions.map(region => (
                  <div key={region} className="segments-view__bar-row" onMouseEnter={() => setHoveredRow(region)} onMouseLeave={() => setHoveredRow(null)}>
                    <div className="segments-view__bar-label">
                      <span>{region}</span>
                    </div>
                    <div className="segments-view__bar-stack">
                      {populationType === 'both' && (() => {
                        const { urbanPct, ruralPct } = getUrbanRuralSplit(region);
                        return (
                          <div className="segments-view__overview-bar">
                            <div style={{ width: `${urbanPct}%`, backgroundColor: '#B3B3B3' }} />
                            <div style={{ width: `${ruralPct}%`, backgroundColor: '#E8A651' }} />
                          </div>
                        );
                      })()}
                    <div className="segments-view__bar">
                      {filteredSegments.map(seg => {
                        const width = getBarWidth(region, seg.key);
                        if (width < 0.5) return null;
                        const isHovered = hoveredSegment?.region === region && hoveredSegment?.segment === seg.key;
                        const patternId = seg.pattern === 'crosshatch' ? 'sv-crosshatch' : seg.pattern === 'diagonal' ? 'sv-diagonal' : null;
                        return (
                          <div
                            key={seg.key}
                            className={`segments-view__bar-segment${isHovered ? ' segments-view__bar-segment--hovered' : ''}`}
                            style={{ width: `${width}%`, backgroundColor: seg.color, position: 'relative' }}
                            onMouseEnter={() => setHoveredSegment({ region, segment: seg.key })}
                            onMouseLeave={() => setHoveredSegment(null)}
                          >
                            {patternId && (
                              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
                              </svg>
                            )}
                            {isHovered && (
                              <div className="segments-view__segment-tooltip">
                                <span>{region} · {seg.label} · {Math.round(width)}%</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    </div>
                    <div className="segments-view__remove-slot">
                      {hoveredRow === region && (
                        <button
                          className="segments-view__remove-btn"
                          onClick={() => setSelectedRegions(prev => prev.filter(r => r !== region))}
                          aria-label={`Remove ${region}`}
                          title="Remove from view"
                        >
                          <CancelFilledIcon className="segments-view__remove-icon" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="segments-view__legend">
                {(['urban', 'rural'] as const).filter(type =>
                  populationType === 'both' || populationType === type
                ).map(type => {
                  const groupSegments = filteredSegments.filter(s => s.type === type);
                  if (groupSegments.length === 0) return null;
                  return (
                    <div key={type} className="segments-view__legend-group">
                      <div className="segments-view__legend-group-header">
                        <div className="segments-view__legend-group-swatch" style={{ backgroundColor: type === 'urban' ? '#B3B3B3' : '#E8A651' }} />
                        <span className="segments-view__legend-group-title">
                          {type === 'urban' ? 'Urban segments' : 'Rural segments'}
                        </span>
                      </div>
                      <div className="segments-view__legend-items">
                        {groupSegments.map(seg => {
                          const patternId = seg.pattern === 'crosshatch' ? 'sv-crosshatch' : seg.pattern === 'diagonal' ? 'sv-diagonal' : null;
                          return (
                            <div key={seg.key} className="segments-view__legend-item">
                              <div className="segments-view__legend-swatch" style={{ backgroundColor: seg.color, position: 'relative', overflow: 'hidden' }}>
                                {patternId && (
                                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                                    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
                                  </svg>
                                )}
                              </div>
                              <span className="segments-view__legend-label">{seg.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Pie view ── */
            <div className="segments-view__pie-area">
              {/* Pie grid */}
              <div className="segments-pie__grid">
                {selectedRegions.map(region => (
                  <RegionPie
                    key={region}
                    region={region}
                    filteredSegments={filteredSegments}
                    populationType={populationType}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="segments-view__legend">
                {(['urban', 'rural'] as const).filter(type =>
                  populationType === 'both' || populationType === type
                ).map(type => {
                  const groupSegments = filteredSegments.filter(s => s.type === type);
                  if (groupSegments.length === 0) return null;
                  return (
                    <div key={type} className="segments-view__legend-group">
                      <div className="segments-view__legend-group-header">
                        <div className="segments-view__legend-group-swatch" style={{ backgroundColor: type === 'urban' ? '#B3B3B3' : '#E8A651' }} />
                        <span className="segments-view__legend-group-title">
                          {type === 'urban' ? 'Urban segments' : 'Rural segments'}
                        </span>
                      </div>
                      <div className="segments-view__legend-items">
                        {groupSegments.map(seg => {
                          const patternId = seg.pattern === 'crosshatch' ? 'sv-pie-crosshatch' : seg.pattern === 'diagonal' ? 'sv-pie-diagonal' : null;
                          return (
                            <div key={seg.key} className="segments-view__legend-item">
                              <div className="segments-view__legend-swatch" style={{ backgroundColor: seg.color, position: 'relative', overflow: 'hidden' }}>
                                {patternId && (
                                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                                    <defs>
                                      <pattern id="sv-pie-crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
                                        <path d="M0,0 L8,8 M8,0 L0,8" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
                                      </pattern>
                                      <pattern id="sv-pie-diagonal" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                        <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
                                      </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill={`url(#${patternId})`} />
                                  </svg>
                                )}
                              </div>
                              <span className="segments-view__legend-label">{seg.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <SourceDataModal isOpen={isDataSourceOpen} onClose={() => setIsDataSourceOpen(false)} />
    </div>
  );
}
