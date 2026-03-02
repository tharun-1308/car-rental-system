import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Gauge, Battery, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';

const Tracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(65);
    const [eta, setEta] = useState(25);
    const [status, setStatus] = useState('En Route');

    // Simulate journey progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setStatus('Arrived');
                    setSpeed(0);
                    setEta(0);
                    clearInterval(interval);
                    return 100;
                }
                // Randomize speed slightly
                setSpeed(Math.floor(Math.random() * (75 - 55 + 1) + 55));
                setEta(Math.max(0, 25 - Math.floor(prev / 4)));
                return prev + 0.5;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container" style={{ paddingBlock: '3rem' }}>
            <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: '600px' }}>
                {/* Simulated Map View */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }}>
                    {/* Abstract Map Grid */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(var(--glass-border) 1px, transparent 1px), linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {/* Simulated Path */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                        <path
                            d="M 100 500 Q 300 450 400 300 T 700 100"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="30"
                            strokeLinecap="round"
                        />
                        <path
                            id="track-path"
                            d="M 100 500 Q 300 450 400 300 T 700 100"
                            fill="none"
                            stroke="var(--accent)"
                            strokeWidth="4"
                            strokeDasharray="10 5"
                            style={{ opacity: 0.6 }}
                        />

                        {/* Animated Car Marker */}
                        <g style={{
                            transform: `translate(${100 + (progress * 6)}px, ${500 - (progress * 4)}px)`,
                            transition: 'transform 1s linear'
                        }}>
                            <circle r="20" fill="var(--accent)" style={{ filter: 'blur(15px)', opacity: 0.5 }} />
                            <circle r="10" fill="var(--accent)" stroke="white" strokeWidth="2" />
                            <Navigation
                                size={16}
                                color="white"
                                style={{ transform: 'translate(-8px, -8px) rotate(45deg)' }}
                            />
                        </g>

                        {/* Destination Marker */}
                        <g style={{ transform: 'translate(700px, 100px)' }}>
                            <MapPin size={32} color="var(--accent)" style={{ transform: 'translate(-16px, -32px)' }} />
                            <circle r="5" fill="var(--accent)" style={{ transform: 'translate(0, 0)' }} />
                        </g>
                    </svg>

                    {/* Overlay Info */}
                    <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(0,0,0,0.8)', padding: '1rem 2rem', borderRadius: '1rem', border: '1px solid var(--accent)', backdropFilter: 'blur(10px)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Location</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Hitec City, Hyderabad</div>
                    </div>
                </div>

                {/* Telemetry Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: status === 'Arrived' ? '#4ade80' : 'var(--accent)', boxShadow: `0 0 10px ${status === 'Arrived' ? '#4ade80' : 'var(--accent)'}` }}></div>
                            <h2 style={{ fontSize: '1.25rem' }}>{status}</h2>
                        </div>

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <Gauge size={20} color="var(--accent)" /> Speed
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{speed} km/h</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <Clock size={20} color="var(--accent)" /> ETA
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{eta} mins</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <Battery size={20} color="var(--accent)" /> Fuel/Battery
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{Math.max(22, 100 - Math.floor(progress))} %</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                <span>Journey Progress</span>
                                <span>{Math.floor(progress)}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 1s linear' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <ShieldCheck size={32} color="#4ade80" />
                        <div>
                            <div style={{ fontWeight: '700' }}>DriveSafe™ Enabled</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vehicle is monitored for safety</div>
                        </div>
                    </div>

                    <div style={{ flex: 1, background: 'linear-gradient(45deg, var(--bg-secondary), var(--bg-primary))', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Trip ID</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '2px' }}>TRK-{id?.slice(-6).toUpperCase()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracking;
