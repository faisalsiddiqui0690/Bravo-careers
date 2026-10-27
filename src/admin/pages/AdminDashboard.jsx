import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, FileText, Newspaper, Star, Wrench, Inbox } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import api from '../services/api';

const cards = [
  { key: 'services', label: 'Services', path: '/admin/services', icon: Wrench, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  { key: 'blogs', label: 'Blogs', path: '/admin/blogs', icon: FileText, color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300' },
  { key: 'news', label: 'News', path: '/admin/news', icon: Newspaper, color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  { key: 'reviews', label: 'Testimonials', path: '/admin/reviews', icon: Star, color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' },
  { key: 'careers', label: 'Careers', path: '/admin/careers', icon: BriefcaseBusiness, color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300' },
  { key: 'enquiries', label: 'Enquiries', path: '/admin/enquiries', icon: Inbox, color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300' },
];

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [data, setData] = useState({ services: [], blogs: [], news: [], reviews: [], careers: [], enquiries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([
      api.getServices(),
      api.getBlogs(),
      api.getNews(),
      api.getReviews(),
      api.getCareers(),
      api.getEnquiries(),
    ]).then(([services, blogs, news, reviews, careers, enquiries]) => {
      if (active) setData({ services, blogs, news, reviews, careers, enquiries });
    }).catch((loadError) => {
      if (active) setError(loadError.message || 'Unable to load dashboard data.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => ({
    services: data.services.length,
    blogs: data.blogs.length,
    news: data.news.length,
    reviews: data.reviews.length,
    careers: data.careers.length,
    enquiries: data.enquiries.length,
  }), [data]);

  const recent = [...data.blogs.map((entry) => ({ ...entry, kind: 'Blog', path: '/admin/blogs' })),
    ...data.news.map((entry) => ({ ...entry, kind: 'News', path: '/admin/news' }))]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="space-y-7">
      <header className="rounded-3xl bg-gradient-to-br from-[#08234f] via-[#10366c] to-[#1d4e89] px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Bravo Careers admin</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Manage the services, articles, updates and client stories visitors see on the Bravo Careers website.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/admin/services" className="rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-[#08234f] hover:bg-amber-200">Manage services</Link>
          <Link to="/admin/blogs" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Create a blog <ArrowRight size={15} /></Link>
        </div>
      </header>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>}

      <section>
        <div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Content overview</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Current records managed by the Bravo Careers team.</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ key, label, path, icon: Icon, color }) => (
            <Link key={key} to={path} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
              <div className="flex items-center justify-between"><span className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}><Icon size={20} /></span><ArrowRight size={17} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" /></div>
              <p className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">{loading ? '—' : counts[key]}</p>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold text-slate-900 dark:text-white">Recently updated content</h2><p className="mt-1 text-xs text-slate-500">Latest blog posts and news updates.</p></div></div>
          {loading ? <p className="py-8 text-sm text-slate-500">Loading…</p> : recent.length ? <div className="divide-y divide-slate-100 dark:divide-slate-800">{recent.map((entry) => <Link key={`${entry.kind}-${entry.id}`} to={entry.path} className="flex items-center justify-between gap-4 py-3 no-underline"><div className="min-w-0"><span className="text-[11px] font-bold uppercase tracking-wide text-blue-600">{entry.kind}</span><p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{entry.title}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${entry.isPublished ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{entry.isPublished ? 'Published' : 'Draft'}</span></Link>)}</div> : <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-800/60">No articles yet. Create a blog or news item to get started.</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold text-slate-900 dark:text-white">Quick links</h2>
          <p className="mt-1 text-xs text-slate-500">Jump to a content workspace.</p>
          <div className="mt-4 grid gap-2">
            {[['Services', '/admin/services'], ['Blogs', '/admin/blogs'], ['News', '/admin/news'], ['Testimonials', '/admin/reviews']].map(([label, path]) => <Link key={path} to={path} className="flex items-center justify-between rounded-xl border border-slate-100 px-3.5 py-3 text-sm font-semibold text-slate-700 no-underline hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-900 dark:hover:bg-blue-950/30">{label}<ArrowRight size={15} /></Link>)}
          </div>
        </div>
      </section>
    </div>
  );
}
