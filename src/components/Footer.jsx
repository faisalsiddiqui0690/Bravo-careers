import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllLegalPages, getServices } from '../services/api';

const Footer = () => {
  const [legalPages, setLegalPages] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchLegalPages = async () => {
      try {
        const pages = await getAllLegalPages();
        // Filter only published pages
        const publishedPages = pages.filter(page => page.isPublished);
        setLegalPages(publishedPages);
      } catch (error) {
        console.error('Error fetching legal pages:', error);
        // Set default pages if fetch fails
        setLegalPages([
          { slug: 'privacy-policy', title: 'Privacy Policy' },
          { slug: 'terms-of-service', title: 'Terms of Service' }
        ]);
      }
    };

    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        // Limit to first 4 services for footer
        const footerServices = servicesData.slice(0, 4);
        setServices(footerServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Set default services if fetch fails
        setServices([]);
      }
    };

    fetchLegalPages();
    fetchServices();
  }, []);
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <footer className="bg-surface border-t border-subtle pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-text">Quick Links</h3>
            <ul className="list-none flex flex-col gap-3">
              <li><Link to="/" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Services</Link></li>
              {/* <li><a href="#cases" onClick={(e) => scrollToSection(e, 'cases')} className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Case Studies</a></li> */}
              <li><Link to="/careers" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-text">Services</h3>
            <ul className="list-none flex flex-col gap-3">
              {services.length > 0 ? (
                services.map(service => (
                  <li key={service.id}>
                    <Link to={`/services/${service.id}`} className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/services" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Web Development</Link></li>
                  <li><Link to="/services" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">App Development</Link></li>
                  <li><Link to="/services" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">E-Commerce</Link></li>
                  <li><Link to="/services" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">CRM Solutions</Link></li>
                </>
              )}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-text">Legal</h3>
            <ul className="list-none flex flex-col gap-3">
              {legalPages.length > 0 ? (
                legalPages.map(page => (
                  <li key={page.slug}>
                    <Link to={`/legal/${page.slug}`} className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">
                      {page.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/legal/privacy-policy" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/legal/terms-of-service" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">Terms of Service</Link></li>
                </>
              )}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-text">Contact</h3>
            <ul className="list-none flex flex-col gap-3">
              <li><a href="mailto:services@gmail.com" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">services@gmail.com</a></li>
              <li><a href="tel:+919922284137" className="text-text-secondary text-sm no-underline hover:text-primary transition-colors">+91 99222 84137</a></li>
              <li className="text-text-secondary text-sm leading-relaxed">
                T18, STPI, Naregaon - Malharpur - Warud Rd, opp. Garware Stadium, MIDC Industrial Area, Chilkalthana, Chhatrapati Sambhajinagar, Maharashtra 431008, India
              </li>
              <li><a href="https://www.google.com/search?q=ipshopy.com" target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-bold no-underline hover:brightness-110 transition-all">4.338 Google Reviews</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-subtle/50 text-center">
          <p className="text-xs md:text-sm text-text-tertiary">
            &copy; 2026 IPShopy. All rights reserved.
            {legalPages.length > 0 && (
              <>
                {' | '}
                {legalPages.map((page, index) => (
                  <span key={page.slug}>
                    <Link to={`/legal/${page.slug}`} className="no-underline text-inherit hover:text-primary">
                      {page.title}
                    </Link>
                    {index < legalPages.length - 1 && ' | '}
                  </span>
                ))}
              </>
            )}
          </p>
        </div>
      </div>
    </footer>

  );
};

export default Footer;
