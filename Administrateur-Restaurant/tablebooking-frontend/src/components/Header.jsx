import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-left">
          <div className="logo-section">
            <img src="/logo.png" alt="TableBooking Logo" className="logo-icon" />
            <h1 className="brand-name">TableBooking</h1>
          </div>
        </div>

        {/* Contact Section */}
        <div className="header-right">
          <a href="tel:+1234567890" className="contact-link">
            <span className="contact-icon">📞</span>
            <span className="contact-text">Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
