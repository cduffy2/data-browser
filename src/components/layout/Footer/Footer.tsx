import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__header">
          <div className="footer__logo">
            <span>Pathways</span>
            <span className="footer__beta">BETA</span>
          </div>
          <div className="footer__attribution">
            Pathways is led by Sonder Collective and funded by the Gates Foundation
          </div>
          <div className="footer__language">
            <button className="footer__lang-btn footer__lang-btn--active">
              English
            </button>
            <button className="footer__lang-btn">Français</button>
          </div>
        </div>
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
              <li><a href="#">Knowledge base →</a></li>
              <li><a href="#">Feedback survey →</a></li>
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
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Youtube</a></li>
              <li><a href="#">Bluesky</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2025 withpathways.org · CC BY 4.0</span>
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
