import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchCart();
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            const res = await axios.get('/api/cart');
            setCart(res.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    const addToCart = async (product_id, quantity = 1) => {
        try {
            await axios.post('/api/cart/add', { product_id, quantity });
            await fetchCart();
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (id, quantity) => {
        try {
            await axios.put(`/api/cart/update/${id}`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Failed to update cart:', error);
        }
    };

    const removeFromCart = async (id) => {
        try {
            await axios.delete(`/api/cart/remove/${id}`);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete('/api/cart/clear');
            setCart([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
