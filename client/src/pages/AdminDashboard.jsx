import { useState, useEffect } from 'react';
import { Trash2, Plus, Calendar } from 'lucide-react';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [bookingsRes, carsRes] = await Promise.all([
                    fetch('http://localhost:3001/api/bookings', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch('http://localhost:3001/api/cars')
                ]);

                if (bookingsRes.ok) {
                    const contentType = bookingsRes.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        setBookings(await bookingsRes.json());
                    }
                }
                if (carsRes.ok) {
                    const contentType = carsRes.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        setCars(await carsRes.json());
                    }
                }

            } catch (error) {
                console.error("Error fetching admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container" style={{ paddingBlock: '4rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gap: '4rem' }}>
                {/* Bookings Section */}
                <section>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={24} color="var(--accent)" /> Recent Bookings
                    </h2>
                    <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>ID</th>
                                    <th style={{ padding: '1rem' }}>Customer</th>
                                    <th style={{ padding: '1rem' }}>Car</th>
                                    <th style={{ padding: '1rem' }}>Dates</th>
                                    <th style={{ padding: '1rem' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>#{booking.id}</td>
                                        <td style={{ padding: '1rem' }}>{booking.customerName}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {booking.make} {booking.model}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {booking.startDate} to {booking.endDate}
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{booking.totalPrice}</td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No bookings found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Cars Management Section (Placeholder for simplicity) */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Collection Management</h2>
                        <button className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                            <Plus size={16} /> Add New Car
                        </button>
                    </div>
                    <div className="car-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                        {cars.map(car => (
                            <div key={car.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem' }}>{car.make} {car.model}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>₹{car.pricePerDay}/day</p>
                                </div>
                                <button style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
