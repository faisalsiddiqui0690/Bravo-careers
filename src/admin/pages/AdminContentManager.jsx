import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { resolveImageUrl } from '../../services/api';

const settings = {
  blog: { label: 'Blogs', singular: 'blog', load: api.getBlogs, create: api.createBlog, update: api.updateBlog, remove: api.deleteBlog, basePath: '/articles/blog' },
  news: { label: 'News', singular: 'news item', load: api.getNews, create: api.createNews, update: api.updateNews, remove: api.deleteNews, basePath: '/articles/news' },
};
const newForm = (type) => ({ id: null, title: '', slug: '', category: type === 'blog' ? 'Career guidance' : 'UK updates', excerpt: '', content: '', image: '', imageAlt: '', externalUrl: '', isPublished: false });
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const fieldClass = 'grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300';

export default function AdminContentManager({ type }) {
  const config = settings[type];
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(newForm(type));
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      setEntries(await config.load());
    } catch (error) {
      setLoadError(error.message || `Could not load ${config.label.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [type]);

  const filtered = useMemo(() => entries.filter((entry) => (
    `${entry.title} ${entry.category} ${entry.excerpt}`.toLowerCase().includes(search.toLowerCase())
  )), [entries, search]);

  const openEdit = (entry) => {
    setForm({ ...newForm(type), ...entry });
    setShowForm(true);
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const response = form.id
        ? await config.update(form.id, form)
        : await config.create(form);
      if (!response?.success) throw new Error(response?.message || response?.error || `Could not save ${config.singular}.`);
      setShowForm(false);
      setForm(newForm(type));
      setNotice(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} saved.`);
      await load();
    } catch (error) {
      setNotice(error.message || `Could not save ${config.singular}.`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      const response = await config.remove(deleteEntry.id);
      if (!response?.success) throw new Error(response?.message || response?.error || `Could not delete ${config.singular}.`);
      setDeleteEntry(null);
      setNotice(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} deleted.`);
      await load();
    } catch (error) {
      setNotice(error.message || `Could not delete ${config.singular}.`);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Website content</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{config.label}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Write, edit and publish content to the Bravo Careers website.</p>
        </div>
        <button onClick={() => { setForm(newForm(type)); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={17} /> Add {config.singular}</button>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{entries.length} total · {entries.filter((entry) => entry.isPublished).length} published</p>
        <label className="relative block sm:w-72"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${config.label.toLowerCase()}`} className={`${inputClass} pl-9`} /></label>
      </div>

      {notice && <p role="status" className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">{notice}</p>}
      {loadError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{loadError}</p>}
      <section className="grid gap-4 lg:grid-cols-2">
        {loading ? <p className="p-8 text-sm text-slate-500">Loading {config.label.toLowerCase()}…</p> : filtered.length ? filtered.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              {entry.image && <img src={resolveImageUrl(entry.image)} alt={entry.imageAlt || ''} className="h-20 w-24 shrink-0 rounded-xl object-cover" />}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{entry.category}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${entry.isPublished ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{entry.isPublished ? 'Published' : 'Draft'}</span></div>
                <h2 className="mt-2 font-semibold text-slate-900 dark:text-white">{entry.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{entry.excerpt}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              {entry.externalUrl ? <a href={entry.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">External source <ExternalLink size={13} /></a> : <a href={`${config.basePath}/${entry.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">Preview page <ExternalLink size={13} /></a>}
              <div className="flex gap-2">
                <button onClick={() => openEdit(entry)} aria-label={`Edit ${entry.title}`} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><Pencil size={15} /></button>
                <button onClick={() => setDeleteEntry(entry)} aria-label={`Delete ${entry.title}`} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"><Trash2 size={15} /></button>
              </div>
            </div>
          </article>
        )) : !loading && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">No {config.label.toLowerCase()} found.</p>}
      </section>

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
        <form onSubmit={save} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-900 dark:text-white">{form.id ? 'Edit' : 'Create'} {config.singular}</h2><p className="mt-1 text-sm text-slate-500">Drafts stay private until you publish them.</p></div><button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={`${fieldClass} sm:col-span-2`}>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></label>
            <label className={fieldClass}>URL slug<input value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Generated from the title" className={inputClass} /></label>
            <label className={fieldClass}>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} /></label>
            <label className={`${fieldClass} sm:col-span-2`}>Summary<textarea required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} /></label>
            <label className={`${fieldClass} sm:col-span-2`}>Full content<textarea required rows={9} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write the article content. Separate paragraphs with a blank line." className={inputClass} /></label>
            <label className={fieldClass}>Image URL<input value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} /></label>
            <label className={fieldClass}>Image alt text<input value={form.imageAlt || ''} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} className={inputClass} /></label>
            {type === 'news' && <label className={`${fieldClass} sm:col-span-2`}>Official source URL (optional)<input type="url" value={form.externalUrl || ''} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://" className={inputClass} /></label>}
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2"><input type="checkbox" checked={Boolean(form.isPublished)} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 accent-blue-600" /> Publish on the website</label>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800"><button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Cancel</button><button disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving…' : 'Save content'}</button></div>
        </form>
      </div>}

      {deleteEntry && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-slate-900"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete this {config.singular}?</h2><p className="mt-2 text-sm text-slate-500">This will permanently remove “{deleteEntry.title}”.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setDeleteEntry(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Cancel</button><button onClick={remove} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button></div></div></div>}
    </div>
  );
}
