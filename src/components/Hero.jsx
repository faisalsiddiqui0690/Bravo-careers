import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { getAnalytics } from '../services/api';
import logo from '../assets/nplogo.png';

const Icon = {
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
      <path d="M3 7a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59l1.41 1.41A2 2 0 0 0 12.41 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 md:w-3.5 md:h-3.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

const DEFAULT_ANALYTICS = {
  projectsCount: '150+', clientsCount: '50+', statesCount: '15+', clientRate: '98%',
  projectsChange: '+12%', clientsChange: '+8%', statesChange: '+3',
  webPct: 72, appPct: 55, crmPct: 38,
  monthlyData: '30,50,38,70,55,85,62,90,72,95,80,100',
  activityTitle: 'E-Commerce Platform launched',
  activitySub: 'Fashion Retail Co. · just now',
};

const Hero = () => {
  const [textRef, textVisible] = useScrollAnimation();
  const [visualRef, visualVisible] = useScrollAnimation();
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);

  useEffect(() => {
    getAnalytics().then(data => {
      if (data) setAnalytics(data);
    }).catch(() => {});
  }, []);

  const monthlyBars = analytics.monthlyData
    .split(',')
    .slice(0, 12)
    .map(v => Math.min(100, Math.max(0, Number(v.trim()) || 0)));

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 md:pt-28 pb-6 md:pb-12 bg-gradient-to-br from-transparent to-primary/10" id="home">
      <div className="container relative z-[1]">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className={`transition-all duration-700 md:duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`} ref={textRef}>
            <h1 className="text-[28px] md:text-[42px] font-semibold leading-[1.2] mb-5 bg-gradient-to-br from-text to-text-secondary bg-clip-text text-transparent">Complete IT Solutions That Scale With Your Business</h1>
            <p className="text-base md:text-lg text-text-secondary mb-6 leading-relaxed">From web development to CRM implementation—we deliver end-to-end IT services that drive digital transformation</p>
            <div className="flex gap-3 md:gap-5 mt-6 md:mt-10">
              <Link to="/contact" className="btn-primary flex-1 md:flex-none">Get Started</Link>
              <Link to="/projects" className="btn-secondary flex-1 md:flex-none">Portfolio</Link>
            </div>
          </div>
          <div
            ref={visualRef}
            className={`relative h-[380px] md:h-[440px] rounded-2xl overflow-hidden transition-all duration-700 md:duration-1000 delay-200 gpu-accelerated ${visualVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--subtle)',
              boxShadow: '0 24px 64px rgba(0,82,204,0.12)',
            }}
          >
            {/* Glow blobs — use primary/accent colours */}
            <div className="absolute top-[-60px] right-[-40px] w-[220px] h-[220px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,184,212,0.12) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-40px] left-[-30px] w-[180px] h-[180px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,82,204,0.10) 0%, transparent 70%)' }} />

            <div className="absolute inset-0 p-3 md:p-4 flex flex-col gap-2 md:gap-2.5">

              {/* Header bar */}
              <div className="flex items-center justify-between px-3 py-1.5 md:py-2 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--subtle)' }}>
                <div className="flex items-center gap-2">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-6 md:h-8 w-auto brightness-0 dark:invert transition-all duration-300"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-semibold text-emerald-500">Live</span>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Projects', value: analytics.projectsCount, icon: Icon.folder, color: 'text-blue-500' },
                  { label: 'Clients',  value: analytics.clientsCount,  icon: Icon.users,  color: 'text-purple-500' },
                  { label: 'States',   value: analytics.statesCount,   icon: Icon.mapPin, color: 'text-teal-500' },
                ].map((k, i) => (
                  <div key={i} className="rounded-xl p-1.5 md:p-2.5 flex flex-col gap-1 md:gap-1.5" style={{ background: 'var(--bg)', border: '1px solid var(--subtle)' }}>
                    {/* Icon and Count on same line */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className={`${k.color} opacity-80`}>{k.icon}</span>
                      <span className="text-sm md:text-lg font-extrabold leading-none" style={{ color: 'var(--text)' }}>{k.value}</span>
                    </div>
                    {/* Label below */}
                    <span className="text-[8px] md:text-[9px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{k.label}</span>
                  </div>
                ))}
              </div>

              {/* Chart + right column */}
              <div className="flex gap-2 flex-1 min-h-0">

                {/* Bar chart */}
                <div className="flex-1 rounded-xl p-2 md:p-3 flex flex-col gap-2" style={{ background: 'var(--bg)', border: '1px solid var(--subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Revenue Growth</span>
                    <span className="text-[9px] font-bold" style={{ color: 'var(--accent)' }}>2025</span>
                  </div>
                  <div className="flex items-end gap-1 flex-1">
                    {monthlyBars.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{
                        height: `${h}%`,
                        background: i >= 10
                          ? 'linear-gradient(to top, #0052CC, #00B8D4)'
                          : `rgba(0,82,204,${0.12 + (i / 12) * 0.3})`,
                        transition: `height 1s ease ${i * 50}ms`,
                      }} />
                    ))}
                  </div>
                  <div className="flex">
                    {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
                      <span key={i} className="text-[7px] flex-1 text-center" style={{ color: 'var(--text-tertiary)' }}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="w-[90px] flex flex-col gap-1 md:gap-1.5">
                  {/* Donut */}
                  <div className="rounded-xl p-1.5 md:p-2 flex flex-col items-center gap-0.5" style={{ background: 'var(--bg)', border: '1px solid var(--subtle)' }}>
                    <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Success</span>
                    <svg viewBox="0 0 36 36" className="w-10 h-10 md:w-12 md:h-12">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="var(--subtle)" strokeWidth="4"/>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="url(#heroGrad)" strokeWidth="4"
                        strokeDasharray="79 88" strokeDashoffset="22" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0052CC"/>
                          <stop offset="100%" stopColor="#00B8D4"/>
                        </linearGradient>
                      </defs>
                      <text x="18" y="21" textAnchor="middle" fontSize="7" fontWeight="bold" fill="var(--text)">{analytics.clientRate}</text>
                    </svg>
                    <span className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>Client Rate</span>
                  </div>

                  {/* Progress bars */}
                  {[
                    { label: 'Web', pct: analytics.webPct, color: '#0052CC' },
                    { label: 'App', pct: analytics.appPct, color: '#00B8D4' },
                    { label: 'CRM', pct: analytics.crmPct, color: '#7c3aed' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-lg px-2 py-0.5 md:py-1" style={{ background: 'var(--bg)', border: '1px solid var(--subtle)' }}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[8px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                        <span className="text-[8px] font-bold" style={{ color: 'var(--text)' }}>{s.pct}%</span>
                      </div>
                      <div className="h-0.5 md:h-1 rounded-full" style={{ background: 'var(--subtle)' }}>
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="rounded-xl px-3 py-1 md:py-2 flex items-center gap-2.5" style={{ background: 'var(--bg)', border: '1px solid var(--subtle)' }}>
                <div className="flex -space-x-1.5 flex-shrink-0">
                  {['#0052CC','#00B8D4','#7c3aed','#10b981'].map((c, i) => (
                    <div key={i} className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex-shrink-0" style={{ background: c, borderColor: 'var(--surface)' }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold truncate" style={{ color: 'var(--text)' }}>{analytics.activityTitle}</p>
                  <p className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>{analytics.activitySub}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                  {Icon.check}
                  <span>Done</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className={`mt-6 md:mt-10 -mx-4 md:-mx-8 p-6 md:p-10 rounded-3xl transition-all duration-1000 border border-subtle relative overflow-hidden bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`} ref={aboutRef}>
          <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-radial-accent/5 blur-[40px] pointer-events-none"></div>
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-[28px] md:text-[36px] font-semibold mb-5 md:mb-6 leading-tight tracking-tight text-text">About NP Quantum Tech</h2>
            <div className="text-base md:text-lg text-text-secondary max-w-[1100px] mx-auto">
              <p>NP Quantum Tech is an emerging e-commerce and technology company based in Chhatrapati Sambhajinagar (formerly Aurangabad). We focus on online shopping, multi-seller marketplaces, software products, logistics, and digital platforms.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-[1.2fr,1fr] gap-10 md:gap-16 items-start text-left">
            <div className="flex flex-col gap-6">
              <h3 className="text-lg md:text-xl font-bold text-primary flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">Company Overview</h3>
              <ul className="list-none flex flex-col gap-4">
                <li className="text-[15px] md:text-[17px] text-text-secondary flex gap-3"><span className="font-bold text-text min-w-[120px]">Founded:</span> Around 2017</li>
                <li className="text-[15px] md:text-[17px] text-text-secondary flex gap-3"><span className="font-bold text-text min-w-[120px]">Headquarters:</span> STPI, Chikalthana, Aurangabad</li>
                <li className="text-[15px] md:text-[17px] text-text-secondary flex gap-3"><span className="font-bold text-text min-w-[120px]">Team Size:</span> 100–500 employees with growing technology and operations teams</li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-lg md:text-xl font-bold text-primary flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">Our Focus Areas</h3>
              <div className="flex flex-wrap gap-3">
                {["E-commerce marketplace", "AI-based platforms", "Logistics & supply chain", "Software development", "Digital services"].map((area) => (
                  <span key={area} className="px-4 md:px-5 py-2 md:py-2.5 bg-surface border border-border rounded-full text-sm md:text-base text-text-secondary font-medium transition-all hover:bg-primary-light hover:text-primary hover:border-primary hover:-translate-y-0.5">{area}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Hero;
