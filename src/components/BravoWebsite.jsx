import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, ChevronDown } from 'lucide-react';
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

function AnimatedMetric({ value, suffix = '', decimals = 0, label }) {
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
      <strong className="font-display text-5xl font-bold tracking-tight text-[#08234f] sm:text-6xl">
        {target === null ? '—' : `${count.toFixed(decimals)}${suffix}`}
      </strong>
      <span className="mt-3 text-sm font-semibold tracking-wide text-slate-600">{label}</span>
    </div>
  );
}

export default function BravoWebsite() {
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterStatus, setNewsletterStatus] = useState('');
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

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterStatus('Newsletter sign-up is not connected yet. Follow @bravocareers for updates while we set it up.');
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

      <section className="bravo-intro bravo-section" id="about">
        <div className="bravo-container bravo-intro-grid">
          <div>
            <p className="bravo-kicker">ABOUT BRAVO CAREERS</p>
            <h2>Good decisions start with <span>honest guidance.</span></h2>
          </div>
          <div className="bravo-intro-copy">
            <p>Moving your career or business forward in the UK can feel complicated. Bravo Careers helps you understand your options, focus on the steps that matter and move ahead with a plan that fits your circumstances.</p>
            <p>We believe in clear conversations, transparent prices and support that meets you where you are—without pressure or promises no one can make.</p>
            <a href="#contact" className="bravo-inline-link">Tell us where you want to go <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24" id="services">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">How we can help</p>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-[#08234f] sm:text-5xl">
                Three routes. <span className="text-amber-600">One trusted partner.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Our expertise spans UK career planning, founder readiness and practical one-to-one support—so you can choose a route that fits your next step.
              </p>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600">
              Explore each service to see what is included. We will help you understand your options before you commit.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map(({ number, slug, title, description, icon: Icon, points, image, imageAlt }) => (
              <article key={number} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-slate-900/10">
                <Link to={`/services/${slug}`} className="relative block h-56 overflow-hidden bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-400" aria-label={`Explore ${title}`}>
                  <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={image} alt={imageAlt} loading="lazy" />
                  <span className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-[#08234f]/90 text-xs font-bold text-amber-300 shadow-lg">{number}</span>
                  <span className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-amber-300 text-[#08234f] shadow-lg">
                    <Icon size={21} strokeWidth={1.8} />
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
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

      <section className="bravo-testimonials bravo-section" id="testimonials">
        <div className="bravo-container">
          <div className="bravo-section-heading">
            <div><p className="bravo-kicker">CLIENT EXPERIENCES</p><h2>Support that starts <span>with you.</span></h2></div>
            <p>Read feedback shared by people who have worked with Bravo Careers.</p>
          </div>
          {reviews.length ? (
            <AutoScrollRail label="Client testimonials">
              {reviews.map((review, index) => {
                const rating = Math.min(5, Math.max(0, Math.round(Number(review.rating) || 0)));
                return (
                  <article className="bravo-testimonial-card" key={review.id || `${review.name}-${index}`}>
                    <div className="bravo-testimonial-visual">
                      {review.image ? (
                        <img
                          src={review.image.startsWith('/uploads') ? `${IMAGE_BASE}${review.image}` : review.image}
                          alt={`${review.name}`}
                          onError={(event) => {
                            event.currentTarget.src = testimonialAvatar;
                            event.currentTarget.alt = '';
                          }}
                        />
                      ) : (
                        <img src={testimonialAvatar} alt="" />
                      )}
                    </div>
                    <div className="bravo-testimonial-stars" aria-label={`${rating} out of 5 stars`}>
                      {'★'.repeat(rating)}<span>{'★'.repeat(5 - rating)}</span>
                    </div>
                    <blockquote>{review.comment}</blockquote>
                    <div className="bravo-testimonial-author">
                      <strong>{review.name}</strong>
                      {review.role && <span>{review.role}</span>}
                    </div>
                  </article>
                );
              })}
            </AutoScrollRail>
          ) : (
            <p className="bravo-empty-testimonials">Client testimonials will appear here as soon as they are available.</p>
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

      <section className="bravo-newsletter-section">
        <div className="bravo-container bravo-newsletter-card">
          <div className="bravo-newsletter-copy">
            <p className="bravo-kicker">THE BRAVO CAREERS NEWSLETTER</p>
            <h2>Useful updates for<br /><span>your next UK step.</span></h2>
            <p>Get practical career guidance, resource announcements and founder support updates—straight to your inbox.</p>
          </div>
          <form className="bravo-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <label htmlFor="bravo-newsletter-email">Your email address</label>
            <div className="bravo-newsletter-input-row">
              <input id="bravo-newsletter-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              <button type="submit">Join the newsletter <ArrowRight size={16} /></button>
            </div>
            <p className="bravo-newsletter-privacy">No spam. Just useful updates. You can unsubscribe at any time.</p>
            <p className="bravo-newsletter-status" aria-live="polite">{newsletterStatus}</p>
          </form>
        </div>
      </section>

      <section className="bravo-contact-section" id="contact">
        <div className="bravo-container bravo-contact-card">
          <div><p className="bravo-kicker">YOUR NEXT STEP STARTS HERE</p><h2>Ask about a free<br /><span>15-minute clarity call.</span></h2><p>Honest answers first. Payment only if it makes sense for you.</p></div>
          <div className="bravo-contact-actions">
            <a className="bravo-button bravo-button-navy" href="https://www.instagram.com/bravocareers/" target="_blank" rel="noreferrer">Connect on Instagram <ArrowRight size={17} /></a>
            <span>Send us a message to arrange a call, or follow <strong>@bravocareers</strong> for practical guidance.</span>
          </div>
        </div>
      </section>

      <section className="bravo-disclaimer">
        <div className="bravo-container">
          <h2>Important information</h2>
          <p>Bravo Careers provides career, job-search and business-plan guidance. We are not a law firm and do not give regulated UK immigration advice. Where immigration advice or a visa application is needed, we refer you to an appropriately regulated adviser.</p>
          <p>No job offer, endorsement, visa or other outcome can be guaranteed. Decisions are made by employers, endorsing bodies and the UK Home Office.</p>
          <p>Prices are in GBP and include payment processing. Government fees, the Immigration Health Surcharge, endorsement fees and other third-party costs are not included.</p>
        </div>
      </section>

      <section className="bg-slate-100 py-16 sm:py-20" aria-label="Bravo Careers at a glance">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">A track record built on trust</p>
            <h2 className="text-3xl font-bold tracking-tight text-[#08234f] sm:text-4xl">Support you can measure.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <AnimatedMetric value={Number.parseFloat(analytics?.clientsCount)} suffix={String(analytics?.clientsCount || '').replace(/^[\d,.]+/, '')} label="Clients supported" />
            <AnimatedMetric value={5} suffix="+" label="Years of experience" />
            <AnimatedMetric value={ratings.length ? Number(averageRating.split('/')[0]) : null} suffix={ratings.length ? '/5' : ''} decimals={1} label="Average client rating" />
          </div>
        </div>
      </section>
    </main>
  );
}
