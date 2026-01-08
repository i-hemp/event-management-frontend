import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Campus Events</h1>
      <p className="home-subtitle">Welcome to the future of event management</p>
      <button className="home-btn" onClick={() => navigate('/events')}>
        Show Events
      </button>
    </div>
  );
};

export default Home;
