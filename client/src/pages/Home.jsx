import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, Gauge, Fuel, Car, Sparkles } from 'lucide-react';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/cars')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch cars');
                return res.json();
            })
            .then(data => {
                setCars(data);
                setFilteredCars(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching cars:', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = cars.filter(car =>
            car.make.toLowerCase().includes(lowerQuery) ||
            car.model.toLowerCase().includes(lowerQuery)
        );
        setFilteredCars(filtered);
    }, [searchQuery, cars]);

    return (
        <div className="fade-in">
            <section className="hero" style={{
                padding: '5rem 0 4rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(to bottom, rgba(10, 10, 15, 0.3), rgba(10, 10, 15, 0.95)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80') center/cover no-repeat`
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Sparkles size={18} color="var(--accent)" />
                        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px' }}>Premium Car Rentals</span>
                        <Sparkles size={18} color="var(--accent)" />
                    </div>
                    <h1 style={{
                        fontSize: '3.5rem',
                        marginBottom: '1rem',
                        fontWeight: '900',
                        lineHeight: '1.1',
                        background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Find Your Perfect Drive
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                        Discover luxury, power, and performance. Your dream car awaits.
                    </p>

                    <div style={{ position: 'relative', maxWidth: '550px', margin: '0 auto' }}>
                        <input
                            type="text"
                            placeholder="Search by make or model..."
                            className="form-input"
                            style={{
                                padding: '1rem 1rem 1rem 3rem',
                                fontSize: '1rem',
                                borderRadius: '3rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--text-primary)'
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search
                            size={20}
                            color="var(--accent)"
                            style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }}
                        />
                    </div>
                </div>
            </section>

            <section id="collection" className="container" style={{ paddingTop: '3rem' }}>
                <h2 style={{
                    fontSize: '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    <Star fill="var(--accent)" color="var(--accent)" size={22} /> Our Premium Collection
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                    Handpicked luxury vehicles for the ultimate driving experience
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading our collection...</div>
                ) : filteredCars.length > 0 ? (
                    ['Hatchback', 'Sedan', 'SUV', 'Sports'].map(category => {
                        const categoryCars = filteredCars.filter(car => car.category === category);
                        if (categoryCars.length === 0) return null;

                        return (
                            <div key={category} className="fade-in" style={{ marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {category}
                                    </h3>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)', marginLeft: '1rem' }}></div>
                                </div>

                                <div className="car-grid">
                                    {categoryCars.map(car => {
                                        const isAvailable = car.availableCount > 0;
                                        return (
                                            <Link to={`/cars/${car.id}`} key={car.id} className="car-card" style={{ opacity: isAvailable ? 1 : 0.6, position: 'relative' }}>
                                                <div style={{
                                                    position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2,
                                                    padding: '0.3rem 0.7rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '600',
                                                    background: isAvailable ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                    color: isAvailable ? '#22c55e' : '#ef4444',
                                                    border: `1px solid ${isAvailable ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '0.3rem'
                                                }}>
                                                    <Car size={12} />
                                                    {isAvailable ? `${car.availableCount} of ${car.totalStock} Available` : 'Not Available'}
                                                </div>
                                                <img src={car.image} alt={`${car.make} ${car.model}`} className="car-image" />
                                                <div className="car-content">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                        <div>
                                                            <h3 className="car-title">{car.make} {car.model}</h3>
                                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{car.year}</p>
                                                        </div>
                                                        <span className="car-price">₹{car.pricePerDay}/day</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}>
                                                            <Users size={14} color="var(--accent)" /> {car.seats} Seater
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}>
                                                            <Gauge size={14} color="var(--accent)" /> {car.transmission}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}>
                                                            <Fuel size={14} color="var(--accent)" /> {car.fuelType}
                                                        </div>
                                                    </div>
                                                    <div className="btn" style={{ width: '100%', background: isAvailable ? 'var(--accent-light)' : 'rgba(239, 68, 68, 0.1)', color: isAvailable ? 'var(--accent)' : '#ef4444', textAlign: 'center' }}>
                                                        {isAvailable ? 'View Details' : 'Not Available'}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        No cars found matching "{searchQuery}"
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
