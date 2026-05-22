import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA } from '../DomainDetailPage/domainData';
import InfoOutlinedIcon from '../../assets/icons/InfoOutlined.svg?react';
import './MethodologyExplainerPage.css';

interface MethodologyExplainerPageProps {
  currentPage: Page;
  onNavigate: (page: Page, tag?: string, term?: string, domainId?: string, categoryId?: string) => void;
  onGoBack: () => void;
}

// ── Scroll-reveal hook ────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.unobserve(el); } },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`mep-reveal ${className}`}
      style={delay ? { '--reveal-delay': `${delay}ms` } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  );
}

// ── Illustration placeholder ──────────────────────────────────────────────────

function IllustrationPlaceholder({ label, height = 240 }: { label: string; height?: number }) {
  return (
    <div className="mep-placeholder" style={{ minHeight: height }} role="img" aria-label={`Visual placeholder: ${label}`}>
      <span className="mep-placeholder__label">[ {label} ]</span>
    </div>
  );
}

// ── Domain colour map (cell background per domain) ────────────────────────────

const DOMAIN_CELL_COLOR: Record<string, string> = {
  'woman-experiences':      '#dbecfe',
  'health-mental':          '#d1ede4',
  'household-relationships':'#fff4c1',
  'household-economics':    '#ead5f7',
  'social-support':         '#dde3ef',
  'human-natural':          '#fedbdb',
};

// ── Animated dot canvas ───────────────────────────────────────────────────────
//
// We define a fixed set of dots (VF + HO) with stable IDs. Each step assigns
// every dot a position (cx, cy as % of canvas), a fill colour, and an opacity.
// CSS transitions on cx/cy/fill/opacity animate smoothly between steps.
//
// Canvas: 560×480 (viewBox units). VF dots: 0–47. HO dots: 48–59.

const VF = 48; // vulnerability factor dots
const HO = 12; // health outcome dots

// Selected VF dots that survive into clusters (9 per cluster × 4 = 36)
const SELECTED_ARR = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,1,3,5,7,9,11,13,15,17,19,21,23];
const SELECTED = new Set(SELECTED_ARR);

// Assign selected dots evenly across 4 clusters (9 each), round-robin
const SELECTED_CLUSTER: Record<number, 0|1|2|3> = {};
SELECTED_ARR.forEach((idx, pos) => { SELECTED_CLUSTER[idx] = (pos % 4) as 0|1|2|3; });

// Step 4 vulnerability rank order (most → least vulnerable)
const VULN_ORDER = [2, 0, 3, 1]; // cluster indices ordered by vulnerability

// Seeded scatter: deterministic pseudo-random positions for the raw pool
function scatter(i: number, cols: number, _rows: number, cellW: number, cellH: number, ox: number, oy: number) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const jx = ((i * 13 + 7) % 11) / 11; // jitter 0–1
  const jy = ((i * 17 + 3) % 11) / 11;
  return {
    cx: ox + col * cellW + jx * (cellW * 0.6) + cellW * 0.2,
    cy: oy + row * cellH + jy * (cellH * 0.6) + cellH * 0.2,
  };
}

interface DotState { cx: number; cy: number; fill: string; opacity: number; r: number }

