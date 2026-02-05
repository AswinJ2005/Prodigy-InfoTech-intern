import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaUser, FaEnvelope, FaCalendar, FaShoppingBag, FaHeart } from 'react-icons/fa';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await axios.delete(`/api/admin/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
            alert('User deleted successfully');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete user');
        }
    };

    if (loading) return <div className="loading">Loading users...</div>;

    return (
        <div className="user-management-page">
            <div className="container">
                <h1>User Management</h1>
                <div className="users-stats">
                    <div className="stat-box">
                        <h3>Total Users</h3>
                        <p>{users.length}</p>
                    </div>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Orders</th>
                                <th>Wishlist</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-small">
                                                <FaUser />
                                            </div>
                                            <div>
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-email"><FaEnvelope /> {user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            <FaCalendar /> {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="count-cell">
                                            <FaShoppingBag /> {user.order_count}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="count-cell">
                                            <FaHeart /> {user.wishlist_count}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="btn-icon danger"
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
