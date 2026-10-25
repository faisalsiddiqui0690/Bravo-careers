import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/nplogo.png';

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] px-0 py-1.5 transition-all duration-500 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full shadow-none'} ${scrolled ? 'bg-bg/95 backdrop-blur-md py-1 shadow-lg shadow-black/5' : 'bg-transparent py-2'}`}>
        <div className="container flex justify-between items-center h-[40px] md:h-[52px]">
          <Link to="/" className="flex items-center gap-2 no-underline group" onClick={(e) => {
            if (window.location.pathname === '/') {
              scrollToSection(e, 'home');
            }
          }}>
            <img 
              src={logo} 
              alt="NPquantumtech" 
              className={`h-[70px] md:h-[90px] w-auto transition-all duration-300 group-hover:scale-105 brightness-0 ${theme === 'dark' ? 'invert' : ''}`}
            />
          </Link>
          
          <button 
            className="md:hidden flex flex-col justify-center items-center gap-1.5 bg-transparent cursor-pointer p-1 z-[1001] transition-all active:scale-90" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-[2px] bg-text rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
            <span className={`w-6 h-[2px] bg-text rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 -translate-x-2' : ''}`}></span>
            <span className={`w-6 h-[2px] bg-text rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
          </button>

          <ul className="hidden md:flex items-center gap-8 lg:gap-10 list-none">
            {['Home', 'Services', 'Projects', 'Contact'].map((item) => (
              <li key={item}>
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                  className="text-text/70 font-bold text-[13px] uppercase tracking-widest no-underline transition-all hover:text-primary relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <button 
              className="w-10 h-10 rounded-xl cursor-pointer flex items-center justify-center transition-all bg-surface border border-subtle shadow-sm hover:scale-110 hover:border-primary active:scale-95 overflow-hidden" 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-[#818cf8] fill-[#818cf8]/10 animate-fadeIn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]/10 animate-fadeIn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                )}
              </div>
            </button>
            <Link to="/contact" className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-lg font-semibold text-[13px] uppercase tracking-wide transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-105 active:scale-95 border border-primary/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[1100] md:hidden pointer-events-none ${mobileMenuOpen ? 'pointer-events-auto' : ''}`}>
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={closeMenu}
        ></div>
        <div className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-bg border-l border-subtle p-8 transition-transform duration-500 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <img src={logo} alt="Logo" className={`h-12 w-auto ${theme === 'dark' ? 'brightness-0 invert' : ''}`} />
              <button onClick={closeMenu} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-subtle">✕</button>
            </div>
            
            <ul className="flex flex-col gap-6 list-none mb-auto">
              {['Home', 'Services', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-lg font-semibold text-text hover:text-primary transition-colors block"
                    onClick={closeMenu}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 pt-6 border-t border-subtle">
              <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-surface border border-subtle rounded-xl text-text font-semibold text-xs active:scale-95 transition-all" onClick={toggleTheme}>
                <div className="w-4 h-4 flex items-center justify-center">
                  {theme === 'dark' ? (
                    <svg className="w-4 h-4 text-[#818cf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#f59e0b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>
                  )}
                </div>
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
              <Link to="/contact" onClick={closeMenu} className="flex-1 flex items-center justify-center bg-primary text-white py-3 rounded-xl font-semibold text-xs shadow-lg shadow-primary/20">Let's Talk</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default Navbar;
