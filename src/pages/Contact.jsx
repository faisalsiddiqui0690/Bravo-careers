import { useState } from 'react';
import { Link } from 'react-router-dom';
import FadeInSection from '../components/FadeInSection';
import SEO from '../components/SEO';

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M3 7h8M8 4l3 3-3 3" />
  </svg>
);

const CONTACT_INFO = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.13 6.13l.94-1.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    label: 'Phone',
    value: '9922284137',
    link: 'tel:+919922284137',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    label: 'Email',
    value: 'hello@npquantumtech.com',
    link: 'mailto:hello@npquantumtech.com',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    label: 'Office',
    value: 'Gyanpeeth - Campus II, T18, STPI, Naregaon - Malharpur - Warud Rd, opp. Garware Stadium, MIDC Industrial Area, Chilkalthana, Chhatrapati Sambhajinagar, Maharashtra 431008',
    link: '#',
  },
  {
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    label: 'Working Hours',
    value: 'Open 24 hours',
    link: '#',
  },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSent(true);
        setForm({ name: '', email: '', phone: '', service: '', message: '' });
        console.log('✅ Emails sent successfully!');
      } else {
        console.error('❌ Email error:', data);
        const errorMessage = data.details?.join(', ') || data.error || 'Failed to send message. Please try again.';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      alert('Network error. Please check if the backend server is running and try again.');
    }
  };

  return (
    <div className="page">
      <SEO 
        title="Contact Us - NPquantumtech | Get in Touch for IT Solutions"
        description="Contact NPquantumtech for professional IT solutions. We're available 24/7 to discuss your web development, mobile app, e-commerce, and CRM needs. Located in Chhatrapati Sambhajinagar."
        keywords="contact NPquantumtech, IT solutions inquiry, web development contact, software development company contact, Chhatrapati Sambhajinagar IT company"
        canonical="/contact"
      />

      {/* ── PAGE HERO ── */}
      <section style={{
        minHeight: '30vh',
        display: 'flex', 
        alignItems: 'center',
        paddingTop: '72px', 
        paddingBottom: '40px', 
        position: 'relative', 
        overflow: 'hidden',
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%),
          url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&auto=format&fit=crop') center/cover no-repeat
        `,
      }}>
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <div className="badge" style={{ margin: '0 auto 18px' }}><span className="badge-dot" /> Get in Touch</div>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 52px)', marginBottom: 16 }}>Contact Us</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 17, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Have a project in mind or just want to say hello? We'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary">View Services <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <FadeInSection className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'start' }}>

            {/* Left — contact info */}
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 8 }}>Let's Start a Conversation</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.75, marginBottom: 36 }}>
                Whether you have a question, a project brief, or just want to explore what's possible — 
                reach out and our team will get back to you within 24 hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {CONTACT_INFO.map(({ icon, label, value, link }) => (
                  <a key={label} href={link} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    textDecoration: 'none', color: 'inherit',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'var(--blue-light)', border: '1px solid rgba(26,60,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <svg style={{ width: 16, height: 16, stroke: 'var(--blue)', strokeWidth: 1.8, fill: 'none' }}
                        viewBox="0 0 24 24">{icon.props.children}</svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 14, color: 'var(--gray-900)', lineHeight: 1.5 }}>{value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Google Maps Embed */}
              <div style={{
                marginTop: 36, 
                borderRadius: 16, 
                overflow: 'hidden',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div className="mapouter" style={{
                  position: 'relative',
                  textAlign: 'right',
                  width: '100%',
                  height: '300px',
                }}>
                  <div className="gmap_canvas" style={{
                    overflow: 'hidden',
                    background: 'none!important',
                    width: '100%',
                    height: '300px',
                  }}>
                    <iframe
                      className="gmap_iframe"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src="https://maps.google.com/maps?width=600&height=400&hl=en&q=ipshopy&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                      style={{
                        width: '100%',
                        height: '300px',
                        border: 'none',
                        display: 'block',
                      }}
                      title="NPquantumtech Location"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div style={{
              background: 'var(--white)', border: '1px solid var(--gray-200)',
              borderRadius: 20, padding: '36px 32px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: '#e8f5e9', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 20px',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" style={{ stroke: '#339933', strokeWidth: 2, fill: 'none' }}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 20, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: 18, marginBottom: 24 }}>Send Us a Message</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <Field label="Full Name" name="name" type="text" placeholder="Rahul Mehta" value={form.name} onChange={handleChange} required />
                    <Field label="Email Address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <Field label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', marginBottom: 6, letterSpacing: '0.04em' }}>
                        Service Interested In
                      </label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: 9,
                          border: '1.5px solid var(--gray-200)', fontSize: 14,
                          color: 'var(--gray-900)', background: 'white',
                          fontFamily: 'var(--font-body)', outline: 'none',
                        }}
                      >
                        <option value="">Select service...</option>
                        <option>Web Development</option>
                        <option>Mobile App Development</option>
                        <option>UI/UX Design</option>
                        <option>E-Commerce</option>
                        <option>Cloud & DevOps</option>
                        <option>Custom Software</option>
                        <option>Career</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', marginBottom: 6, letterSpacing: '0.04em' }}>
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      rows={5}
                      required
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 9,
                        border: '1.5px solid var(--gray-200)', fontSize: 14,
                        color: 'var(--gray-900)', fontFamily: 'var(--font-body)',
                        resize: 'vertical', outline: 'none', lineHeight: 1.6,
                      }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 24px', fontSize: 15 }}>
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{ stroke: 'currentColor', strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </FadeInSection>

      <style>{`
        @media(max-width:768px) {
          .container div[style*="grid-template-columns: 1fr 1.6fr"] {
            grid-template-columns: 1fr !important;
          }
          .container form div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        input:focus, textarea:focus, select:focus {
          border-color: var(--blue) !important;
          box-shadow: 0 0 0 3px rgba(26,60,255,0.08);
        }
      `}</style>
    </div>
  );
}

function Field({ label, name, type, placeholder, value, onChange, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', marginBottom: 6, letterSpacing: '0.04em' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 9,
          border: '1.5px solid var(--gray-200)', fontSize: 14,
          color: 'var(--gray-900)', fontFamily: 'var(--font-body)',
          outline: 'none', background: 'white',
        }}
      />
    </div>
  );
}
