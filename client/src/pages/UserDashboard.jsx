import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, Navigation, Heart, Trash2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [bookRes, wishRes] = await Promise.all([
                    fetch('http://localhost:3001/api/my-bookings', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('http://localhost:3001/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                if (bookRes.ok) { const ct = bookRes.headers.get('content-type'); if (ct?.includes('application/json')) setBookings(await bookRes.json()); }
                if (wishRes.ok) setWishlist(await wishRes.json());
            } catch (err) { console.error('Error fetching data', err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [user]);

    const cancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const res = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setBookings(prev => prev.filter(b => b.id !== bookingId));
                showToast('Booking cancelled successfully', 'success');
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to cancel', 'error');
            }
        } catch { showToast('Error cancelling booking', 'error'); }
    };

    const removeFromWishlist = async (carId) => {
        try {
            await fetch(`http://localhost:3001/api/wishlist/${carId}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(prev => prev.filter(w => w.id !== carId));
            showToast('Removed from wishlist', 'info');
        } catch { showToast('Error removing from wishlist', 'error'); }
    };

    const tabStyle = (tab) => ({
        padding: '0.75rem 1.5rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
        background: activeTab === tab ? 'var(--accent)' : 'var(--bg-secondary)',
        color: activeTab === tab ? '#000' : 'var(--text-secondary)',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', gap: '0.5rem'
    });

    return (
        <div className="container" style={{ paddingBlock: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem' }}>My Dashboard</h1>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
                    Welcome, <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{user?.username}</span>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <button style={tabStyle('bookings')} onClick={() => setActiveTab('bookings')}>
                    <Calendar size={16} /> My Bookings {bookings.length > 0 && <span style={{ background: activeTab === 'bookings' ? 'rgba(0,0,0,0.2)' : 'var(--accent)', color: activeTab === 'bookings' ? '#000' : '#000', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{bookings.length}</span>}
                </button>
                <button style={tabStyle('wishlist')} onClick={() => setActiveTab('wishlist')}>
                    <Heart size={16} /> Wishlist {wishlist.length > 0 && <span style={{ background: activeTab === 'wishlist' ? 'rgba(0,0,0,0.2)' : '#ef4444', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{wishlist.length}</span>}
                </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Calendar color="var(--accent)" /> My Bookings</h2>
                    {loading ? <p>Loading bookings...</p> : bookings.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--glass-border)', borderRadius: '1rem' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You haven't made any bookings yet.</p>
                            <a href="/" className="btn btn-primary">Browse Collection</a>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {bookings.map(booking => (
                                <div key={booking.id} style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <img src={booking.image || 'https://via.placeholder.com/150'} alt={booking.model} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{booking.make} {booking.model}</h3>
                                        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} />{booking.startDate} - {booking.endDate}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} />Confirmed</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '0.75rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Price</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{booking.totalPrice}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <a href={`/track/${booking.id}`} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Navigation size={14} /> Track</a>
                                            <button onClick={() => cancelBooking(booking.id)} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><Trash2 size={14} /> Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Heart color="#ef4444" /> My Wishlist</h2>
                    {wishlist.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--glass-border)', borderRadius: '1rem' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your wishlist is empty.</p>
                            <a href="/" className="btn btn-primary">Browse Cars</a>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {wishlist.map(car => (
                                <div key={car.id} style={{ background: 'var(--bg-primary)', borderRadius: '1rem', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                                    <img src={car.image} alt={`${car.make} ${car.model}`} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                    <div style={{ padding: '1.25rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{car.make} {car.model}</h3>
                                        <p style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '1rem' }}>₹{car.pricePerDay}/day</p>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/cars/${car.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '0.5rem' }}>View Details</Link>
                                            <button onClick={() => removeFromWishlist(car.id)} className="btn" style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
