import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from '../utils/toast';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [review, setReview] = useState({ rating: 5, comment: '' });
    const { addToCart } = useCart();

    const { token, user } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`/api/products/${id}`);
            setProduct(res.data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/reviews/product/${id}`);
            setReviews(res.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!token) {
            alert('Please login to add items to cart');
            return;
        }
        try {
            await addToCart(product.id, quantity);
            alert('Added to cart!');
        } catch (error) {
            alert('Failed to add to cart');
        }
    };

    const handleWishlistClick = async () => {
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert('Please login to add a review');
            return;
        }
        try {
            await axios.post('/api/reviews', {
                product_id: id,
                rating: review.rating,
                comment: review.comment
            });
            setReview({ rating: 5, comment: '' });
            fetchReviews();
            fetchProduct();
            alert('Review added successfully!');
        } catch (error) {
            alert('Failed to add review');
        }
    };

    if (!product) return <div className="loading">Loading...</div>;

    // Get relevant placeholder image
    const getPlaceholderImage = () => {
        const name = product.name.toLowerCase();
        const category = product.category?.toLowerCase() || '';

        if (name.includes('headphone') || name.includes('earphone')) {
            return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';
        } else if (name.includes('shoe') || name.includes('sneaker')) {
            return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop';
        } else if (name.includes('watch')) {
            return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop';
        } else if (name.includes('yoga') || name.includes('mat')) {
            return 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop';
        } else if (name.includes('coffee')) {
            return 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&h=600&fit=crop';
        } else if (category.includes('electronics')) {
            return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop';
        } else if (category.includes('clothing')) {
            return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop';
        } else if (category.includes('sports')) {
            return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop';
        } else if (category.includes('home')) {
            return 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=600&fit=crop';
        }
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';
    };

    const imageUrl = product.image
        ? `http://localhost:5000${product.image}`
        : getPlaceholderImage();

    return (
        <div className="product-detail">
            <div className="container">
                <div className="product-main">
                    <div className="product-image-large">
                        <img src={imageUrl} alt={product.name} />
                    </div>

                    <div className="product-details">
                        <h1>{product.name}</h1>

                        <div className="rating-section">
                            <FaStar className="star" />
                            <span>{product.rating?.toFixed(1) || '0.0'}</span>
                            <span className="reviews-count">({product.reviews_count || 0} reviews)</span>
                        </div>

                        <p className="price">₹{product.price}</p>
                        <p className="description">{product.description}</p>
                        <p className="stock">Stock: {product.stock} available</p>

                        <div className="quantity-selector">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="input"
                            />
                        </div>

                        <button onClick={handleAddToCart} className="btn btn-primary">
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button
                            onClick={handleWishlistClick}
                            className={`btn btn-outline ${isWishlisted ? 'wishlist-active' : ''}`}
                            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </div>
                </div>

                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {token && (
                        <form onSubmit={handleReviewSubmit} className="review-form">
                            <h3>Write a Review</h3>
                            <select
                                value={review.rating}
                                onChange={(e) => setReview({ ...review, rating: e.target.value })}
                                className="input"
                            >
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                            <textarea
                                placeholder="Your review..."
                                value={review.comment}
                                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                                className="input"
                                rows="4"
                            />
                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    )}

                    <div className="reviews-list">
                        {reviews.map(r => (
                            <div key={r.id} className="review-card">
                                <div className="review-header">
                                    <strong>{r.user_name}</strong>
                                    <div className="review-rating">
                                        {[...Array(r.rating)].map((_, i) => (
                                            <FaStar key={i} className="star" />
                                        ))}
                                    </div>
                                </div>
                                <p>{r.comment}</p>
                                <small>{new Date(r.created_at).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Products */}
                <RelatedProducts productId={id} />
            </div>
        </div>
    );
};

export default ProductDetail;
