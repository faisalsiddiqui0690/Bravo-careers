import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useScrollBlur } from '../hooks/useScrollBlur';
import FadeInSection from '../components/FadeInSection';

const SERVICES = [
  {
    icon: <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    title: 'Web Development',
    desc: 'From simple landing pages to complex enterprise platforms, we build fast, scalable, and secure web applications using the latest technologies.',
    features: ['React / Next.js', 'Node.js & REST APIs', 'Database Design', 'Performance Optimization'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    title: 'Mobile App Development',
    desc: 'Native iOS & Android apps plus cross-platform solutions that deliver smooth, engaging experiences across all devices.',
    features: ['React Native', 'iOS (Swift)', 'Android (Kotlin)', 'App Store Deployment'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>,
    title: 'UI/UX Design',
    desc: 'Beautiful, intuitive interfaces crafted through research, prototyping, and user testing — design that converts visitors into customers.',
    features: ['User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'E-Commerce Solutions',
    desc: 'End-to-end online store development with payment integration, inventory management, and conversion-optimised checkout flows.',
    features: ['Shopify / WooCommerce', 'Payment Gateways', 'Inventory Systems', 'Analytics Integration'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
    title: 'Cloud & DevOps',
    desc: 'Scalable cloud infrastructure, CI/CD pipelines, and deployment automation that keeps your product running reliably at any scale.',
    features: ['AWS / GCP / Azure', 'Docker & Kubernetes', 'CI/CD Pipelines', '24/7 Monitoring'],
  },
  {
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    title: 'Custom Software',
    desc: 'Bespoke software solutions built around your specific workflows — ERP, CRM, dashboards, and automation tools.',
    features: ['Requirements Analysis', 'Custom Architecture', 'Integration & APIs', 'Ongoing Support'],
  },
];

const PROCESS = [
  { step: '01', title: 'Discovery', desc: 'We start by understanding your business, goals, and users.' },
  { step: '02', title: 'Design', desc: 'Wireframes, prototypes, and design reviews before a single line of code.' },
  { step: '03', title: 'Development', desc: 'Agile sprints with regular demos and transparent communication.' },
  { step: '04', title: 'Launch', desc: 'Testing, deployment, and handover — with post-launch support.' },
];

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M3 7h8M8 4l3 3-3 3" />
  </svg>
);

export default function Services() {
  const heroBlur = useScrollBlur(300);
  const [showEcommerceModal, setShowEcommerceModal] = useState(null);

  return (
    <div className="page">

      {/* ── PAGE HERO ── */}
      <section style={{
        minHeight: '30vh',
        display: 'flex', 
        alignItems: 'center',
        paddingTop: '72px', 
        paddingBottom: '40px', 
        position: 'relative', 
        overflow: 'hidden',
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%),
          url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&auto=format&fit=crop') center/cover no-repeat
        `,
        filter: `blur(${heroBlur}px)`,
        transition: 'filter 0.1s ease-out',
      }}>
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <div className="badge" style={{ margin: '0 auto 18px' }}><span className="badge-dot" /> What We Do</div>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 52px)', marginBottom: 16 }}>Our Services</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 17, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Comprehensive technology solutions designed to accelerate your growth and transform your business.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Get a Quote <ArrowIcon /></Link>
            <Link to="/technologies" className="btn btn-outline">View Technologies</Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <FadeInSection className="section section-alt">
        <div className="container">
          <div className="grid-3">
            {SERVICES.map(({ icon, title, desc, features }) => (
              <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="icon-box">{icon}</div>
                <h3 style={{ fontSize: 17, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 20, flex: 1 }}>{desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gray-500)' }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2 3-3" stroke="var(--blue)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* IPShopy Marketplace Card */}
            <div 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                border: '2px solid #ff6b35',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.03) 0%, rgba(255,107,53,0.08) 100%)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onClick={() => setShowEcommerceModal('marketplace')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,53,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)' }}>
                <svg viewBox="0 0 24 24" style={{ stroke: 'white', strokeWidth: 1.8, fill: 'none' }}>
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  <line x1="12" y1="11" x2="12" y2="17"/>
                  <line x1="9" y1="14" x2="15" y2="14"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 10 }}>IPShopy Marketplace</h3>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
                0% commission marketplace platform with integrated shipping solutions.
              </p>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 'auto',
                  boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
                }}
              >
                Learn More →
              </button>
            </div>

            {/* IPShopy Seller Hub Card */}
            <div 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                border: '2px solid #1a3cff',
                background: 'linear-gradient(135deg, rgba(26,60,255,0.03) 0%, rgba(26,60,255,0.08) 100%)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onClick={() => setShowEcommerceModal('sellerhub')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,60,255,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #1a3cff 0%, #0a1a6b 100%)' }}>
                <svg viewBox="0 0 24 24" style={{ stroke: 'white', strokeWidth: 1.8, fill: 'none' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18"/>
                  <path d="M9 21V9"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 10 }}>IPShopy Seller Hub</h3>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
                Complete seller dashboard with analytics, inventory & order management.
              </p>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #1a3cff 0%, #0a1a6b 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 'auto',
                  boxShadow: '0 2px 8px rgba(26,60,255,0.3)',
                }}
              >
                Learn More →
              </button>
            </div>

            {/* IPShopy Shipments Card */}
            <div 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                border: '2px solid #00b894',
                background: 'linear-gradient(135deg, rgba(0,184,148,0.03) 0%, rgba(0,184,148,0.08) 100%)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onClick={() => setShowEcommerceModal('shipments')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,184,148,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #00b894 0%, #00a383 100%)' }}>
                <svg viewBox="0 0 24 24" style={{ stroke: 'white', strokeWidth: 1.8, fill: 'none' }}>
                  <rect x="1" y="3" width="15" height="13" rx="2"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 10 }}>IPShopy Shipments</h3>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
                End-to-end logistics with real-time tracking and competitive rates.
              </p>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #00b894 0%, #00a383 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 'auto',
                  boxShadow: '0 2px 8px rgba(0,184,148,0.3)',
                }}
              >
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* ── PROCESS ── */}
      <FadeInSection className="section">
        <div className="container">
          <div className="section-head">
            <h2>How We Work</h2>
            <p>A proven process that delivers results, on time and on budget</p>
          </div>
          <div className="process-grid">
            {PROCESS.map(({ step, title, desc }) => (
              <div key={step} style={{ 
                textAlign: 'center', 
                position: 'relative',
                background: 'var(--white)',
                padding: '32px 24px',
                borderRadius: '16px',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `linear-gradient(135deg, var(--blue), var(--blue-dark))`,
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 18,
                  boxShadow: '0 4px 12px rgba(26,60,255,0.3)',
                }}>{step}</div>
                <h3 style={{ fontSize: 17, marginBottom: 10, fontWeight: 700 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* ── CTA ── */}
      <FadeInSection className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-text">
              <h2>Need a Custom Solution?</h2>
              <p>Tell us about your project and we'll get back to you within 24 hours.</p>
            </div>
            <Link to="/contact" className="btn btn-white">Start a Project →</Link>
          </div>
        </div>
      </FadeInSection>

      {/* ── E-COMMERCE MODAL ── */}
      {showEcommerceModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowEcommerceModal(null)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: 20,
              maxWidth: 700,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              animation: 'modalSlideIn 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowEcommerceModal(null)}
              style={{
                position: 'absolute',
                top: 16, right: 16,
                width: 36, height: 36,
                borderRadius: '50%',
                border: 'none',
                background: 'var(--gray-100)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--gray-200)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--gray-100)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Header Banner */}
            <div style={{
              background: showEcommerceModal === 'marketplace' 
                ? 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
                : showEcommerceModal === 'sellerhub'
                ? 'linear-gradient(135deg, #1a3cff 0%, #0a1a6b 100%)'
                : 'linear-gradient(135deg, #00b894 0%, #00a383 100%)',
              padding: '40px 32px',
              borderRadius: '20px 20px 0 0',
              color: 'white',
              textAlign: 'center',
            }}>
              <div style={{
                width: 64, height: 64,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                {showEcommerceModal === 'marketplace' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="11" x2="12" y2="17"/>
                    <line x1="9" y1="14" x2="15" y2="14"/>
                  </svg>
                ) : showEcommerceModal === 'sellerhub' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                )}
              </div>
              <h2 style={{ fontSize: 28, marginBottom: 8, fontWeight: 800 }}>
                {showEcommerceModal === 'marketplace' ? 'IPShopy Marketplace' 
                 : showEcommerceModal === 'sellerhub' ? 'IPShopy Seller Hub' 
                 : 'IPShopy Shipments'}
              </h2>
              <p style={{ fontSize: 16, opacity: 0.95 }}>
                {showEcommerceModal === 'marketplace' ? 'Your Gateway to E-commerce Success'
                 : showEcommerceModal === 'sellerhub' ? 'Complete Seller Management Dashboard'
                 : 'Smart Logistics & Shipping Solutions'}
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: '40px 32px' }}>
              {/* Introduction */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, marginBottom: 12, color: 'var(--gray-900)' }}>About This Service</h3>
                
                {showEcommerceModal === 'marketplace' && (
                  <>
                    <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 16 }}>
                      We are revolutionizing online commerce with India's most seller-friendly marketplace platform. 
                      At IPShopy, we believe in empowering businesses by providing a seamless, cost-effective ecosystem 
                      where sellers can thrive without the burden of high commissions.
                    </p>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,140,66,0.08) 100%)',
                      border: '1px solid rgba(255,107,53,0.2)',
                      borderRadius: 12, padding: 20, marginBottom: 24,
                    }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#ff6b35', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        0% Commission on All Sales - Keep 100% of Your Profits!
                      </p>
                    </div>
                  </>
                )}

                {showEcommerceModal === 'sellerhub' && (
                  <>
                    <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 16 }}>
                      The IPShopy Seller Hub is your command center for managing your entire e-commerce business. 
                      From real-time analytics to inventory tracking and order management, everything you need 
                      to grow your business is available in one intuitive, easy-to-use dashboard.
                    </p>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(26,60,255,0.08) 0%, rgba(10,26,107,0.08) 100%)',
                      border: '1px solid rgba(26,60,255,0.2)',
                      borderRadius: 12, padding: 20, marginBottom: 24,
                    }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#1a3cff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        All-in-One Dashboard - Manage Everything from One Place!
                      </p>
                    </div>
                  </>
                )}

                {showEcommerceModal === 'shipments' && (
                  <>
                    <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 16 }}>
                      IPShopy Shipments takes the complexity out of e-commerce logistics. Our integrated shipping 
                      solution provides competitive rates, real-time tracking, and reliable delivery partners 
                      to ensure your products reach customers safely and on time.
                    </p>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(0,184,148,0.08) 0%, rgba(0,163,131,0.08) 100%)',
                      border: '1px solid rgba(0,184,148,0.2)',
                      borderRadius: 12, padding: 20, marginBottom: 24,
                    }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#00b894', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Pan-India Delivery - Fast, Reliable & Trackable!
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Key Features */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, marginBottom: 16, color: 'var(--gray-900)' }}>Key Features</h3>
                <div className="modal-features-grid">
                  {(showEcommerceModal === 'marketplace' ? [
                    { title: 'Zero Commission Model', desc: 'List and sell unlimited products without paying any platform fees or commissions.', icon: '💰' },
                    { title: 'Integrated Shipping', desc: 'Built-in IPShopy Shipments integration for seamless order fulfillment.', icon: '📦' },
                    { title: 'Seller Hub Access', desc: 'Complete dashboard for analytics, inventory, and order management.', icon: '📊' },
                    { title: 'Pan-India Reach', desc: 'Connect with millions of customers across India.', icon: '🇮🇳' },
                    { title: 'Secure Payments', desc: 'Fast, reliable payment settlements with complete transparency.', icon: '🔒' },
                    { title: 'Marketing Support', desc: 'Promotional campaigns and marketing tools to boost visibility.', icon: '📢' },
                  ] : showEcommerceModal === 'sellerhub' ? [
                    { title: 'Real-Time Analytics', desc: 'Track sales, revenue, and performance metrics with detailed dashboards.', icon: '📈' },
                    { title: 'Inventory Management', desc: 'Automated stock tracking, low-stock alerts, and bulk upload capabilities.', icon: '📦' },
                    { title: 'Order Processing', desc: 'Streamlined order management from placement to delivery confirmation.', icon: '✅' },
                    { title: 'Customer Insights', desc: 'Understand your customers with detailed behavior and purchase analytics.', icon: '👥' },
                    { title: 'Automated Notifications', desc: 'Keep customers informed with automated order status updates.', icon: '🔔' },
                    { title: 'Multi-Platform Sync', desc: 'Manage multiple sales channels from a single unified dashboard.', icon: '🔄' },
                  ] : [
                    { title: 'Competitive Rates', desc: 'Negotiated shipping rates that save you money on every order.', icon: '💵' },
                    { title: 'Real-Time Tracking', desc: 'Live shipment tracking for you and your customers.', icon: '📍' },
                    { title: 'Multiple Partners', desc: "Integration with India's most reliable courier and logistics partners.", icon: '🚚' },
                    { title: 'Automated Pickup', desc: 'Schedule automatic pickups from your warehouse or location.', icon: '⏰' },
                    { title: 'COD Support', desc: 'Cash on delivery option with fast remittance cycles.', icon: '💰' },
                    { title: 'Returns Management', desc: 'Hassle-free reverse logistics for returns and exchanges.', icon: '↩️' },
                  ]).map((feature, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: 16,
                        padding: 16,
                        borderRadius: 12,
                        background: 'var(--gray-50)',
                        border: '1px solid var(--gray-100)',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                      <div style={{ fontSize: 28, flexShrink: 0 }}>{feature.icon}</div>
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>{feature.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{
                background: showEcommerceModal === 'marketplace'
                  ? 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)'
                  : showEcommerceModal === 'sellerhub'
                  ? 'linear-gradient(135deg, #1a3cff 0%, #0a1a6b 100%)'
                  : 'linear-gradient(135deg, #00b894 0%, #00a383 100%)',
                borderRadius: 16,
                padding: 28,
                textAlign: 'center',
                color: 'white',
              }}>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>
                  {showEcommerceModal === 'marketplace' ? 'Ready to Start Selling?'
                   : showEcommerceModal === 'sellerhub' ? 'Ready to Grow Your Business?'
                   : 'Ready to Simplify Shipping?'}
                </h3>
                <p style={{ fontSize: 14, marginBottom: 20, opacity: 0.9 }}>
                  {showEcommerceModal === 'marketplace' ? 'Join thousands of successful sellers on IPShopy.com'
                   : showEcommerceModal === 'sellerhub' ? 'Get access to powerful seller tools and analytics'
                   : 'Start shipping with confidence today'}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a 
                    href="https://www.ipshopy.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'white',
                      color: showEcommerceModal === 'marketplace' ? '#ff6b35'
                        : showEcommerceModal === 'sellerhub' ? '#1a3cff'
                        : '#00b894',
                      padding: '12px 28px',
                      borderRadius: 9,
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {showEcommerceModal === 'marketplace' ? 'Visit IPShopy.com'
                     : showEcommerceModal === 'sellerhub' ? 'Access Seller Hub'
                     : 'Explore Shipments'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                  <button
                    onClick={() => setShowEcommerceModal(null)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      padding: '12px 28px',
                      borderRadius: 9,
                      fontSize: 14,
                      fontWeight: 600,
                      border: '1.5px solid rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STYLES (mobile only) ── */}
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Process grid — desktop 4 cols */
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          position: relative;
          padding: 40px 0;
        }

        /* Modal features — desktop single col (already stacked) */
        .modal-features-grid {
          display: grid;
          gap: 16px;
        }

        /* ── MOBILE (max 768px) ── */
        @media (max-width: 768px) {

          /* Process: 2 cols */
          .process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
            padding: 20px 0 !important;
          }

          /* Modal inner padding */
          .modal-features-grid {
            gap: 12px !important;
          }
        }

        /* ── SMALL MOBILE (max 480px) ── */
        @media (max-width: 480px) {

          /* Process: single col on very small screens */
          .process-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          /* Modal header & content padding tighter */
          div[style*="borderRadius: '20px 20px 0 0'"] {
            padding: 28px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}