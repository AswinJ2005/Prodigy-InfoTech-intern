import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, phone],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Registration failed' });
                }

                const token = jwt.sign(
                    { id: this.lastID, email, role: 'user' },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: { id: this.lastID, email, name, phone, role: 'user' }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role
            }
        });
    });
});

// Get profile
router.get('/profile', authenticateToken, (req, res) => {
    db.get('SELECT id, email, name, phone, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});


// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, phone, password } = req.body;
    let query = 'UPDATE users SET name = ?, phone = ?';
    let params = [name, phone];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(req.user.id);

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: 'Failed to update profile' });
        res.json({ message: 'Profile updated successfully' });
    });
});

export default router;
