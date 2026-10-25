import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bravo-footer">
      <div className="bravo-container">
        <div className="bravo-footer-main">
          <div>
            <Link to="/" className="bravo-brand bravo-footer-brand">
              <span className="bravo-brand-mark">B<span>C</span></span>
              <span className="bravo-brand-name">BRAVO <b>CAREERS</b><small>YOUR UK JOURNEY, WELL GUIDED</small></span>
            </Link>
            <p>Trusted guidance. Global possibilities.<br />UK career and founder support, with honesty at every step.</p>
          </div>
          <div className="bravo-footer-links">
            <h3>Explore</h3>
            <a href="/#about">Our approach</a>
            <a href="/#services">Services</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#faqs">FAQs</a>
          </div>
          <div className="bravo-footer-links">
            <h3>Connect</h3>
            <a href="https://www.instagram.com/bravocareers/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a>
            <a href="/#contact">Book a free call</a>
            <Link to="/legal/privacy-policy">Privacy policy</Link>
            <Link to="/legal/terms-of-service">Terms of service</Link>
          </div>
        </div>
        <div className="bravo-footer-bottom">
          <span>© {new Date().getFullYear()} Bravo Careers. All rights reserved.</span>
          <span>Guidance, not guarantees.</span>
        </div>
      </div>
    </footer>
  );
}
