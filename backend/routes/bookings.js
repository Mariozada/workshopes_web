const express = require('express');
const { executeQuery, getConnection } = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', verifyToken, async (req, res) => {
    const connection = await getConnection();
    
    try {
        await connection.beginTransaction();

        const { workshop_id, notes } = req.body;
        const user_id = req.user.id;

        // Check if workshop exists and is active
        const [workshop] = await connection.execute(
            `SELECT id, title, date, start_time, max_capacity, current_bookings, status 
             FROM workshops WHERE id = ? AND status = 'active'`,
            [workshop_id]
        );

        if (!workshop) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Workshop not found or not available for booking'
            });
        }

        // Check if workshop is in the future
        const workshopDateTime = new Date(`${workshop.date} ${workshop.start_time}`);
        const now = new Date();

        if (workshopDateTime <= now) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot book past workshops'
            });
        }

        // Check if user already has a booking for this workshop
        const [existingBooking] = await connection.execute(
            'SELECT id FROM bookings WHERE user_id = ? AND workshop_id = ? AND status = "confirmed"',
            [user_id, workshop_id]
        );

        if (existingBooking) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'You have already booked this workshop'
            });
        }

        // Check if workshop has available seats
        if (workshop.current_bookings >= workshop.max_capacity) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Workshop is fully booked'
            });
        }

        // Create booking
        const [bookingResult] = await connection.execute(
            'INSERT INTO bookings (user_id, workshop_id, notes) VALUES (?, ?, ?)',
            [user_id, workshop_id, notes || null]
        );

        // Update workshop current_bookings count
        await connection.execute(
            'UPDATE workshops SET current_bookings = current_bookings + 1 WHERE id = ?',
            [workshop_id]
        );

        await connection.commit();

        // Get booking details for response
        const [bookingDetails] = await executeQuery(
            `SELECT 
                b.id, b.booking_date, b.status, b.notes,
                w.title, w.description, w.instructor, w.date, 
                w.start_time, w.end_time, w.location, w.price
            FROM bookings b
            JOIN workshops w ON b.workshop_id = w.id
            WHERE b.id = ?`,
            [bookingResult.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Workshop booked successfully',
            data: { booking: bookingDetails }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during booking'
        });
    } finally {
        connection.release();
    }
});

// Get user's bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereCondition = 'b.user_id = ?';
        let queryParams = [req.user.id];

        if (status) {
            whereCondition += ' AND b.status = ?';
            queryParams.push(status);
        }

        const bookings = await executeQuery(
            `SELECT 
                b.id, b.booking_date, b.status, b.notes,
                w.id as workshop_id, w.title, w.description, w.instructor, 
                w.date, w.start_time, w.end_time, w.location, w.price,
                CASE WHEN CONCAT(w.date, ' ', w.start_time) > NOW() THEN 1 ELSE 0 END as can_cancel
            FROM bookings b
            JOIN workshops w ON b.workshop_id = w.id
            WHERE ${whereCondition}
            ORDER BY w.date DESC, w.start_time DESC
            LIMIT ? OFFSET ?`,
            [...queryParams, parseInt(limit), parseInt(offset)]
        );

        // Get total count
        const [countResult] = await executeQuery(
            `SELECT COUNT(*) as total
            FROM bookings b
            WHERE ${whereCondition}`,
            queryParams
        );

        const totalBookings = countResult.total;
        const totalPages = Math.ceil(totalBookings / limit);

        res.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: totalPages,
                    total_items: totalBookings,
                    items_per_page: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Bookings fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Cancel booking
router.delete('/:id', verifyToken, async (req, res) => {
    const connection = await getConnection();
    
    try {
        await connection.beginTransaction();

        const bookingId = req.params.id;
        const userId = req.user.id;

        // Get booking details
        const [booking] = await connection.execute(
            `SELECT b.id, b.user_id, b.workshop_id, b.status,
                    w.date, w.start_time, w.title
             FROM bookings b
             JOIN workshops w ON b.workshop_id = w.id
             WHERE b.id = ?`,
            [bookingId]
        );

        if (!booking) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking (unless admin)
        if (req.user.role !== 'admin' && booking.user_id !== userId) {
            await connection.rollback();
            return res.status(403).json({
                success: false,
                message: 'You can only cancel your own bookings'
            });
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Check if workshop is in the future (allow cancellation up to workshop start time)
        const workshopDateTime = new Date(`${booking.date} ${booking.start_time}`);
        const now = new Date();

        if (workshopDateTime <= now) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel bookings for past or ongoing workshops'
            });
        }

        // Cancel booking
        await connection.execute(
            'UPDATE bookings SET status = "cancelled" WHERE id = ?',
            [bookingId]
        );

        // Decrease workshop current_bookings count
        await connection.execute(
            'UPDATE workshops SET current_bookings = current_bookings - 1 WHERE id = ?',
            [booking.workshop_id]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Booking cancellation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during booking cancellation'
        });
    } finally {
        connection.release();
    }
});

// Get all bookings (Admin only)
router.get('/all', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { 
            workshop_id, 
            status, 
            page = 1, 
            limit = 10,
            user_email 
        } = req.query;
        
        const offset = (page - 1) * limit;

        let whereConditions = [];
        let queryParams = [];

        if (workshop_id) {
            whereConditions.push('b.workshop_id = ?');
            queryParams.push(workshop_id);
        }

        if (status) {
            whereConditions.push('b.status = ?');
            queryParams.push(status);
        }

        if (user_email) {
            whereConditions.push('u.email LIKE ?');
            queryParams.push(`%${user_email}%`);
        }

        const whereClause = whereConditions.length > 0 ? 
            `WHERE ${whereConditions.join(' AND ')}` : '';

        const bookings = await executeQuery(
            `SELECT 
                b.id, b.booking_date, b.status, b.notes,
                u.email, u.first_name, u.last_name, u.phone,
                w.id as workshop_id, w.title, w.instructor, w.date, 
                w.start_time, w.end_time, w.location, w.price
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN workshops w ON b.workshop_id = w.id
            ${whereClause}
            ORDER BY b.booking_date DESC
            LIMIT ? OFFSET ?`,
            [...queryParams, parseInt(limit), parseInt(offset)]
        );

        // Get total count
        const [countResult] = await executeQuery(
            `SELECT COUNT(*) as total
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN workshops w ON b.workshop_id = w.id
            ${whereClause}`,
            queryParams
        );

        const totalBookings = countResult.total;
        const totalPages = Math.ceil(totalBookings / limit);

        res.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: totalPages,
                    total_items: totalBookings,
                    items_per_page: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Admin bookings fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get workshop participants (Admin only)
router.get('/workshop/:workshop_id/participants', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { workshop_id } = req.params;

        // Check if workshop exists
        const [workshop] = await executeQuery(
            'SELECT id, title FROM workshops WHERE id = ?',
            [workshop_id]
        );

        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        const participants = await executeQuery(
            `SELECT 
                u.id, u.email, u.first_name, u.last_name, u.phone,
                b.booking_date, b.status, b.notes
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            WHERE b.workshop_id = ? AND b.status = 'confirmed'
            ORDER BY b.booking_date ASC`,
            [workshop_id]
        );

        res.json({
            success: true,
            data: {
                workshop: workshop,
                participants,
                total_participants: participants.length
            }
        });

    } catch (error) {
        console.error('Participants fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
