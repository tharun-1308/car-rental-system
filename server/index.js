const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./db');
const { router: authRouter, authenticateToken } = require('./auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

// Get all cars (with availability count and average rating)
app.get('/api/cars', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT cars.*, 
                   cars.totalStock - COALESCE(booking_counts.booked, 0) AS availableCount,
                   COALESCE(review_stats.avgRating, 0) AS avgRating,
                   COALESCE(review_stats.reviewCount, 0) AS reviewCount
            FROM cars
            LEFT JOIN (
                SELECT carId, COUNT(*) AS booked FROM bookings GROUP BY carId
            ) AS booking_counts ON cars.id = booking_counts.carId
            LEFT JOIN (
                SELECT carId, ROUND(AVG(rating), 1) AS avgRating, COUNT(*) AS reviewCount FROM reviews GROUP BY carId
            ) AS review_stats ON cars.id = review_stats.carId
        `);
        const cars = stmt.all();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get car by ID (with availability count and average rating)
app.get('/api/cars/:id', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT cars.*,
                   cars.totalStock - COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.carId = cars.id), 0) AS availableCount,
                   COALESCE((SELECT ROUND(AVG(rating), 1) FROM reviews WHERE reviews.carId = cars.id), 0) AS avgRating,
                   COALESCE((SELECT COUNT(*) FROM reviews WHERE reviews.carId = cars.id), 0) AS reviewCount
            FROM cars
            WHERE cars.id = ?
        `);
        const car = stmt.get(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create booking (Protected)
app.post('/api/bookings', authenticateToken, (req, res) => {
    const { carId, customerName, startDate, endDate, totalPrice } = req.body;
    const userId = req.user.id;

    if (!carId || !customerName || !startDate || !endDate || !totalPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check availability before booking
        const availStmt = db.prepare(`
            SELECT cars.totalStock - COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.carId = cars.id), 0) AS availableCount
            FROM cars WHERE cars.id = ?
        `);
        const availability = availStmt.get(carId);
        if (!availability || availability.availableCount <= 0) {
            return res.status(400).json({ error: 'All units of this car are currently booked. Not available.' });
        }

        const stmt = db.prepare('INSERT INTO bookings (carId, userId, customerName, startDate, endDate, totalPrice) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(carId, userId, customerName, startDate, endDate, totalPrice);
        res.status(201).json({ id: info.lastInsertRowid, message: 'Booking created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's bookings
app.get('/api/my-bookings', authenticateToken, (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT bookings.*, cars.make, cars.model, cars.image
            FROM bookings
            JOIN cars ON bookings.carId = cars.id
            WHERE bookings.userId = ?
        `);
        const bookings = stmt.all(req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bookings (Admin only)
app.get('/api/bookings', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    try {
        const stmt = db.prepare(`
            SELECT bookings.*, cars.make, cars.model 
            FROM bookings 
            JOIN cars ON bookings.carId = cars.id
        `);
        const bookings = stmt.all();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== REVIEWS ====================

// Submit a review (one per car per user)
app.post('/api/reviews', authenticateToken, (req, res) => {
    const { carId, rating, comment } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    if (!carId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'carId and rating (1-5) are required' });
    }

    try {
        // Check if user already reviewed this car
        const existing = db.prepare('SELECT id FROM reviews WHERE carId = ? AND userId = ?').get(carId, userId);
        if (existing) {
            // Update existing review
            const stmt = db.prepare('UPDATE reviews SET rating = ?, comment = ?, createdAt = datetime("now") WHERE carId = ? AND userId = ?');
            stmt.run(rating, comment || '', carId, userId);
            return res.json({ message: 'Review updated successfully' });
        }

        const stmt = db.prepare('INSERT INTO reviews (carId, userId, username, rating, comment) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(carId, userId, username, rating, comment || '');
        res.status(201).json({ id: info.lastInsertRowid, message: 'Review submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews for a car
app.get('/api/reviews/:carId', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM reviews WHERE carId = ? ORDER BY createdAt DESC');
        const reviews = stmt.all(req.params.carId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== WISHLIST ====================

// Add car to wishlist
app.post('/api/wishlist', authenticateToken, (req, res) => {
    const { carId } = req.body;
    const userId = req.user.id;

    if (!carId) return res.status(400).json({ error: 'carId is required' });

    try {
        const stmt = db.prepare('INSERT OR IGNORE INTO wishlist (userId, carId) VALUES (?, ?)');
        stmt.run(userId, carId);
        res.status(201).json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove car from wishlist
app.delete('/api/wishlist/:carId', authenticateToken, (req, res) => {
    const userId = req.user.id;
    try {
        const stmt = db.prepare('DELETE FROM wishlist WHERE userId = ? AND carId = ?');
        stmt.run(userId, req.params.carId);
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's wishlist
app.get('/api/wishlist', authenticateToken, (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT cars.*, wishlist.id AS wishlistId
            FROM wishlist
            JOIN cars ON wishlist.carId = cars.id
            WHERE wishlist.userId = ?
        `);
        const items = stmt.all(req.user.id);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== BOOKING CANCELLATION ====================

// Cancel a booking (user can only cancel their own)
app.delete('/api/bookings/:id', authenticateToken, (req, res) => {
    try {
        const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // Allow if user owns the booking or is admin
        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to cancel this booking' });
        }

        db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
