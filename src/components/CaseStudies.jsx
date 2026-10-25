const CaseStudies = () => {
  const caseStudies = [
    {
      badge: 'E-Commerce',
      title: 'Transforming Retail Online',
      challenge: 'Legacy system preventing online growth and losing sales to competitors',
      solution: 'Built modern e-commerce platform with inventory sync and automated marketing',
      result: '+150% Revenue Growth',
    },
    {
      badge: 'Mobile App',
      title: 'Building Customer Engagement',
      challenge: 'No mobile presence while competitors gained market share',
      solution: 'Developed native iOS/Android app with push notifications and loyalty features',
      result: '5x User Downloads in Year 1',
    },
    {
      badge: 'CRM',
      title: 'Streamlining Sales Operations',
      challenge: 'Sales team scattered data across multiple systems, lost deals and pipeline visibility',
      solution: 'Implemented centralized CRM with custom workflows and real-time dashboards',
      result: '+35% Sales Efficiency',
    },
  ];

  return (
    <section className="case-studies-section" id="cases">
      <div className="container">
        <div className="section-header">
          <h2>Case Studies</h2>
          <p>See how we've transformed businesses across industries</p>
        </div>
        {caseStudies.map((study, index) => (
          <div key={index} className="case-study-card">
            <div className="case-study-header">
              <span className="case-badge">{study.badge}</span>
            </div>
            <h3>{study.title}</h3>
            <div className="case-study-content">
              <div>
                <strong>Challenge</strong>
                <p>{study.challenge}</p>
              </div>
              <div>
                <strong>Solution</strong>
                <p>{study.solution}</p>
              </div>
              <div>
                <strong>Result</strong>
                <p className="case-result">{study.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;
