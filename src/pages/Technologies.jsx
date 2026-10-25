import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useScrollBlur } from '../hooks/useScrollBlur';
import FadeInSection from '../components/FadeInSection';

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M3 7h8M8 4l3 3-3 3" />
  </svg>
);

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Mobile', 'Database', 'Cloud'];

const TECHS = [
  { name: 'React', cat: 'Frontend', desc: 'Modern UI library for fast, interactive interfaces', color: '#61DAFB', bg: '#e8f9fd' },
  { name: 'Next.js', cat: 'Frontend', desc: 'React framework for production-grade web apps', color: '#000000', bg: '#f0f0f0' },
  { name: 'TypeScript', cat: 'Frontend', desc: 'Typed superset of JavaScript for safer code', color: '#3178C6', bg: '#e8f0fb' },
  { name: 'Tailwind CSS', cat: 'Frontend', desc: 'Utility-first CSS framework for rapid UI dev', color: '#06B6D4', bg: '#e0f7fa' },
  { name: 'Node.js', cat: 'Backend', desc: 'Scalable server-side JavaScript runtime', color: '#339933', bg: '#e8f5e9' },
  { name: 'Express.js', cat: 'Backend', desc: 'Minimal and flexible Node.js web framework', color: '#000000', bg: '#f0f0f0' },
  { name: 'Python', cat: 'Backend', desc: 'Versatile language for APIs, AI, and automation', color: '#3776AB', bg: '#e3eef8' },
  { name: 'GraphQL', cat: 'Backend', desc: 'Flexible query language for your APIs', color: '#E10098', bg: '#fce4f3' },
  { name: 'React Native', cat: 'Mobile', desc: 'Cross-platform mobile apps with React', color: '#61DAFB', bg: '#e8f9fd' },
  { name: 'Flutter', cat: 'Mobile', desc: "Google's UI toolkit for native mobile apps", color: '#02569B', bg: '#e0eaf6' },
  { name: 'Swift', cat: 'Mobile', desc: 'Native iOS development language', color: '#FA7343', bg: '#fef0e8' },
  { name: 'Kotlin', cat: 'Mobile', desc: 'Modern language for native Android apps', color: '#7F52FF', bg: '#eeebff' },
  { name: 'MongoDB', cat: 'Database', desc: 'Flexible NoSQL database for modern apps', color: '#47A248', bg: '#e8f5e9' },
  { name: 'PostgreSQL', cat: 'Database', desc: 'Advanced open-source relational database', color: '#336791', bg: '#e3ecf5' },
  { name: 'Redis', cat: 'Database', desc: 'In-memory data store for caching & queues', color: '#DC382D', bg: '#fce8e7' },
  { name: 'MySQL', cat: 'Database', desc: 'Widely-used open-source relational database', color: '#4479A1', bg: '#e3ecf5' },
  { name: 'AWS', cat: 'Cloud', desc: 'Industry-leading cloud platform by Amazon', color: '#FF9900', bg: '#fff4e0' },
  { name: 'Google Cloud', cat: 'Cloud', desc: "Google's cloud infrastructure platform", color: '#4285F4', bg: '#e8f0fe' },
  { name: 'Docker', cat: 'Cloud', desc: 'Container platform for consistent deployments', color: '#2496ED', bg: '#e4f1fd' },
  { name: 'Kubernetes', cat: 'Cloud', desc: 'Automated container orchestration at scale', color: '#326CE5', bg: '#e8edfb' },
];

export default function Technologies() {
  const [active, setActive] = useState('All');
  const heroBlur = useScrollBlur(300);

  const filtered = active === 'All' ? TECHS : TECHS.filter(t => t.cat === active);

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
          url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop') center/cover no-repeat
        `,
        filter: `blur(${heroBlur}px)`,
        transition: 'filter 0.1s ease-out',
      }}>
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <div className="badge" style={{ margin: '0 auto 18px' }}><span className="badge-dot" /> Our Stack</div>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 52px)', marginBottom: 16 }}>Technologies We Use</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 17, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            We choose the best tools for each job — modern, battle-tested, and built for scale.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Start Your Project <ArrowIcon /></Link>
            <Link to="/services" className="btn btn-outline">View Services</Link>
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <FadeInSection className="section section-alt">
        <div className="container">

          {/* Category tabs */}
          <div className="tech-filter-tabs">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: '8px 20px',
                borderRadius: 20,
                border: '1.5px solid',
                borderColor: active === cat ? 'var(--blue)' : 'var(--gray-200)',
                background: active === cat ? 'var(--blue)' : 'white',
                color: active === cat ? 'white' : 'var(--gray-500)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.18s',
                whiteSpace: 'nowrap',
              }}>{cat}</button>
            ))}
          </div>

          {/* Tech cards */}
          <div className="tech-grid">
            {filtered.map(({ name, desc, color, bg }) => (
              <div key={name} className="card" style={{ 
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                padding: '28px 20px',
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
                  width: 60, height: 60, borderRadius: 16,
                  background: bg, border: `2px solid ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 16,
                  color, letterSpacing: '-0.02em',
                  boxShadow: `0 4px 12px ${color}20`,
                }}>
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <h3 style={{ fontSize: 16, marginBottom: 8, fontWeight: 700 }}>{name}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* ── WHY OUR STACK ── */}
      <FadeInSection className="section">
        <div className="container">
          <div className="section-head">
            <h2>Why We Choose These Tools</h2>
            <p>Our decisions are guided by performance, community support, and long-term maintainability</p>
          </div>
          <div className="grid-3">
            {[
              { title: 'Battle-tested', desc: 'Every technology in our stack is proven in production at scale — no experimental tools in your critical path.' },
              { title: 'Developer-friendly', desc: 'We pick tools with great DX so our team moves fast, makes fewer mistakes, and ships higher quality code.' },
              { title: 'Future-proof', desc: 'We evaluate tools for ecosystem health, community momentum, and long-term vendor stability.' },
            ].map(({ title, desc }) => (
              <div key={title} className="card">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--blue)', marginBottom: 16 }} />
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.65 }}>{desc}</p>
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
              <h2>Not Sure Which Stack Is Right for You?</h2>
              <p>Our architects will recommend the best solution for your specific needs.</p>
            </div>
            <Link to="/contact" className="btn btn-white">Talk to an Expert →</Link>
          </div>
        </div>
      </FadeInSection>

      {/* ── MOBILE-ONLY STYLES ── */}
      <style>{`
        /* Filter tabs row */
        .tech-filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 44px;
        }

        /* Tech cards grid — desktop 4 cols */
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        /* ── TABLET (max 900px) ── */
        @media (max-width: 900px) {
          .tech-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }

        /* ── MOBILE (max 768px) ── */
        @media (max-width: 768px) {
          .tech-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }

          /* Filter tabs: allow horizontal scroll on very small screens */
          .tech-filter-tabs {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            justify-content: flex-start !important;
            padding-bottom: 8px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .tech-filter-tabs::-webkit-scrollbar {
            display: none;
          }

          /* Tighten card padding on mobile */
          .tech-grid .card {
            padding: 20px 14px !important;
          }
        }

        /* ── SMALL MOBILE (max 480px) ── */
        @media (max-width: 480px) {
          .tech-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
      `}</style>

    </div>
  );
}