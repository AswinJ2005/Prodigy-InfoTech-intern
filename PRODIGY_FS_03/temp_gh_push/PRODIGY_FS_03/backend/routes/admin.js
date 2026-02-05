import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users with stats
router.get('/users', authenticateToken, authorizeAdmin, (req, res) => {
    const query = `
        SELECT u.id, u.name, u.email, u.role, u.created_at,
               (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
               (SELECT COUNT(*) FROM wishlist WHERE user_id = u.id) as wishlist_count
        FROM users u
        ORDER BY u.created_at DESC
    `;

    db.all(query, [], (err, users) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch users' });
        res.json(users);
    });
});

// Delete user
router.delete('/users/:id', authenticateToken, authorizeAdmin, (req, res) => {
    // Prevent deleting self
    if (parseInt(req.params.id) === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to delete user' });
        res.json({ message: 'User deleted successfully' });
    });
});

// Get wishlist stats (Most wishlisted products)
router.get('/stats/wishlist', authenticateToken, authorizeAdmin, (req, res) => {
    const query = `
        SELECT p.name, p.image, COUNT(w.id) as count
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        GROUP BY p.id
        ORDER BY count DESC
        LIMIT 5
    `;

    db.all(query, [], (err, stats) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch wishlist stats' });
        res.json(stats);
    });
});

// Get general dashboard stats (Total Users)
router.get('/stats/general', authenticateToken, authorizeAdmin, (req, res) => {
    db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch user count' });
        res.json({ totalUsers: row.count });
    });
});

export default router;
