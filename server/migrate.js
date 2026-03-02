const db = require('better-sqlite3')('cars.db');

try {
    const columns = db.prepare('PRAGMA table_info(bookings)').all();
    const hasUserId = columns.some(col => col.name === 'userId');

    if (!hasUserId) {
        console.log('Adding userId column to bookings table...');
        db.exec('ALTER TABLE bookings ADD COLUMN userId INTEGER REFERENCES users(id)');
        console.log('Column added successfully.');
    } else {
        console.log('userId column already exists.');
    }
} catch (error) {
    console.error('Migration failed:', error.message);
}
