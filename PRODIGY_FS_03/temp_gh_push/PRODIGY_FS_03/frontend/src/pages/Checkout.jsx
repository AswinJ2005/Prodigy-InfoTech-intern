import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [transactionId, setTransactionId] = useState('');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const shippingAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}. Phone: ${address.phone}`;

        try {
            const res = await axios.post('/api/orders/create', {
                payment_method: paymentMethod,
                shipping_address: shippingAddress,
                transaction_id: paymentMethod === 'manual' ? transactionId : null
            });

            await clearCart();
            alert('Order placed successfully!');
            navigate(`/order/${res.data.orderId}`);
        } catch (error) {
            alert('Failed to place order');
        }
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Checkout</h1>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="checkout-section">
                        <h2>Shipping Address</h2>
                        <input
                            type="text"
                            name="street"
                            placeholder="Street Address"
                            value={address.street}
                            onChange={handleAddressChange}
                            className="input"
                            required
                        />
                        <div className="form-row">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={address.city}
                                onChange={handleAddressChange}
                                className="input"
                                required
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={address.state}
                                onChange={handleAddressChange}
                                className="input"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="text"
                                name="zip"
                                placeholder="ZIP Code"
                                value={address.zip}
                                onChange={handleAddressChange}
                                className="input"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={address.phone}
                                onChange={handleAddressChange}
                                className="input"
                                required
                            />
                        </div>
                    </div>

                    <div className="checkout-section">
                        <h2>Payment Method</h2>
                        <div className="payment-options">
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>Cash on Delivery</span>
                            </label>

                            <label className="payment-option">
                                <input
                                    type="radio"
                                    value="manual"
                                    checked={paymentMethod === 'manual'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>Manual Payment (UPI/Bank Transfer)</span>
                            </label>
                        </div>

                        {paymentMethod === 'manual' && (
                            <div className="manual-payment-info">
                                <h3>Payment Instructions</h3>
                                <p><strong>UPI ID:</strong> localstore@upi</p>
                                <p><strong>Bank Account:</strong> 1234567890</p>
                                <p><strong>IFSC Code:</strong> BANK0001234</p>
                                <p className="mt-2">After making payment, enter your transaction ID below:</p>
                                <input
                                    type="text"
                                    placeholder="Transaction ID / UTR"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="input"
                                    required={paymentMethod === 'manual'}
                                />
                            </div>
                        )}
                    </div>

                    <div className="order-summary-checkout">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary place-order-btn">
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
