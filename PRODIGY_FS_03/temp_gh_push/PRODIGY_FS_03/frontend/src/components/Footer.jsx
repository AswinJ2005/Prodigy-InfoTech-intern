import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Local Store</h3>
                        <p>Your trusted local e-commerce platform for quality products.</p>
                        <div className="social-links">
                            <a href="#"><FaFacebook /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/products">Products</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Info</h4>
                        <p><FaMapMarkerAlt /> 123 Main Street, Your City</p>
                        <p><FaPhone /> +1 234 567 8900</p>
                        <p><FaEnvelope /> info@localstore.com</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Local Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
