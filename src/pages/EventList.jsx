import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useError } from '../context/ErrorContext';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const { showError } = useError();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingData, setBookingData] = useState({ name: '', email: '', contact: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      showError('Failed to delete event');
    }
  };

  const openBookingModal = (event) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedEvent(event);
    // Pre-fill email if available from user context
    setBookingData({ name: user.name || '', email: user.email || '', contact: '' });
    setShowModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', {
        eventId: selectedEvent._id,
        ...bookingData
      });
      alert('Successfully registered for event!');
      setShowModal(false);
      fetchEvents(); // Refresh to update seat count if displayed
    } catch (error) {
      showError(error.response?.data?.error || 'Registration failed');
    }
  };

  // Filter events
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) > now);
  const pastEvents = events.filter(e => new Date(e.date) <= now);

  const isAdminOrOrganizer = user && (user.role === 'ADMIN' || user.role === 'ORGANIZER');

  const renderEventCard = (event, isPast = false) => (
    <div key={event._id} className="card" style={{ display: 'flex', flexDirection: 'column', opacity: isPast ? 0.7 : 1, filter: isPast ? 'grayscale(1)' : 'none' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{event.title}</h3>
      <p style={{ color: '#6b7280', marginBottom: '1rem', flex: 1 }}>{event.description}</p>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
          <span>📍 {event.location}</span>
          <span>📅 {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
          <span>💺 {event.seats} seats left</span>
          {isPast && <span style={{ color: '#ef4444', fontWeight: 'bold' }}>FINISHED</span>}
        </div>

        {!isPast && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {user && user.role === 'USER' && (
              <button onClick={() => openBookingModal(event)} className="btn btn-primary" style={{ flex: 1 }}>Register</button>
            )}
            {(!user) && (
              <button onClick={() => openBookingModal(event)} className="btn btn-primary" style={{ flex: 1 }}>Register</button>
            )}

            {(isAdminOrOrganizer) && (
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                <button onClick={() => navigate(`/edit-event/${event._id}`)} style={{ flex: 1, color: '#2563eb', background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', padding: '0.5rem' }}>Edit/View</button>
                <button onClick={() => handleDelete(event._id)} style={{ flex: 1, color: '#ef4444', background: 'none', border: '1px solid #fee2e2', borderRadius: '4px', cursor: 'pointer', padding: '0.5rem' }}>Delete</button>
              </div>
            )}
          </div>
        )}
        {isPast && isAdminOrOrganizer && (
          <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
            <button onClick={() => navigate(`/edit-event/${event._id}`)} style={{ flex: 1, color: '#2563eb', background: 'none', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', padding: '0.5rem' }}>View Details</button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 'bold' }}>Upcoming Events</h2>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginBottom: '3rem' }}>
        {upcomingEvents.length > 0 ? upcomingEvents.map(e => renderEventCard(e)) : <p>No upcoming events.</p>}
      </div>

      {isAdminOrOrganizer && pastEvents.length > 0 && (
        <>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 'bold', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>Past / Finished Events</h2>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {pastEvents.map(e => renderEventCard(e, true))}
          </div>
        </>
      )}


      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register for {selectedEvent?.title}</h2>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  required
                  value={bookingData.contact}
                  onChange={(e) => setBookingData({ ...bookingData, contact: e.target.value })}
                  placeholder="10 digit mobile number"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default EventList;