function buildStates(step: number): DotState[] {
  const states: DotState[] = [];

  if (step === 1) {
    // Figma-exact scatter positions (scaled from 640×542 → 540×490, dot centre = left+12, top+12)
    // sx = (left+12)*(540/640), sy = (top+12)*(490/542)
    const S = 540 / 640;
    const T = 490 / 542;
    // All 60 dots laid out as in Figma: VF first (0–47), HO (48–59)
    const fig: [number, number, string][] = [
      // VF dots (#88c1fd)
      [0,0,'v'],[224,12,'v'],[180,40,'v'],[176,93,'v'],[128,151,'v'],
      [0,222,'v'],[80,293,'v'],[180,259,'v'],[308,210,'v'],[320,12,'v'],
      [400,105,'v'],[515,36,'v'],[568,81,'v'],[320,105,'v'],[248,105,'v'],
      [491,105,'v'],[180,163,'v'],[491,175,'v'],[424,271,'v'],[296,317,'v'],
      [248,281,'v'],[320,435,'v'],[212,459,'v'],[37,374,'v'],[61,469,'v'],
      [568,281,'v'],[484,317,'v'],[352,293,'v'],[376,374,'v'],[527,505,'v'],
      [460,398,'v'],[460,469,'v'],[527,410,'v'],[556,459,'v'],[436,36,'v'],
      [568,281,'v'],[400,105,'v'],[180,163,'v'],[248,105,'v'],[320,293,'v'],
      [212,459,'v'],[37,374,'v'],[61,469,'v'],[484,317,'v'],[352,293,'v'],
      [376,374,'v'],[527,410,'v'],[556,459,'v'],
      // HO dots (#8da0cb)
      [92,40,'h'],[592,0,'h'],[49,117,'h'],[248,175,'h'],[400,187,'h'],
      [503,281,'h'],[556,199,'h'],[556,370,'h'],[260,387,'h'],[388,493,'h'],
      [140,374,'h'],[140,459,'h'],
    ];
    for (let i = 0; i < VF; i++) {
      const [lx, ly] = fig[i] ?? [0, 0];
      states.push({ cx: (lx + 12) * S, cy: (ly + 12) * T, fill: '#88c1fd', opacity: 1, r: 10 });
    }
    for (let i = 0; i < HO; i++) {
      const [lx, ly] = fig[VF + i] ?? [0, 0];
      states.push({ cx: (lx + 12) * S, cy: (ly + 12) * T, fill: '#8da0cb', opacity: 1, r: 10 });
    }
    return states;
  }

  if (step === 2) {
    // VF: grid layout, selected full opacity, non-selected faded
    for (let i = 0; i < VF; i++) {
      const { cx, cy } = vfGridPos(i);
      const sel = SELECTED.has(i);
      states.push({ cx, cy, fill: '#88c1fd', opacity: sel ? 1 : 0.18, r: 10 });
    }
    // HO: grid layout on right side, all full opacity
    for (let i = 0; i < HO; i++) {
      const { cx, cy } = hoGridPos(i);
      states.push({ cx, cy, fill: '#8da0cb', opacity: 1, r: 10 });
    }
    return states;
  }

  if (step === 3) {
    // 4 clusters, 9 dots each (3×3), matching Figma layout
    // Cluster dot spacing: 48px (24px dot + 24px gap). Cluster width = 2×48+24 = 120px
    // Col gap between A/B and C/D: 36px → cluster B ox = 120+36 = 156
    // Row gap: cluster C/D start at oy=230 (leaves ~90px for labels at oy+144)
    const clusterOrigins = [
      { ox: 8,   oy: 20  }, // A: top-left
      { ox: 156, oy: 20  }, // B: top-right
      { ox: 8,   oy: 230 }, // C: bottom-left
      { ox: 156, oy: 230 }, // D: bottom-right
    ];
    const clusterCounts = [0, 0, 0, 0];
    for (let i = 0; i < VF; i++) {
      const sel = SELECTED.has(i);
      if (sel) {
        const cl = SELECTED_CLUSTER[i];
        const idx = clusterCounts[cl]++;
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const o = clusterOrigins[cl];
        states.push({ cx: o.ox + col * 48, cy: o.oy + row * 48, fill: '#88c1fd', opacity: 1, r: 10 });
      } else {
        // Non-selected: park off-canvas
        states.push({ cx: 12, cy: 480, fill: '#88c1fd', opacity: 0, r: 4 });
      }
    }
    // HO dots: stay at same hoGridPos as step 2
    for (let i = 0; i < HO; i++) {
      const { cx, cy } = hoGridPos(i);
      states.push({ cx, cy, fill: '#8da0cb', opacity: 1, r: 10 });
    }
    return states;
  }

  // Step 4: 4 ranked rows, each row = label (left) + 3×3 cluster (right of label)
  // Canvas 540×490. Usable height ~442px (pad 24 top/bottom).
  // justify-between over 4 rows: rowY[i] = 24 + i * (442/3) ≈ 24, 171, 318, 465 → clamp last to 466
  // VF cluster: 3×3 dots, dot r=12 (24px), spacing=48px → cluster width=120px, height=120px
  // Label column width ~128px, gap 16px → cluster starts at x=144
  // HO dots: right side starts at x=300, dot r=12, hGap=20px → spacing=44px
  // Per rank rows: 3 rows each. most: 6,5,4 | more: 5,4,3 | less: 4,3,2 | least: 3,2,1
  // Within each rank, HO rows spaced 48px apart (matching VF row spacing)

  const rankColors4 = ['#e86d7c', '#8b7fea', '#14abf7', '#00BE48'];
  // most→least vulnerability order maps to VULN_ORDER rank positions
  // VULN_ORDER = [2,0,3,1] → cluster 2 is rank 0 (most), cluster 0 is rank 1, cluster 3 is rank 2, cluster 1 is rank 3 (least)

  // Row start Y positions: 56px gap between clusters.
  // Cluster bottom = rowTop + 2×48 + 20 = rowTop+116. Next row = rowTop+172.
  const rowTopY = [24, 196, 368, 540];
  // Dot spacing within 3×3 cluster: 48px (24 dot + 24 gap)
  const DS = 48;

  const clusterOrigins4: Record<number, { ox: number; oy: number }> = {};
  [0, 1, 2, 3].forEach(cl => {
    const rankPos = VULN_ORDER.indexOf(cl); // 0=most,1=more,2=less,3=least
    clusterOrigins4[cl] = { ox: 144, oy: rowTopY[rankPos] };
  });
  const clusterCounts4 = [0, 0, 0, 0];

  for (let i = 0; i < VF; i++) {
    const sel = SELECTED.has(i);
    if (sel) {
      const cl = SELECTED_CLUSTER[i];
      const rankPos = VULN_ORDER.indexOf(cl);
      const idx = clusterCounts4[cl]++;
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const o = clusterOrigins4[cl];
      states.push({ cx: o.ox + col * DS, cy: o.oy + row * DS, fill: rankColors4[rankPos], opacity: 1, r: 10 });
    } else {
      states.push({ cx: 12, cy: 480, fill: '#88c1fd', opacity: 0, r: 4 });
    }
  }

  // In step 4 the HO dots are rendered as a static overlay (see StepCanvas).
  // Park all 12 HO animated dots off-canvas so they smoothly disappear from step 3.
  for (let i = 0; i < HO; i++) {
    states.push({ cx: 520, cy: 480, fill: '#8da0cb', opacity: 0, r: 4 });
  }
  return states;
}

