import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [token]);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get('/api/wishlist');
            setWishlist(res.data);
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        }
    };

    const addToWishlist = async (product) => {
        if (!token) return false;
        try {
            await axios.post('/api/wishlist', { product_id: product.id });
            await fetchWishlist(); // Refresh to get full details
            return true;
        } catch (error) {
            console.error('Failed to add to wishlist', error);
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!token) return;
        try {
            await axios.delete(`/api/wishlist/${productId}`);
            setWishlist(prev => prev.filter(item => item.product_id !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist', error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product_id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
