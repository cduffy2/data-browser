import { useEffect, useState } from 'react';
import './AnchorNav.css';

interface AnchorLink {
  id: string;
  label: string;
}

interface AnchorNavProps {
  links: AnchorLink[];
}

export function AnchorNav({ links }: AnchorNavProps) {
  const [activeId, setActiveId] = useState<string>(links[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    links.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      links.forEach((link) => {
        const element = document.getElementById(link.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [links]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <nav className="anchor-nav">
      <div className="anchor-nav__title">On this page</div>
      <ul className="anchor-nav__list">
        {links.map((link) => (
          <li key={link.id} className="anchor-nav__item">
            <a
              href={`#${link.id}`}
              className={`anchor-nav__link ${activeId === link.id ? 'anchor-nav__link--active' : ''}`}
              onClick={(e) => handleClick(e, link.id)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
