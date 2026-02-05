import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    SocialApp
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-black">
                        <Home size={24} />
                    </Link>
                    <Link to="/create-post" className="text-gray-600 hover:text-black">
                        <PlusSquare size={24} />
                    </Link>
                    <Link to={user ? `/profile/${user.id}` : '/profile'} className="text-gray-600 hover:text-black">
                        {user?.profilePic ? (
                            <img src={`http://localhost:5000${user.profilePic}`} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                            <User size={24} />
                        )}
                    </Link>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-red-500">
                        <LogOut size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
