import { useEffect, useCallback, useState } from 'react';
import './TechnicalNotesModal.css';

interface TechnicalNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechnicalNotesModal({ isOpen, onClose }: TechnicalNotesModalProps) {
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
    <div
      className={`technical-notes-modal__overlay${closing ? ' technical-notes-modal__overlay--closing' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="technical-notes-modal">
        <div className="technical-notes-modal__header">
          <h2 className="technical-notes-modal__title">Technical notes</h2>
          <button className="technical-notes-modal__close" onClick={handleClose} aria-label="Close modal">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M6 6L16 16M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="technical-notes-modal__content">
          <ol className="technical-notes-modal__list">
            <li>One urban segment is not included here (1% of the population) due to uncertainty in estimates owing to its very small size.</li>
            <li>Another technical note can be written here. It can be a bit longer or shorter than the previous technical note if needs be. Technical notes should probably not be too long winded though.</li>
          </ol>
        </div>

        <div className="technical-notes-modal__footer">
          <button className="technical-notes-modal__button" onClick={handleClose}>
            Close this window
          </button>
        </div>
      </div>
    </div>
  );
}
