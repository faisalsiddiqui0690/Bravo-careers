import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDownToLine, ArrowRight, Menu, X } from 'lucide-react';

const resourceHighlights = [
  'ATS CV & cover letter templates',
  'Job application strategy eBook',
  'Self-sponsorship eBook',
  'Innovator Founder guide',
];

const links = [
  ['Our approach', 'about'],
  ['Services', 'services'],
  ['Pricing', 'pricing'],
  ['FAQs', 'faqs'],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

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
      <header className="bravo-header">
        <div className="bravo-container bravo-header-inner">
          <Link to="/" className="bravo-brand" aria-label="Bravo Careers home" onClick={closeMenu}>
            <span className="bravo-brand-mark">B<span>C</span></span>
            <span className="bravo-brand-name">BRAVO <b>CAREERS</b><small>YOUR UK JOURNEY, WELL GUIDED</small></span>
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
