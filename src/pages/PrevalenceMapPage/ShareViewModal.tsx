import { useCallback, useEffect, useState } from 'react';
import CancelIcon from '../../assets/icons/CancelFilled.svg?react';
import './ShareViewModal.css';

interface ShareViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareViewModal({ isOpen, onClose }: ShareViewModalProps) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="share-view-modal__overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="share-view-modal" role="dialog" aria-modal="true" aria-label="Share this view">
        <div className="share-view-modal__header">
          <span className="share-view-modal__title">Share this view</span>
          <button className="share-view-modal__close" onClick={handleClose} aria-label="Close">
            <CancelIcon width={20} height={20} />
          </button>
        </div>
        <p className="share-view-modal__subtitle">Copy this link to share the current view with others.</p>
        <div className="share-view-modal__url-row">
          <div className="share-view-modal__url-field">
            <span className="share-view-modal__url-text">{url}</span>
            <div className="share-view-modal__url-fade" />
          </div>
          <button className="share-view-modal__copy-btn" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
