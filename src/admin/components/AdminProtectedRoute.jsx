import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const Denied = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1117] text-center p-8">
    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl mb-6">
      🔐
    </div>
    <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
    <p className="text-sm text-slate-400 mb-6 max-w-xs">{message}</p>
    <button
      onClick={() => window.history.back()}
      className="bg-[#1e2330] border border-[#2a3045] text-slate-300 hover:bg-[#252b3b] hover:text-white transition-all px-5 py-2 rounded-lg text-sm font-medium"
    >
      ← Go Back
    </button>
  </div>
);

const AdminProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, loading, hasRole, hasPermission } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1117]">
        <div className="w-10 h-10 border-4 border-[#2a3045] border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  if (requiredRole && !hasRole(requiredRole))
    return <Denied message="You don't have the required role to access this page." />;

  if (requiredPermission && !hasPermission(requiredPermission))
    return <Denied message="You don't have the required permissions to access this page." />;

  return children;
};

export default AdminProtectedRoute;