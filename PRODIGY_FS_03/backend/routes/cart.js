import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
    const query = `
    SELECT c.id, c.quantity, p.* 
    FROM cart c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
  `;

    db.all(query, [req.user.id], (err, items) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch cart' });
        res.json(items);
    });
});

// Add to cart
router.post('/add', authenticateToken, (req, res) => {
    const { product_id, quantity } = req.body;

    db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, product_id], (err, existing) => {
        if (existing) {
            db.run(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, req.user.id, product_id],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Failed to update cart' });
                    res.json({ message: 'Cart updated successfully' });
                }
            );
        } else {
            db.run(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, product_id, quantity],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Failed to add to cart' });
                    res.json({ message: 'Added to cart successfully' });
                }
            );
        }
    });
});

// Update cart item
router.put('/update/:id', authenticateToken, (req, res) => {
    const { quantity } = req.body;

    db.run(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, req.params.id, req.user.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update cart' });
            res.json({ message: 'Cart updated successfully' });
        }
    );
});

// Remove from cart
router.delete('/remove/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to remove item' });
        res.json({ message: 'Item removed successfully' });
    });
});

// Clear cart
router.delete('/clear', authenticateToken, (req, res) => {
    db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to clear cart' });
        res.json({ message: 'Cart cleared successfully' });
    });
});

export default router;
