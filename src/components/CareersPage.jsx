import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const typeBadgeColor = {
  'Full-Time':  'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Part-Time':  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  'Internship': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Remote':     'bg-sky-500/10 text-sky-400 border border-sky-500/20',
};

const inputCls = 'w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors';

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/careers`)
      .then(r => r.json())
      .then(json => { if (json.success) setCareers(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const departments = ['All', ...new Set(careers.map(c => c.department))];
  const types = ['All', 'Full-Time', 'Part-Time', 'Internship', 'Remote'];

  const filtered = careers.filter(c => {
    const matchType = filterType === 'All' || c.type === filterType;
    const matchDept = filterDept === 'All' || c.department === filterDept;
    return matchType && matchDept;
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (form.phone.trim()) {
      if (!/^\d{10}$/.test(form.phone.trim())) {
        e.phone = 'Phone number must be exactly 10 digits';
      }
    }
    if (!form.message.trim()) e.message = 'Cover letter / message is required';
    return e;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `Job Application: ${selectedCareer.title}`,
          message: form.message,
          careerId: selectedCareer.id,
          careerTitle: selectedCareer.title,
          type: 'Career',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitSuccess(true);
        setForm({ name: '', email: '', phone: '', message: '' });
        setErrors({});
      }
    } catch {}
    setSubmitting(false);
  };

  const openDetail = (career) => {
    setSelectedCareer(career);
    setShowDetailModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetail = () => {
    setShowDetailModal(false);
    setSelectedCareer(null);
    document.body.style.overflow = 'unset';
  };

  const openApply = (career) => {
    setSelectedCareer(career);
    setSubmitSuccess(false);
    setForm({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setShowDetailModal(false);
    setShowApplyModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeApply = () => {
    setShowApplyModal(false);
    setSelectedCareer(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full mb-4">
            We're Hiring
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our <span className="text-blue-600 dark:text-blue-400">Team</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base">
            Build the future of technology with us. We're looking for passionate people who love solving real problems.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Type:</span>
            <div className="flex flex-wrap gap-1.5">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                    filterType === t
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {departments.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Dept:</span>
              <select
                value={filterDept}
                onChange={e => setFilterDept(e.target.value)}
                className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
              >
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          )}
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {filtered.length} opening{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-base">No openings match your filters right now.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back soon or send us a general enquiry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(career => (
              <div
                key={career.id}
                onClick={() => openDetail(career)}
                className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer flex flex-col shadow-sm hover:shadow-xl dark:shadow-none"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {career.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 uppercase tracking-wider ${typeBadgeColor[career.type] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
                      {career.type}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-5">
                    {career.department}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <span className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 font-medium">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {career.location}
                    </span>
                    <span className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 font-medium">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {career.experience}
                    </span>
                  </div>
                </div>

                {/* View Details Bar */}
                <div className="mt-auto h-11 bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-white text-[13px] font-bold flex items-center gap-2">
                    View Details <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* General enquiry CTA */}
        <div className="mt-16 text-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Don't see a fit?</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
            Send us a general application and we'll keep you in mind for future openings.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold text-sm px-6 py-2.5 rounded-xl transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCareer && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeDetail}
        >
          <div
            className="bg-bg border border-subtle w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 md:p-10 border-b border-subtle flex justify-between items-start flex-shrink-0">
              <div className="flex gap-4 md:gap-8 items-center">
                <div className="w-12 h-12 md:w-20 md:h-20 flex-shrink-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl border border-subtle">
                  💼
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-bold text-text mb-0.5 leading-tight break-words">{selectedCareer.title}</h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <p className="text-[10px] md:text-[11px] font-bold text-primary bg-primary-light/50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md uppercase tracking-wider inline-block">{selectedCareer.department}</p>
                    <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider self-center ${typeBadgeColor[selectedCareer.type]?.replace('bg-', 'text-').replace('dark:bg-', 'dark:text-') || 'text-text-tertiary'}`}>
                      {selectedCareer.type}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeDetail}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl font-light text-text-tertiary hover:text-text transition-colors bg-surface/50 rounded-full"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6 md:space-y-8 custom-scrollbar">
              {/* Meta Stats */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-surface/50 p-3 md:p-4 rounded-xl border border-subtle">
                  <h4 className="text-[10px] md:text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5 md:mb-1">Location</h4>
                  <p className="text-xs md:text-sm font-bold text-text break-words">{selectedCareer.location}</p>
                </div>
                <div className="bg-surface/50 p-3 md:p-4 rounded-xl border border-subtle">
                  <h4 className="text-[10px] md:text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-0.5 md:mb-1">Experience</h4>
                  <p className="text-xs md:text-sm font-bold text-text break-words">{selectedCareer.experience}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg font-bold text-text flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">Role Overview</h3>
                <p className="text-xs md:text-base text-text-secondary leading-relaxed whitespace-pre-wrap break-all">
                  {selectedCareer.description}
                </p>
              </div>

              {/* Requirements */}
              {selectedCareer.requirements && (
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-text flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-subtle">Requirements</h3>
                  <ul className="space-y-3 md:space-y-4 list-none p-0">
                    {selectedCareer.requirements.split('\n').filter(Boolean).map((req, i) => (
                      <li key={i} className="text-xs md:text-base text-text-secondary flex gap-2 md:gap-3 items-start break-all">
                        <span className="text-primary mt-1 flex-shrink-0">✓</span>
                        <span className="leading-relaxed flex-1">{req.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-8 border-t border-subtle bg-surface/30 flex flex-wrap gap-3 md:gap-4 items-center justify-end flex-shrink-0">
              <button
                onClick={closeDetail}
                className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base text-text hover:text-primary font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => openApply(selectedCareer)}
                className="bg-primary text-white px-6 py-2 md:px-8 md:py-2.5 rounded-xl text-sm md:text-base font-bold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              >
                Apply for this Position
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedCareer && (
        <div
          className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4"
          onClick={closeApply}
        >
          <div
            className="bg-bg border border-subtle rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-subtle flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-text">Apply for Position</h3>
                <p className="text-[11px] text-text-tertiary mt-0.5 break-words">
                  {selectedCareer.title} · {selectedCareer.department}
                </p>
              </div>
              <button
                onClick={closeApply}
                className="text-text-tertiary hover:text-text text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 overflow-y-auto flex-1 custom-scrollbar">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-green-500">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-text mb-2">Application Submitted!</h4>
                  <p className="text-xs text-text-secondary mb-6 break-words">
                    Thanks for applying for <strong>{selectedCareer.title}</strong>. We'll review your application and get back to you soon.
                  </p>
                  <button
                    onClick={closeApply}
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className={`${inputCls} bg-surface py-2 text-xs`}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`${inputCls} bg-surface py-2 text-xs`}
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      className={`${inputCls} bg-surface py-2 text-xs ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={form.phone}
                      onChange={e => { 
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) {
                          setForm(f => ({ ...f, phone: val })); 
                          setErrors(er => ({ ...er, phone: '' })); 
                        }
                      }}
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
                      Cover Letter / Message *
                    </label>
                    <textarea
                      rows={3}
                      className={`${inputCls} bg-surface py-2 text-xs`}
                      placeholder="Tell us about yourself..."
                      value={form.message}
                      onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })); }}
                    />
                    {errors.message && <p className="text-[10px] text-red-500 mt-0.5">{errors.message}</p>}
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-subtle">
                    <button
                      type="button"
                      onClick={closeApply}
                      className="text-[11px] px-4 py-1.5 rounded-lg bg-surface border border-subtle text-text-secondary hover:bg-surface-hover transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 text-[11px] px-5 py-1.5 rounded-lg bg-primary hover:shadow-lg hover:shadow-primary/20 text-white font-semibold transition-all disabled:opacity-50"
                    >
                      {submitting ? (
                        <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                      ) : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
