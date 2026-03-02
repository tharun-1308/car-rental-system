const db = require('better-sqlite3')('cars.db');

// 1. Add category column
try {
    const columns = db.prepare('PRAGMA table_info(cars)').all();
    if (!columns.some(c => c.name === 'category')) {
        db.exec('ALTER TABLE cars ADD COLUMN category TEXT');
        console.log('Added category column.');
    }
} catch (e) {
    console.log('Category column check/add failed:', e.message);
}

// 2. Define updates
const updates = [
    // Hatchbacks
    { model: 'Swift', category: 'Hatchback', price: 40 }, // Keep same

    // Sedans
    { model: 'Slavia', category: 'Sedan', price: 70 },
    { model: 'Model S', category: 'Sedan', price: 250 }, // Increased (was 150)

    // SUVs
    { model: 'Nexon EV', category: 'SUV', price: 85 },
    { model: 'XUV700', category: 'SUV', price: 95 },
    { model: 'Creta', category: 'SUV', price: 80 },
    { model: 'Thar', category: 'SUV', price: 90 },
    { model: 'Range Rover Sport', category: 'SUV', price: 450 }, // Increased (was 200) -- Named 'Sport' in db logic check

    // Sports / Premium (Mapping to specific categories or new one?) 
    // User asked for Hatchback, Sedan, SUV. Porsche/Merc/BMW don't fit perfectly. 
    // I will map them as 'Sports' for now, but display them prominently.
    // actually I'll group them under 'Sports' to keep it clean, but render them nicely.
    { model: '911 Carrera', category: 'Sports', price: 550 }, // Increased (was 300)
    { model: 'AMG GT', category: 'Sports', price: 400 }, // Increased (was 250)
    { model: 'M4 Competition', category: 'Sports', price: 350 }, // Increased (was 180)
];

// Note: DB model names might differ slightly (e.g. 'Range Rover' vs 'Sport' is model).
// Checking current DB content to be sure of matching.
const check = db.prepare('SELECT id, make, model FROM cars').all();
// console.log(check);

const updateStmt = db.prepare('UPDATE cars SET category = ?, pricePerDay = ? WHERE model = ?');
const updateStmtMake = db.prepare('UPDATE cars SET category = ?, pricePerDay = ? WHERE make = ? AND model = ?');

// Manual fixes based on known seed data
// Range Rover makes is 'Range Rover', model is 'Sport'
// Tesla make 'Tesla', model 'Model S'

updates.forEach(u => {
    let result;
    if (u.model === 'Range Rover Sport') {
        // In DB: Make='Range Rover', Model='Sport'
        result = updateStmtMake.run(u.category, u.price, 'Range Rover', 'Sport');
    } else {
        result = updateStmt.run(u.category, u.price, u.model);
    }
    console.log(`Updated ${u.model}: Category=${u.category}, Price=${u.price}, Changes=${result.changes}`);
});
