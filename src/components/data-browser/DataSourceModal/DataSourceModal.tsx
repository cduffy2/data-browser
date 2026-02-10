import { useEffect, useCallback, useState } from 'react';
import ArrowRightIcon from '../../../assets/icons/Arrow-Right.svg?react';
import ChevronUpIcon from '../../../assets/icons/Chevron-Up.svg?react';
import kenyaFlag from '../../../assets/icons/senegal.svg';
import './DataSourceModal.css';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DATA_SOURCES = [
  { id: 'dhs-2024-2025', label: 'DHS survey 2024 & 2025', recommended: true },
  { id: 'pathways-2024', label: 'Pathways survey 2024', recommended: false },
  { id: 'dhs-2023', label: 'DHS survey 2023', recommended: false },
];

export function DataSourceModal({ isOpen, onClose }: DataSourceModalProps) {
  const [selectedSource, setSelectedSource] = useState('dhs-2024-2025');
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
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

  const selected = DATA_SOURCES.find(s => s.id === selectedSource);

  return (
    <div
      className={`data-source-modal__overlay ${closing ? 'data-source-modal__overlay--closing' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="data-source-modal">
        <button className="data-source-modal__close" onClick={handleClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 7L17 17M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="data-source-modal__header">
          <div className="data-source-modal__header-left">
            <button className="data-source-modal__back-btn">
              <ArrowRightIcon className="data-source-modal__back-arrow" />
              Select sample population
            </button>
          </div>

          <div className="data-source-modal__header-center">
            <span className="data-source-modal__country">
              <img src={kenyaFlag} alt="" className="data-source-modal__country-flag" />
              Kenya
            </span>
            <h2 className="data-source-modal__heading">Select a version to continue</h2>
          </div>

          <div className="data-source-modal__header-right">
            <button className="data-source-modal__continue-btn" onClick={handleClose}>
              Continue
              <ArrowRightIcon className="data-source-modal__continue-arrow" />
            </button>
          </div>
        </div>

        <div className="data-source-modal__body">
          <div className="data-source-modal__sources">
            <span className="data-source-modal__sources-label">Data source</span>
            {DATA_SOURCES.map(source => (
              <button
                key={source.id}
                className={`data-source-modal__source-item ${selectedSource === source.id ? 'data-source-modal__source-item--selected' : ''}`}
                onClick={() => setSelectedSource(source.id)}
              >
                <span>
                  {source.label}
                  {source.recommended && (
                    <span className="data-source-modal__source-badge">Recommended</span>
                  )}
                </span>
                <span className="data-source-modal__source-radio">
                  <span className="data-source-modal__source-radio-dot" />
                </span>
              </button>
            ))}
          </div>

          <div className="data-source-modal__detail">
            <h3 className="data-source-modal__detail-title">{selected?.label}</h3>
            <p className="data-source-modal__detail-text">
              This solution has 8 segments. Rural-3b most vulnerable is a distinct segment of women with a partner overseas while Rural-3a represents women in the more vulnerable segment with a partner living at home.
            </p>
            <button className="data-source-modal__detail-link">
              More details
              <ChevronUpIcon className="data-source-modal__detail-link-chevron" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
