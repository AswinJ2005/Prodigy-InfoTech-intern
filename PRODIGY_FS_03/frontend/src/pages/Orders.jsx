import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/orders/my-orders');
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            placed: 'badge-warning',
            confirmed: 'badge-success',
            shipped: 'badge-success',
            delivered: 'badge-success',
            cancelled: 'badge-danger'
        };
        return statusMap[status] || 'badge-warning';
    };

    return (
        <div className="orders-page">
            <div className="container">
                <h1>My Orders</h1>

                {orders.length === 0 ? (
                    <p className="text-center mt-4">No orders yet</p>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order.id}</h3>
                                        <p>{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className={`badge ${getStatusBadge(order.order_status)}`}>
                                            {order.order_status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-details">
                                    <p><strong>Total:</strong> ₹{order.total_amount}</p>
                                    <p><strong>Payment:</strong> {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Manual Payment'}</p>
                                    <p><strong>Payment Status:</strong>
                                        <span className={`badge ${order.payment_status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                            {order.payment_status.toUpperCase()}
                                        </span>
                                    </p>
                                </div>

                                <Link to={`/order/${order.id}`} className="btn btn-outline">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
