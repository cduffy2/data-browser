import { useState, useRef } from 'react';
import kenyaGeoJson from '../../assets/kenya.json';
import Badge1 from '../../assets/icons/1-small.png';
import Badge2 from '../../assets/icons/2-small.png';
import Badge3 from '../../assets/icons/3-small.png';
import Badge4 from '../../assets/icons/4-small.png';
import DownloadIcon from '../../assets/icons/download-dark.svg?react';
import './PrevalenceMapSection.css';

type VulnerabilityLevel = 'most' | 'more' | 'less' | 'least';
type PopulationType = 'both' | 'urban' | 'rural';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  regionName: string;
  percentage: number;
}

// Dummy prevalence data per vulnerability level + population type
const prevalenceData: Record<VulnerabilityLevel, Record<PopulationType, Record<string, number>>> = {
  most: {
    both: {
      Nairobi: 2, Mombasa: 4, Kisumu: 3, Nakuru: 5, 'Uasin Gishu': 4, Kiambu: 2,
      Machakos: 6, Kajiado: 8, Kilifi: 12, Kwale: 10, 'Tana River': 35,
      Garissa: 78, Wajir: 82, Mandera: 45, Marsabit: 38, Isiolo: 28,
      Turkana: 32, 'West Pokot': 18, Samburu: 22, Baringo: 12, Laikipia: 8,
      Nyandarua: 4, Nyeri: 3, Kirinyaga: 3, Muranga: 4, Embu: 6,
      Kitui: 15, Makueni: 10, 'Taita Taveta': 8, Lamu: 18, Meru: 7,
      'Tharaka-Nithi': 9, Bungoma: 6, Busia: 5, Kakamega: 5, Vihiga: 4,
      'Trans Nzoia': 6, Nandi: 5, 'Elgeyo-Marakwet': 8, Kericho: 4, Bomet: 6,
      Narok: 14, Siaya: 5, 'Homa Bay': 6, Migori: 7, Kisii: 4, Nyamira: 4,
    },
    urban: {
      Nairobi: 3, Mombasa: 7, Kisumu: 5, Nakuru: 4, 'Uasin Gishu': 6, Kiambu: 3,
      Machakos: 5, Kajiado: 6, Kilifi: 8, Kwale: 7, 'Tana River': 15,
      Garissa: 42, Wajir: 38, Mandera: 28, Marsabit: 18, Isiolo: 14,
      Turkana: 12, 'West Pokot': 8, Samburu: 10, Baringo: 6, Laikipia: 5,
      Nyandarua: 3, Nyeri: 4, Kirinyaga: 3, Muranga: 3, Embu: 4,
      Kitui: 8, Makueni: 6, 'Taita Taveta': 5, Lamu: 9, Meru: 5,
      'Tharaka-Nithi': 5, Bungoma: 4, Busia: 4, Kakamega: 4, Vihiga: 3,
      'Trans Nzoia': 4, Nandi: 4, 'Elgeyo-Marakwet': 5, Kericho: 3, Bomet: 4,
      Narok: 7, Siaya: 4, 'Homa Bay': 4, Migori: 5, Kisii: 3, Nyamira: 3,
    },
    rural: {
      Nairobi: 1, Mombasa: 2, Kisumu: 2, Nakuru: 6, 'Uasin Gishu': 3, Kiambu: 1,
      Machakos: 8, Kajiado: 10, Kilifi: 16, Kwale: 13, 'Tana River': 52,
      Garissa: 88, Wajir: 91, Mandera: 58, Marsabit: 50, Isiolo: 38,
      Turkana: 45, 'West Pokot': 26, Samburu: 32, Baringo: 16, Laikipia: 11,
      Nyandarua: 5, Nyeri: 3, Kirinyaga: 3, Muranga: 5, Embu: 8,
      Kitui: 20, Makueni: 14, 'Taita Taveta': 11, Lamu: 25, Meru: 9,
      'Tharaka-Nithi': 12, Bungoma: 8, Busia: 7, Kakamega: 7, Vihiga: 5,
      'Trans Nzoia': 8, Nandi: 7, 'Elgeyo-Marakwet': 11, Kericho: 5, Bomet: 8,
      Narok: 20, Siaya: 7, 'Homa Bay': 8, Migori: 10, Kisii: 5, Nyamira: 5,
    },
  },
  more: {
    both: {
      Nairobi: 15, Mombasa: 18, Kisumu: 22, Nakuru: 28, 'Uasin Gishu': 24, Kiambu: 12,
      Machakos: 32, Kajiado: 20, Kilifi: 38, Kwale: 35, 'Tana River': 55,
      Garissa: 42, Wajir: 38, Mandera: 60, Marsabit: 50, Isiolo: 45,
      Turkana: 48, 'West Pokot': 55, Samburu: 48, Baringo: 30, Laikipia: 20,
      Nyandarua: 18, Nyeri: 14, Kirinyaga: 16, Muranga: 20, Embu: 22,
      Kitui: 35, Makueni: 30, 'Taita Taveta': 28, Lamu: 32, Meru: 24,
      'Tharaka-Nithi': 26, Bungoma: 30, Busia: 32, Kakamega: 28, Vihiga: 26,
      'Trans Nzoia': 28, Nandi: 26, 'Elgeyo-Marakwet': 32, Kericho: 24, Bomet: 28,
      Narok: 38, Siaya: 30, 'Homa Bay': 32, Migori: 34, Kisii: 22, Nyamira: 24,
    },
    urban: {
      Nairobi: 22, Mombasa: 28, Kisumu: 30, Nakuru: 32, 'Uasin Gishu': 30, Kiambu: 18,
      Machakos: 28, Kajiado: 22, Kilifi: 28, Kwale: 25, 'Tana River': 30,
      Garissa: 28, Wajir: 24, Mandera: 35, Marsabit: 28, Isiolo: 30,
      Turkana: 22, 'West Pokot': 30, Samburu: 26, Baringo: 22, Laikipia: 18,
      Nyandarua: 14, Nyeri: 16, Kirinyaga: 18, Muranga: 16, Embu: 18,
      Kitui: 24, Makueni: 22, 'Taita Taveta': 20, Lamu: 22, Meru: 20,
      'Tharaka-Nithi': 20, Bungoma: 24, Busia: 26, Kakamega: 22, Vihiga: 20,
      'Trans Nzoia': 22, Nandi: 20, 'Elgeyo-Marakwet': 24, Kericho: 18, Bomet: 22,
      Narok: 26, Siaya: 24, 'Homa Bay': 24, Migori: 26, Kisii: 18, Nyamira: 20,
    },
    rural: {
      Nairobi: 8, Mombasa: 10, Kisumu: 15, Nakuru: 24, 'Uasin Gishu': 18, Kiambu: 8,
      Machakos: 36, Kajiado: 18, Kilifi: 48, Kwale: 44, 'Tana River': 68,
      Garissa: 52, Wajir: 48, Mandera: 72, Marsabit: 62, Isiolo: 56,
      Turkana: 62, 'West Pokot': 68, Samburu: 60, Baringo: 36, Laikipia: 22,
      Nyandarua: 20, Nyeri: 12, Kirinyaga: 14, Muranga: 22, Embu: 26,
      Kitui: 44, Makueni: 36, 'Taita Taveta': 34, Lamu: 40, Meru: 28,
      'Tharaka-Nithi': 30, Bungoma: 34, Busia: 36, Kakamega: 32, Vihiga: 30,
      'Trans Nzoia': 32, Nandi: 30, 'Elgeyo-Marakwet': 38, Kericho: 28, Bomet: 32,
      Narok: 48, Siaya: 34, 'Homa Bay': 38, Migori: 40, Kisii: 26, Nyamira: 28,
    },
  },
  less: {
    both: {
      Nairobi: 35, Mombasa: 30, Kisumu: 28, Nakuru: 32, 'Uasin Gishu': 30, Kiambu: 40,
      Machakos: 25, Kajiado: 28, Kilifi: 20, Kwale: 22, 'Tana River': 12,
      Garissa: 8, Wajir: 6, Mandera: 10, Marsabit: 14, Isiolo: 18,
      Turkana: 12, 'West Pokot': 10, Samburu: 14, Baringo: 28, Laikipia: 35,
      Nyandarua: 40, Nyeri: 45, Kirinyaga: 42, Muranga: 38, Embu: 36,
      Kitui: 22, Makueni: 26, 'Taita Taveta': 30, Lamu: 20, Meru: 38,
      'Tharaka-Nithi': 34, Bungoma: 28, Busia: 26, Kakamega: 32, Vihiga: 38,
      'Trans Nzoia': 30, Nandi: 34, 'Elgeyo-Marakwet': 24, Kericho: 36, Bomet: 28,
      Narok: 20, Siaya: 32, 'Homa Bay': 28, Migori: 24, Kisii: 36, Nyamira: 34,
    },
    urban: {
      Nairobi: 48, Mombasa: 42, Kisumu: 38, Nakuru: 40, 'Uasin Gishu': 38, Kiambu: 52,
      Machakos: 34, Kajiado: 36, Kilifi: 28, Kwale: 30, 'Tana River': 16,
      Garissa: 12, Wajir: 10, Mandera: 14, Marsabit: 18, Isiolo: 24,
      Turkana: 14, 'West Pokot': 12, Samburu: 16, Baringo: 32, Laikipia: 40,
      Nyandarua: 44, Nyeri: 50, Kirinyaga: 48, Muranga: 44, Embu: 42,
      Kitui: 28, Makueni: 30, 'Taita Taveta': 36, Lamu: 26, Meru: 44,
      'Tharaka-Nithi': 38, Bungoma: 32, Busia: 30, Kakamega: 36, Vihiga: 42,
      'Trans Nzoia': 34, Nandi: 38, 'Elgeyo-Marakwet': 28, Kericho: 40, Bomet: 32,
      Narok: 22, Siaya: 36, 'Homa Bay': 32, Migori: 28, Kisii: 40, Nyamira: 38,
    },
    rural: {
      Nairobi: 18, Mombasa: 16, Kisumu: 18, Nakuru: 24, 'Uasin Gishu': 22, Kiambu: 28,
      Machakos: 18, Kajiado: 20, Kilifi: 12, Kwale: 14, 'Tana River': 8,
      Garissa: 4, Wajir: 3, Mandera: 6, Marsabit: 9, Isiolo: 12,
      Turkana: 8, 'West Pokot': 6, Samburu: 9, Baringo: 22, Laikipia: 28,
      Nyandarua: 34, Nyeri: 38, Kirinyaga: 36, Muranga: 32, Embu: 30,
      Kitui: 16, Makueni: 20, 'Taita Taveta': 24, Lamu: 14, Meru: 32,
      'Tharaka-Nithi': 28, Bungoma: 22, Busia: 20, Kakamega: 26, Vihiga: 32,
      'Trans Nzoia': 24, Nandi: 28, 'Elgeyo-Marakwet': 18, Kericho: 30, Bomet: 22,
      Narok: 14, Siaya: 26, 'Homa Bay': 22, Migori: 18, Kisii: 30, Nyamira: 28,
    },
  },
  least: {
    both: {
      Nairobi: 55, Mombasa: 48, Kisumu: 45, Nakuru: 38, 'Uasin Gishu': 42, Kiambu: 58,
      Machakos: 30, Kajiado: 35, Kilifi: 22, Kwale: 20, 'Tana River': 8,
      Garissa: 5, Wajir: 4, Mandera: 6, Marsabit: 8, Isiolo: 12,
      Turkana: 6, 'West Pokot': 8, Samburu: 10, Baringo: 22, Laikipia: 40,
      Nyandarua: 52, Nyeri: 58, Kirinyaga: 55, Muranga: 50, Embu: 45,
      Kitui: 25, Makueni: 30, 'Taita Taveta': 35, Lamu: 18, Meru: 48,
      'Tharaka-Nithi': 42, Bungoma: 32, Busia: 28, Kakamega: 38, Vihiga: 44,
      'Trans Nzoia': 35, Nandi: 40, 'Elgeyo-Marakwet': 28, Kericho: 42, Bomet: 32,
      Narok: 18, Siaya: 36, 'Homa Bay': 30, Migori: 26, Kisii: 44, Nyamira: 40,
    },
    urban: {
      Nairobi: 68, Mombasa: 58, Kisumu: 55, Nakuru: 48, 'Uasin Gishu': 52, Kiambu: 70,
      Machakos: 40, Kajiado: 44, Kilifi: 30, Kwale: 28, 'Tana River': 12,
      Garissa: 8, Wajir: 6, Mandera: 9, Marsabit: 12, Isiolo: 16,
      Turkana: 8, 'West Pokot': 10, Samburu: 12, Baringo: 28, Laikipia: 48,
      Nyandarua: 58, Nyeri: 65, Kirinyaga: 62, Muranga: 58, Embu: 52,
      Kitui: 32, Makueni: 36, 'Taita Taveta': 42, Lamu: 24, Meru: 55,
      'Tharaka-Nithi': 48, Bungoma: 38, Busia: 34, Kakamega: 44, Vihiga: 50,
      'Trans Nzoia': 40, Nandi: 46, 'Elgeyo-Marakwet': 32, Kericho: 48, Bomet: 36,
      Narok: 22, Siaya: 40, 'Homa Bay': 36, Migori: 30, Kisii: 50, Nyamira: 46,
    },
    rural: {
      Nairobi: 30, Mombasa: 24, Kisumu: 28, Nakuru: 28, 'Uasin Gishu': 32, Kiambu: 44,
      Machakos: 22, Kajiado: 26, Kilifi: 14, Kwale: 12, 'Tana River': 5,
      Garissa: 2, Wajir: 2, Mandera: 3, Marsabit: 5, Isiolo: 8,
      Turkana: 4, 'West Pokot': 5, Samburu: 7, Baringo: 16, Laikipia: 32,
      Nyandarua: 44, Nyeri: 50, Kirinyaga: 48, Muranga: 42, Embu: 38,
      Kitui: 18, Makueni: 24, 'Taita Taveta': 28, Lamu: 12, Meru: 40,
      'Tharaka-Nithi': 36, Bungoma: 26, Busia: 22, Kakamega: 30, Vihiga: 38,
      'Trans Nzoia': 28, Nandi: 34, 'Elgeyo-Marakwet': 22, Kericho: 36, Bomet: 26,
      Narok: 12, Siaya: 28, 'Homa Bay': 24, Migori: 20, Kisii: 38, Nyamira: 34,
    },
  },
};

