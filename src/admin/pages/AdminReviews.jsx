import { useState, useMemo, useEffect } from 'react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';

const emptyForm = { id: null, name: '', role: '', rating: 5, comment: '' };

const inputCls = "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 transition-all w-full";

const Stars = ({ count }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={`text-sm ${i <= count ? 'text-amber-400' : 'text-gray-700 dark:text-gray-500'}`}>★</span>
    ))}
  </div>
);

const Modal = ({ children, onClose, maxW = 'max-w-lg' }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl w-full ${maxW} shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setLoading(true);
    const data = await api.getReviews();
    setReviews(data);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return reviews.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.role.toLowerCase().includes(term) ||
      r.comment.toLowerCase().includes(term)
    );
  }, [reviews, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (r) => { setForm({ ...r }); setEditId(r.id); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setToast({ message: 'Reviewer name is required', type: 'error' });
      return;
    }
    if (!form.role.trim()) {
      setToast({ message: 'Role / Company is required', type: 'error' });
      return;
    }
    if (!form.comment.trim()) {
      setToast({ message: 'Review comment is required', type: 'error' });
      return;
    }
    const res = editId ? await api.updateReview(editId, form) : await api.createReview(form);
    if (res.success) {
      setToast({ message: editId ? 'Review updated successfully' : 'Review added successfully', type: 'success' });
      setShowModal(false);
      await loadReviews();
    } else {
      setToast({ message: res.error || 'Failed to save review', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteReview(id);
    if (res.success) {
      setToast({ message: 'Review deleted successfully', type: 'success' });
      setDeleteId(null);
      await loadReviews();
    } else {
      setToast({ message: res.error || 'Failed to delete review', type: 'error' });
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{reviews.length} total reviews</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-48 transition-colors"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
          >
            + Add Review
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                {['Name', 'Role', 'Rating', 'Comment', 'Actions'].map(h => (
                  <th key={h} className={`text-left text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest px-4 py-3 ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loading reviews...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-30">⭐</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No reviews found</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.map((r, i) => (
                <tr
                  key={r.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${i !== currentData.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''}`}
                >
                  {/* Name + avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0">
                        {r.name[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">{r.role}</td>
                  <td className="px-4 py-3"><Stars count={r.rating} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 min-w-[200px] max-w-sm">
                    <p className="whitespace-pre-wrap">{r.comment}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(r.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              Showing <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="text-gray-900 dark:text-white">{filtered.length}</span> reviews
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[32px] h-8 text-xs font-bold rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{editId ? 'Edit Review' : 'Add Review'}</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
            <FormField label="Name *">
              <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Reviewer name" />
            </FormField>
            <FormField label="Role / Company *">
              <input className={inputCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="CEO, Company Name" />
            </FormField>
            <FormField label="Rating">
              {/* Interactive star picker */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    className={`text-2xl transition-colors ${n <= form.rating ? 'text-amber-400' : 'text-gray-700 dark:text-gray-500 hover:text-amber-300'}`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{form.rating} / 5</span>
              </div>
            </FormField>
            <FormField label="Comment *">
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.comment}
                onChange={e => setForm({ ...form, comment: e.target.value })}
                placeholder="Write the review comment..."
              />
            </FormField>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
            <button onClick={() => setShowModal(false)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              Cancel
            </button>
            <button onClick={handleSave} className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
              {editId ? 'Update' : 'Add'} Review
            </button>
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
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Delete this review?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-600">
            <button onClick={() => setDeleteId(null)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              Cancel
            </button>
            <button onClick={() => handleDelete(deleteId)} className="text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all">
              Delete
            </button>
          </div>
        </Modal>
      )}

      <AdminToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default AdminReviews;