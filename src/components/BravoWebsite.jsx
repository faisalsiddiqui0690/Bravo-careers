import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, ChevronDown, Star } from 'lucide-react';
import { getAnalytics, getReviews, IMAGE_BASE } from '../services/api';
import { services } from '../data/services';
import ukJourneyImage from '../assets/Twilight on Westminster Bridge.png';
import skilledWorkerImage from '../assets/bravo-skilled-worker.svg';
import founderSupportImage from '../assets/bravo-founder-support.svg';
import careerServicesImage from '../assets/bravo-career-services.svg';
import jobSearchImage from '../assets/bravo-skilled-worker.svg';
import cvGuidanceImage from '../assets/bravo-career-services.svg';
import founderIdeasImage from '../assets/bravo-founder-support.svg';
import visaNewsImage from '../assets/bravo-visa-news.svg';
import jobsNewsImage from '../assets/bravo-jobs-news.svg';
import founderNewsImage from '../assets/bravo-founder-news.svg';
import testimonialAvatar from '../assets/bravo-testimonial-avatar.svg';
import teamPhoto from '../assets/slider1.jpeg';

const faqs = [
  {
    question: 'Do you guarantee a job, visa or endorsement?',
    answer: 'No. Employers, endorsing bodies and the UK Home Office make their own decisions. We provide guidance and preparation, but cannot promise an outcome.',
  },
  {
    question: 'Can I speak with someone before paying?',
    answer: 'Yes. Start with a free 15-minute clarity call. We will listen to your situation, explain what support may help and tell you honestly if you can manage the next steps yourself.',
  },
  {
    question: 'Do I need to buy a package?',
    answer: 'No. You can choose one-off career support, a handbook or membership—or simply use the free guidance shared during your call.',
  },
  {
    question: 'Do you provide immigration or legal advice?',
    answer: 'Bravo Careers provides career, job-search and business-plan guidance. We are not a law firm and do not provide regulated UK immigration advice. Where needed, we will recommend speaking with an appropriately regulated adviser.',
  },
];

const blogArticles = [
  {
    category: 'Career planning',
    image: jobSearchImage,
    imageAlt: 'Illustrated route map for planning a UK job search',
    title: 'Build a focused UK job-search plan',
    description: 'Choose roles that fit your experience, check sponsorship requirements early and make each application purposeful.',
    link: '#services',
    linkLabel: 'Explore career support',
  },
  {
    category: 'CV & interviews',
    image: cvGuidanceImage,
    imageAlt: 'Illustration of a CV with highlighted experience',
    title: 'Make your experience easy to understand',
    description: 'Show the impact of your work with clear examples, relevant skills and a CV tailored to the role.',
    link: '#services',
    linkLabel: 'Get CV guidance',
  },
  {
    category: 'Founder support',
    image: founderIdeasImage,
    imageAlt: 'Illustration of a founder developing an idea',
    title: 'Test your business idea before you invest',
    description: 'Pressure-test the problem, customer need and growth potential before committing to a business plan.',
    link: '#services',
    linkLabel: 'Explore founder support',
  },
];

const officialUpdates = [
  {
    category: 'Skilled Worker route',
    image: visaNewsImage,
    imageAlt: 'Illustration of UK route guidance documents',
    title: 'Check the latest visa requirements',
    description: 'Review the official eligibility, salary and application guidance before making plans.',
    link: 'https://www.gov.uk/skilled-worker-visa',
  },
  {
    category: 'UK job search',
    image: jobsNewsImage,
    imageAlt: 'Illustration of job opportunities in London',
    title: 'Search current UK vacancies',
    description: 'Use the government job service to explore roles and prepare your next application.',
    link: 'https://www.gov.uk/find-a-job',
  },
  {
    category: 'Innovator Founder route',
    image: founderNewsImage,
    imageAlt: 'Illustration of a business plan and founder route',
    title: 'Read the official founder visa guidance',
    description: 'Check the current rules and endorsement information directly with GOV.UK.',
    link: 'https://www.gov.uk/innovator-founder-visa',
  },
];

