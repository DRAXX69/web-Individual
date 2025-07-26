import React, { useState } from 'react';

export default function AdminRegisterPage({ onNavigateToAdminLogin, onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess('Registration successful! Please login as admin.');
        setTimeout(() => {
          onNavigateToAdminLogin();
        }, 1500);
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
          <div className="brand-title">Admin <span className="brand-accent">Sign Up</span></div>
        </div>
        {error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>
        )}
        {success && (
          <div style={{ color: '#22c55e', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>
        )}
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-group">
            <label htmlFor="admin-register-name" className="input-label">Admin Name</label>
            <input
              type="text"
              id="admin-register-name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field"
              placeholder="Enter admin name"
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="admin-register-email" className="input-label">Admin Email</label>
            <input
              type="email"
              id="admin-register-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter admin email"
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="admin-register-password" className="input-label">Password</label>
            <input
              type="password"
              id="admin-register-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password"
              disabled={isLoading}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="admin-register-confirm" className="input-label">Confirm Password</label>
            <input
              type="password"
              id="admin-register-confirm"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Confirm password"
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
            {isLoading ? 'Registering...' : 'Sign Up as Admin'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', marginRight: '1rem' }}
            onClick={onNavigateToAdminLogin}
          >
            Back to admin login
          </button>
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