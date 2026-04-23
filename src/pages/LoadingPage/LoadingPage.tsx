import { useEffect, useRef, useState } from 'react';
import './LoadingPage.css';

const PATH_FORWARD = "M42.22,138.11V69.31C42.22,54.05,54.59,41.68,69.85,41.68C85.11,41.68,97.48,54.05,97.48,69.31C97.48,84.57,85.11,96.94,69.85,96.94H6.31V69.31C6.31,34.52,34.52,6.31,69.31,6.31C104.1,6.31,132.3,34.52,132.3,69.31C132.3,104.1,104.1,132.3,69.31,132.3";
const PATH_REVERSE = "M69.31,132.3c34.79,0,62.99-28.2,62.99-62.99S104.1,6.31,69.31,6.31,6.31,34.52,6.31,69.31v27.63h63.54c15.26,0,27.63-12.37,27.63-27.63s-12.37-27.63-27.63-27.63-27.63,12.37-27.63,27.63v68.8";

function useDashTrace(ref: React.RefObject<SVGPathElement | null>, totalMs: number, holdMs: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const len = Math.ceil(el.getTotalLength());
    const drawMs = totalMs - holdMs;

    const loop = (): (() => void) => {
      el.style.transition = 'none';
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;

      const t1 = setTimeout(() => {
        el.style.transition = `stroke-dashoffset ${drawMs}ms cubic-bezier(0.37, 0, 0.63, 1)`;
        el.style.strokeDashoffset = '0';
      }, 16);

      const t2 = setTimeout(() => {
        el.style.transition = 'none';
        loop();
      }, totalMs);

      return () => { clearTimeout(t1); clearTimeout(t2); };
    };

    return loop();
  }, [ref, totalMs, holdMs]);
}

export function PathwaysSpinner({ size = 64, color = 'currentColor', reversed = false }: { size?: number; color?: string; reversed?: boolean }) {
  const ref = useRef<SVGPathElement>(null);
  useDashTrace(ref, 1800, 400);

  return (
    <svg
      width={size}
      height={size}
      viewBox="-7 -7 153 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pathways-spinner"
    >
      <path
        ref={ref}
        d={reversed ? PATH_REVERSE : PATH_FORWARD}
        fill="none"
        stroke={color}
        strokeWidth="12.63"
        strokeMiterlimit="10"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoadingPage() {
  const [reversed, setReversed] = useState(false);

  useEffect(() => {
    document.title = 'Pathways | Loading spinner';
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-page__header">
        <h1 className="loading-page__title">Loading spinner</h1>
        <div className="loading-page__direction-toggle">
          <span className="loading-page__toggle-label">Direction</span>
          <div className="loading-page__toggle-group">
            <button
              className={`loading-page__toggle-btn${!reversed ? ' loading-page__toggle-btn--active' : ''}`}
              onClick={() => setReversed(false)}
            >
              Tail → Circle
            </button>
            <button
              className={`loading-page__toggle-btn${reversed ? ' loading-page__toggle-btn--active' : ''}`}
              onClick={() => setReversed(true)}
            >
              Circle → Tail
            </button>
          </div>
        </div>
      </div>

      <div className="loading-page__stage">
        <PathwaysSpinner size={64} reversed={reversed} />
      </div>

      <div className="loading-page__variants">
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--light">
            <PathwaysSpinner size={64} reversed={reversed} />
          </div>
          <span className="loading-page__variant-label">On light</span>
        </div>
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--dark">
            <PathwaysSpinner size={64} color="white" reversed={reversed} />
          </div>
          <span className="loading-page__variant-label">On dark</span>
        </div>
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--light">
            <PathwaysSpinner size={32} reversed={reversed} />
          </div>
          <span className="loading-page__variant-label">Small (32px)</span>
        </div>
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--light">
            <PathwaysSpinner size={96} reversed={reversed} />
          </div>
          <span className="loading-page__variant-label">Large (96px)</span>
        </div>
      </div>
    </div>
  );
}
