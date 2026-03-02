import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, CheckCircle, AlertCircle, Users, Gauge, Fuel, Droplets, Car } from 'lucide-react';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [car, setCar] = useState(null);
    const [booking, setBooking] = useState({
        customerName: '',
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/api/cars/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch car details');
                return res.json();
            })
            .then(data => {
                setCar(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching car:', err);
                setLoading(false);
            });
    }, [id]);

    const calculateTotal = () => {
        if (!booking.startDate || !booking.endDate || !car) return 0;
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays * car.pricePerDay : 0;
    };

    const validateDates = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);

        if (start < today) return "Start date cannot be in the past.";
        if (end <= start) return "End date must be after start date.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            navigate('/login');
            return;
        }

        const dateError = validateDates();
        if (dateError) {
            setError(dateError);
            return;
        }

        if (calculateTotal() <= 0) {
            setError("Invalid booking duration.");
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            console.log('Sending token for booking:', token);
            const response = await fetch('http://localhost:3001/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    carId: car.id,
                    ...booking,
                    totalPrice: calculateTotal()
                }),
            });

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || 'Booking failed');
            }

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/payment', {
                    state: {
                        bookingData: { ...booking, carId: car.id, totalPrice: calculateTotal() },
                        car: car
                    }
                }), 1500);
            } else {
                throw new Error(data.error || 'Booking failed');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!car) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Car not found</div>;

    return (
        <div className="container fade-in" style={{ paddingBlock: '4rem' }}>
            <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', paddingLeft: 0, marginBottom: '2rem' }}>
                <ArrowLeft size={20} /> Back to Collection
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <img src={car.image} alt={car.model} style={{ width: '100%', borderRadius: 'var(--card-radius)', marginBottom: '2rem', border: '1px solid var(--glass-border)' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{car.make} {car.model}</h1>
                    <p style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>₹{car.pricePerDay}/day</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>{car.description}</p>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: '0.25rem' }}>Car Specifications</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <Users size={32} color="var(--accent)" style={{ marginInline: 'auto', marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Capacity</div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{car.seats} Seater</div>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <Gauge size={32} color="var(--accent)" style={{ marginInline: 'auto', marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Transmission</div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{car.transmission}</div>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <Fuel size={32} color="var(--accent)" style={{ marginInline: 'auto', marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Fuel Type</div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{car.fuelType}</div>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <Droplets size={32} color="var(--accent)" style={{ marginInline: 'auto', marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mileage</div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{car.mileage}</div>
                        </div>
                        <div style={{ background: car.availableCount > 0 ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)', padding: '1.5rem', borderRadius: '1rem', border: `1px solid ${car.availableCount > 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`, textAlign: 'center' }}>
                            <Car size={32} color={car.availableCount > 0 ? '#22c55e' : '#ef4444'} style={{ marginInline: 'auto', marginBottom: '0.75rem' }} />
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Availability</div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem', color: car.availableCount > 0 ? '#22c55e' : '#ef4444' }}>
                                {car.availableCount > 0 ? `${car.availableCount} of ${car.totalStock}` : 'Not Available'}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)', position: 'sticky', top: '100px' }}>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <CheckCircle size={64} color="var(--accent)" style={{ marginBottom: '1rem', marginInline: 'auto' }} />
                            <h2 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Redirecting to your dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Book this Car</h2>

                            {car.availableCount <= 0 && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={16} /> All {car.totalStock} units of this car are currently booked. Not available for booking.
                                </div>
                            )}

                            {!user && (
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.9rem' }}>
                                    Please <span style={{ fontWeight: 'bold', color: 'var(--accent)', cursor: 'pointer' }} onClick={() => navigate('/login')}>login</span> to book this car.
                                </div>
                            )}

                            {error && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ paddingLeft: '3rem' }}
                                            required
                                            value={booking.customerName}
                                            onChange={e => setBooking({ ...booking, customerName: e.target.value })}
                                            placeholder="John Doe"
                                            disabled={!user}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            required
                                            value={booking.startDate}
                                            onChange={e => setBooking({ ...booking, startDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            disabled={!user}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            required
                                            value={booking.endDate}
                                            onChange={e => setBooking({ ...booking, endDate: e.target.value })}
                                            min={booking.startDate || new Date().toISOString().split('T')[0]}
                                            disabled={!user}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBlock: '1.5rem', paddingBlock: '1.5rem', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Total Price</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{calculateTotal()}</span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', opacity: (user && car.availableCount > 0) ? 1 : 0.5, cursor: (user && car.availableCount > 0) ? 'pointer' : 'not-allowed' }}
                                    disabled={submitting || !user || car.availableCount <= 0}
                                >
                                    {submitting ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
