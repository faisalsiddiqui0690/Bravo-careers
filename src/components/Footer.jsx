import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import bravoCareersLogo from '../assets/bravo-careers-global-travel-badge.png';

export default function Footer() {
  return (
    <footer className="bravo-footer">
      <div className="bravo-container">
        <div className="bravo-footer-main">
          <div>
            <Link to="/" className="bravo-brand bravo-footer-brand">
              <img className="bravo-brand-logo" src={bravoCareersLogo} alt="Bravo Careers — Trusted Guidance. Global Possibilities." />
            </Link>
            <p>Trusted guidance. Global possibilities.<br />UK career and founder support, with honesty at every step.</p>
          </div>
          <div className="bravo-footer-links">
            <h3>Explore</h3>
            <a href="/#about">About us</a>
            <a href="/#services">Services</a>
            <a href="/#testimonials">Testimonials</a>
            <a href="/#news">News</a>
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
