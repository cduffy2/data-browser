import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Page } from '../LeftSidebar/LeftSidebar';
import { ALL_ARTICLES } from '../../../data/articles';
import { dataCategories } from '../../../data/categories';
import { populationSegments } from '../../../data/segments';
import SearchIcon from '../../../assets/icons/Search.svg?react';
import CancelFilledIcon from '../../../assets/icons/CancelFilled.svg?react';
import ArrowForwardFilledIcon from '../../../assets/icons/ArrowForwardFilled.svg?react';
import AiIcon from '../../../assets/icons/AI.svg?react';
import biharIndiaFlag from '../../../assets/icons/Bihar-India.png';
import ethiopiaFlag from '../../../assets/icons/ethiopia.png';
import indonesiaFlag from '../../../assets/icons/indonesia.png';
import kenyaFlag from '../../../assets/icons/kenya.png';
import nigeriaFlag from '../../../assets/icons/nigeria.png';
import senegalFlag from '../../../assets/icons/Senegal.png';
import './GlobalSearch.css';

interface GlobalSearchProps {
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
}

type ResultType = 'segmentation' | 'segment' | 'indicator' | 'typing-tool' | 'resource-article' | 'news-article';

interface SearchResult {
  type: ResultType;
  title: string;
  subtitle: string;
  geography: string | null;
  page: Page;
  id: string;
  destination: string;
  tags?: string[];
}

const GEOGRAPHIES: { name: string; flag: string }[] = [
  { name: 'Bihar, India',     flag: biharIndiaFlag },
  { name: 'Ethiopia',         flag: ethiopiaFlag },
  { name: 'Indonesia',        flag: indonesiaFlag },
  { name: 'Kenya',            flag: kenyaFlag },
  { name: 'Northern Nigeria', flag: nigeriaFlag },
  { name: 'Senegal',          flag: senegalFlag },
];

const GEO_NAMES = GEOGRAPHIES.map(g => g.name);

const PAGE_INDEX: SearchResult[] = [
  { type: 'segmentation',    title: 'Kenya overview', subtitle: 'Kenya', geography: 'Kenya', page: 'kenya-overview', id: 'p-kenya-overview', destination: 'Kenya overview' },
  { type: 'typing-tool',     title: 'Typing tools',   subtitle: 'Create segmentations', geography: null, page: 'assistant',  id: 'p-assistant',     destination: 'Typing tools' },
  { type: 'resource-article',title: 'Resources',      subtitle: 'Articles and guides',  geography: null, page: 'resources', id: 'p-resources',     destination: 'Resources' },
];

const SEGMENT_VULNERABILITY: Record<string, string> = {
  'rural-4': 'Most vulnerable', 'urban-4': 'Most vulnerable',
  'rural-3a': 'More vulnerable', 'rural-3b': 'More vulnerable',
  'urban-2a': 'Less vulnerable', 'urban-2b': 'Less vulnerable', 'rural-2': 'Less vulnerable',
  'urban-1': 'Least vulnerable',
};


function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="gs-overlay__highlight">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

const TYPE_ORDER: ResultType[] = ['segmentation', 'segment', 'indicator', 'typing-tool', 'resource-article', 'news-article'];
const TYPE_LABELS: Record<ResultType, string> = {
  'segmentation':    'Segmentation',
  'segment':         'Segment',
  'indicator':       'Data point',
  'typing-tool':     'Typing tool',
  'resource-article':'Resource article',
  'news-article':    'News article',
};

interface ResultGroup {
  geography: string | null;
  byType: Map<ResultType, SearchResult[]>;
}


const isMac = /mac/i.test(navigator.platform);
const MOD_KEY = isMac ? '⌘' : '⌃';

// ── Nav trigger button ────────────────────────────────────────────────────────

interface SearchTriggerProps {
  onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <button className="gs-trigger" onClick={onClick} aria-label="Open search">
      <span className="gs-trigger__icon-wrap">
        <SearchIcon className="gs-trigger__icon" />
      </span>
      <span className="gs-trigger__label">Search</span>
      <kbd className="gs-trigger__kbd">{MOD_KEY}K</kbd>
    </button>
  );
}

