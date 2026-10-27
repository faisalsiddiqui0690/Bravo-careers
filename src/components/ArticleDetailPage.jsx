import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getPublishedArticle, resolveImageUrl } from '../services/api';
import ukJourneyImage from '../assets/Twilight on Westminster Bridge.png';

export default function ArticleDetailPage() {
  const { type, slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublishedArticle(type, slug).then((entry) => {
      if (active) {
        setArticle(entry);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [type, slug]);

  if (loading) return <div className="min-h-[60vh] bg-white" />;
  if (!article || !['blog', 'news'].includes(type)) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen bg-white pb-20">
      <header className="bg-[#071a39] text-white">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-amber-300"><ArrowLeft size={16} /> Back to Bravo Careers</Link>
          <p className="mt-10 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">{article.category}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{article.excerpt}</p>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <img src={resolveImageUrl(article.image || '') || ukJourneyImage} alt={article.imageAlt || article.title} className="mb-10 max-h-[440px] w-full rounded-2xl object-cover" />
        <div className="space-y-5 text-base leading-8 text-slate-700">
          {article.content.split(/\r?\n\s*\r?\n/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {type === 'news' && article.externalUrl && (
          <a href={article.externalUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-300 px-5 py-3 text-sm font-bold text-[#071a39] hover:bg-amber-200">
            Read the official source <ArrowRight size={16} />
          </a>
        )}
      </article>
    </main>
  );
}
