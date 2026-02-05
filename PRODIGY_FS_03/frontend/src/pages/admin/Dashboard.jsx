import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaShoppingCart, FaDollarSign, FaUsers, FaHeart } from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // Import BarElement
    Title,
    Tooltip,
    Legend,
    ArcElement // Import ArcElement for Pie charts
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2'; // Import Bar
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        pendingOrders: 0,
        totalUsers: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topWishlist, setTopWishlist] = useState([]);
    const [salesData, setSalesData] = useState(null);
    const [orderStatusData, setOrderStatusData] = useState(null); // Data for Pie Chart

    useEffect(() => {
        fetchStats();
        fetchRecentOrders();
        fetchTopWishlist();
    }, []);

    const fetchStats = async () => {
        try {
            const [ordersRes, productsRes, generalRes] = await Promise.all([
                axios.get('/api/orders/admin/all'),
                axios.get('/api/products'),
                axios.get('/api/admin/stats/general')
            ]);

            const orders = ordersRes.data;
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
            const pendingOrders = orders.filter(o => o.order_status === 'placed').length;

            setStats({
                totalOrders: orders.length,
                totalRevenue,
                totalProducts: productsRes.data.length,
                pendingOrders,
                totalUsers: generalRes.data.totalUsers
            });

            // Process data for charts
            processChartData(orders);

        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const processChartData = (orders) => {
        // 1. Sales Over Time (Last 7 days approx, or just grouping by date)
        const salesByDate = {};
        orders.forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString();
            salesByDate[date] = (salesByDate[date] || 0) + parseFloat(order.total_amount);
        });

        const labels = Object.keys(salesByDate).slice(-7); // Last 7 unique dates
        const dataPoints = labels.map(date => salesByDate[date]);

        setSalesData({
            labels,
            datasets: [
                {
                    label: 'Sales (₹)',
                    data: dataPoints,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    tension: 0.3
                }
            ]
        });

        // 2. Order Status Distribution (For Pie/Doughnut Chart)
        const statusCounts = {};
        orders.forEach(order => {
            const status = order.order_status || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        setOrderStatusData({
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: '# of Orders',
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                    borderWidth: 1,
                },
            ],
        });
    };

    const fetchRecentOrders = async () => {
        try {
            const res = await axios.get('/api/orders/admin/all');
            setRecentOrders(res.data.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const fetchTopWishlist = async () => {
        try {
            const res = await axios.get('/api/admin/stats/wishlist');
            setTopWishlist(res.data);
        } catch (error) {
            console.error('Failed to fetch wishlist stats:', error);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container-fluid">
                <h1 className="dashboard-title">Dashboard Overview</h1>

                <div className="stats-grid">
                    <div className="stat-card blue">
                        <div className="icon-wrapper"><FaShoppingCart /></div>
                        <div>
                            <h3>{stats.totalOrders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div className="stat-card green">
                        <div className="icon-wrapper"><FaDollarSign /></div>
                        <div>
                            <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                    <div className="stat-card orange">
                        <div className="icon-wrapper"><FaBox /></div>
                        <div>
                            <h3>{stats.totalProducts}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                    <div className="stat-card purple">
                        <div className="icon-wrapper"><FaUsers /></div>
                        <div>
                            <h3>{stats.totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                </div>

                <div className="charts-section">
                    <div className="chart-container main-chart">
                        <h2>Sales Trends</h2>
                        {salesData ? <Line options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={salesData} /> : <p>Loading chart...</p>}
                    </div>
                    <div className="chart-container side-chart">
                        <h2>Order Status</h2>
                        <div className="doughnut-limit">
                            {orderStatusData ? <Doughnut data={orderStatusData} /> : <p>Loading chart...</p>}
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid-2">
                    <div className="recent-orders">
                        <h2>Recent Orders</h2>
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>₹{order.total_amount}</td>
                                        <td><span className={`badge badge-${order.order_status === 'shipped' ? 'success' : order.order_status === 'cancelled' ? 'danger' : 'warning'}`}>{order.order_status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="top-wishlist">
                        <h2>Top Wishlisted</h2>
                        <div className="wishlist-list">
                            {topWishlist.map((item, index) => (
                                <div key={index} className="wishlist-stat-item">
                                    <span className="rank">#{index + 1}</span>
                                    <img src={item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/50"} alt={item.name} />
                                    <div className="info">
                                        <h4>{item.name}</h4>
                                        <div className="count"><FaHeart className="heart-icon" /> {item.count}</div>
                                    </div>
                                </div>
                            ))}
                            {topWishlist.length === 0 && <p className="no-data">No wishlist data yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
