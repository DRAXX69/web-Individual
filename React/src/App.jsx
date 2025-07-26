import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import AdminLoginPage from './AdminLoginPage';
import AdminRegisterPage from './AdminRegisterPage';
import AdminDashboard from './AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'dashboard', 'admin-login', 'admin-register', 'admin-dashboard'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);

  // Valid credentials for demo
  const validCredentials = {
    email: 'admin@vipmotors.com',
    password: 'vip123',
    email: 'kritan879@gmail.com',
    password: 'kritan123',

  };

  const navigateToRegister = () => {
    setCurrentPage('register');
  };

  const navigateToAdminLogin = () => {
    setCurrentPage('admin-login');
  };

  const navigateToAdminRegister = () => {
    setCurrentPage('admin-register');
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

  const handleAdminLoginSuccess = (adminData) => {
    setAdmin(adminData);
    setCurrentPage('admin-dashboard');
  };

  return (
    <div className="app">
      {currentPage === 'login' && (
        <LoginPage 
          onNavigateToRegister={navigateToRegister}
          onLogin={handleLogin}
          onNavigateToAdminLogin={navigateToAdminLogin}
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
      {currentPage === 'admin-login' && (
        <AdminLoginPage 
          onNavigateToAdminRegister={navigateToAdminRegister}
          onNavigateToLogin={navigateToLogin}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      )}
      {currentPage === 'admin-dashboard' && admin && (
        <AdminDashboard admin={admin} onLogout={() => { setAdmin(null); setCurrentPage('login'); }} />
      )}
      {currentPage === 'admin-register' && (
        <AdminRegisterPage 
          onNavigateToAdminLogin={navigateToAdminLogin}
          onNavigateToLogin={navigateToLogin}
        />
      )}
    </div>
  );
}