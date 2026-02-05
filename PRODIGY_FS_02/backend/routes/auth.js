import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import db from '../database.js';

const router = express.Router();

// Login endpoint
router.post(
    '/login',
    [
        body('username').trim().notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        try {
            // Find user
            db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                async (err, user) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Database error'
                        });
                    }

                    if (!user) {
                        return res.status(401).json({
                            success: false,
                            message: 'Invalid credentials'
                        });
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {
                        return res.status(401).json({
                            success: false,
                            message: 'Invalid credentials'
                        });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                        {
                            id: user.id,
                            username: user.username,
                            role: user.role
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRES_IN }
                    );

                    res.json({
                        success: true,
                        message: 'Login successful',
                        token,
                        user: {
                            id: user.id,
                            username: user.username,
                            role: user.role
                        }
                    });
                }
            );
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

// Register endpoint (optional - for creating additional admin users)
router.post(
    '/register',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        try {
            // Check if user exists
            db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                async (err, existingUser) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Database error'
                        });
                    }

                    if (existingUser) {
                        return res.status(400).json({
                            success: false,
                            message: 'Username already exists'
                        });
                    }

                    // Hash password
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Create user
                    db.run(
                        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                        [username, hashedPassword, 'admin'],
                        function (err) {
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Error creating user'
                                });
                            }

                            res.status(201).json({
                                success: true,
                                message: 'User registered successfully',
                                user: {
                                    id: this.lastID,
                                    username
                                }
                            });
                        }
                    );
                }
            );
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
);

export default router;
