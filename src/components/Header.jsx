import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/nplogo.png';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Technologies', to: '/technologies' },
];

const LogoMark = () => (
  <span style={{
    width: 48, height: 48,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #1a3cff 0%, #0a1a6b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(26, 60, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Subtle shine effect */}
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
      pointerEvents: 'none',
    }} />
    
    {/* Enhanced chevron icon */}
    <svg width="24" height="24" viewBox="0 0 14 14" fill="none" style={{
      position: 'relative',
      zIndex: 1,
    }}>
      <path 
        d="M2 10L7 4L12 10" 
        stroke="white" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
        }}
      />
    </svg>
  </span>
);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrolled = currentScrollY > 40;

          setScrolled(isScrolled);
          setVisible(currentScrollY < lastScrollY || currentScrollY < 60);
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [lastScrollY]);

  useEffect(() => setMobileOpen(false), [location]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 62,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      
        // Clean white background - always visible
        background: 'white',
      
        // Subtle shadow for depth
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
              
        // Prevent overflow on mobile
        boxSizing: 'border-box',
        maxWidth: '100vw',
      }}>

        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        >
          <img 
            src={logo} 
            alt="NPquantumtech" 
            style={{
              height: '100px',
              width: 'auto',
              maxWidth: '300px'
            }}
          />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: isActive(to) ? 'var(--blue)' : 'var(--gray-900)',
                background: isActive(to) ? 'var(--blue-light)' : 'transparent',
                padding: '6px 13px',
                borderRadius: 8,
                transition: 'color 0.18s, background 0.18s',
              }}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/contact"
            style={{
              marginLeft: 10,
              background: 'var(--blue)',
              color: 'white',
              padding: '7px 20px',
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              transition: 'background 0.18s',
              boxShadow: '0 2px 8px rgba(26,60,255,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
          >
            Get in Touch
          </Link>
        </nav>

        {/* Hamburger Button */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="hamburger-btn"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            flexShrink: 0,
            minWidth: 32,
            minHeight: 32,
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: 'var(--gray-900)',
                borderRadius: 2,
                transition: '0.3s',
              }}
            />
          ))}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 62,
          left: 0,
          right: 0,
          zIndex: 99,
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: 15,
                fontWeight: 500,
                padding: '10px 12px',
                borderRadius: 8,
                color: isActive(to) ? 'var(--blue)' : 'var(--gray-900)',
                background: isActive(to) ? 'var(--blue-light)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            style={{
              marginTop: 8,
              background: 'var(--blue)',
              color: 'white',
              padding: '11px 16px',
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Get in Touch
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          
          /* Ensure header doesn't overflow on mobile */
          header {
            padding: 0 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          header {
            padding: 0 12px !important;
          }
        }
      `}</style>
    </>
  );
}