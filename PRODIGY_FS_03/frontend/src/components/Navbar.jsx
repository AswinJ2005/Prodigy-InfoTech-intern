import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBox, FaCog, FaSearch, FaHeart, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // Debounced search
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await axios.get(`/api/products?search=${searchQuery}&limit=5`);
                setSearchResults(res.data.slice(0, 5));
                setShowResults(true);
            } catch (error) {
                console.error('Search failed:', error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
            setShowResults(false);
            setSearchQuery('');
        }
    };

    const handleResultClick = (productId) => {
        navigate(`/product/${productId}`);
        setShowResults(false);
        setSearchQuery('');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <FaShoppingCart /> Local Store
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                </div>

                {/* Search Bar */}
                <div className="search-container" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <FaSearch />
                        </button>
                    </form>

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map(product => (
                                <div
                                    key={product.id}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(product.id)}
                                >
                                    <img
                                        src={product.image ? `http://localhost:5000${product.image}` : `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop`}
                                        alt={product.name}
                                    />
                                    <div className="result-info">
                                        <h4>{product.name}</h4>
                                        <p>₹{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="nav-actions">
                    <Link to="/cart" className="cart-icon">
                        <FaShoppingCart />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    <Link to="/wishlist" className="cart-icon" title="Wishlist">
                        <FaHeart />
                        {wishlist.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
                    </Link>

                    {user ? (
                        <div className="user-menu">
                            <button className="user-btn">
                                <FaUser /> {user.name}
                            </button>
                            <div className="dropdown">
                                <Link to="/profile"><FaUser /> My Profile</Link>
                                <Link to="/orders"><FaBox /> My Orders</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin/dashboard"><FaCog /> Admin Panel</Link>
                                        <Link to="/admin/users"><FaUsers /> Users</Link>
                                    </>
                                )}
                                <button onClick={logout}><FaSignOutAlt /> Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
