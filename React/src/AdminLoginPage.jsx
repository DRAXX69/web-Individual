import React, { useState } from 'react';

export default function AdminLoginPage({ onNavigateToAdminRegister, onNavigateToLogin, onAdminLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (onAdminLoginSuccess) {
            onAdminLoginSuccess(data.admin);
          }
        }, 1000);
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-section">
          <div className="brand-title">Admin <span className="brand-accent">Login</span></div>
        </div>
        {error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>
        )}
        {success && (
          <div style={{ color: '#22c55e', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>
        )}
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-group">
            <label htmlFor="admin-email" className="input-label">Admin Email</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter admin email"
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="admin-password" className="input-label">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password"
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            style={{ marginTop: '1rem' }}
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        <div className="divider" style={{ margin: '1.5rem 0' }}>
          <div className="divider-line"></div>
          <div className="divider-text">or</div>
          <div className="divider-line"></div>
        </div>
        <button
          className="login-button"
          style={{ background: '#1e293b', color: '#fff', width: '100%' }}
          onClick={onNavigateToAdminRegister}
        >
          Sign up as Admin
        </button>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={onNavigateToLogin}
          >
            Back to user login
          </button>
        </div>
      </div>
    </div>
  );
} 