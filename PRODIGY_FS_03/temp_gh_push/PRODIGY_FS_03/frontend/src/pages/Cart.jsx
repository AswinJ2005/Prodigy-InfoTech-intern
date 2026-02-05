import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (item, newQty) => {
        if (newQty < 1) return;
        updateQuantity(item.id, newQty);
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <h1>Shopping Cart</h1>
                    <p className="text-center mt-4">Your cart is empty</p>
                    <div className="text-center mt-3">
                        <button onClick={() => navigate('/products')} className="btn btn-primary">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart</h1>

                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image ? `http://localhost:5000${item.image}` : `https://picsum.photos/seed/${item.id}/200/200`} alt={item.name} />

                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">₹{item.price}</p>
                                </div>

                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>
                                        <FaMinus />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item, item.quantity + 1)}>
                                        <FaPlus />
                                    </button>
                                </div>

                                <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>

                                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={() => navigate('/checkout')} className="btn btn-primary">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
