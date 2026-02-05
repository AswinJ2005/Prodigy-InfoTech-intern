import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const { token } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product.id);

    const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            alert('Please login to use wishlist');
            return;
        }

        if (isWishlisted) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('Please login to add items to cart');
            return;
        }
        try {
            await addToCart(product.id);
            alert('Added to cart!');
        } catch (error) {
            alert('Failed to add to cart: ' + (error.response?.data?.error || error.message));
        }
    };

    // Get relevant placeholder image based on product name/category
    const getPlaceholderImage = () => {
        const name = product.name.toLowerCase();
        const category = product.category?.toLowerCase() || '';

        // Map product types to Unsplash image queries
        if (name.includes('headphone') || name.includes('earphone')) {
            return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
        } else if (name.includes('shoe') || name.includes('sneaker')) {
            return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
        } else if (name.includes('watch')) {
            return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop';
        } else if (name.includes('yoga') || name.includes('mat')) {
            return 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop';
        } else if (name.includes('coffee')) {
            return 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop';
        } else if (category.includes('electronics')) {
            return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop';
        } else if (category.includes('clothing')) {
            return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop';
        } else if (category.includes('sports')) {
            return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop';
        } else if (category.includes('home')) {
            return 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop';
        }
        return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop`;
    };

    // Construct full image URL
    const imageUrl = product.image
        ? `http://localhost:5000${product.image}`
        : getPlaceholderImage();

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-image">
                <img src={imageUrl} alt={product.name} />
                <button
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={handleWishlistClick}
                >
                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
            </Link>

            <div className="product-info">
                <Link to={`/product/${product.id}`}>
                    <h3>{product.name}</h3>
                </Link>

                <div className="product-rating">
                    <FaStar className="star" />
                    <span>{product.rating || 0}</span>
                    <span className="reviews-count">({product.reviews_count || 0})</span>
                </div>

                <p className="product-price">₹{product.price}</p>

                <button onClick={handleAddToCart} className="btn btn-primary">
                    <FaShoppingCart /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
