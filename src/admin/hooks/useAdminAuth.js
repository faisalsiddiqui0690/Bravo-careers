import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check authentication on mount and initialize theme
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken');
        const userStr = localStorage.getItem('adminUser');

        if (!token || !userStr) {
          setLoading(false);
          return;
        }

        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initialize theme - sync with main website theme
    const syncThemeWithWebsite = () => {
      const websiteTheme = localStorage.getItem('theme') || 'dark';
      const isDark = websiteTheme === 'dark';
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
      
      // Also update data-theme attribute for consistency
      document.documentElement.setAttribute('data-theme', websiteTheme);
    };

    // Initial sync
    syncThemeWithWebsite();

    // Listen for website theme changes
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        syncThemeWithWebsite();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check authentication immediately
    checkAuth();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/v1/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        setUser(data.data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Update admin theme
    localStorage.setItem('admin-theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Also update main website theme to keep them in sync
    const websiteTheme = newDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', websiteTheme);
    document.documentElement.setAttribute('data-theme', websiteTheme);
  }, [darkMode]);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    navigate('/admin/login');
  }, [navigate]);

  const isAuthenticated = !!user && !!localStorage.getItem('adminToken');

  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  return {
    user,
    loading,
    darkMode,
    setDarkMode,
    isAuthenticated,
    login,
    logout,
    toggleTheme,
    hasPermission,
    hasRole,
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isModerator: user?.role === 'MODERATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  };
};
