import { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminToast from '../components/AdminToast';
import api from '../services/api';

const inputCls =
  'w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors';

const AdminSettings = () => {
  const { user, darkMode, setDarkMode } = useAdminAuth();
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState('security');
  const [theme, setTheme] = useState(darkMode ? 'dark' : 'light');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    try {
      const data = await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword,
      });
      if (data?.success) {
        setToast({ message: 'Password updated successfully', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setToast({ message: error.message || 'Network error', type: 'error' });
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    const isDark = newTheme === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('admin-theme', newTheme);
    setToast({ message: `Switched to ${newTheme} mode`, type: 'success' });
  };

  const EyeIcon = ({ show }) => show ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const tabs = [
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage your account security and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {[
              { key: 'current', label: 'Current Password', field: 'currentPassword', placeholder: 'Enter current password' },
              { key: 'new',     label: 'New Password',     field: 'newPassword', placeholder: 'Enter new password' },
              { key: 'confirm', label: 'Confirm New Password', field: 'confirmPassword', placeholder: 'Confirm your new password' },
            ].map(({ key, label, field, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? 'text' : 'password'}
                    value={passwordForm[field]}
                    onChange={e => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                    className={`${inputCls} pr-10`}
                    placeholder={placeholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, [key]: !p[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <EyeIcon show={showPasswords[key]} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Theme</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Light */}
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Light</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bright and clean</p>
              {theme === 'light' && (
                <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Active</span>
              )}
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Easy on the eyes</p>
              {theme === 'dark' && (
                <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Active</span>
              )}
            </button>
          </div>
        </div>
      )}

      <AdminToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default AdminSettings;