// Step 4 HO dots rendered as a static SVG overlay (pyramid per rank)
// Per rank (most→least): rows of [6,5,4], [5,4,3], [4,3,2], [3,2,1]
// rowTopY = [24,158,292,418]; DS=48; HO_X0=320; hSpacing=44
function buildStep4HoDots(): { cx: number; cy: number }[] {
  const pts: { cx: number; cy: number }[] = [];
  const rowTopY = [24, 196, 368, 540];
  const DS = 48;
  const HO_X0 = 308;
  const H_SPACING = 44;
  const hoRowsPerRank = [[6, 5, 4], [5, 4, 3], [4, 3, 2], [3, 2, 1]];
  for (let rank = 0; rank < 4; rank++) {
    hoRowsPerRank[rank].forEach((count, rowIdx) => {
      const cy = rowTopY[rank] + rowIdx * DS;
      for (let c = 0; c < count; c++) {
        pts.push({ cx: HO_X0 + c * H_SPACING, cy });
      }
    });
  }
  return pts;
}
const STEP4_HO_DOTS = buildStep4HoDots();

// Pre-compute all states
const DOT_STATES: Record<number, DotState[]> = {
  1: buildStates(1),
  2: buildStates(2),
  3: buildStates(3),
  4: buildStates(4),
};

