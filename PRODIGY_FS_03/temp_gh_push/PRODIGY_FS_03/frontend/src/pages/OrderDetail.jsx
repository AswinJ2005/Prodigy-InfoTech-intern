import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`/api/orders/${id}`);
            setOrder(res.data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        }
    };

    if (!order) return <div className="loading">Loading...</div>;

    return (
        <div className="order-detail-page">
            <div className="container">
                <h1>Order Details</h1>

                <div className="order-info-grid">
                    <div className="info-card">
                        <h3>Order Information</h3>
                        <p><strong>Order ID:</strong> #{order.id}</p>
                        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span className="badge badge-success">{order.order_status.toUpperCase()}</span></p>
                        <p><strong>Payment Method:</strong> {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Manual Payment'}</p>
                        <p><strong>Payment Status:</strong> <span className={`badge ${order.payment_status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{order.payment_status.toUpperCase()}</span></p>
                        {order.transaction_id && <p><strong>Transaction ID:</strong> {order.transaction_id}</p>}
                    </div>

                    <div className="info-card">
                        <h3>Shipping Address</h3>
                        <p>{order.shipping_address}</p>
                    </div>
                </div>

                <div className="order-items-section">
                    <h2>Order Items</h2>
                    <div className="order-items">
                        {order.items?.map(item => (
                            <div key={item.id} className="order-item">
                                <img src={item.image ? `http://localhost:5000${item.image}` : `https://picsum.photos/seed/${item.product_id}/200/200`} alt={item.name} />
                                <div className="item-info">
                                    <h4>{item.name}</h4>
                                    <p>Quantity: {item.quantity}</p>
                                    <p className="item-price">₹{item.price} each</p>
                                </div>
                                <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="order-total">
                        <h3>Total: ₹{order.total_amount}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
