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

// 10-step colour scales per vulnerability level, 050→900
const SCALES: Record<string, string[]> = {
  most:  ['#F6E8E9','#FFD6D8','#FFB2B6','#FF9FA4','#FF858B','#FE4656','#C92440','#A01D42','#690133','#3A011C'],
  more:  ['#F1E6F4','#F7DBFF','#F0C4FF','#EBAEFF','#E594FF','#C254FA','#9130C9','#7E2BB8','#6F22A8','#290445'],
  less:  ['#E5F0F8','#D9F0FF','#C2E6FF','#9CD7FF','#4EB9F2','#04A1E6','#026ACC','#0038AE','#001E5E','#000C24'],
  least: ['#DAEEE3','#C9F2DC','#B5F7D7','#81F3BC','#57D988','#00BE48','#009C3B','#16703E','#003D1B','#002E14'],
};

// Map segment key to vulnerability scale
const SEGMENT_SCALE: Record<string, string> = {
  'urban-4':  'most',
  'rural-4':  'most',
  'urban-2a': 'less',
  'urban-2b': 'less',
  'rural-2':  'less',
  'rural-3a': 'more',
  'rural-3b': 'more',
  'urban-1':  'least',
};

// Also keep colorDark for the legend gradient
const SEGMENT_COLORS: Record<string, { colorLight: string; colorDark: string }> = {
  'urban-1':  { colorLight: SCALES.least[0], colorDark: SCALES.least[9] },
  'urban-2a': { colorLight: SCALES.less[0],  colorDark: SCALES.less[9] },
  'urban-2b': { colorLight: SCALES.less[0],  colorDark: SCALES.less[9] },
  'urban-4':  { colorLight: SCALES.most[0],  colorDark: SCALES.most[9] },
  'rural-2':  { colorLight: SCALES.less[0],  colorDark: SCALES.less[9] },
  'rural-3a': { colorLight: SCALES.more[0],  colorDark: SCALES.more[9] },
  'rural-3b': { colorLight: SCALES.more[0],  colorDark: SCALES.more[9] },
  'rural-4':  { colorLight: SCALES.most[0],  colorDark: SCALES.most[9] },
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


const getDominantSegment = (regionName: string, selectedKeys: string[]): { key: string; pct: number } | null => {
  const data = REGION_DATA[regionName];
  if (!data || selectedKeys.length === 0) return null;
  let dominantKey = selectedKeys[0];
  let dominantPct = data[selectedKeys[0] as keyof typeof data] ?? 0;
  for (const key of selectedKeys.slice(1)) {
    const pct = data[key as keyof typeof data] ?? 0;
    if (pct > dominantPct) { dominantPct = pct; dominantKey = key; }
  }
  return { key: dominantKey, pct: dominantPct };
};

const getDominantColor = (regionName: string, selectedKeys: string[], maxPct: number): string => {
  const dominant = getDominantSegment(regionName, selectedKeys);
  if (!dominant) return '#e8e8e8';
  const scale = SCALES[SEGMENT_SCALE[dominant.key]];
  if (!scale) return '#e8e8e8';
  // Map relative intensity (0→1) to scale steps 0→9
  const t = maxPct > 0 ? dominant.pct / maxPct : 0;
  const index = Math.round(t * 9);
  return scale[index];
};

export function PrevalenceMapSection({ mode }: PrevalenceMapSectionProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>(['urban-1']);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, regionName: '', percentage: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const toggleSegment = (key: string) => {
    setSelectedSegments(prev =>
      prev.includes(key)
        ? prev.length > 1 ? prev.filter(k => k !== key) : prev // keep at least one selected
        : [...prev, key]
    );
  };

  const maxPct = Object.keys(REGION_DATA).reduce((max, regionName) => {
    const dominant = getDominantSegment(regionName, selectedSegments);
    return dominant ? Math.max(max, dominant.pct) : max;
  }, 0);

  const getTooltipText = (regionName: string): string => {
    const dominant = getDominantSegment(regionName, selectedSegments);
    if (!dominant) return regionName;
    const seg = SEGMENTS.find(s => s.key === dominant.key);
    const label = selectedSegments.length === 1 ? seg?.label ?? dominant.key : `${seg?.label ?? dominant.key} is dominant`;
    return `${regionName} · ${label} · ${Math.round(dominant.pct)}%`;
  };

  const handleMouseMove = (e: React.MouseEvent, regionName: string) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top - 40, regionName, percentage: 0 });
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
        const fill = getDominantColor(name, selectedSegments, maxPct);
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

  // Legend: single segment shows its gradient; multiple shows a note
  const singleColors = selectedSegments.length === 1 ? SEGMENT_COLORS[selectedSegments[0]] : null;

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
                {group.items.map(seg => {
                  const isChecked = selectedSegments.includes(seg.key);
                  return (
                    <label key={seg.key} className={`prevalence-map-section__checkbox-row${isChecked ? ' prevalence-map-section__checkbox-row--active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSegment(seg.key)}
                        className="prevalence-map-section__checkbox"
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
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="prevalence-map-section__right">
          <div className="prevalence-map-section__toolbar">
            <button className="prevalence-map-section__download-btn" aria-label="Download">
              <span>Download</span>
              <DownloadIcon className="prevalence-map-section__download-icon" />
            </button>
          </div>

          {/* Map */}
          <div className="prevalence-map-section__map-wrap" ref={mapContainerRef}>
            {singleColors && (
              <div className="prevalence-map-section__legend">
                <span className="prevalence-map-section__legend-label">High</span>
                <div className="prevalence-map-section__legend-bar" style={{ background: `linear-gradient(to bottom, ${singleColors.colorDark}, ${singleColors.colorLight})` }} />
                <span className="prevalence-map-section__legend-label">Low</span>
              </div>
            )}
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
        </div>
      </div>
    </div>
  );
}
