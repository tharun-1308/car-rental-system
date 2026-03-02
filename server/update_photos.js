const db = require('better-sqlite3')('cars.db');

const updates = [
    {
        model: '911 Carrera',
        image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
        model: 'Nexon EV',
        image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon-EV-2023/11252/1694689033379/front-left-side-47.jpg'
    },
    {
        model: 'Slavia',
        image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Skoda/Slavia/10660/1709636647953/front-left-side-47.jpg'
    }
];

const updateStmt = db.prepare('UPDATE cars SET image = ? WHERE model = ?');

console.log('Updating photos...');
updates.forEach(car => {
    try {
        const info = updateStmt.run(car.image, car.model);
        console.log(`Updated ${car.model}: ${info.changes} changes`);
    } catch (e) {
        console.error(`Failed to update ${car.model}: ${e.message}`);
    }
});
console.log('Photos updated!');
