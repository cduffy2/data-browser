import { useState, useRef } from 'react';
import kenyaGeoJson from '../../assets/kenya.json';
import { SegmentsView, SEGMENTS, REGION_DATA } from './SegmentsView';
import DownloadIcon from '../../assets/icons/download-dark.svg?react';
import './PrevalenceMapSection.css';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  regionName: string;
  percentage: number;
}

// Colour palette per segment key (light → dark for map interpolation)
const SEGMENT_COLORS: Record<string, { colorLight: string; colorDark: string }> = {
  'urban-1':  { colorLight: '#81F3BC', colorDark: '#00492C' },
  'urban-2a': { colorLight: '#9CD7FF', colorDark: '#001E5E' },
  'urban-2b': { colorLight: '#9CD7FF', colorDark: '#001E5E' },
  'urban-4':  { colorLight: '#FF9FA4', colorDark: '#5C0229' },
  'rural-2':  { colorLight: '#4EB9F2', colorDark: '#001E5E' },
  'rural-3a': { colorLight: '#E594FF', colorDark: '#290445' },
  'rural-3b': { colorLight: '#E594FF', colorDark: '#290445' },
  'rural-4':  { colorLight: '#FF858B', colorDark: '#5C0229' },
};

const getColor = (percentage: number, colorLight: string, colorDark: string): string => {
  const parseHex = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });
  const light = parseHex(colorLight);
  const dark = parseHex(colorDark);
  const t = percentage / 100;
  return `rgb(${Math.round(light.r + (dark.r - light.r) * t)},${Math.round(light.g + (dark.g - light.g) * t)},${Math.round(light.b + (dark.b - light.b) * t)})`;
};

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

export function PrevalenceMapSection({ mode }: PrevalenceMapSectionProps) {
  const [selectedSegment, setSelectedSegment] = useState<string>('urban-1');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, regionName: '', percentage: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const segmentInfo = SEGMENTS.find(s => s.key === selectedSegment)!;
  const colors = SEGMENT_COLORS[selectedSegment] ?? { colorLight: '#ccc', colorDark: '#333' };

  const getRegionPct = (regionName: string): number => {
    const data = REGION_DATA[regionName];
    if (!data) return 0;
    return data[selectedSegment as keyof typeof data] ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent, regionName: string) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top - 40, regionName, percentage: Math.round(getRegionPct(regionName)) });
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
        const pct = getRegionPct(name);
        const fill = getColor(pct, colors.colorLight, colors.colorDark);
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

  const urbanSegments = SEGMENTS.filter(s => s.type === 'urban');
  const ruralSegments = SEGMENTS.filter(s => s.type === 'rural');

  return (
    <div className="prevalence-map-section">
      <div className="prevalence-map-section__card">
        {/* Left panel */}
        <div className="prevalence-map-section__left">
          <div className="prevalence-map-section__left-title">
            <span>Select a segment</span>
          </div>
          <div className="prevalence-map-section__segment-groups">
            {[{ label: 'Urban segments', items: urbanSegments }, { label: 'Rural segments', items: ruralSegments }].map(group => (
              <div key={group.label} className="prevalence-map-section__segment-group">
                <span className="prevalence-map-section__segment-group-label">{group.label}</span>
                {group.items.map(seg => (
                  <label key={seg.key} className={`prevalence-map-section__checkbox-row${selectedSegment === seg.key ? ' prevalence-map-section__checkbox-row--active' : ''}`}>
                    <input
                      type="radio"
                      name="segment"
                      checked={selectedSegment === seg.key}
                      onChange={() => setSelectedSegment(seg.key)}
                      className="prevalence-map-section__radio"
                    />
                    <img
                      src={seg.badge}
                      alt=""
                      className="prevalence-map-section__badge"
                      style={['urban-2a', 'urban-2b', 'rural-3a', 'rural-3b'].includes(seg.key) ? { width: 32, height: 24 } : undefined}
                    />
                    <span className="prevalence-map-section__checkbox-label">
                      <strong className="prevalence-map-section__checkbox-label-type">{seg.type === 'urban' ? 'Urban' : 'Rural'}</strong>
                      {' '}{seg.vulnerabilityLabel}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="prevalence-map-section__right">
          {/* Toolbar */}
          <div className="prevalence-map-section__toolbar">
            <button className="prevalence-map-section__download-btn" aria-label="Download">
              <span>Download</span>
              <DownloadIcon className="prevalence-map-section__download-icon" />
            </button>
          </div>

          {/* Map */}
          <div className="prevalence-map-section__map-wrap" ref={mapContainerRef}>
            <div className="prevalence-map-section__legend">
              <span className="prevalence-map-section__legend-label">High</span>
              <div className="prevalence-map-section__legend-bar" style={{ background: `linear-gradient(to bottom, ${colors.colorDark}, ${colors.colorLight})` }} />
              <span className="prevalence-map-section__legend-label">Low</span>
            </div>
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
                  {tooltip.regionName} · {tooltip.percentage}% of the population is {segmentInfo ? `${segmentInfo.type} ${segmentInfo.vulnerabilityLabel}` : selectedSegment}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
