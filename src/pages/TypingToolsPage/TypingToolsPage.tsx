import { useEffect, useRef, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import ArrowBackFilledIcon from '../../assets/icons/ArrowBackFilled.svg?react';
import ChevronDownIcon from '../../assets/icons/ChevronDown.svg?react';
import heroImg from '../../assets/typing-tools/typing-tools.png';
import questionsImg from '../../assets/typing-tools/typing-tools-questions.png';
import recruitImg from '../../assets/typing-tools/recruit-participants.png';
import collectImg from '../../assets/typing-tools/collect-survey-data.png';
import analyseImg from '../../assets/typing-tools/analyse-existing-data.png';
import compareImg from '../../assets/typing-tools/compare-segments.png';
import deliverImg from '../../assets/typing-tools/deliver-services.png';
import trackImg from '../../assets/typing-tools/track-reach.png';
import decisionTreeImg from '../../assets/typing-tools/format-decision-tree-pdf.png';
import xlsFormImg from '../../assets/typing-tools/format-xls-form.jpg';
import bespokeImg from '../../assets/typing-tools/format-bespoke-tool.jpg';
import biharIndiaFlag from '../../assets/icons/Bihar-India.png';
import ethiopiaFlag from '../../assets/icons/ethiopia.png';
import indonesiaFlag from '../../assets/icons/indonesia.png';
import kenyaFlag from '../../assets/icons/kenya.png';
import nigeriaFlag from '../../assets/icons/nigeria.png';
import senegalFlag from '../../assets/icons/Senegal.png';
import '../MethodologyExplainerPage/MethodologyExplainerPage.css';
import './TypingToolsPage.css';

interface TypingToolsPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

// Every geography routes to the Kenya demo segmentation
const GEOGRAPHIES: { id: string; name: string; flag: string }[] = [
  { id: 'bihar-india',      name: 'Bihar, India',     flag: biharIndiaFlag },
  { id: 'ethiopia',         name: 'Ethiopia',         flag: ethiopiaFlag },
  { id: 'indonesia',        name: 'Indonesia',        flag: indonesiaFlag },
  { id: 'kenya',            name: 'Kenya',            flag: kenyaFlag },
  { id: 'northern-nigeria', name: 'Northern Nigeria', flag: nigeriaFlag },
  { id: 'senegal',          name: 'Senegal',          flag: senegalFlag },
];

const USE_CASES = [
  { id: 'recruit',  image: recruitImg,  title: 'Recruit participants from specific segments', body: 'Determine which segments you would like to target and use typing tool questions to screen participants.' },
  { id: 'collect',  image: collectImg,  title: 'Collect segmented survey data',               body: 'Embed typing tool questions in your survey to enable segment-level analysis.' },
  { id: 'analyse',  image: analyseImg,  title: 'Analyse existing data by segment',            body: 'Retroactively type existing datasets to enable segment-level analysis.' },
  { id: 'compare',  image: compareImg,  title: 'Compare segments across datasets',            body: 'Type multiple datasets to compare segment data across studies.' },
  { id: 'deliver',  image: deliverImg,  title: 'Deliver different services by segment',       body: 'Type clients at the point of service to deliver tailored interventions and messaging.' },
  { id: 'track',    image: trackImg,    title: 'Track service reach and impact by segment',   body: 'Embed typing tool questions in your M&E to track reach, uptake, and outcomes by segment.' },
];

const FORMATS = [
  { id: 'pdf',      image: decisionTreeImg, bordered: true,  title: 'Decision tree PDF',          body: 'The PDF shows the full set of typing tool questions in a decision tree format. Available for every Pathways geography.' },
  { id: 'xls',      image: xlsFormImg,      bordered: false, title: 'ODK-compatible Excel form',  body: 'Incorporate typing tool logic into most data collection software using the XLS file. Available in select geographies.' },
  { id: 'bespoke',  image: bespokeImg,      bordered: false, title: 'Bespoke tool',               body: 'The typing tool’s format can be customised to optimise it for specific use cases and contexts. Examples include paper booklets used by providers and self-administered SMS forms.' },
];

function GeographyControls({ onAccess, size = 'md' }: { onAccess: () => void; size?: 'md' | 'lg' }) {
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = GEOGRAPHIES.find(g => g.id === value);

  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const choose = (id: string) => {
    setValue(id);
    setError(false);
    setOpen(false);
  };

  const handleListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('.tt-geo__option'));
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div className={`tt-geo tt-geo--${size}`}>
      <div className="tt-geo__field" ref={rootRef}>
        <button
          type="button"
          className={`tt-geo__select ${error ? 'tt-geo__select--error' : ''} ${open ? 'tt-geo__select--open' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {selected ? (
            <span className="tt-geo__value">
              <img src={selected.flag} alt="" className="tt-geo__flag" />
              {selected.name}
            </span>
          ) : (
            <span className="tt-geo__placeholder">Select a geography</span>
          )}
          <ChevronDownIcon className="tt-geo__chevron" aria-hidden="true" />
        </button>
        {open && (
          <ul className="tt-geo__menu" role="listbox" onKeyDown={handleListKey}>
            {GEOGRAPHIES.map(geo => (
              <li key={geo.id} role="option" aria-selected={geo.id === value}>
                <button
                  type="button"
                  className={`tt-geo__option ${geo.id === value ? 'tt-geo__option--selected' : ''}`}
                  onClick={() => choose(geo.id)}
                >
                  <img src={geo.flag} alt="" className="tt-geo__flag" />
                  {geo.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="tt-geo__error">Please select a geography first</p>}
      </div>
      <button
        type="button"
        className="tt-geo__action"
        onClick={() => (value ? onAccess() : setError(true))}
      >
        Access typing tools
      </button>
    </div>
  );
}

export function TypingToolsPage({ currentPage, onNavigate }: TypingToolsPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Pathways typing tools';
  }, []);

  const access = () => onNavigate('kenya-overview');

  return (
    <div className="mep tt">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <main id="main-content">

        {/* Hero */}
        <div className="mep__hero-wrap">
          <header className="mep__hero tt__hero" aria-labelledby="tt-hero-title">
            <div className="tt__hero-content">
              <div className="tt__hero-text">
                <button className="mep__back-btn" onClick={() => onNavigate('resources')}>
                  <ArrowBackFilledIcon width={16} height={16} />
                  Resources
                </button>
                <h1 id="tt-hero-title" className="mep__hero-title">Pathways typing tools</h1>
                <p className="mep__hero-subtitle">
                  Explore how Pathways typing tools ‘type’, or place an individual into a Pathways segment, using a statistical model.
                </p>
              </div>
              <div className="tt__access-card">
                <h2 className="tt__access-card-title">Access typing tools</h2>
                <p className="tt__access-card-body">Go straight to decision tree PDFs and ODK-compatible XLS forms for your geography.</p>
                <GeographyControls onAccess={access} />
              </div>
            </div>
            <div className="tt__hero-visual">
              <img src={heroImg} alt="" className="tt__hero-image" />
            </div>
          </header>
          <div className="mep__hero-wave">
            <svg viewBox="0 0 1440 53" fill="none" preserveAspectRatio="none" className="mep__hero-wave-svg">
              <path d="M716.977 35.0943C417.999 -17.9828 90.7479 21.5358 1.76793e-05 34.4708V53H1440V0.413139C1350.72 18.1406 988.882 83.364 716.977 35.0943Z" fill="var(--background-page, #fcfcf6)" />
            </svg>
          </div>
        </div>

        {/* Structured questions */}
        <section className="tt__section" aria-labelledby="tt-questions-title">
          <div className="tt__inner tt__questions">
            <div className="tt__questions-text">
              <h2 id="tt-questions-title" className="tt__heading">Typing tools ask a structured set of questions to identify a person’s segment</h2>
              <p className="tt__lead">The Pathways typing tool provides a set of questions that, when asked in a specific order, help place a person into their appropriate Pathways segment.</p>
              <p className="tt__lead">Provided the questions are asked in the specified order, Pathways typing tools have an accuracy rate of 80% or higher.</p>
            </div>
            <div className="tt__questions-visual">
              <img src={questionsImg} alt="" />
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="tt__section" aria-labelledby="tt-use-cases-title">
          <div className="tt__inner">
            <h2 id="tt-use-cases-title" className="tt__heading tt__heading--narrow">Typing tools can be used to embed Pathways across the programme life cycle</h2>
            <div className="tt__use-cases">
              {USE_CASES.map(item => (
                <div key={item.id} className="tt__use-case">
                  <img src={item.image} alt="" className="tt__use-case-image" />
                  <div className="tt__card-text">
                    <h3 className="tt__card-title">{item.title}</h3>
                    <p className="tt__card-body">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="tt__section" aria-labelledby="tt-formats-title">
          <div className="tt__inner">
            <h2 id="tt-formats-title" className="tt__heading tt__heading--narrow">Typing tools are available in multiple formats to fit different project needs</h2>
            <div className="tt__formats">
              {FORMATS.map(item => (
                <div key={item.id} className="tt__format">
                  <div className={`tt__format-image ${item.bordered ? 'tt__format-image--bordered' : ''}`}>
                    <img src={item.image} alt="" />
                  </div>
                  <div className="tt__card-text">
                    <h3 className="tt__card-title">{item.title}</h3>
                    <p className="tt__card-body">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Access CTA */}
        <section className="tt__cta" aria-labelledby="tt-cta-title">
          <div className="tt__cta-inner">
            <h2 id="tt-cta-title" className="tt__heading">Access typing tools for your geography</h2>
            <p className="tt__cta-body">Select your geography to access decision tree PDFs and ODK-compatible XLS files.</p>
            <GeographyControls onAccess={access} size="lg" />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
