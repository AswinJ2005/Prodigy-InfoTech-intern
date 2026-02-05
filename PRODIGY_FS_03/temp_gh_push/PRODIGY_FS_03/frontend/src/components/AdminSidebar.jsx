import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import './AdminSidebar.css';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Admin Panel</h2>
            </div>
            <nav className="sidebar-nav">
                <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                    <FaTachometerAlt /> Dashboard
                </Link>
                <Link to="/admin/products" className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}>
                    <FaBox /> Products
                </Link>
                <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
                    <FaShoppingBag /> Orders
                </Link>
                <Link to="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                    <FaUsers /> Users
                </Link>
            </nav>
            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
