import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import './RelatedProducts.css';

const RelatedProducts = ({ productId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRelatedProducts();
    }, [productId]);

    const fetchRelatedProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/products/${productId}/related`);
            setRelatedProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch related products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading related products...</div>;
    if (relatedProducts.length === 0) return null;

    return (
        <div className="related-products">
            <h2>You May Also Like</h2>
            <div className="related-grid">
                {relatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
