import { useState, useRef } from 'react';
import senegalGeoJson from '../../../assets/senegal-level1.json';
import './PrevalenceMap.css';

// Dummy prevalence data for Rural-4 segment (percentage of population)
const prevalenceData: Record<string, number> = {
  'Dakar': 8,
  'Diourbel': 15,
  'Fatick': 22,
  'Kaffrine': 45,
  'Kaolack': 28,
  'Kédougou': 62,
  'Kolda': 55,
  'Louga': 12,
  'Matam': 48,
  'Saint-Louis': 18,
  'Sédhiou': 58,
  'Tambacounda': 52,
  'Thiès': 14,
  'Ziguinchor': 35,
};

// Color scale from light (low) to dark (high) - blue/purple gradient
const getColorForPrevalence = (percentage: number): string => {
  // Interpolate between light (#dfe2ea) and dark (#8da0cb)
  const lightColor = { r: 223, g: 226, b: 234 }; // #dfe2ea
  const darkColor = { r: 141, g: 160, b: 203 };  // #8da0cb

  const t = percentage / 100;
  const r = Math.round(lightColor.r + (darkColor.r - lightColor.r) * t);
  const g = Math.round(lightColor.g + (darkColor.g - lightColor.g) * t);
  const b = Math.round(lightColor.b + (darkColor.b - lightColor.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
};

// Convert GeoJSON coordinates to SVG path
const coordinatesToPath = (coordinates: number[][][]): string => {
  return coordinates.map((ring) => {
    return ring.map((coord, i) => {
      const [lng, lat] = coord;
      // Transform coordinates to SVG space
      // Senegal bounds approximately: lng -17.5 to -11.3, lat 12.3 to 16.7
      const x = ((lng + 17.5) / 6.2) * 400;
      const y = ((16.7 - lat) / 4.4) * 320;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ') + 'Z';
  }).join(' ');
};

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  regionName: string;
  percentage: number;
}

export function PrevalenceMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    regionName: '',
    percentage: 0,
  });
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.3, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.3, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent, regionName: string) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 40,
        regionName,
        percentage: prevalenceData[regionName] || 0,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="prevalence-map">
      <div className="prevalence-map__container" ref={mapContainerRef}>
        <div className="prevalence-map__legend">
          <span className="prevalence-map__legend-label">High</span>
          <div className="prevalence-map__legend-bar" />
          <span className="prevalence-map__legend-label">Low</span>
        </div>

        <div className="prevalence-map__map-area">
          <svg
            viewBox="0 0 400 320"
            className="prevalence-map__svg"
            style={{
              transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
            }}
          >
            {/* Render non-hovered regions first */}
            {(senegalGeoJson as any).features
              .filter((feature: any) => feature.properties.NAME_1 !== hoveredRegion)
              .map((feature: any) => {
                const regionName = feature.properties.NAME_1;
                const percentage = prevalenceData[regionName] || 0;
                const fillColor = getColorForPrevalence(percentage);

                // Handle MultiPolygon geometry
                const paths: string[] = [];
                if (feature.geometry.type === 'MultiPolygon') {
                  feature.geometry.coordinates.forEach((polygon: number[][][]) => {
                    paths.push(coordinatesToPath(polygon));
                  });
                } else if (feature.geometry.type === 'Polygon') {
                  paths.push(coordinatesToPath(feature.geometry.coordinates));
                }

                return paths.map((d, i) => (
                  <path
                    key={`${regionName}-${i}`}
                    d={d}
                    fill={fillColor}
                    stroke="#fff"
                    strokeWidth={1}
                    className="prevalence-map__region"
                    onMouseEnter={() => setHoveredRegion(regionName)}
                    onMouseMove={(e) => handleMouseMove(e, regionName)}
                    onMouseLeave={handleMouseLeave}
                  />
                ));
              })}
            {/* Render hovered region last (on top) */}
            {hoveredRegion && (senegalGeoJson as any).features
              .filter((feature: any) => feature.properties.NAME_1 === hoveredRegion)
              .map((feature: any) => {
                const regionName = feature.properties.NAME_1;
                const percentage = prevalenceData[regionName] || 0;
                const fillColor = getColorForPrevalence(percentage);

                // Handle MultiPolygon geometry
                const paths: string[] = [];
                if (feature.geometry.type === 'MultiPolygon') {
                  feature.geometry.coordinates.forEach((polygon: number[][][]) => {
                    paths.push(coordinatesToPath(polygon));
                  });
                } else if (feature.geometry.type === 'Polygon') {
                  paths.push(coordinatesToPath(feature.geometry.coordinates));
                }

                return paths.map((d, i) => (
                  <path
                    key={`${regionName}-${i}-hovered`}
                    d={d}
                    fill={fillColor}
                    stroke="var(--text-link)"
                    strokeWidth={2}
                    className="prevalence-map__region"
                    onMouseEnter={() => setHoveredRegion(regionName)}
                    onMouseMove={(e) => handleMouseMove(e, regionName)}
                    onMouseLeave={handleMouseLeave}
                  />
                ));
              })}
          </svg>
        </div>

        <div className="prevalence-map__controls">
          <button
            className="prevalence-map__control-btn"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="prevalence-map__control-btn"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="prevalence-map__control-btn"
            onClick={handleReset}
            aria-label="Reset view"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10C3 6.13401 6.13401 3 10 3C12.7614 3 15.1429 4.68519 16.2 7.09999M17 10C17 13.866 13.866 17 10 17C7.23858 17 4.85714 15.3148 3.8 12.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M17 3V7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 17V13H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {tooltip.visible && (
          <div
            className="prevalence-map__tooltip"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <span className="prevalence-map__tooltip-text">
              {tooltip.regionName} · {tooltip.percentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
