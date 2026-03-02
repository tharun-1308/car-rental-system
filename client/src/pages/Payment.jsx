import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Landmark, Smartphone, Package, CheckCircle, ArrowLeft } from 'lucide-react';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingData, car } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!bookingData || !car) {
        return (
            <div className="container" style={{ paddingBlock: '4rem', textAlign: 'center' }}>
                <h2>No booking information found.</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                    Go Home
                </button>
            </div>
        );
    }

    const handlePayment = () => {
        if (!paymentMethod) return;
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="container" style={{ paddingBlock: '6rem', textAlign: 'center' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '4rem', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)', maxWidth: '600px', margin: '0 auto' }}>
                    <CheckCircle size={80} color="var(--accent)" style={{ marginBottom: '2rem', marginInline: 'auto' }} />
                    <h1 style={{ marginBottom: '1rem' }}>Payment Successful!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Your booking for <strong>{car.make} {car.model}</strong> has been confirmed.
                        We've sent the details to your email.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBlock: '4rem' }}>
            <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', color: 'var(--text-secondary)', paddingLeft: 0, marginBottom: '2rem' }}>
                <ArrowLeft size={20} /> Change Booking Details
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '2rem' }}>Select Payment Method</h1>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {/* UPI */}
                        <div
                            onClick={() => setPaymentMethod('upi')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                                background: paymentMethod === 'upi' ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-secondary)',
                                border: `1px solid ${paymentMethod === 'upi' ? 'var(--accent)' : 'var(--glass-border)'}`,
                                borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ background: 'rgba(220, 38, 38, 0.15)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                <Smartphone color="var(--accent)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>UPI Payment</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>GPay, PhonePe, Paytm</p>
                            </div>
                        </div>

                        {/* Card */}
                        <div
                            onClick={() => setPaymentMethod('card')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                                background: paymentMethod === 'card' ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-secondary)',
                                border: `1px solid ${paymentMethod === 'card' ? 'var(--accent)' : 'var(--glass-border)'}`,
                                borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ background: 'rgba(220, 38, 38, 0.15)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                <CreditCard color="var(--accent)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>Credit / Debit Card</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Visa, Mastercard, RuPay</p>
                            </div>
                        </div>

                        {/* Net Banking */}
                        <div
                            onClick={() => setPaymentMethod('netbanking')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                                background: paymentMethod === 'netbanking' ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-secondary)',
                                border: `1px solid ${paymentMethod === 'netbanking' ? 'var(--accent)' : 'var(--glass-border)'}`,
                                borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ background: 'rgba(220, 38, 38, 0.15)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                <Landmark color="var(--accent)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>Net Banking</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>All major Indian banks</p>
                            </div>
                        </div>

                        {/* Cash / Offline */}
                        <div
                            onClick={() => setPaymentMethod('offline')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                                background: paymentMethod === 'offline' ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-secondary)',
                                border: `1px solid ${paymentMethod === 'offline' ? 'var(--accent)' : 'var(--glass-border)'}`,
                                borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ background: 'rgba(220, 38, 38, 0.15)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                <Package color="var(--accent)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem' }}>Pay on Delivery</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pay cash when you pick up the car</p>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={!paymentMethod || isProcessing}
                        onClick={handlePayment}
                        style={{ width: '100%', marginTop: '2rem', height: '3.5rem', fontSize: '1.1rem' }}
                    >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>

                {/* Summary Sidebar */}
                <aside>
                    <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--card-radius)', border: '1px solid var(--glass-border)', position: 'sticky', top: '100px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Booking Summary</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <img src={car.image} alt={car.model} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                            <div>
                                <h4 style={{ marginBottom: '0.25rem' }}>{car.make} {car.model}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{car.year} • {car.category}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', paddingVertical: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Dates</span>
                                <span>{bookingData.startDate} to {bookingData.endDate}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Daily Rate</span>
                                <span>₹{car.pricePerDay}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '2px solid var(--accent)' }}>
                            <span style={{ fontWeight: 'bold' }}>Total Amount</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{bookingData.totalPrice}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Payment;
