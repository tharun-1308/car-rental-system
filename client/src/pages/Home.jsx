import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Star, Users, Gauge, Fuel, Car, Sparkles, Heart, SlidersHorizontal, X } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ transmission: '', fuelType: '', seats: '', maxPrice: '', sortBy: '' });

    useEffect(() => {
        fetch('http://localhost:3001/api/cars')
            .then(res => res.ok ? res.json() : Promise.reject('Failed'))
            .then(data => { setCars(data); setFilteredCars(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!user) return;
        const token = localStorage.getItem('token');
        fetch('http://localhost:3001/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setWishlist(data.map(i => i.id)))
            .catch(() => { });
    }, [user]);

    useEffect(() => {
        let result = [...cars];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c => c.make.toLowerCase().includes(q) || c.model.toLowerCase().includes(q));
        }
        if (filters.transmission) result = result.filter(c => c.transmission?.toLowerCase().includes(filters.transmission.toLowerCase()));
        if (filters.fuelType) result = result.filter(c => c.fuelType?.toLowerCase().includes(filters.fuelType.toLowerCase()));
        if (filters.seats) result = result.filter(c => c.seats === parseInt(filters.seats));
        if (filters.maxPrice) result = result.filter(c => c.pricePerDay <= parseInt(filters.maxPrice));
        if (filters.sortBy === 'price-low') result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        else if (filters.sortBy === 'price-high') result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        else if (filters.sortBy === 'rating') result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        setFilteredCars(result);
    }, [searchQuery, cars, filters]);

    const toggleWishlist = async (e, carId) => {
        e.preventDefault(); e.stopPropagation();
        if (!user) return showToast('Please login to add to wishlist', 'error');
        const token = localStorage.getItem('token');
        const isIn = wishlist.includes(carId);
        try {
            if (isIn) {
                await fetch(`http://localhost:3001/api/wishlist/${carId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                setWishlist(p => p.filter(id => id !== carId));
                showToast('Removed from wishlist', 'info');
            } else {
                await fetch('http://localhost:3001/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ carId }) });
                setWishlist(p => [...p, carId]);
                showToast('Added to wishlist ❤️', 'success');
            }
        } catch { showToast('Error updating wishlist', 'error'); }
    };

    const clearFilters = () => { setFilters({ transmission: '', fuelType: '', seats: '', maxPrice: '', sortBy: '' }); setSearchQuery(''); };
    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    const FilterSelect = ({ label, value, onChange, options }) => (
        <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
            <select className="form-input" value={value} onChange={onChange} style={{ padding: '0.6rem', fontSize: '0.9rem' }}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );

    return (
        <div className="fade-in">
            <section className="hero" style={{ padding: '5rem 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: `linear-gradient(to bottom, rgba(10,10,15,0.3), rgba(10,10,15,0.95)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80') center/cover no-repeat` }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Sparkles size={18} color="var(--accent)" /><span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px' }}>Premium Car Rentals</span><Sparkles size={18} color="var(--accent)" />
                    </div>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '900', lineHeight: '1.1', background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 50%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Find Your Perfect Drive</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Discover luxury, power, and performance. Your dream car awaits.</p>
                    <div style={{ position: 'relative', maxWidth: '550px', margin: '0 auto' }}>
                        <input type="text" placeholder="Search by make or model..." className="form-input" style={{ padding: '1rem 1rem 1rem 3rem', fontSize: '1rem', borderRadius: '3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)' }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        <Search size={20} color="var(--accent)" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                </div>
            </section>

            <section id="collection" className="container" style={{ paddingTop: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star fill="var(--accent)" color="var(--accent)" size={22} /> Our Premium Collection</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>Handpicked luxury vehicles for the ultimate driving experience</p>
                    </div>
                    <button className="btn" onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: showFilters ? 'var(--accent)' : 'var(--bg-secondary)', color: showFilters ? '#000' : 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '2rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem', position: 'relative' }}>
                        <SlidersHorizontal size={16} /> Filters
                        {activeFilterCount > 0 && <span style={{ background: 'var(--accent)', color: '#000', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', position: 'absolute', top: '-6px', right: '-6px' }}>{activeFilterCount}</span>}
                    </button>
                </div>

                {showFilters && (
                    <div className="filter-panel fade-in" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                        <FilterSelect label="Transmission" value={filters.transmission} onChange={e => setFilters({ ...filters, transmission: e.target.value })} options={[{ value: '', label: 'All' }, { value: 'automatic', label: 'Automatic' }, { value: 'manual', label: 'Manual' }]} />
                        <FilterSelect label="Fuel Type" value={filters.fuelType} onChange={e => setFilters({ ...filters, fuelType: e.target.value })} options={[{ value: '', label: 'All' }, { value: 'petrol', label: 'Petrol' }, { value: 'diesel', label: 'Diesel' }, { value: 'electric', label: 'Electric' }, { value: 'hybrid', label: 'Hybrid' }]} />
                        <FilterSelect label="Seats" value={filters.seats} onChange={e => setFilters({ ...filters, seats: e.target.value })} options={[{ value: '', label: 'All' }, { value: '2', label: '2 Seater' }, { value: '4', label: '4 Seater' }, { value: '5', label: '5 Seater' }, { value: '7', label: '7 Seater' }]} />
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Max Price (₹/day)</label>
                            <input type="number" className="form-input" placeholder="e.g. 10000" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} style={{ padding: '0.6rem', fontSize: '0.9rem' }} />
                        </div>
                        <FilterSelect label="Sort By" value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value })} options={[{ value: '', label: 'Default' }, { value: 'price-low', label: 'Price: Low → High' }, { value: 'price-high', label: 'Price: High → Low' }, { value: 'rating', label: 'Top Rated' }]} />
                        <button className="btn" onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', fontSize: '0.9rem' }}><X size={14} /> Clear</button>
                    </div>
                )}

                {loading ? <div style={{ textAlign: 'center', padding: '4rem' }}>Loading our collection...</div> : filteredCars.length > 0 ? (
                    ['Hatchback', 'Sedan', 'SUV', 'Sports'].map(category => {
                        const cc = filteredCars.filter(c => c.category === category);
                        if (!cc.length) return null;
                        return (
                            <div key={category} className="fade-in" style={{ marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>{category}</h3>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)', marginLeft: '1rem' }}></div>
                                </div>
                                <div className="car-grid">
                                    {cc.map(car => {
                                        const avail = car.availableCount > 0;
                                        const wishlisted = wishlist.includes(car.id);
                                        return (
                                            <Link to={`/cars/${car.id}`} key={car.id} className="car-card" style={{ opacity: avail ? 1 : 0.6, position: 'relative' }}>
                                                <button onClick={e => toggleWishlist(e, car.id)} className="wishlist-btn" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 3, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                                                    <Heart size={18} fill={wishlisted ? '#ef4444' : 'transparent'} color={wishlisted ? '#ef4444' : '#fff'} />
                                                </button>
                                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2, padding: '0.3rem 0.7rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '600', background: avail ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: avail ? '#22c55e' : '#ef4444', border: `1px solid ${avail ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <Car size={12} />{avail ? `${car.availableCount} of ${car.totalStock} Available` : 'Not Available'}
                                                </div>
                                                <img src={car.image} alt={`${car.make} ${car.model}`} className="car-image" />
                                                <div className="car-content">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                        <div><h3 className="car-title">{car.make} {car.model}</h3><p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{car.year}</p></div>
                                                        <span className="car-price">₹{car.pricePerDay}/day</span>
                                                    </div>
                                                    {car.reviewCount > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}><Star size={14} fill="#f59e0b" color="#f59e0b" /><span style={{ fontWeight: '600', color: '#f59e0b', fontSize: '0.9rem' }}>{car.avgRating}</span><span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({car.reviewCount})</span></div>}
                                                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}><Users size={14} color="var(--accent)" /> {car.seats} Seater</div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}><Gauge size={14} color="var(--accent)" /> {car.transmission}</div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem' }}><Fuel size={14} color="var(--accent)" /> {car.fuelType}</div>
                                                    </div>
                                                    <div className="btn" style={{ width: '100%', background: avail ? 'var(--accent-light)' : 'rgba(239,68,68,0.1)', color: avail ? 'var(--accent)' : '#ef4444', textAlign: 'center' }}>{avail ? 'View Details' : 'Not Available'}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>No cars found. <button onClick={clearFilters} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear filters</button></div>
                )}
            </section>
        </div>
    );
};

export default Home;
