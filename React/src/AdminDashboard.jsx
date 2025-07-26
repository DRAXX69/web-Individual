import React, { useState } from 'react';

export default function AdminDashboard({ admin, onLogout }) {
  const [section, setSection] = useState('products');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="brand-logo">
            ADMIN <span className="brand-accent">DASHBOARD</span>
          </div>
        </div>
        <nav className="header-nav">
          <span style={{ color: '#fff', marginRight: '2rem' }}>{admin?.name} ({admin?.email})</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="dashboard-main">
        <aside className="admin-sidebar" style={{ float: 'left', width: '220px', minHeight: '80vh', background: '#1e293b', color: '#fff', padding: '2rem 1rem' }}>
          <div style={{ marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>Admin Menu</div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              <button onClick={() => setSection('products')} style={{ width: '100%', background: section==='products' ? '#ef4444' : 'transparent', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Add Products</button>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <button onClick={() => setSection('users')} style={{ width: '100%', background: section==='users' ? '#ef4444' : 'transparent', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Manage Users</button>
            </li>
            <li>
              <button onClick={() => setSection('settings')} style={{ width: '100%', background: section==='settings' ? '#ef4444' : 'transparent', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Admin Settings</button>
            </li>
          </ul>
        </aside>
        <section style={{ marginLeft: '240px', padding: '2rem' }}>
          {section === 'products' && (
            <div>
              <h2>Add Products</h2>
              <p>Product management UI goes here.</p>
            </div>
          )}
          {section === 'users' && (
            <div>
              <h2>Manage Users</h2>
              <p>User management UI goes here.</p>
            </div>
          )}
          {section === 'settings' && (
            <div>
              <h2>Admin Settings</h2>
              <p>Settings UI goes here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 