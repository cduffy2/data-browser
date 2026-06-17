import { useEffect, useRef, useState } from 'react';
import healthAreaShowingPng from '../../assets/Health area showing.png';
import biharIndiaFlag from '../../assets/icons/Bihar-India.png';
import ethiopiaFlag from '../../assets/icons/ethiopia.png';
import indonesiaFlag from '../../assets/icons/indonesia.png';
import kenyaFlag from '../../assets/icons/kenya.png';
import nigeriaFlag from '../../assets/icons/nigeria.png';
import senegalFlag from '../../assets/icons/Senegal.png';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA } from '../DomainDetailPage/domainData';
import InfoOutlinedIcon from '../../assets/icons/InfoOutlined.svg?react';
import ChildHealthIcon from '../../assets/icons/child-health.svg?react';
import ImmunisationIcon from '../../assets/icons/immunisation.svg?react';
import MaternalHealthIcon from '../../assets/icons/maternal-health.svg?react';
import NutritionIcon from '../../assets/icons/nutrition.svg?react';
import FamilyPlanningIcon from '../../assets/icons/family-planning.svg?react';
import segmentsPng from '../../assets/icons/Segments.png';
import bracketSvg from '../../assets/Layout/516/Bracket.svg';
import Badge1 from '../../assets/icons/1.png';
import Badge2 from '../../assets/icons/2.png';
import Badge3 from '../../assets/icons/3.png';
import Badge4 from '../../assets/icons/4.png';
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

// Step 2 visual only: ~50% of dots shown as solid (predictive), rest as dashed
// Spread pseudo-randomly across all 6 rows (8 cols each)
const STEP2_PREDICTIVE = new Set([
  1, 3, 5, 7,        // row 0: cols 1,3,5,7
  8, 10, 13, 15,     // row 1: cols 0,2,5,7
  16, 19, 21, 23,    // row 2: cols 0,3,5,7
  24, 26, 29, 31,    // row 3: cols 0,2,5,7
  33, 35, 37, 39,    // row 4: cols 1,3,5,7
  40, 43, 45, 47,    // row 5: cols 0,3,5,7
]);

// Assign selected dots evenly across 4 clusters (9 each), round-robin
const SELECTED_CLUSTER: Record<number, 0|1|2|3> = {};
SELECTED_ARR.forEach((idx, pos) => { SELECTED_CLUSTER[idx] = (pos % 4) as 0|1|2|3; });

// Step 4 layout constants — used in buildStates and Step5Visual
// SVG viewBox: -24 0 564 680 (usable 540×680)
// 4 clusters, 3×3 dots, r=8 (16px), 32px spacing, 40px gap between rows
// Total height = 4×80 + 3×40 = 440 → startY = 120
// Card left = dot left edge - padding = (S5_X0 - S5_R) - 12
const S5_X0 = 72;                        // dot grid centre-x start
const S5_DS = 32;                        // dot centre-to-centre
const S5_ROW_Y = [120, 240, 360, 480];   // top-left dot y per rank (cl 0=most → 3=least)
const S5_R = 8;                          // dot radius

// 12 households × 9 VFs — raw fill opacities from Figma node 1193-3936
const S3_HH_OPACITIES = [
  [0.18, 0.80, 0.20, 0.57, 0.88, 0.22, 1.00, 0.21, 0.62], // HH1
  [1.00, 0.18, 0.57, 0.88, 0.22, 0.80, 0.62, 0.21, 0.20], // HH2
  [0.28, 0.52, 0.90, 0.82, 0.21, 0.03, 0.72, 0.21, 0.09], // HH3
  [0.90, 0.22, 0.73, 0.42, 0.23, 0.05, 0.03, 0.34, 0.41], // HH4
  [0.22, 0.52, 0.90, 0.29, 0.73, 0.52, 0.30, 0.78, 0.24], // HH5
  [0.18, 0.80, 0.20, 0.57, 0.88, 0.22, 1.00, 0.21, 0.62], // HH6
  [1.00, 0.18, 0.57, 0.88, 0.22, 0.80, 0.62, 0.21, 0.20], // HH7
  [0.28, 0.52, 0.90, 0.82, 0.21, 0.03, 0.72, 0.21, 0.09], // HH8
  [0.90, 0.22, 0.73, 0.42, 0.23, 0.05, 0.03, 0.34, 0.41], // HH9
  [0.90, 0.22, 0.73, 0.42, 0.23, 0.05, 0.03, 0.34, 0.41], // HH10
  [0.90, 0.22, 0.73, 0.42, 0.23, 0.05, 0.03, 0.34, 0.41], // HH11
  [0.90, 0.22, 0.73, 0.42, 0.23, 0.05, 0.03, 0.34, 0.41], // HH12
];

interface DotState { cx: number; cy: number; fill: string; opacity: number; r: number; stroke?: string; strokeDasharray?: string; dotIdx?: number }

// Per-cluster opacity patterns for 9 dots (idx 4 = centre icon placeholder, always 0)
// cl 0=least vulnerable … cl 3=most vulnerable
const CLUSTER_OPACITIES: number[][] = [
  [0.25, 0.1, 0.3,  0.15, 0,   0.2,  0.1,  0.25, 0.15], // A: least (0.1–0.3)
  [0.45, 0.3, 0.5,  0.35, 0,   0.4,  0.3,  0.45, 0.35], // B: less (0.3–0.5)
  [0.65, 0.5, 0.7,  0.55, 0,   0.6,  0.5,  0.65, 0.55], // C: more (0.5–0.7)
  [1.0, 0.75, 0.9,  0.8,  0,   0.85, 0.7,  0.95, 0.8 ], // D: most (0.7–1.0)
];

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
      states.push({ cx: (lx + 12) * S, cy: (ly + 12) * T, fill: '#88c1fd', opacity: 1, r: 8 });
    }
    for (let i = 0; i < HO; i++) {
      const [lx, ly] = fig[VF + i] ?? [0, 0];
      states.push({ cx: (lx + 12) * S, cy: (ly + 12) * T, fill: '#8da0cb', opacity: 1, r: 8 });
    }
    return states;
  }

  if (step === 2) {
    for (let i = 0; i < VF; i++) {
      const { cx, cy } = vfGridPos(i);
      const pred = STEP2_PREDICTIVE.has(i);
      if (pred) {
        states.push({ cx, cy, fill: '#88c1fd', opacity: 1, r: 8 });
      } else {
        states.push({ cx, cy, fill: '#dbecfe', opacity: 1, r: 8, stroke: '#88c1fd', strokeDasharray: '4 4' });
      }
    }
    for (let i = 0; i < HO; i++) {
      const { cx, cy } = hoGridPos(i);
      states.push({ cx, cy, fill: '#8da0cb', opacity: 1, r: 8 });
    }
    return states;
  }

  if (step === 3) {
    // Dots are spread across the canvas in the step-2 VF grid layout (in step-4 coord
    // space, g translate = 90), invisible. When step 4 fires they become visible and
    // converge into clusters — giving a clear gathering motion.
    for (let i = 0; i < VF; i++) {
      const { cx, cy } = vfGridPos(i);
      // vfGridPos is in step-2 space (g translate = 210). Convert to step-4 space (g = 90):
      // screen_cy = cy + 210 → step4_cy = screen_cy - 90 = cy + 120
      states.push({ cx, cy: cy + 120, fill: '#88c1fd', opacity: 0, r: 8 });
    }
    for (let i = 0; i < HO; i++) states.push({ cx: 258, cy: 700, fill: '#8da0cb', opacity: 0, r: 4 });
    return states;
  }

  if (step === 4) {
    // 4 clusters (A/B/C/D), 9 dots each (3×3)
    // Centre dot (idx 4) hidden — replaced by Segments icon in renderer
    const GAP = 80;
    const CW = 120;
    const startX = 110;
    const startY = 80;
    const clusterOrigins = [
      { ox: startX,        oy: startY        }, // A: least vulnerable (top-left)
      { ox: startX+CW+GAP, oy: startY        }, // B: less vulnerable (top-right)
      { ox: startX,        oy: startY+CW+GAP }, // C: more vulnerable (bottom-left)
      { ox: startX+CW+GAP, oy: startY+CW+GAP }, // D: most vulnerable (bottom-right)
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
        const opacity = CLUSTER_OPACITIES[cl][idx];
        const isCentre = idx === 4;
        states.push({ cx: o.ox + col * 48, cy: o.oy + row * 48, fill: '#88c1fd', opacity, r: 8, stroke: isCentre ? undefined : '#88c1fd', strokeDasharray: undefined, dotIdx: idx });
      } else {
        states.push({ cx: 12, cy: 600, fill: '#88c1fd', opacity: 0, r: 4 });
      }
    }
    for (let i = 0; i < HO; i++) {
      states.push({ cx: 12, cy: 600, fill: '#8da0cb', opacity: 0, r: 4 });
    }
    return states;
  }

  // Step 5: clusters animate to their ranked card positions.
  // Uses module-level S4_* constants defined below buildStates.
  const clusterCounts4: number[] = [0, 0, 0, 0];
  for (let i = 0; i < VF; i++) {
    if (SELECTED.has(i)) {
      const cl = SELECTED_CLUSTER[i];
      const idx = clusterCounts4[cl]++;
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const displayRow = 3 - cl; // cl 0=most→bottom(row 3), cl 3=least→top(row 0)
      const isCentre = idx === 4;
      states.push({ cx: S5_X0 + col * S5_DS, cy: S5_ROW_Y[displayRow] + row * S5_DS, fill: '#88c1fd', opacity: isCentre ? 0 : CLUSTER_OPACITIES[cl][idx], r: S5_R, dotIdx: idx, stroke: isCentre ? undefined : '#88c1fd' });
    } else {
      states.push({ cx: S5_X0, cy: S5_ROW_Y[0], fill: '#88c1fd', opacity: 0, r: S5_R });
    }
  }
  for (let i = 0; i < HO; i++) {
    states.push({ cx: 12, cy: 700, fill: '#8da0cb', opacity: 0, r: 4 });
  }
  return states;
}

