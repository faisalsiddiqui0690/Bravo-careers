import useScrollAnimation from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getServices, IMAGE_BASE } from '../services/api';

const defaultPageServices = [
  { icon: '🌐', title: 'Web Development', description: 'Custom websites and web applications built with modern technologies and best practices.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '📱', title: 'Mobile App Development', description: 'Native and cross-platform mobile applications for iOS and Android devices.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '🛒', title: 'E-Commerce Solutions', description: 'Complete online stores with payment processing, inventory management, and analytics.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '☁️', title: 'Cloud Services', description: 'Scalable cloud infrastructure and migration services for modern businesses.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '🔒', title: 'Cybersecurity', description: 'Comprehensive security solutions to protect your digital assets and data.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '📊', title: 'Data Analytics', description: 'Business intelligence and analytics solutions for data-driven decisions.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '🤖', title: 'AI Integration', description: 'Artificial intelligence solutions to automate and enhance your business processes.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '🔧', title: 'Maintenance & Support', description: 'Ongoing support and maintenance to keep your systems running smoothly.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] },
  { icon: '🚀', title: 'Performance Optimization', description: 'Speed and performance improvements for existing applications and websites.', features: ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'] }
];

const defaultFeatures = ['Custom Development', 'Scalable Architecture', 'Modern UI/UX', 'Performance Optimized', '24/7 Support'];

