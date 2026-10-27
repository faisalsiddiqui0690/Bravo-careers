import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDownToLine, ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
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
  const [resourcesOpen, setResourcesOpen] = useState(false);
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

  const closeMenu = () => {
    setMenuOpen(false);
    setResourcesOpen(false);
  };
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
        <Link className="bravo-ticker-label" to="/resources/free-resources">Free Resources</Link>
        <div className="bravo-ticker-window" aria-hidden="true">
          <div className="bravo-ticker-track">
            {highlights}
            {highlights}
          </div>
        </div>
        <Link className="bravo-ticker-download" to="/resources/free-resources">
          Get yours <ArrowDownToLine size={14} />
        </Link>
      </div>
      <header className={`bravo-header ${headerVisible || menuOpen ? '' : 'is-hidden'}`}>
        <div className="bravo-container bravo-header-inner">
          <Link to="/" className="bravo-brand" aria-label="Bravo Careers home" onClick={closeMenu}>
            <img className="bravo-brand-logo" src={bravoCareersLogo} alt="Bravo Careers — Trusted Guidance. Global Possibilities." />
            <span className="bravo-brand-name">Bravo Careers</span>
          </Link>
          <nav className={`bravo-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {links.map(([label, id]) => <a href={sectionHref(id)} key={id} onClick={closeMenu}>{label}</a>)}
            <div className={`bravo-nav-dropdown ${resourcesOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="bravo-nav-dropdown-trigger"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
              >
                Resources <ChevronDown size={15} />
              </button>
              <div className="bravo-nav-dropdown-menu">
                <Link to="/resources/ebooks" onClick={closeMenu}>E-Books</Link>
                <Link to="/resources/free-resources" onClick={closeMenu}>Free Resources</Link>
              </div>
            </div>
            <a className="bravo-nav-cta" href={sectionHref('contact')} onClick={closeMenu}>Contact Us <ArrowRight size={15} /></a>
          </nav>
          <button type="button" className="bravo-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
    </>
  );
}
