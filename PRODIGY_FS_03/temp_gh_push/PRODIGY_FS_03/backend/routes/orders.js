import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/create', authenticateToken, (req, res) => {
    const { payment_method, shipping_address, transaction_id } = req.body;

    // Get cart items
    db.all(
        `SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?`,
        [req.user.id],
        (err, cartItems) => {
            if (err || !cartItems.length) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const paymentStatus = payment_method === 'cod' ? 'cod' : 'pending';

            db.run(
                `INSERT INTO orders (user_id, total_amount, payment_method, payment_status, shipping_address, transaction_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [req.user.id, total, payment_method, paymentStatus, shipping_address, transaction_id],
                function (err) {
                    if (err) return res.status(500).json({ error: 'Failed to create order' });

                    const orderId = this.lastID;

                    // Insert order items
                    const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
                    cartItems.forEach(item => {
                        stmt.run(orderId, item.product_id, item.quantity, item.price);
                    });
                    stmt.finalize();

                    // Clear cart
                    db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

                    res.status(201).json({ message: 'Order created successfully', orderId });
                }
            );
        }
    );
});

// Get user's orders
router.get('/my-orders', authenticateToken, (req, res) => {
    db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, orders) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch orders' });
        res.json(orders);
    });
});

// Get order details
router.get('/:id', authenticateToken, (req, res) => {
    db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
        if (err || !order) return res.status(404).json({ error: 'Order not found' });

        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        db.all(
            `SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
            [req.params.id],
            (err, items) => {
                if (err) return res.status(500).json({ error: 'Failed to fetch order items' });
                res.json({ ...order, items });
            }
        );
    });
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, authorizeAdmin, (req, res) => {
    const { order_status } = req.body;

    db.run(
        'UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [order_status, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update order status' });
            res.json({ message: 'Order status updated successfully' });
        }
    );
});

// Confirm manual payment (admin only)
router.put('/:id/confirm-payment', authenticateToken, authorizeAdmin, (req, res) => {
    db.run(
        'UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['confirmed', req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Failed to confirm payment' });
            res.json({ message: 'Payment confirmed successfully' });
        }
    );
});

// Get all orders (admin only)
router.get('/admin/all', authenticateToken, authorizeAdmin, (req, res) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, orders) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch orders' });
        res.json(orders);
    });
});

export default router;
