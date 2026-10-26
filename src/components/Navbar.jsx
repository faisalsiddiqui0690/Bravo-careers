import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDownToLine, ArrowRight, Menu, X } from 'lucide-react';
import bravoCareersLogo from '../assets/bravo-careers-global-travel-badge.png';

const resourceHighlights = [
  'ATS CV & cover letter templates',
  'Job application strategy eBook',
  'Self-sponsorship eBook',
  'Innovator Founder guide',
];

const links = [
  ['About us', 'about'],
  ['Services', 'services'],
  ['Testimonials', 'testimonials'],
  ['News', 'news'],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const previousScrollY = useRef(0);
  const { pathname } = useLocation();

  useEffect(() => {
    previousScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - previousScrollY.current;

      if (currentScrollY < 80) {
        setHeaderVisible(true);
      } else if (scrollDelta > 3) {
        setHeaderVisible(false);
      } else if (scrollDelta < -3) {
        setHeaderVisible(true);
      }

      previousScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const sectionHref = (id) => pathname === '/' ? `#${id}` : `/#${id}`;
  const highlights = (
    <span className="bravo-ticker-content">
      {resourceHighlights.map((highlight) => (
        <span className="bravo-ticker-item" key={highlight}>{highlight}</span>
      ))}
    </span>
  );

  return (
    <>
      <div className="bravo-resource-ticker" role="region" aria-label="Free career resources">
        <span className="bravo-ticker-label">Free Resources</span>
        <div className="bravo-ticker-window" aria-hidden="true">
          <div className="bravo-ticker-track">
            {highlights}
            {highlights}
          </div>
        </div>
        <a className="bravo-ticker-download" href="https://www.innovatorone.co.uk/freeresources" target="_blank" rel="noreferrer">
          Download <ArrowDownToLine size={14} />
        </a>
      </div>
      <header className={`bravo-header ${headerVisible || menuOpen ? '' : 'is-hidden'}`}>
        <div className="bravo-container bravo-header-inner">
          <Link to="/" className="bravo-brand" aria-label="Bravo Careers home" onClick={closeMenu}>
            <img className="bravo-brand-logo" src={bravoCareersLogo} alt="Bravo Careers — Trusted Guidance. Global Possibilities." />
            <span className="bravo-brand-name">Bravo Careers</span>
          </Link>
          <nav className={`bravo-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {links.map(([label, id]) => <a href={sectionHref(id)} key={id} onClick={closeMenu}>{label}</a>)}
            <a className="bravo-nav-cta" href={sectionHref('contact')} onClick={closeMenu}>Free clarity call <ArrowRight size={15} /></a>
          </nav>
          <button type="button" className="bravo-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
    </>
  );
}