const vulnerabilityConfig = [
  { level: 'most' as VulnerabilityLevel, label: 'most vulnerable', badge: Badge4, colorLight: '#FF9FA4', colorDark: '#5C0229' },
  { level: 'more' as VulnerabilityLevel, label: 'more vulnerable', badge: Badge3, colorLight: '#EBAEFF', colorDark: '#290445' },
  { level: 'less' as VulnerabilityLevel, label: 'less vulnerable', badge: Badge2, colorLight: '#9CD7FF', colorDark: '#001E5E' },
  { level: 'least' as VulnerabilityLevel, label: 'least vulnerable', badge: Badge1, colorLight: '#81F3BC', colorDark: '#00492C' },
];

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
  const [selectedLevel, setSelectedLevel] = useState<VulnerabilityLevel>('most');
  const [populationType, setPopulationType] = useState<PopulationType>('both');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, regionName: '', percentage: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const config = vulnerabilityConfig.find(v => v.level === selectedLevel)!;
  const data = prevalenceData[selectedLevel][populationType];

  const handleMouseMove = (e: React.MouseEvent, regionName: string) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top - 40, regionName, percentage: data[regionName] || 0 });
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
        const pct = data[name] || 0;
        const fill = getColor(pct, config.colorLight, config.colorDark);
        const paths: string[] = [];
        if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach((p: number[][][]) => paths.push(coordinatesToPath(p)));
        else if (f.geometry.type === 'Polygon') paths.push(coordinatesToPath(f.geometry.coordinates));
        return paths.map((d, i) => (
          <path
            key={`${name}-${i}${name === hoveredRegion ? '-h' : ''}`}
            d={d}
            fill={fill}
            stroke={name === hoveredRegion ? '#383633' : '#fff'}
            strokeWidth={name === hoveredRegion ? 2 : 1}
            className="prevalence-map-section__region"
            onMouseEnter={() => setHoveredRegion(name)}
            onMouseMove={e => handleMouseMove(e, name)}
            onMouseLeave={handleMouseLeave}
          />
        ));
      });

  if (mode === 'segments') {
    return <div className="prevalence-map-section"><div className="prevalence-map-section__card prevalence-map-section__card--empty" /></div>;
  }

  return (
    <div className="prevalence-map-section">
      <div className="prevalence-map-section__card">
        {/* Left panel */}
        <div className="prevalence-map-section__left">
          <div className="prevalence-map-section__left-title">
            <span>Vulnerability level</span>
          </div>
          <div className="prevalence-map-section__checkboxes">
            {vulnerabilityConfig.map(({ level, label, badge }) => (
              <label key={level} className={`prevalence-map-section__checkbox-row${selectedLevel === level ? ' prevalence-map-section__checkbox-row--active' : ''}`}>
                <input
                  type="radio"
                  name="vulnerability"
                  checked={selectedLevel === level}
                  onChange={() => setSelectedLevel(level)}
                  className="prevalence-map-section__radio"
                />
                <img src={badge} alt={label} className="prevalence-map-section__badge" />
                <span className="prevalence-map-section__checkbox-label">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="prevalence-map-section__right">
          {/* Toolbar */}
          <div className="prevalence-map-section__toolbar">
            <div className="prevalence-map-section__pop-group">
              {(['both', 'urban', 'rural'] as PopulationType[]).map((type, i, arr) => (
                <button
                  key={type}
                  className={`prevalence-map-section__pop-btn${populationType === type ? ' prevalence-map-section__pop-btn--active' : ''}${i === 0 ? ' prevalence-map-section__pop-btn--first' : ''}${i === arr.length - 1 ? ' prevalence-map-section__pop-btn--last' : ''}`}
                  onClick={() => setPopulationType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <button className="prevalence-map-section__download-btn" aria-label="Download">
              <span>Download</span>
              <DownloadIcon className="prevalence-map-section__download-icon" />
            </button>
          </div>

          {/* Map */}
          <div className="prevalence-map-section__map-wrap" ref={mapContainerRef}>
            <div className="prevalence-map-section__legend">
              <span className="prevalence-map-section__legend-label">High</span>
              <div className="prevalence-map-section__legend-bar" style={{ background: `linear-gradient(to bottom, ${config.colorDark}, ${config.colorLight})` }} />
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
                <span className="prevalence-map-section__tooltip-text">{tooltip.regionName} · {tooltip.percentage}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
