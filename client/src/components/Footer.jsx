import { Mail, Phone, Instagram, MessageCircle, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <Link to="/" className="logo footer-logo">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Car size={28} />
                            LUXE DRIVE
                        </span>
                    </Link>
                    <p className="footer-tagline">Experience the ultimate in premium car rentals. Redefining your journey with style and comfort.</p>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <div className="contact-item">
                        <Mail size={18} className="contact-icon" />
                        <a href="mailto:support@luxedrive.com">support@luxedrive.com</a>
                    </div>
                    <div className="contact-item">
                        <Phone size={18} className="contact-icon" />
                        <a href="tel:+919876543210">+91 98765 43210</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="https://instagram.com/luxedrive_premium" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                            <Instagram size={24} />
                        </a>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                            <MessageCircle size={24} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Luxe Drive Premium Car Rentals. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
