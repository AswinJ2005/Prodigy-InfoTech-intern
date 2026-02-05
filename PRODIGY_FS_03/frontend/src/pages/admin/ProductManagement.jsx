import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct.id}`, data);
            } else {
                await axios.post('/api/products', data);
            }
            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', stock: '', image: null });
            fetchProducts();
        } catch (error) {
            alert('Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: null
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await axios.delete(`/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    return (
        <div className="product-management-page">
            <div className="container">
                <div className="page-header">
                    <h1>Product Management</h1>
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                        <FaPlus /> Add Product
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="product-form">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows="3"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="input"
                            required
                        />
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home">Home</option>
                            <option value="Sports">Sports</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="input"
                            required
                        />

                        <div className="image-upload-section">
                            {editingProduct && editingProduct.image && (
                                <div className="current-image">
                                    <p><strong>Current Image:</strong></p>
                                    <img
                                        src={`http://localhost:5000${editingProduct.image}`}
                                        alt="Current product"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '14px', color: '#666' }}>Upload a new image to replace</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                className="input"
                            />
                            {formData.image && (
                                <p style={{ fontSize: '14px', color: '#4CAF50', marginTop: '5px' }}>
                                    ✓ New image selected: {formData.image.name}
                                </p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingProduct ? 'Update' : 'Create'} Product
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); }} className="btn btn-outline">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td><img src={product.image ? `http://localhost:5000${product.image}` : `https://picsum.photos/seed/${product.id}/100/100`} alt={product.name} className="product-thumb" /></td>
                                <td>{product.name}</td>
                                <td className="description-cell" title={product.description}>{product.description}</td>
                                <td>{product.category}</td>
                                <td>₹{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)} className="btn-icon"><FaEdit /></button>
                                    <button onClick={() => handleDelete(product.id)} className="btn-icon danger"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;
