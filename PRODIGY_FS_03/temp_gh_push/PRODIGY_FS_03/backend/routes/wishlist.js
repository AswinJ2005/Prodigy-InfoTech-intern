import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateToken, (req, res) => {
    const query = `
        SELECT w.id, w.product_id, w.created_at,
               p.name, p.price, p.image, p.category, p.rating, p.reviews_count, p.stock
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
    `;

    db.all(query, [req.user.id], (err, items) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch wishlist' });
        res.json(items);
    });
});

// Add item to wishlist
router.post('/', authenticateToken, (req, res) => {
    const { product_id } = req.body;

    if (!product_id) return res.status(400).json({ error: 'Product ID is required' });

    db.run(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
        [req.user.id, product_id],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Item already in wishlist' });
                }
                return res.status(500).json({ error: 'Failed to add to wishlist' });
            }
            res.status(201).json({
                message: 'Added to wishlist',
                id: this.lastID
            });
        }
    );
});

// Remove item from wishlist (by product_id)
router.delete('/:productId', authenticateToken, (req, res) => {
    db.run(
        'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
        [req.user.id, req.params.productId],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to remove from wishlist' });
            if (this.changes === 0) return res.status(404).json({ error: 'Item not found in wishlist' });
            res.json({ message: 'Removed from wishlist' });
        }
    );
});

export default router;
