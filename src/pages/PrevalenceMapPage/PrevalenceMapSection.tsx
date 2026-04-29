import { useState, useRef } from 'react';
import kenyaGeoJson from '../../assets/kenya.json';
import { SegmentsView, REGION_DATA } from './SegmentsView';
import Badge1 from '../../assets/icons/1-small.png';
import Badge2 from '../../assets/icons/2-small.png';
import Badge3 from '../../assets/icons/3-small.png';
import Badge4 from '../../assets/icons/4-small.png';
import DownloadIcon from '../../assets/icons/download-dark.svg?react';
import './PrevalenceMapSection.css';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  regionName: string;
}

// 10-step opacity scales per vulnerability level (base colour at 10%→100% opacity over white)
const SCALES: Record<string, string[]> = {
  most:  ['rgba(254,70,86,0.10)','rgba(254,70,86,0.20)','rgba(254,70,86,0.30)','rgba(254,70,86,0.40)','rgba(254,70,86,0.50)','rgba(254,70,86,0.60)','rgba(254,70,86,0.70)','rgba(254,70,86,0.80)','rgba(254,70,86,0.90)','rgba(254,70,86,1.00)'],
  more:  ['rgba(194,84,250,0.10)','rgba(194,84,250,0.20)','rgba(194,84,250,0.30)','rgba(194,84,250,0.40)','rgba(194,84,250,0.50)','rgba(194,84,250,0.60)','rgba(194,84,250,0.70)','rgba(194,84,250,0.80)','rgba(194,84,250,0.90)','rgba(194,84,250,1.00)'],
  less:  ['rgba(4,161,230,0.10)','rgba(4,161,230,0.20)','rgba(4,161,230,0.30)','rgba(4,161,230,0.40)','rgba(4,161,230,0.50)','rgba(4,161,230,0.60)','rgba(4,161,230,0.70)','rgba(4,161,230,0.80)','rgba(4,161,230,0.90)','rgba(4,161,230,1.00)'],
  least: ['rgba(0,190,72,0.10)','rgba(0,190,72,0.20)','rgba(0,190,72,0.30)','rgba(0,190,72,0.40)','rgba(0,190,72,0.50)','rgba(0,190,72,0.60)','rgba(0,190,72,0.70)','rgba(0,190,72,0.80)','rgba(0,190,72,0.90)','rgba(0,190,72,1.00)'],
};

const LEVEL_SEGMENTS: Record<number, { urban: string[]; rural: string[] }> = {
  4: { urban: ['urban-4'],              rural: ['rural-4'] },
  3: { urban: [],                       rural: ['rural-3a', 'rural-3b'] },
  2: { urban: ['urban-2a', 'urban-2b'], rural: ['rural-2'] },
  1: { urban: ['urban-1'],              rural: [] },
};

// Human-readable label for a segment key
const segmentLabel = (key: string): string => {
  const map: Record<string, string> = {
    'urban-4': 'Urban 4', 'rural-4': 'Rural 4',
    'rural-3a': 'Rural 3.1', 'rural-3b': 'Rural 3.2',
    'urban-2a': 'Urban 2.1', 'urban-2b': 'Urban 2.2', 'rural-2': 'Rural 2',
    'urban-1': 'Urban 1',
  };
  return map[key] ?? key;
};

interface ToggleOptions {
  allOption: { value: string; label: string } | null;
  segmentOptions: { value: string; label: string }[];
}

const buildToggleOptions = (level: number): ToggleOptions => {
  const { urban, rural } = LEVEL_SEGMENTS[level];
  const all = [...urban, ...rural];
  if (all.length === 0) return { allOption: null, segmentOptions: [] };
  return {
    allOption: { value: 'all', label: 'All segments' },
    segmentOptions: all.map(k => ({ value: k, label: segmentLabel(k) })),
  };
};

const LEVELS = [
  { level: 4, label: 'Most vulnerable',  badge: Badge4, scale: 'most' },
  { level: 3, label: 'More vulnerable',  badge: Badge3, scale: 'more' },
  { level: 2, label: 'Less vulnerable',  badge: Badge2, scale: 'less' },
  { level: 1, label: 'Least vulnerable', badge: Badge1, scale: 'least' },
] as const;

