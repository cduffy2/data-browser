import { useEffect, useCallback, useState, lazy, Suspense } from 'react';
import previewImage from '../../../assets/Profile-Export-Preview-Image.png';
import './ExportFlowModal.css';

// ── Lazy-load @react-pdf/renderer to prevent it crashing the app on import ──
// It uses browser APIs that break if evaluated at module load time in Vite.
const PdfPreview = lazy(() =>
  import('./PdfPreview')
);

// ── Icons ──

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


// ── Step 1: Intro ──

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="export-flow-modal" role="dialog" aria-modal="true" aria-labelledby="export-flow-title">
      <div className="export-flow-modal__body">
        {/* Left column */}
        <div className="export-flow-modal__left">
          <div className="export-flow-modal__title-row">
            <h2 className="export-flow-modal__title" id="export-flow-title">Export segment profile</h2>
            <span className="export-flow-modal__step">· Step 1 of 3</span>
          </div>

          <div className="export-flow-modal__description">
            <p>Build a shareable document from this segment's data to download and share with your team or partners</p>
            <ul>
              <li>Downloads as a <strong>PDF</strong>, ready to print or share with stakeholders</li>
              <li>Best printed and viewed at A4 size</li>
              <li>The more data points you select, the more pages your document will have</li>
            </ul>
          </div>

          <div className="export-flow-modal__actions">
            <button className="export-flow-modal__next export-flow-modal__next--full" onClick={onNext}>
              Select data points
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="export-flow-modal__right">
          <div className="export-flow-modal__preview-frame">
            <img src={previewImage} alt="Preview of exported segment profile PDF" className="export-flow-modal__preview-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Preview ──

function Step3({ onClose, onBack, selectedIds, segmentLabel }: { onClose: () => void; onBack: () => void; selectedIds: string[]; segmentLabel: string }) {
  return (
    <div className="export-flow-modal export-flow-modal--wide" role="dialog" aria-modal="true" aria-labelledby="export-flow-title-3">
      <div className="export-flow-modal__body export-flow-modal__body--step3">
        {/* Left + actions come from inside PdfPreview so it can control exporting state */}
        <Suspense fallback={<div className="export-flow-modal__preview-loading">Loading…</div>}>
          <PdfPreview
            selectedIds={selectedIds}
            segmentLabel={segmentLabel}
            onBack={onBack}
            onClose={onClose}
          />
        </Suspense>
      </div>
    </div>
  );
}

// ── Main ──

export type ExportStep = 1 | 2 | 3;

interface ExportFlowModalProps {
  isOpen: boolean;
  step: ExportStep;
  onClose: () => void;
  onStepChange: (step: ExportStep) => void;
  /** IDs of data points selected in Step 2 */
  selectedIds: string[];
  /** Label for the current segment, e.g. "R4" */
  segmentLabel: string;
  /** Slot for Step 2 content (AddDataModal-like UI) */
  step2Content?: React.ReactNode;
}

export function ExportFlowModal({ isOpen, step, onClose, onStepChange, selectedIds, segmentLabel, step2Content }: ExportFlowModalProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 180);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className={`export-flow-modal__overlay${closing ? ' export-flow-modal__overlay--closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="export-flow-modal__container" key={step}>
        {/* Floating close button */}
        <button className="export-flow-modal__close" onClick={handleClose} aria-label="Close">
          <CloseIcon />
        </button>

        {step === 1 && (
          <Step1
            onNext={() => onStepChange(2)}
          />
        )}

        {step === 2 && step2Content}

        {step === 3 && (
          <Step3
            onClose={onClose}
            onBack={() => onStepChange(2)}
            selectedIds={selectedIds}
            segmentLabel={segmentLabel}
          />
        )}
      </div>
    </div>
  );
}
