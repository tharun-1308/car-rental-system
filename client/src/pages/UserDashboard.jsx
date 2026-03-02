import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3001/api/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await res.json();
                        setBookings(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching bookings", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchBookings();
    }, [user]);

    return (
        <div className="container" style={{ paddingBlock: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>My Dashboard</h1>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
                    Welcome, <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{user?.username}</span>
                </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar color="var(--accent)" /> My Bookings
                </h2>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={16} />
                                            {booking.startDate} - {booking.endDate}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={16} />
                                            Confirmed
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '0.75rem' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Price</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{booking.totalPrice}</div>
                                    </div>
                                    <a href={`/track/${booking.id}`} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}>
                                        <Navigation size={14} /> Track Live
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
