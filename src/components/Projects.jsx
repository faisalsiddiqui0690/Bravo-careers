import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import { getProjects, IMAGE_BASE } from '../services/api';

const defaultProjects = [
  { id: 1, title: "E-Commerce Platform", category: "Web Development", client: "Fashion Retail Company", description: "Complete e-commerce solution with inventory management, payment processing, and real-time analytics.", technologies: ["React", "Node.js", "MongoDB", "Stripe"], image: "🛒", features: ["Real-time Inventory", "Multi-payment Gateway", "Admin Dashboard", "Mobile Responsive", "SEO Optimized"] },
  { id: 2, title: "Mobile Banking App", category: "App Development", client: "FinTech Startup", description: "Secure mobile banking application with biometric authentication and real-time transactions.", technologies: ["React Native", "Firebase", "Node.js", "Blockchain"], image: "📱", features: ["Biometric Login", "Real-time Transactions", "Push Notifications", "Budget Tracking", "Investment Portfolio"] },
  { id: 3, title: "CRM System", category: "Enterprise Software", client: "B2B Services Company", description: "Custom CRM solution with lead management and automated workflows.", technologies: ["Vue.js", "Python", "PostgreSQL", "Docker"], image: "📊", features: ["Lead Management", "Automated Workflows", "Custom Reports", "Email Integration", "Mobile App"] },
  { id: 4, title: "Healthcare Portal", category: "Web Development", client: "Medical Clinic", description: "Patient management system with appointment scheduling and telemedicine capabilities.", technologies: ["Angular", "Express.js", "MySQL", "WebRTC"], image: "🏥", features: ["Appointment Scheduling", "Telemedicine", "Patient Records", "Prescription Management", "Video Consultation"] },
  { id: 5, title: "Logistics Dashboard", category: "Data Analytics", client: "Logistics Company", description: "Real-time tracking dashboard with route optimization and predictive analytics.", technologies: ["React", "Python", "TensorFlow", "AWS"], image: "🚚", features: ["Real-time Tracking", "Route Optimization", "Fleet Management", "Predictive Analytics", "Custom Reports"] },
  { id: 6, title: "Social Media App", category: "App Development", client: "Tech Startup", description: "Social networking platform with real-time messaging, content sharing, and live streaming.", technologies: ["Flutter", "Node.js", "Socket.io", "AWS"], image: "💬", features: ["Real-time Messaging", "Content Sharing", "Live Streaming", "User Profiles", "Push Notifications"] }
];

const ProjectCard = ({ project, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation();
  return (
    <Link
      to={`/projects/${project.id}`}
      ref={cardRef}
      className={`bg-bg border border-subtle rounded-xl p-2 pb-1.5 cursor-pointer overflow-hidden relative group hover:border-primary hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 reveal-on-scroll ${cardVisible ? 'visible' : ''} block`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg h-32 md:h-40 flex items-center justify-center mb-4 transition-colors group-hover:from-primary/10 group-hover:to-accent/10">
        <div className="absolute top-3 left-3 text-[10px] md:text-[11px] text-primary font-bold uppercase tracking-wider bg-primary-light/50 px-2 py-1 rounded-md z-1">
          {project.category}
        </div>
        {project.image && (project.image.includes('media.ipshopy.com') || project.image.startsWith('/uploads')) ? (
          <img
            src={project.image.includes('media.ipshopy.com') ? project.image : `${IMAGE_BASE}${project.image}`}
            alt={project.title}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.outerHTML = '<div class="text-[48px] md:text-[60px]">📁</div>'; }}
          />
        ) : (
          <div className="text-[48px] md:text-[60px]">{project.image || '📁'}</div>
        )}
      </div>

      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold mb-1 text-text group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-[13px] text-text-secondary mb-3 font-normal">Client: {project.client}</p>
        <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, techIndex) => (
            <span key={techIndex} className="text-[11px] font-medium text-text-tertiary bg-surface border border-border px-2 py-1 rounded-md uppercase tracking-tight">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[11px] font-medium text-text-tertiary bg-surface border border-border px-2 py-1 rounded-md">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const Projects = () => {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    getProjects()
      .then(data => {
        if (data && data.length > 0) {
          const parsed = data.map(p => {
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
              features: p.features || ["Custom Development", "Scalable Architecture", "Modern UI/UX", "Performance Optimized", "24/7 Support"],
              technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies,
              images: parsedImages
            };
          });
          console.log('Projects loaded:', parsed.map(p => ({ id: p.id, title: p.title, images: p.images, imageCount: p.images?.length })));
          setProjects(parsed);
        }
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
      });
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-12 md:py-24 scroll-mt-20" id="projects">
      <div className="container">
        <div className={`section-header ${headerVisible ? 'visible' : ''}`} ref={headerRef}>
          <h2 className="text-[28px] md:text-[32px] font-semibold mb-4 text-text">Our Recent Projects</h2>
          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">Explore our portfolio of successful projects across various industries and technologies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.slice(0, 6).map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))}
        </div>

        <div className="flex gap-3 justify-center items-center mt-8 md:mt-16">
          <Link to="/projects" className="btn-secondary flex-1 md:flex-none max-w-[160px] md:max-w-none">
            View All Projects
          </Link>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="btn-primary flex-1 md:flex-none max-w-[160px] md:max-w-none">
            Start Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;