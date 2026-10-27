import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, ExternalLink, X } from 'lucide-react';
import api from '../services/api';
import { resolveImageUrl } from '../../services/api';

const blank = {
  id: null, title: '', slug: '', icon: 'Briefcase', description: '', image: '', imageAlt: '',
  detailIntro: '', detailDescription: '', points: '', outcomes: '', isPublished: true,
};
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const fieldClass = 'grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300';
const listToText = (value) => Array.isArray(value) ? value.join('\n') : '';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [notice, setNotice] = useState('');

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      setServices(await api.getServices());
    } catch (loadError) {
      setError(loadError.message || 'Could not load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  const filtered = useMemo(() => services.filter((service) => (
    `${service.title} ${service.description}`.toLowerCase().includes(search.toLowerCase())
  )), [services, search]);

  const edit = (service) => {
    setForm({
      ...blank,
      ...service,
      points: listToText(service.points),
      outcomes: listToText(service.outcomes),
    });
    setShowForm(true);
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    const data = {
      ...form,
      points: form.points.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
      outcomes: form.outcomes.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
    };
    try {
      const response = form.id
        ? await api.updateService(form.id, data)
        : await api.createService(data);
      if (!response?.success) throw new Error(response?.message || response?.error || 'Could not save this service.');
      setShowForm(false);
      setForm(blank);
      setNotice('Service saved successfully.');
      await loadServices();
    } catch (saveError) {
      setNotice(saveError.message || 'Could not save this service.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      const response = await api.deleteService(id);
      if (!response?.success) throw new Error(response?.message || response?.error || 'Could not delete service.');
      setDeleteId(null);
      setNotice('Service deleted.');
      await loadServices();
    } catch (deleteError) {
      setNotice(deleteError.message || 'Could not delete service.');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Website content</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage service cards and their public detail pages.</p>
        </div>
        <button onClick={() => { setForm(blank); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          <Plus size={17} /> Add service
        </button>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{services.length} services · {services.filter((service) => service.isPublished).length} published</p>
        <label className="relative block sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" className={`${inputClass} pl-9`} />
        </label>
      </div>

      {notice && <p role="status" className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
      <section className="grid gap-4 lg:grid-cols-2">
        {loading ? <p className="p-8 text-sm text-slate-500">Loading services…</p> : filtered.length ? filtered.map((service) => (
          <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-900 dark:text-white">{service.title}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${service.isPublished ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{service.isPublished ? 'Published' : 'Draft'}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">/{service.slug}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
              </div>
              {service.image && <img src={resolveImageUrl(service.image)} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <a href={`/services/${service.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-300">
                View page <ExternalLink size={13} />
              </a>
              <div className="flex gap-2">
                <button onClick={() => edit(service)} aria-label={`Edit ${service.title}`} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><Pencil size={15} /></button>
                <button onClick={() => setDeleteId(service.id)} aria-label={`Delete ${service.title}`} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"><Trash2 size={15} /></button>
              </div>
            </div>
          </article>
        )) : !loading && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">No services match your search.</p>}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
          <form onSubmit={save} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-slate-900 dark:text-white">{form.id ? 'Edit service' : 'Add service'}</h2><p className="mt-1 text-sm text-slate-500">Content appears on the public service list and detail page.</p></div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldClass}>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></label>
              <label className={fieldClass}>URL slug<input value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from title" className={inputClass} /></label>
              <label className={fieldClass}>Icon name<input value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Briefcase, Sparkles, GraduationCap…" className={inputClass} /></label>
              <label className={fieldClass}>Image URL<input value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} /></label>
              <label className={`${fieldClass} sm:col-span-2`}>Card description<textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} /></label>
              <label className={fieldClass}>Image alt text<input value={form.imageAlt || ''} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} className={inputClass} /></label>
              <label className={fieldClass}>Detail page introduction<input value={form.detailIntro || ''} onChange={(e) => setForm({ ...form, detailIntro: e.target.value })} className={inputClass} /></label>
              <label className={`${fieldClass} sm:col-span-2`}>Detail page description<textarea rows={4} value={form.detailDescription || ''} onChange={(e) => setForm({ ...form, detailDescription: e.target.value })} className={inputClass} /></label>
              <label className={fieldClass}>Card bullet points<textarea rows={4} value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} placeholder="One point per line" className={inputClass} /></label>
              <label className={fieldClass}>Detail page outcomes<textarea rows={4} value={form.outcomes} onChange={(e) => setForm({ ...form, outcomes: e.target.value })} placeholder="One outcome per line" className={inputClass} /></label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2"><input type="checkbox" checked={Boolean(form.isPublished)} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 accent-blue-600" /> Publish on the website</label>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Cancel</button>
              <button disabled={saving} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving…' : 'Save service'}</button>
            </div>
          </form>
        </div>
      )}

      {deleteId && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-slate-900"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete this service?</h2><p className="mt-2 text-sm text-slate-500">The service page will no longer be published.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setDeleteId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Cancel</button><button onClick={() => remove(deleteId)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button></div></div></div>}
    </div>
  );
}
