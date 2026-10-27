import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowDownToLine, ArrowRight, BookOpen, CheckCircle2, FileText } from 'lucide-react';
import { resources } from '../data/resources';
import { createResourcePdf } from '../utils/resourcePdf';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const blankForm = { name: '', email: '', phone: '', details: '', consent: false };

export default function ResourcesPage() {
  const { type } = useParams();
  const resourceType = type === 'ebooks' ? 'ebooks' : 'free';
  const items = resources[resourceType];
  const [selectedId, setSelectedId] = useState(items[0].id);
  const [form, setForm] = useState(blankForm);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const selectedResource = useMemo(
    () => items.find((item) => item.id === selectedId) || items[0],
    [items, selectedId],
  );

  useEffect(() => {
    setSelectedId(items[0].id);
    setStatus({ loading: false, error: '', success: '' });
  }, [items]);

  const handleChange = (event) => {
    const { name, value, checked, type: inputType } = event.target;
    setForm((current) => ({ ...current, [name]: inputType === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: `Resource request: ${selectedResource.title}`,
          message: `Requested ${resourceType === 'ebooks' ? 'e-book' : 'free resource'}: ${selectedResource.title}\n\nWhat the visitor shared:\n${form.details.trim()}`,
          type: 'General',
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'We could not submit your request. Please try again.');
      }

      const pdf = createResourcePdf(selectedResource);
      const downloadUrl = URL.createObjectURL(pdf);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = `${selectedResource.id}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      setForm(blankForm);
      setStatus({ loading: false, error: '', success: `Thanks! Your "${selectedResource.title}" PDF is downloading now.` });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || 'We could not submit your request. Please check your connection and try again.',
        success: '',
      });
    }
  };

  return (
    <main className="bravo-resources-page">
      <section className="bravo-resources-hero">
        <div className="bravo-resources-container">
          <p className="bravo-resources-eyebrow">BRAVO CAREERS LIBRARY</p>
          <h1>Practical resources for your next step.</h1>
          <p>Choose a guide, tell us where to send your request, and download the PDF after submitting the form.</p>
          <div className="bravo-resource-tabs" aria-label="Resource type">
            <Link className={resourceType === 'free' ? 'is-active' : ''} to="/resources/free-resources">
              <FileText size={17} /> Free Resources
            </Link>
            <Link className={resourceType === 'ebooks' ? 'is-active' : ''} to="/resources/ebooks">
              <BookOpen size={17} /> E-Books
            </Link>
          </div>
        </div>
      </section>

      <section className="bravo-resources-content">
        <div className="bravo-resources-container">
          {resourceType === 'ebooks' && (
            <div className="bravo-ebook-notice">
              <BookOpen size={19} />
              <p><strong>Payment is not connected yet.</strong> For now, e-books are available after you submit the request form. No payment is taken.</p>
            </div>
          )}
          <div className="bravo-resource-layout">
            <div className="bravo-resource-list">
              {items.map((item) => {
                const isSelected = selectedResource.id === item.id;
                return (
                  <article className={`bravo-resource-card ${isSelected ? 'is-selected' : ''}`} key={item.id}>
                    <div className="bravo-resource-card-icon">{resourceType === 'ebooks' ? <BookOpen size={22} /> : <FileText size={22} />}</div>
                    <div>
                      <p className="bravo-resource-card-type">{resourceType === 'ebooks' ? 'E-BOOK · PDF' : 'FREE DOWNLOAD · PDF'}</p>
                      <h2>{item.title}</h2>
                      <p className="bravo-resource-card-description">{item.description}</p>
                      <button
                        type="button"
                        className="bravo-resource-select"
                        onClick={() => {
                          setSelectedId(item.id);
                          setStatus({ loading: false, error: '', success: '' });
                        }}
                        aria-pressed={isSelected}
                      >
                        {isSelected ? 'Selected' : 'Get this guide'} <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="bravo-resource-form-panel" id="resource-request">
              <p className="bravo-resources-eyebrow">YOUR SELECTED PDF</p>
              <h2>{selectedResource.title}</h2>
              <p className="bravo-resource-form-intro">Complete the form to submit your request and download this guide.</p>
              <form className="bravo-resource-form" onSubmit={handleSubmit}>
                <label>
                  Full name
                  <input name="name" autoComplete="name" value={form.name} onChange={handleChange} required maxLength={255} />
                </label>
                <label>
                  Email address
                  <input name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required maxLength={255} />
                </label>
                <label>
                  Phone number
                  <input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} required maxLength={20} />
                </label>
                <label>
                  What would you like help with?
                  <textarea name="details" value={form.details} onChange={handleChange} rows="4" minLength="10" maxLength="2000" required />
                </label>
                <label className="bravo-resource-consent">
                  <input name="consent" type="checkbox" checked={form.consent} onChange={handleChange} required />
                  <span>I agree to share these details with Bravo Careers to process my resource request.</span>
                </label>
                <button className="bravo-resource-submit" type="submit" disabled={status.loading}>
                  {status.loading ? 'Submitting...' : 'Submit and download PDF'}
                  {!status.loading && <ArrowDownToLine size={17} />}
                </button>
                <p className="bravo-resource-privacy">Your details are used to process this request. See our <Link to="/legal/privacy-policy">Privacy Policy</Link>.</p>
                <p className="bravo-resource-status is-error" role="alert">{status.error}</p>
                <p className="bravo-resource-status is-success" role="status">{status.success && <><CheckCircle2 size={16} /> {status.success}</>}</p>
              </form>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
