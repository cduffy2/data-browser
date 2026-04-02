import { useState, useRef } from 'react';
import kenyaGeoJson from '../../assets/kenya.json';
import Badge1 from '../../assets/icons/1-small.png';
import Badge2 from '../../assets/icons/2-small.png';
import Badge3a from '../../assets/icons/3a-small.png';
import Badge3b from '../../assets/icons/3b-small.png';
import Badge4 from '../../assets/icons/4-small.png';
import Badge2a from '../../assets/icons/2a-small.png';
import Badge2b from '../../assets/icons/2b-small.png';
import DownloadIcon from '../../assets/icons/download-dark.svg?react';
import CancelFilledIcon from '../../assets/icons/CancelFilled.svg?react';
import './SegmentsView.css';

type PopulationType = 'both' | 'urban' | 'rural';

type SegmentKey = 'rural-4' | 'rural-3a' | 'rural-3b' | 'rural-2' | 'urban-4' | 'urban-2a' | 'urban-2b' | 'urban-1';

interface SegmentInfo {
  key: SegmentKey;
  label: string;
  vulnerabilityLabel: string;
  badge: string;
  color: string;
  pattern?: 'crosshatch' | 'diagonal';
  type: 'rural' | 'urban';
}

export const SEGMENTS: SegmentInfo[] = [
  { key: 'rural-4',  label: 'Rural 4',  vulnerabilityLabel: 'most vulnerable',  badge: Badge4,  color: '#FF858B', type: 'rural' },
  { key: 'rural-3a', label: 'Rural 3a', vulnerabilityLabel: 'more vulnerable', badge: Badge3a, color: '#E594FF', pattern: 'crosshatch', type: 'rural' },
  { key: 'rural-3b', label: 'Rural 3b', vulnerabilityLabel: 'more vulnerable', badge: Badge3b, color: '#E594FF', pattern: 'diagonal', type: 'rural' },
  { key: 'rural-2',  label: 'Rural 2',  vulnerabilityLabel: 'less vulnerable',  badge: Badge2,  color: '#4EB9F2', type: 'rural' },
  { key: 'urban-4',  label: 'Urban 4',  vulnerabilityLabel: 'most vulnerable',  badge: Badge4,  color: '#FF9FA4', type: 'urban' },
  { key: 'urban-2a', label: 'Urban 2a', vulnerabilityLabel: 'less vulnerable', badge: Badge2a, color: '#9CD7FF', pattern: 'crosshatch', type: 'urban' },
  { key: 'urban-2b', label: 'Urban 2b', vulnerabilityLabel: 'less vulnerable', badge: Badge2b, color: '#9CD7FF', pattern: 'diagonal', type: 'urban' },
  { key: 'urban-1',  label: 'Urban 1',  vulnerabilityLabel: 'least vulnerable', badge: Badge1,  color: '#81F3BC', type: 'urban' },
];

type RegionSegments = Record<SegmentKey, number>;

// Generate normalised dummy segment data per region
function makeSegmentData(seed: number): RegionSegments {
  const raw: RegionSegments = {
    'rural-4': 5 + ((seed * 13) % 20),
    'rural-3a': 5 + ((seed * 7) % 18),
    'rural-3b': 3 + ((seed * 11) % 15),
    'rural-2': 4 + ((seed * 17) % 18),
    'urban-4': 2 + ((seed * 5) % 12),
    'urban-2a': 4 + ((seed * 19) % 16),
    'urban-2b': 3 + ((seed * 3) % 14),
    'urban-1': 5 + ((seed * 23) % 20),
  };
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  const result = {} as RegionSegments;
  for (const k of Object.keys(raw) as SegmentKey[]) {
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

export function SegmentsView() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [panelView, setPanelView] = useState<PanelView>('list');
  const [regionSearch, setRegionSearch] = useState('');
  const [populationType, setPopulationType] = useState<PopulationType>('both');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{ region: string; segment: SegmentKey } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
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
        const stroke = '#677BA1';
        const strokeWidth = 0.5;

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
                  type="search"
                  className="segments-view__list-search"
                  placeholder="Search areas…"
                  value={regionSearch}
                  onChange={e => setRegionSearch(e.target.value)}
                />
                {selectedRegions.length > 0 && (
                  <button className="segments-view__clear-btn" onClick={() => setSelectedRegions([])}>
                    Clear all
                  </button>
                )}
              </div>
              <div className="segments-view__list">
                {SORTED_REGIONS
                  .filter(r => r.toLowerCase().includes(regionSearch.toLowerCase()))
                  .map(region => {
                    const isChecked = selectedRegions.includes(region);
                    return (
                      <label key={region} className="segments-view__list-item">
                        <input
                          type="checkbox"
                          className="segments-view__list-checkbox"
                          checked={isChecked}
                          onChange={() => handleRegionClick(region)}
                        />
                        <span className="segments-view__list-label">{region}</span>
                      </label>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="segments-view__map-wrap" ref={mapContainerRef}>
              {selectedRegions.length > 0 && (
                <div className="segments-view__map-clear-row">
                  <button className="segments-view__clear-btn" onClick={() => setSelectedRegions([])}>
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
                <button className="segments-view__control-btn" onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); }} aria-label="Reset view">
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
            <button className="segments-view__download-btn" aria-label="Download">
              <span>Download</span>
              <DownloadIcon className="segments-view__download-icon" />
            </button>
          </div>

          {/* SVG pattern defs */}
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

          {selectedRegions.length === 0 ? (
            <div className="segments-view__empty">
              <p className="segments-view__empty-text">Select one or more regions to see a segment breakdown</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
