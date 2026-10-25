import useScrollAnimation from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjects, IMAGE_BASE } from '../services/api';

const defaultPageProjects = [
  { title: "E-Commerce Platform", category: "Web Development", client: "Fashion Retail Company", description: "Complete e-commerce solution with inventory management, payment processing, and real-time analytics. Built with React, Node.js, and MongoDB for scalability and performance.", technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redis"], image: "🛒", features: ["Real-time Inventory", "Multi-payment Gateway", "Admin Dashboard", "Mobile Responsive", "SEO Optimized"] },
  { title: "Mobile Banking App", category: "App Development", client: "FinTech Startup", description: "Secure mobile banking application with biometric authentication, real-time transactions, and advanced security features. Native iOS and Android development.", technologies: ["React Native", "Firebase", "Node.js", "Blockchain", "WebRTC"], image: "📱", features: ["Biometric Login", "Real-time Transactions", "Push Notifications", "Budget Tracking", "Investment Portfolio"] },
  { title: "CRM System", category: "Enterprise Software", client: "B2B Services Company", description: "Custom CRM solution with lead management, automated workflows, and advanced reporting. Integrated with existing business systems.", technologies: ["Vue.js", "Python", "PostgreSQL", "Docker", "AWS"], image: "📊", features: ["Lead Management", "Automated Workflows", "Custom Reports", "Email Integration", "Mobile App"] },
  { title: "Healthcare Portal", category: "Web Development", client: "Medical Clinic", description: "Patient management system with appointment scheduling, telemedicine capabilities, and HIPAA compliance. Secure and user-friendly interface.", technologies: ["Angular", "Express.js", "MySQL", "WebRTC", "Twilio"], image: "🏥", features: ["Appointment Scheduling", "Telemedicine", "Patient Records", "Prescription Management", "Video Consultation"] },
  { title: "Logistics Dashboard", category: "Data Analytics", client: "Logistics Company", description: "Real-time tracking dashboard with route optimization, predictive analytics, and fleet management. Integrated with GPS and IoT devices.", technologies: ["React", "Python", "TensorFlow", "AWS", "PostgreSQL"], image: "🚚", features: ["Real-time Tracking", "Route Optimization", "Fleet Management", "Predictive Analytics", "Custom Reports"] },
  { title: "Social Media App", category: "App Development", client: "Tech Startup", description: "Social networking platform with real-time messaging, content sharing, and live streaming. Scalable architecture for millions of users.", technologies: ["Flutter", "Node.js", "Socket.io", "AWS", "Redis"], image: "💬", features: ["Real-time Messaging", "Content Sharing", "Live Streaming", "User Profiles", "Push Notifications"] },
  { title: "Learning Management System", category: "Web Development", client: "Educational Institution", description: "Comprehensive LMS with video lectures, assignments, quizzes, and progress tracking. Integrated with payment gateways.", technologies: ["Next.js", "Django", "PostgreSQL", "AWS S3", "WebRTC"], image: "🎓", features: ["Video Lectures", "Assignment System", "Quiz Engine", "Progress Tracking", "Certificate Generation"] },
  { title: "IoT Monitoring System", category: "IoT Solutions", client: "Manufacturing Company", description: "Industrial IoT monitoring system with sensor integration, real-time alerts, and predictive maintenance. Cloud-based analytics.", technologies: ["React", "Python", "MQTT", "InfluxDB", "Grafana"], image: "🏭", features: ["Sensor Integration", "Real-time Alerts", "Predictive Maintenance", "Dashboard Analytics", "Mobile Monitoring"] }
];

const defaultFeatures = ["Custom Development", "Scalable Architecture", "Modern UI/UX", "Performance Optimized", "24/7 Support"];

const ProjectCardPage = ({ project, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation();
  return (
    <Link
      to={`/projects/${project.id}`}
      className={`bg-bg border border-subtle rounded-xl p-2 pb-1.5 transition-all duration-700 ease-out cursor-pointer overflow-hidden relative group hover:border-primary hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'} block`}
      ref={cardRef}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg h-40 md:h-48 flex items-center justify-center mb-5 transition-colors group-hover:from-primary/10 group-hover:to-accent/10 overflow-hidden">
        <div className="absolute top-3 left-3 text-[10px] md:text-[11px] text-primary font-semibold uppercase tracking-wider bg-primary/10 backdrop-blur-md px-3 py-1 rounded-md z-1 border border-primary/20">
          {project.category}
        </div>
        {project.image && (project.image.includes('media.ipshopy.com') || project.image.startsWith('/uploads')) ? (
          <img
            src={project.image.includes('media.ipshopy.com') ? project.image : `${IMAGE_BASE}${project.image}`}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.outerHTML = '<div class="text-[48px] md:text-[60px]">📁</div>'; }}
          />
        ) : (
          <div className="text-[48px] md:text-[60px] group-hover:scale-110 transition-transform duration-500">{project.image || '📁'}</div>
        )}
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-xl font-semibold mb-1 text-text group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-[13px] text-text-tertiary mb-3 font-normal">Client: {project.client}</p>
        <p className="text-sm text-text-secondary mb-5 line-clamp-2 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, techIndex) => (
            <span key={techIndex} className="text-[10px] font-medium text-text-tertiary bg-surface border border-subtle px-2 py-1 rounded-md uppercase tracking-tight">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[10px] font-medium text-text-tertiary bg-surface border border-subtle px-2 py-1 rounded-md">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProjectsPage = ({ theme, toggleTheme }) => {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [projects, setProjects] = useState(defaultPageProjects);

  useEffect(() => {
    getProjects()
      .then(data => {
        if (data && data.length > 0) {
          setProjects(data.map(p => {
            // Parse images if it's a string
            let parsedImages = [];
            if (p.images) {
              if (typeof p.images === 'string') {
                try {
                  parsedImages = JSON.parse(p.images);
                } catch (e) {
                  console.error('Error parsing images for project', p.id, e);
                  parsedImages = [];
                }
              } else if (Array.isArray(p.images)) {
                parsedImages = p.images;
              }
            }
            
            return {
              ...p,
              features: p.features || defaultFeatures,
              technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies,
              images: parsedImages
            };
          }));
        }
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
      });
  }, []);

  return (
    <section className="pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-bg to-surface">
      <div className="container relative z-1">
        <div className={`section-header ${headerVisible ? 'visible' : ''} mb-16`} ref={headerRef}>
          <h2 className="text-[32px] md:text-[48px] font-light mb-5 text-text tracking-tight">Our Projects</h2>
          <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">Explore our portfolio of successful projects across various industries and technologies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCardPage key={index} project={project} index={index} />
          ))}
        </div>

        <div className="mt-20 md:mt-24 p-8 md:p-12 rounded-3xl bg-surface border border-subtle text-center shadow-xl relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="relative z-1">
            <h3 className="text-2xl md:text-[30px] font-semibold mb-4 text-text leading-tight">Have a Project in Mind?</h3>
            <p className="text-sm md:text-base text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">Let's discuss how we can bring your vision to life and deliver exceptional digital experiences.</p>
            <Link to="/contact" className="btn-primary">
              Start Your Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;