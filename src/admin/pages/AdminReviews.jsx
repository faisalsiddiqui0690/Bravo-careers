import { useEffect, useMemo, useState } from 'react';
import { Check, Eye, EyeOff, MessageSquareQuote, Pencil, Plus, Search, ShieldCheck, Star, Trash2, X } from 'lucide-react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';
import { resolveImageUrl } from '../../services/api';
import fallbackAvatar from '../../assets/bravo-testimonial-avatar.svg';

const blankForm = {
  id: null,
  name: '',
  role: '',
  rating: 5,
  comment: '',
  image: '',
  permissionGranted: false,
  isPublished: false,
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300';

const TestimonialStars = ({ rating, interactive = false, onChange }) => (
  <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((value) => (
      <button
        key={value}
        type={interactive ? 'button' : undefined}
        onClick={interactive ? () => onChange(value) : undefined}
        disabled={!interactive}
        aria-label={interactive ? `Set ${value} star rating` : undefined}
        className={`rounded p-0.5 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${value <= rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
      >
        <Star size={interactive ? 25 : 15} fill="currentColor" strokeWidth={1.5} />
      </button>
    ))}
    <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">{rating}/5</span>
  </div>
);

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState(blankForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteReview, setDeleteReview] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const loadReviews = async () => {
    setLoading(true);
    setLoadError('');
    try {
      setReviews(await api.getReviews());
    } catch (error) {
      setLoadError(error.message || 'Could not load testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const publishedCount = reviews.filter((review) => review.isPublished && review.permissionGranted).length;
  const draftCount = reviews.length - publishedCount;
  const filteredReviews = useMemo(() => reviews.filter((review) => {
    const matchesSearch = `${review.name} ${review.role} ${review.comment}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'published' && review.isPublished && review.permissionGranted)
      || (statusFilter === 'draft' && !(review.isPublished && review.permissionGranted));
    return matchesSearch && matchesStatus;
  }), [reviews, search, statusFilter]);

  const startAdd = () => {
    setForm(blankForm);
    setShowForm(true);
  };

  const startEdit = (review) => {
    setForm({
      ...blankForm,
      ...review,
      permissionGranted: Boolean(review.permissionGranted),
      isPublished: Boolean(review.isPublished),
    });
    setShowForm(true);
  };

  const saveReview = async (event) => {
    event.preventDefault();
    if (form.isPublished && !form.permissionGranted) {
      setToast({ message: 'Confirm client permission before publishing this testimonial.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const { id, ...payload } = form;
      const response = id
        ? await api.updateReview(id, payload)
        : await api.createReview(payload);
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Could not save testimonial.');
      }
      setShowForm(false);
      setForm(blankForm);
      setToast({ message: id ? 'Testimonial updated.' : 'Testimonial added.', type: 'success' });
      await loadReviews();
    } catch (error) {
      setToast({ message: error.message || 'Could not save testimonial.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (review) => {
    if (!review.isPublished && !review.permissionGranted) {
      setToast({ message: 'Edit this testimonial and confirm client permission before publishing.', type: 'error' });
      return;
    }
    try {
      const response = await api.updateReview(review.id, { isPublished: !review.isPublished });
      if (!response?.success) throw new Error(response?.message || 'Could not update testimonial status.');
      setToast({ message: review.isPublished ? 'Testimonial moved to drafts.' : 'Testimonial published.', type: 'success' });
      await loadReviews();
    } catch (error) {
      setToast({ message: error.message || 'Could not update testimonial status.', type: 'error' });
    }
  };

  const removeReview = async () => {
    try {
      const response = await api.deleteReview(deleteReview.id);
      if (!response?.success) throw new Error(response?.message || 'Could not delete testimonial.');
      setDeleteReview(null);
      setToast({ message: 'Testimonial deleted.', type: 'success' });
      await loadReviews();
    } catch (error) {
      setToast({ message: error.message || 'Could not delete testimonial.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Website content</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Client testimonials</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Add genuine client feedback, record permission and choose which testimonials appear on the website.
          </p>
        </div>
        <button onClick={startAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          <Plus size={17} /> Add testimonial
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Total testimonials', reviews.length, MessageSquareQuote, 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'],
          ['Published on website', publishedCount, Eye, 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'],
          ['Drafts / need permission', draftCount, ShieldCheck, 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'],
        ].map(([label, count, Icon, color]) => (
          <article key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}><Icon size={20} /></span>
            <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '—' : count}</p><p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p></div>
          </article>
        ))}
      </section>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
        <strong>Before publishing:</strong> use feedback the client actually provided and make sure they have agreed to its publication. Drafts are private; only published testimonials with permission are shown publicly.
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage the feedback currently stored for the website.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search testimonials" className={`${inputClass} pl-9`} />
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass} aria-label="Filter testimonials by status">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft / permission needed</option>
            </select>
          </div>
        </div>

        {loadError && <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{loadError} <button onClick={loadReviews} className="ml-2 font-semibold underline">Retry</button></div>}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">Loading testimonials…</div>
        ) : filteredReviews.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredReviews.map((review) => {
              const isPublic = Boolean(review.isPublished && review.permissionGranted);
              return (
                <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.image ? resolveImageUrl(review.image) : fallbackAvatar}
                      alt=""
                      onError={(event) => { event.currentTarget.src = fallbackAvatar; }}
                      className="h-14 w-14 shrink-0 rounded-full border border-slate-200 bg-slate-50 object-cover dark:border-slate-700 dark:bg-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-slate-900 dark:text-white">{review.name}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isPublic ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                          {isPublic ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                      <div className="mt-2"><TestimonialStars rating={Number(review.rating) || 0} /></div>
                    </div>
                  </div>
                  <blockquote className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                    “{review.comment}”
                  </blockquote>
                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${review.permissionGranted ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                      <ShieldCheck size={14} /> {review.permissionGranted ? 'Client permission recorded' : 'Client permission not recorded'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => togglePublished(review)} disabled={!review.permissionGranted && !review.isPublished} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        {isPublic ? <><EyeOff size={14} /> Unpublish</> : <><Eye size={14} /> Publish</>}
                      </button>
                      <button onClick={() => startEdit(review)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Pencil size={14} /> Edit</button>
                      <button onClick={() => setDeleteReview(review)} aria-label={`Delete ${review.name}'s testimonial`} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"><MessageSquareQuote size={25} /></span>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{reviews.length ? 'No matching testimonials' : 'Your testimonials will be managed here'}</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              {reviews.length
                ? 'Try another search or choose a different publication status.'
                : 'Add a real client quote, rating and optional photo. Keep it as a draft while you confirm permission, then publish it to the client experiences section on your website.'}
            </p>
            {!reviews.length && <button onClick={startAdd} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16} /> Add first testimonial</button>}
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
          <form onSubmit={saveReview} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Client feedback</p><h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{form.id ? 'Edit testimonial' : 'Add testimonial'}</h2><p className="mt-1 text-sm text-slate-500">Enter an actual client-approved quote. No placeholder testimonials are published.</p></div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Client name<input required maxLength={255} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name as approved by the client" className={inputClass} /></label>
              <label className={labelClass}>Role or context<input required maxLength={255} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="e.g. Graduate, Founder, Career coaching client" className={inputClass} /></label>
              <label className={`${labelClass} sm:col-span-2`}>Client feedback<textarea required rows={5} value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} placeholder="Paste the client's feedback exactly as approved for publication." className={inputClass} /></label>
              <div className={labelClass}>
                <span>Rating</span>
                <div className="flex min-h-[44px] items-center"><TestimonialStars rating={Number(form.rating)} interactive onChange={(rating) => setForm({ ...form, rating })} /></div>
              </div>
              <label className={labelClass}>Photo URL (optional)<input type="url" value={form.image || ''} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://" className={inputClass} /></label>
              <label className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100 sm:col-span-2">
                <input type="checkbox" checked={Boolean(form.permissionGranted)} onChange={(event) => setForm({ ...form, permissionGranted: event.target.checked, isPublished: event.target.checked ? form.isPublished : false })} className="mt-0.5 h-4 w-4 accent-emerald-600" />
                <span><strong>Client permission confirmed.</strong> The client has agreed to publish this quote and any attached photo on Bravo Careers’ website.</span>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2">
                <input type="checkbox" checked={Boolean(form.isPublished)} disabled={!form.permissionGranted} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} className="h-4 w-4 accent-blue-600" />
                Publish this testimonial on the website
              </label>
            </div>
            {form.image && <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"><img src={resolveImageUrl(form.image)} alt="" onError={(event) => { event.currentTarget.src = fallbackAvatar; }} className="h-12 w-12 rounded-full object-cover" /><span className="text-xs text-slate-500">Photo preview</span></div>}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">Cancel</button>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"><Check size={16} /> {saving ? 'Saving…' : form.isPublished ? 'Save and publish' : 'Save as draft'}</button>
            </div>
          </form>
        </div>
      )}

      {deleteReview && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-slate-900"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete testimonial?</h2><p className="mt-2 text-sm text-slate-500">This will permanently remove {deleteReview.name}’s testimonial.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setDeleteReview(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Cancel</button><button onClick={removeReview} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button></div></div></div>}

      <AdminToast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
