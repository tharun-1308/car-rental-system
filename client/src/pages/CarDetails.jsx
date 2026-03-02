import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, User, CheckCircle, AlertCircle, Users, Gauge, Fuel, Droplets, Car, Star, Send } from 'lucide-react';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

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

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

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

        // Fetch reviews
        fetch(`http://localhost:3001/api/reviews/${id}`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error('Error fetching reviews:', err));
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
            showToast(dateError, 'error');
            return;
        }

        if (calculateTotal() <= 0) {
            setError("Invalid booking duration.");
            showToast("Invalid booking duration.", 'error');
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
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
                showToast('Booking confirmed! Redirecting to payment...', 'success');
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
            showToast(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast('Please login to submit a review', 'error');
            return navigate('/login');
        }
        if (reviewRating === 0) {
            showToast('Please select a star rating', 'error');
            return;
        }

        setSubmittingReview(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    carId: parseInt(id),
                    rating: reviewRating,
                    comment: reviewComment
                })
            });

            const data = await response.json();
            if (response.ok) {
                showToast(data.message, 'success');
                // Refresh reviews
                const res = await fetch(`http://localhost:3001/api/reviews/${id}`);
                const updatedReviews = await res.json();
                setReviews(updatedReviews);
                setReviewRating(0);
                setReviewComment('');
                // Refresh car data for updated rating
                const carRes = await fetch(`http://localhost:3001/api/cars/${id}`);
                const carData = await carRes.json();
                setCar(carData);
            } else {
                showToast(data.error || 'Failed to submit review', 'error');
            }
        } catch (err) {
            showToast('Error submitting review', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    const renderStars = (rating, size = 16, interactive = false) => {
        return (
            <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={size}
                        fill={star <= (interactive ? (hoverRating || reviewRating) : rating) ? '#f59e0b' : 'transparent'}
                        color={star <= (interactive ? (hoverRating || reviewRating) : rating) ? '#f59e0b' : 'var(--text-secondary)'}
                        style={interactive ? { cursor: 'pointer', transition: 'transform 0.15s' } : {}}
                        onClick={interactive ? () => setReviewRating(star) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    />
                ))}
            </div>
        );
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <p style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>₹{car.pricePerDay}/day</p>
                        {car.reviewCount > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '2rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                <span style={{ fontWeight: '600', color: '#f59e0b' }}>{car.avgRating}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({car.reviewCount})</span>
                            </div>
                        )}
                    </div>
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

                    {/* Reviews Section */}
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent)', display: 'inline-block', paddingBottom: '0.25rem' }}>
                            Reviews & Ratings
                        </h3>

                        {/* Review Form */}
                        <form onSubmit={handleReviewSubmit} className="review-form" style={{
                            background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem',
                            border: '1px solid var(--glass-border)', marginBottom: '2rem', marginTop: '1rem'
                        }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Write a Review</h4>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Rating</label>
                                {renderStars(reviewRating, 24, true)}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <textarea
                                    className="form-input"
                                    placeholder="Share your experience with this car..."
                                    rows="3"
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                    style={{ resize: 'vertical', minHeight: '80px' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={submittingReview || !user}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: user ? 1 : 0.5 }}>
                                <Send size={16} />
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                            {!user && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please login to submit a review</p>}
                        </form>

                        {/* Reviews List */}
                        {reviews.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {reviews.map(review => (
                                    <div key={review.id} style={{
                                        background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '1rem',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: 'var(--accent-light)', color: 'var(--accent)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: '700', fontSize: '0.9rem', border: '1px solid var(--accent)'
                                                }}>
                                                    {review.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{review.username}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            {renderStars(review.rating, 14)}
                                        </div>
                                        {review.comment && (
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: '1rem' }}>
                                No reviews yet. Be the first to review!
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)', position: 'sticky', top: '100px' }}>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <CheckCircle size={64} color="var(--accent)" style={{ marginBottom: '1rem', marginInline: 'auto' }} />
                            <h2 style={{ marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Redirecting to payment...</p>
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