// Example names shown in dot hover tooltips
const VF_NAMES = [
  'Birth order', 'Number of siblings', 'Orphan status', 'Death of parents', 'Raised by',
  'Feeling of safety', 'Missing meals as child', 'Child labour', 'School dropout', 'Relocation as child',
  'Age at marriage', 'Parity', 'Education level', 'Literacy', 'Ethnicity',
  'Religion', 'Age', 'Rural/urban residence', 'Distance to facility', 'Transport access',
  'Household size', 'Head of household', 'Partner age gap', 'Polygamy', 'Domestic violence',
  'Decision-making power', 'Asset ownership', 'Mobile phone access', 'Electricity access', 'Water access',
  'Sanitation access', 'Monthly income', 'Food security', 'Savings', 'Debt',
  'Employment status', 'Occupation', 'Land ownership', 'Social network size', 'Community trust',
  'Migration history', 'Climate exposure', 'Flood risk', 'Drought exposure', 'Conflict exposure',
  'Gender norms', 'Health risk perception', 'Trust in health providers',
];
const HO_NAMES = [
  'ANC visits', 'Skilled birth attendance', 'Facility delivery', 'Postnatal care',
  'Contraceptive use', 'Child immunisation', 'Child stunting', 'Child wasting',
  'U5 mortality', 'Maternal mortality', 'Unmet need for FP', 'WASH practices',
];

// Step-2 VF grid: 8 cols × 6 rows, 24px dots (r=12), starting ox=20 oy=20
// colW=30 → centres at 20, 50, 80 … rowH=44 → centres at 20, 64, 108 …
function vfGridPos(i: number) {
  const col = i % 8;
  const row = Math.floor(i / 8);
  return { cx: 20 + col * 30, cy: 20 + row * 44 };
}

// Step-2 HO grid: 4 cols × 3 rows, 24px dots, starting ox=380 oy=20
function hoGridPos(i: number) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return { cx: 380 + col * 36, cy: 20 + row * 44 };
}

// Step-3/4 HO cluster position (unchanged)
function hoPos(i: number) {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return { cx: 390 + col * 42, cy: 56 + row * 42 };
}

// Build connector lines for step 2: every selected VF → every HO dot
// All lines drawn at low opacity for a dense fan effect
function buildLines(): { x1: number; y1: number; x2: number; y2: number; delay: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
  SELECTED_ARR.forEach((vfi, si) => {
    const vfp = vfGridPos(vfi);
    for (let h = 0; h < HO; h++) {
      const hp = hoGridPos(h);
      lines.push({
        x1: vfp.cx, y1: vfp.cy,
        x2: hp.cx,  y2: hp.cy,
        delay: (si + h) * 12,
      });
    }
  });
  return lines;
}

const CONNECTOR_LINES = buildLines();

