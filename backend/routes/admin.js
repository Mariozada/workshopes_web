const express = require('express');
const { executeQuery } = require('../config/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', verifyToken, requireAdmin, async (req, res) => {
    try {
        // Get total users
        const [usersCount] = await executeQuery(
            'SELECT COUNT(*) as total FROM users WHERE role = "user"'
        );

        // Get total workshops
        const [workshopsCount] = await executeQuery(
            'SELECT COUNT(*) as total FROM workshops WHERE status = "active"'
        );

        // Get total bookings
        const [bookingsCount] = await executeQuery(
            'SELECT COUNT(*) as total FROM bookings WHERE status = "confirmed"'
        );

        // Get revenue (sum of confirmed bookings)
        const [revenue] = await executeQuery(
            `SELECT COALESCE(SUM(w.price), 0) as total
             FROM bookings b
             JOIN workshops w ON b.workshop_id = w.id
             WHERE b.status = 'confirmed'`
        );

        // Get recent bookings
        const recentBookings = await executeQuery(
            `SELECT 
                b.id, b.booking_date,
                u.first_name, u.last_name, u.email,
                w.title, w.date, w.start_time
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN workshops w ON b.workshop_id = w.id
            WHERE b.status = 'confirmed'
            ORDER BY b.booking_date DESC
            LIMIT 10`
        );

        // Get upcoming workshops
        const upcomingWorkshops = await executeQuery(
            `SELECT 
                w.id, w.title, w.date, w.start_time, w.instructor,
                w.current_bookings, w.max_capacity,
                (w.max_capacity - w.current_bookings) as available_seats
            FROM workshops w
            WHERE w.status = 'active' AND w.date >= CURDATE()
            ORDER BY w.date ASC, w.start_time ASC
            LIMIT 10`
        );

        res.json({
            success: true,
            data: {
                statistics: {
                    total_users: usersCount.total,
                    total_workshops: workshopsCount.total,
                    total_bookings: bookingsCount.total,
                    total_revenue: revenue.total
                },
                recent_bookings: recentBookings,
                upcoming_workshops: upcomingWorkshops
            }
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Workshop analytics
router.get('/workshops/analytics', verifyToken, requireAdmin, async (req, res) => {
    try {
        // Most popular workshops by bookings
        const popularWorkshops = await executeQuery(
            `SELECT 
                w.id, w.title, w.instructor, w.date,
                COUNT(b.id) as total_bookings,
                w.max_capacity,
                ROUND((COUNT(b.id) / w.max_capacity) * 100, 2) as fill_rate
            FROM workshops w
            LEFT JOIN bookings b ON w.id = b.workshop_id AND b.status = 'confirmed'
            WHERE w.status = 'active'
            GROUP BY w.id
            ORDER BY total_bookings DESC, fill_rate DESC
            LIMIT 10`
        );

        // Bookings by category
        const categoryStats = await executeQuery(
            `SELECT 
                COALESCE(w.category, 'Uncategorized') as category,
                COUNT(b.id) as total_bookings,
                SUM(w.price) as total_revenue
            FROM workshops w
            LEFT JOIN bookings b ON w.id = b.workshop_id AND b.status = 'confirmed'
            WHERE w.status = 'active'
            GROUP BY w.category
            ORDER BY total_bookings DESC`
        );

        // Monthly booking trends (last 12 months)
        const monthlyTrends = await executeQuery(
            `SELECT 
                DATE_FORMAT(b.booking_date, '%Y-%m') as month,
                COUNT(b.id) as total_bookings,
                SUM(w.price) as total_revenue
            FROM bookings b
            JOIN workshops w ON b.workshop_id = w.id
            WHERE b.status = 'confirmed' 
            AND b.booking_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m')
            ORDER BY month ASC`
        );

        // Workshop capacity utilization
        const capacityUtilization = await executeQuery(
            `SELECT 
                w.id, w.title, w.date, w.start_time,
                w.current_bookings, w.max_capacity,
                ROUND((w.current_bookings / w.max_capacity) * 100, 2) as utilization_rate
            FROM workshops w
            WHERE w.status = 'active'
            ORDER BY utilization_rate DESC, w.date ASC`
        );

        res.json({
            success: true,
            data: {
                popular_workshops: popularWorkshops,
                category_statistics: categoryStats,
                monthly_trends: monthlyTrends,
                capacity_utilization: capacityUtilization
            }
        });

    } catch (error) {
        console.error('Workshop analytics fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// User analytics
router.get('/users/analytics', verifyToken, requireAdmin, async (req, res) => {
    try {
        // User registration trends (last 12 months)
        const registrationTrends = await executeQuery(
            `SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as new_users
            FROM users
            WHERE role = 'user'
            AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC`
        );

        // Most active users (by bookings)
        const activeUsers = await executeQuery(
            `SELECT 
                u.id, u.first_name, u.last_name, u.email,
                COUNT(b.id) as total_bookings,
                SUM(w.price) as total_spent
            FROM users u
            JOIN bookings b ON u.id = b.user_id
            JOIN workshops w ON b.workshop_id = w.id
            WHERE u.role = 'user' AND b.status = 'confirmed'
            GROUP BY u.id
            ORDER BY total_bookings DESC, total_spent DESC
            LIMIT 20`
        );

        // User engagement stats
        const [engagementStats] = await executeQuery(
            `SELECT 
                COUNT(DISTINCT u.id) as total_users,
                COUNT(DISTINCT b.user_id) as users_with_bookings,
                ROUND((COUNT(DISTINCT b.user_id) / COUNT(DISTINCT u.id)) * 100, 2) as engagement_rate
            FROM users u
            LEFT JOIN bookings b ON u.id = b.user_id AND b.status = 'confirmed'
            WHERE u.role = 'user'`
        );

        res.json({
            success: true,
            data: {
                registration_trends: registrationTrends,
                most_active_users: activeUsers,
                engagement_statistics: engagementStats
            }
        });

    } catch (error) {
        console.error('User analytics fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Financial reports
router.get('/financial', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let dateFilter = '';
        let queryParams = [];

        if (start_date && end_date) {
            dateFilter = 'AND DATE(b.booking_date) BETWEEN ? AND ?';
            queryParams = [start_date, end_date];
        } else if (start_date) {
            dateFilter = 'AND DATE(b.booking_date) >= ?';
            queryParams = [start_date];
        } else if (end_date) {
            dateFilter = 'AND DATE(b.booking_date) <= ?';
            queryParams = [end_date];
        }

        // Revenue summary
        const [revenueSummary] = await executeQuery(
            `SELECT 
                COUNT(b.id) as total_bookings,
                SUM(w.price) as total_revenue,
                AVG(w.price) as average_booking_value
            FROM bookings b
            JOIN workshops w ON b.workshop_id = w.id
            WHERE b.status = 'confirmed' ${dateFilter}`,
            queryParams
        );

        // Revenue by workshop
        const revenueByWorkshop = await executeQuery(
            `SELECT 
                w.id, w.title, w.instructor, w.date,
                COUNT(b.id) as total_bookings,
                w.price as workshop_price,
                SUM(w.price) as total_revenue
            FROM workshops w
            JOIN bookings b ON w.id = b.workshop_id
            WHERE b.status = 'confirmed' ${dateFilter}
            GROUP BY w.id
            ORDER BY total_revenue DESC`,
            queryParams
        );

        // Revenue by category
        const revenueByCategory = await executeQuery(
            `SELECT 
                COALESCE(w.category, 'Uncategorized') as category,
                COUNT(b.id) as total_bookings,
                SUM(w.price) as total_revenue,
                AVG(w.price) as average_price
            FROM workshops w
            JOIN bookings b ON w.id = b.workshop_id
            WHERE b.status = 'confirmed' ${dateFilter}
            GROUP BY w.category
            ORDER BY total_revenue DESC`,
            queryParams
        );

        // Daily revenue (for the specified period or last 30 days)
        let dailyRevenueQuery = `
            SELECT 
                DATE(b.booking_date) as booking_date,
                COUNT(b.id) as daily_bookings,
                SUM(w.price) as daily_revenue
            FROM bookings b
            JOIN workshops w ON b.workshop_id = w.id
            WHERE b.status = 'confirmed'`;

        if (dateFilter) {
            dailyRevenueQuery += ` ${dateFilter}`;
        } else {
            dailyRevenueQuery += ` AND b.booking_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
        }

        dailyRevenueQuery += `
            GROUP BY DATE(b.booking_date)
            ORDER BY booking_date ASC`;

        const dailyRevenue = await executeQuery(dailyRevenueQuery, queryParams);

        res.json({
            success: true,
            data: {
                revenue_summary: revenueSummary,
                revenue_by_workshop: revenueByWorkshop,
                revenue_by_category: revenueByCategory,
                daily_revenue: dailyRevenue
            }
        });

    } catch (error) {
        console.error('Financial report fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Export participant list for workshop
router.get('/workshops/:workshop_id/export', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { workshop_id } = req.params;

        // Get workshop details
        const [workshop] = await executeQuery(
            'SELECT * FROM workshops WHERE id = ?',
            [workshop_id]
        );

        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        // Get participant list
        const participants = await executeQuery(
            `SELECT 
                u.first_name, u.last_name, u.email, u.phone,
                b.booking_date, b.notes
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            WHERE b.workshop_id = ? AND b.status = 'confirmed'
            ORDER BY b.booking_date ASC`,
            [workshop_id]
        );

        // Format data for export
        const exportData = {
            workshop: {
                title: workshop.title,
                instructor: workshop.instructor,
                date: workshop.date,
                time: `${workshop.start_time} - ${workshop.end_time}`,
                location: workshop.location,
                total_participants: participants.length,
                max_capacity: workshop.max_capacity
            },
            participants: participants.map((participant, index) => ({
                sno: index + 1,
                name: `${participant.first_name} ${participant.last_name}`,
                email: participant.email,
                phone: participant.phone || 'N/A',
                booking_date: participant.booking_date,
                notes: participant.notes || 'N/A'
            }))
        };

        res.json({
            success: true,
            data: exportData
        });

    } catch (error) {
        console.error('Export data fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
