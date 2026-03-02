const db = require('better-sqlite3')('cars.db');

const newCars = [
    {
        make: 'Maruti Suzuki',
        model: 'Swift',
        year: 2024,
        pricePerDay: 40,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/159099/swift-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80',
        description: 'The beloved hatchback. Sporty, fuel-efficient, and fun to drive.'
    },
    {
        make: 'Skoda',
        model: 'Slavia',
        year: 2023,
        pricePerDay: 70,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/109619/slavia-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80',
        description: 'Premium sedan with German engineering and class-leading comfort.'
    },
    {
        make: 'Tata',
        model: 'Nexon EV',
        year: 2024,
        pricePerDay: 85,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/144723/nexon-ev-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80',
        description: 'India\'s #1 Electric SUV. silent, powerful, and eco-friendly.'
    },
    {
        make: 'Mahindra',
        model: 'XUV700',
        year: 2023,
        pricePerDay: 95,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80',
        description: 'Tech-loaded SUV with ADAS and panoramic sunroof.'
    },
    {
        make: 'Hyundai',
        model: 'Creta',
        year: 2024,
        pricePerDay: 80,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
        description: 'The ultimate SUV. Feature-packed and comfortable for long drives.'
    },
    {
        make: 'Mahindra',
        model: 'Thar',
        year: 2023,
        pricePerDay: 90,
        image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?isig=0&q=80',
        description: 'Explore the impossible. 4x4 off-road legend.'
    }
];

const insert = db.prepare('INSERT INTO cars (make, model, year, pricePerDay, image, description) VALUES (?, ?, ?, ?, ?, ?)');

console.log('Adding new cars...');
newCars.forEach(car => {
    try {
        insert.run(car.make, car.model, car.year, car.pricePerDay, car.image, car.description);
        console.log(`Added ${car.make} ${car.model}`);
    } catch (e) {
        console.error(`Failed to add ${car.make} ${car.model}: ${e.message}`);
    }
});
console.log('Done!');