// Step labels config
const STEP_LABELS: Record<number, {
  vf: string; ho: string;
  extra?: { text: string; x: number; y: number; color: string; weight?: string; anchor?: string }[]
}> = {
  1: { vf: 'Survey data points', ho: 'Health outcomes or behaviours' },
  2: { vf: 'Predictive vulnerability factors', ho: 'Health outcomes or behaviours' },
  3: {
    vf: 'Segments emerge',
    ho: 'Health outcomes',
    // Labels sit below each 3×3 cluster. Cluster bottom = oy + 2×48 + 12 = oy+108+12
    // textAnchor=middle at cluster centre x = ox + 48
    extra: [
      { text: 'Segment A', x: 56,  y: 170, color: 'var(--text-tertiary, #6b6b60)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment B', x: 204, y: 170, color: 'var(--text-tertiary, #6b6b60)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment C', x: 56,  y: 380, color: 'var(--text-tertiary, #6b6b60)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment D', x: 204, y: 380, color: 'var(--text-tertiary, #6b6b60)', weight: 'normal', anchor: 'middle' },
    ],
  },
  4: {
    vf: 'Ranked by vulnerability',
    ho: '',
    // Rank labels: rank name aligns with 1st dot row (rowTop+8), subtitle with 2nd (rowTop+48+8).
    // rowTopY = [24, 161, 298, 435]. DS=48.
    extra: [
      { text: '4 Most vulnerable', x: -24, y: 34,  color: '#462125', weight: '600', anchor: 'start' },
      { text: 'Worst outcomes',    x: -24, y: 78,  color: '#666',    weight: '400', anchor: 'start' },
      { text: '3 More vulnerable', x: -24, y: 206, color: '#1d1a31', weight: '600', anchor: 'start' },
      { text: '2 Less vulnerable', x: -24, y: 378, color: '#04212f', weight: '600', anchor: 'start' },
      { text: '1 Least vulnerable',x: -24, y: 550, color: '#003D1B', weight: '600', anchor: 'start' },
      { text: 'Best outcomes',     x: -24, y: 594, color: '#666',    weight: '400', anchor: 'start' },
    ],
  },
};

// Canvas step titles — shown at top, consistent across all steps
const STEP_TITLES: Record<number, string> = {
  1: 'Data points',
  2: 'Predictive factors identified',
  3: 'Segments emerge',
  4: 'Ranked by vulnerability',
};

// Connector lines animate via CSS keyframe on stroke-dashoffset
// We use a key on the <g> to retrigger the animation when step changes to 2
function ConnectorLines({ visible }: { visible: boolean }) {
  return (
    <g className={`mep-canvas__lines${visible ? ' is-visible' : ''}`}>
      {CONNECTOR_LINES.map((l, i) => {
        const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
        return (
          <line
            key={i}
            x1={l.x1} y1={l.y1}
            x2={l.x2} y2={l.y2}
            className="mep-canvas__line"
            style={{
              strokeDasharray: len,
              strokeDashoffset: visible ? 0 : len,
              transitionDelay: visible ? `${l.delay}ms` : '0ms',
            }}
          />
        );
      })}
    </g>
  );
}

