import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';

const inputCls = 'w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors';

const typeBadge = {
  'Full-Time':  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'Part-Time':  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  'Internship': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  'Remote':     'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
};

const emptyForm = {
  title: '', department: '', location: 'Aurangabad, MH',
  type: 'Full-Time', experience: '0-1 years',
  description: '', requirements: '', isActive: true,
};

const Modal = ({ children, onClose, maxW = 'max-w-2xl' }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-full ${maxW} shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const Field = ({ label, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
      {label}{required && ' *'}
    </label>
    {children}
  </div>
);

export default function AdminCareers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchCareers = async () => {
    setLoading(true);
    const data = await api.getCareers();
    setCareers(data);
    setLoading(false);
  };

  useEffect(() => { fetchCareers(); }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return careers.filter(c => {
      const matchesSearch = 
        c.title.toLowerCase().includes(term) ||
        c.department.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term);
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && c.isActive) || 
        (statusFilter === 'inactive' && !c.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [careers, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (career) => {
    setEditTarget(career);
    setForm({
      title: career.title,
      department: career.department,
      location: career.location,
      type: career.type,
      experience: career.experience,
      description: career.description,
      requirements: career.requirements || '',
      isActive: career.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Job Title is required', 'error');
      return;
    }
    if (!form.department.trim()) {
      showToast('Department is required', 'error');
      return;
    }
    if (!form.description.trim()) {
      showToast('Description is required', 'error');
      return;
    }
    setSaving(true);
    let res;
    if (editTarget) {
      res = await api.updateCareer(editTarget.id, form);
    } else {
      res = await api.createCareer(form);
    }
    setSaving(false);
    if (res.success) {
      showToast(editTarget ? 'Career updated successfully' : 'Career created successfully');
      setShowModal(false);
      fetchCareers();
    } else {
      showToast(res.error || 'Failed to save career', 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteCareer(id);
    if (res.success) {
      showToast('Career deleted successfully');
      fetchCareers();
    } else {
      showToast(res.error || 'Failed to delete career', 'error');
    }
    setShowDeleteConfirm(null);
  };

  const handleToggleActive = async (career) => {
    const res = await api.updateCareer(career.id, { isActive: !career.isActive });
    if (res.success) {
      showToast(`Career ${career.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchCareers();
    } else {
      showToast('Failed to update status', 'error');
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Careers</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {filtered.length} matching · {careers.filter(c => c.isActive).length} active total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'inactive', label: 'Deactive' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setStatusFilter(option.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === option.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search careers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-48 transition-colors"
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
          >
            + Add Position
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Position', 'Department', 'Type', 'Experience', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loading careers...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-30">💼</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No career postings found</p>
                      <button onClick={openCreate} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1">
                        Add a position
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentData.map((career, i) => (
                <tr
                  key={career.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${i !== currentData.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{career.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{career.location}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{career.department}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeBadge[career.type] || 'bg-gray-100 text-gray-600'}`}>
                      {career.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{career.experience}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      career.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {career.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(career)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(career)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          career.isActive
                            ? 'bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/30'
                            : 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                        }`}
                      >
                        {career.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(career.id)}
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
              Showing <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="text-gray-900 dark:text-white">{filtered.length}</span> positions
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

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {editTarget ? 'Edit Position' : 'Add New Position'}
            </h3>
            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none transition-colors">×</button>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Job Title" required>
                <input type="text" className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Frontend Developer" />
              </Field>
              <Field label="Department" required>
                <input type="text" className={inputCls} value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Engineering" />
              </Field>
              <Field label="Location">
                <input type="text" className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Aurangabad, MH" />
              </Field>
              <Field label="Experience">
                <input type="text" className={inputCls} value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 1-3 years" />
              </Field>
              <Field label="Type">
                <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                </select>
              </Field>
              <Field label="Status">
                <select className={inputCls} value={form.isActive ? 'active' : 'inactive'} onChange={e => set('isActive', e.target.value === 'active')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            </div>
            <Field label="Description" required>
              <textarea rows={4} className={inputCls} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role and responsibilities..." />
            </Field>
            <Field label="Requirements">
              <textarea rows={4} className={inputCls} value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="List requirements, one per line..." />
              <p className="text-[10px] text-gray-400 dark:text-gray-500">One requirement per line. Bullet points optional.</p>
            </Field>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setShowModal(false)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 text-xs px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50">
                {saving ? (
                  <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : editTarget ? 'Update Position' : 'Create Position'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(null)} maxW="max-w-sm">
          <div className="px-6 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-red-600 dark:text-red-400">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Delete Position?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      <AdminToast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
