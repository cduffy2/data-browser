import { useEffect, useRef } from 'react';
import './LoadingPage.css';

// High-resolution path from the 130×130 logo SVG, rendered as stroke
const STROKE_PATH = "M65 130V118.159C94.3078 118.159 118.159 94.3173 118.159 65C118.159 35.6827 94.3078 11.8406 65 11.8406C35.6922 11.8406 11.8406 35.6922 11.8406 65V84.9869H33.6841V65C33.6841 47.4475 47.9685 33.1631 65.521 33.1631C83.0734 33.1631 97.3579 47.4475 97.3579 65C97.3579 82.5525 83.0734 96.8369 65.521 96.8369H45.5341V129.526H33.6935V96.8369H0V65C0 29.1562 29.1562 0 65 0C100.844 0 130 29.1562 130 65C130 100.844 100.844 130 65 130ZM45.5246 84.9869H65.5115C76.5375 84.9869 85.4984 76.0165 85.4984 65C85.4984 53.9835 76.528 45.0131 65.5115 45.0131C54.495 45.0131 45.5246 53.9835 45.5246 65V84.9869Z";

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

let _uid = 0;
function uid() { return `pws-${++_uid}`; }

export function PathwaysSpinner({ size = 64, color = 'currentColor' }: { size?: number; color?: string }) {
  const ref = useRef<SVGPathElement>(null);
  // Unique id per instance so multiple spinners on the page don't clash
  const _id = useRef(uid()).current; void _id;

  useDashTrace(ref, 2800, 600);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pathways-spinner"
    >
      <path
        ref={ref}
        d={STROKE_PATH}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LoadingPageProps {}

export function LoadingPage(_props: LoadingPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Loading spinner';
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-page__header">
        <h1 className="loading-page__title">Loading spinner</h1>
      </div>

      <div className="loading-page__stage">
        <PathwaysSpinner size={64} />
      </div>

      <div className="loading-page__variants">
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--light">
            <PathwaysSpinner size={64} />
          </div>
          <span className="loading-page__variant-label">On light</span>
        </div>
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--dark">
            <PathwaysSpinner size={64} color="white" />
          </div>
          <span className="loading-page__variant-label">On dark</span>
        </div>
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--light">
            <PathwaysSpinner size={32} />
          </div>
          <span className="loading-page__variant-label">Small (32px)</span>
        </div>
        <div className="loading-page__variant">
          <div className="loading-page__swatch loading-page__swatch--light">
            <PathwaysSpinner size={96} />
          </div>
          <span className="loading-page__variant-label">Large (96px)</span>
        </div>
      </div>
    </div>
  );
}