function StepCanvas({ step }: { step: number }) {
  const dots = DOT_STATES[step];
  const labels = STEP_LABELS[step];
  const showLines = step === 2;
  const showDivider = false;

  const [hoveredDot, setHoveredDot] = useState<{ i: number; x: number; y: number } | null>(null);
  const [legendTooltip, setLegendTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const getDotName = (i: number) => {
    if (i < VF) return VF_NAMES[i] ?? '';
    return HO_NAMES[i - VF] ?? '';
  };

  return (
    <div className="mep-canvas-wrap">

      {/* Title — fixed position, 24px above SVG */}
      <div className="mep-canvas__title">{STEP_TITLES[step]}</div>

      <svg
        className="mep-canvas"
        viewBox="-24 0 564 680"
        width="564"
        height="680"
        aria-hidden="true"
      >
        {showDivider && <line x1="362" y1="0" x2="362" y2="490" className="mep-canvas__divider" />}

        {/* Connector lines (step 2) — rendered below dots */}
        <ConnectorLines visible={showLines} />

        {/* Dots — stable keys so CSS transitions animate cx/cy/fill/opacity */}
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={d.fill}
            opacity={d.opacity}
            className="mep-canvas__dot"
            onMouseEnter={e => setHoveredDot({ i, x: e.clientX, y: e.clientY })}
            onMouseMove={e => setHoveredDot(h => h ? { ...h, x: e.clientX, y: e.clientY } : h)}
            onMouseLeave={() => setHoveredDot(null)}
            style={{ cursor: 'default', pointerEvents: d.opacity > 0.05 ? 'auto' : 'none' }}
          />
        ))}

        {labels.extra?.map((l, i) => (
          <text key={i} x={l.x} y={l.y} className="mep-canvas__sub-label" fill={l.color} fontWeight={l.weight ?? 600} textAnchor={l.anchor ?? 'start'}>{l.text}</text>
        ))}

        {/* Step 4: static HO pyramid dots */}
        {step === 4 && STEP4_HO_DOTS.map((d, i) => (
          <circle key={`s4ho-${i}`} cx={d.cx} cy={d.cy} r={10} fill="#8da0cb" opacity={1} className="mep-canvas__dot" />
        ))}
      </svg>

      {/* Legend + hint — always visible, 24px below SVG */}
      <div className="mep-canvas__legend-wrap">
        <div className="mep-canvas__legend">
          <span className="mep-canvas__legend-item">
            <span
              className="mep-canvas__legend-dot"
              style={{ backgroundColor: '#88c1fd', cursor: 'default' }}
              onMouseEnter={e => setLegendTooltip({ text: VF_NAMES[0], x: e.clientX, y: e.clientY })}
              onMouseMove={e => setLegendTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
              onMouseLeave={() => setLegendTooltip(null)}
            />
            Vulnerability factor
          </span>
          <span className="mep-canvas__legend-item">
            <span
              className="mep-canvas__legend-dot"
              style={{ backgroundColor: '#8da0cb', cursor: 'default' }}
              onMouseEnter={e => setLegendTooltip({ text: HO_NAMES[0], x: e.clientX, y: e.clientY })}
              onMouseMove={e => setLegendTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
              onMouseLeave={() => setLegendTooltip(null)}
            />
            Health outcome or behaviour
          </span>
        </div>
        <div className="mep-canvas__hint">
          <InfoOutlinedIcon className="mep-canvas__hint-icon" aria-hidden="true" />
          Hover to see example data points
        </div>
      </div>

      {hoveredDot && (
        <div className="mep-canvas__tooltip" style={{ left: hoveredDot.x + 12, top: hoveredDot.y - 36 }}>
          {getDotName(hoveredDot.i)}
        </div>
      )}
      {legendTooltip && (
        <div className="mep-canvas__tooltip" style={{ left: legendTooltip.x + 12, top: legendTooltip.y - 36 }}>
          {legendTooltip.text}
        </div>
      )}
    </div>
  );
}

// ── Treemap popover ───────────────────────────────────────────────────────────

interface TreemapHovered {
  domainId: string;
  catId: string;
  catLabel: string;
  headerColor: string;
  x: number;
  y: number;
}

