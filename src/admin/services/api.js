const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin/login';
};

const request = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // If it's FormData, we must let the browser set the Content-Type with the boundary
  if (isFormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    
    if (res.status === 401 || res.status === 403) {
      handleLogout();
      return null;
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`API Request Error [${url}]:`, error);
    throw error;
  }
};

const api = {
  // Projects
  async getProjects() {
    const json = await request('/projects');
    return json?.success ? json.data : [];
  },

  async createProject(data) {
    return await request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id, data) {
    return await request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id) {
    return await request(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Services
  async getServices() {
    const json = await request('/services');
    return json?.success ? json.data : [];
  },

  async createService(data) {
    return await request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateService(id, data) {
    return await request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteService(id) {
    return await request(`/services/${id}`, {
      method: 'DELETE',
    });
  },

  // Reviews
  async getReviews() {
    const json = await request('/reviews');
    return json?.success ? json.data : [];
  },

  async createReview(data) {
    return await request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReview(id, data) {
    return await request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteReview(id) {
    return await request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // Careers
  async getCareers() {
    const json = await request('/careers/all');
    return json?.success ? json.data : [];
  },

  async createCareer(data) {
    return await request('/careers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCareer(id, data) {
    return await request(`/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCareer(id) {
    return await request(`/careers/${id}`, {
      method: 'DELETE',
    });
  },

  // Enquiries
  async getEnquiries() {
    const json = await request('/enquiries');
    return json?.success ? json.data : [];
  },

  async updateEnquiry(id, data) {
    return await request(`/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteEnquiry(id) {
    return await request(`/enquiries/${id}`, {
      method: 'DELETE',
    });
  },

  // Analytics
  async getAnalytics() {
    const json = await request('/analytics');
    return json?.success ? json.data : null;
  },

  async updateAnalytics(data) {
    return await request('/analytics', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Profile & Auth
  async updateProfile(data) {
    return await request('/v1/admin/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async changePassword(data) {
    return await request('/v1/admin/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Admin Management (Super Admin only)
  async getAdmins() {
    const json = await request('/v1/admin/manage');
    return json?.success ? json.data : [];
  },

  async createAdmin(data) {
    return await request('/v1/admin/manage', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdmin(id, data) {
    return await request(`/v1/admin/manage/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async resetAdminPassword(id, newPassword) {
    return await request(`/v1/admin/manage/${id}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  },

  // Uploads
  async uploadProjectImage(formData) {
    return await request('/projects/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadProjectImages(formData) {
    return await request('/projects/upload-multiple', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadServiceIcon(formData) {
    return await request('/services/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Legal Pages
  async getLegalPages() {
    const json = await request('/legal-pages/admin/all');
    return json?.success ? json.data : [];
  },

  async createLegalPage(data) {
    return await request('/legal-pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateLegalPage(id, data) {
    return await request(`/legal-pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteLegalPage(id) {
    return await request(`/legal-pages/${id}`, {
      method: 'DELETE',
    });
  },
};

export default api;
