import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLegalPage } from '../services/api';

const LegalPageView = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      setError(false);
      
      const data = await getLegalPage(slug);
      
      if (data) {
        setPage(data);
      } else {
        setError(true);
      }
      
      setLoading(false);
    };

    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-text mb-2">Page Not Found</h1>
          <p className="text-text-secondary mb-6">The page you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-16 md:py-24">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">{page.title}</h1>
          <p className="text-sm text-text-secondary">
            Last updated: {new Date(page.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-surface border border-subtle rounded-2xl p-6 md:p-10">
          <div 
            className="legal-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Footer CTA */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-text-secondary mb-4">Have questions about our policies?</p>
          <Link to="/contact" className="btn-primary inline-block">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default LegalPageView;
