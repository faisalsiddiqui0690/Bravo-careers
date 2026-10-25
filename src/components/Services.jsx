import { useState, useEffect, useRef } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import { getServices, IMAGE_BASE } from '../services/api';

const defaultServices = [
  { id: 1, icon: '🌐', title: 'Web Development', description: 'Beautiful, high-performing websites that turn visitors into customers. Custom design and development with modern tech stack.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { id: 2, icon: '📱', title: 'App Development', description: 'Native and cross-platform apps that users love. iOS, Android, and cloud integration with real-time synchronization.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { id: 3, icon: '🛒', title: 'E-Commerce Management', description: 'End-to-end e-commerce solutions that boost sales and reduce operational friction. Platform setup and payment integration.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { id: 4, icon: '📊', title: 'CRM Implementation', description: 'Streamlined CRM solutions that unify your customer data and accelerate sales. Custom workflows and team training.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { id: 5, icon: '⚙️', title: 'IT Infrastructure', description: 'On-premise & cloud solutions for modern businesses. Scalable infrastructure designed for enterprise needs.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { id: 6, icon: '🔐', title: 'Cybersecurity', description: 'Protection & compliance for your digital assets. Security audits, threat mitigation, and continuous monitoring.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] }
];

const defaultFeatures = ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'];

const ServiceCard = ({ service, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation();
  return (
    <Link
      to={`/services/${service.id}`}
      ref={cardRef}
      className={`bg-bg border border-subtle rounded-xl p-2 pb-1.5 cursor-pointer overflow-hidden relative group hover:border-primary hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 reveal-on-scroll ${cardVisible ? 'visible' : ''} block no-underline`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg h-32 md:h-40 flex items-center justify-center mb-4 transition-colors group-hover:from-primary/10 group-hover:to-accent/10 overflow-hidden">
        <div className="absolute top-3 left-3 text-[10px] md:text-[11px] text-primary font-bold uppercase tracking-wider bg-primary/10 backdrop-blur-md px-3 py-1 rounded-md z-1 border border-primary/20">
          Service
        </div>
        {service.icon && (service.icon.includes('media.ipshopy.com') || service.icon.startsWith('/uploads')) ? (
          <img
            src={service.icon.includes('media.ipshopy.com') ? service.icon : `${IMAGE_BASE}${service.icon}`}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.outerHTML = '<div class="text-[48px] md:text-[60px]">📁</div>'; }}
          />
        ) : (
          <div className="text-[48px] md:text-[60px] group-hover:scale-110 transition-transform duration-500">{service.icon || '📁'}</div>
        )}
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold mb-2 text-text group-hover:text-primary transition-colors">{service.title}</h3>
        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{service.description}</p>
      </div>
    </Link>
  );
};

const Services = () => {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    getServices()
      .then(data => {
        if (data && data.length > 0) {
          setServices(data.map(s => ({ ...s, features: s.features || defaultFeatures })));
        }
      })
      .catch(err => {
        console.error('Failed to fetch services:', err);
      });
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleArrowClick = () => {
    // Removed - no longer needed
  };

  return (
    <section className="bg-surface py-10 md:py-16 scroll-mt-20 overflow-hidden" id="services">
      <div className="container">
        <div className={`section-header ${headerVisible ? 'visible' : ''}`} ref={headerRef}>
          <h2 className="text-[28px] md:text-[32px] font-semibold mb-4 bg-gradient-to-br from-text to-text-secondary bg-clip-text text-transparent">Services Built for Every Stage of Your Digital Journey</h2>
          <p className="text-base md:text-lg text-text-secondary max-w-[600px] mx-auto">Comprehensive solutions across web, mobile, e-commerce, and enterprise software</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service, index) => (
            <ServiceCard key={service.id || index} service={service} index={index} />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center text-center mt-12 px-0">
          <Link to="/services" className="btn-secondary">
            View All Services
          </Link>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="btn-primary">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;