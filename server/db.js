const Database = require('better-sqlite3');
const db = new Database('cars.db', { verbose: console.log });

// Initialize database schema
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      pricePerDay REAL NOT NULL,
      image TEXT,
      description TEXT,
      category TEXT,
      seats INTEGER,
      transmission TEXT,
      mileage TEXT,
      fuelType TEXT,
      available INTEGER DEFAULT 1,
      totalStock INTEGER DEFAULT 4
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carId INTEGER NOT NULL,
      userId INTEGER,
      customerName TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      totalPrice REAL NOT NULL,
      FOREIGN KEY (carId) REFERENCES cars (id),
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      username TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (carId) REFERENCES cars (id),
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      carId INTEGER NOT NULL,
      UNIQUE(userId, carId),
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (carId) REFERENCES cars (id)
    );
  `);

  // Migration: Add columns if they don't exist
  const columns = db.prepare("PRAGMA table_info(cars)").all();
  const columnNames = columns.map(c => c.name);
  if (!columnNames.includes('seats')) {
    db.exec("ALTER TABLE cars ADD COLUMN seats INTEGER");
    db.exec("ALTER TABLE cars ADD COLUMN transmission TEXT");
    db.exec("ALTER TABLE cars ADD COLUMN mileage TEXT");
    db.exec("ALTER TABLE cars ADD COLUMN fuelType TEXT");
  }
  if (!columnNames.includes('totalStock')) {
    db.exec("ALTER TABLE cars ADD COLUMN totalStock INTEGER DEFAULT 4");
  }

  // Seeding logic
  console.log('Synchronizing car collection with verified high-availability images...');
  db.exec('DELETE FROM bookings');
  db.exec('DELETE FROM cars');

  const insert = db.prepare('INSERT INTO cars (make, model, year, pricePerDay, image, description, category, seats, transmission, mileage, fuelType, totalStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  // SPORTS CATEGORY
  insert.run('Porsche', '911 Carrera', 2024, 45000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', 'The benchmark for sports cars. Precision, power, and timeless design.', 'Sports', 2, 'PDK Automatic', '9.1 km/l', 'Petrol', 4);
  insert.run('Lamborghini', 'Huracan STO', 2023, 120000, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', 'Art in motion. A V10 masterpiece that defines supercar performance.', 'Sports', 2, 'Automatic', '7.5 km/l', 'Petrol', 4);
  insert.run('Ferrari', '296 GTB', 2024, 150000, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80', 'Hybrid power meets Maranello magic. The future of the supercar.', 'Sports', 2, 'Automatic', '12.0 km/l', 'Hybrid/Petrol', 4);
  insert.run('BMW', 'M4 Competition', 2024, 35000, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80', 'Aggressive styling and track-ready performance in a daily driver.', 'Sports', 4, 'Automatic', '10.8 km/l', 'Petrol', 4);
  insert.run('Mercedes', 'AMG GT', 2023, 45000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', 'Elegant grand tourer with a thunderous V8 heart.', 'Sports', 2, 'Automatic', '8.5 km/l', 'Petrol', 4);

  // SUV CATEGORY
  insert.run('Toyota', 'Fortuner Legender', 2024, 9500, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80', 'The king of SUVs. Unmatched presence and off-road dominance.', 'SUV', 7, 'Automatic', '14.2 km/l', 'Diesel', 4);
  insert.run('Range Rover', 'Sport', 2024, 42000, 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80', 'Luxury defined. Go anywhere in absolute comfort and style.', 'SUV', 5, 'Automatic', '12.5 km/l', 'Diesel', 4);
  insert.run('Mahindra', 'XUV700', 2024, 6500, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80', 'Advanced technology meets ultimate comfort. A 5-star safety rated SUV.', 'SUV', 7, 'Automatic', '13.0 km/l', 'Diesel', 4);
  insert.run('Mahindra', 'Thar 4x4', 2023, 5500, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', 'Iconic off-roader. Built to conquer any terrain with ease.', 'SUV', 4, 'Manual', '15.2 km/l', 'Diesel', 4);
  insert.run('Hyundai', 'Creta', 2024, 4800, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80', 'The ultimate mid-size SUV. Tech-loaded and spacious.', 'SUV', 5, 'Automatic', '18.0 km/l', 'Petrol', 4);

  // SEDAN CATEGORY
  insert.run('BMW', '3 Series Gran Limousine', 2024, 16000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', 'The ultimate luxury sedan. Perfect balance of comfort and performance.', 'Sedan', 5, 'Automatic', '16.1 km/l', 'Petrol', 4);
  insert.run('Tesla', 'Model S Plaid', 2024, 25000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', 'Beyond Ludicrous. The fastest accelerating sedan in production.', 'Sedan', 5, 'Automatic', '600 km', 'Electric', 4);
  insert.run('Skoda', 'Slavia', 2024, 3800, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80', 'Elegant German engineering for the modern Indian family.', 'Sedan', 5, 'Manual', '19.4 km/l', 'Petrol', 4);
  insert.run('Volkswagen', 'Virtus GT', 2024, 4500, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80', 'Performance and safety combined. The spirit of German driving.', 'Sedan', 5, 'Automatic', '19.4 km/l', 'Petrol/Turbo', 4);
  insert.run('Honda', 'City', 2024, 4200, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80', 'Timeless elegance and Honda reliability. The executive choice.', 'Sedan', 5, 'CVT Automatic', '18.4 km/l', 'Petrol', 4);

  // HATCHBACK CATEGORY
  insert.run('Maruti Suzuki', 'Swift', 2024, 2500, 'https://imgs.search.brave.com/eZtkOfRpnpfOKOX4lc1oB90RNMEC6qG5HO1BQpac7Vs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Z2xvYmFsc3V6dWtp/LmNvbS9hdXRvbW9i/aWxlL2xpbmV1cC9z/d2lmdC9pbWcvcGVf/aW1nMDYuanBn=80', 'The iconic hatchback, now even sportier and more efficient.', 'Hatchback', 5, 'Manual', '24.8 km/l', 'Petrol', 4);
  insert.run('Hyundai', 'i20 N Line', 2024, 3200, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', 'A hot hatch for the enthusiast. Performance inspired by the track.', 'Hatchback', 5, 'iMT/DCT', '20.2 km/l', 'Petrol', 4);
  insert.run('Tata', 'Altroz Racer', 2024, 3000, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80', 'Safety meets speed. The fastest Altroz ever built.', 'Hatchback', 5, 'Manual', '18.6 km/l', 'Petrol', 4);
  insert.run('Mini', 'Cooper S', 2024, 12000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', 'Go-kart handling and British charm. A thrill at every corner.', 'Hatchback', 4, 'Automatic', '16.5 km/l', 'Petrol', 4);

  // Seed users if empty
  const userStmt = db.prepare('SELECT count(*) as count FROM users');
  const userResult = userStmt.get();
  if (userResult.count === 0) {
    console.log('Registering system users...');
    const bcrypt = require('bcryptjs');
    const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
    insertUser.run('admin', bcrypt.hashSync('admin123', 10), 'admin');
    insertUser.run('user', bcrypt.hashSync('user123', 10), 'user');
  }
};

initDb();
module.exports = db;
