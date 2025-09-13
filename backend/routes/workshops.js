const express = require('express');
const { executeQuery } = require('../config/database');
const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateWorkshopCreation } = require('../middleware/validation');

const router = express.Router();

// Get all workshops (public route with optional auth for user-specific data)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            search, 
            date_from, 
            date_to,
            status = 'active'
        } = req.query;

        const offset = (page - 1) * limit;
        let whereConditions = ['w.status = ?'];
        let queryParams = [status];

        // Add filters
        if (category) {
            whereConditions.push('w.category = ?');
            queryParams.push(category);
        }

        if (search) {
            whereConditions.push('(w.title LIKE ? OR w.description LIKE ? OR w.instructor LIKE ?)');
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        if (date_from) {
            whereConditions.push('w.date >= ?');
            queryParams.push(date_from);
        }

        if (date_to) {
            whereConditions.push('w.date <= ?');
            queryParams.push(date_to);
        }

        const whereClause = whereConditions.join(' AND ');

        // Get workshops with booking info
        let workshopQuery = `
            SELECT 
                w.*,
                (w.max_capacity - w.current_bookings) as available_seats,
                CASE WHEN w.current_bookings >= w.max_capacity THEN 1 ELSE 0 END as is_full
        `;

        // If user is authenticated, check if they have booked this workshop
        if (req.user) {
            workshopQuery += `,
                CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END as user_has_booked
            FROM workshops w
            LEFT JOIN bookings b ON w.id = b.workshop_id AND b.user_id = ? AND b.status = 'confirmed'
            `;
            queryParams.unshift(req.user.id);
        } else {
            workshopQuery += `
            FROM workshops w
            `;
        }

        workshopQuery += `
            WHERE ${whereClause}
            ORDER BY w.date ASC, w.start_time ASC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), parseInt(offset));

        const workshops = await executeQuery(workshopQuery, queryParams);

        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(*) as total
            FROM workshops w
            WHERE ${whereClause}
        `;
        const countParams = req.user ? queryParams.slice(1, -2) : queryParams.slice(0, -2);
        const [countResult] = await executeQuery(countQuery, countParams);

        const totalWorkshops = countResult.total;
        const totalPages = Math.ceil(totalWorkshops / limit);

        res.json({
            success: true,
            data: {
                workshops,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: totalPages,
                    total_items: totalWorkshops,
                    items_per_page: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Workshops fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get single workshop details
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const workshopId = req.params.id;

        let workshopQuery = `
            SELECT 
                w.*,
                (w.max_capacity - w.current_bookings) as available_seats,
                CASE WHEN w.current_bookings >= w.max_capacity THEN 1 ELSE 0 END as is_full
        `;

        let queryParams = [];

        if (req.user) {
            workshopQuery += `,
                CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END as user_has_booked
            FROM workshops w
            LEFT JOIN bookings b ON w.id = b.workshop_id AND b.user_id = ? AND b.status = 'confirmed'
            WHERE w.id = ?
            `;
            queryParams = [req.user.id, workshopId];
        } else {
            workshopQuery += `
            FROM workshops w
            WHERE w.id = ?
            `;
            queryParams = [workshopId];
        }

        const workshops = await executeQuery(workshopQuery, queryParams);

        if (workshops.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        res.json({
            success: true,
            data: { workshop: workshops[0] }
        });

    } catch (error) {
        console.error('Workshop fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Create new workshop (Admin only)
router.post('/', verifyToken, requireAdmin, validateWorkshopCreation, async (req, res) => {
    try {
        const {
            title, description, instructor, date, start_time, end_time,
            location, price, max_capacity, category, image_url
        } = req.body;

        // Validate that end_time is after start_time
        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: 'End time must be after start time'
            });
        }

        // Validate that date is in the future
        const workshopDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (workshopDate < today) {
            return res.status(400).json({
                success: false,
                message: 'Workshop date must be in the future'
            });
        }

        const result = await executeQuery(
            `INSERT INTO workshops 
            (title, description, instructor, date, start_time, end_time, location, price, max_capacity, category, image_url, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, instructor, date, start_time, end_time, location, price, max_capacity, category || null, image_url || null, req.user.id]
        );

        // Get the created workshop
        const [workshop] = await executeQuery(
            'SELECT * FROM workshops WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Workshop created successfully',
            data: { workshop }
        });

    } catch (error) {
        console.error('Workshop creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during workshop creation'
        });
    }
});

// Update workshop (Admin only)
router.put('/:id', verifyToken, requireAdmin, validateWorkshopCreation, async (req, res) => {
    try {
        const workshopId = req.params.id;
        const {
            title, description, instructor, date, start_time, end_time,
            location, price, max_capacity, category, image_url, status
        } = req.body;

        // Check if workshop exists
        const existingWorkshops = await executeQuery(
            'SELECT id, current_bookings FROM workshops WHERE id = ?',
            [workshopId]
        );

        if (existingWorkshops.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        const existingWorkshop = existingWorkshops[0];

        // Validate that new max_capacity is not less than current bookings
        if (max_capacity < existingWorkshop.current_bookings) {
            return res.status(400).json({
                success: false,
                message: `Cannot reduce capacity below current bookings (${existingWorkshop.current_bookings})`
            });
        }

        // Validate time
        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: 'End time must be after start time'
            });
        }

        await executeQuery(
            `UPDATE workshops SET 
            title = ?, description = ?, instructor = ?, date = ?, 
            start_time = ?, end_time = ?, location = ?, price = ?, 
            max_capacity = ?, category = ?, image_url = ?, status = ?
            WHERE id = ?`,
            [title, description, instructor, date, start_time, end_time, location, price, max_capacity, category || null, image_url || null, status || 'active', workshopId]
        );

        // Get updated workshop
        const [workshop] = await executeQuery(
            'SELECT * FROM workshops WHERE id = ?',
            [workshopId]
        );

        res.json({
            success: true,
            message: 'Workshop updated successfully',
            data: { workshop }
        });

    } catch (error) {
        console.error('Workshop update error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during workshop update'
        });
    }
});

// Delete workshop (Admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const workshopId = req.params.id;

        // Check if workshop exists and has bookings
        const workshops = await executeQuery(
            'SELECT id, current_bookings FROM workshops WHERE id = ?',
            [workshopId]
        );

        if (workshops.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        const workshop = workshops[0];

        if (workshop.current_bookings > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete workshop with existing bookings. Cancel bookings first or mark workshop as cancelled.'
            });
        }

        await executeQuery('DELETE FROM workshops WHERE id = ?', [workshopId]);

        res.json({
            success: true,
            message: 'Workshop deleted successfully'
        });

    } catch (error) {
        console.error('Workshop deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during workshop deletion'
        });
    }
});

// Get workshop categories
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await executeQuery(
            'SELECT DISTINCT category FROM workshops WHERE category IS NOT NULL AND status = "active" ORDER BY category'
        );

        res.json({
            success: true,
            data: { categories: categories.map(c => c.category) }
        });

    } catch (error) {
        console.error('Categories fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
