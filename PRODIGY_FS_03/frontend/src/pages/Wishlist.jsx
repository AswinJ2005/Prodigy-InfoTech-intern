import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = async (product) => {
        await addToCart({
            id: product.product_id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        alert('Added to cart!');
    };

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page empty">
                <div className="container">
                    <h1>My Wishlist</h1>
                    <div className="empty-state">
                        <p>Your wishlist is empty.</p>
                        <Link to="/products" className="btn btn-primary">Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <h1>My Wishlist ({wishlist.length})</h1>

                <div className="wishlist-grid">
                    {wishlist.map(item => (
                        <div key={item.id} className="wishlist-item">
                            <Link to={`/product/${item.product_id}`} className="wishlist-image">
                                <img
                                    src={item.image ? `http://localhost:5000${item.image}` : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"}
                                    alt={item.name}
                                />
                            </Link>

                            <div className="wishlist-details">
                                <Link to={`/product/${item.product_id}`}>
                                    <h3>{item.name}</h3>
                                </Link>
                                <p className="price">₹{item.price}</p>
                                <p className={`stock-status ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </p>
                            </div>

                            <div className="wishlist-actions">
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="btn btn-primary"
                                    disabled={item.stock <= 0}
                                >
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button
                                    onClick={() => removeFromWishlist(item.product_id)}
                                    className="btn btn-outline remove-btn"
                                >
                                    <FaTrash /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
