import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import bravoCareersLogo from '../assets/bravo-careers-global-travel-badge.png';

export default function Footer() {
  return (
    <footer className="bg-[#041638] text-white">
      <div className="mx-auto max-w-[1680px] px-5 pb-5 pt-14 sm:px-8 sm:pt-16 lg:px-12 2xl:px-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,.8fr)_minmax(0,1fr)] lg:gap-16 lg:pb-12">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
              <img className="h-16 w-16 rounded-full object-contain sm:h-[72px] sm:w-[72px]" src={bravoCareersLogo} alt="Bravo Careers — Trusted Guidance. Global Possibilities." />
              <span className="font-display text-xl font-bold tracking-tight text-white">Bravo Careers</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              Clear, practical support for your UK career and founder journey. Honest guidance, without promises no one can make.
            </p>
            <a href="/#contact" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-300 px-4 py-3 text-xs font-bold text-[#061c48] transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200/50">
              Talk to our team <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Explore</h2>
            <a className="text-sm text-slate-300 transition hover:text-white" href="/#about">About us</a>
            <a className="text-sm text-slate-300 transition hover:text-white" href="/#services">Services</a>
            <Link className="text-sm text-slate-300 transition hover:text-white" to="/resources/free-resources">Free resources</Link>
            <Link className="text-sm text-slate-300 transition hover:text-white" to="/resources/ebooks">E-Books</Link>
            <a className="text-sm text-slate-300 transition hover:text-white" href="/#testimonials">Client experiences</a>
            <a className="text-sm text-slate-300 transition hover:text-white" href="/#faqs">FAQs</a>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Connect</h2>
            <a className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white" href="https://www.linkedin.com/in/bravo-careers-1b9218446?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
            <a className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white" href="https://www.instagram.com/bravo_careers?psln=MXRubXR2NTJtMWV3&utm_source=qr" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a>
            <a className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white" href="https://www.facebook.com/share/1KiyqotYhU/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /></a>
            <a className="mt-1 text-sm text-slate-300 transition hover:text-white" href="/#contact">Contact us</a>
            <a className="text-sm text-slate-300 transition hover:text-white" href="https://wa.me/917559377727" target="_blank" rel="noreferrer">WhatsApp: +91 75593 77727</a>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} Bravo Careers. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="text-xs text-slate-400 transition hover:text-white" to="/legal/privacy-policy">Privacy policy</Link>
            <Link className="text-xs text-slate-400 transition hover:text-white" to="/legal/terms-of-service">Terms of service</Link>
            <span className="text-xs font-medium text-amber-200">Guidance, not guarantees.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
