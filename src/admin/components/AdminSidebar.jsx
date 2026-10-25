import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useState, useEffect } from 'react';
import logo from '../../assets/nplogo.png';

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M3 7a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59l1.41 1.41A2 2 0 0 0 12.41 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  reviews: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  management: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  careers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  enquiries: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  legalPages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard, path: '/admin/dashboard' },
  { id: 'projects',  label: 'Projects',  icon: icons.projects,  path: '/admin/projects' },
  { id: 'services',  label: 'Services',  icon: icons.services,  path: '/admin/services' },
  { id: 'reviews',   label: 'Reviews',   icon: icons.reviews,   path: '/admin/reviews' },
  { id: 'careers',   label: 'Careers',   icon: icons.careers,   path: '/admin/careers' },
  { id: 'enquiries', label: 'Enquiries', icon: icons.enquiries, path: '/admin/enquiries' },
  { id: 'legal-pages', label: 'Legal Pages', icon: icons.legalPages, path: '/admin/legal-pages' },
  { id: 'analytics', label: 'Analytics', icon: icons.analytics, path: '/admin/analytics' },
  { id: 'admin-management', label: 'Admin Management', icon: icons.management, path: '/admin/management', superAdminOnly: true },
  { id: 'settings',  label: 'Settings',  icon: icons.settings,  path: '/admin/settings' },
];

const AdminSidebar = ({ isSidebarOpen, onToggleSidebar, isMobile }) => {
  const location = useLocation();
  const { user } = useAdminAuth();
  const isActive = (path) => location.pathname === path;

  // Watch the <html> class directly so the logo colour updates instantly on toggle
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={onToggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-56' : 'w-16'}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-14 border-b border-gray-200 dark:border-gray-700 px-3 flex-shrink-0 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && (
            <Link to="/admin/dashboard" className="flex items-center no-underline overflow-hidden">
              <img 
                src={logo} 
                alt="NPquantumtech" 
                className="h-14 w-auto object-contain transition-all"
                style={{
                  filter: isDark 
                    ? 'brightness(0) invert(1) contrast(1.5) saturate(1.3)' 
                    : 'brightness(0.3) contrast(2) saturate(1.5) opacity(1)',
                  maxWidth: '200px'
                }}
              />
            </Link>
          )}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-xs flex-shrink-0"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-hide">
          <ul className="space-y-1 list-none p-0 m-0">
            {menuItems
              .filter(item => !item.superAdminOnly || user?.role === 'SUPER_ADMIN')
              .map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 rounded-lg px-2.5 py-2.5 no-underline transition-all duration-150
                    ${isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-transparent'
                    }
                    ${!isSidebarOpen ? 'justify-center' : ''}
                  `}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                  {isSidebarOpen && isActive(item.path) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom user section */}
        <div className={`border-t border-gray-200 dark:border-gray-700 p-3 flex-shrink-0 ${!isSidebarOpen ? 'flex justify-center' : ''}`}>
          {isSidebarOpen ? (
            <Link to="/admin/profile" className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all no-underline group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.firstName?.[0] || user?.email?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'Admin'}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user?.email || 'admin@iptechnology.com'}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ) : (
            <Link
              to="/admin/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold"
              title="Profile"
            >
              {user?.firstName?.[0] || user?.email?.[0] || 'A'}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;