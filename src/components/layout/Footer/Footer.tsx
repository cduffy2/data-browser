import './Footer.css';
import PathwaysLogo from '../../../assets/pathways-logo-white.svg';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__header">
          <div className="footer__logo">
            <img src={PathwaysLogo} alt="Pathways" className="footer__logo-img" />
          </div>
          <div className="footer__attribution">
            <span>Pathways is led by </span>
            <a href="https://sondercollective.com" className="footer__attribution-link" target="_blank" rel="noopener noreferrer">
              Sonder Collective
              <svg className="footer__external-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <span> and funded by the </span>
            <a href="https://www.gatesfoundation.org" className="footer__attribution-link" target="_blank" rel="noopener noreferrer">
              Gates Foundation
              <svg className="footer__external-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <span>.</span>
          </div>
          <div className="footer__language">
            <button className="footer__lang-btn footer__lang-btn--active">
              English
            </button>
            <button className="footer__lang-btn">Français</button>
          </div>
        </div>
        <div className="footer__divider" />
        <div className="footer__columns">
          <div className="footer__column">
            <h3>Segmentations</h3>
            <ul>
              <li><a href="#">Kenya</a></li>
              <li><a href="#">Ethiopia</a></li>
              <li><a href="#">Bihar, India</a></li>
              <li><a href="#">Senegal</a></li>
              <li><a href="#">Northern Nigeria</a></li>
            </ul>
          </div>
          <div className="footer__column">
            <h3>Quick links</h3>
            <ul>
              <li><a href="#">Contact us</a></li>
              <li>
                <a href="#" className="footer__external-link">
                  Knowledge base
                  <svg className="footer__external-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="footer__external-link">
                  Feedback survey
                  <svg className="footer__external-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__column">
            <h3>Case studies</h3>
            <ul>
              <li><a href="#">Lagos, Nigeria</a></li>
              <li><a href="#">Kano State, Nigeria</a></li>
            </ul>
          </div>
          <div className="footer__column">
            <h3>Follow us</h3>
            <ul>
              <li>
                <a href="#" className="footer__social-link">
                  <svg className="footer__social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452Z" fill="currentColor"/>
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="footer__social-link">
                  <svg className="footer__social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186C23.217 5.097 22.366 4.229 21.298 3.94C19.378 3.4 12 3.4 12 3.4C12 3.4 4.622 3.4 2.702 3.94C1.634 4.229 0.783 5.097 0.502 6.186C0 8.17 0 12.31 0 12.31C0 12.31 0 16.449 0.502 18.433C0.783 19.522 1.634 20.354 2.702 20.643C4.622 21.183 12 21.183 12 21.183C12 21.183 19.378 21.183 21.298 20.643C22.366 20.354 23.217 19.522 23.498 18.433C24 16.449 24 12.31 24 12.31C24 12.31 24 8.17 23.498 6.186ZM9.545 15.568V9.051L15.818 12.31L9.545 15.568Z" fill="currentColor"/>
                  </svg>
                  Youtube
                </a>
              </li>
              <li>
                <a href="#" className="footer__social-link">
                  <svg className="footer__social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM16.886 14.456C16.886 15.75 15.75 16.886 14.456 16.886H9.544C8.25 16.886 7.114 15.75 7.114 14.456V9.544C7.114 8.25 8.25 7.114 9.544 7.114H14.456C15.75 7.114 16.886 8.25 16.886 9.544V14.456Z" fill="currentColor"/>
                  </svg>
                  Bluesky
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__divider" />
        <div className="footer__bottom">
          <span>© 2026 withpathways.org · CC BY 4.0</span>
          <div className="footer__legal">
            <a href="#">Privacy policy</a>
            <a href="#">Cookie policy</a>
            <a href="#">Terms of use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
