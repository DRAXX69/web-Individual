import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onNavigateToRegister, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate loading for better UX
    setTimeout(() => {
      const loginSuccess = onLogin(email, password);
      
      if (!loginSuccess) {
        setError('Invalid credentials. Try: admin@vipmotors.com / vip123');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (onNavigateToRegister) {
      onNavigateToRegister();
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@vipmotors.com');
    setPassword('vip123');
    setError('');
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

        {/* Demo Credentials Notice */}
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#fca5a5', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
            Demo Credentials:
          </p>
          <p style={{ color: '#d1d5db', fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>
            Email: admin@vipmotors.com<br />
            Password: vip123
          </p>
          <button 
            onClick={handleDemoFill}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Auto-fill Demo
          </button>
        </div>

        {/* Login Form */}
        <div className="form-container">
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid #ef4444', 
              borderRadius: '0.5rem', 
              padding: '0.75rem', 
              marginBottom: '1rem',
              color: '#fca5a5',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              placeholder="Enter your email"
              required
              disabled={isLoading}
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
              onKeyPress={handleKeyPress}
              className="input-field"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                disabled={isLoading}
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
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Accessing...' : 'Access Showcase'}
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