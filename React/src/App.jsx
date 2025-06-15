import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', or 'dashboard'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Valid credentials for demo
  const validCredentials = {
    email: 'admin@vipmotors.com',
    password: 'vip123'
  };

  const navigateToRegister = () => {
    setCurrentPage('register');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const handleLogin = (email, password) => {
    // Check if credentials match
    if (email === validCredentials.email && password === validCredentials.password) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      return true; // Login successful
    } else {
      return false; // Login failed
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleRegister = (formData) => {
    // For demo, we'll just show success and redirect to login
    alert('Registration successful! Please use the demo credentials to login:\n\nEmail: admin@vipmotors.com\nPassword: vip123');
    setCurrentPage('login');
  };

  return (
    <div className="app">
      {currentPage === 'login' && (
        <LoginPage 
          onNavigateToRegister={navigateToRegister}
          onLogin={handleLogin}
        />
      )}
      
      {currentPage === 'register' && (
        <RegisterPage 
          onNavigateToLogin={navigateToLogin}
          onRegister={handleRegister}
        />
      )}
      
      {currentPage === 'dashboard' && isAuthenticated && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}