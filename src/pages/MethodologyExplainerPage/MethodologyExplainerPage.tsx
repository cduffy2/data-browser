import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
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

// ── Domain data (sourced from domainData.ts) ──────────────────────────────────

const DOMAINS = [
  { id: 'woman-experiences',    label: 'Woman and her past experiences',          color: '#4b78a8', description: "The individual's life history and personal characteristics that shape her current health behaviour and resilience — including upbringing, education exposure, and demographic markers." },
  { id: 'health-mental',        label: 'Health mental models',                    color: '#3d806c', description: "The woman's knowledge, beliefs, attitudes, and behavioural patterns around health services, contraception, immunisation, and nutrition." },
  { id: 'household-relationships', label: 'Household relationships',              color: '#82701d', description: "The composition, relational dynamics, and power structures within the household that shape a woman's daily life, decision-making, and access to resources." },
  { id: 'household-economics',  label: 'Household economics and living conditions', color: '#71438a', description: "The household's economic resources, the woman's financial agency, access to support, and time constraints that collectively shape her ability to seek and receive care." },
  { id: 'social-support',       label: 'Social support',                          color: '#617498', description: "The size, quality, and reliability of the woman's social networks and the support they provide — a critical buffer against poverty and health risk." },
  { id: 'human-natural',        label: 'Human and natural systems',               color: '#b85555', description: "The broader environmental, infrastructural, and migratory forces outside the household that shape the conditions in which a woman lives and seeks care." },
] as const;

// ── Animated dot canvas ───────────────────────────────────────────────────────
//
// We define a fixed set of dots (VF + HO) with stable IDs. Each step assigns
// every dot a position (cx, cy as % of canvas), a fill colour, and an opacity.
// CSS transitions on cx/cy/fill/opacity animate smoothly between steps.
//
// Canvas: 560×480 (viewBox units). VF dots: 0–47. HO dots: 48–59.

const VF = 48; // vulnerability factor dots
const HO = 12; // health outcome dots

// Cluster assignments for steps 3+4
const CLUSTER_ARR: (0|1|2|3)[] = Array.from({ length: VF }, (_, i) => (i % 4) as 0|1|2|3);

// Whether a VF dot is "selected" (predictive) in step 2 — roughly half
const SELECTED = new Set([1,3,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46]);

