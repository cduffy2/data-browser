import { useEffect, useCallback, useState } from 'react';
import './SourceDataModal.css';

interface SourceDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROWS = [
  { label: 'Data source', value: 'DHS 2022' },
  { label: 'Created in', value: 'September 2022' },
  { label: 'Sample population', value: 'Women aged 18-49 with U5 child(ren)' },
  { label: 'Sample size', value: '7,245' },
  { label: 'Geographic coverage', value: '43 counties (excludes Garissa, Mandera, Marsabit, Wajir)' },
  { label: 'Representativeness', value: 'Rural/urban level only (not sub-nationally representative)' },
];

export function SourceDataModal({ isOpen, onClose }: SourceDataModalProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 180);
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
  }, [handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

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
    <div className={`source-data-modal__overlay${closing ? ' source-data-modal__overlay--closing' : ''}`} onClick={handleOverlayClick}>
      <div className="source-data-modal">
        <div className="source-data-modal__header">
          <h2 className="source-data-modal__title">Source data details</h2>
          <button className="source-data-modal__close" onClick={handleClose} aria-label="Close modal">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M6 6L16 16M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="source-data-modal__rows">
          {ROWS.map(row => (
            <div key={row.label} className="source-data-modal__row">
              <span className="source-data-modal__row-label">{row.label}</span>
              <span className="source-data-modal__row-value">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="source-data-modal__footer">
          <button className="source-data-modal__btn-plain" onClick={handleClose}>
            Change segmentation version
          </button>
          <button className="source-data-modal__btn-solid" onClick={handleClose}>
            Close this window
          </button>
        </div>
      </div>
    </div>
  );
}