// ── Overlay modal ─────────────────────────────────────────────────────────────

interface GlobalSearchProps2 {
  onNavigate: (page: Page, tag?: string, searchTerm?: string) => void;
  open: boolean;
  onClose: () => void;
}

function GlobalSearchOverlay({ onNavigate, open, onClose }: GlobalSearchProps2) {
  const [query, setQuery] = useState('');
  const [geoFilter, setGeoFilter] = useState<string | null>(null);
  const [geoDropdownOpen, setGeoDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches] = useState<SearchResult[]>([
    { type: 'indicator',       title: 'Antenatal care (ANC) visits', subtitle: 'Maternal health',  geography: 'Kenya',   page: 'data-browser',    id: 'ex-1', destination: 'Data browser' },
    { type: 'segmentation',    title: 'Kenya overview',              subtitle: 'Kenya',            geography: 'Kenya',   page: 'kenya-overview',  id: 'ex-2', destination: 'Kenya overview' },
    { type: 'segment',         title: 'Urban 1',                     subtitle: 'Least vulnerable', geography: 'Senegal', page: 'urban-1' as Page, id: 'ex-3', destination: 'Segment profile' },
    { type: 'resource-article',title: 'About Pathways',              subtitle: 'Getting started',  geography: null,      page: 'resources',       id: 'ex-4', destination: 'Resources' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const askAiRef = useRef<HTMLButtonElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const recentRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const geoRef = useRef<HTMLDivElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setGeoFilter(null);
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (geoDropdownOpen) { setGeoDropdownOpen(false); return; }
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [geoDropdownOpen, onClose]);

  // Close geo dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (geoRef.current && !geoRef.current.contains(e.target as Node)) {
        setGeoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allResults = useMemo<SearchResult[]>(() => {
    const articles: SearchResult[] = ALL_ARTICLES.map(a => ({
      type: 'resource-article' as ResultType,
      title: a.title,
      subtitle: a.tags[0] ?? '',
      geography: null,
      page: 'article-detail' as Page,
      id: `article-${a.id}`,
      destination: 'Resources',
      tags: a.tags,
    }));

    const geoResults: SearchResult[] = GEO_NAMES.flatMap(geo => {
      const segments: SearchResult[] = populationSegments.map(seg => ({
        type: 'segment' as ResultType,
        title: `${seg.label} ${seg.badge}`,
        subtitle: SEGMENT_VULNERABILITY[seg.id] ?? '',
        geography: geo,
        page: seg.id as Page,
        id: `seg-${geo}-${seg.id}`,
        destination: 'Segment profile',
      }));

      const indicators: SearchResult[] = dataCategories.flatMap(cat =>
        cat.subcategories.flatMap(sub =>
          sub.items.map(item => ({
            type: 'indicator' as ResultType,
            title: item.label,
            subtitle: sub.label,
            geography: geo,
            page: 'data-browser' as Page,
            id: `ind-${geo}-${item.id}`,
            destination: 'Data browser',
          }))
        )
      );

      return [...segments, ...indicators];
    });

    return [...PAGE_INDEX, ...articles, ...geoResults];
  }, []);

  const groups = useMemo<ResultGroup[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matched = allResults.filter(r => {
      const geoMatch = geoFilter ? r.geography === geoFilter || r.geography === null : true;
      if (!geoMatch) return false;
      return (
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        (r.geography?.toLowerCase().includes(q)) ||
        (r.tags?.some(t => t.toLowerCase().includes(q)))
      );
    });

    const capped = matched.slice(0, 30);
    const geoOrder = geoFilter ? [null, geoFilter] : [null, ...GEO_NAMES];
    const result: ResultGroup[] = [];

    for (const geo of geoOrder) {
      const items = capped.filter(r => r.geography === geo);
      if (items.length === 0) continue;
      const byType = new Map<ResultType, SearchResult[]>();
      for (const type of TYPE_ORDER) {
        const typeItems = items.filter(r => r.type === type);
        if (typeItems.length) byType.set(type, typeItems);
      }
      result.push({ geography: geo, byType });
    }

    return result;
  }, [query, geoFilter, allResults]);

  const flatResults = useMemo<SearchResult[]>(() =>
    groups.flatMap(g => Array.from(g.byType.values()).flat()),
  [groups]);

  const hasResults = groups.length > 0;

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.page, undefined, query.trim() || undefined);
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!query.trim() && recentSearches.length > 0) {
        recentRefs.current[0]?.focus();
      } else if (query.trim()) {
        askAiRef.current?.focus();
      }
    } else if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      sessionStorage.setItem('ai_initial_query', query.trim());
      window.open(window.location.pathname + '#assistant', '_blank');
      onClose();
    }
  };

  const handleAskAiKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      inputRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hasResults) {
        setActiveIndex(0);
        resultRefs.current[0]?.focus();
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      setQuery(q => q.slice(0, -1));
      inputRef.current?.focus();
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      setQuery(q => q + e.key);
      inputRef.current?.focus();
    }
  };

  const handleRecentKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      recentRefs.current[Math.min(index + 1, recentSearches.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) inputRef.current?.focus();
      else recentRefs.current[index - 1]?.focus();
    }
  };

  const handleResultKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(index + 1, flatResults.length - 1);
      setActiveIndex(next);
      resultRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        setActiveIndex(-1);
        if (query.trim()) {
          askAiRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      } else {
        const prev = index - 1;
        setActiveIndex(prev);
        resultRefs.current[prev]?.focus();
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      setQuery(q => q.slice(0, -1));
      setActiveIndex(-1);
      inputRef.current?.focus();
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      setQuery(q => q + e.key);
      setActiveIndex(-1);
      inputRef.current?.focus();
    }
  };

  if (!open) return null;

  const activeGeo = GEOGRAPHIES.find(g => g.name === geoFilter) ?? null;
  const geoLabel = geoFilter ?? 'All geographies';

  return createPortal(
    <div className="gs-overlay__backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gs-overlay__panel" role="dialog" aria-modal="true" aria-label="Search">

        {/* Input row */}
        <div className="gs-overlay__input-row">
          {/* Geography filter */}
          <div className="gs-overlay__geo-wrap" ref={geoRef}>
            <button
              className={`gs-overlay__geo-btn${geoFilter ? ' gs-overlay__geo-btn--active' : ''}`}
              onClick={() => setGeoDropdownOpen(o => !o)}
              aria-expanded={geoDropdownOpen}
            >
              {activeGeo
                ? <img src={activeGeo.flag} alt="" className="gs-overlay__geo-btn-flag" />
                : <span className="gs-overlay__geo-btn-globe">🌍</span>
              }
              <span className="gs-overlay__geo-label">{geoLabel}</span>
              <svg className="gs-overlay__geo-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {geoDropdownOpen && (
              <div className="gs-overlay__geo-dropdown">
                <button
                  className={`gs-overlay__geo-option${geoFilter === null ? ' gs-overlay__geo-option--active' : ''}`}
                  onClick={() => { setGeoFilter(null); setGeoDropdownOpen(false); }}
                >
                  <span className="gs-overlay__geo-option-globe">🌍</span>
                  All geographies
                </button>
                {GEOGRAPHIES.map(geo => (
                  <button
                    key={geo.name}
                    className={`gs-overlay__geo-option${geoFilter === geo.name ? ' gs-overlay__geo-option--active' : ''}`}
                    onClick={() => { setGeoFilter(geo.name); setGeoDropdownOpen(false); }}
                  >
                    <img src={geo.flag} alt="" className="gs-overlay__geo-option-flag" />
                    {geo.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="gs-overlay__divider" />

          <SearchIcon className="gs-overlay__search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="gs-overlay__input"
            placeholder="Search Pathways…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
            onKeyDown={handleInputKeyDown}
          />
          {query && (
            <button className="gs-overlay__clear-btn" onClick={() => { setQuery(''); setActiveIndex(-1); inputRef.current?.focus(); }} aria-label="Clear">
              <CancelFilledIcon className="gs-overlay__clear-icon" />
            </button>
          )}
          <button className="gs-overlay__close-btn" onClick={onClose} aria-label="Close search">
            <kbd>Esc</kbd>
          </button>
        </div>

        {/* Results */}
        <div className="gs-overlay__results">
          {query.trim() && (
            <button
              ref={askAiRef}
              className="gs-overlay__ask-ai-row"
              onClick={() => {
                sessionStorage.setItem('ai_initial_query', query.trim());
                window.open(window.location.pathname + '#assistant', '_blank');
                onClose();
              }}
              onKeyDown={handleAskAiKeyDown}
            >
              <AiIcon className="gs-overlay__ask-ai-icon" />
              <span className="gs-overlay__ask-ai-label-wrap">
                <span className="gs-overlay__ask-ai-label-bold">Ask AI:</span>
                <span className="gs-overlay__ask-ai-label-query">"{query}"</span>
              </span>
            </button>
          )}
          {query.trim() && hasResults && (
            <div className="gs-overlay__results-header">
              <span className="gs-overlay__results-header-text">Search results</span>
              <div className="gs-overlay__results-header-line" />
            </div>
          )}
          {!query.trim() ? (
            recentSearches.length > 0 ? (
              <div className="gs-overlay__recents">
                <div className="gs-overlay__recents-header">
                  <span className="gs-overlay__section-label">
                    Recent searches
                    <span className="gs-overlay__recents-sep">·</span>
                    <button className="gs-overlay__recents-clear" onClick={() => {}}>Clear</button>
                  </span>
                </div>
                {recentSearches.map((result, i) => (
                  <button
                    key={result.id}
                    ref={el => { recentRefs.current[i] = el; }}
                    className="gs-overlay__result"
                    onClick={() => handleSelect(result)}
                    onKeyDown={e => handleRecentKeyDown(e, i)}
                  >
                    <span className="gs-overlay__result-title">{result.title}</span>
                    <span className="gs-overlay__result-destination">
                      {result.destination}
                      <ArrowForwardFilledIcon className="gs-overlay__result-destination-arrow" />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="gs-overlay__empty">Start typing to search pages, indicators, segments and articles.</div>
            )
          ) : !hasResults ? null : (() => {
            let flatIndex = 0;
            return groups.flatMap(group => {
              const geoName = group.geography ?? 'Global';
              const geoMeta = group.geography ? GEOGRAPHIES.find(g => g.name === group.geography) : null;
              return Array.from(group.byType.entries()).map(([type, items]) => (
                <div key={`${geoName}-${type}`} className="gs-overlay__section">
                  <div className="gs-overlay__section-label">
                    <span className="gs-overlay__section-geo">
                      {geoMeta
                        ? <img src={geoMeta.flag} alt="" className="gs-overlay__geo-heading-flag" />
                        : <span className="gs-overlay__section-globe">🌍</span>
                      }
                      {geoName}
                    </span>
                    <span className="gs-overlay__section-sep">/</span>
                    <span className="gs-overlay__section-type">{TYPE_LABELS[type]}</span>
                  </div>
                  {items.map(result => {
                    const idx = flatIndex++;
                    return (
                      <button
                        key={result.id}
                        ref={el => { resultRefs.current[idx] = el; }}
                        className={`gs-overlay__result${activeIndex === idx ? ' gs-overlay__result--active' : ''}`}
                        onClick={() => handleSelect(result)}
                        onKeyDown={e => handleResultKeyDown(e, idx)}
                        onFocus={() => setActiveIndex(idx)}
                      >
                        <span className="gs-overlay__result-title">{highlightMatch(result.title, query)}</span>
                        <span className="gs-overlay__result-destination">
                          {result.destination}
                          <ArrowForwardFilledIcon className="gs-overlay__result-destination-arrow" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ));
            });
          })()}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Public export: combines trigger state + overlay ───────────────────────────

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <SearchTrigger onClick={() => setOpen(true)} />
      <GlobalSearchOverlay open={open} onClose={() => setOpen(false)} onNavigate={onNavigate} />
    </>
  );
}
