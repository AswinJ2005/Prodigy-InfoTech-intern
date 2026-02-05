import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const handlePriceChange = (type, value) => {
        onFilterChange({
            ...filters,
            [type]: value
        });
    };

    const handleRatingChange = (rating) => {
        onFilterChange({
            ...filters,
            minRating: filters.minRating === rating ? '' : rating
        });
    };

    const handleStockChange = () => {
        onFilterChange({
            ...filters,
            inStock: !filters.inStock
        });
    };

    const filterContent = (
        <div className="filter-content">
            <div className="filter-group">
                <h3>Price Range</h3>
                <div className="price-inputs">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    />
                </div>
            </div>

            <div className="filter-group">
                <h3>Minimum Rating</h3>
                <div className="rating-options">
                    {[4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            className={`rating-btn ${filters.minRating === rating ? 'active' : ''}`}
                            onClick={() => handleRatingChange(rating)}
                        >
                            {rating}★ & up
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={filters.inStock || false}
                        onChange={handleStockChange}
                    />
                    <span>In Stock Only</span>
                </label>
            </div>

            <button onClick={onClearFilters} className="btn btn-outline clear-btn">
                Clear All Filters
            </button>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                className="mobile-filter-btn"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
                <FaFilter /> Filters
            </button>

            {/* Desktop Filters */}
            <div className="filter-panel desktop-filters">
                <div className="filter-header">
                    <h2><FaFilter /> Filters</h2>
                </div>
                {filterContent}
            </div>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
                <div className="mobile-filters-overlay">
                    <div className="mobile-filters">
                        <div className="mobile-filter-header">
                            <h2><FaFilter /> Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        {filterContent}
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterPanel;
