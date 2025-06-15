import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'register'

  const navigateToRegister = () => {
    setCurrentPage('register');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <div className="app">
      {currentPage === 'login' ? (
        <LoginPage onNavigateToRegister={navigateToRegister} />
      ) : (
        <RegisterPage onNavigateToLogin={navigateToLogin} />
      )}
    </div>
  );
}