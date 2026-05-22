import { useEffect, useRef } from 'react';
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

// ── Step visualisation panels (first pass) ───────────────────────────────────

// Seeded dot opacity pattern for step 2 (identify factors)
const STEP2_VF_OPAQUE = new Set([2, 4, 5, 9, 13, 15, 17, 21, 25, 26, 28, 29, 33, 35, 37, 43, 46, 48, 51, 54, 56, 59, 62, 64, 66, 68, 70, 72, 75, 77, 79, 82, 85, 87, 89, 91]);

function DotGrid({ color, count, fadedIndices }: { color: string; count: number; fadedIndices?: Set<number> }) {
  return (
    <div className="mep-step__dot-grid">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="mep-step__dot"
          style={{ background: color, opacity: fadedIndices && !fadedIndices.has(i) ? 0.2 : 1 }}
        />
      ))}
    </div>
  );
}

function StepVisual({ step }: { step: number }) {
  if (step === 1) {
    return (
      <div className="mep-step__visual-inner">
        <div className="mep-step__dot-col">
          <span className="mep-step__dot-label">Vulnerability factors</span>
          <DotGrid color="#88c1fd" count={96} />
        </div>
        <div className="mep-step__dot-col">
          <span className="mep-step__dot-label">Health outcomes and behaviours</span>
          <DotGrid color="#af73c8" count={24} />
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="mep-step__visual-inner">
        <div className="mep-step__dot-col">
          <span className="mep-step__dot-label">Vulnerability factors</span>
          <DotGrid color="#88c1fd" count={96} fadedIndices={STEP2_VF_OPAQUE} />
        </div>
        <div className="mep-step__dot-col">
          <span className="mep-step__dot-label">Health outcomes and behaviours</span>
          <DotGrid color="#af73c8" count={24} />
        </div>
      </div>
    );
  }
  if (step === 3) {
    const clusters = [
      { dots: 8, label: 'Segment A' },
      { dots: 6, label: 'Segment B' },
      { dots: 9, label: 'Segment C' },
      { dots: 8, label: 'Segment D' },
    ];
    return (
      <div className="mep-step__visual-inner">
        <div className="mep-step__dot-col">
          <span className="mep-step__dot-label">Segments</span>
          <div className="mep-step__clusters">
            {clusters.map((c, i) => (
              <div key={i} className="mep-step__cluster">
                <DotGrid color="#88c1fd" count={c.dots} />
              </div>
            ))}
          </div>
        </div>
        <div className="mep-step__dot-col">
          <span className="mep-step__dot-label">Health outcomes and behaviours</span>
          <DotGrid color="#af73c8" count={24} />
        </div>
      </div>
    );
  }
  // Step 4
  const vulnLevels = [
    { label: 'most vulnerable', color: '#c41c1c', vfCount: 8, hoCount: 6 },
    { label: 'more vulnerable', color: '#b45309', vfCount: 6, hoCount: 6 },
    { label: 'less vulnerable', color: '#15803d', vfCount: 8, hoCount: 6 },
    { label: 'least vulnerable', color: '#1d4ed8', vfCount: 8, hoCount: 6 },
  ];
  return (
    <div className="mep-step__visual-inner mep-step__visual-inner--step4">
      <div className="mep-step__dot-col mep-step__dot-col--wide">
        <span className="mep-step__dot-label">Segments</span>
        <div className="mep-step__ranked">
          {vulnLevels.map((v, i) => (
            <div key={i} className="mep-step__rank-row">
              <span className="mep-step__rank-label" style={{ color: v.color }}>{v.label}</span>
              <DotGrid color="#88c1fd" count={v.vfCount} />
            </div>
          ))}
        </div>
      </div>
      <div className="mep-step__dot-col">
        <span className="mep-step__dot-label">Health outcomes</span>
        <DotGrid color="#af73c8" count={24} />
      </div>
    </div>
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
        <section className="mep__section mep__section--steps" aria-labelledby="mep-s2-title">

          <div className="mep__s2-header">
            <Reveal className="mep__s1-header">
              <h2 id="mep-s2-title" className="mep__s1-title">How segments are created</h2>
              <p className="mep__s1-intro">
                Segments emerge from the data using a two-stage statistical process
              </p>
            </Reveal>
          </div>

          {[
              {
                step: 1,
                label: 'Step #1',
                title: 'Select data set',
                body: 'Pathways segmentations are built on survey data. You can bring an existing dataset, such as the Demographic Health Survey (DHS), or work with us to run a dedicated Pathways survey. Either way, we\'ll help you get to a segmentation that fits your context.',
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
          ].map(({ step, label, title, body }) => (
            <div key={step} className="mep__step-row">
              <Reveal className="mep__step-text">
                <div className="mep__step-text-inner">
                  <span className="mep__step-label">{label}</span>
                  <h3 className="mep__step-title">{title}</h3>
                  <p className="mep__step-body">{body}</p>
                </div>
              </Reveal>
              <div className="mep__step-visual">
                <StepVisual step={step} />
              </div>
            </div>
          ))}

        </section>

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
