const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { 
    validateUserRegistration, 
    validateUserLogin, 
    validateProfileUpdate 
} = require('../middleware/validation');

const router = express.Router();

// User Registration
router.post('/register', validateUserRegistration, async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone } = req.body;

        // Check if user already exists
        const existingUsers = await executeQuery(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const result = await executeQuery(
            'INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, first_name, last_name, phone || null]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: result.insertId,
                    email,
                    first_name,
                    last_name,
                    phone,
                    role: 'user'
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

// User Login
router.post('/login', validateUserLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const users = await executeQuery(
            'SELECT id, email, password, first_name, last_name, phone, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Remove password from response
        delete user.password;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

// Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const users = await executeQuery(
            'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user: users[0] }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update User Profile
router.put('/profile', verifyToken, validateProfileUpdate, async (req, res) => {
    try {
        const { first_name, last_name, phone } = req.body;
        const userId = req.user.id;

        // Build dynamic update query
        const updates = [];
        const values = [];

        if (first_name !== undefined) {
            updates.push('first_name = ?');
            values.push(first_name);
        }
        if (last_name !== undefined) {
            updates.push('last_name = ?');
            values.push(last_name);
        }
        if (phone !== undefined) {
            updates.push('phone = ?');
            values.push(phone);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(userId);

        await executeQuery(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        // Return updated user data
        const users = await executeQuery(
            'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: users[0] }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during profile update'
        });
    }
});

// Get User's Booking History
router.get('/bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await executeQuery(
            `SELECT 
                b.id, b.booking_date, b.status, b.notes,
                w.title, w.description, w.instructor, w.date, 
                w.start_time, w.end_time, w.location, w.price
            FROM bookings b
            JOIN workshops w ON b.workshop_id = w.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: { bookings }
        });

    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
