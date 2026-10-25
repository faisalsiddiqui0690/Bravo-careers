import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import logo from '../../assets/nplogo.png';

const AdminLogin = () => {
  const { darkMode, toggleTheme } = useAdminAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/v1/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen font-sans transition-all duration-500 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse ${darkMode ? 'bg-blue-600' : 'bg-blue-400'
          }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse delay-1000 ${darkMode ? 'bg-purple-600' : 'bg-purple-400'
          }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse delay-2000 ${darkMode ? 'bg-green-600' : 'bg-green-400'
          }`} />
      </div>

      {/* Theme toggle button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border ${darkMode
              ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/50 hover:scale-110'
              : 'bg-white/30 border-white/50 text-gray-600 hover:text-gray-900 hover:bg-white/40 hover:scale-110'
            }`}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </div>

      <div className="relative z-10 h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className={`w-full backdrop-blur-xl rounded-2xl shadow-2xl border transition-all duration-500 ${darkMode
              ? 'bg-gray-800/40 border-gray-700/50'
              : 'bg-white/20 border-white/30'
            }`}>
            <div className="p-5">
              {/* Logo and branding */}
              <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center w-full px-4 mb-3">
                  <img src={logo} alt="NPquantumtech" className={`max-h-32 w-auto object-contain ${darkMode ? 'brightness-0 invert' : 'brightness-0'}`} style={{ maxWidth: '280px' }} />
                </div>
              </div>

              {/* Login form */}
              <div className="space-y-3">
                <div>
                  <h2 className={`text-lg font-bold text-center mb-1 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    Welcome back
                  </h2>
                  <p className={`text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Sign in to continue
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className={`backdrop-blur-sm border px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 ${darkMode
                      ? 'bg-red-900/20 border-red-800/50 text-red-400'
                      : 'bg-red-50/50 border-red-200/50 text-red-600'
                    }`}>
                    <span className="text-xs">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Email input */}
                  <div className="space-y-1">
                    <label className={`block text-[9px] font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter Your Email"
                        className={`w-full h-9 rounded-lg text-sm px-3 pl-8 outline-none transition-all duration-300 backdrop-blur-sm border placeholder-gray-400 ${darkMode
                            ? 'bg-gray-800/30 border-gray-700/50 text-white focus:border-blue-500 focus:bg-gray-800/50 placeholder-gray-500'
                            : 'bg-white/30 border-white/40 text-gray-900 focus:border-blue-500 focus:bg-white/40 placeholder-gray-500'
                          }`}
                      />
                      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>✉️</span>
                    </div>
                  </div>

                  {/* Password input */}
                  <div className="space-y-1">
                    <label className={`block text-[9px] font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className={`w-full h-9 rounded-lg text-sm px-3 pl-8 pr-8 outline-none transition-all duration-300 backdrop-blur-sm border placeholder-gray-400 ${darkMode
                            ? 'bg-gray-800/30 border-gray-700/50 text-white focus:border-blue-500 focus:bg-gray-800/50 placeholder-gray-500'
                            : 'bg-white/30 border-white/40 text-gray-900 focus:border-blue-500 focus:bg-white/40 placeholder-gray-500'
                          }`}
                      />
                      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>🔒</span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors text-xs ${darkMode
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        {showPassword ? '👁️‍🗨️' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-3 h-3 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                      />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Please contact the superadmin/support.')}
                      className={`text-xs font-medium transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}>
                      Forgot?
                    </button>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-9 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg ${darkMode
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-blue-500/25'
                      }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span>Sign In →</span>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="pt-3 space-y-1.5 text-center border-t border-gray-200/20">
                  <button
                    onClick={() => navigate('/')}
                    className={`inline-flex items-center gap-1 text-xs font-medium transition-colors hover:scale-105 transform duration-200 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                  >
                    <span>🌐</span>
                    <span>Back to Website</span>
                  </button>

                  <p className={`text-[8px] ${darkMode ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                    © 2026 NPquantumtech · Secure Access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;