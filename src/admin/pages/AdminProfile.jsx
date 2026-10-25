import { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminToast from '../components/AdminToast';
import api from '../services/api';

const inputCls =
  'w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors';

const AdminProfile = () => {
  const { user } = useAdminAuth();
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
  });

  // Sync form with user data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName:  user.lastName  || '',
        email:     user.email     || '',
      });
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new:     false,
    confirm: false,
  });

  const getUserInitials = () => {
    const f = profileForm.firstName?.[0] || '';
    const l = profileForm.lastName?.[0]  || '';
    return (f + l).toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A';
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await api.updateProfile({
        firstName: profileForm.firstName,
        lastName:  profileForm.lastName,
      });
      if (data?.success) {
        setToast({ message: 'Profile updated successfully', type: 'success' });
        const current = JSON.parse(localStorage.getItem('adminUser') || '{}');
        localStorage.setItem('adminUser', JSON.stringify({ ...current, ...data.data?.user }));
      } else if (data) {
        setToast({ message: data.message || 'Failed to update profile', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error', type: 'error' });
    }
  };

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
      } else if (data) {
        setToast({ message: data.message || 'Failed to update password', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error', type: 'error' });
    }
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

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage your personal information and password</p>
      </div>

      {/* Avatar + info card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
          {getUserInitials()}
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {profileForm.firstName || profileForm.lastName
              ? `${profileForm.firstName} ${profileForm.lastName}`.trim()
              : user?.email || 'Admin User'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{profileForm.email}</p>
          <span className="inline-block mt-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            {user?.role || 'Admin'}
          </span>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</h3>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">First Name</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className={inputCls}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Last Name</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className={inputCls}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
            <input
              type="email"
              value={profileForm.email}
              disabled
              className={`${inputCls} opacity-60 cursor-not-allowed`}
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed here.</p>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Password form */}
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
            { key: 'new',     label: 'New Password',     field: 'newPassword',     placeholder: 'Enter new password' },
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

      <AdminToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default AdminProfile;
