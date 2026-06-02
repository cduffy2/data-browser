import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { DOMAIN_DATA } from '../DomainDetailPage/domainData';
import InfoOutlinedIcon from '../../assets/icons/InfoOutlined.svg?react';
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

// Step 4 layout constants — used in buildStates and Step4Visual
// SVG viewBox: -24 0 564 680 (usable 540×680)
// 4 clusters, 3×3 dots, r=8 (16px), 32px spacing, 40px gap between rows
// Total height = 4×80 + 3×40 = 440 → startY = 120
// Card left = dot left edge - padding = (S4_X0 - S4_R) - 12
const S4_X0 = 72;                        // dot grid centre-x start
const S4_DS = 32;                        // dot centre-to-centre
const S4_ROW_Y = [120, 240, 360, 480];   // top-left dot y per rank (cl 0=most → 3=least)
const S4_R = 8;                          // dot radius

interface DotState { cx: number; cy: number; fill: string; opacity: number; r: number; stroke?: string; strokeDasharray?: string }

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
    // 4 clusters (A/B/C/D), 9 dots each (3×3)
    // Dot spacing: 48px centre-to-centre. Cluster size: 120×120px.
    // 80px gap between clusters. Grid width/height = 120+80+120 = 320px.
    // Canvas usable width ~540px → startX = (540-320)/2 = 110
    // Canvas usable height ~480px → startY = (480-320)/2 = 80
    const GAP = 80;
    const CW = 120; // cluster width/height
    const startX = 110;
    const startY = 80;
    const clusterOrigins = [
      { ox: startX,        oy: startY        }, // A: top-left
      { ox: startX+CW+GAP, oy: startY        }, // B: top-right
      { ox: startX,        oy: startY+CW+GAP }, // C: bottom-left
      { ox: startX+CW+GAP, oy: startY+CW+GAP }, // D: bottom-right
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
        states.push({ cx: 12, cy: 600, fill: '#88c1fd', opacity: 0, r: 4 });
      }
    }
    // HO dots: hide in step 3
    for (let i = 0; i < HO; i++) {
      states.push({ cx: 12, cy: 600, fill: '#8da0cb', opacity: 0, r: 4 });
    }
    return states;
  }

  // Step 4: clusters animate to their ranked card positions.
  // Uses module-level S4_* constants defined below buildStates.
  const clusterCounts4: number[] = [0, 0, 0, 0];
  for (let i = 0; i < VF; i++) {
    if (SELECTED.has(i)) {
      const cl = SELECTED_CLUSTER[i];
      const idx = clusterCounts4[cl]++;
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const displayRow = 3 - cl; // cl 0=most→bottom(row 3), cl 3=least→top(row 0)
      states.push({ cx: S4_X0 + col * S4_DS, cy: S4_ROW_Y[displayRow] + row * S4_DS, fill: '#88c1fd', opacity: 1, r: S4_R });
    } else {
      states.push({ cx: S4_X0, cy: S4_ROW_Y[0], fill: '#88c1fd', opacity: 0, r: S4_R });
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
  3: {
    vf: 'Segments emerge',
    ho: '',
    // Labels sit below each cluster. startX=110, startY=80, CW=120, GAP=80
    // Cluster centre x = ox + 48. Label y = cluster bottom + 20
    extra: [
      { text: 'Segment A', x: 158, y: 220, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment B', x: 358, y: 220, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment C', x: 158, y: 420, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
      { text: 'Segment D', x: 358, y: 420, color: 'var(--text-tertiary, #666)', weight: 'normal', anchor: 'middle' },
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

// Ordered 1 (least, top) → 4 (most, bottom). clusterIndex maps to S4_ROW_Y position.
const STEP4_RANKS = [
  {
    label: 'Least vulnerable',
    badgeSrc: Badge1,
    cardBorder: '#71d6db',
    cardBg: 'rgba(113,214,219,0.12)',
    hoSolid: 4,
    note: 'Stronger results',
  },
  {
    label: 'Less vulnerable',
    badgeSrc: Badge2,
    cardBorder: '#76b5e5',
    cardBg: 'rgba(118,181,229,0.08)',
    hoSolid: 3,
    note: null,
  },
  {
    label: 'More vulnerable',
    badgeSrc: Badge3,
    cardBorder: '#b5a4ea',
    cardBg: 'rgba(181,164,234,0.12)',
    hoSolid: 2,
    note: null,
  },
  {
    label: 'Most vulnerable',
    badgeSrc: Badge4,
    cardBorder: '#f2a0ac',
    cardBg: 'rgba(242,160,172,0.12)',
    hoSolid: 1,
    note: 'Weaker results',
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
  [1,  1,  7,  14, 20], // rank 0: least vulnerable
  [8,  4,  16, 22, 29], // rank 1: less vulnerable
  [18, 14, 32, 34, 42], // rank 2: more vulnerable
  [25, 22, 63, 64, 87], // rank 3: most vulnerable
];

// Card geometry in SVG units (must match S4_X0/S4_DS/S4_R/S4_ROW_Y)
const S4_CARD_LEFT = S4_X0 - S4_R - 12;   // 52
const S4_CARD_SIZE = S4_DS * 2 + S4_R * 2 + 24; // 104
const S4_INFO_X = S4_CARD_LEFT + S4_CARD_SIZE + 16; // 172

// Rendered inside the SVG as foreignObject elements — automatically scales with SVG
function Step4Visual({ visible, onHoTooltip }: { visible: boolean; onHoTooltip: (t: { text: string; x: number; y: number } | null) => void }) {
  return (
    <>
      {STEP4_RANKS.map((rank, idx) => {
        const cardY = S4_ROW_Y[idx] - S4_R - 12;
        return (
          <g key={rank.label} opacity={visible ? 1 : 0} style={{ transition: `opacity 0.35s ease ${idx * 80}ms` }}>
            {/* Card border + background — pointer-events none so SVG dots below remain hoverable */}
            <rect
              x={S4_CARD_LEFT} y={cardY}
              width={S4_CARD_SIZE} height={S4_CARD_SIZE}
              rx={2}
              fill={rank.cardBg} stroke={rank.cardBorder} strokeWidth={1}
              pointerEvents="none"
            />
            {/* Info panel via foreignObject */}
            <foreignObject x={S4_INFO_X} y={cardY} width={240} height={S4_CARD_SIZE + 40}>
              <div className="mep-s4-info" style={{ height: '100%' }}>
                <img src={rank.badgeSrc} alt="" className="mep-s4-badge-img" width={24} height={24} />
                <div className="mep-s4-detail">
                  <span className="mep-s4-label">{rank.label}</span>
                  <div className="mep-s4-ho-dots">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`mep-s4-dot mep-s4-dot--ho${i < rank.hoSolid ? ' mep-s4-dot--ho-solid' : ' mep-s4-dot--ho-dashed'}`}
                        onMouseEnter={e => onHoTooltip({ text: `${S4_HO_NAMES[i]} · ${S4_HO_PCT[idx][i]}%`, x: e.clientX, y: e.clientY })}
                        onMouseMove={e => onHoTooltip({ text: `${S4_HO_NAMES[i]} · ${S4_HO_PCT[idx][i]}%`, x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => onHoTooltip(null)}
                        style={{ cursor: 'default' }}
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

function StepCanvas({ step }: { step: number }) {
  const dots = DOT_STATES[step];
  const labels = STEP_LABELS[step];
  const showLines = step === 2;
  const showDivider = false;

  const [step4Visible, setStep4Visible] = useState(false);
  useEffect(() => {
    if (step === 4) {
      // Wait for dots to animate to position (~700ms), then show HTML overlay
      const t = setTimeout(() => setStep4Visible(true), 700);
      return () => clearTimeout(t);
    } else {
      setStep4Visible(false);
    }
  }, [step]);

  const [hoveredDot, setHoveredDot] = useState<{ i: number; x: number; y: number } | null>(null);
  const [legendTooltip, setLegendTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [hoTooltip, setHoTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const getDotName = (i: number) => {
    if (i < VF) return VF_NAMES[i] ?? '';
    return HO_NAMES[i - VF] ?? '';
  };

  return (
    <div className="mep-canvas-wrap">

      {/* Title — fixed position, 24px above SVG */}
      <div className="mep-canvas__title">{STEP_TITLES[step]}</div>

      <div className="mep-canvas-svg-wrap">
        <svg
          className="mep-canvas"
          viewBox="-24 0 564 680"
          aria-hidden="true"
        >
          <g transform={`translate(0, ${
            step === 1 ? 76 :
            step === 2 ? 210 :
            step === 3 ? 90 :
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
                opacity={d.opacity}
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

            {step !== 4 && labels.extra?.map((l, i) => (
              <text key={i} x={l.x} y={l.y} className="mep-canvas__sub-label" fill={l.color} fontWeight={l.weight ?? 600} textAnchor={l.anchor ?? 'start'}>{l.text}</text>
            ))}
          </g>

          {step === 4 && <Step4Visual visible={step4Visible} onHoTooltip={setHoTooltip} />}
        </svg>
      </div>

      {hoTooltip && (
        <div className="mep-canvas__tooltip" style={{ left: hoTooltip.x + 12, top: hoTooltip.y - 36 }}>
          {hoTooltip.text}
        </div>
      )}

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
    title: 'Select data set',
    body: <>
      <span>Pathways segmentations are built on survey data - such as the Demographic and Health Survey (DHS) or a dedicated Pathways survey. Either way, we'll help you get to a segmentation that fits your context.</span>
      <br /><br />
      <span>Wondering if a segmentation is possible where you work? <a className="mep__step-link" href="mailto:hello@pathways.health">Reach out to us</a> for a discussion.</span>
    </>,
  },
  {
    step: 2,
    label: 'Step #2',
    title: 'Identify factors',
    body: 'DHS and Pathways surveys contain hundreds of indicators measuring vulnerability. Pathways analyses these indicators to identify which are most strongly associated with health outcomes, so segmentations are built on signal, not noise.',
  },
  {
    step: 3,
    label: 'Step #3',
    title: 'Clustering factors into segments',
    body: <>The reduced set of Vulnerability Factors are then analysed using <DefineTerm definition="A statistical method that identifies subgroups of individuals with similar patterns of responses across multiple variables.">Latent Class Analysis</DefineTerm> to identify groups of women who are distinctly different from each other in their circumstances. Each group that emerges is a segment, a real cluster of similar women found in the data, not a pre-defined archetype.</>,
  },
  {
    step: 4,
    label: 'Step #4',
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
