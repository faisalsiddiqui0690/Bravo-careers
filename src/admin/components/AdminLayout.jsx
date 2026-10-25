import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleLogout = () => logout();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content — offset by sidebar width */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          isMobile ? 'ml-0' : isSidebarOpen ? 'ml-56' : 'ml-16'
        }`}
      >
        <AdminHeader
          onLogout={handleLogout}
          isMobile={isMobile}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-0">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;