const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// For Azure Blob Storage images, no IMAGE_BASE needed as URLs are absolute
export const IMAGE_BASE = ''; // Azure returns full URLs

export const getProjects = async () => {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getProjects error:', error);
    return [];
  }
};

export const getServices = async () => {
  try {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getServices error:', error);
    return [];
  }
};

export const getReviews = async () => {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getReviews error:', error);
    return [];
  }
};

export const getAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('getAnalytics error:', error);
    return null;
  }
};

export const getLegalPage = async (slug) => {
  try {
    const res = await fetch(`${API_BASE}/legal-pages/${slug}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('getLegalPage error:', error);
    return null;
  }
};

export const getAllLegalPages = async () => {
  try {
    const res = await fetch(`${API_BASE}/legal-pages`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getAllLegalPages error:', error);
    return [];
  }
};
