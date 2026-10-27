import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Briefcase, Building2, Globe2, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { getServices, resolveImageUrl } from '../services/api';
import { services as fallbackServices } from '../data/services';
import ukJourneyImage from '../assets/Twilight on Westminster Bridge.png';

export default function BrandedServiceDetailPage() {
  const { slug } = useParams();
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(!fallbackServices.some((item) => item.slug === slug));

  useEffect(() => {
    let active = true;
    getServices().then((data) => {
      if (!active) return;
      if (Array.isArray(data)) {
        const iconMap = { Briefcase, Building2, Globe2, GraduationCap, ShieldCheck, Sparkles };
        const dynamicServices = data.map((item, index) => ({
          ...item,
          number: String(index + 1).padStart(2, '0'),
          icon: iconMap[item.icon] || Briefcase,
          imageAlt: item.imageAlt || item.title,
          image: resolveImageUrl(item.image || '') || ukJourneyImage,
          points: Array.isArray(item.points) ? item.points : [],
          outcomes: Array.isArray(item.outcomes) ? item.outcomes : [],
        }));
        setServices(dynamicServices);
      }
      setLoading(false);
    }).catch(() => {
      if (active) {
        setServices(fallbackServices);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const service = services.find((item) => item.slug === slug);

  if (!service && loading) return <div className="min-h-[60vh] bg-white" />;
  if (!service) return <Navigate to="/" replace />;

  const Icon = service.icon;

  return (
    <main className="bg-white pb-20">
      <section className="relative isolate overflow-hidden bg-[#071a39] text-white">
        <img src={service.image} alt={service.imageAlt} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071a39] via-[#071a39]/90 to-[#071a39]/45" />
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Link to="/#services" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-amber-300">
            <ArrowLeft size={16} /> All services
          </Link>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              <Icon size={15} /> Service {service.number}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{service.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{service.detailIntro}</p>
            <Link to="/#contact" className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-lg bg-amber-300 px-6 py-3 text-sm font-bold text-[#071a39] shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-200">
              Talk to us about this <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">How we can help</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#08234f] sm:text-4xl">A practical plan, built around you.</h2>
          <p className="mt-6 text-base leading-8 text-slate-600">{service.detailDescription}</p>
          <ul className="mt-8 grid gap-4">
            {service.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <Check className="mt-0.5 shrink-0 text-emerald-700" size={18} />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-[#08234f]"><Icon size={23} /></div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#08234f]">Clear guidance. No pressure.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">Start with a conversation about your goals. We will explain the support available and help you decide whether it is right for you.</p>
          <Link to="/#contact" className="mt-7 inline-flex items-center gap-2 font-bold text-blue-800 transition hover:gap-3 hover:text-amber-700">
            Ask about a free 15-minute call <ArrowRight size={16} />
          </Link>
          <p className="mt-7 border-t border-slate-200 pt-5 text-xs leading-6 text-slate-500">
            Bravo Careers provides career, job-search and business-plan guidance. We are not a law firm and do not provide regulated UK immigration advice. Outcomes are not guaranteed.
          </p>
        </aside>
      </section>
    </main>
  );
}
