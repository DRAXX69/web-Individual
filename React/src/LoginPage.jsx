import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Login attempt:', { email, password });
    // Add your login logic here
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (onNavigateToRegister) {
      onNavigateToRegister();
    }
  };

  return (
    <div className="login-container">
      <div className="background-pattern"></div>
      
      <div className="login-card">
        {/* Logo/Brand Section */}
        <div className="brand-section">
          <div className="brand-title">
            VIP <span className="brand-accent">MOTORS</span>
          </div>
          <div className="brand-subtitle">
            Hypercars Showcase
          </div>
          <div className="brand-divider"></div>
        </div>

        {/* Login Form */}
        <div className="form-container">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
              />
              Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleSubmit}
            className="login-button"
          >
            Access Showcase
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line"></div>
          <div className="divider-text">or</div>
          <div className="divider-line"></div>
        </div>

        {/* Sign Up Link */}
        <div className="signup-section">
          <p className="signup-text">
            Don't have an account?{' '}
            <a href="#" className="signup-link" onClick={handleRegisterClick}>
              Register Here
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="footer-text">
          Exclusive access to premium hypercars
        </div>
      </div>
    </div>
  );
}