import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/orders/admin/all');
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { order_status: status });
            fetchOrders();
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    const confirmPayment = async (id) => {
        try {
            await axios.put(`/api/orders/${id}/confirm-payment`);
            fetchOrders();
            alert('Payment confirmed!');
        } catch (error) {
            alert('Failed to confirm payment');
        }
    };

    return (
        <div className="order-management-page">
            <div className="container">
                <h1>Order Management</h1>

                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Payment Status</th>
                            <th>Order Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>₹{order.total_amount}</td>
                                <td>{order.payment_method}</td>
                                <td>
                                    <span className={`badge ${order.payment_status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                        {order.payment_status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={order.order_status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="placed">Placed</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    {order.payment_method === 'manual' && order.payment_status === 'pending' && (
                                        <button onClick={() => confirmPayment(order.id)} className="btn btn-primary btn-sm">
                                            Confirm Payment
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
