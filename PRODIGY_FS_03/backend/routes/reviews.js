import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Add review
router.post('/', authenticateToken, (req, res) => {
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
        return res.status(400).json({ error: 'Product ID and rating are required' });
    }

    db.run(
        'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [product_id, req.user.id, rating, comment],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to add review' });

            // Update product rating
            db.get(
                'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?',
                [product_id],
                (err, result) => {
                    if (!err) {
                        db.run(
                            'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
                            [result.avg_rating, result.count, product_id]
                        );
                    }
                }
            );

            res.status(201).json({ message: 'Review added successfully', id: this.lastID });
        }
    );
});

// Get product reviews
router.get('/product/:id', (req, res) => {
    db.all(
        `SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC`,
        [req.params.id],
        (err, reviews) => {
            if (err) return res.status(500).json({ error: 'Failed to fetch reviews' });
            res.json(reviews);
        }
    );
});

// Delete review
router.delete('/:id', authenticateToken, (req, res) => {
    db.get('SELECT * FROM reviews WHERE id = ?', [req.params.id], (err, review) => {
        if (err || !review) return res.status(404).json({ error: 'Review not found' });

        if (review.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        db.run('DELETE FROM reviews WHERE id = ?', [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete review' });

            // Update product rating
            db.get(
                'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?',
                [review.product_id],
                (err, result) => {
                    if (!err) {
                        db.run(
                            'UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?',
                            [result.avg_rating || 0, result.count, review.product_id]
                        );
                    }
                }
            );

            res.json({ message: 'Review deleted successfully' });
        });
    });
});

export default router;
