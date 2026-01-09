import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <Logo height={40} />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Campus Events</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className="btn btn-secondary">Events</Link>

        {user ? (
          <div className="profile-menu-container">
            <button className="profile-button">
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', color: '#111827' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user.role}</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </button>

            <div className="dropdown-menu">
              {user.role === 'ORGANIZER' && (
                <>
                  <Link to="/create-event" className="dropdown-item">Create Event</Link>
                  <Link to="/my-events" className="dropdown-item">My Events</Link>
                  <Link to="/verify-ticket" className="dropdown-item">Verify Ticket</Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
              )}
              {/* For regular users or organizer personal bookings */}
              <Link to="/profile" className="dropdown-item">My Profile</Link>
              {user.role !== 'ADMIN' && (
                <Link to="/my-bookings" className="dropdown-item">My Bookings</Link>
              )}
              <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.25rem 0' }}></div>
              <button onClick={handleLogout} className="dropdown-item" style={{ color: '#ef4444' }}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
