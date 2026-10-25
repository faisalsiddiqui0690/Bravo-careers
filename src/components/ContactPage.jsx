import { useState } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ContactPage = ({ theme, toggleTheme }) => {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation();
  const [infoRef, infoVisible] = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
      return;
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormStatus({ submitted: false, loading: false, error: 'Phone number must be exactly 10 digits' });
      return;
    }

    setFormStatus({ submitted: false, loading: true, error: null });

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service || 'General Inquiry',
          message: formData.message,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setFormStatus({ submitted: true, loading: false, error: null });
        setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      } else {
        const detail = json.details
          ? (Array.isArray(json.details) ? json.details.join(', ') : json.details)
          : json.error || 'Failed to send message.';
        setFormStatus({ submitted: false, loading: false, error: detail });
      }
    } catch (error) {
      setFormStatus({
        submitted: false,
        loading: false,
        error: 'Network error — please check your connection and try again.',
      });
    }
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      value: "services@gmail.com",
      link: "mailto:services@gmail.com"
    },
    {
      icon: "📞",
      title: "Phone",
      value: "+91 99222 84137",
      link: "tel:+919922284137"
    },
    {
      icon: "📍",
      title: "Address",
      value: "T18, STPI, Naregaon - Malharpur - Warud Rd, Chhatrapati Sambhajinagar, Maharashtra 431008",
      link: "https://maps.google.com/?q=IPShopy+Chhatrapati+Sambhajinagar"
    },
    {
      icon: "⏰",
      title: "Business Hours",
      value: "Monday - Saturday: 9:00 AM - 6:00 PM",
      link: null
    }
  ];

  return (
    <div className="pt-20 md:pt-28 pb-16 md:pb-24 bg-gradient-to-b from-bg to-surface">
      <div className="container relative z-1">
        {/* Header */}
        <div className={`section-header ${headerVisible ? 'visible' : ''} mb-16`} ref={headerRef}>
          <h1 className="text-[32px] md:text-[48px] font-light mb-5 text-text tracking-tight ">Contact Us</h1>
          <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">Get in touch with us to discuss your project requirements and how we can help your business grow</p>
        </div>

        <div className="grid lg:grid-cols-[1fr,0.8fr] gap-12 md:gap-16 items-start">
          {/* Contact Form */}
          <div className={`bg-bg border border-subtle p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-xl shadow-black/5 transition-all duration-1000 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`} ref={formRef}>
            <h2 className="text-2xl font-semibold text-text mb-8 flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold text-text-tertiary uppercase tracking-wider ml-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-surface border border-subtle rounded-xl px-5 py-3.5 text-text text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-tertiary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-text-tertiary uppercase tracking-wider ml-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-surface border border-subtle rounded-xl px-5 py-3.5 text-text text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-tertiary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-semibold text-text-tertiary uppercase tracking-wider ml-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full bg-surface border border-subtle rounded-xl px-5 py-3.5 text-text text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-tertiary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-xs font-semibold text-text-tertiary uppercase tracking-wider ml-1">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company Ltd."
                    className="w-full bg-surface border border-subtle rounded-xl px-5 py-3.5 text-text text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-tertiary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-xs font-semibold text-text-tertiary uppercase tracking-wider ml-1">Service Interested In</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-surface border border-subtle rounded-xl px-5 py-3.5 text-text text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3D%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1.25rem center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <option value="">Select a service</option>
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="IT Infrastructure">IT Infrastructure</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-semibold text-text-tertiary uppercase tracking-wider ml-1">Project Details *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us about your project requirements..."
                  className="w-full bg-surface border border-subtle rounded-xl px-5 py-3.5 text-text text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-text-tertiary/50 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              {formStatus.submitted && (
                <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl text-sm font-medium animate-fadeIn">
                  ✅ Thank you for your message! We'll get back to you within 24 hours.
                </div>
              )}

              {formStatus.error && (
                <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-xl text-sm font-medium animate-fadeIn">
                  ❌ {formStatus.error}
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className={`space-y-12 transition-all duration-1000 delay-200 ${infoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`} ref={infoRef}>
            <div>
              <h2 className="text-2xl font-semibold text-text mb-8 flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">Get in Touch</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-bg border border-subtle p-5 rounded-2xl transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/5 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">{info.icon}</div>
                    <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-1">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} target={info.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="text-sm font-medium text-text hover:text-primary transition-colors block">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-text">{info.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-subtle p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-6">
              <h3 className="text-xl font-semibold text-text flex items-center gap-3">Our Location</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="text-2xl mt-1">📍</span>
                  <div className="text-sm text-text-secondary leading-relaxed space-y-1 font-medium">
                    <p>T18, STPI, Naregaon - Malharpur - Warud Rd</p>
                    <p>opp. Garware Stadium, MIDC Industrial Area</p>
                    <p>Chilkalthana, Chhatrapati Sambhajinagar</p>
                    <p>Maharashtra 431008, India</p>
                  </div>
                </div>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=IPShopy+Chhatrapati+Sambhajinagar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-text text-bg px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-black hover:scale-105 active:scale-95"
                  >
                    View on Google Maps 🌐
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
