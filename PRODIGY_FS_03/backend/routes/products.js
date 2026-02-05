import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../database.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(dirname(__dirname), 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all products with filters
router.get('/', (req, res) => {
    const { category, minPrice, maxPrice, search, sort, minRating, inStock } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (minPrice) {
        query += ' AND price >= ?';
        params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
    }

    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (minRating) {
        query += ' AND rating >= ?';
        params.push(parseFloat(minRating));
    }

    if (inStock === 'true') {
        query += ' AND stock > 0';
    }

    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else if (sort === 'rating') query += ' ORDER BY rating DESC';
    else query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, products) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch products' });
        res.json(products);
    });
});

// Get single product
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err || !product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    });
});

// Get related products (same category, excluding current product)
router.get('/:id/related', (req, res) => {
    const productId = req.params.id;

    // First get the product's category
    db.get('SELECT category FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) return res.status(404).json({ error: 'Product not found' });

        // Get products from same category, excluding current product, limit to 4
        db.all(
            'SELECT * FROM products WHERE category = ? AND id != ? ORDER BY rating DESC LIMIT 4',
            [product.category, productId],
            (err, relatedProducts) => {
                if (err) return res.status(500).json({ error: 'Failed to fetch related products' });
                res.json(relatedProducts);
            }
        );
    });
});

// Create product (admin only)
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    db.run(
        'INSERT INTO products (name, description, price, category, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, category, stock || 0, image],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to create product' });
            res.status(201).json({ id: this.lastID, message: 'Product created successfully' });
        }
    );
});

// Update product (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    let query = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?';
    const params = [name, description, price, category, stock];

    if (image) {
        query += ', image = ?';
        params.push(image);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: 'Failed to update product' });
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to delete product' });
        res.json({ message: 'Product deleted successfully' });
    });
});

export default router;
