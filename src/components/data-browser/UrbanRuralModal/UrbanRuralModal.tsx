import { useEffect, useCallback } from 'react';
import './UrbanRuralModal.css';

interface UrbanRuralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UrbanRuralModal({ isOpen, onClose }: UrbanRuralModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
    <div className="urban-rural-modal__overlay" onClick={handleOverlayClick}>
      <div className="urban-rural-modal">
        <div className="urban-rural-modal__header">
          <h2 className="urban-rural-modal__title">Urban / Rural definitions</h2>
          <button className="urban-rural-modal__close" onClick={onClose} aria-label="Close modal">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M6 6L16 16M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="urban-rural-modal__content">
          <p className="urban-rural-modal__text">
            The urban/rural classification is based on the respondent's place of residence at the time of the survey. Respondents are classified as:
          </p>
          <ul className="urban-rural-modal__list">
            <li>
              <strong>Urban</strong> if they live in an officially designated urban centre, defined as a built-up settlement with at least 2,000 inhabitants where more than half the economically active population works in non-agricultural activities.
            </li>
            <li>
              <strong>Rural</strong> if they live in any area outside these designated urban centres.
            </li>
          </ul>
          <p className="urban-rural-modal__text">
            This definition comes from the 2019 Kenya Population and Housing Census enumeration areas, which were pre-classified as urban or rural before the DHS survey was conducted.
          </p>
        </div>

        <div className="urban-rural-modal__footer">
          <button className="urban-rural-modal__button" onClick={onClose}>
            Close this window
          </button>
        </div>
      </div>
    </div>
  );
}
