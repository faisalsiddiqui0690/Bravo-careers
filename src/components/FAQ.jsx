import { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer: 'Timeline varies by project scope. Simple websites: 4-8 weeks. Mobile apps: 3-6 months. Complex enterprise solutions: 6+ months. We\'ll provide accurate estimates during the discovery phase and maintain transparent communication throughout.',
    },
    {
      question: 'Do you provide ongoing support after launch?',
      answer: 'Absolutely. We offer tiered support packages including maintenance, updates, monitoring, and optimization. Most clients choose ongoing support to ensure their solutions stay current and performing optimally.',
    },
    {
      question: 'How do you ensure quality?',
      answer: 'We follow a rigorous QA process including automated testing, manual testing across browsers/devices, security audits, and performance optimization. Every project meets our high-quality standards before launch.',
    },
    {
      question: 'What\'s your tech stack?',
      answer: 'We use modern, scalable technologies: React/Vue for frontend, Node.js/Python for backend, PostgreSQL/MongoDB for databases, AWS/Google Cloud for infrastructure. We choose the best tools for each project\'s specific needs.',
    },
    {
      question: 'Can you work with our existing systems?',
      answer: 'Yes, we specialize in integrations. We can connect new solutions with your existing systems, legacy software, and third-party platforms. This minimizes disruption and protects your current investments.',
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-3xl">
        <div className="section-header visible mb-10 md:mb-12">
          <h2 className="text-[28px] md:text-[32px] font-semibold text-text">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className={`border border-subtle rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'bg-surface/50 border-primary shadow-lg shadow-primary/5' : 'bg-bg hover:border-text-tertiary'}`}>
              <div className="p-5 md:p-6 flex justify-between items-center cursor-pointer transition-colors" onClick={() => toggleFAQ(index)}>
                <span className={`text-base md:text-lg font-medium transition-colors ${activeIndex === index ? 'text-primary' : 'text-text'}`}>{faq.question}</span>
                <span className={`flex-shrink-0 ml-4 transition-transform duration-300 transform ${activeIndex === index ? 'rotate-180 text-primary' : 'text-text-tertiary'}`}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className={`transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="px-5 md:px-6 pb-6 text-sm md:text-base text-text-secondary leading-relaxed border-t border-subtle/50 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default FAQ;
