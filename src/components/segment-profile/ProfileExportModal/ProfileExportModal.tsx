import { useEffect, useCallback, useState } from 'react';
import previewImage from '../../../assets/Profile-Export-Preview-Image.png';
import './ProfileExportModal.css';

interface ProfileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDataPoints: () => void;
}

export function ProfileExportModal({ isOpen, onClose, onSelectDataPoints }: ProfileExportModalProps) {
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
    <div
      className={`profile-export-modal__overlay${closing ? ' profile-export-modal__overlay--closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="profile-export-modal__container">
        <button className="profile-export-modal__close" onClick={handleClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="profile-export-modal" role="dialog" aria-modal="true" aria-labelledby="profile-export-modal-title">
        <div className="profile-export-modal__body">
          {/* Left column */}
          <div className="profile-export-modal__left">
            <div className="profile-export-modal__title-row">
              <h2 className="profile-export-modal__title" id="profile-export-modal-title">Download segment profile</h2>
              <span className="profile-export-modal__step">· Step 1 of 3</span>
            </div>

            <div className="profile-export-modal__description">
              <p>Build a shareable document from this segment's data to download and share with your team or partners</p>
              <ul>
                <li>Downloads as a <strong>PDF</strong>, ready to print or share with stakeholders</li>
                <li>Best printed and viewed at A4 size</li>
                <li>The more data points you select, the more pages your document will have</li>
              </ul>
            </div>

            <div className="profile-export-modal__actions">
              <button className="profile-export-modal__cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="profile-export-modal__next" onClick={onSelectDataPoints}>
                Select data points
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right column — preview */}
          <div className="profile-export-modal__right">
            <div className="profile-export-modal__preview-frame">
              <img
                src={previewImage}
                alt="Preview of exported segment profile PDF"
                className="profile-export-modal__preview-image"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
