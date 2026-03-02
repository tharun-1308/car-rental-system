const db = require('better-sqlite3')('cars.db');
const cars = db.prepare("SELECT id, make, model, image FROM cars WHERE model IN ('911 Carrera', 'Nexon EV', 'Slavia')").all();
console.log(cars);
