import { useState, useMemo, useEffect, useRef } from 'react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';

const emptyForm = { id: null, icon: '', title: '', description: '', tagline: '', features: [] };

const inputCls = "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-full";

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

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await api.getServices();
    setServices(data);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return services.filter(s =>
      s.title.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
  }, [services, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const openAdd = () => { 
    setForm(emptyForm); 
    setEditId(null); 
    setImageFile(null);
    setImagePreview(null);
    setFeatureInput('');
    setShowModal(true); 
  };

  const openEdit = (service) => {
    let parsedFeatures = [];
    
    // Parse features field
    if (service.features) {
      if (typeof service.features === 'string') {
        try {
          parsedFeatures = JSON.parse(service.features);
          if (!Array.isArray(parsedFeatures)) {
            parsedFeatures = [];
          }
        } catch (e) {
          console.error('Error parsing features:', e);
          parsedFeatures = [];
        }
      } else if (Array.isArray(service.features)) {
        parsedFeatures = service.features;
      }
    }
    
    setForm({ 
      id: service.id,
      icon: service.icon || '',
      title: service.title || '',
      description: service.description || '',
      tagline: service.tagline || '',
      features: parsedFeatures
    }); 
    setEditId(service.id); 
    setImageFile(null);
    setImagePreview(service.icon || null);
    setFeatureInput('');
    setShowModal(true); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: 'Image size must be less than 5MB', type: 'error' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const data = await api.uploadServiceIcon(formData);
      setUploading(false);
      
      if (data?.success) {
        return data.data.imageUrl;
      } else if (data) {
        setToast({ message: data.error || 'Failed to upload image', type: 'error' });
        return null;
      }
    } catch (error) {
      setUploading(false);
      setToast({ message: 'Network error while uploading image', type: 'error' });
      return null;
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setToast({ message: 'Service title is required', type: 'error' });
      return;
    }
    if (!form.description.trim()) {
      setToast({ message: 'Service description is required', type: 'error' });
      return;
    }
    
    let iconUrl = form.icon || '';
    
    // Upload new image if selected
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        iconUrl = uploadedUrl;
      } else {
        return; // Stop if upload failed
      }
    }
    
    const data = { 
      title: form.title,
      description: form.description,
      tagline: form.tagline || '',
      icon: iconUrl,
      features: JSON.stringify(form.features || [])
    };
    
    try {
      const res = editId ? await api.updateService(editId, data) : await api.createService(data);
      if (res.success) {
        setToast({ message: editId ? 'Service updated successfully' : 'Service added successfully', type: 'success' });
        setShowModal(false);
        setImageFile(null);
        setImagePreview(null);
        await loadServices();
      } else {
        setToast({ message: res.error || 'Failed to save service', type: 'error' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setToast({ message: 'Network error while saving service', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteService(id);
    if (res.success) {
      setToast({ message: 'Service deleted successfully', type: 'success' });
      setDeleteId(null);
      await loadServices();
    } else {
      setToast({ message: res.error || 'Failed to delete service', type: 'error' });
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Services</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{services.length} total services</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-48 transition-colors"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
          >
            + Add Service
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                {['', 'Title', 'Description', 'Actions'].map(h => (
                  <th key={h} className={`text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loading services...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-30">⚙️</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No services found</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.map((s, i) => (
                <tr
                  key={s.id}
                  className={`transition-colors ${i !== currentData.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''}`}
                >
                  <td className="px-4 py-3 w-16">
                    {s.icon && (s.icon.includes('media.ipshopy.com') || s.icon.startsWith('/uploads')) ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                        <img 
                          src={s.icon}
                          alt={s.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.parentElement.innerHTML = '<span class="w-full h-full flex items-center justify-center text-2xl">🌐</span>'; }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <span className="text-2xl">{s.icon || '🌐'}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{s.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 min-w-[300px] max-w-lg">
                    <div>
                      <p 
                        className={`whitespace-pre-wrap ${!expandedDescriptions[s.id] ? 'line-clamp-3' : ''}`}
                        style={!expandedDescriptions[s.id] ? {
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        } : {}}
                      >
                        {s.description}
                      </p>
                      {s.description && s.description.split('\n').length > 3 && (
                        <button
                          onClick={() => setExpandedDescriptions(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                          className="text-blue-600 dark:text-blue-400 text-xs font-semibold mt-1 hover:underline"
                        >
                          {expandedDescriptions[s.id] ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
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
              Showing <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="text-gray-900 dark:text-white">{filtered.length}</span> services
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{editId ? 'Edit Service' : 'Add Service'}</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
            <FormField label="Service Image">
              <div className="space-y-2">
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => { 
                        setImageFile(null); 
                        setImagePreview(null); 
                        setForm({ ...form, icon: '' });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-all"
                    >
                      ×
                    </button>
                  </div>
                )}
                {!imagePreview && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="text-3xl mb-2">📷</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">PNG, JPG, JPEG, JFIF, GIF, WEBP, BMP, SVG (MAX. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,.jfif"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </FormField>
            <FormField label="Title *">
              <input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Service title" />
            </FormField>
            <FormField label="Description *">
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief service description"
              />
            </FormField>
            <FormField label="Tagline (Short catchy subtitle for hero section)">
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
                placeholder="e.g. End-to-end e-commerce solutions that boost sales and reduce operational friction"
              />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">This will be displayed in the hero section of the service detail page</p>
            </FormField>
            <FormField label="Key Features">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={inputCls}
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (featureInput.trim()) {
                          setForm({ ...form, features: [...(form.features || []), featureInput.trim()] });
                          setFeatureInput('');
                        }
                      }
                    }}
                    placeholder="Type a feature and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setForm({ ...form, features: [...(form.features || []), featureInput.trim()] });
                        setFeatureInput('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    Add
                  </button>
                </div>
                {form.features && Array.isArray(form.features) && form.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600">
                    {form.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => {
                            setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
                          }}
                          className="ml-1 text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Add key features that will be displayed on the service detail page</p>
              </div>
            </FormField>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
            <button onClick={() => setShowModal(false)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={uploading}
              className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>{editId ? 'Update' : 'Add'} Service</>
              )}
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
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Delete this service?</p>
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

export default AdminServices;