function TreemapPopover({ hovered }: { hovered: TreemapHovered }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: hovered.x + 16, top: hovered.y + 16 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos({
      left: Math.min(hovered.x + 16, window.innerWidth - width - 12),
      top: Math.min(hovered.y + 16, window.innerHeight - height - 12),
    });
  }, [hovered.x, hovered.y]);

  const domain = DOMAIN_DATA.find(d => d.id === hovered.domainId);
  const cat = domain?.categories.find(c => c.id === hovered.catId);

  return (
    <div ref={ref} className="mep__popover" style={{ left: pos.left, top: pos.top }}>
      <div className="mep__popover-title">{hovered.catLabel}</div>
      {cat?.description && (
        <p className="mep__popover-description">{cat.description}</p>
      )}
      {cat && cat.subTabs.length > 0 && (
        <>
          <div className="mep__popover-section-label">Subcategories</div>
          <div className="mep__popover-bar-wrap">
            <div className="mep__popover-bar">
              {cat.subTabs.map(s => {
                const total = cat.subTabs.reduce((acc, t) => acc + t.factors.length, 0) || 1;
                return (
                  <div
                    key={s.label}
                    className="mep__popover-bar-segment"
                    style={{ flex: Math.max(s.factors.length, 0.5) / total, backgroundColor: hovered.headerColor }}
                  />
                );
              })}
            </div>
            <div className="mep__popover-bar-labels">
              {cat.subTabs.map(s => {
                const total = cat.subTabs.reduce((acc, t) => acc + t.factors.length, 0) || 1;
                return (
                  <div
                    key={s.label}
                    className="mep__popover-bar-label"
                    style={{ flex: Math.max(s.factors.length, 0.5) / total }}
                  >
                    <span className="mep__popover-bar-label-name">{s.label}</span>
                    <span className="mep__popover-bar-label-count">{s.factors.length} factor{s.factors.length !== 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <div className="mep__popover-footer">Click to explore →</div>
    </div>
  );
}

// ── Treemap section ───────────────────────────────────────────────────────────

type TreemapSectionProps = Pick<MethodologyExplainerPageProps, 'onNavigate'>;

function TreemapSection({ onNavigate }: TreemapSectionProps) {
  const [hovered, setHovered] = useState<TreemapHovered | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, domainId: string, catId: string, catLabel: string, headerColor: string) => {
    setHovered({ domainId, catId, catLabel, headerColor, x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (hovered) setHovered(h => h ? { ...h, x: e.clientX, y: e.clientY } : h);
  };

  const renderRow = (domains: typeof DOMAIN_DATA) => (
    <div className="mep__treemap-row">
      {domains.map(domain => {
        const cols = Math.max(1, Math.ceil(Math.sqrt(domain.categories.length)));
        const cellColor = DOMAIN_CELL_COLOR[domain.id] ?? '#f0f0e8';
        return (
          <div key={domain.id} className="mep__treemap-domain">
            <div className="mep__treemap-domain-header" style={{ backgroundColor: domain.headerColor }}>
              {domain.label}
            </div>
            <div className="mep__treemap-domain-body" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {domain.categories.map(cat => (
                <button
                  key={cat.id}
                  className="mep__treemap-cell"
                  style={{ backgroundColor: cellColor }}
                  onClick={() => onNavigate('domain-detail', undefined, undefined, domain.id, cat.id)}
                  onMouseEnter={e => handleMouseEnter(e, domain.id, cat.id, cat.label, domain.headerColor)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHovered(null)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <section className="mep__section mep__section--treemap" aria-labelledby="mep-s3-title">
        <div className="mep__section-inner mep__section-inner--wide">
          <Reveal className="mep__s1-header">
            <h2 id="mep-s3-title" className="mep__s1-title">How vulnerability factors are organised</h2>
            <p className="mep__s1-intro">
              Vulnerability Factors are grouped into six domains. Each domain covers a distinct area of a woman's life that research has shown to shape her health-seeking behaviour and outcomes.
            </p>
          </Reveal>
          <div className="mep__treemap">
            {renderRow(DOMAIN_DATA.slice(0, 3))}
            {renderRow(DOMAIN_DATA.slice(3, 6))}
          </div>
        </div>
      </section>
      {hovered && <TreemapPopover hovered={hovered} />}
    </>
  );
}

// ── Steps scrollytelling section ─────────────────────────────────────────────

const STEPS = [
  {
    step: 1,
    label: 'Step #1',
    title: 'Select data set',
    body: "Pathways segmentations are built on survey data. You can bring an existing dataset, such as the Demographic Health Survey (DHS), or work with us to run a dedicated Pathways survey. Either way, we'll help you get to a segmentation that fits your context.",
  },
  {
    step: 2,
    label: 'Step #2',
    title: 'Identify factors',
    body: 'DHS and Pathways surveys contain hundreds of data points. Pathways analyses these data points to identify which factors predict health outcomes, so segmentations are built on signal, not noise.',
  },
  {
    step: 3,
    label: 'Step #3',
    title: 'Clustering factors into segments',
    body: 'The reduced set of Vulnerability Factors is then analysed using Latent Class Analysis and Principal Component Analysis to identify groups of women who are distinctly different from each other in their circumstances and behaviours. Each group that emerges is a segment — a real cluster of similar women found in the data, not a pre-defined archetype.',
  },
  {
    step: 4,
    label: 'Step #4',
    title: 'Ranking segments by vulnerability',
    body: 'Health outcome and behaviour data points, from the same dataset, is then used to rank the segments from least to most vulnerable. Segments are assigned one of four vulnerability levels: most vulnerable, more vulnerable, less vulnerable, least vulnerable.',
  },
] as const;

function StepsSection() {
  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(STEPS[i].step); },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section className="mep__section mep__section--steps" aria-labelledby="mep-s2-title">
      <div className="mep__s2-header">
        <Reveal className="mep__s1-header">
          <h2 id="mep-s2-title" className="mep__s1-title">How segments are created</h2>
          <p className="mep__s1-intro">Segments emerge from the data using a two-stage statistical process</p>
        </Reveal>
      </div>

      <div className="mep__scrolly">
        {/* Left: scrolling text steps */}
        <div className="mep__scrolly-text">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              ref={el => { stepRefs.current[i] = el; }}
              className={`mep__step-text-block${activeStep === s.step ? ' is-active' : ''}`}
            >
              <span className="mep__step-label">{s.label}</span>
              <h3 className="mep__step-title">{s.title}</h3>
              <p className="mep__step-body">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Right: sticky visual canvas */}
        <div className="mep__scrolly-visual">
          <StepCanvas step={activeStep} />
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function MethodologyExplainerPage({ currentPage, onNavigate }: MethodologyExplainerPageProps) {
  useEffect(() => { document.title = 'Pathways | Understanding the data'; }, []);

  return (
    <div className="mep">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <main id="main-content">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="mep__hero" aria-labelledby="mep-hero-title">
          <div className="mep__hero-content">
            <h1 id="mep-hero-title" className="mep__hero-title">
              Understanding Pathways data
            </h1>
            <p className="mep__hero-subtitle">
              Unlike clinical data, Pathways reflects a woman's life when the health system is not around her: her household, her relationships, her economic situation, her social environment. This gives a consolidated picture of who she is in relation to health, not just what happens when she engages with health services.
            </p>
          </div>
          <div className="mep__hero-visual">
            <IllustrationPlaceholder label="Illustration: hero image" height={540} />
          </div>
        </header>

        {/* ── Section 1: Two types of data ─────────────────────────────────── */}
        <section id="mep-s1" className="mep__section" aria-labelledby="mep-s1-title">
          <div className="mep__section-inner">
            <Reveal className="mep__s1-header">
              <h2 id="mep-s1-title" className="mep__s1-title">Two types of data</h2>
              <p className="mep__s1-intro">
                Pathways segmentations use two distinct types of data points. Understanding this distinction is key to understanding Pathways.
              </p>
            </Reveal>

            <div className="mep__two-col">
              <Reveal className="mep__data-type-col">
                <div className="mep__data-type-icon mep__data-type-icon--vf">
                  <div className="mep__data-type-swatch mep__data-type-swatch--vf" />
                </div>
                <h3 className="mep__data-type-title">Vulnerability factors</h3>
                <p className="mep__data-type-body">
                  Social, economic, and environmental circumstances that shape a woman's life outside the health system: who she is, where she lives, what resources she has access to. They are upstream conditions that predict whether she is likely to seek or receive care, drawn from the Pathways survey and datasets such as the DHS, and organised into six domains.
                </p>
              </Reveal>

              <Reveal delay={80} className="mep__data-type-col">
                <div className="mep__data-type-icon mep__data-type-icon--ho">
                  <div className="mep__data-type-swatch mep__data-type-swatch--ho" />
                </div>
                <h3 className="mep__data-type-title">Health outcomes and data</h3>
                <p className="mep__data-type-body">
                  Measurable indicators of what happens when women interact with the health system: whether they attended antenatal care, delivered in a facility, vaccinated their children, or used contraception. They do not define segments; they are used to rank them, making visible which groups have the most unmet need.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Section 2: How segments are created ──────────────────────────── */}
        <StepsSection />

        {/* ── Section 3: Vulnerability framework treemap ───────────────────── */}
        <TreemapSection onNavigate={onNavigate} />

      </main>

      <Footer />
    </div>
  );
}