const AutoScrollRail = ({ children, label }) => (
  <div className="bravo-rail-window" role="region" aria-label={label}>
    <div className="bravo-rail-track">
      <div className="bravo-rail-group">{children}</div>
      <div className="bravo-rail-group" aria-hidden="true" inert="">
        {children}
      </div>
    </div>
  </div>
);

function AnimatedMetric({ value, suffix = '', decimals = 0, label, showStars = false }) {
  const metricRef = useRef(null);
  const [count, setCount] = useState(0);
  const target = Number.isFinite(value) ? value : null;

  useEffect(() => {
    if (target === null) return undefined;

    const element = metricRef.current;
    if (!element) return undefined;

    let frameId;
    let observer;
    const animate = () => {
      const duration = 1400;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 4;
        setCount(target * easedProgress);
        if (progress < 1) frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return undefined;
    }

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        animate();
      }
    }, { threshold: 0.45 });
    observer.observe(element);

    return () => {
      observer?.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target]);

  return (
    <div ref={metricRef} className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-5 py-8 text-center shadow-sm shadow-slate-900/5">
      <span className="font-display text-5xl font-light tracking-tight text-[#08234f] sm:text-6xl">
        {target === null ? '—' : `${count.toFixed(decimals)}${suffix}`}
      </span>
      {showStars && target !== null && (
        <span className="mt-2 inline-flex items-center gap-1 text-amber-500" aria-label={`${target.toFixed(decimals)} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={15} fill="currentColor" strokeWidth={1.5} />
          ))}
        </span>
      )}
      <span className="mt-2 text-sm font-normal tracking-wide text-slate-600">{label}</span>
    </div>
  );
}

export default function BravoWebsite() {
  const [openFaq, setOpenFaq] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, error: '', success: '' });
  const [analytics, setAnalytics] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getAnalytics().then(setAnalytics);
    getReviews().then((data) => {
      if (Array.isArray(data)) {
        setReviews(data.filter((review) => review?.name && review?.comment));
      }
    });
  }, []);

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((current) => ({ ...current, [name]: value }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    setContactStatus({ loading: false, error: '', success: '' });

    const message = [
      'Hello Bravo Careers, I would like to get in touch.',
      '',
      `Name: ${contactForm.name.trim()}`,
      `Email: ${contactForm.email.trim()}`,
      `Phone: ${contactForm.phone.trim()}`,
      `Interested in: ${contactForm.service || 'General enquiry'}`,
      '',
      'Message:',
      contactForm.message.trim(),
    ].join('\n');
    const whatsappUrl = `https://wa.me/917559377727?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank');

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      setContactStatus({
        loading: false,
        error: '',
        success: 'WhatsApp opened with your message. Review it there and tap Send to submit your enquiry.',
      });
      return;
    }

    window.location.assign(whatsappUrl);
  };

  const ratings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0);
  const averageRating = ratings.length
    ? `${(ratings.reduce((total, rating) => total + rating, 0) / ratings.length).toFixed(1)}/5`
    : '—';

  return (
    <main className="bravo-site">
      <section className="bravo-hero" id="home">
        <div className="bravo-hero-art">
          <img src={ukJourneyImage} alt="" />
        </div>
        <div className="bravo-container bravo-hero-grid">
          <div className="bravo-hero-copy">
            <div className="bravo-eyebrow"><span /> A clearer route to your UK future</div>
            <h1>Make your next UK move <span>with confidence.</span></h1>
            <p className="bravo-hero-lede">Honest, practical support for sponsored job searches and ambitious founders. Start with a free call. Pay only when it makes sense for you.</p>
            <div className="bravo-hero-actions">
              <a href="#contact" className="bravo-button bravo-button-yellow">Ask about a free 15-min call <ArrowRight size={17} /></a>
              <a href="#services" className="bravo-text-link">Explore how we help <ArrowDown size={16} /></a>
            </div>
            <div className="bravo-trust-row">
              <span><Check size={15} /> Transparent prices</span>
              <span><Check size={15} /> No fake guarantees</span>
              <span><Check size={15} /> Honest advice first</span>
            </div>
          </div>

        </div>
        <div className="bravo-hero-bottom">
          <div className="bravo-container bravo-hero-bottom-inner">
            <span>YOUR CAREER. YOUR BUSINESS. YOUR NEXT CHAPTER.</span>
            <a href="#about">Get to know Bravo Careers <ArrowRight size={15} /></a>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" id="about">
        <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12 2xl:px-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-16 2xl:gap-24">
            <div className="flex flex-col lg:min-h-full">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">ABOUT BRAVO CAREERS</p>
              <h2 className="!text-4xl font-display !font-bold !leading-tight !tracking-tight !text-[#08234f] sm:!text-5xl">
                Honest guidance for your <span className="!text-amber-600">UK career.</span>
              </h2>
              <div className="relative mt-8 aspect-[1.55/1] min-h-[280px] flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-900/10 lg:aspect-[1.7/1] lg:min-h-0 lg:flex-none">
                <img
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src={teamPhoto}
                  alt="Professionals collaborating around a table"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071a39]/90 via-[#071a39]/45 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">Your next step, made clearer</p>
                  <p className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">Career plans built around you.</p>
                </div>
                <div className="absolute right-4 top-4 rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:right-5 sm:top-5">
                  <p className="font-display text-xl font-bold leading-none text-[#08234f]">6+ years</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">UK careers experience</p>
                </div>
              </div>
            </div>
            <div className="max-w-4xl text-base leading-8 text-slate-600">
              <p>
                With more than six years in UK careers and recruitment, Bravo Careers helps international students, graduates, professionals and founders build a realistic plan for life and work in the UK.
              </p>
              <p className="mt-4">
                Whether you are looking for UK sponsored jobs, making the most of your Graduate visa or exploring the Innovator Founder route, we explain the options and practical next steps in plain English. We also share Hinglish videos for our Indian community.
              </p>
              <p className="mt-4">
                Our career support can include finding and researching genuine opportunities, checking sponsor information against official sources, improving your UK CV and LinkedIn profile, preparing for interviews, and planning your job search during the Graduate visa period. For founders, we help you test your idea, organise your business plan and prepare your pitch before you invest.
              </p>
              <p className="mt-4">
                Bravo Careers was created after seeing talented people lose time and money to promises no one can guarantee. We offer a more honest alternative: clear guidance on what is realistic, what preparation takes and what to be careful about.
              </p>
              <p className="mt-4 font-semibold text-[#08234f]">
                No fake promises. No guaranteed-job claims. Just an honest conversation about what may be right for you.
              </p>
              <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-800 transition hover:gap-3 hover:text-amber-700">
                Tell us where you want to go <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="mt-14">
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">WHO WE ARE</p>
            <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="font-display text-3xl font-bold tracking-tight text-[#08234f]">6+ years</p>
              <h3 className="mt-2 text-base font-bold text-[#08234f]">UK careers experience</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Practical insight into the UK job market, recruitment and what employers look for.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="font-display text-3xl font-bold tracking-tight text-[#08234f]">UK-based</p>
              <h3 className="mt-2 text-base font-bold text-[#08234f]">Careers and recruitment team</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Support for international students, graduates and professionals from the UK and around the world.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="font-display text-3xl font-bold tracking-tight text-[#08234f]">Founder-minded</p>
              <h3 className="mt-2 text-base font-bold text-[#08234f]">Business planning support</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Our team includes startup founders and professionals with Fortune 500 experience and product development backgrounds.</p>
            </article>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24" id="services">
        <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12 2xl:px-16">
          <div className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">How we can help</p>
              <h2 className="!text-4xl font-bold !leading-tight !tracking-tight !text-[#08234f] sm:!text-5xl">
                Six services. <span className="!text-amber-600">One trusted partner.</span>
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                From sponsored job searches and UK career preparation to founder and route research, find practical support for your next step.
              </p>
            </div>
            <p className="max-w-lg text-sm leading-7 text-slate-600 lg:pb-1">
              Explore each service to see the support available. We will help you understand your options before you commit.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
            {services.map(({ number, slug, title, description, icon: Icon, points, image, imageAlt }) => (
              <article key={number} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-900/10">
                <Link to={`/services/${slug}`} className="relative block h-52 overflow-hidden bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-400 sm:h-60" aria-label={`Explore ${title}`}>
                  <img
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={image}
                    alt={imageAlt}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = ukJourneyImage;
                    }}
                  />
                  <span className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-[#08234f]/90 text-xs font-bold text-amber-300 shadow-lg">{number}</span>
                  <span className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-amber-300 text-[#08234f] shadow-lg">
                    <Icon size={21} strokeWidth={1.8} />
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
                  <h3 className="text-xl font-bold tracking-tight text-[#08234f]">{title}</h3>
                  <p className="mt-3 min-h-[4.5rem] text-sm leading-7 text-slate-600">{description}</p>
                  <ul className="mb-6 mt-5 grid gap-3">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className="mt-0.5 shrink-0 text-emerald-700" size={17} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/services/${slug}`} className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-blue-800 transition hover:gap-3 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4">
                    Explore this service <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bravo-testimonials bravo-section !py-20 sm:!py-24" id="testimonials">
        <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12 2xl:px-16">
          <div className="mb-9 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">CLIENT EXPERIENCES</p>
              <h2 className="max-w-3xl !text-4xl font-display !font-bold !leading-tight !tracking-tight !text-white sm:!text-5xl">
                Every journey is different. <span className="!text-amber-300">So is every story.</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Explore feedback shared by people who have worked with Bravo Careers. We keep client experiences in their own words.
            </p>
          </div>
          {reviews.length ? (
            <AutoScrollRail label="Client testimonials">
              {reviews.map((review, index) => {
                const rating = Math.min(5, Math.max(0, Math.round(Number(review.rating) || 0)));
                return (
                  <article className="bravo-testimonial-card group !min-h-[330px] !w-[min(82vw,410px)] !rounded-2xl !border-slate-200 !bg-white !p-7 !shadow-lg !shadow-slate-950/10 transition duration-300 hover:-translate-y-1 hover:!border-amber-300 hover:!shadow-xl" key={review.id || `${review.name}-${index}`}>
                    <div className="relative z-10 mb-4 h-[68px] w-[68px] overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200">
                      {review.image ? (
                        <img
                          className="h-full w-full object-cover"
                          src={review.image.startsWith('/uploads') ? `${IMAGE_BASE}${review.image}` : review.image}
                          alt={`${review.name}`}
                          onError={(event) => {
                            event.currentTarget.src = testimonialAvatar;
                            event.currentTarget.alt = '';
                          }}
                        />
                      ) : (
                        <img className="h-full w-full object-cover" src={testimonialAvatar} alt="" />
                      )}
                    </div>
                    <div className="text-sm tracking-[0.18em] text-amber-500" aria-label={`${rating} out of 5 stars`}>
                      {'★'.repeat(rating)}<span className="text-slate-200">{'★'.repeat(5 - rating)}</span>
                    </div>
                    <blockquote className="relative my-5 text-sm leading-7 text-slate-700">{review.comment}</blockquote>
                    <div className="mt-auto flex flex-col gap-1 border-t border-slate-100 pt-4">
                      <strong className="text-sm font-bold text-[#08234f]">{review.name}</strong>
                      {review.role && <span className="text-xs text-slate-500">{review.role}</span>}
                    </div>
                  </article>
                );
              })}
            </AutoScrollRail>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-10 text-center sm:px-10">
              <p className="text-lg font-semibold text-white">Client stories will appear here.</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-300">
                We share client feedback when it is available, so you can hear directly about people’s experiences with our support.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bravo-news bravo-section" id="news">
        <div className="bravo-container">
          <div className="bravo-section-heading">
            <div><p className="bravo-kicker">OFFICIAL SOURCES</p><h2>UK route updates <span>& resources.</span></h2></div>
            <p>Check current requirements and opportunities directly with official government services.</p>
          </div>
          <AutoScrollRail label="UK career and founder resources">
            {officialUpdates.map((update) => (
              <a className="bravo-story-card bravo-news-card" href={update.link} key={update.title} target="_blank" rel="noreferrer">
                <img className="bravo-story-image" src={update.image} alt={update.imageAlt} />
                <div className="bravo-story-copy">
                  <span className="bravo-story-category">{update.category}</span>
                  <h3>{update.title}</h3>
                  <p>{update.description}</p>
                  <span className="bravo-story-link">Read official guidance <ArrowRight size={15} /></span>
                </div>
              </a>
            ))}
          </AutoScrollRail>
        </div>
      </section>

      <section className="bravo-process bravo-section">
        <div className="bravo-container bravo-process-grid">
          <div className="bravo-process-intro">
            <p className="bravo-kicker">A SIMPLE PLACE TO START</p>
            <h2>Clarity first.<br /><span>Then a plan.</span></h2>
            <p>Every journey is different. We begin by understanding yours, then talk through the options openly—before you pay for anything.</p>
            <a href="#contact" className="bravo-button bravo-button-navy">Start with a free call <ArrowRight size={17} /></a>
          </div>
          <div className="bravo-steps">
            {[
              ['01', 'Tell us your situation', 'Share what you are working towards and where you feel stuck.'],
              ['02', 'Get an honest assessment', 'We explain what may fit, what needs work and whether you need us at all.'],
              ['03', 'Choose your next step', 'Take a guide, book a session or leave with a clearer direction—no pressure.'],
            ].map(([number, title, description]) => (
              <div className="bravo-step" key={number}>
                <span className="bravo-step-number">{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <ArrowRight className="bravo-step-arrow" size={18} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bravo-editorial bravo-section" id="insights">
        <div className="bravo-container">
          <div className="bravo-section-heading">
            <div><p className="bravo-kicker">PRACTICAL GUIDANCE</p><h2>Ideas for your <span>next step.</span></h2></div>
            <p>Short, useful reads for your UK career or founder journey.</p>
          </div>
          <AutoScrollRail label="Career and founder articles">
            {blogArticles.map((article) => (
              <a className="bravo-story-card" href={article.link} key={article.title}>
                <img className="bravo-story-image" src={article.image} alt={article.imageAlt} />
                <div className="bravo-story-copy">
                  <span className="bravo-story-category">{article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <span className="bravo-story-link">{article.linkLabel} <ArrowRight size={15} /></span>
                </div>
              </a>
            ))}
          </AutoScrollRail>
        </div>
      </section>

      <section className="bravo-faq bravo-section" id="faqs">
        <div className="bravo-container bravo-faq-grid">
          <div className="bravo-faq-intro"><p className="bravo-kicker">GOOD TO KNOW</p><h2>Questions, <span>answered.</span></h2><p>Still wondering if we are the right fit? Start with a no-pressure conversation.</p><a href="#contact" className="bravo-inline-link">Ask us directly <ArrowRight size={16} /></a></div>
          <div className="bravo-faq-list">
            {faqs.map(({ question, answer }, index) => (
              <article className={`bravo-faq-item ${openFaq === index ? 'is-open' : ''}`} key={question}>
                <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{question}</span><ChevronDown size={19} />
                </button>
                {openFaq === index && <p>{answer}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-20 sm:px-8 sm:pb-24" id="contact">
        <div className="mx-auto grid max-w-[1680px] gap-10 rounded-3xl bg-[#f4f6fa] p-6 sm:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:p-14 2xl:px-20">
          <div className="flex flex-col items-start">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">YOUR NEXT STEP STARTS HERE</p>
            <h2 className="!text-4xl font-display !font-bold !leading-tight !tracking-tight !text-[#08234f] sm:!text-5xl">
              Let’s make a plan that <span className="!text-amber-600">works for you.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              Tell us what you are working towards. Complete the form and continue to WhatsApp, where your details and message will be ready to send.
            </p>
            <p className="mt-4 text-xs leading-6 text-slate-500">WhatsApp: +91 75593 77727</p>
          </div>

          <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" onSubmit={handleContactSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold text-slate-700">
                Full name
                <input
                  className="min-h-12 rounded-lg border border-slate-300 px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="Your name"
                  maxLength="255"
                  required
                />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-700">
                Email address
                <input
                  className="min-h-12 rounded-lg border border-slate-300 px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="you@example.com"
                  maxLength="255"
                  required
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold text-slate-700">
                Phone number
                <input
                  className="min-h-12 rounded-lg border border-slate-300 px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  placeholder="Your phone number"
                  maxLength="20"
                  required
                />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-700">
                I’m interested in
                <select
                  className="min-h-12 rounded-lg border border-slate-300 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  name="service"
                  value={contactForm.service}
                  onChange={handleContactChange}
                >
                  <option value="">Select a topic</option>
                  {services.map((service) => <option value={service.title} key={service.slug}>{service.title}</option>)}
                  <option value="Free clarity call">Free clarity call</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-xs font-semibold text-slate-700">
              How can we help?
              <textarea
                className="min-h-32 resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm font-normal leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                placeholder="Tell us a little about your goals or questions..."
                minLength="10"
                maxLength="5000"
                required
              />
            </label>
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#08245b] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-60 sm:justify-self-start"
              type="submit"
              disabled={contactStatus.loading}
            >
              Continue to WhatsApp {!contactStatus.loading && <ArrowRight size={17} />}
            </button>
            <p className="text-xs leading-6 text-slate-500">
              WhatsApp will open with your details filled in. Tap Send in WhatsApp to deliver the enquiry. We do not guarantee jobs, endorsements or visa outcomes.
            </p>
            {contactStatus.error && <p className="text-sm text-red-700" role="alert">{contactStatus.error}</p>}
            {contactStatus.success && <p className="text-sm font-medium text-emerald-700" role="status">{contactStatus.success}</p>}
          </form>
        </div>
      </section>

      <section className="bg-slate-100 py-16 sm:py-20" aria-label="Bravo Careers at a glance">
        <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12 2xl:px-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">A track record built on trust</p>
            <h2 className="!text-3xl font-display !font-medium !tracking-tight !text-[#08234f] sm:!text-4xl">Support you can measure.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <AnimatedMetric value={Number.parseFloat(analytics?.clientsCount)} suffix={String(analytics?.clientsCount || '').replace(/^[\d,.]+/, '')} label="Clients supported" />
            <AnimatedMetric value={6} suffix="+" label="Years of experience" />
            <AnimatedMetric value={ratings.length ? Number(averageRating.split('/')[0]) : null} suffix={ratings.length ? '/5' : ''} decimals={1} label="Average client rating" showStars={ratings.length > 0} />
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-5 pb-12 sm:px-8 sm:pb-16">
        <div className="mx-auto max-w-[1680px] rounded-2xl border border-slate-200 bg-white px-6 py-6 sm:px-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#08234f]">Important information</h2>
          <div className="mt-3 grid gap-3 text-xs leading-6 text-slate-600 md:grid-cols-2">
            <p>Bravo Careers provides career, recruitment and business-planning support. We do not provide regulated UK immigration advice. For advice about your circumstances, consult an appropriately regulated adviser and check GOV.UK.</p>
            <p>Employers, endorsing bodies and the UK Home Office make their own decisions. We cannot guarantee a job, endorsement, sponsor licence or visa outcome. Government and other third-party fees are separate.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
