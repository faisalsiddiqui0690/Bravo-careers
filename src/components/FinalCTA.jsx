import { Link } from 'react-router-dom';

const FinalCTA = () => {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-bg border-y border-subtle py-12 md:py-16 text-center relative overflow-hidden" id="contact">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] pointer-events-none"></div>
      <div className="container relative z-[1]">
        <h2 className="text-[26px] md:text-[32px] font-bold mb-4 text-text leading-tight">Ready to Transform Your Business?</h2>
        <p className="text-sm md:text-base text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">Let's discuss how our expert IT solutions can help you achieve your goals and scale your digital presence.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/contact" className="btn-primary flex-1 md:flex-none max-w-[160px] md:max-w-none">Consultation</Link>
          <Link to="/projects" className="btn-secondary flex-1 md:flex-none max-w-[160px] md:max-w-none">Portfolio</Link>
        </div>
      </div>
    </section>

  );
};

export default FinalCTA;
