import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjects, IMAGE_BASE } from '../services/api';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    getProjects()
      .then(data => {
        const foundProject = data.find(p => p.id === parseInt(id));

        if (foundProject) {
          // Parse images
          let parsedImages = [];
          if (foundProject.images) {
            if (typeof foundProject.images === 'string') {
              try {
                parsedImages = JSON.parse(foundProject.images);
              } catch (e) {
                console.error('Error parsing images', e);
                parsedImages = [];
              }
            } else if (Array.isArray(foundProject.images)) {
              parsedImages = foundProject.images;
            }
          }

          const projectData = {
            ...foundProject,
            technologies: typeof foundProject.technologies === 'string'
              ? JSON.parse(foundProject.technologies)
              : foundProject.technologies,
            images: parsedImages,
            liveUrl: foundProject.liveUrl || foundProject.live_url || '',
            features: foundProject.features 
              ? (typeof foundProject.features === 'string' ? JSON.parse(foundProject.features) : foundProject.features)
              : [
                'Custom Development',
                'Scalable Architecture',
                'Modern UI/UX',
                'Performance Optimized',
                '24/7 Support',
              ],
          };

          console.log('Project liveUrl:', projectData.liveUrl);
          setProject(projectData);

          // Build combined image array - Azure URLs are absolute
          const imageList = [];
          if (projectData.image) {
            if (projectData.image.includes('media.ipshopy.com') || projectData.image.startsWith('/uploads')) {
              imageList.push(projectData.image);
            }
          }
          if (projectData.images && projectData.images.length > 0) {
            imageList.push(...projectData.images);
          }
          setAllImages(imageList);
        } else {
          navigate('/projects');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch project:', err);
        setLoading(false);
        navigate('/projects');
      });
  }, [id, navigate]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Add scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading project…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const resolveImage = (img) => (img.includes('media.ipshopy.com') ? img : `${IMAGE_BASE}${img}`);

  // Real, project-specific numbers — no placeholder stats.
  const stats = [
    { label: 'Category', value: project.category, accent: 'primary' },
    { label: 'Client', value: project.client, accent: 'accent' },
    { label: 'Technologies', value: `${project.technologies.length}`, accent: 'primary' },
    { label: 'Key features', value: `${project.features.length}`, accent: 'accent' },
  ];

  return (
    <div className="min-h-screen bg-bg pt-20 md:pt-18">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-subtle">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative py-14 md:py-20">
          <div className={`grid grid-cols-1 ${allImages.length > 0 ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''} gap-12 items-center`}>
            <div>
              <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="opacity-50">/</span>
                <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
                <span className="opacity-50">/</span>
                <span className="text-text-secondary truncate">{project.title}</span>
              </nav>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
                {project.category}
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text leading-tight mb-5 font-display tracking-tight">
                {project.title}
              </h1>

              <p className="text-base md:text-lg text-text-secondary leading-relaxed font-body mb-8 max-w-xl">
                {project.tagline || project.description?.split('\n')[0] || project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Start a similar project
                </Link>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-subtle text-text rounded-xl font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Live
                  </a>
                )}
              </div>
            </div>

            {allImages.length > 0 && (
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2rem] blur-xl pointer-events-none" />
                <div className="relative rounded-3xl overflow-hidden border border-subtle shadow-2xl">
                  <img
                    src={resolveImage(allImages[0])}
                    alt={project.title}
                    className="w-full h-auto block"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats strip — real, project-specific data */}
      <section className="py-4 md:py-5 bg-gradient-to-b from-transparent to-surface/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="group relative">
                {/* Background glow effect - same as hero image */}
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/15 to-accent/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative p-2.5 md:p-3 bg-white dark:bg-surface border border-subtle rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
                    stat.accent === 'primary' ? 'bg-gradient-to-br from-primary to-primary/50' : 'bg-gradient-to-br from-accent to-accent/50'
                  }`} />
                  
                  <div className="relative z-10">
                    <div className="text-sm md:text-base font-bold text-text leading-tight mb-0.5 truncate group-hover:text-primary transition-colors duration-300" title={stat.value}>
                      {stat.value}
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-wider text-text-tertiary">
                      {stat.label}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                    stat.accent === 'primary' ? 'bg-gradient-to-r from-transparent via-primary to-transparent' : 'bg-gradient-to-r from-transparent via-accent to-transparent'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image gallery */}
      {allImages.length > 0 && (
        <section id="project-gallery" className="py-12 md:py-16 scroll-mt-24">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6 animate-on-scroll">
                <h2 className="text-xl md:text-2xl font-bold text-text font-display">Project gallery</h2>
                <span className="text-sm text-text-tertiary">{currentImageIndex + 1} of {allImages.length}</span>
              </div>

              <div
                className="relative rounded-3xl overflow-hidden border border-subtle bg-surface shadow-xl group cursor-pointer animate-on-scroll"
                onClick={() => openLightbox(currentImageIndex)}
              >
                <div className="aspect-video relative bg-surface">
                  <img
                    ref={imageRef}
                    src={resolveImage(allImages[currentImageIndex])}
                    alt={`${project.title} — image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';
                    }}
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg text-gray-900 flex items-center justify-center transition-all hover:scale-105"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg text-gray-900 flex items-center justify-center transition-all hover:scale-105"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2.5 mt-4 animate-on-scroll">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? 'border-primary shadow-md scale-[1.03]'
                          : 'border-transparent opacity-60 hover:opacity-100 hover:border-subtle'
                      }`}
                    >
                      <img
                        src={resolveImage(img)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="py-14 md:py-20 bg-surface/40 border-y border-subtle">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Right Column - Project Details (floats on desktop) */}
            <div className="lg:float-right lg:w-[400px] lg:ml-10 mb-10 animate-on-scroll space-y-6">
                {/* Project Info Card */}
                <div className="bg-white dark:bg-surface border border-subtle rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-text mb-5 pb-3 border-b border-subtle">
                    Project Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Category</p>
                        <p className="text-sm font-semibold text-text truncate">{project.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Client</p>
                        <p className="text-sm font-semibold text-text truncate">{project.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Tech Stack</p>
                        <p className="text-sm font-semibold text-text">{project.technologies.length} Technologies</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Features</p>
                        <p className="text-sm font-semibold text-text">{project.features.length} Key Features</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Live Button */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Live Website
                    </a>
                  )}
                </div>

                {/* Technologies Preview */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border border-subtle rounded-2xl p-6 transition-all duration-300">
                  <h3 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
                    Tech Stack Preview
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(showAllTech ? project.technologies : project.technologies.slice(0, 6)).map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-subtle rounded-lg text-xs font-medium text-text shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-accent" />
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 6 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAllTech(!showAllTech);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors cursor-pointer"
                      >
                        {showAllTech ? 'Show less' : `+${project.technologies.length - 6} more`}
                      </button>
                    )}
                  </div>
                </div>

                {/* CTA Card */}
                
              </div>
            
            {/* Left Column - Description (flows around the floated sidebar) */}
            <div className="animate-on-scroll">
              <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 font-display flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
                About this project
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-text-secondary leading-relaxed whitespace-pre-line text-base md:text-lg mb-6">
                  {project.description}
                </p>
                
                {/* Additional project highlights */}
                <div className="mt-8 p-6 bg-white/50 dark:bg-surface border border-subtle rounded-2xl max-w-2xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    Project Highlights
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-text-secondary">
                      <span>Built with modern, scalable architecture for long-term reliability</span>
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                      <span>Optimized for performance with fast load times and smooth interactions</span>
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                      <span>Responsive design that works flawlessly on all devices</span>
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                      <span>Comprehensive testing and quality assurance throughout development</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Clear float to ensure full-width content below */}
            <div className="clear-both"></div>
          </div>
        </div>
      </section>

      {/* Technologies + features */}
      <section id="technologies-section" className="py-14 md:py-20 scroll-mt-24">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-14">
            {/* <div className="animate-on-scroll">
              <h2 className="text-xl md:text-2xl font-bold text-text mb-2 font-display">Technologies used</h2>
              <p className="text-sm text-text-tertiary mb-5">{project.technologies.length} tools powering this build</p>
              <div className="flex flex-wrap gap-2.5">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-subtle rounded-lg text-sm font-medium text-text hover:border-primary hover:text-primary hover:shadow-sm transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-accent" />
                    {tech}
                  </span>
                ))}
              </div>
            </div> */}

            <div className="animate-on-scroll">
              <h2 className="text-xl md:text-2xl font-bold text-text mb-2 font-display">Key features</h2>
              <p className="text-sm text-text-tertiary mb-5">What this project delivers</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="group relative">
                    {/* Background glow effect - same as stats cards */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary/15 to-accent/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div className="relative flex items-center gap-3.5 p-4 bg-white dark:bg-surface border border-subtle rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
                      <span className="text-text font-medium text-sm group-hover:text-primary transition-colors duration-300">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-accent p-6 md:p-8 text-center">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            <div className="relative">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 font-display tracking-tight">
                Ready to start your next project?
              </h2>
              <p className="text-white/90 text-sm md:text-base mb-5 max-w-xl mx-auto">
                Let's discuss how we can bring your vision to life with the same care we brought to this one.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors text-sm"
                >
                  Start a project
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors text-sm"
                >
                  View all projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={resolveImage(allImages[currentImageIndex])}
              alt={`${project.title} — full size`}
              className="w-full h-auto max-h-[88vh] object-contain rounded-lg"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow text-gray-900 flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow text-gray-900 flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;