// Step 3+4 cluster colours
const CLUSTER_COLORS = ['#4b78a8','#3d806c','#82701d','#71438a'];
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
    // VF dots: scattered grid, all blue, full opacity
    for (let i = 0; i < VF; i++) {
      const { cx, cy } = scatter(i, 8, 6, 44, 52, 24, 40);
      states.push({ cx, cy, fill: '#88c1fd', opacity: 1, r: 8 });
    }
    // HO dots: two-column cluster top-right area
    for (let i = 0; i < HO; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      states.push({ cx: 390 + col * 42, cy: 40 + row * 42, fill: '#af73c8', opacity: 1, r: 8 });
    }
    return states;
  }

  if (step === 2) {
    // VF dots: selected stay blue/opaque, non-selected fade to very low opacity
    for (let i = 0; i < VF; i++) {
      const { cx, cy } = scatter(i, 8, 6, 44, 52, 24, 40);
      const sel = SELECTED.has(i);
      states.push({ cx, cy, fill: sel ? '#88c1fd' : '#88c1fd', opacity: sel ? 1 : 0.12, r: sel ? 8 : 7 });
    }
    // HO dots: same position as step 1
    for (let i = 0; i < HO; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      states.push({ cx: 390 + col * 42, cy: 40 + row * 42, fill: '#af73c8', opacity: 1, r: 8 });
    }
    return states;
  }

  if (step === 3) {
    // VF selected dots: move into 4 distinct clusters
    // Only selected dots visible (non-selected stay faded in corner)
    const clusterOrigins = [
      { ox: 32,  oy: 36  },
      { ox: 178, oy: 36  },
      { ox: 32,  oy: 240 },
      { ox: 178, oy: 240 },
    ];
    const clusterCounts = [0, 0, 0, 0];
    for (let i = 0; i < VF; i++) {
      const cl = CLUSTER_ARR[i];
      const sel = SELECTED.has(i);
      if (sel) {
        const idx = clusterCounts[cl]++;
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const o = clusterOrigins[cl];
        states.push({
          cx: o.ox + col * 32,
          cy: o.oy + row * 32,
          fill: CLUSTER_COLORS[cl],
          opacity: 1,
          r: 9,
        });
      } else {
        // non-selected: collapse to bottom-left, invisible
        states.push({ cx: 16, cy: 450, fill: '#88c1fd', opacity: 0, r: 4 });
      }
    }
    // HO dots: same position
    for (let i = 0; i < HO; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      states.push({ cx: 390 + col * 42, cy: 40 + row * 42, fill: '#af73c8', opacity: 1, r: 8 });
    }
    return states;
  }

  // Step 4: clusters stack vertically ordered by vulnerability rank
  const rankColors = ['#c0392b','#e67e22','#27ae60','#2980b9'];
  const rowH = 96;
  const rowStartY = 56;
  const clusterCounts4 = [0, 0, 0, 0];

  for (let i = 0; i < VF; i++) {
    const cl = CLUSTER_ARR[i];
    const sel = SELECTED.has(i);
    if (sel) {
      const rankPos = VULN_ORDER.indexOf(cl);
      const idx = clusterCounts4[cl]++;
      const col = idx % 6;
      const row = Math.floor(idx / 6);
      states.push({
        cx: 32 + col * 32,
        cy: rowStartY + rankPos * rowH + row * 28,
        fill: rankColors[rankPos],
        opacity: 1,
        r: 9,
      });
    } else {
      states.push({ cx: 16, cy: 470, fill: '#88c1fd', opacity: 0, r: 4 });
    }
  }
  // HO dots: spread vertically alongside the 4 rank rows
  for (let i = 0; i < HO; i++) {
    const rankRow = Math.floor(i / 3); // 0–3 → one per rank
    const col = i % 3;
    states.push({
      cx: 390 + col * 38,
      cy: rowStartY + rankRow * rowH + 16,
      fill: '#af73c8',
      opacity: 1,
      r: 8,
    });
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

// Pre-compute HO dot positions (shared across steps)
function hoPos(i: number) {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return { cx: 390 + col * 42, cy: 56 + row * 42 };
}

// Pre-compute selected VF dot positions at step-2 layout
function selectedVfPos(i: number) {
  return scatter(i, 8, 6, 44, 52, 24, 40);
}

// Build connector lines: each selected VF → each HO dot
// Returns array of { x1,y1,x2,y2, delay } — a subset to avoid visual overload
function buildLines(): { x1: number; y1: number; x2: number; y2: number; delay: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
  const selectedArr = Array.from(SELECTED);
  // Use a subset: every other selected VF, all HO dots
  selectedArr.forEach((vfi, si) => {
    if (si % 2 !== 0) return; // skip alternates to reduce density
    const vfp = selectedVfPos(vfi);
    for (let h = 0; h < HO; h++) {
      const hp = hoPos(h);
      lines.push({
        x1: vfp.cx, y1: vfp.cy,
        x2: hp.cx,  y2: hp.cy,
        delay: (si * 3 + h) * 18, // stagger in ms
      });
    }
  });
  return lines;
}

const CONNECTOR_LINES = buildLines();

// Step labels config
const STEP_LABELS: Record<number, {
  vf: string; ho: string;
  extra?: { text: string; x: number; y: number; color: string }[]
}> = {
  1: { vf: 'Survey data points', ho: 'Health outcomes' },
  2: { vf: 'Predictive factors', ho: 'Health outcomes' },
  3: {
    vf: 'Segments emerge',
    ho: 'Health outcomes',
    extra: [
      { text: 'Segment A', x: 32,  y: 26,  color: CLUSTER_COLORS[0] },
      { text: 'Segment B', x: 178, y: 26,  color: CLUSTER_COLORS[1] },
      { text: 'Segment C', x: 32,  y: 230, color: CLUSTER_COLORS[2] },
      { text: 'Segment D', x: 178, y: 230, color: CLUSTER_COLORS[3] },
    ],
  },
  4: {
    vf: 'Ranked by vulnerability',
    ho: 'Health outcomes used to rank',
    extra: [
      { text: 'Most vulnerable',  x: 220, y: 52,  color: '#c0392b' },
      { text: 'More vulnerable',  x: 220, y: 148, color: '#e67e22' },
      { text: 'Less vulnerable',  x: 220, y: 244, color: '#27ae60' },
      { text: 'Least vulnerable', x: 220, y: 340, color: '#2980b9' },
    ],
  },
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

  return (
    <div className="mep-canvas-wrap">
      <svg
        className="mep-canvas"
        viewBox="0 0 540 490"
        width="540"
        height="490"
        aria-hidden="true"
      >
        {/* Divider between VF and HO areas */}
        <line x1="362" y1="0" x2="362" y2="490" className="mep-canvas__divider" />

        {/* Connector lines (step 2 only) — rendered below dots */}
        <ConnectorLines visible={showLines} />

        {/* Dots — stable keys so React transitions positions/colour */}
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={d.fill}
            opacity={d.opacity}
            className="mep-canvas__dot"
          />
        ))}

        {/* Column labels — on top */}
        <text x="24" y="18" className="mep-canvas__col-label">{labels.vf}</text>
        <text x="370" y="18" className="mep-canvas__col-label">{labels.ho}</text>

        {/* Step-specific sublabels */}
        {labels.extra?.map((l, i) => (
          <text key={i} x={l.x} y={l.y} className="mep-canvas__sub-label" fill={l.color}>{l.text}</text>
        ))}
      </svg>
    </div>
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

        {/* ── Section 3: Vulnerability Factor domains ───────────────────────── */}
        <section className="mep__section mep__section--alt" aria-labelledby="mep-s3-title">
          <div className="mep__section-inner">
            <Reveal>
              <div className="mep__section-label" aria-hidden="true">Section 3</div>
              <h2 id="mep-s3-title" className="mep__section-title">How Vulnerability Factors are organised</h2>
              <p className="mep__section-intro">
                Vulnerability Factors are grouped into six domains. Each domain covers a distinct area of a woman's life that research has shown to shape her health-seeking behaviour and outcomes.
              </p>
            </Reveal>

            <div className="mep__domains-grid" role="list">
              {DOMAINS.map((domain, i) => (
                <Reveal key={domain.id} delay={i * 55} className="mep__domain-card">
                  <div className="mep__domain-card-inner" role="listitem">
                    <div className="mep__domain-accent" style={{ backgroundColor: domain.color }} aria-hidden="true" />
                    <div className="mep__domain-body">
                      <h3 className="mep__domain-title" style={{ color: domain.color }}>{domain.label}</h3>
                      <p className="mep__domain-desc">{domain.description}</p>
                      <button
                        className="mep__domain-link"
                        onClick={() => onNavigate('domain-detail', undefined, undefined, domain.id as string)}
                        aria-label={`Explore ${domain.label} domain`}
                      >
                        Explore domain →
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <IllustrationPlaceholder label="Illustration: domain icons or diagram" height={200} />
            </Reveal>
          </div>
        </section>

        {/* ── Section 4: Health Outcome Indicators ─────────────────────────── */}
        <section className="mep__section" aria-labelledby="mep-s4-title">
          <div className="mep__section-inner">
            <Reveal>
              <div className="mep__section-label" aria-hidden="true">Section 4</div>
              <h2 id="mep-s4-title" className="mep__section-title">How Health Outcome Indicators are organised</h2>
              <p className="mep__section-intro">
                {/* TODO: confirm final copy with content team */}
                Health Outcome Indicators are grouped into health areas. Each health area covers a specific domain of care, making it easier to find data relevant to a programme's focus.
              </p>
            </Reveal>

            <div className="mep__health-areas" role="list">
              {[
                { id: 'rmnch',        label: 'RMNCH',                       desc: '// TODO: confirm definition — reproductive, maternal, newborn, and child health services and outcomes.' },
                { id: 'family-plan',  label: 'Family planning',             desc: '// TODO: confirm definition — contraceptive use, unmet need, and reproductive intentions.' },
                { id: 'antenatal',    label: 'Antenatal care',              desc: '// TODO: confirm definition — frequency and timing of ANC visits, content of care received.' },
                { id: 'delivery',     label: 'Delivery and postnatal care', desc: '// TODO: confirm definition — place of delivery, skilled birth attendance, postnatal contact.' },
                { id: 'immunisation', label: 'Immunisation',                desc: '// TODO: confirm definition — childhood vaccination coverage and timely completion.' },
                { id: 'nutrition',    label: 'Nutrition',                   desc: '// TODO: confirm definition — maternal and child nutrition practices and outcomes.' },
              ].map((area, i) => (
                <Reveal key={area.id} delay={i * 45} className="mep__health-area-row">
                  <div className="mep__health-area-inner" role="listitem">
                    <div className="mep__health-area-dot" aria-hidden="true" />
                    <div>
                      <h3 className="mep__health-area-title">{area.label}</h3>
                      <p className="mep__health-area-desc">{area.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <IllustrationPlaceholder label="Illustration: health areas" height={200} />
            </Reveal>
          </div>
        </section>

        {/* ── Section 5: Explore data relevant to you (stub) ───────────────── */}
        <section className="mep__section mep__section--alt" aria-labelledby="mep-s5-title">
          <div className="mep__section-inner">
            <Reveal>
              <div className="mep__section-label" aria-hidden="true">Section 5</div>
              <h2 id="mep-s5-title" className="mep__section-title">Explore data relevant to you</h2>
              <p className="mep__section-intro">
                {/* TODO: replace with interactive selector once built */}
                Choose a geography and a health area to see what Pathways data is available for your context.
              </p>
            </Reveal>

            {/*
              TODO: Interactive selector — future implementation.
              User chooses:
                1. A geography (Northern Nigeria, Kenya, Senegal, Ethiopia, Indonesia, Bihar, India)
                2. A health area (from Section 4 list above)
              On selection, surface the most relevant segments for that combination using the
              segment card pattern used elsewhere in the platform.
              Build in a follow-up prompt ("Would you like to explore the data browser for this context?").
              No logic should be built here yet — reserve layout space only.
            */}
            <Reveal>
              <div className="mep__explore-placeholder" role="region" aria-label="Interactive data selector — coming soon">
                <p className="mep__explore-placeholder-label">[ Interactive data selector — to be implemented ]</p>
                <p className="mep__explore-placeholder-hint">
                  Will allow users to choose a geography and health area and surface the most relevant segments.
                </p>
                <div className="mep__explore-placeholder-controls">
                  <div className="mep__explore-placeholder-select">Geography</div>
                  <div className="mep__explore-placeholder-select">Health area</div>
                  <div className="mep__explore-placeholder-btn">Show segments</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
