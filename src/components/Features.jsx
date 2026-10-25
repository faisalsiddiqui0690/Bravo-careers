const Features = () => {
  const webFeatures = [
    'Custom design and development tailored to your brand',
    'Mobile-first approach ensuring perfect on all devices',
    'SEO optimization for organic visibility and traffic',
    'Fast loading speeds and performance optimization',
    'Modern tech stack built for scalability',
  ];

  const appFeatures = [
    'Native iOS & Android development for optimal performance',
    'Cloud integration and real-time data synchronization',
    'Intuitive user experience design and testing',
    'Push notifications and advanced analytics',
    'App store optimization and deployment',
  ];

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="features-section">
      <div className="container">
        <section className="feature-section">
          <div className="feature-visual"></div>
          <div className="feature-content">
            <h2>Web Development That Drives Results</h2>
            <p>We create responsive, fast-loading websites that turn visitors into customers. From design to deployment, we handle every aspect of building your online presence with modern, maintainable code.</p>
            <ul className="feature-list">
              {webFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <a href="/projects" onClick={(e) => { e.preventDefault(); window.location.href = '/projects'; }} className="btn btn-primary">View Web Projects</a>
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-content">
            <h2>Mobile Apps That Users Love</h2>
            <p>We build scalable, user-friendly mobile applications that help businesses reach customers anywhere. Whether iOS, Android, or cross-platform, we deliver excellence with intuitive UX design.</p>
            <ul className="feature-list">
              {appFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <a href="/projects" onClick={(e) => { e.preventDefault(); window.location.href = '/projects'; }} className="btn btn-primary">View App Projects</a>
          </div>
          <div className="feature-visual"></div>
        </section>
      </div>
    </section>
  );
};

export default Features;