const coordinatesToPath = (coordinates: number[][][]): string =>
  coordinates.map((ring) =>
    ring.map((coord, i) => {
      const [lng, lat] = coord;
      const x = ((lng - 33.91) / 8.02) * 320;
      const y = ((5.06 - lat) / 9.78) * 400;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ') + 'Z'
  ).join(' ');

interface PrevalenceMapSectionProps {
  mode: 'vulnerability' | 'segments';
}

const getSummedPct = (regionName: string, keys: string[]): number => {
  const data = REGION_DATA[regionName];
  if (!data || keys.length === 0) return 0;
  return keys.reduce((sum, key) => sum + (data[key as keyof typeof data] ?? 0), 0);
};

const getColor = (regionName: string, keys: string[], maxPct: number, scale: string): string => {
  if (keys.length === 0 || maxPct === 0) return '#e8e8e8';
  const pct = getSummedPct(regionName, keys);
  const t = pct / maxPct;
  const index = Math.round(t * 9);
  return SCALES[scale][index];
};

export function PrevalenceMapSection({ mode }: PrevalenceMapSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(4);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['all']);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, regionName: '' });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const toggleOptions = buildToggleOptions(selectedLevel);

  // Derive which segment keys to show on the map
  const { urban, rural } = LEVEL_SEGMENTS[selectedLevel];
  const allKeys = [...urban, ...rural];

  const isAllSelected = selectedKeys.includes('all');
  const selectedSegments = isAllSelected ? allKeys : selectedKeys.filter(k => allKeys.includes(k));

  const activeScale = LEVELS.find(l => l.level === selectedLevel)?.scale ?? 'most';

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
    setSelectedKeys(['all']);
  };

  const handleToggle = (value: string, allSegmentKeys: string[]) => {
    if (value === 'all') {
      setSelectedKeys(['all']);
      return;
    }
    setSelectedKeys(prev => {
      // 1 or 2 segments: single-select only
      if (allSegmentKeys.length <= 2) {
        return [value];
      }
      // 3+ segments: multi-select
      const current = prev.includes('all') ? [] : prev.filter(k => allSegmentKeys.includes(k));
      const next = current.includes(value)
        ? current.filter(k => k !== value)
        : [...current, value];
      if (next.length === 0) return ['all'];
      return next;
    });
  };

  const maxPct = Object.keys(REGION_DATA).reduce((max, name) =>
    Math.max(max, getSummedPct(name, selectedSegments)), 0);

  const getSegmentPhrase = (keys: string[]): string => {
    if (keys.length === 0) return '';
    const labelMap: Record<string, string> = {
      'urban-4': 'Urban 4', 'rural-4': 'Rural 4',
      'rural-3a': 'Rural 3.1', 'rural-3b': 'Rural 3.2',
      'urban-2a': 'Urban 2.1', 'urban-2b': 'Urban 2.2', 'rural-2': 'Rural 2',
      'urban-1': 'Urban 1',
    };
    return keys.map(k => labelMap[k] ?? k).join(' and ');
  };

  const getTooltipText = (regionName: string): string => {
    if (selectedSegments.length === 0) return regionName;
    const pct = getSummedPct(regionName, selectedSegments);
    const lvl = LEVELS.find(l => l.level === selectedLevel);
    const vulLabel = (lvl?.label ?? '').toLowerCase();
    const isFullSet = selectedSegments.length === allKeys.length;
    if (isFullSet) return `${regionName} · ${Math.round(pct)}% ${vulLabel}`;
    const segPhrase = getSegmentPhrase(selectedSegments);
    return `${regionName} · ${Math.round(pct)}% ${segPhrase} ${vulLabel}`;
  };

  const handleMouseMove = (e: React.MouseEvent, regionName: string) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top - 40, regionName });
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const renderRegions = (filterFn: (name: string) => boolean) =>
    (kenyaGeoJson as any).features
      .filter((f: any) => filterFn(f.properties.NAME_1))
      .flatMap((f: any) => {
        const name = f.properties.NAME_1;
        const fill = getColor(name, selectedSegments, maxPct, activeScale);
        const paths: string[] = [];
        if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach((p: number[][][]) => paths.push(coordinatesToPath(p)));
        else if (f.geometry.type === 'Polygon') paths.push(coordinatesToPath(f.geometry.coordinates));
        return paths.map((d, i) => (
          <path
            key={`${name}-${i}${name === hoveredRegion ? '-h' : ''}`}
            d={d}
            fill={fill}
            stroke={name === hoveredRegion ? 'var(--text-link, #026ACC)' : '#fff'}
            strokeWidth={name === hoveredRegion ? 2 : 1}
            className="prevalence-map-section__region"
            onMouseEnter={() => setHoveredRegion(name)}
            onMouseMove={e => handleMouseMove(e, name)}
            onMouseLeave={handleMouseLeave}
          />
        ));
      });

  if (mode === 'segments') {
    return <SegmentsView />;
  }

  return (
    <div className="prevalence-map-section">
      <div className="prevalence-map-section__card">
        {/* Left panel */}
        <div className="prevalence-map-section__left">
          <div className="prevalence-map-section__segment-groups">
            {LEVELS.map(lvl => {
              const isSelected = selectedLevel === lvl.level;
              return (
                <label key={lvl.level} className={`prevalence-map-section__checkbox-row${isSelected ? ' prevalence-map-section__checkbox-row--active' : ''}`}>
                  <input
                    type="radio"
                    name="level"
                    value={lvl.level}
                    checked={isSelected}
                    onChange={() => handleLevelChange(lvl.level)}
                    className="prevalence-map-section__checkbox"
                  />
                  <img src={lvl.badge} alt={String(lvl.level)} className="prevalence-map-section__badge" />
                  <span className="prevalence-map-section__checkbox-label">{lvl.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="prevalence-map-section__right">
          <div className="prevalence-map-section__toolbar">
            <div className="prevalence-map-section__toolbar-controls">
              {(toggleOptions.allOption || toggleOptions.segmentOptions.length > 0) && (
                <div className="prevalence-map-section__toolbar-toggle">
                  {toggleOptions.allOption && (
                    <div className="prevalence-map-section__pop-group">
                      <button
                        className={`prevalence-map-section__pop-btn${isAllSelected ? ' prevalence-map-section__pop-btn--active' : ''}`}
                        onClick={() => handleToggle('all', allKeys)}
                      >
                        {toggleOptions.allOption.label}
                      </button>
                    </div>
                  )}
                  {toggleOptions.segmentOptions.length > 0 && (
                    <div className="prevalence-map-section__pop-group">
                      {toggleOptions.segmentOptions.map(opt => {
                        const isActive = !isAllSelected && selectedKeys.includes(opt.value);
                        const isSingleOption = !toggleOptions.allOption && toggleOptions.segmentOptions.length === 1;
                        return (
                          <button
                            key={opt.value}
                            className={`prevalence-map-section__pop-btn${isActive || isSingleOption ? ' prevalence-map-section__pop-btn--active' : ''}`}
                            onClick={() => handleToggle(opt.value, allKeys)}
                            style={isSingleOption ? { cursor: 'default' } : undefined}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="prevalence-map-section__download-btn" aria-label="Download">
              <span>Download</span>
              <DownloadIcon className="prevalence-map-section__download-icon" />
            </button>
          </div>

          {/* Map */}
          <div className="prevalence-map-section__map-wrap" ref={mapContainerRef}>
            <div className="prevalence-map-section__map-area">
              <svg
                viewBox="0 0 320 400"
                className="prevalence-map-section__svg"
                style={{ transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)` }}
              >
                {renderRegions(name => name !== hoveredRegion)}
                {hoveredRegion && renderRegions(name => name === hoveredRegion)}
              </svg>
            </div>
            <div className="prevalence-map-section__controls">
              <button className="prevalence-map-section__control-btn" onClick={() => setScale(s => Math.min(s * 1.3, 4))} aria-label="Zoom in">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              <button className="prevalence-map-section__control-btn" onClick={() => setScale(s => Math.max(s / 1.3, 0.5))} aria-label="Zoom out">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              <button className="prevalence-map-section__control-btn" onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); }} aria-label="Reset view">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10C3 6.13401 6.13401 3 10 3C12.7614 3 15.1429 4.68519 16.2 7.09999M17 10C17 13.866 13.866 17 10 17C7.23858 17 4.85714 15.3148 3.8 12.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M17 3V7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 17V13H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            {tooltip.visible && (
              <div className="prevalence-map-section__tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                <span className="prevalence-map-section__tooltip-text">
                  {getTooltipText(tooltip.regionName)}
                </span>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="prevalence-map-section__legend">
            <span className="prevalence-map-section__legend-hint">Lighter = less prevalent relative to other regions</span>
            <div className="prevalence-map-section__legend-scales">
              <div className="prevalence-map-section__legend-scale">
                <span className="prevalence-map-section__legend-scale-label">
                  {LEVELS.find(l => l.level === selectedLevel)?.label}
                </span>
                <div
                  className="prevalence-map-section__legend-bar"
                  style={{ background: `linear-gradient(to right, ${SCALES[activeScale].join(', ')})` }}
                />
                <div className="prevalence-map-section__legend-scale-range">
                  <span className="prevalence-map-section__legend-label">Low</span>
                  <span className="prevalence-map-section__legend-label">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
