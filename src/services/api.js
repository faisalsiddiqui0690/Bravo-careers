const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || API_BASE.replace(/\/api\/?$/, '');
export const resolveImageUrl = (image) => (
  typeof image === 'string' && image.startsWith('/uploads/')
    ? `${IMAGE_BASE}${image}`
    : image
);

export const getServices = async () => {
  try {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getServices error:', error);
    throw error;
  }
};

export const getBlogs = async () => {
  try {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getBlogs error:', error);
    throw error;
  }
};

export const getNews = async () => {
  try {
    const res = await fetch(`${API_BASE}/news`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getNews error:', error);
    throw error;
  }
};

export const getResources = async (type) => {
  try {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    const res = await fetch(`${API_BASE}/resources${query}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('getResources error:', error);
    throw error;
  }
};

export const getPublishedArticle = async (type, slug) => {
  try {
    const collection = type === 'blog' ? 'blogs' : type === 'news' ? 'news' : null;
    if (!collection) return null;
    const res = await fetch(`${API_BASE}/${collection}/${encodeURIComponent(slug)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`getPublishedArticle error [${type}/${slug}]:`, error);
    return null;
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
