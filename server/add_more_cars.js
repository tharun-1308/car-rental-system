const db = require('better-sqlite3')('cars.db');

const newCars = [
    // HATCHBACKS
    {
        make: 'Hyundai',
        model: 'i20 N Line',
        year: 2024,
        pricePerDay: 45,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/103233/i20-n-line-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
        description: 'Sporty premium hatchback with aggressive styling and tuned suspension.',
        category: 'Hatchback'
    },
    {
        make: 'Tata',
        model: 'Altroz',
        year: 2023,
        pricePerDay: 40,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/32956/altroz-exterior-right-front-three-quarter-15.jpeg?isig=0&q=80',
        description: 'The Gold Standard of safety. 5-star Global NCAP rating.',
        category: 'Hatchback'
    },
    {
        make: 'Toyota',
        model: 'Glanza',
        year: 2023,
        pricePerDay: 42,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/112839/glanza-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80',
        description: 'Style meets reliability. A perfect city runabout.',
        category: 'Hatchback'
    },

    // SEDANS
    {
        make: 'Honda',
        model: 'City',
        year: 2024,
        pricePerDay: 75,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80',
        description: 'The original sedan. Unmatched comfort and i-VTEC performance.',
        category: 'Sedan'
    },
    {
        make: 'Hyundai',
        model: 'Verna',
        year: 2023,
        pricePerDay: 80,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/121943/verna-exterior-right-front-three-quarter-101.jpeg?isig=0&q=80',
        description: 'Futuristic design with advanced tech and turbo power.',
        category: 'Sedan'
    },
    {
        make: 'Volkswagen',
        model: 'Virtus',
        year: 2024,
        pricePerDay: 85,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/113821/virtus-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80',
        description: 'German engineering at its finest. Thrilling performance.',
        category: 'Sedan'
    },
    {
        make: 'Maruti Suzuki',
        model: 'Ciaz',
        year: 2023,
        pricePerDay: 65,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/120539/ciaz-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
        description: 'Executive sedan with class-leading rear seat space.',
        category: 'Sedan'
    }
];

const insert = db.prepare('INSERT INTO cars (make, model, year, pricePerDay, image, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)');

console.log('Adding more cars...');
newCars.forEach(car => {
    try {
        insert.run(car.make, car.model, car.year, car.pricePerDay, car.image, car.description, car.category);
        console.log(`Added ${car.make} ${car.model}`);
    } catch (e) {
        console.error(`Failed to add ${car.make} ${car.model}: ${e.message}`);
    }
});
console.log('Done!');
