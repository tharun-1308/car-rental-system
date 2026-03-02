import { Link, useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Car size={32} />
                        LUXE DRIVE
                    </span>
                </Link>
                <div className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Collection
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <button
                                onClick={logout}
                                className="nav-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
