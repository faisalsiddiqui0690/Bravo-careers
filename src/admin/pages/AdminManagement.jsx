import { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminToast from '../components/AdminToast';
import api from '../services/api';

const inputCls = "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all w-full";

const Modal = ({ children, onClose, maxW = 'max-w-lg' }) => (
  <div
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-full ${maxW} shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>            
  </div>  
);

const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const roleBadge = (role) => {
  const map = {
    SUPER_ADMIN: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    ADMIN:       'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    MODERATOR:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  };
  return map[role] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
};

const AdminManagement = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

  const [createForm, setCreateForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'ADMIN' });
  const [editForm, setEditForm] = useState({ email: '', firstName: '', lastName: '', role: '', isActive: true });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchAdmins = async () => {
    try {
      const data = await api.getAdmins();
      if (data) {
        setAdmins(data);
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) fetchAdmins();
    else setLoading(false);
  }, [isSuperAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createAdmin(createForm);
      if (data?.success) {
        showToast('Admin created successfully');
        setShowCreateModal(false);
        setCreateForm({ email: '', password: '', firstName: '', lastName: '', role: 'ADMIN' });
        fetchAdmins();
      } else if (data) {
        showToast(data.message || 'Failed to create admin', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await api.updateAdmin(selectedAdmin.id, editForm);
      if (data?.success) {
        showToast('Admin updated successfully');
        setShowEditModal(false);
        fetchAdmins();
      } else if (data) {
        showToast(data.message || 'Failed to update admin', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      const data = await api.resetAdminPassword(selectedAdmin.id, passwordForm.newPassword);
      if (data?.success) {
        showToast('Password reset successfully');
        setShowPasswordModal(false);
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      } else if (data) {
        showToast(data.message || 'Failed to reset password', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  const handleToggleStatus = async (admin) => {
    const action = admin.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this admin?`)) return;
    try {
      const data = await api.updateAdmin(admin.id, { isActive: !admin.isActive });
      if (data?.success) {
        showToast(`Admin ${action}d successfully`);
        fetchAdmins();
      } else if (data) {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  const openEdit = (admin) => {  
    setSelectedAdmin(admin);
    setEditForm({ email: admin.email, firstName: admin.firstName || '', lastName: admin.lastName || '', role: admin.role, isActive: admin.isActive });
    setShowEditModal(true);
  };

  const openPasswordReset = (admin) => {
    setSelectedAdmin(admin);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  if (!isSuperAdmin) {
    return (  
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Only Super Admin can access this page.</p>
        </div>
      </div>
    );
  }

  const filteredAdmins = admins.filter(admin => {
    if (statusFilter === 'active') return admin.isActive;
    if (statusFilter === 'inactive') return !admin.isActive;
    return true;
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Management</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{filteredAdmins.length} {statusFilter !== 'all' ? statusFilter : ''} admin users</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'inactive', label: 'Deactive' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setStatusFilter(option.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  statusFilter === option.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
          >
            + Create Admin
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Admin', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className={`text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-4 py-3 ${h === 'Actions' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loading admins...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-30">👥</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No {statusFilter !== 'all' ? statusFilter : ''} admins found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAdmins.map((admin, i) => (
                <tr
                  key={admin.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${i !== filteredAdmins.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                >
                  {/* Admin info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(admin.firstName || admin.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {admin.firstName && admin.lastName ? `${admin.firstName} ${admin.lastName}` : admin.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${roleBadge(admin.role)}`}>
                      {admin.role}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      admin.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* Last login */}
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(admin)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openPasswordReset(admin)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30 transition-all"
                      >
                        Reset PW
                      </button>
                      {admin.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            admin.isActive
                              ? 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                              : 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                          }`}
                        >
                          {admin.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Create New Admin</h3>
            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <form onSubmit={handleCreate} className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
            <FormField label="Email *">
              <input type="email" required className={inputCls} value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} placeholder="admin@example.com" />
            </FormField>
            <FormField label="Password *">
              <input type="password" required className={inputCls} value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Enter new password" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name">
                <input type="text" className={inputCls} value={createForm.firstName} onChange={e => setCreateForm({ ...createForm, firstName: e.target.value })} placeholder="John" />
              </FormField>
              <FormField label="Last Name">
                <input type="text" className={inputCls} value={createForm.lastName} onChange={e => setCreateForm({ ...createForm, lastName: e.target.value })} placeholder="Doe" />
              </FormField>
            </div>
            <FormField label="Role">
              <select className={inputCls} value={createForm.role} onChange={e => setCreateForm({ ...createForm, role: e.target.value })}>
                <option value="ADMIN">Admin</option>
                <option value="MODERATOR">Moderator</option>
              </select>
            </FormField>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                Cancel
              </button>
              <button type="submit" className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
                Create Admin
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <Modal onClose={() => setShowEditModal(false)}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Edit Admin</h3>
            <button onClick={() => setShowEditModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <form onSubmit={handleUpdate} className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
            <FormField label="Email *">
              <input type="email" required className={inputCls} value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name">
                <input type="text" className={inputCls} value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} />
              </FormField>
              <FormField label="Last Name">
                <input type="text" className={inputCls} value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Role">
              <select
                className={`${inputCls} disabled:opacity-50`}
                value={editForm.role}
                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                disabled={selectedAdmin.role === 'SUPER_ADMIN'}
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="MODERATOR">Moderator</option>
              </select>
            </FormField>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={editForm.isActive}
                onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })}
                disabled={selectedAdmin.role === 'SUPER_ADMIN'}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer disabled:opacity-50"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Active</label>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setShowEditModal(false)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                Cancel
              </button>
              <button type="submit" className="text-xs px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
                Update Admin
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && selectedAdmin && (
        <Modal onClose={() => setShowPasswordModal(false)} maxW="max-w-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Reset Password</h3>
            <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none transition-colors">×</button>
          </div>
          <form onSubmit={handleResetPassword} className="px-5 py-4 space-y-3 overflow-y-auto flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Resetting password for <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedAdmin.email}</span></p>
            <FormField label="New Password *">
              <input type="password" required className={inputCls} value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Enter new password" />
            </FormField>
            <FormField label="Confirm Password *">
              <input type="password" required className={inputCls} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new password" />
            </FormField>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-xs px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                Cancel
              </button>
              <button type="submit" className="text-xs px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all">
                Reset Password
              </button>
            </div>
          </form>
        </Modal>
      )}

      <AdminToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default AdminManagement;
