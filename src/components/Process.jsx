const Process = () => {
  const steps = [
    {
      number: 1,
      title: 'Discovery & Planning',
      description: 'We understand your business goals, challenges, and target audience to create a strategic roadmap.',
    },
    {
      number: 2,
      title: 'Design & Development',
      description: 'Our expert team builds solutions using cutting-edge technology and industry best practices.',
    },
    {
      number: 3,
      title: 'Testing & Launch',
      description: 'Rigorous QA ensures quality, security, and performance before deployment to production.',
    },
    {
      number: 4,
      title: 'Support & Growth',
      description: 'Ongoing optimization and support to maximize your ROI and ensure long-term success.',
    },
  ];

  return (
    <section className="py-12 md:py-16 scroll-mt-20" id="process">
      <div className="container">
        <div className="section-header visible">
          <h2 className="text-[28px] md:text-[32px] font-semibold mb-4 text-text">Our Simple, Proven Process</h2>
          <p className="text-base md:text-lg text-text-secondary max-w-[600px] mx-auto">From discovery to delivery, we follow a structured approach</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative">
          <div className="hidden md:block absolute top-[25px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-0"></div>
          {steps.map((step, index) => (
            <div key={index} className="relative z-[1] text-center group">
              <div className="w-[50px] h-[50px] mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-[20px] font-bold text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
                {step.number}
              </div>
              <h3 className="text-base font-bold mb-2 text-text group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Process;
