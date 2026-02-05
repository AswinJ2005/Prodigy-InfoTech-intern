import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        minRating: searchParams.get('minRating') || '',
        inStock: searchParams.get('inStock') === 'true',
        sort: searchParams.get('sort') || ''
    });

    useEffect(() => {
        fetchProducts();
        // Update URL params
        const params = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) params[key] = filters[key];
        });
        setSearchParams(params);
    }, [filters]);

    const fetchProducts = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.minRating) params.append('minRating', filters.minRating);
            if (filters.inStock) params.append('inStock', 'true');
            if (filters.sort) params.append('sort', filters.sort);

            const res = await axios.get(`/api/products?${params}`);
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            minRating: '',
            inStock: false,
            sort: ''
        });
    };

    const handleCategoryChange = (e) => {
        setFilters({ ...filters, category: e.target.value });
    };

    const handleSortChange = (e) => {
        setFilters({ ...filters, sort: e.target.value });
    };

    return (
        <div className="products-page">
            <div className="container">
                <h1>Products</h1>

                <div className="products-layout">
                    {/* Filter Sidebar */}
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />

                    {/* Products Grid */}
                    <div className="products-main">
                        <div className="products-header">
                            <select
                                value={filters.category}
                                onChange={handleCategoryChange}
                                className="input"
                            >
                                <option value="">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home">Home</option>
                                <option value="Sports">Sports</option>
                            </select>

                            <select
                                value={filters.sort}
                                onChange={handleSortChange}
                                className="input"
                            >
                                <option value="">Sort By</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>

                            <span className="product-count">{products.length} Products</span>
                        </div>

                        <div className="grid grid-3">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="empty-state">
                                <p>No products found</p>
                                <button onClick={handleClearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
