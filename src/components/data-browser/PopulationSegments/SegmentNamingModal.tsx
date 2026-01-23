import { useEffect, useCallback } from 'react';
import './SegmentNamingModal.css';

// Badge images
import Badge1 from '../../../assets/icons/1-small.png';
import Badge2 from '../../../assets/icons/2-small.png';
import Badge3 from '../../../assets/icons/3-small.png';
import Badge4 from '../../../assets/icons/4-small.png';
import Badge3a from '../../../assets/icons/3a-small.png';

interface SegmentNamingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SegmentNamingModal({ isOpen, onClose }: SegmentNamingModalProps) {
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
    <div className="segment-naming-modal__overlay" onClick={handleOverlayClick}>
      <div className="segment-naming-modal">
        <div className="segment-naming-modal__header">
          <h2 className="segment-naming-modal__title">Understand segment naming</h2>
          <button className="segment-naming-modal__close" onClick={onClose} aria-label="Close modal">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M6 6L16 16M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="segment-naming-modal__content">
          <div className="segment-naming-modal__intro">
            <p>Each segment name has two parts: Location → Vulnerability level</p>
          </div>

          <div className="segment-naming-modal__section">
            <h3 className="segment-naming-modal__section-title">Location</h3>
            <p className="segment-naming-modal__text">
              Segments are identified as either <strong>Urban</strong> or <strong>Rural</strong>.
            </p>
          </div>

          <div className="segment-naming-modal__section">
            <h3 className="segment-naming-modal__section-title">Vulnerability levels</h3>
            <p className="segment-naming-modal__text">
              Numbers indicate vulnerability from least (1) to most (4):
            </p>
            <ul className="segment-naming-modal__badge-list">
              <li className="segment-naming-modal__badge-item">
                <img src={Badge1} alt="1" className="segment-naming-modal__badge segment-naming-modal__badge--least" />
                <span><strong>least vulnerable</strong></span>
              </li>
              <li className="segment-naming-modal__badge-item">
                <img src={Badge2} alt="2" className="segment-naming-modal__badge segment-naming-modal__badge--less" />
                <span><strong>less vulnerable</strong></span>
              </li>
              <li className="segment-naming-modal__badge-item">
                <img src={Badge3} alt="3" className="segment-naming-modal__badge segment-naming-modal__badge--more" />
                <span><strong>more vulnerable</strong></span>
              </li>
              <li className="segment-naming-modal__badge-item">
                <img src={Badge4} alt="4" className="segment-naming-modal__badge segment-naming-modal__badge--most" />
                <span><strong>most vulnerable</strong></span>
              </li>
            </ul>
          </div>

          <div className="segment-naming-modal__section">
            <h3 className="segment-naming-modal__section-title">Letter suffixes (a, b, c...)</h3>
            <p className="segment-naming-modal__text">
              When multiple segments share the same vulnerability level but have different characteristics, letters distinguish them. For example, <strong>Rural 3a</strong> and <strong>Rural 3b</strong> are both more vulnerable rural segments, but with distinct profiles.
            </p>
          </div>

          <div className="segment-naming-modal__section">
            <h3 className="segment-naming-modal__section-title">Putting it all together</h3>
            <p className="segment-naming-modal__text">
              Segment names can be written in full or as shorthand:
            </p>
            <ul className="segment-naming-modal__example-list">
              <li className="segment-naming-modal__example-item">
                <strong>Rural</strong>
                <img src={Badge4} alt="4" className="segment-naming-modal__badge segment-naming-modal__badge--most" />
                <strong>most vulnerable</strong>
                <span className="segment-naming-modal__example-or">or simply <strong>R4</strong> for short</span>
              </li>
              <li className="segment-naming-modal__example-item">
                <strong>Urban</strong>
                <img src={Badge3a} alt="3a" className="segment-naming-modal__badge segment-naming-modal__badge--more segment-naming-modal__badge--wide" />
                <strong>more vulnerable</strong>
                <span className="segment-naming-modal__example-or">or simply <strong>U3a</strong> for short</span>
              </li>
            </ul>
            <p className="segment-naming-modal__text segment-naming-modal__text--note">
              Note how the shorthand version uses the first letter of the location (R = Rural, U = Urban) followed by the vulnerability level and any letter suffix.
            </p>
          </div>
        </div>

        <div className="segment-naming-modal__footer">
          <button className="segment-naming-modal__button" onClick={onClose}>
            Close this window
          </button>
        </div>
      </div>
    </div>
  );
}
