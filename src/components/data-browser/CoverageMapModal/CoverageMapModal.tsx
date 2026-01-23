import { useEffect, useCallback, useState, useMemo } from 'react';
import './CoverageMapModal.css';
import kenyaGeoJson from '../../../assets/kenya.json';

interface CoverageMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeoJSONFeature {
  type: string;
  properties: {
    NAME_1: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

const EXCLUDED_COUNTIES = ['Garissa', 'Mandera', 'Marsabit', 'Wajir'];

// Format county names for display (add spaces before capitals)
function formatCountyName(name: string): string {
  // Handle special cases
  const nameMap: Record<string, string> = {
    'HomaBay': 'Homa Bay',
    'TaitaTaveta': 'Taita Taveta',
    'TanaRiver': 'Tana River',
    'TransNzoia': 'Trans Nzoia',
    'UasinGishu': 'Uasin Gishu',
    'WestPokot': 'West Pokot',
    'Elgeyo-Marakwet': 'Elgeyo Marakwet',
    'Tharaka-Nithi': 'Tharaka Nithi',
    "Murang'a": "Murang'a",
  };
  return nameMap[name] || name;
}

export function CoverageMapModal({ isOpen, onClose }: CoverageMapModalProps) {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Calculate SVG bounds from GeoJSON
  const { paths, viewBox } = useMemo(() => {
    const geoData = kenyaGeoJson as GeoJSON;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // First pass: find bounds
    geoData.features.forEach((feature) => {
      const coords = feature.geometry.coordinates;
      const processCoords = (coordArray: number[][]) => {
        coordArray.forEach(([lng, lat]) => {
          minX = Math.min(minX, lng);
          maxX = Math.max(maxX, lng);
          minY = Math.min(minY, lat);
          maxY = Math.max(maxY, lat);
        });
      };

      if (feature.geometry.type === 'Polygon') {
        (coords as number[][][]).forEach(processCoords);
      } else if (feature.geometry.type === 'MultiPolygon') {
        (coords as number[][][][]).forEach(polygon => polygon.forEach(processCoords));
      }
    });

    // Add padding
    const padding = 0.5;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const width = maxX - minX;
    const height = maxY - minY;

    // Convert coordinates to SVG path
    const coordsToPath = (coordArray: number[][]): string => {
      return coordArray.map(([lng, lat], i) => {
        const x = ((lng - minX) / width) * 400;
        const y = ((maxY - lat) / height) * 400; // Flip Y axis
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(' ') + ' Z';
    };

    const pathData = geoData.features.map((feature) => {
      const countyName = feature.properties.NAME_1;
      const isExcluded = EXCLUDED_COUNTIES.includes(countyName);
      let d = '';

      if (feature.geometry.type === 'Polygon') {
        d = (feature.geometry.coordinates as number[][][]).map(coordsToPath).join(' ');
      } else if (feature.geometry.type === 'MultiPolygon') {
        d = (feature.geometry.coordinates as number[][][][])
          .flatMap(polygon => polygon.map(coordsToPath))
          .join(' ');
      }

      return {
        name: countyName,
        displayName: formatCountyName(countyName),
        d,
        isExcluded,
      };
    });

    return {
      paths: pathData,
      viewBox: `0 0 400 400`,
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  if (!isOpen) return null;

  return (
    <div className="coverage-map-modal__overlay" onClick={handleOverlayClick}>
      <div className="coverage-map-modal">
        <div className="coverage-map-modal__header">
          <h2 className="coverage-map-modal__title">Geographic coverage map</h2>
          <button className="coverage-map-modal__close" onClick={onClose} aria-label="Close modal">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M6 6L16 16M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="coverage-map-modal__content">
          <div className="coverage-map-modal__map-container">
            <svg
              viewBox={viewBox}
              className="coverage-map-modal__map"
              onMouseMove={handleMouseMove}
            >
              {/* Render non-hovered counties first */}
              {paths.filter((county) => county.name !== hoveredCounty).map((county) => (
                <path
                  key={county.name}
                  d={county.d}
                  className={`coverage-map-modal__county ${county.isExcluded ? 'coverage-map-modal__county--excluded' : 'coverage-map-modal__county--included'}`}
                  onMouseEnter={() => setHoveredCounty(county.name)}
                  onMouseLeave={() => setHoveredCounty(null)}
                />
              ))}
              {/* Render hovered county last so it appears on top */}
              {hoveredCounty && paths.filter((county) => county.name === hoveredCounty).map((county) => (
                <path
                  key={county.name}
                  d={county.d}
                  className={`coverage-map-modal__county ${county.isExcluded ? 'coverage-map-modal__county--excluded' : 'coverage-map-modal__county--included'}`}
                  onMouseEnter={() => setHoveredCounty(county.name)}
                  onMouseLeave={() => setHoveredCounty(null)}
                />
              ))}
            </svg>

            {hoveredCounty && (
              <div
                className="coverage-map-modal__tooltip"
                style={{
                  left: tooltipPosition.x + 12,
                  top: tooltipPosition.y + 12,
                }}
              >
                {formatCountyName(hoveredCounty)} - {EXCLUDED_COUNTIES.includes(hoveredCounty) ? 'Excluded' : 'Included'}
              </div>
            )}
          </div>

          <div className="coverage-map-modal__text-section">
            <h3 className="coverage-map-modal__section-title">Geographic coverage</h3>
            <p className="coverage-map-modal__text">
              The Pathways Kenya survey used a stratified design by rural/urban residence, covering data from 43 counties, excluding <strong>Garissa</strong>, <strong>Mandera</strong>, <strong>Marsabit</strong>, and <strong>Wajir</strong> counties.
            </p>
            <p className="coverage-map-modal__text">
              Therefore, it is representative at the rural/urban level within the sampled areas, but not subnationally representative.
            </p>
          </div>
        </div>

        <div className="coverage-map-modal__footer">
          <button className="coverage-map-modal__button" onClick={onClose}>
            Close this window
          </button>
        </div>
      </div>
    </div>
  );
}
