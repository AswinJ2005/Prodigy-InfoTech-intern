import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaLock, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { token, user, checkAuth } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (profile.password && profile.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        if (profile.password !== profile.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const data = {
                name: profile.name,
                phone: profile.phone
            };

            if (profile.password) {
                data.password = profile.password;
            }

            const res = await axios.put('/api/auth/profile', data);

            setMessage({ type: 'success', text: res.data.message });
            setProfile(prev => ({ ...prev, password: '', confirmPassword: '' }));

            // Refresh auth context to update user details in app
            await checkAuth();

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <div className="container">Please login to view profile.</div>;

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>
                        <h1>My Profile</h1>
                        <p>{profile.email}</p>
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label><FaUser /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><FaPhone /> Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div className="form-divider">
                            <span>Change Password (Optional)</span>
                        </div>

                        <div className="form-group">
                            <label><FaLock /> New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={profile.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="Leave blank to keep current"
                            />
                        </div>

                        <div className="form-group">
                            <label><FaLock /> Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={profile.confirmPassword}
                                onChange={handleChange}
                                className="input"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary save-btn"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
