import React from 'react';
import './Dashboard.css';

export default function Dashboard({ onLogout }) {
  const hypercars = [
    {
      id: 1,
      brand: "Bugatti",
      name: "Chiron Super Sport 300+",
      price: "$3.9M",
      emoji: "🏎️",
      specs: {
        power: "1,578 HP",
        topSpeed: "304 MPH",
        acceleration: "2.4s 0-60",
        engine: "8.0L W16"
      }
    },
    {
      id: 2,
      brand: "Koenigsegg",
      name: "Jesko Absolut",
      price: "$3.4M",
      emoji: "⚡",
      specs: {
        power: "1,600 HP",
        topSpeed: "330 MPH",
        acceleration: "2.5s 0-60",
        engine: "5.0L V8"
      }
    },
    {
      id: 3,
      brand: "McLaren",
      name: "Speedtail",
      price: "$2.2M",
      emoji: "🚀",
      specs: {
        power: "1,035 HP",
        topSpeed: "250 MPH",
        acceleration: "2.5s 0-60",
        engine: "Hybrid V8"
      }
    },
    {
      id: 4,
      brand: "Pagani",
      name: "Huayra BC Roadster",
      price: "$3.5M",
      emoji: "💨",
      specs: {
        power: "791 HP",
        topSpeed: "238 MPH",
        acceleration: "2.8s 0-60",
        engine: "6.0L V12"
      }
    },
    {
      id: 5,
      brand: "Ferrari",
      name: "LaFerrari Aperta",
      price: "$2.2M",
      emoji: "🔥",
      specs: {
        power: "949 HP",
        topSpeed: "217 MPH",
        acceleration: "2.4s 0-60",
        engine: "Hybrid V12"
      }
    },
    {
      id: 6,
      brand: "Lamborghini",
      name: "Sián FKP 37",
      price: "$3.6M",
      emoji: "⚡",
      specs: {
        power: "819 HP",
        topSpeed: "217 MPH",
        acceleration: "2.8s 0-60",
        engine: "Hybrid V12"
      }
    }
  ];

  const handleViewDetails = (car) => {
    alert(`${car.brand} ${car.name}\n\nSpecs:\n• Power: ${car.specs.power}\n• Top Speed: ${car.specs.topSpeed}\n• 0-60: ${car.specs.acceleration}\n• Engine: ${car.specs.engine}\n\nPrice: ${car.price}`);
  };

  return (
    
    <div className="dashboard-container">
      <div className="dashboard-bg-pattern"></div>
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="brand-logo">
            VIP <span className="brand-accent">MOTORS</span>
          </div>
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link">Showcase</a>
          <a href="#" className="nav-link">Collection</a>
          <a href="#" className="nav-link">About</a>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <h1 className="hero-title">Elite Hypercar Collection</h1>
          <p className="hero-subtitle">
            Discover the world's most exclusive and powerful hypercars
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">Exclusive Models</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">$18M+</span>
              <span className="stat-label">Total Value</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1,600</span>
              <span className="stat-label">Max Horsepower</span>
            </div>
          </div>
        </section>

        {/* Cars Showcase */}
        <section className="cars-section">
          <h2 className="section-title">Featured Hypercars</h2>
          
          <div className="cars-grid">
            {hypercars.map(car => (
              <div key={car.id} className="car-card" onClick={() => handleViewDetails(car)}>
                <div className="car-image">
                  <span style={{ fontSize: '4rem' }}>{car.emoji}</span>
                </div>
                
                <div className="car-info">
                  <div className="car-brand">{car.brand}</div>
                  <h3 className="car-name">{car.name}</h3>
                  <div className="car-price">{car.price}</div>
                  
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-value">{car.specs.power}</span>
                      <span className="spec-label">Power</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-value">{car.specs.topSpeed}</span>
                      <span className="spec-label">Top Speed</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-value">{car.specs.acceleration}</span>
                      <span className="spec-label">0-60 MPH</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-value">{car.specs.engine}</span>
                      <span className="spec-label">Engine</span>
                    </div>
                  </div>
                  
                  <button className="view-details-btn">
                    View Full Specs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}