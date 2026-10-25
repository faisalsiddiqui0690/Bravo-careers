import { useState, useMemo, useEffect, useRef } from 'react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';

const emptyForm = { id: null, title: '', category: '', client: '', description: '', tagline: '', technologies: '', image: '', images: [], liveUrl: '' };

const inputCls = "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all";

const Modal = ({ children, onClose, maxW = 'max-w-lg' }) => (
  <div
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl w-full ${maxW} shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      onClick={e => e.stopPropagation()}
    >
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

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const multiFileInputRef = useRef(null);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await api.getProjects();
    const parsed = data.map(p => ({
      ...p,
      technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies,
      images: Array.isArray(p.images) ? p.images : (p.images ? JSON.parse(p.images) : [])
    }));
    setProjects(parsed);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return projects.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.client.toLowerCase().includes(term)
    );
  }, [projects, search]);

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
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true); 
  };

  const openEdit = (project) => {
    setForm({ 
      ...project, 
      technologies: project.technologies.join(', '), 
      tagline: project.tagline || '',
      images: project.images || [],
      liveUrl: project.liveUrl || ''
    });
    setEditId(project.id);
    setImageFile(null);
    // Handle both Azure URLs (absolute) and old local paths (relative)
    setImagePreview(project.image || null);
    setImageFiles([]);
    // Images array already contains full URLs (Azure or old local paths)
    setImagePreviews(project.images || []);
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

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setToast({ message: 'All images must be less than 5MB', type: 'error' });
      return;
    }

    // Check total count (existing + new)
    const totalCount = imagePreviews.length + files.length;
    if (totalCount > 5) {
      setToast({ message: 'Maximum 5 images allowed. You can only add ' + (5 - imagePreviews.length) + ' more image(s)', type: 'error' });
      return;
    }

    // Add new files to existing ones
    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // Clear the file input so the same file can be selected again if needed
    if (multiFileInputRef.current) {
      multiFileInputRef.current.value = '';
    }
  };

  const removeImagePreview = (index) => {
    // Check if this is a newly added file or an existing image from database
    const isNewFile = index >= (form.images?.length || 0);
    
    if (isNewFile) {
      // Remove from new files
      const newFileIndex = index - (form.images?.length || 0);
      const newPreviews = imagePreviews.slice(form.images?.length || 0).filter((_, i) => i !== newFileIndex);
      const newFiles = imageFiles.filter((_, i) => i !== newFileIndex);
      
      // Azure URLs are already absolute, no need to prepend anything
      setImagePreviews([...(form.images || []), ...newPreviews]);
      setImageFiles(newFiles);
    } else {
      // Remove from existing images in form
      const existingImages = (form.images || []).filter((_, i) => i !== index);
      setForm({ ...form, images: existingImages });
      
      // Update previews - Azure URLs are absolute
      const existingPreviews = existingImages;
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...existingPreviews, ...newPreviews]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const data = await api.uploadProjectImage(formData);
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

  const uploadMultipleImages = async () => {
    if (imageFiles.length === 0) return [];
    
    setUploading(true);
    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const data = await api.uploadProjectImages(formData);
      setUploading(false);
      
      if (data?.success) {
        return data.data.imageUrls;
      } else if (data) {
        setToast({ message: data.error || 'Failed to upload images', type: 'error' });
        return [];
      }
    } catch (error) {
      setUploading(false);
      setToast({ message: 'Network error while uploading images', type: 'error' });
      return [];
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setToast({ message: 'Project title is required', type: 'error' });
      return;
    }
    if (!form.category.trim()) {
      setToast({ message: 'Industry/Category is required', type: 'error' });
      return;
    }
    if (!form.client.trim()) {
      setToast({ message: 'Client name is required', type: 'error' });
      return;
    }
    if (!form.description.trim()) {
      setToast({ message: 'Project description is required', type: 'error' });
      return;
    }
    
    let imageUrl = form.image || '';
    let imagesArray = form.images || [];
    
    // Upload new main image if selected
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        return; // Stop if upload failed
      }
    }
    
    // Upload new multiple images if selected
    if (imageFiles.length > 0) {
      const uploadedUrls = await uploadMultipleImages();
      if (uploadedUrls.length > 0) {
        imagesArray = [...imagesArray, ...uploadedUrls];
      } else {
        return; // Stop if upload failed
      }
    }
    
    const data = { 
      title: form.title,
      category: form.category,
      client: form.client,
      description: form.description,
      tagline: form.tagline || '',
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      image: imageUrl,
      images: imagesArray,
      liveUrl: form.liveUrl || ''
    };
    
    try {
      const res = editId ? await api.updateProject(editId, data) : await api.createProject(data);
      if (res.success) {
        setToast({ message: editId ? 'Project updated successfully' : 'Project added successfully', type: 'success' });
        setShowModal(false);
        setImageFile(null);
        setImagePreview(null);
        setImageFiles([]);
        setImagePreviews([]);
        await loadProjects();
      } else {
        setToast({ message: res.error || 'Failed to save project', type: 'error' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setToast({ message: 'Network error while saving project', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const res = await api.deleteProject(id);
    if (res.success) {
      setToast({ message: 'Project deleted successfully', type: 'success' });
      setDeleteId(null);
      await loadProjects();
    } else {
      setToast({ message: res.error || 'Failed to delete project', type: 'error' });
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{projects.length} total projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full pl-9 pr-4 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-48 transition-colors"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 w-20"></th>
                <th className="text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 min-w-[150px]">Title</th>
                <th className="text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 min-w-[120px]">Category</th>
                <th className="text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 min-w-[120px]">Client</th>
                <th className="text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 min-w-[200px]">Technologies</th>
                <th className="text-right text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loading projects...</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-30">📁</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No projects found</p>
                    </div>
                  </td>
                </tr>
              ) : currentData.map((p, i) => (
                <tr
                  key={p.id}
                  className={`transition-colors ${i !== currentData.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''}`}
                >
                  <td className="px-4 py-3 w-16">
                    {p.image && (p.image.includes('media.ipshopy.com') || p.image.startsWith('/uploads')) ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0">
                        <img 
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.parentElement.innerHTML = '<span class="w-full h-full flex items-center justify-center text-2xl">📁</span>'; }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <span className="text-2xl">{p.image || '📁'}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{p.client}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all whitespace-nowrap"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all whitespace-nowrap"
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
              Showing <span className="text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="text-gray-900 dark:text-white">{filtered.length}</span> projects
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{editId ? 'Edit Project' : 'Add Project'}</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
            <FormField label="Project Image">
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
                        setForm({ ...form, image: '' });
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
            <FormField label={`Additional Images (Multiple) - ${imagePreviews.length}/5`}>
              <div className="space-y-2">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImagePreview(index)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-all"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">🖼️</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      <span className="font-semibold">
                        {imagePreviews.length >= 5 ? 'Maximum images reached (5/5)' : `Add images (${imagePreviews.length}/5)`}
                      </span>
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {imagePreviews.length >= 5 ? 'Remove some to add more' : 'Select multiple files (MAX. 5MB each)'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.jfif"
                    multiple
                    disabled={imagePreviews.length >= 5}
                    ref={multiFileInputRef}
                    onChange={handleMultipleImagesChange}
                  />
                </label>
              </div>
            </FormField>
            <FormField label="Title *">
              <input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project title" />
            </FormField>
            <FormField label="Category *">
              <input className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Web Development" />
            </FormField>
            <FormField label="Client *">
              <input className={inputCls} value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="Client name" />
            </FormField>
            <FormField label="Description *">
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief project description"
              />
            </FormField>
            <FormField label="Tagline (Short catchy subtitle for hero section)">
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
                placeholder="e.g. Revolutionizing multi-vendor e-commerce with seamless admin control"
              />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">This will be displayed in the hero section of the project detail page</p>
            </FormField>
            <FormField label="Technologies (comma separated)">
              <input className={inputCls} value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
            </FormField>
            <FormField label="Live Project URL">
              <input 
                className={inputCls} 
                type="url"
                value={form.liveUrl} 
                onChange={e => setForm({ ...form, liveUrl: e.target.value })} 
                placeholder="https://example.com" 
              />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Add the live website URL to show "View Live" button on project page</p>
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
                <>{editId ? 'Update' : 'Add'} Project</>
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
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Delete this project?</p>
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

export default AdminProjects;