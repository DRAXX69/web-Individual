import React, { useState } from 'react';
import './RegisterPage.css';

export default function RegisterPage({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    console.log('Registration attempt:', formData);
    // Add your registration logic here
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <div className="register-container">
      <div className="background-pattern"></div>
      
      <div className="register-card">
        {/* Logo/Brand Section */}
        <div className="brand-section">
          <div className="brand-title">
            VIP <span className="brand-accent">MOTORS</span>
          </div>
          <div className="brand-subtitle">
            Join the Elite Hypercar Community
          </div>
          <div className="brand-divider"></div>
        </div>

        {/* Registration Form */}
        <div className="form-container">
          <div className="name-row">
            <div className="input-group half-width">
              <label htmlFor="firstName" className="input-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="input-group half-width">
              <label htmlFor="lastName" className="input-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone" className="input-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="checkbox-input"
                required
              />
              I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="register-button"
            disabled={!formData.agreeTerms}
          >
            Request VIP Access
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line"></div>
          <div className="divider-text">or</div>
          <div className="divider-line"></div>
        </div>

        {/* Login Link */}
        <div className="login-section">
          <p className="login-text">
            Already have an account?{' '}
            <a href="#" className="login-link" onClick={handleLoginClick}>
              Sign In Here
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="footer-text">
          Applications are reviewed within 24-48 hours
        </div>
      </div>
    </div>
  );
}