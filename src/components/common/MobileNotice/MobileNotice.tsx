import { useEffect, useState } from 'react';
import mobileLimitedImg from '../../../assets/Mobile-limited.png';
import './MobileNotice.css';

/**
 * Below 900px, desktop-only tools show this notice instead of their content,
 * matching the live site. "Continue to desktop version" reveals the page at
 * its desktop width (scrolling sideways).
 */
export function MobileNotice() {
  const [dismissed, setDismissed] = useState(false);

  // Lets the page fit the viewport while the notice is up (see global.css)
  useEffect(() => {
    if (dismissed) return;
    document.body.classList.add('mobile-notice-active');
    return () => document.body.classList.remove('mobile-notice-active');
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="mobile-notice">
      <div className="mobile-notice__card" role="region" aria-label="Limited mobile experience">
        <img src={mobileLimitedImg} alt="" className="mobile-notice__illustration" />
        <div className="mobile-notice__text">
          <h2 className="mobile-notice__title">Limited mobile experience</h2>
          <p className="mobile-notice__body">This page works best on larger screens.</p>
        </div>
        <button type="button" className="mobile-notice__continue" onClick={() => setDismissed(true)}>
          Continue to desktop version
        </button>
        <div className="mobile-notice__divider"><span>or</span></div>
        <button type="button" className="mobile-notice__back" onClick={() => window.history.back()}>
          Back to previous page
        </button>
      </div>
    </div>
  );
}
