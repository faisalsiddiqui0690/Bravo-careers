import { useState, useEffect } from 'react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';

const statusBadge = {
  New:     'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Read:    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  Replied: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Closed:  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

const typeBadge = {
  General: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Career:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
};

const Modal = ({ children, onClose, maxW = 'max-w-lg' }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-full ${maxW} shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchEnquiries = async () => {
    setLoading(true);
    const data = await api.getEnquiries();
    setEnquiries(data);
    setLoading(false);
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const openDetail = async (enquiry) => {
    setSelected(enquiry);
    // Mark as Read if New
    if (enquiry.status === 'New') {
      const res = await api.updateEnquiry(enquiry.id, { status: 'Read' });
      if (res.success) {
        setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, status: 'Read' } : e));
        setSelected({ ...enquiry, status: 'Read' });
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    const res = await api.updateEnquiry(id, { status });
    if (res.success) {
      showToast(`Status updated to ${status}`);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      if (selected?.id === id) setSelected(s => ({ ...s, status }));
    } else {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteEnquiry(id);
    if (res.success) {
      showToast('Enquiry deleted');
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selected?.id === id) setSelected(null);
    } else {
      showToast('Failed to delete enquiry', 'error');
    }
    setShowDeleteConfirm(null);
  };

  const searchFiltered = enquiries.filter(e => {
    const matchType = filterType === 'All' || e.type === filterType;
    const matchSearch = search === '' || 
      e.name.toLowerCase().includes(search.toLowerCase()) || 
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const filtered = searchFiltered.filter(e => {
    return filterStatus === 'All' || e.status === filterStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterType]);

  const counts = {
    All: searchFiltered.length,
    New: searchFiltered.filter(e => e.status === 'New').length,
    Read: searchFiltered.filter(e => e.status === 'Read').length,
    Replied: searchFiltered.filter(e => e.status === 'Replied').length,
    Closed: searchFiltered.filter(e => e.status === 'Closed').length,
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enquiries</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {counts.All} matching · {counts.New} new
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-48 transition-colors"
            />
          </div>
          <button
            onClick={fetchEnquiries}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'New', 'Read', 'Replied', 'Closed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                filterStatus === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {s} {s !== 'All' && counts[s] > 0 && <span className="ml-1 opacity-70">({counts[s]})</span>}
            </button>
          ))}
        </div>
        {/* Type filter */}
        <div className="flex items-center gap-1.5 ml-auto">
          {['All', 'General', 'Career'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                filterType === t
                  ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['From', 'Subject', 'Type', 'Status', 'Date', 'Actions'].map(h => (
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loading enquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-30">📬</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No enquiries found</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.map((enq, i) => (
                <tr
                  key={enq.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${i !== currentData.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''} ${enq.status === 'New' ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                  onClick={() => openDetail(enq)}
                >
                  <td className="px-4 py-3">
                    <p className={`text-sm font-medium ${enq.status === 'New' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                      {enq.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{enq.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{enq.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeBadge[enq.type] || 'bg-gray-100 text-gray-600'}`}>
                      {enq.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[enq.status] || 'bg-gray-100 text-gray-600'}`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openDetail(enq)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(enq.id)}
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
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              Showing <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="text-gray-900 dark:text-white">{filtered.length}</span> enquiries
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

      {/* Detail Modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)} maxW="max-w-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Enquiry Detail</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">#{selected.id}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none transition-colors">×</button>
          </div>
          <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
            {/* Sender info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">From</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selected.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selected.email}</p>
                {selected.phone && <p className="text-xs text-gray-500 dark:text-gray-400">{selected.phone}</p>}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Details</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeBadge[selected.type] || 'bg-gray-100 text-gray-600'}`}>
                    {selected.type}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[selected.status] || 'bg-gray-100 text-gray-600'}`}>
                    {selected.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Career info */}
            {selected.type === 'Career' && selected.careerTitle && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Applied For</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{selected.careerTitle}</p>
              </div>
            )}

            {/* Subject */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Subject</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white break-words">{selected.subject}</p>
            </div>

            {/* Message */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Message</p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed break-all">{selected.message}</p>
              </div>
            </div>

            {/* Status update */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['New', 'Read', 'Replied', 'Closed'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selected.id, s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      selected.status === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => { setShowDeleteConfirm(selected.id); setSelected(null); }}
              className="text-xs px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
            >
              Delete Enquiry
            </button>
            <button
              onClick={() => setSelected(null)}
              className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(null)} maxW="max-w-sm">
          <div className="px-6 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-red-600 dark:text-red-400">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Delete Enquiry?</h3>
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