const ServiceCardPage = ({ service, index, onSelect }) => {
  const [cardRef, cardVisible] = useScrollAnimation();
  return (
    <Link
      to={`/services/${service.id}`}
      className={`bg-bg border border-subtle rounded-xl p-2 pb-1.5 transition-all duration-700 ease-out cursor-pointer overflow-hidden relative group hover:border-primary hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
      ref={cardRef}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg h-40 md:h-48 flex items-center justify-center mb-5 transition-colors group-hover:from-primary/10 group-hover:to-accent/10 overflow-hidden">
        <div className="absolute top-3 left-3 text-[10px] md:text-[11px] text-primary font-semibold uppercase tracking-wider bg-primary/10 backdrop-blur-md px-3 py-1 rounded-md z-1 border border-primary/20">
          Service
        </div>
        {service.icon && (service.icon.includes('media.ipshopy.com') || service.icon.startsWith('/uploads')) ? (
          <img
            src={service.icon.includes('media.ipshopy.com') ? service.icon : `${IMAGE_BASE}${service.icon}`}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.outerHTML = '<div class="text-[48px] md:text-[60px]">📁</div>'; }}
          />
        ) : (
          <div className="text-[48px] md:text-[60px] group-hover:scale-110 transition-transform duration-500">{service.icon || '📁'}</div>
        )}
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-xl font-semibold mb-2 text-text group-hover:text-primary transition-colors relative z-1">{service.title}</h3>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed line-clamp-3 relative z-1">{service.description}</p>
      </div>
    </Link>
  );
};

const ServicesPage = ({ theme, toggleTheme }) => {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState(defaultPageServices);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const scrollRef = useRef(null);

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

  const handleScroll = (e) => {
    const el = e.target;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setShowScrollArrow(!atBottom);
  };

  const openServiceModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setShowScrollArrow(true);
    document.body.style.overflow = 'hidden';
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    document.body.style.overflow = 'unset';
  };

  const handleArrowClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-bg to-surface">
      <div className="container relative z-1">
        <div className={`section-header ${headerVisible ? 'visible' : ''} mb-16`} ref={headerRef}>
          <h2 className="text-[32px] md:text-[48px] font-light mb-5 text-text tracking-tight">Our Services</h2>
          <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">Comprehensive digital solutions to transform your business and drive growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <ServiceCardPage key={index} service={service} index={index} />
          ))}
        </div>

        {/* Service Details Modal */}
        {isModalOpen && selectedService && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fadeIn"
            onClick={closeServiceModal}
          >
            <div
              className="bg-bg border border-subtle w-full max-w-3xl rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden animate-slideUp max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-2xl font-light text-white hover:text-white/80 transition-colors bg-black/50 backdrop-blur-sm rounded-full z-20"
                onClick={closeServiceModal}
              >
                ×
              </button>

              {/* Fixed Header */}
              <div className="px-6 md:px-10 py-4 md:py-5 border-b border-subtle flex-shrink-0">
                <h2 className="text-2xl md:text-3xl font-semibold text-text mb-2 leading-tight break-words pr-10">
                  {selectedService.title}
                </h2>
                <p className="text-[11px] font-semibold text-primary bg-primary-light/50 px-3 py-1.5 rounded-md uppercase tracking-wider inline-block">
                  Service
                </p>
              </div>

              {/* Scrollable Content */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar"
                onScroll={handleScroll}
              >
                {/* Banner Image — centered, contained, NO cropping */}
                <div className="w-full  flex items-center justify-center px-2 py-2">
                  {selectedService.icon && (selectedService.icon.includes('media.ipshopy.com') || selectedService.icon.startsWith('/uploads')) ? (
                    <img
                      src={selectedService.icon.includes('media.ipshopy.com') ? selectedService.icon : `${IMAGE_BASE}${selectedService.icon}`}
                      alt={selectedService.title}
                      className="max-w-full max-h-72 w-auto h-auto object-contain rounded-xl shadow-lg mx-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += '<div class="text-7xl md:text-8xl">📁</div>';
                      }}
                    />
                  ) : (
                    <div className="text-7xl md:text-8xl">{selectedService.icon || '📁'}</div>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-6 md:p-10 space-y-8">

                  {/* Service Overview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">
                      Service Overview
                    </h3>
                    <p className="text-[15px] md:text-base text-text-secondary leading-relaxed break-words">
                      {selectedService.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">
                      Key Features
                    </h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {selectedService.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="text-xs md:text-sm font-medium text-text-tertiary bg-surface border border-border px-3 py-1.5 rounded-lg uppercase tracking-tight transition-colors hover:border-primary hover:text-primary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Service Highlights */}
                  <div className="space-y-4 pb-2">
                    <h3 className="text-lg font-semibold text-text flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">
                      Service Highlights
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-surface/50 p-4 rounded-xl border border-subtle">
                        <h4 className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-1">Service Type</h4>
                        <p className="text-sm font-medium text-text">{selectedService.title}</p>
                      </div>
                      <div className="bg-surface/50 p-4 rounded-xl border border-subtle">
                        <h4 className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-1">Features</h4>
                        <p className="text-sm font-medium text-text">{selectedService.features.length}+ key features</p>
                      </div>
                      <div className="bg-surface/50 p-4 rounded-xl border border-subtle">
                        <h4 className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-1">Delivery</h4>
                        <p className="text-sm font-medium text-text">Professional implementation</p>
                      </div>
                      <div className="bg-surface/50 p-4 rounded-xl border border-subtle">
                        <h4 className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-1">Support</h4>
                        <p className="text-sm font-medium text-text">24/7 technical assistance</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Scroll Down Arrow — hides when user reaches bottom */}
              {showScrollArrow && (
                <div
                  className="absolute bottom-[88px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 cursor-pointer"
                  onClick={handleArrowClick}
                >
                  <div className="absolute inset-x-0 -top-6 h-10 " />
                  <div className="relative flex flex-col items-center animate-bounce">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-1">Scroll</span>
                    <div className="w-8 h-8 rounded-full bg-primary/90 backdrop-blur flex items-center justify-center shadow-lg shadow-primary/30">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4.5L7 9.5L12 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Fixed Footer Actions */}
              <div className="p-6 md:p-8 border-t border-subtle bg-surface/30 flex flex-wrap gap-4 items-center justify-end flex-shrink-0">
                <button onClick={closeServiceModal} className="px-6 py-2.5 text-text hover:text-primary font-semibold transition-all">
                  Close
                </button>
                <Link
                  to="/contact"
                  onClick={closeServiceModal}
                  className="bg-primary text-white px-8 py-2.5 rounded-xl font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                  Get Started
                </Link>
              </div>

            </div>
          </div>
        )}

        <div className="mt-20 md:mt-24 p-8 md:p-12 rounded-3xl bg-surface border border-subtle text-center shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="relative z-1">
            <h3 className="text-2xl md:text-[30px] font-semibold mb-4 text-text leading-tight">Ready to Get Started?</h3>
            <p className="text-sm md:text-base text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">Let's discuss how our services can help your business grow and succeed in the digital age.</p>
            <Link to="/contact" className="btn-primary">
              Contact Us Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;