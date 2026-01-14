import pathwaysLogo from '../../../assets/pathways-logo.svg';
import './PrimaryNavBar.css';

export function PrimaryNavBar() {
  return (
    <nav className="primary-nav">
      <div className="primary-nav__container">
        <div className="primary-nav__logo">
          <img src={pathwaysLogo} alt="Pathways" className="primary-nav__logo-image" />
        </div>
        <ul className="primary-nav__items">
          <li><a href="/" className="primary-nav__item">Welcome</a></li>
          <li><a href="/segmentations" className="primary-nav__item primary-nav__item--active">Segmentations</a></li>
          <li><a href="/news" className="primary-nav__item">News</a></li>
          <li><a href="/contact" className="primary-nav__item">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
