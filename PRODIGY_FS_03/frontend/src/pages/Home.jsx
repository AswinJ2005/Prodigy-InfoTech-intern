import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const res = await axios.get('/api/products?sort=rating');
            setProducts(res.data.slice(0, 8));
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    return (
        <div className="home">
            <section className="hero">
                <div className="container">
                    <h1>Welcome to Local Store</h1>
                    <p>Discover amazing products from your local community</p>
                    <Link to="/products" className="btn btn-primary">Shop Now</Link>
                </div>
            </section>

            <section className="featured-products">
                <div className="container">
                    <h2>Featured Products</h2>
                    <div className="grid grid-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
