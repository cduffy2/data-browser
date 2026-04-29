import { useEffect, useCallback, useState } from 'react';
import type { ExportFormat } from '../../../utils/exportCards';
import './ExportModal.css';

const FORMATS: { id: ExportFormat; label: string; description: string }[] = [
  { id: 'png', label: 'PNG', description: '· best for high-quality images in presentations' },
  { id: 'svg', label: 'SVG', description: '· infinitely scalable and editable graphic' },
  { id: 'pdf', label: 'PDF', description: '· optimised for print' },
  { id: 'xlsx', label: 'XLSX', description: '· raw data for further data analysis' },
];

interface ExportModalProps {
  isOpen: boolean;
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onClose: () => void;
  onApply: () => void;
  isExporting: boolean;
}

export function ExportModal({
  isOpen,
  selectedFormat,
  onFormatChange,
  onClose,
  onApply,
  isExporting,
}: ExportModalProps) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 180);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    },
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
    <div className={`export-modal__overlay${closing ? ' export-modal__overlay--closing' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="export-modal" role="dialog" aria-modal="true" aria-labelledby="export-modal-title">
        {/* Header */}
        <div className="export-modal__header">
          <h2 className="export-modal__title" id="export-modal-title">Export data</h2>
          <button className="export-modal__close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Format options */}
        <div className="export-modal__options">
          {FORMATS.map((fmt) => (
            <label key={fmt.id} className="export-modal__option">
              <div className="export-modal__option-left">
                <span className={`export-modal__radio${selectedFormat === fmt.id ? ' export-modal__radio--selected' : ''}`}>
                  {selectedFormat === fmt.id && <span className="export-modal__radio-dot" />}
                </span>
                <span className="export-modal__option-label">{fmt.label}</span>
              </div>
              <span className="export-modal__option-desc">{fmt.description}</span>
              <input
                type="radio"
                name="export-format"
                value={fmt.id}
                checked={selectedFormat === fmt.id}
                onChange={() => onFormatChange(fmt.id)}
                className="export-modal__radio-input"
              />
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="export-modal__actions">
          <button className="export-modal__cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="export-modal__apply"
            onClick={onApply}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}
