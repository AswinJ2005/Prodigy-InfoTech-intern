import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="main-content">
        <div className="welcome-card">
          <h1>
            Welcome back, {user?.username}!
            <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </h1>
          <p>Here's an overview of your account</p>
        </div>

        <div className="cards-grid">
          <div className="info-card">
            <h3>Username</h3>
            <p>{user?.username}</p>
          </div>
          
          <div className="info-card">
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>
          
          <div className="info-card">
            <h3>Role</h3>
            <p style={{ textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
          
          <div className="info-card">
            <h3>Account Status</h3>
            <p>
              <span className={`status-badge ${user?.is_active ? 'active' : 'inactive'}`}>
                {user?.is_active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
          
          <div className="info-card">
            <h3>Member Since</h3>
            <p style={{ fontSize: '16px' }}>{formatDate(user?.created_at)}</p>
          </div>
          
          <div className="info-card">
            <h3>Last Updated</h3>
            <p style={{ fontSize: '16px' }}>{formatDate(user?.updated_at)}</p>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="welcome-card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>🔐 Admin Access</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              You have administrator privileges. Access the Admin Panel to manage users.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
