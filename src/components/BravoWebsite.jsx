import { useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Compass, FileText, Globe2, ShieldCheck, Sparkles } from 'lucide-react';

const services = [
  {
    number: '01',
    title: 'UK Skilled Worker guidance',
    description: 'Build a practical job-search plan, understand sponsorship requirements and prepare a stronger application.',
    icon: Globe2,
    points: ['Sponsor-aware job search', 'UK CV and interview guidance', 'Salary and role checks'],
  },
  {
    number: '02',
    title: 'Innovator Founder support',
    description: 'Get structured help to assess your idea, understand endorsement expectations and prepare your business plan.',
    icon: Sparkles,
    points: ['Business-plan readiness review', 'Endorsement criteria guidance', 'Founder strategy sessions'],
  },
  {
    number: '03',
    title: 'Career services',
    description: 'Present your experience clearly and take your next steps with focused, one-to-one career support.',
    icon: FileText,
    points: ['CV review and rewrite', 'LinkedIn profile feedback', 'Personal job-search strategy'],
  },
];

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

const Price = ({ children, detail }) => (
  <span className="bravo-price">
    <strong>{children}</strong>
    {detail && <small>{detail}</small>}
  </span>
);

export default function BravoWebsite() {
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterStatus('Newsletter sign-up is not connected yet. Follow @bravocareers for updates while we set it up.');
  };

  return (
    <main className="bravo-site">
      <section className="bravo-hero" id="home">
        <div className="bravo-hero-orb" aria-hidden="true" />
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

          <div className="bravo-hero-card" aria-label="A preview of Bravo Careers guidance">
            <div className="bravo-card-topline">
              <div className="bravo-card-mark">B<span>C</span></div>
              <div><small>YOUR UK JOURNEY</small><strong>One clear step at a time.</strong></div>
              <span className="bravo-card-status"><i /> GUIDE</span>
            </div>
            <div className="bravo-route-visual">
              <div className="bravo-route-line" />
              <div className="bravo-route-step bravo-route-step-one"><span>01</span><div><small>START WITH</small><strong>Your situation</strong></div></div>
              <div className="bravo-route-step bravo-route-step-two"><span>02</span><div><small>FIND YOUR</small><strong>Best-fit route</strong></div></div>
              <div className="bravo-route-step bravo-route-step-three"><span>03</span><div><small>MAKE A</small><strong>Practical plan</strong></div></div>
              <div className="bravo-route-compass"><Compass size={27} strokeWidth={1.7} /></div>
            </div>
            <div className="bravo-card-foot">
              <ShieldCheck size={17} />
              <span>Guidance that is clear, considered and built around you.</span>
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
            <p className="bravo-kicker">A PARTNER FOR THE JOURNEY</p>
            <h2>Good decisions start with <span>honest guidance.</span></h2>
          </div>
          <div className="bravo-intro-copy">
            <p>Moving your career or business forward in the UK can feel complicated. Bravo Careers helps you understand your options, focus on the steps that matter and move ahead with a plan that fits your circumstances.</p>
            <p>We believe in clear conversations, transparent prices and support that meets you where you are—without pressure or promises no one can make.</p>
            <a href="#contact" className="bravo-inline-link">Tell us where you want to go <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="bravo-services bravo-section" id="services">
        <div className="bravo-container">
          <div className="bravo-section-heading">
            <div><p className="bravo-kicker">HOW WE CAN HELP</p><h2>Three routes. <span>One trusted partner.</span></h2></div>
            <p>Choose the support that fits your goals today. We will help you understand the next step before you commit.</p>
          </div>
          <div className="bravo-service-grid">
            {services.map(({ number, title, description, icon: Icon, points }) => (
              <article className="bravo-service-card" key={number}>
                <div className="bravo-service-card-top"><span>{number}</span><Icon size={22} strokeWidth={1.8} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul>{points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul>
                <a href="#pricing" className="bravo-inline-link">See related support <ArrowRight size={15} /></a>
              </article>
            ))}
          </div>
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

      <section className="bravo-pricing bravo-section" id="pricing">
        <div className="bravo-container">
          <div className="bravo-section-heading bravo-pricing-heading">
            <div><p className="bravo-kicker">SERVICES & PRICING GUIDE · 2026</p><h2>Clear prices. <span>No surprises.</span></h2></div>
            <p>All prices are in GBP. Begin with a free 15-minute call before deciding what is right for you.</p>
          </div>

          <div className="bravo-free-call">
            <div><span className="bravo-free-label">FREE · NO OBLIGATION</span><h3>15-minute clarity call</h3><p>Tell us your situation. We will honestly explain what you need—and whether you need us at all.</p></div>
            <a href="#contact" className="bravo-button bravo-button-yellow">Book a call <ArrowRight size={16} /></a>
          </div>

          <div className="bravo-price-section">
            <div className="bravo-price-title"><span>01</span><h3>Bravo Pass</h3><p>Membership for your UK sponsored job search</p></div>
            <article className="bravo-pass-card">
              <div className="bravo-pass-copy">
                <div className="bravo-plan-heading"><h4>Bravo Pass</h4><span>MOST POPULAR</span></div>
                <ul>
                  <li><Check size={15} />Jobs from sponsor-licensed UK employers, curated every week</li>
                  <li><Check size={15} />Each job checked against the Skilled Worker salary rule</li>
                  <li><Check size={15} />Job alerts on WhatsApp</li>
                  <li><Check size={15} />Recruiter scripts, cold emails and interview answer library</li>
                </ul>
              </div>
              <Price detail="per month">£5.99</Price>
              <div className="bravo-year-price"><strong>£49</strong><span>per year · save 32%</span></div>
            </article>
          </div>

          <div className="bravo-price-section">
            <div className="bravo-price-title"><span>02</span><h3>Handbooks</h3><p>Instant PDF download</p></div>
            <div className="bravo-handbook-grid">
              <article className="bravo-handbook-card"><div><h4>UK Sponsored Job Handbook</h4><p>The 18-month plan, salary rules, sponsor lists, CV and recruiter scripts.</p></div><Price>£9.99</Price></article>
              <article className="bravo-handbook-card"><div><h4>Innovator Founder Handbook</h4><p>How endorsement works, real official costs, red flags and a business-plan checklist.</p></div><Price>£14.99</Price></article>
              <article className="bravo-handbook-card bravo-bundle-card"><div><div className="bravo-plan-heading"><h4>Handbook Bundle</h4><span>BEST VALUE</span></div><p>Both handbooks together.</p></div><Price>£19.99</Price></article>
            </div>
          </div>

          <div className="bravo-price-section">
            <div className="bravo-price-title"><span>03</span><h3>Career services</h3><p>1:1 help to land interviews</p></div>
            <div className="bravo-price-list">
              <div className="bravo-price-row"><div><h4>CV review</h4><p>Detailed written feedback on your CV against UK employer and ATS expectations.</p></div><Price detail="one-time">£19</Price></div>
              <div className="bravo-price-row"><div><h4>UK CV rewrite + LinkedIn makeover</h4><p>Your CV rebuilt in UK format and your LinkedIn profile optimised for recruiters.</p></div><Price detail="one-time">£69</Price></div>
              <div className="bravo-price-row"><div><h4>1:1 job strategy call <span>(45 min)</span></h4><p>Target roles, sponsor list, salary rules and your personal 18-month timeline.</p></div><Price detail="per session">£35</Price></div>
            </div>
          </div>

          <div className="bravo-price-section">
            <div className="bravo-price-title"><span>04</span><h3>Innovator Founder support</h3><p>Business-plan guidance</p></div>
            <div className="bravo-price-list">
              <div className="bravo-price-row"><div><h4>Business-plan readiness review</h4><p>An honest review of your idea and plan against the endorsement criteria: innovative, viable and scalable. You leave knowing your gaps.</p></div><Price detail="per review">£59</Price></div>
              <div className="bravo-price-row"><div><h4>Business-plan coaching</h4><p>Step-by-step coaching to strengthen your plan and prepare for the endorsement interview.</p></div><Price detail="after free call">On quote</Price></div>
            </div>
          </div>

          <aside className="bravo-promise">
            <div><p className="bravo-kicker">OUR PROMISE</p><h3>We will tell you not to pay us if:</h3><ol><li>Your business plan is not ready yet.</li><li>It is the wrong route for your profile.</li><li>You can do it yourself. You will get our free guide instead.</li></ol></div>
            <span className="bravo-no-stamp">NO.</span>
          </aside>

          <p className="bravo-pricing-note">Government fees, the Immigration Health Surcharge, endorsement fees and other third-party costs are not included. Rules and fees can change; check <a href="https://www.gov.uk/" target="_blank" rel="noreferrer">GOV.UK</a> for current official information.</p>
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
    </main>
  );
}
