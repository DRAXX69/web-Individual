import React, { useState } from 'react';
import './RegisterPage.css';

export default function RegisterPage({ onNavigateToLogin, onRegister }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      onRegister(formData);
      setIsLoading(false);
    }, 1500);
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
                disabled={isLoading}
              />
              {errors.firstName && (
                <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.firstName}
                </span>
              )}
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
                disabled={isLoading}
              />
              {errors.lastName && (
                <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.lastName}
                </span>
              )}
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
              placeholder="Enter email address"
              required
              disabled={isLoading}
            />
            {errors.email && (
              <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.email}
              </span>
            )}
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
              placeholder="Enter phone number"
              required
              disabled={isLoading}
            />
            {errors.phone && (
              <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.phone}
              </span>
            )}
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
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
            {errors.password && (
              <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.password}
              </span>
            )}
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
              placeholder="Confirm password"
              required
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="checkbox-input"
                disabled={isLoading}
              />
              <span className="checkbox-text">
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and{' '}
                <a href="#" className="terms-link">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeTerms && (
              <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.agreeTerms}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="login-link">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleLoginClick}
              className="link-button"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}