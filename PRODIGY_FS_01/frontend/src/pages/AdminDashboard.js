import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edit' or 'delete'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user/admin/users?per_page=50');
      setUsers(response.data.users);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  const confirmEdit = async () => {
    try {
      await api.put(`/user/admin/users/${selectedUser.id}`, {
        role: selectedUser.role,
        is_active: selectedUser.is_active
      });
      toast.success('User updated successfully');
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user');
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/user/admin/users/${selectedUser.id}`);
      toast.success('User deleted successfully');
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="main-content">
        <div className="welcome-card">
          <div className="admin-header">
            <div>
              <h1>👑 Admin Dashboard</h1>
              <p>Manage users and system settings</p>
            </div>
            <div>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Total Users: {users.length}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              {modalType === 'edit' ? (
                <>
                  <h2>Edit User: {selectedUser.username}</h2>
                  
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '15px'
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={selectedUser.is_active}
                        onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.checked })}
                        style={{ width: '18px', height: '18px' }}
                      />
                      Account Active
                    </label>
                  </div>

                  <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={confirmEdit}>
                      Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>Delete User</h2>
                  <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    Are you sure you want to delete <strong>{selectedUser.username}</strong>? 
                    This action cannot be undone.
                  </p>

                  <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={confirmDelete}>
                      Delete User
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