// Pre-compute all states
const DOT_STATES: Record<number, DotState[]> = {
  1: buildStates(1),
  2: buildStates(2),
  3: buildStates(3),
  4: buildStates(4),
  5: buildStates(5),
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
  // Child health
  'No PNC for newborn', 'Death of a child before 5 yrs', 'Fever 2 weeks last',
  // Immunisation
  'Zero-dose child', 'Child not immunized - DPT', 'No routine vaccination',
  // Maternal health
  'Less than 4 ANC visits last', 'Latest birth delivered at home', 'Pregnancy loss',
  // Nutrition
  'Stunted child', 'Woman is underweight',
  // SRH
  'Never tested for HIV',
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


// Build connector arrows for step 2: each predictive VF → one assigned HO (round-robin)
const STEP2_PREDICTIVE_ARR = Array.from(STEP2_PREDICTIVE);
function buildLines(): { x1: number; y1: number; x2: number; y2: number; delay: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
  STEP2_PREDICTIVE_ARR.forEach((vfi, si) => {
    const vfp = vfGridPos(vfi);
    const hp = hoGridPos(si % HO);
    lines.push({
      x1: vfp.cx, y1: vfp.cy,
      x2: hp.cx,  y2: hp.cy,
      delay: si * 20,
    });
  });
  return lines;
}

const CONNECTOR_LINES = buildLines();

// Step labels config
const STEP_LABELS: Record<number, {
  vf: string; ho: string;
  extra?: { text: string; x: number; y: number; color: string; weight?: string; anchor?: 'start' | 'middle' | 'end' | 'inherit' }[]
}> = {
  1: { vf: 'Survey data points', ho: 'Health outcomes or behaviours' },
  2: { vf: 'Predictive vulnerability factors', ho: 'Health outcomes or behaviours' },
  3: { vf: '', ho: '' },
  4: {
    vf: 'Segments emerge',
    ho: '',
    extra: [
      { text: 'Segment A', x: 158, y: 220, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment B', x: 358, y: 220, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment C', x: 158, y: 420, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment D', x: 358, y: 420, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
    ],
  },
  5: {
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

// Connector arrows animate via CSS keyframe on stroke-dashoffset
// We use a key on the <g> to retrigger the animation when step changes to 2
function ConnectorLines({ visible }: { visible: boolean }) {
  return (
    <g className={`mep-canvas__lines${visible ? ' is-visible' : ''}`}>
      <defs>
        <marker id="mep-arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#677BA1" />
        </marker>
      </defs>
      {CONNECTOR_LINES.map((l, i) => {
        const dx = l.x2 - l.x1;
        const dy = l.y2 - l.y1;
        const len = Math.hypot(dx, dy);
        // Stop line 14px before target centre (r=10 + 4px arrowhead clearance)
        const trim = 14;
        const ex = l.x2 - (dx / len) * trim;
        const ey = l.y2 - (dy / len) * trim;
        const trimmedLen = len - trim;
        return (
          <line
            key={i}
            x1={l.x1} y1={l.y1}
            x2={ex} y2={ey}
            className="mep-canvas__line"
            markerEnd="url(#mep-arrow)"
            style={{
              strokeDasharray: trimmedLen,
              strokeDashoffset: visible ? 0 : trimmedLen,
              transitionDelay: visible ? `${l.delay}ms` : '0ms',
            }}
          />
        );
      })}
    </g>
  );
}

// ── Step 5 HTML visual ────────────────────────────────────────────────────────

const S5_HO_NAMES = [
  'Less than 4 ANC visits last',
  'Never tested for HIV',
  'No PNC for newborn',
  'Child not immunized - DPT',
  'Never used modern FP method',
];

const S5_HO_PCT: number[][] = [
  [25, 22, 63, 64, 87], // least vulnerable — best outcomes
  [18, 14, 32, 34, 42], // less vulnerable
  [8,  4,  16, 22, 29], // more vulnerable
  [1,  1,  7,  14, 20], // most vulnerable — worst outcomes
];

const S5_ROWS = [
  {
    label: 'Least vulnerable',
    badgeSrc: Badge1,
    clusterLabel: 'Cluster 4',
    cardBorder: 'var(--vulnerability-least-300-light, #71d6db)',
    cardBg: 'var(--vulnerability-least-050, #daeee3)',
    hoDotColor: '#8da0cb',
    outcomeLabel: 'Best outcomes',
  },
  {
    label: 'Less vulnerable',
    badgeSrc: Badge2,
    clusterLabel: 'Cluster 2',
    cardBorder: 'var(--vulnerability-less-300-light, #76b5e5)',
    cardBg: 'var(--vulnerability-less-050, #E5F0F8)',
    hoDotColor: '#a8b6d7',
    outcomeLabel: 'Better outcomes',
  },
  {
    label: 'More vulnerable',
    badgeSrc: Badge3,
    clusterLabel: 'Cluster 1',
    cardBorder: 'var(--vulnerability-more-300-light, #b5a4ea)',
    cardBg: 'var(--vulnerability-more-050, #f1e6f4)',
    hoDotColor: '#c2cde3',
    outcomeLabel: 'Poor outcomes',
  },
  {
    label: 'Most vulnerable',
    badgeSrc: Badge4,
    clusterLabel: 'Cluster 3',
    cardBorder: 'var(--vulnerability-most-300-light, #f2a0ac)',
    cardBg: 'var(--vulnerability-most-050, #FFF0F1)',
    hoDotColor: '#dde3ef',
    outcomeLabel: 'Worst outcomes',
  },
];

function Step5Visual({ visible }: { visible: boolean }) {
  const [tooltip, setTooltip] = useState<{ name: string; pct: number; x: number; y: number } | null>(null);
  const [cardTooltip, setCardTooltip] = useState<{ label: string; clusterLabel: string; x: number; y: number } | null>(null);

  return (
    <div className="mep-s5">
      <div className="mep-s5__rows">
        {S5_ROWS.map((row, idx) => (
          <div
            key={row.label}
            className="mep-s5__row"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: `opacity 0.4s ease ${idx * 70}ms, transform 0.45s cubic-bezier(0.4,0,0.2,1) ${idx * 70}ms`,
            }}
          >
            <div
              className="mep-s5__card"
              style={{ borderColor: row.cardBorder, backgroundColor: row.cardBg, cursor: 'default' }}
              onMouseEnter={e => setCardTooltip({ label: row.label, clusterLabel: row.clusterLabel, x: e.clientX, y: e.clientY })}
              onMouseMove={e => setCardTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
              onMouseLeave={() => setCardTooltip(null)}
            >
              <div className="mep-s5__card-top">
                <img src={row.badgeSrc} alt="" width={24} height={24} className="mep-s5__badge" />
                <span className="mep-s5__card-label">{row.label}</span>
              </div>
              <div className="mep-s5__card-cluster">
                <img src={segmentsPng} alt="" width={24} height={24} />
                <span className="mep-s5__cluster-name">{row.clusterLabel}</span>
              </div>
            </div>
            <div className="mep-s5__outcomes">
              <div className="mep-s5__ho-dots">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="mep-s5__ho-dot"
                    style={{ backgroundColor: row.hoDotColor, borderColor: '#8da0cb' }}
                    onMouseEnter={e => setTooltip({ name: S5_HO_NAMES[i], pct: S5_HO_PCT[idx][i], x: e.clientX, y: e.clientY })}
                    onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
              <span className="mep-s5__outcome-label">{row.outcomeLabel}</span>
            </div>
          </div>
        ))}
      </div>
      {tooltip && (
        <div className="mep-canvas__tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 48 }}>
          <div className="mep-canvas__tooltip-category">Health outcome or behaviour</div>
          <div className="mep-canvas__tooltip-name">{tooltip.name} · {tooltip.pct}%</div>
        </div>
      )}
      {cardTooltip && (
        <div className="mep-canvas__tooltip" style={{ left: cardTooltip.x + 12, top: cardTooltip.y - 44 }}>
          <div className="mep-canvas__tooltip-name">Households grouped by similar vulnerability factor profiles</div>
        </div>
      )}
    </div>
  );
}

// ── Step 3: Survey results matrix ────────────────────────────────────────────

const S3_VF_LABELS = [
  'Ever partnered', 'High-school education', 'Four or more children', 'Involved in decisions about FP',
  'Bank account (woman)', 'At least 3 HH members per room', 'HH Internet', 'HH in malaria zone', 'HH water not treated',
];

// All dots #88C1FD, varying fill opacity from S3_HH_OPACITIES (declared near top of file)

// Fixed label per cluster position (idx 0–8, matching S3_VF_LABELS order)
// idx 4 is the centre icon — same label assigned but dot is hidden/non-interactive
const CLUSTER_DOT_LABELS = [
  'Ever partnered',
  'High-school education',
  'Four or more children',
  'Involved in decisions about FP',
  'Bank account (woman)',
  'At least 3 HH members per room',
  'HH Internet',
  'HH in malaria zone',
  'HH water not treated',
];

// Convert a fill opacity (0–1) to a percentage string for step 4/5 tooltips
function opacityToPercent(opacity: number): string {
  return `${Math.round(opacity * 100)}%`;
}

// ── Shared layout constants for steps 3 & 4 ──────────────────────────────────
// Both steps use the same column x-positions so dots can animate between them.
// Dots are positioned via SVG transform:translate so CSS transitions work reliably.

const S34_R = 8;             // dot radius (16px diameter — fits 9 cols comfortably)
const S34_COL_W = 28;        // column centre-to-centre (16px dot + 12px gap)
const S34_LABEL_AREA = 140;  // vertical space for rotated headers (longest label ≈130px projected)
const S34_LABEL_W = 96;      // left area: "Household #N" or "Cluster N + icon"
const S34_BRACKET_W = 18;    // bracket SVG width
const S34_BRACKET_GAP = 6;   // gap between bracket right edge and first dot column
const S34_gridX = S34_LABEL_W + S34_BRACKET_W + S34_BRACKET_GAP; // x of first dot centre
const S34_TOTAL_W = S34_gridX + 9 * S34_COL_W;                   // 96+18+6+252 = 372
const S34_offsetX = (540 - S34_TOTAL_W) / 2;                     // ≈84

// Step 3: 9 rows, evenly spaced
const S34_ROW_H_3 = 28;
const S34_gridY_3 = S34_LABEL_AREA;

// Step 4: 4 clusters × 3 rows, 12px padding, 12px gap between clusters
const S34_DOT_ROW_H_4 = 28; // same spacing as step 3
const S34_BOX_PAD = 12;     // padding inside each cluster box
const S34_CLUSTER_GAP = 12; // gap between cluster boxes
const S34_BOX_H = 2 * S34_BOX_PAD + 2 * S34_R + 2 * S34_DOT_ROW_H_4;

// Pre-compute: for each cluster ci, for each row ri, the cy of the dot in step 4 (in viewBox coords)
function s4DotCy(ci: number, ri: number): number {
  const boxTop = S34_LABEL_AREA + ci * (S34_BOX_H + S34_CLUSTER_GAP);
  return boxTop + S34_BOX_PAD + S34_R + ri * S34_DOT_ROW_H_4;
}

// Total height of step-4 grid content
const S34_TOTAL_H_4 = S34_LABEL_AREA + 4 * S34_BOX_H + 3 * S34_CLUSTER_GAP;
const S34_offsetY_4 = Math.max(4, (680 - S34_TOTAL_H_4) / 2);

// Step-3 total height and offsetY (12 rows)
const S34_TOTAL_H_3 = S34_LABEL_AREA + 12 * S34_ROW_H_3;
const S34_offsetY_3 = Math.max(4, (680 - S34_TOTAL_H_3) / 2);

// Cluster data — 4 clusters, 3 rows each, 9 opacities per row
const S4_CLUSTERS: { label: string; rows: number[][] }[] = [
  { label: 'Cluster 1', rows: [[0.39,0.36,0.20,0.50,0.40,0.30,0.40,0.39,0.37],[0.38,0.35,0.40,0.42,0.23,0.49,0.50,0.39,0.41],[0.45,0.49,0.57,0.30,0.30,0.32,0.42,0.39,0.37]] },
  { label: 'Cluster 2', rows: [[0.75,0.80,0.80,0.57,0.88,0.42,1.00,0.21,0.62],[0.70,0.52,0.90,0.82,0.21,0.82,0.72,0.21,1.00],[0.90,0.60,0.73,0.42,0.55,0.50,0.40,0.34,0.41]] },
  { label: 'Cluster 3', rows: [[0.03,0.12,0.28,0.30,0.32,0.03,0.24,0.08,0.15],[0.18,0.40,0.20,0.20,0.10,0.22,0.20,0.02,0.32],[0.30,0.22,0.27,0.24,0.12,0.05,0.03,0.12,0.41]] },
  { label: 'Cluster 4', rows: [[0.55,0.52,0.75,0.55,0.73,0.52,0.30,0.78,0.24],[0.55,0.60,0.73,0.42,0.40,0.68,0.75,0.34,0.41],[0.55,0.60,0.73,0.42,0.60,0.60,0.63,0.34,0.41]] },
];

// Map each (cluster, row) pair to the step-3 household row index (0-indexed).
// Cluster 1: HH1, HH3, HH7 → rows 0, 2, 6
// Cluster 2: HH2, HH12, HH8 → rows 1, 11, 7
// Cluster 3: HH3, HH5, HH9 → rows 2, 4, 8
// Cluster 4: HH6, HH4, HH11 → rows 5, 3, 10
const S4_ROW_TO_S3_ROW: number[][] = [
  [0,  2,  6], // cluster 1: HH1, HH3, HH7
  [1, 11,  7], // cluster 2: HH2, HH12, HH8
  [2,  4,  8], // cluster 3: HH3, HH5, HH9
  [5,  3, 10], // cluster 4: HH6, HH4, HH11
];

// Unified component — renders step 3 and step 4, animating dots between positions.
// Dots are positioned via `transform: translate(x, y)` on a <circle cx=0 cy=0> so that
// CSS transitions on `transform` work reliably across all browsers (SVG cx/cy transitions
// are not universally supported).
function Step3And4Visual({
  step,
  onHover,
}: {
  step: 3 | 4 | 5;
  onHover: (t: { title: string; name: string; score: number; x: number; y: number } | null) => void;
}) {
  const isStep4 = step === 4;
  const isStep5 = step === 5;

  // settled drives CSS transitions for the 3→4 cluster animation.
  const [settled, setSettled] = useState(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    setSettled(false);
    settleTimerRef.current = setTimeout(() => setSettled(true), 20);
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // appearGen increments each time we enter step 3, used as a key on the dots group
  // so the CSS animation replays fresh even when returning from step 4.
  const appearGenRef = useRef(0);
  const prevStepRef2 = useRef(step);
  if (prevStepRef2.current !== step) {
    if (step === 3) appearGenRef.current += 1;
    prevStepRef2.current = step;
  }
  const doAppear = step === 3;

  // Chrome (boxes, brackets, labels) fades in after dots start moving; fades out on step 5
  const [chromeVisible, setChromeVisible] = useState(isStep4);
  useEffect(() => {
    if (!isStep4) { setChromeVisible(false); return; }
    const t = setTimeout(() => setChromeVisible(true), 280);
    return () => clearTimeout(t);
  }, [isStep4]);

  // Cluster labels slide right when going to step 5, slide back on return
  const labelsExited = isStep5;

  // Absolute x for each column — same in both steps, only y moves
  const colX = (c: number) => S34_offsetX + S34_gridX + c * S34_COL_W + S34_R;

  // Which step-3 row each (ci,ri) slot belongs to, in a flat lookup
  // Build a set of all s3rows that are in a cluster, for each column
  const clusterSlots: { key: string; ci: number; ri: number; s3row: number; clusterOpacity: number; col: number }[] = [];
  S4_CLUSTERS.forEach((cluster, ci) => {
    cluster.rows.forEach((row, ri) => {
      const s3row = S4_ROW_TO_S3_ROW[ci][ri];
      row.forEach((clusterOpacity, c) => {
        clusterSlots.push({ key: `${ci}-${ri}-${c}`, ci, ri, s3row, clusterOpacity, col: c });
      });
    });
  });

  // Set of s3rows that appear in at least one cluster
  const clusteredRows = new Set(S4_ROW_TO_S3_ROW.flat());

  // Step-3 y position for a given household row
  const cy3ForRow = (s3row: number) => S34_offsetY_3 + S34_gridY_3 + s3row * S34_ROW_H_3 + S34_R;

  // Build clustered dots (animate between s3 position and s4 cluster position)
  type DotSlot = {
    key: string; tx: number; ty: number; opacity: number;
    col: number; ci: number; ri: number; s3row: number;
  };
  const dots: DotSlot[] = clusterSlots.map(({ key, ci, ri, s3row, clusterOpacity, col: c }) => {
    const cx = colX(c);
    const cy3 = cy3ForRow(s3row);
    const cy4 = S34_offsetY_4 + s4DotCy(ci, ri);

    const tx = cx;
    const ty = !settled
      ? cy3
      : (isStep4 || isStep5 ? cy4 : cy3);

    const s3opacity = S3_HH_OPACITIES[s3row]?.[c] ?? 0.4;
    const opacity = (isStep4 || isStep5) ? (settled ? clusterOpacity : s3opacity) : s3opacity;

    return { key, tx, ty, opacity, col: c, ci, ri, s3row };
  });

  // Non-clustered rows (e.g. HH10 = index 9) — shown in step 3, fade out in step 4
  type StaticDot = { key: string; tx: number; ty: number; opacity: number; col: number; s3row: number };
  const staticDots: StaticDot[] = [];
  S3_HH_OPACITIES.forEach((hhRow, s3row) => {
    if (clusteredRows.has(s3row)) return;
    hhRow.forEach((op, c) => {
      staticDots.push({
        key: `static-${s3row}-${c}`,
        tx: colX(c),
        ty: cy3ForRow(s3row),
        opacity: isStep4 ? 0 : op,
        col: c,
        s3row,
      });
    });
  });

  // Stagger rows by their step-3 y so each row visibly peels away in sequence (3→4).
  const rowRank = (ci: number, ri: number): number => S4_ROW_TO_S3_ROW[ci][ri];
  const allRanks = S4_CLUSTERS.flatMap((_, ci) => [0,1,2].map(ri => rowRank(ci, ri)));
  const maxRank = Math.max(...allRanks);
  const rowDelay = (ci: number, ri: number) => Math.round((rowRank(ci, ri) / maxRank) * 380);

  // Stagger for step-3 appear animation: rows pop in top-to-bottom.
  const appearDelay = (s3row: number) => Math.round((s3row / 11) * 320);

  // Headers move with the grid via a translateY on a wrapper <g>
  const headerTranslateY = (isStep4 || isStep5 ? S34_offsetY_4 : S34_offsetY_3) - S34_offsetY_3;
  const headerBaseY = S34_offsetY_3 + S34_LABEL_AREA - 10;

  return (
    <g>
      {/* Column headers — translate Y with the grid so they stay above the dots */}
      <g style={{
        transform: `translateY(${headerTranslateY}px)`,
        opacity: isStep5 ? 0 : 1,
        transition: settled
          ? 'transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease'
          : 'opacity 0.3s ease',
      }}>
      {S3_VF_LABELS.map((label, c) => {
        const cx = colX(c);
        return (
          <text
            key={c}
            x={cx}
            y={headerBaseY}
            fill="var(--text-tertiary, #666)"
            fontSize={12}
            fontWeight={600}
            fontFamily="Inter, sans-serif"
            textAnchor="start"
            transform={`rotate(-45, ${cx}, ${headerBaseY})`}
          >
            {label}
          </text>
        );
      })}
      </g>

      {/* Step-3 "Household #N" row labels — fade out when entering step 4 */}
      {S3_HH_OPACITIES.map((_, r) => {
        const cy = S34_offsetY_3 + S34_gridY_3 + r * S34_ROW_H_3 + S34_R;
        return (
          <text
            key={r}
            x={S34_offsetX + 4}
            y={cy + 5}
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            fontSize={12}
            fontWeight={600}
            fill="var(--text-tertiary, #666)"
            style={{ opacity: isStep4 ? 0 : 1, transition: 'opacity 0.25s ease', pointerEvents: 'none' }}
          >
            {`Household #${r + 1}`}
          </text>
        );
      })}

      {/* Step-4 cluster chrome — fades in after dots start moving, exits on step 5 */}
      {S4_CLUSTERS.map((cluster, ci) => {
        const boxTop   = S34_offsetY_4 + s4DotCy(ci, 0) - S34_BOX_PAD - S34_R;
        const bracketH = S34_BOX_H - 2 * 6;
        const bracketY = boxTop + 6;
        // Label slides right toward step-5 card area on exit
        const labelSlide = labelsExited ? 120 : 0;
        const labelDelay = labelsExited ? ci * 40 : (280 + ci * 55);

        return (
          <g key={cluster.label}>
            {/* Box + bracket — fade in/out only, no slide */}
            <g style={{ opacity: chromeVisible && !isStep5 ? 1 : 0, transition: `opacity 0.3s ease ${ci * 55}ms` }}>
              <rect
                x={S34_offsetX}
                y={boxTop}
                width={S34_TOTAL_W}
                height={S34_BOX_H}
                rx={3}
                fill="none"
                stroke="var(--neutral-border, #CDD5DF)"
                strokeWidth={1}
              />
              <image
                href={bracketSvg}
                x={S34_offsetX + S34_LABEL_W}
                y={bracketY}
                width={S34_BRACKET_W}
                height={bracketH}
                preserveAspectRatio="none"
              />
            </g>
            {/* Icon + label — slide right into step-5 position */}
            <g style={{
              transform: `translateX(${labelSlide}px)`,
              opacity: chromeVisible ? (isStep5 ? 0 : 1) : 0,
              transition: `transform 0.5s cubic-bezier(0.4,0,0.2,1) ${labelDelay}ms, opacity 0.3s ease ${labelDelay}ms`,
            }}>
              <image
                href={segmentsPng}
                x={S34_offsetX + 4}
                y={S34_offsetY_4 + s4DotCy(ci, 1) - 12}
                width={24}
                height={24}
              />
              <text
                x={S34_offsetX + 32}
                y={S34_offsetY_4 + s4DotCy(ci, 1) + 5}
                fontFamily="Inter, sans-serif"
                fontSize={12}
                fontWeight={600}
                fill="var(--text-tertiary, #666)"
              >
                {cluster.label}
              </text>
            </g>
          </g>
        );
      })}

      {/* Dots group — keyed by appearGen so CSS animations replay when returning to step 3 */}
      <g key={appearGenRef.current}>
        {/* Non-clustered rows (e.g. HH10) — shown in step 3, fade out in step 4 */}
        {staticDots.map((d) => (
          <circle
            key={d.key}
            cx={0}
            cy={0}
            r={S34_R}
            fill={`rgba(136,193,253,${d.opacity})`}
            stroke="#88c1fd"
            strokeWidth={1}
            className="mep-canvas__dot"
            style={{
              '--dot-tx': `${d.tx}px`,
              '--dot-ty': `${d.ty}px`,
              transform: `translate(${d.tx}px, ${d.ty}px)`,
              animation: doAppear ? `mep-dot-appear 0.4s cubic-bezier(0.34,1.56,0.64,1) ${appearDelay(d.s3row)}ms both` : 'none',
              transition: doAppear ? 'none' : 'opacity 0.3s ease',
              opacity: isStep4 ? 0 : 1,
              cursor: 'default',
            } as React.CSSProperties}
            onMouseEnter={e => onHover({ title: 'Vulnerability factor', name: S3_VF_LABELS[d.col], score: 0, x: e.clientX, y: e.clientY })}
            onMouseMove={e => onHover({ title: 'Vulnerability factor', name: S3_VF_LABELS[d.col], score: 0, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => onHover(null)}
          />
        ))}

        {/* Clustered dots — animate between step-3 household row and step-4 cluster position */}
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={0}
            cy={0}
            r={S34_R}
            fill={`rgba(136,193,253,${d.opacity})`}
            stroke="#88c1fd"
            strokeWidth={1}
            className="mep-canvas__dot"
            style={{
              '--dot-tx': `${d.tx}px`,
              '--dot-ty': `${d.ty}px`,
              transform: `translate(${d.tx}px, ${d.ty}px)`,
              animation: doAppear ? `mep-dot-appear 0.4s cubic-bezier(0.34,1.56,0.64,1) ${appearDelay(d.s3row)}ms both` : 'none',
              transition: doAppear ? 'none' : `transform 0.6s cubic-bezier(0.4,0,0.2,1) ${rowDelay(d.ci, d.ri)}ms, fill 0.45s ease ${rowDelay(d.ci, d.ri)}ms`,
              cursor: 'default',
            } as React.CSSProperties}
            onMouseEnter={e => onHover({ title: 'Vulnerability factor', name: S3_VF_LABELS[d.col], score: 0, x: e.clientX, y: e.clientY })}
            onMouseMove={e => onHover({ title: 'Vulnerability factor', name: S3_VF_LABELS[d.col], score: 0, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => onHover(null)}
          />
        ))}
      </g>
    </g>
  );
}

// ── Step 2 grid visual (original) ────────────────────────────────────────────
// Thin wrapper that re-uses StepCanvasInner for step 2.
function Step2Toggle({ step2View, setStep2View }: { step2View: 'alt' | 'grid'; setStep2View: (v: 'alt' | 'grid') => void }) {
  return (
    <div className="mep__s2-toggle">
      <button className={`mep__s2-toggle-btn${step2View === 'alt' ? ' is-active' : ''}`} onClick={() => setStep2View('alt')}>One to many</button>
      <button className={`mep__s2-toggle-btn${step2View === 'grid' ? ' is-active' : ''}`} onClick={() => setStep2View('grid')}>All factors</button>
    </div>
  );
}

function Step2GridCanvas({ step2View, setStep2View }: { step2View: 'alt' | 'grid'; setStep2View: (v: 'alt' | 'grid') => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <StepCanvasInner step={2} extraHint={<Step2Toggle step2View={step2View} setStep2View={setStep2View} />} />
    </div>
  );
}

// ── Step 2 alternative visual ─────────────────────────────────────────────────
// Shows one VF dot fanning out to multiple HO dots via curved arrows.
// The old Step 2 grid+lines visual is preserved in the code below but hidden.

const STEP2_ALT_VF = 'Education level';
const STEP2_ALT_HO = [
  'Less than 4 ANC visits last',
  'Zero-dose child',
  'Stunted child',
  'Never tested for HIV',
  'Latest birth delivered at home',
  'Never used modern FP method',
];

function Step2AltCanvas({ step2View, setStep2View }: { step2View: 'alt' | 'grid'; setStep2View: (v: 'alt' | 'grid') => void }) {
  const [vfTooltip, setVfTooltip] = useState<{ x: number; y: number } | null>(null);
  const [hoTooltip, setHoTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [linesVisible, setLinesVisible] = useState(false);
  const [dotsVisible, setDotsVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDotsVisible(true), 100);
    const t2 = setTimeout(() => setLinesVisible(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Layout: SVG viewBox 0 0 540 260
  // VF dot and HO dots share the same cy (same row).
  // Curves dip below that row before sweeping up to each HO dot.
  const dotCy = 100;  // shared row for all dots
  const vfCx = 80;
  const vfCy = dotCy;
  const hoCy = dotCy;
  const hoCount = STEP2_ALT_HO.length;
  const hoXStart = 280;
  const hoSpacing = 32; // 16px dot diameter + 16px gap
  const hoXEnd = hoXStart + (hoCount - 1) * hoSpacing;
  const hoDots = STEP2_ALT_HO.map((name, i) => ({
    name,
    cx: hoXStart + i * hoSpacing,
    cy: hoCy,
  }));

  return (
    <div className="mep-canvas-wrap">
      <div className="mep-canvas__hint">
        <InfoOutlinedIcon className="mep-canvas__hint-icon" aria-hidden="true" />
        Hover to see example data points
      </div>
      <Step2Toggle step2View={step2View} setStep2View={setStep2View} />
      <div className="mep-canvas-svg-wrap">
        <svg className="mep-canvas mep-s2alt__svg" viewBox="0 0 540 260" aria-hidden="true">
          {/* Column labels — above the dot row */}
          <text x={vfCx} y={dotCy - 28} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={14} fontWeight={600} fill="var(--text-tertiary, #666)">Vulnerability factor</text>
          <text x={(hoXStart + hoXEnd) / 2} y={dotCy - 28} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={14} fontWeight={600} fill="var(--text-tertiary, #666)">Health outcome or behaviour</text>

          {/* HO dots — rendered before arrows so arrowheads sit on top */}
          {hoDots.map((ho, i) => (
            <circle
              key={ho.name}
              cx={ho.cx} cy={ho.cy} r={8}
              fill="#8da0cb"
              style={{
                opacity: dotsVisible ? 1 : 0,
                transition: `opacity 0.35s ease ${100 + i * 50}ms`,
                cursor: 'default',
              }}
              onMouseEnter={e => setHoTooltip({ name: ho.name, x: e.clientX, y: e.clientY })}
              onMouseMove={e => setHoTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
              onMouseLeave={() => setHoTooltip(null)}
            />
          ))}

          {/* Curved lines: start at VF dot, dip below the row, arrive vertically at each HO dot */}
          {hoDots.map((ho, i) => {
            // End point: below the HO dot so the vertical arrowhead sits clear of it
            const ex = ho.cx;
            const ey = ho.cy + 24;
            // Setting cpx = ex forces the bezier to arrive perfectly vertically,
            // so all arrowheads point straight up regardless of horizontal distance
            const cpx = ex;
            const cpy = dotCy + 120;
            const pathD = `M ${vfCx} ${vfCy} Q ${cpx} ${cpy} ${ex} ${ey}`;
            const approxLen = Math.hypot(ho.cx - vfCx, cpy - vfCy) * 1.6;
            return (
              <path
                key={ho.name}
                d={pathD}
                fill="none"
                stroke="#88c1fd"
                strokeWidth={1.5}
                style={{
                  strokeDasharray: approxLen,
                  strokeDashoffset: linesVisible ? 0 : approxLen,
                  transition: `stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 60}ms, opacity 0.2s ease ${i * 60}ms`,
                  opacity: linesVisible ? 1 : 0,
                }}
              />
            );
          })}

          {/* Arrowheads — fixed upward triangles, curves arrive vertically so they align */}
          {hoDots.map((ho, i) => {
            const ax = ho.cx;
            const ay = ho.cy + 24; // tip sits below the dot
            return (
              <polygon
                key={`arrow-${ho.name}`}
                points={`${ax},${ay} ${ax - 4},${ay + 8} ${ax + 4},${ay + 8}`}
                fill="#88c1fd"
                style={{
                  opacity: linesVisible ? 1 : 0,
                  transition: `opacity 0.15s ease ${600 + i * 60}ms`,
                }}
              />
            );
          })}

          {/* VF dot */}
          <circle
            cx={vfCx} cy={vfCy} r={8}
            fill="#88c1fd"
            style={{
              opacity: dotsVisible ? 1 : 0,
              transition: 'opacity 0.35s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => setVfTooltip({ x: e.clientX, y: e.clientY })}
            onMouseMove={e => setVfTooltip({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setVfTooltip(null)}
          />

        </svg>
      </div>

      {vfTooltip && (
        <div className="mep-canvas__tooltip" style={{ left: vfTooltip.x + 12, top: vfTooltip.y - 48 }}>
          <div className="mep-canvas__tooltip-category">Vulnerability factor</div>
          <div className="mep-canvas__tooltip-name">{STEP2_ALT_VF}</div>
        </div>
      )}
      {hoTooltip && (
        <div className="mep-canvas__tooltip" style={{ left: hoTooltip.x + 12, top: hoTooltip.y - 48 }}>
          <div className="mep-canvas__tooltip-category">Health outcome or behaviour</div>
          <div className="mep-canvas__tooltip-name">{hoTooltip.name}</div>
        </div>
      )}
    </div>
  );
}

function StepCanvasInner({ step, extraHint }: { step: number; extraHint?: React.ReactNode }) {
  const dots = DOT_STATES[step];
  const labels = STEP_LABELS[step];
  const showDivider = false;


  const prevStepRef = useRef(step);
  const prevStep = prevStepRef.current;
  useEffect(() => { prevStepRef.current = step; }, [step]);

  // Keep connector lines mounted for 350ms after leaving step 2 so they can fade out
  // before the g-transform jumps to the new step position.
  const [linesLinger, setLinesLinger] = useState(false);
  useEffect(() => {
    if (step === 2) { setLinesLinger(true); return; }
    const t = setTimeout(() => setLinesLinger(false), 350);
    return () => clearTimeout(t);
  }, [step]);

  // Delay line drawing until dots have settled in their step-2 grid positions (~700ms).
  const [linesVisible, setLinesVisible] = useState(false);
  useEffect(() => {
    if (step !== 2) { setLinesVisible(false); return; }
    const t = setTimeout(() => setLinesVisible(true), 700);
    return () => clearTimeout(t);
  }, [step]);

  const [step5Visible, setStep5Visible] = useState(false);
  useEffect(() => {
    if (step === 5) {
      const t = setTimeout(() => setStep5Visible(true), 350);
      return () => clearTimeout(t);
    } else {
      setStep5Visible(false);
    }
  }, [step]);

  const [hoveredDot, setHoveredDot] = useState<{ i: number; x: number; y: number } | null>(null);
  const [legendTooltip, setLegendTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [step34Tooltip, setStep34Tooltip] = useState<{ title: string; name: string; score: number; x: number; y: number } | null>(null);

  const getDotName = (i: number) => {
    if (i < VF) return VF_NAMES[i] ?? '';
    return HO_NAMES[i - VF] ?? '';
  };

  const getDotCategory = (i: number): string => {
    if (i >= VF) return 'Health outcome and behaviour';
    if (step === 2) return STEP2_PREDICTIVE.has(i) ? 'VF selected for clustering' : 'VF not selected for clustering';
    if (step === 1) return 'Vulnerability factor (VF)';
    return 'Differentiating vulnerability factor';
  };

  return (
    <div className="mep-canvas-wrap">

      <div className="mep-canvas__hint">
        <InfoOutlinedIcon className="mep-canvas__hint-icon" aria-hidden="true" />
        {'Hover to see example data points'}
      </div>
      {extraHint}

      <div className="mep-canvas-svg-wrap">
        <svg
          className="mep-canvas"
          viewBox="-24 0 564 680"
          aria-hidden="true"
          style={{ opacity: step === 5 ? 0 : 1, transition: 'opacity 0.3s ease' }}
        >
          {/* Connector lines kept in their own fixed-transform g so they can fade out
              without being repositioned when the main g-transform jumps to the next step */}
          {linesLinger && (
            <g transform="translate(0, 210)">
              <ConnectorLines visible={linesVisible} />
            </g>
          )}

          <g style={{
            transform: `translateY(${
              step === 1 ? 76 :
              step === 2 ? 210 :
              step === 3 ? 0 :
              90
            }px)`,
            transition: (step === 1 || step === 2) && (prevStep === 1 || prevStep === 2)
              ? 'transform 0.7s cubic-bezier(0.4,0,0.2,1)'
              : 'none',
          }}>
            {showDivider && <line x1="362" y1="0" x2="362" y2="490" className="mep-canvas__divider" />}

            {step !== 3 && step !== 4 && step !== 5 && dots.map((d, i) => (
              <circle
                key={i}
                cx={0}
                cy={0}
                r={d.r}
                fill={d.fill}
                fillOpacity={d.stroke ? d.opacity : undefined}
                opacity={d.stroke ? 1 : d.opacity}
                stroke={d.stroke ?? 'none'}
                strokeWidth={d.stroke ? 1 : 0}
                strokeDasharray={d.strokeDasharray ?? undefined}
                className="mep-canvas__dot"
                onMouseEnter={e => setHoveredDot({ i, x: e.clientX, y: e.clientY })}
                onMouseMove={e => setHoveredDot(h => h ? { ...h, x: e.clientX, y: e.clientY } : h)}
                onMouseLeave={() => setHoveredDot(null)}
                style={{
                  transform: `translate(${d.cx}px, ${d.cy}px)`,
                  transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), fill 0.5s ease, opacity 0.5s ease',
                  cursor: 'default',
                  pointerEvents: d.opacity > 0.05 ? 'auto' : 'none',
                }}
              />
            ))}

            {step !== 3 && step !== 4 && step !== 5 && labels.extra?.map((l, i) => (
              <text key={i} x={l.x} y={l.y} className="mep-canvas__sub-label" fill={l.color} fontWeight={l.weight ?? 600} textAnchor={l.anchor ?? 'start'}>{l.text}</text>
            ))}
          </g>

          {(step === 3 || step === 4 || step === 5) && (
            <Step3And4Visual step={step as 3 | 4 | 5} onHover={setStep34Tooltip} />
          )}
        </svg>

        {/* Step 5 overlay — slides in over the SVG */}
        <div className={`mep-s5-overlay${step === 5 ? ' is-visible' : ''}`}>
          <Step5Visual visible={step5Visible} />
        </div>
      </div>

      {/* Legend */}
      <div className="mep-canvas__legend-wrap">
        <div className="mep-canvas__legend">
          {step === 2 ? (
            <>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#88c1fd' }} />
                VF selected for clustering
              </span>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#dbecfe', border: '1px dashed #88c1fd', boxSizing: 'border-box' }} />
                VF not selected for clustering
              </span>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#8da0cb' }} />
                Health outcome or behaviour
              </span>
            </>
          ) : step === 3 ? (
            <>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#88c1fd' }} />
                Vulnerability factor (VF)
              </span>
            </>
          ) : step === 4 ? (
            <>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#88c1fd' }} />
                Vulnerability factor (VF)
              </span>
            </>
          ) : step === 5 ? (
            <>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#8da0cb' }} />
                Health outcome or behaviour
              </span>
              <span className="mep-canvas__legend-item">
                <img src={segmentsPng} alt="" width={20} height={20} style={{ flexShrink: 0 }} />
                Cluster of households
              </span>
            </>
          ) : (
            <>
              <span className="mep-canvas__legend-item">
                <span
                  className="mep-canvas__legend-dot"
                  style={{ backgroundColor: '#88c1fd', cursor: 'default' }}
                  onMouseEnter={e => setLegendTooltip({ text: VF_NAMES[0], x: e.clientX, y: e.clientY })}
                  onMouseMove={e => setLegendTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
                  onMouseLeave={() => setLegendTooltip(null)}
                />
                {step === 1 ? 'Vulnerability factor (VF)' : 'VF selected for clustering'}
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
            </>
          )}
        </div>
      </div>

      {hoveredDot && (() => {
        const d = dots[hoveredDot.i];
        const isCluster = step === 4 && d?.dotIdx !== undefined;
        const clusterLabel = isCluster ? CLUSTER_DOT_LABELS[d.dotIdx!] : null;
        const pct = isCluster ? opacityToPercent(d.opacity) : null;
        return (
          <div className="mep-canvas__tooltip" style={{ left: hoveredDot.x + 12, top: hoveredDot.y - 48 }}>
            <div className="mep-canvas__tooltip-category">{getDotCategory(hoveredDot.i)}</div>
            <div className="mep-canvas__tooltip-name">
              {isCluster ? `${clusterLabel} · ${pct}` : getDotName(hoveredDot.i)}
            </div>
          </div>
        );
      })()}
      {step34Tooltip && (
        <div className="mep-canvas__tooltip" style={{ left: step34Tooltip.x + 12, top: step34Tooltip.y - 48 }}>
          <div className="mep-canvas__tooltip-category">{step34Tooltip.title}</div>
          <div className="mep-canvas__tooltip-name">{step34Tooltip.name}</div>
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

// ── Health outcomes data ──────────────────────────────────────────────────────

interface HealthArea {
  id: string;
  label: string;
  cardBg: string;
  cardBorder: string;
  iconColor: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  dataPoints: string[];
}

const HEALTH_AREAS: HealthArea[] = [
  {
    id: 'child-health',
    label: 'Child health',
    cardBg: '#E5F0F8',
    cardBorder: '#76b5e5',
    iconColor: '#2a72b5',
    Icon: ChildHealthIcon,
    dataPoints: [
      'Acute Respiratory Illness (ARI) count', 'Acute Respiratory Illness (ARI) last',
      'No PNC for newborn', 'Child no fever/cough care count', 'Chest problems count',
      'Chest problems last', 'Any child chest problem', 'Cough 2 weeks last',
      'Cough count', 'Any child cough', 'Diarrhea 2 weeks last', 'Diarrhea count',
      'Any child diarrhea', 'Difficulty breathing count', 'Difficulty breathing last',
      'Any child difficulty breathing', 'Fever 2 weeks last', 'Fever count',
      'Fever or cough 2 weeks last', 'Any child fever 2 weeks last',
      'Skin-to-skin contact', 'Any child no fever/cough care',
      'Stillbirth count', 'Pregnancy ended in stillbirth',
      'Death of child before 1 yr count', 'Death of a child before 1 yr',
      'Death of child before 5 yrs count', 'Death of a child before 5 yrs',
      'No vitamin A supplements', 'No deworming medication', 'Vaccination documentation',
    ],
  },
  {
    id: 'immunisation',
    label: 'Immunisation',
    cardBg: '#daeee3',
    cardBorder: '#71d6db',
    iconColor: '#1e7a52',
    Icon: ImmunisationIcon,
    dataPoints: [
      'Child not immunized - MMR', 'Number not immunized - MMR',
      'Child not immunized - DPT', 'Number not immunized - DPT',
      'Child not immunized - polio', 'Number not immunized - polio',
      'Zero-dose child', 'Zero-dose child (count)',
      'No routine vaccination', 'No. without any routine vaccination',
      'Vaccination documentation',
    ],
  },
  {
    id: 'maternal-health',
    label: 'Maternal health',
    cardBg: '#f1e6f4',
    cardBorder: '#b5a4ea',
    iconColor: '#6b3fa0',
    Icon: MaternalHealthIcon,
    dataPoints: [
      'ANC 1st visit', 'Less than 4 ANC visits last', 'ANC month',
      'ANC total visits', 'Home birth count', 'Latest birth delivered at home',
      'Any home birth', 'No ANC 1st trimester last', 'Received PNC',
      'Ever had birth complications', 'Pregnancy loss',
      'No privacy and no menstrual products', 'Menstruation no privacy',
      'No proper menstrual products',
    ],
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    cardBg: '#fff4c1',
    cardBorder: '#e6c84a',
    iconColor: '#8a6200',
    Icon: NutritionIcon,
    dataPoints: [
      'Number of children breastfed', 'Any child breastfed',
      'No breastfeed count', 'Youngest child never breastfed',
      'Any child not breastfed', 'No. not immediately breastfed',
      'Child not immediately breastfed', 'Any child not immediately breastfed',
      'Child not exclusively breastfed', 'Any child not exclusively breastfed',
      'Number overweight', 'Overweight child last', 'Overweight child',
      'Number stunted', 'Stunted child last', 'Stunted child',
      'Number underweight', 'Underweight child last', 'Underweight child',
      'Number wasted', 'Wasted child last', 'Wasted child',
      'Woman is underweight', 'Woman is overweight or obese', 'Woman is obese',
      'micronutrient.12m',
    ],
  },
  {
    id: 'srh',
    label: 'Sexual & reproductive health',
    cardBg: '#FFF0F1',
    cardBorder: '#f2a0ac',
    iconColor: '#b52a40',
    Icon: FamilyPlanningIcon,
    dataPoints: [
      'No fp discontinue prev 5yrs', 'Never used modern FP method',
      'Non-use of modern FP method', 'STI in the last 12 months',
      'Never tested for HIV',
    ],
  },
];

// ── Health outcomes popover ───────────────────────────────────────────────────

interface HealthAreaHovered {
  areaId: string;
  areaLabel: string;
  x: number;
  y: number;
}

function HealthOutcomesPopover({ hovered }: { hovered: HealthAreaHovered }) {
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

  const area = HEALTH_AREAS.find(a => a.id === hovered.areaId);

  const twoCol = (area?.dataPoints.length ?? 0) > 10;

  return (
    <div ref={ref} className={`mep__popover${twoCol ? ' mep__popover--wide' : ''}`} style={{ left: pos.left, top: pos.top }}>
      <div className="mep__popover-title">{hovered.areaLabel}</div>
      {area && (
        <ul className={`mep__popover-subcat-list${twoCol ? ' mep__popover-subcat-list--two-col' : ''}`}>
          {area.dataPoints.map(dp => (
            <li key={dp} className="mep__popover-subcat-item">
              <span className="mep__popover-subcat-name">{dp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Health outcomes section ───────────────────────────────────────────────────

function HealthOutcomesSection() {
  const [hovered, setHovered] = useState<HealthAreaHovered | null>(null);

  return (
    <>
      <section className="mep__section mep__section--treemap" aria-labelledby="mep-ho-title">
        <div className="mep__section-inner mep__section-inner--wide">
          <Reveal className="mep__s1-header">
            <h2 id="mep-ho-title" className="mep__s1-title">How health outcomes and behaviours are organised</h2>
            <p className="mep__s1-intro">
              Health outcomes and behaviours are grouped into five health areas. These data points are used to rank segments by vulnerability, not to define them.
            </p>
          </Reveal>
          <div className="mep__ho-grid">
            {/* Row 1: label cell + Child health + Immunisation */}
            <div className="mep__ho-row">
              <div className="mep__ho-label-cell">
                <span className="mep__ho-axis-label">Health areas</span>
              </div>
              {HEALTH_AREAS.slice(0, 2).map(area => {
                const Icon = area.Icon;
                return (
                  <div
                    key={area.id}
                    className="mep__ho-card"
                    style={{ backgroundColor: area.cardBg }}
                    onMouseEnter={e => setHovered({ areaId: area.id, areaLabel: area.label, x: e.clientX, y: e.clientY })}
                    onMouseMove={e => setHovered(h => h ? { ...h, x: e.clientX, y: e.clientY } : h)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="mep__ho-card-icon-wrap">
                      <Icon width={24} height={24} style={{ color: area.iconColor }} />
                    </div>
                    <span className="mep__ho-card-label">{area.label}</span>
                    <span className="mep__ho-card-count">{area.dataPoints.length} data points</span>
                  </div>
                );
              })}
            </div>
            {/* Row 2: Maternal health + Nutrition + SRH */}
            <div className="mep__ho-row">
              {HEALTH_AREAS.slice(2).map(area => {
                const Icon = area.Icon;
                return (
                  <div
                    key={area.id}
                    className="mep__ho-card"
                    style={{ backgroundColor: area.cardBg }}
                    onMouseEnter={e => setHovered({ areaId: area.id, areaLabel: area.label, x: e.clientX, y: e.clientY })}
                    onMouseMove={e => setHovered(h => h ? { ...h, x: e.clientX, y: e.clientY } : h)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="mep__ho-card-icon-wrap">
                      <Icon width={24} height={24} style={{ color: area.iconColor }} />
                    </div>
                    <span className="mep__ho-card-label">{area.label}</span>
                    <span className="mep__ho-card-count">{area.dataPoints.length} data points</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {hovered && <HealthOutcomesPopover hovered={hovered} />}
    </>
  );
}

// ── Comparison tool CTA ───────────────────────────────────────────────────────

const CTA_GEOGRAPHIES = [
  { id: 'bihar-india',      name: 'Bihar, India',      flag: biharIndiaFlag },
  { id: 'ethiopia',         name: 'Ethiopia',           flag: ethiopiaFlag },
  { id: 'indonesia',        name: 'Indonesia',          flag: indonesiaFlag },
  { id: 'kenya',            name: 'Kenya',              flag: kenyaFlag },
  { id: 'northern-nigeria', name: 'Northern Nigeria',   flag: nigeriaFlag },
  { id: 'senegal',          name: 'Senegal',            flag: senegalFlag },
];

function CtaSection({ onNavigate }: { onNavigate: MethodologyExplainerPageProps['onNavigate'] }) {
  const [geo, setGeo] = useState<typeof CTA_GEOGRAPHIES[number] | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [showError, setShowError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const geoBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  return (
    <section className="mep__section mep__section--cta" aria-labelledby="mep-cta-title">
      <div className="mep__section-inner mep__cta-inner">
        <div className="mep__cta-left">
          <Reveal>
            <h2 id="mep-cta-title" className="mep__cta-title">Explore data points in the comparison tool</h2>
            <p className="mep__cta-body">
              When you explore by health area in Pathways, you'll see a mix of health outcomes and behaviours alongside vulnerability factors. The vulnerability factors shown for each health area are a curated starting point, selected by segmentation editors as likely to be of interest to practitioners working in that area.
            </p>
          </Reveal>
          <div className="mep__cta-action-wrap">
            <div className="mep__cta-action">
            <div className="mep__cta-geo-wrap" ref={dropdownRef}>
              <button
                ref={geoBtnRef}
                className={`mep__cta-geo-btn${geo ? ' mep__cta-geo-btn--active' : ''}`}
                onClick={() => {
                  if (!dropdownOpen && geoBtnRef.current) {
                    const r = geoBtnRef.current.getBoundingClientRect();
                    setDropdownPos({ top: r.bottom + 6, left: r.left });
                  }
                  setDropdownOpen(o => !o);
                }}
                aria-expanded={dropdownOpen}
              >
                {geo && <img src={geo.flag} alt="" className="mep__cta-geo-flag" />}
                <span className="mep__cta-geo-label">{geo ? geo.name : 'Select a geography'}</span>
                <svg className="mep__cta-geo-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="mep__cta-geo-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
                  {CTA_GEOGRAPHIES.map(g => (
                    <button
                      key={g.id}
                      className={`mep__cta-geo-option${geo?.id === g.id ? ' mep__cta-geo-option--active' : ''}`}
                      onClick={() => { setGeo(g); setDropdownOpen(false); setShowError(false); }}
                    >
                      <img src={g.flag} alt="" className="mep__cta-geo-option-flag" />
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="mep__cta-btn"
              onClick={() => { if (geo) { onNavigate('compare-segments'); } else { setShowError(true); } }}
            >
              Explore in comparison tool
            </button>
            </div>
            {showError && (
              <p className="mep__cta-error">Please select a geography first.</p>
            )}
          </div>
        </div>
        <div className="mep__cta-image-wrap">
          <div className="mep__cta-image-border">
            <img src={healthAreaShowingPng} alt="Comparison tool showing health area data" className="mep__cta-image" />
          </div>
        </div>
      </div>
    </section>
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
          <ul className="mep__popover-subcat-list">
            {[...cat.subTabs].sort((a, b) => b.factors.length - a.factors.length).map(s => (
              <li key={s.label} className="mep__popover-subcat-item">
                <span className="mep__popover-subcat-name">{s.label}</span>
                <span className="mep__popover-subcat-count">· {s.factors.length} factor{s.factors.length !== 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
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
      <section id="mep-treemap" className="mep__section mep__section--treemap" aria-labelledby="mep-s3-title">
        <div className="mep__section-inner mep__section-inner--wide">
          <Reveal className="mep__s1-header">
            <h2 id="mep-s3-title" className="mep__s1-title">How vulnerability factors are organised</h2>
            <p className="mep__s1-intro">
              Vulnerability Factors are grouped into six domains. Each domain covers a distinct area of a woman's life that research has shown to shape her health-seeking behaviour and outcomes.
            </p>
          </Reveal>
          <div className="mep__treemap-wrap">
            <div className="mep__treemap-section-label">Vulnerability domains</div>
            <div className="mep__treemap">
              {renderRow(DOMAIN_DATA.slice(0, 3))}
              {renderRow(DOMAIN_DATA.slice(3, 6))}
            </div>
          </div>
        </div>
      </section>
      {hovered && <TreemapPopover hovered={hovered} />}
    </>
  );
}

// ── Defined term tooltip ──────────────────────────────────────────────────────

function DefinedTerm({ children, tooltip }: { children: React.ReactNode; tooltip: string }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <>
      <span
        className="mep__defined-term"
        onMouseEnter={e => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); }}
        onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </span>
      {visible && (
        <div className="mep-canvas__tooltip mep__defined-term-tooltip" style={{ left: pos.x + 12, top: pos.y - 56 }}>
          {tooltip}
        </div>
      )}
    </>
  );
}


// ── Steps scrollytelling section ─────────────────────────────────────────────

const STEPS: { step: number; label: string; title: string; body: React.ReactNode }[] = [
  {
    step: 1,
    label: 'Step #1',
    title: 'Select dataset',
    body: <>
      <span>Pathways segments are built with survey data — such as the Demographic and Health Survey (DHS) or a dedicated Pathways survey. Either way, we'll help you get to a segmentation that fits your context.</span>
      <br /><br />
      <span>Wondering if a segmentation is possible where you work? <a className="mep__step-link" href="mailto:hello@pathways.health">Reach out to us</a> for a discussion.</span>
    </>,
  },
  {
    step: 2,
    label: 'Step #2',
    title: 'Identify factors',
    body: <>
      <span>DHS and Pathways surveys contain hundreds of indicators measuring vulnerability. Pathways analyses these to identify which are most strongly associated with health outcomes and health behaviours. The result is a reduced set of differentiating vulnerability factors: the ones that carry real signal, not noise.</span>
      <br /><br />
      <span>This step (and all subsequent steps) are done separately for urban and rural populations because vulnerability looks different in different places.</span>
    </>,
  },
  {
    step: 3,
    label: 'Step #3',
    title: 'Analyse vulnerability factor data across households',
    body: <>
      <span>The survey data already contains results for each of these factors across households. Pathways analyses vulnerability factors across all households to identify similar patterns.</span>
      <br /><br />
      <span>This variation across data points is what makes clustering possible. Without it, there would be no meaningful groups to find.</span>
    </>,
  },
  {
    step: 4,
    label: 'Step #4',
    title: 'Group households with similar vulnerability profiles into clusters',
    body: 'Households that look alike are grouped into clusters — each one a distinct segment found in the data, not a pre-defined archetype.',
  },
  {
    step: 5,
    label: 'Step #5',
    title: 'Rank clusters by health outcomes and behaviours',
    body: <>
      <span>Health outcome and behaviour data points, from the same dataset are then used to rank the segments from most to least vulnerable. Segments are assigned one of four vulnerability levels:</span>
      <br /><br />
      <div className="mep__step-badge-list">
        <div className="mep__step-badge-item"><img src={Badge4} alt="4" width={24} height={24} /> Most vulnerable</div>
        <div className="mep__step-badge-item"><img src={Badge3} alt="3" width={24} height={24} /> More vulnerable</div>
        <div className="mep__step-badge-item"><img src={Badge2} alt="2" width={24} height={24} /> Less vulnerable</div>
        <div className="mep__step-badge-item"><img src={Badge1} alt="1" width={24} height={24} /> Least vulnerable</div>
      </div>
      <br />
      <span>Segments with the same vulnerability level but distinct characteristics are given a numeric suffix, for example, <strong>Rural 3.1</strong> and <strong>Rural 3.2</strong> are both "more vulnerable" rural segments, but with meaningfully different profiles.</span>
    </>,
  },
];

function StepCanvas({ step, step2View, setStep2View }: { step: number; step2View: 'alt' | 'grid'; setStep2View: (v: 'alt' | 'grid') => void }) {
  if (step === 2) return step2View === 'alt'
    ? <Step2AltCanvas step2View={step2View} setStep2View={setStep2View} />
    : <Step2GridCanvas step2View={step2View} setStep2View={setStep2View} />;
  return <StepCanvasInner step={step} />;
}

function StepsSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [step2View, setStep2View] = useState<'alt' | 'grid'>('alt');
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
          <p className="mep__s1-intro">We use a two-stage statistical process to identify population segments grounded in real data.</p>
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
              <div className="mep__step-body">{s.body}</div>
            </div>
          ))}
        </div>

        {/* Right: sticky visual canvas */}
        <div className="mep__scrolly-visual">
          <StepCanvas step={activeStep} step2View={step2View} setStep2View={setStep2View} />
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
              Pathways provides information on health outcomes and behaviours, as well as social, cultural, economic, and environmental factors related to women's and children's health. Using this data in{' '}
              <DefinedTerm tooltip="Segmentation is the process of dividing a population into smaller, distinct groups based on shared characteristics, behaviors, or traits.">segmentation</DefinedTerm>
              {' '}gives a consolidated picture of who a woman is in relation to health, not just what happens when she engages with health services.
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
                  These are the social, cultural, economic, and environmental circumstances that shape a woman's life outside the health system: who she is, where she lives, what resources she has access to. They are upstream conditions that influence her ability to lead a healthy life and whether she is likely to seek care. Vulnerability factors are drawn from the Pathways survey and datasets such as the DHS, and organised into six domains.
                </p>
              </Reveal>

              <Reveal delay={80} className="mep__data-type-col">
                <div className="mep__data-type-icon mep__data-type-icon--ho">
                  <div className="mep__data-type-swatch mep__data-type-swatch--ho" />
                </div>
                <h3 className="mep__data-type-title">Health outcomes and health behaviours</h3>
                <p className="mep__data-type-body">
                  These are measurable indicators of women's and children's health and health behaviours, such as whether they attended antenatal care, vaccinated their children, were malnourished, or experienced a child death. They do not define segments; they are used to rank them, making visible which groups have the greatest needs.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Section 2: How segments are created ──────────────────────────── */}
        <StepsSection />

        {/* ── Section 3: Vulnerability framework treemap ───────────────────── */}
        <TreemapSection onNavigate={onNavigate} />

        {/* ── Section 4: Health outcomes treemap ───────────────────────────── */}
        <HealthOutcomesSection />

        {/* ── Section 5: CTA ───────────────────────────────────────────────── */}
        <CtaSection onNavigate={onNavigate} />

      </main>

      <Footer />
    </div>
  );
}
