import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all employee routes
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// Get all employees (with optional search/filter)
router.get('/', (req, res) => {
    const { search, department, status } = req.query;

    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND (name LIKE ? OR email LIKE ? OR position LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    if (department) {
        query += ' AND department = ?';
        params.push(department);
    }

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, employees) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching employees'
            });
        }

        res.json({
            success: true,
            count: employees.length,
            employees
        });
    });
});

// Get single employee by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM employees WHERE id = ?', [id], (err, employee) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching employee'
            });
        }

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            employee
        });
    });
});

// Create new employee
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').trim().notEmpty().withMessage('Position is required'),
        body('department').trim().notEmpty().withMessage('Department is required'),
        body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
        body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
        body('hire_date').isDate().withMessage('Valid hire date is required'),
        body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, position, department, salary, phone, hire_date, status } = req.body;

        // Check if email already exists
        db.get('SELECT * FROM employees WHERE email = ?', [email], (err, existing) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            // Insert new employee
            db.run(
                `INSERT INTO employees (name, email, position, department, salary, phone, hire_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, email, position, department, salary, phone || null, hire_date, status || 'active'],
                function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Error creating employee'
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Employee created successfully',
                        employee: {
                            id: this.lastID,
                            name,
                            email,
                            position,
                            department,
                            salary,
                            phone,
                            hire_date,
                            status: status || 'active'
                        }
                    });
                }
            );
        });
    }
);

// Update employee
router.put(
    '/:id',
    [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('position').optional().trim().notEmpty().withMessage('Position cannot be empty'),
        body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
        body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
        body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
        body('hire_date').optional().isDate().withMessage('Valid hire date is required'),
        body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const updates = req.body;

        // Check if employee exists
        db.get('SELECT * FROM employees WHERE id = ?', [id], (err, employee) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            // If email is being updated, check for duplicates
            if (updates.email && updates.email !== employee.email) {
                db.get('SELECT * FROM employees WHERE email = ? AND id != ?', [updates.email, id], (err, existing) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Database error'
                        });
                    }

                    if (existing) {
                        return res.status(400).json({
                            success: false,
                            message: 'Email already exists'
                        });
                    }

                    performUpdate();
                });
            } else {
                performUpdate();
            }

            function performUpdate() {
                const fields = [];
                const values = [];

                Object.keys(updates).forEach(key => {
                    fields.push(`${key} = ?`);
                    values.push(updates[key]);
                });

                fields.push('updated_at = CURRENT_TIMESTAMP');
                values.push(id);

                const query = `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`;

                db.run(query, values, function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Error updating employee'
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Employee updated successfully'
                    });
                });
            }
        });
    }
);

// Delete employee
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM employees WHERE id = ?', [id], (err, employee) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        db.run('DELETE FROM employees WHERE id = ?', [id], function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error deleting employee'
                });
            }

            res.json({
                success: true,
                message: 'Employee deleted successfully'
            });
        });
    });
});

export default router;
