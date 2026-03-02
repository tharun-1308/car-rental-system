const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

const db = require('./db');
const { router: authRouter, authenticateToken } = require('./auth');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

// Get all cars (with availability count)
app.get('/api/cars', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT cars.*, 
                   cars.totalStock - COALESCE(booking_counts.booked, 0) AS availableCount
            FROM cars
            LEFT JOIN (
                SELECT carId, COUNT(*) AS booked FROM bookings GROUP BY carId
            ) AS booking_counts ON cars.id = booking_counts.carId
        `);
        const cars = stmt.all();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get car by ID (with availability count)
app.get('/api/cars/:id', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT cars.*,
                   cars.totalStock - COALESCE((SELECT COUNT(*) FROM bookings WHERE bookings.carId = cars.id), 0) AS availableCount
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
