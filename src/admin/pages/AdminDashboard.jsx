import { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import api from '../services/api';

// ── SVG icon set ──────────────────────────────────────────────────────────────
const Icon = {
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 7a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59l1.41 1.41A2 2 0 0 0 12.41 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 opacity-30">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [careersCount, setCareersCount] = useState(null);
  const [enquiriesCount, setEnquiriesCount] = useState(null);
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsData, servicesData, reviewsData, careersData, enquiriesData] = await Promise.all([
          api.getProjects(),
          api.getServices(),
          api.getReviews(),
          api.getCareers(),
          api.getEnquiries()
        ]);

        setProjects(projectsData.map(p => ({
          ...p,
          createdAt: new Date(p.createdAt || Date.now())
        })));
        setServices(servicesData);
        setReviews(reviewsData.map(r => ({
          ...r,
          status: r.status || 'Approved', // Default status if missing
          createdAt: new Date(r.createdAt || Date.now())
        })));
        setCareersCount(Array.isArray(careersData) ? careersData.length : 0);
        
        if (Array.isArray(enquiriesData)) {
          setEnquiriesCount(enquiriesData.length);
          setNewEnquiriesCount(enquiriesData.filter(e => e.status === 'New').length);
        } else {
          setEnquiriesCount(0);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const shouldShowCard = useCallback(
    (keywords) => !searchQuery || keywords.some(k => k.toLowerCase().includes(searchQuery)),
    [searchQuery]
  );

  const stats = useMemo(() => [
    { label: 'Projects',   value: projects.length,   icon: Icon.folder,     iconBg: 'bg-blue-500/10',   iconColor: 'text-blue-500 dark:text-blue-400',   keywords: ['projects'],   path: '/admin/projects' },
    { label: 'Services',   value: services.length,   icon: Icon.wrench,     iconBg: 'bg-purple-500/10', iconColor: 'text-purple-500 dark:text-purple-400', keywords: ['services'],   path: '/admin/services' },
    { label: 'Reviews',    value: reviews.length,    icon: Icon.star,       iconBg: 'bg-amber-500/10',  iconColor: 'text-amber-500 dark:text-amber-400',  keywords: ['reviews'],    path: '/admin/reviews' },
    { label: 'Careers',    value: careersCount === null ? '…' : careersCount,   icon: Icon.briefcase, iconBg: 'bg-teal-500/10',   iconColor: 'text-teal-500 dark:text-teal-400',   keywords: ['careers'],    path: '/admin/careers' },
    { label: 'Enquiries',  value: enquiriesCount === null ? '…' : enquiriesCount, icon: Icon.mail,   iconBg: 'bg-rose-500/10',   iconColor: 'text-rose-500 dark:text-rose-400',   keywords: ['enquiries'],  path: '/admin/enquiries', badge: newEnquiriesCount > 0 ? newEnquiriesCount : null },
  ], [projects, services, reviews, careersCount, enquiriesCount, newEnquiriesCount]);

  const engagementStats = useMemo(() => [
    { label: 'Total Projects', value: projects.length, icon: Icon.folder,    iconBg: 'bg-green-500/10', iconColor: 'text-green-500 dark:text-green-400' },
    { label: 'Average Rating',    value: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0',    icon: Icon.star,    iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500 dark:text-amber-400' },
    { label: 'Active Services',    value: services.length,                 icon: Icon.activity, iconBg: 'bg-cyan-500/10',  iconColor: 'text-cyan-500 dark:text-cyan-400' },
  ], [projects, services, reviews]);

  const monthlyProjects = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.slice(0, new Date().getMonth() + 1).map((month, i) => ({
      month, count: projects.filter(p => p.createdAt.getMonth() === i).length,
    }));
  }, [projects]);

  const maxMonthly = Math.max(...monthlyProjects.map(m => m.count), 1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'Admin'}! Here's what's happening today.
            </p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              id="dashboardSearch"
              placeholder="Search dashboard..."
              onChange={e => setSearchQuery(e.target.value.toLowerCase())}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 w-56 transition-colors"
            />
          </div>
        </div>

        {/* Main Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {stats.map((stat, i) => shouldShowCard(stat.keywords) && (
            <div
              key={i}
              onClick={() => stat.path && navigate(stat.path)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group relative"
            >
              {stat.badge && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {stat.badge}
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Projects</h4>
              <Link to="/admin/projects" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {projects.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 flex-shrink-0">
                    {Icon.folder}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{p.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Services */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Services</h4>
              <Link to="/admin/services" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {services.slice(0, 4).map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400 flex-shrink-0">
                    {Icon.wrench}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Monthly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Monthly Chart */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Overview</h4>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">6 Months</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {monthlyProjects.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-all duration-500 hover:bg-blue-600 dark:hover:bg-blue-500"
                      style={{ height: `${Math.max(8, (m.count / maxMonthly) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
            <div className="flex flex-col gap-2">
              <Link to="/admin/projects" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all no-underline">
                <span className="text-blue-500 dark:text-blue-400">{Icon.folder}</span> Manage Projects
              </Link>
              <Link to="/admin/services" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all no-underline">
                <span className="text-purple-500 dark:text-purple-400">{Icon.wrench}</span> Manage Services
              </Link>
              <Link to="/admin/reviews" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all no-underline">
                <span className="text-amber-500 dark:text-amber-400">{Icon.star}</span> Manage Reviews
              </Link>
              <Link to="/admin/careers" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all no-underline">
                <span className="text-teal-500 dark:text-teal-400">{Icon.briefcase}</span> Manage Careers
              </Link>
              <Link to="/admin/enquiries" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all no-underline">
                <span className="text-rose-500 dark:text-rose-400">{Icon.mail}</span> View Enquiries
                {newEnquiriesCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{newEnquiriesCount} new</span>
                )}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </Fragment>
  );
};

export default AdminDashboard;