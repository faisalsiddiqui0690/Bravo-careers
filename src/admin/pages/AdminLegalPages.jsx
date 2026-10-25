import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';

const emptyForm = { id: null, slug: '', title: '', content: '', metaDescription: '', isPublished: true };

const Modal = ({ children, onClose, maxW = 'max-w-4xl' }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl w-full ${maxW} shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const FormField = ({ label, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const AdminLegalPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => { loadPages(); }, []);

  const loadPages = async () => {
    setLoading(true);
    const data = await api.getLegalPages();
    setPages(data);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return pages.filter(p => p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term));
  }, [pages, search]);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (page) => { setForm(page); setEditId(page.id); setShowModal(true); };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.title.trim() || !form.content.trim()) {
      setToast({ message: 'Slug, Title, and Content are required', type: 'error' });
      return;
    }

    const data = { 
      slug: form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      title: form.title,
      content: form.content,
      metaDescription: form.metaDescription,
      isPublished: form.isPublished,
      lastUpdatedBy: 'Admin'
    };

    try {
      const res = editId ? await api.updateLegalPage(editId, data) : await api.createLegalPage(data);
      if (res.success) {
        setToast({ message: editId ? 'Page updated successfully' : 'Page created successfully', type: 'success' });
        setShowModal(false);
        await loadPages();
      } else {
        setToast({ message: res.error || 'Failed to save page', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Network error', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteLegalPage(id);
    if (res.success) {
      setToast({ message: 'Page deleted successfully', type: 'success' });
      setDeleteId(null);
      await loadPages();
    } else {
      setToast({ message: res.error || 'Failed to delete page', type: 'error' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Legal Pages</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pages.length} total pages</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" placeholder="Search pages..." value={search} onChange={e => setSearch(e.target.value)} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-48 transition-colors" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all">
            + Add Page
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                {['Title', 'Slug', 'Status', 'Last Updated', 'Actions'].map(h => (
                  <th key={h} className={`text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center"><div className="flex flex-col items-center gap-3"><div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" /><p className="text-sm text-gray-500 dark:text-gray-400">Loading pages...</p></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center"><div className="flex flex-col items-center gap-2"><span className="text-4xl opacity-30">📄</span><p className="text-sm text-gray-500 dark:text-gray-400">No pages found</p></div></td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} className={`transition-colors ${i !== filtered.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.title}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-600 dark:text-gray-400">/{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${p.isPublished ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{new Date(p.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Edit</button>
                      <button onClick={() => setDeleteId(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{editId ? 'Edit Page' : 'Add Page'}</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
            <FormField label="Slug" required>
              <input className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-mono" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="privacy-policy" disabled={!!editId} />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">URL-friendly identifier (cannot be changed after creation)</p>
            </FormField>
            <FormField label="Title" required>
              <input className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Privacy Policy" />
            </FormField>
            <FormField label="Content" required>
              <textarea className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none" rows={12} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="<h1>Privacy Policy</h1><p>Your content here...</p>" />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">You can use HTML tags for formatting</p>
            </FormField>
            <FormField label="Meta Description">
              <textarea className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none" rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} placeholder="SEO description (optional)" />
            </FormField>
            <FormField label="Status">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Published (visible on website)</span>
              </label>
            </FormField>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
            <button onClick={() => setShowModal(false)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Cancel</button>
            <button onClick={handleSave} className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">{editId ? 'Update' : 'Create'} Page</button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <Modal onClose={() => setDeleteId(null)} maxW="max-w-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Confirm Delete</h3>
            <button onClick={() => setDeleteId(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <div className="px-5 py-5">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center text-2xl mb-4">🗑️</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Delete this page?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-600">
            <button onClick={() => setDeleteId(null)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} className="text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all">Delete</button>
          </div>
        </Modal>
      )}

      <AdminToast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default AdminLegalPages;
