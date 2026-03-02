// ... (Existing code)

    CREATE TABLE IF NOT EXISTS cars(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        pricePerDay REAL NOT NULL,
        image TEXT,
        description TEXT,
        category TEXT, --Added category
      available INTEGER DEFAULT 1
    );

// ... (Existing code)

// Seed data if empty
const stmt = db.prepare('SELECT count(*) as count FROM cars');
const result = stmt.get();
if (result.count === 0) {
    console.log('Seeding database...');
    const insert = db.prepare('INSERT INTO cars (make, model, year, pricePerDay, image, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)');

    // Sports
    insert.run('Tesla', 'Model S', 2024, 250, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000', 'Electric luxury sedan with autopilot.', 'Sedan');
    insert.run('Porsche', '911 Carrera', 2023, 550, 'https://images.unsplash.com/photo-1503376763036-066120622c74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 'Iconic sports car, pure driving pleasure.', 'Sports');
    insert.run('Range Rover', 'Sport', 2023, 450, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=1000', 'Luxury SUV with off-road capability.', 'SUV');
    insert.run('Mercedes', 'AMG GT', 2022, 400, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000', 'High performance grand tourer.', 'Sports');
    insert.run('BMW', 'M4 Competition', 2024, 350, 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000', 'Precision engineered sports coupe.', 'Sports');

    // Budget / Regular
    insert.run('Maruti Suzuki', 'Swift', 2024, 40, 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/159099/swift-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80', 'The beloved hatchback. Sporty, fuel-efficient, and fun to drive.', 'Hatchback');
    insert.run('Skoda', 'Slavia', 2023, 70, 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Skoda/Slavia/10660/1709636647953/front-left-side-47.jpg', 'Premium sedan with German engineering and class-leading comfort.', 'Sedan');
    insert.run('Tata', 'Nexon EV', 2024, 85, 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon-EV-2023/11252/1694689033379/front-left-side-47.jpg', 'India\'s #1 Electric SUV. silent, powerful, and eco-friendly.', 'SUV');
    insert.run('Mahindra', 'XUV700', 2023, 95, 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80', 'Tech-loaded SUV with ADAS and panoramic sunroof.', 'SUV');
    insert.run('Hyundai', 'Creta', 2024, 80, 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80', 'The ultimate SUV. Feature-packed and comfortable for long drives.', 'SUV');
    insert.run('Mahindra', 'Thar', 2023, 90, 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?isig=0&q=80', 'Explore the impossible. 4x4 off-road legend.', 'SUV');
}
