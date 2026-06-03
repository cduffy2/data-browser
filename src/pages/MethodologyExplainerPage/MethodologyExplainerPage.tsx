import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA } from '../DomainDetailPage/domainData';
import InfoOutlinedIcon from '../../assets/icons/InfoOutlined.svg?react';
import segmentsPng from '../../assets/icons/Segments.png';
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

// 9 households × 9 VFs — opacity level 0–3 (0=lowest/lightest, 3=highest)
const S3_SCORES = [
  [0, 2, 0, 2, 1, 2, 3, 1, 2],
  [1, 0, 2, 3, 0, 3, 3, 2, 0],
  [0, 1, 3, 3, 0, 3, 0, 2, 0],
  [3, 0, 2, 3, 0, 0, 0, 2, 2],
  [0, 2, 3, 1, 3, 3, 2, 3, 1],
  [0, 3, 0, 3, 1, 0, 3, 0, 3],
  [3, 0, 2, 3, 0, 3, 3, 0, 0],
  [0, 1, 3, 3, 0, 0, 3, 2, 0],
  [3, 0, 2, 1, 3, 0, 0, 0, 2],
];
const S3_OPACITIES = [0.15, 0.4, 0.7, 1.0];

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
      states.push({ cx: (lx + 12) * S, cy: (ly + 12) * T, fill: '#88c1fd', opacity: 1, r: 10 });
    }
    for (let i = 0; i < HO; i++) {
      const [lx, ly] = fig[VF + i] ?? [0, 0];
      states.push({ cx: (lx + 12) * S, cy: (ly + 12) * T, fill: '#8da0cb', opacity: 1, r: 10 });
    }
    return states;
  }

  if (step === 2) {
    for (let i = 0; i < VF; i++) {
      const { cx, cy } = vfGridPos(i);
      const pred = STEP2_PREDICTIVE.has(i);
      if (pred) {
        states.push({ cx, cy, fill: '#88c1fd', opacity: 1, r: 10 });
      } else {
        states.push({ cx, cy, fill: '#dbecfe', opacity: 1, r: 10, stroke: '#88c1fd', strokeDasharray: '4 4' });
      }
    }
    for (let i = 0; i < HO; i++) {
      const { cx, cy } = hoGridPos(i);
      states.push({ cx, cy, fill: '#8da0cb', opacity: 1, r: 10 });
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
      states.push({ cx, cy: cy + 120, fill: '#88c1fd', opacity: 0, r: 10 });
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
        states.push({ cx: o.ox + col * 48, cy: o.oy + row * 48, fill: '#88c1fd', opacity, r: 10, stroke: isCentre ? undefined : '#88c1fd', strokeDasharray: undefined, dotIdx: idx });
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

// ── Step 4 HTML visual ────────────────────────────────────────────────────────

// Ordered 1 (least, top) → 4 (most, bottom). clusterIndex maps to S5_ROW_Y position.
// Segments icon path (from Segments.svg) — used inline so fill can be coloured per rank
const SEGMENTS_PATH = "M1 18C0.716667 18 0.479333 17.904 0.288 17.712C0.096 17.5207 0 17.2833 0 17V16.425C0 15.6917 0.366667 15.104 1.1 14.662C1.83333 14.2207 2.8 14 4 14C4.21667 14 4.421 14.0083 4.613 14.025C4.80433 14.0417 4.99167 14.0667 5.175 14.1C4.94167 14.4333 4.77067 14.7917 4.662 15.175C4.554 15.5583 4.5 15.9667 4.5 16.4V18H1ZM7 18C6.71667 18 6.479 17.904 6.287 17.712C6.09567 17.5207 6 17.2833 6 17V16.4C6 15.3167 6.55433 14.4373 7.663 13.762C8.771 13.0873 10.2167 12.75 12 12.75C13.8 12.75 15.25 13.0873 16.35 13.762C17.45 14.4373 18 15.3167 18 16.4V17C18 17.2833 17.904 17.5207 17.712 17.712C17.5207 17.904 17.2833 18 17 18H7ZM19.5 18V16.4C19.5 15.9667 19.4417 15.5583 19.325 15.175C19.2083 14.7917 19.0417 14.4333 18.825 14.1C19.0083 14.0667 19.196 14.0417 19.388 14.025C19.5793 14.0083 19.7833 14 20 14C21.2 14 22.1667 14.2207 22.9 14.662C23.6333 15.104 24 15.6917 24 16.425V17C24 17.2833 23.904 17.5207 23.712 17.712C23.5207 17.904 23.2833 18 23 18H19.5ZM12 14.75C11.05 14.75 10.2 14.879 9.45 15.137C8.7 15.3957 8.25833 15.6833 8.125 16H15.875C15.725 15.6667 15.2793 15.375 14.538 15.125C13.796 14.875 12.95 14.75 12 14.75ZM4 13C3.45 13 2.97933 12.804 2.588 12.412C2.196 12.0207 2 11.55 2 11C2 10.45 2.196 9.979 2.588 9.587C2.97933 9.19567 3.45 9 4 9C4.55 9 5.02067 9.19567 5.412 9.587C5.804 9.979 6 10.45 6 11C6 11.55 5.804 12.0207 5.412 12.412C5.02067 12.804 4.55 13 4 13ZM20 13C19.45 13 18.979 12.804 18.587 12.412C18.1957 12.0207 18 11.55 18 11C18 10.45 18.1957 9.979 18.587 9.587C18.979 9.19567 19.45 9 20 9C20.55 9 21.021 9.19567 21.413 9.587C21.8043 9.979 22 10.45 22 11C22 11.55 21.8043 12.0207 21.413 12.412C21.021 12.804 20.55 13 20 13ZM12 12C11.1667 12 10.4583 11.7083 9.875 11.125C9.29167 10.5417 9 9.83333 9 9C9 8.16667 9.29167 7.45833 9.875 6.875C10.4583 6.29167 11.1667 6 12 6C12.8333 6 13.5417 6.29167 14.125 6.875C14.7083 7.45833 15 8.16667 15 9C15 9.83333 14.7083 10.5417 14.125 11.125C13.5417 11.7083 12.8333 12 12 12ZM12 8C11.7167 8 11.4793 8.09567 11.288 8.287C11.096 8.479 11 8.71667 11 9C11 9.28333 11.096 9.52067 11.288 9.712C11.4793 9.904 11.7167 10 12 10C12.2833 10 12.521 9.904 12.713 9.712C12.9043 9.52067 13 9.28333 13 9C13 8.71667 12.9043 8.479 12.713 8.287C12.521 8.09567 12.2833 8 12 8Z";

const STEP5_RANKS = [
  {
    label: 'Least vulnerable',
    badgeSrc: Badge1,
    cardBorder: '#71d6db',
    cardBg: 'rgba(113,214,219,0.12)',
    hoSolid: 4,
    note: 'Stronger results',
    iconColor: '#003D1B',
  },
  {
    label: 'Less vulnerable',
    badgeSrc: Badge2,
    cardBorder: '#76b5e5',
    cardBg: 'rgba(118,181,229,0.08)',
    hoSolid: 3,
    note: null,
    iconColor: '#001E5E',
  },
  {
    label: 'More vulnerable',
    badgeSrc: Badge3,
    cardBorder: '#b5a4ea',
    cardBg: 'rgba(181,164,234,0.12)',
    hoSolid: 2,
    note: null,
    iconColor: '#6F22A8',
  },
  {
    label: 'Most vulnerable',
    badgeSrc: Badge4,
    cardBorder: '#f2a0ac',
    cardBg: 'rgba(242,160,172,0.12)',
    hoSolid: 1,
    note: 'Weaker results',
    iconColor: '#690133',
  },
];

const S4_HO_NAMES = [
  'No ANC visit',
  'Never tested for HIV',
  'No PNC for newborn',
  'DPT vaccine first dose',
  'No current modern FP use',
];

// Percentages per dot index [0..4] per rank row (0=least, 1=less, 2=more, 3=most)
const S4_HO_PCT: number[][] = [
  [25, 22, 63, 64, 87], // rank 0: least vulnerable — stronger results
  [18, 14, 32, 34, 42], // rank 1: less vulnerable
  [8,  4,  16, 22, 29], // rank 2: more vulnerable
  [1,  1,  7,  14, 20], // rank 3: most vulnerable — weaker results
];

// Fill opacities for HO dots per rank (0=least → 3=most vulnerable)
// Least: 70–100%, Less: 45–70%, More: 20–45%, Most: 5–20%
const HO_OPACITIES: number[][] = [
  [0.75, 0.85, 0.90, 0.95, 1.00], // least vulnerable
  [0.50, 0.55, 0.60, 0.65, 0.70], // less vulnerable
  [0.25, 0.30, 0.35, 0.40, 0.45], // more vulnerable
  [0.05, 0.08, 0.12, 0.16, 0.20], // most vulnerable
];

// Card geometry in SVG units (must match S5_X0/S5_DS/S5_R/S5_ROW_Y)
const S5_CARD_LEFT = S5_X0 - S5_R - 12;   // 52
const S5_CARD_SIZE = S5_DS * 2 + S5_R * 2 + 24; // 104
const S5_INFO_X = S5_CARD_LEFT + S5_CARD_SIZE + 16; // 172

// Rendered inside the SVG as foreignObject elements — automatically scales with SVG
function Step5Visual({ visible, onHoTooltip }: { visible: boolean; onHoTooltip: (t: { category: string; name: string; x: number; y: number } | null) => void }) {
  return (
    <>
      {STEP5_RANKS.map((rank, idx) => {
        const cardY = S5_ROW_Y[idx] - S5_R - 12;
        return (
          <g key={rank.label} opacity={visible ? 1 : 0} style={{ transition: `opacity 0.35s ease ${idx * 80}ms` }}>
            {/* Card border + background — pointer-events none so SVG dots below remain hoverable */}
            <rect
              x={S5_CARD_LEFT} y={cardY}
              width={S5_CARD_SIZE} height={S5_CARD_SIZE}
              rx={2}
              fill={rank.cardBg} stroke={rank.cardBorder} strokeWidth={1}
              pointerEvents="none"
            />
            {/* Segments icon at centre of 3×3 dot grid — coloured per rank */}
            <g
              transform={`translate(${S5_X0 + S5_DS - 12}, ${S5_ROW_Y[idx] + S5_DS - 12}) scale(${24/24})`}
              pointerEvents="none"
            >
              <path d={SEGMENTS_PATH} fill={rank.iconColor} />
            </g>
            {/* Info panel via foreignObject */}
            <foreignObject x={S5_INFO_X} y={cardY} width={240} height={S5_CARD_SIZE + 40}>
              <div className="mep-s4-info" style={{ height: '100%' }}>
                <img src={rank.badgeSrc} alt="" className="mep-s4-badge-img" width={24} height={24} />
                <div className="mep-s4-detail">
                  <span className="mep-s4-label">{rank.label}</span>
                  <div className="mep-s4-ho-dots">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="mep-s4-dot mep-s4-dot--hoverable"
                        onMouseEnter={e => onHoTooltip({ category: 'Health outcome and behaviour', name: `${S4_HO_NAMES[i]} · ${S4_HO_PCT[idx][i]}%`, x: e.clientX, y: e.clientY })}
                        onMouseMove={e => onHoTooltip({ category: 'Health outcome and behaviour', name: `${S4_HO_NAMES[i]} · ${S4_HO_PCT[idx][i]}%`, x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => onHoTooltip(null)}
                        style={{
                          cursor: 'default',
                          backgroundColor: `rgba(141,160,203,${HO_OPACITIES[idx][i]})`,
                          border: '1px solid #8da0cb',
                          boxSizing: 'border-box',
                        }}
                      />
                    ))}
                  </div>
                  {rank.note && <span className="mep-s4-note">{rank.note}</span>}
                </div>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </>
  );
}

// ── Step 3: Survey results matrix ────────────────────────────────────────────

const S3_VF_LABELS = [
  'Ever partnered', 'High-school education', 'Four or more children', 'Involved in decisions about FP',
  'Bank account (woman)', 'At least 3 HH members per room', 'HH Internet', 'HH in malaria zone', 'HH water not treated',
];

// All dots #88C1FD, varying fill opacity; 0 = very faint (moved above — used in buildStates)
// S3_SCORES and S3_OPACITIES are declared near the top of the file
// Percentage label shown in tooltip per score level (0=lowest, 3=highest)
const S3_SCORE_LABELS = ['12%', '38%', '67%', '91%'];

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

function Step3Visual({ onHover, prevStep }: { onHover: (t: { title: string; name: string; score: number; x: number; y: number } | null) => void; prevStep: number }) {
  const COL_W = 40;
  const ROW_H = 40;
  const R = 10;
  const LABEL_AREA = 100;
  const ROW_ICON_W = 32;
  const ICON_GAP = 8;
  const gridX = ROW_ICON_W + ICON_GAP;
  const gridY = LABEL_AREA;

  const totalW = gridX + 9 * COL_W;
  const totalH = gridY + 9 * ROW_H;
  const offsetX = (540 - totalW) / 2;
  const offsetY = (680 - totalH) / 2;

  // Animate circles in from step-2 grid positions when entering from step 2.
  // Two-phase: mount with start positions, then flip to real positions on next frame.
  const comingFromStep2 = prevStep === 2;
  const [settled, setSettled] = useState(!comingFromStep2);
  useEffect(() => {
    if (!comingFromStep2) { setSettled(true); return; }
    setSettled(false);
    const id = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <g transform={`translate(${offsetX}, ${offsetY})`}>
      {/* Column labels — angled 45° */}
      {S3_VF_LABELS.map((label, c) => {
        const cx = gridX + c * COL_W + R;
        return (
          <text
            key={c}
            x={cx}
            y={gridY - 8}
            fill="var(--text-tertiary, #666)"
            fontSize={12}
            fontWeight={600}
            fontFamily="Inter, sans-serif"
            textAnchor="start"
            transform={`rotate(-45, ${cx}, ${gridY - 8})`}
          >
            {label}
          </text>
        );
      })}

      {/* Rows */}
      {S3_SCORES.map((row, r) => {
        const targetCy = gridY + r * ROW_H + R;
        return (
          <g key={r}>
            {/* "Household #N" label — 16px gap to the left of the first dot */}
            <text
              x={gridX - 16}
              y={targetCy + 5}
              textAnchor="end"
              fontFamily="Inter, sans-serif"
              fontSize={12}
              fontWeight={600}
              fill="var(--text-tertiary, #666)"
            >
              {`Household #${r + 1}`}
            </text>
            {/* Score dots — animate from step-2 grid positions if entering from step 2 */}
            {row.map((score, c) => {
              const targetCx = gridX + c * COL_W + R;
              const opacity = S3_OPACITIES[score];
              // Map this matrix cell to a step-2 VF dot (8 cols × 6 rows, capped at 47).
              // Step-2 translate is y+210; positions are in absolute SVG coords, then
              // subtract offsetX/offsetY since we're inside the translated <g>.
              const dotIdx = Math.min(r * 9 + c, VF - 1);
              const s2 = vfGridPos(dotIdx);
              const startCx = settled ? targetCx : s2.cx - offsetX;
              const startCy = settled ? targetCy : s2.cy + 210 - offsetY;
              return (
                <circle
                  key={c}
                  cx={startCx}
                  cy={startCy}
                  r={R}
                  fill={`rgba(136,193,253,${opacity})`}
                  fillOpacity={settled ? opacity : 0}
                  stroke="#88c1fd"
                  strokeWidth={1}
                  className="mep-canvas__dot"
                  style={{ cursor: 'default' }}
                  onMouseEnter={e => onHover({ title: 'Vulnerability factor', name: S3_VF_LABELS[c], score, x: e.clientX, y: e.clientY })}
                  onMouseMove={e => onHover({ title: 'Vulnerability factor', name: S3_VF_LABELS[c], score, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => onHover(null)}
                />
              );
            })}
          </g>
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

  const prevStepRef = useRef(step);
  const prevStep = prevStepRef.current;
  useEffect(() => { prevStepRef.current = step; }, [step]);

  const [step5Visible, setStep5Visible] = useState(false);
  useEffect(() => {
    if (step === 5) {
      const t = setTimeout(() => setStep5Visible(true), 700);
      return () => clearTimeout(t);
    } else {
      setStep5Visible(false);
    }
  }, [step]);

  const [hoveredDot, setHoveredDot] = useState<{ i: number; x: number; y: number } | null>(null);
  const [legendTooltip, setLegendTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [hoTooltip, setHoTooltip] = useState<{ category: string; name: string; x: number; y: number } | null>(null);
  const [step3Tooltip, setStep3Tooltip] = useState<{ title: string; name: string; score: number; x: number; y: number } | null>(null);

  const getDotName = (i: number) => {
    if (i < VF) return VF_NAMES[i] ?? '';
    return HO_NAMES[i - VF] ?? '';
  };

  const getDotCategory = (i: number): string => {
    if (i >= VF) return 'Health outcome and behaviour';
    if (step === 2) return STEP2_PREDICTIVE.has(i) ? 'Differentiating vulnerability factor' : 'Non-differentiating vulnerability factor';
    if (step === 1) return 'Vulnerability factor';
    return 'Differentiating vulnerability factor';
  };

  return (
    <div className="mep-canvas-wrap">

      <div className="mep-canvas-svg-wrap">
        <svg
          className="mep-canvas"
          viewBox="-24 0 564 680"
          aria-hidden="true"
        >
          <g transform={`translate(0, ${
            step === 1 ? 76 :
            step === 2 ? 210 :
            step === 3 ? 0 :
            step === 4 ? 90 :
            0
          })`}>
            {showDivider && <line x1="362" y1="0" x2="362" y2="490" className="mep-canvas__divider" />}

            <ConnectorLines visible={showLines} />

            {dots.map((d, i) => (
              <circle
                key={i}
                cx={d.cx}
                cy={d.cy}
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
                style={{ cursor: 'default', pointerEvents: d.opacity > 0.05 ? 'auto' : 'none' }}
              />
            ))}

            {step !== 5 && labels.extra?.map((l, i) => (
              <text key={i} x={l.x} y={l.y} className="mep-canvas__sub-label" fill={l.color} fontWeight={l.weight ?? 600} textAnchor={l.anchor ?? 'start'}>{l.text}</text>
            ))}
          </g>

          {step === 3 && <Step3Visual onHover={setStep3Tooltip} prevStep={prevStep} />}
          {step === 4 && (
            // step 4 translate offset is 90 — add to cy so icons align with dots inside <g>
            <g transform="translate(0, 90)">
              {[{ cx: 158, cy: 128 }, { cx: 358, cy: 128 }, { cx: 158, cy: 328 }, { cx: 358, cy: 328 }].map((pos, i) => (
                <image key={i} href={segmentsPng} x={pos.cx - 12} y={pos.cy - 12} width={24} height={24} />
              ))}
            </g>
          )}
          {step === 5 && <Step5Visual visible={step5Visible} onHoTooltip={setHoTooltip} />}
        </svg>
      </div>

      {hoTooltip && (
        <div className="mep-canvas__tooltip" style={{ left: hoTooltip.x + 12, top: hoTooltip.y - 48 }}>
          <div className="mep-canvas__tooltip-category">{hoTooltip.category}</div>
          <div className="mep-canvas__tooltip-name">{hoTooltip.name}</div>
        </div>
      )}

      {/* Legend + hint */}
      <div className="mep-canvas__legend-wrap">
        <div className="mep-canvas__legend">
          {step === 2 ? (
            <>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#88c1fd' }} />
                Differentiating VF
              </span>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#dbecfe', border: '1px dashed #88c1fd', boxSizing: 'border-box' }} />
                Non-differentiating VF
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
                Vulnerability factor
              </span>
            </>
          ) : step === 4 ? (
            <>
              <span className="mep-canvas__legend-item">
                <span className="mep-canvas__legend-dot" style={{ backgroundColor: '#88c1fd' }} />
                Vulnerability factor
              </span>
              <span className="mep-canvas__legend-item">
                <img src={segmentsPng} alt="" width={24} height={24} style={{ flexShrink: 0 }} />
                Households
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
                {step === 1 ? 'Vulnerability factor' : 'Differentiating VF'}
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
        <div className="mep-canvas__hint">
          <InfoOutlinedIcon className="mep-canvas__hint-icon" aria-hidden="true" />
          {(step === 3 || step === 4) ? 'Darker colours indicate higher results' : 'Hover to see example data points'}
        </div>
      </div>

      {hoveredDot && (() => {
        const d = dots[hoveredDot.i];
        const isCluster = (step === 4 || step === 5) && d?.dotIdx !== undefined;
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
      {step3Tooltip && (
        <div className="mep-canvas__tooltip" style={{ left: step3Tooltip.x + 12, top: step3Tooltip.y - 48 }}>
          <div className="mep-canvas__tooltip-category">{step3Tooltip.title}</div>
          <div className="mep-canvas__tooltip-name">{step3Tooltip.name} · {S3_SCORE_LABELS[step3Tooltip.score]}</div>
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

// ── Defined term tooltip ──────────────────────────────────────────────────────

function DefineTerm({ children, definition }: { children: React.ReactNode; definition: string }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  return (
    <>
      <span
        className="mep__define-term"
        onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY })}
        onMouseMove={e => setTooltip({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setTooltip(null)}
      >
        {children}
      </span>
      {tooltip && (
        <div className="mep-canvas__tooltip" style={{ left: tooltip.x, top: tooltip.y - 40 }}>
          {definition}
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
      <span>Pathways segmentations are built on survey data, such as the Demographic and Health Survey (DHS) or a dedicated Pathways survey. Either way, we'll help you get to a segmentation that fits your context.</span>
      <br /><br />
      <span>Wondering if a segmentation is possible where you work? <a className="mep__step-link" href="mailto:hello@pathways.health">Reach out to us</a> for a discussion.</span>
    </>,
  },
  {
    step: 2,
    label: 'Step #2',
    title: 'Identify factors',
    body: 'DHS and Pathways surveys contain hundreds of indicators measuring vulnerability. Pathways analyses these to identify which are most strongly associated with health outcomes. The result is a reduced set of differentiating vulnerability factors: the ones that carry real signal, not noise.',
  },
  {
    step: 3,
    label: 'Step #3',
    title: 'Analyse survey results',
    body: <>
      <span>The survey data already contains results for each of these factors across every household interviewed.</span>
      <br /><br />
      <span>Pathways analyses how each household scores across all of them: where they have strong results, where they have weak ones, and where patterns of similarity begin to emerge.</span>
      <br /><br />
      <span>This variation in scores is what makes clustering possible. Without it, there would be no meaningful groups to find.</span>
    </>,
  },
  {
    step: 4,
    label: 'Step #4',
    title: 'Cluster households into segments',
    body: <>The reduced set of Vulnerability Factors are then analysed using <DefineTerm definition="A statistical method that identifies subgroups of individuals with similar patterns of responses across multiple variables.">Latent Class Analysis</DefineTerm> to identify groups of households who are distinctly different from each other in their circumstances. Each group that emerges is a segment, a real cluster of similar households found in the data, not a pre-defined archetype.</>,
  },
  {
    step: 5,
    label: 'Step #5',
    title: 'Ranking segments by vulnerability',
    body: <>
      <span>Health outcome and behaviour data points, from the same dataset, is then used to rank the segments from least to most vulnerable. Segments are assigned one of four vulnerability levels: most vulnerable, more vulnerable, less vulnerable, least vulnerable.</span>
      <br /><br />
      <span>Segments are further divided by whether the woman lives in an urban or rural area. Segments with the same vulnerability level but distinct characteristics are given a numeric suffix, for example, <strong>Rural 3.1</strong> and <strong>Rural 3.2</strong> are both "more vulnerable" rural segments, but with meaningfully different profiles.</span>
    </>,
  },
];

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
              <div className="mep__step-body">{s.body}</div>
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
              Pathways combines health outcome data with the social, cultural, economic, and environmental circumstances that shape a woman's life outside the health system. Together they give a consolidated picture of who she is in relation to health, not just what happens when she engages with services.
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
                  Social, cultural, economic, and environmental circumstances that shape a woman's life outside the health system: who she is, where she lives, what resources she has access to. They are upstream conditions that predict her ability to lead a healthy life whether she is likely to seek or receive care, drawn from the Pathways survey and datasets such as the DHS, and organised into six domains.
                </p>
              </Reveal>

              <Reveal delay={80} className="mep__data-type-col">
                <div className="mep__data-type-icon mep__data-type-icon--ho">
                  <div className="mep__data-type-swatch mep__data-type-swatch--ho" />
                </div>
                <h3 className="mep__data-type-title">Health outcomes and health behaviours</h3>
                <p className="mep__data-type-body">
                  Measurable indicators of what happens when women interact with the health system: whether they attended antenatal care, delivered in a facility, vaccinated their children, or used contraception. They do not define segments; they are used to rank them, making visible which groups have the greatest needs.
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
