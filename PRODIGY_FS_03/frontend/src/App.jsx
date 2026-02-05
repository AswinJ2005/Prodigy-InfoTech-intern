import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { setToastCallback } from './utils/toast';
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';

function App() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        setToastCallback((toast) => {
            const id = Date.now();
            setToasts(prev => [...prev, { ...toast, id }]);
        });
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <BrowserRouter>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <div className="app">
                            <Navbar />
                            <main className="main-content">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/product/:id" element={<ProductDetail />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/wishlist" element={<Wishlist />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/order/:id" element={<OrderDetail />} />
                                    <Route path="/admin" element={<AdminLayout />}>
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="products" element={<ProductManagement />} />
                                        <Route path="orders" element={<OrderManagement />} />
                                        <Route path="users" element={<UserManagement />} />
                                    </Route>
                                </Routes>
                            </main>
                            <Footer />

                            {/* Toast notifications */}
                            <div className="toast-container">
                                {toasts.map(toast => (
                                    <Toast
                                        key={toast.id}
                                        message={toast.message}
                                        type={toast.type}
                                        onClose={() => removeToast(toast.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
