import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useError } from '../context/ErrorContext';
import { useAuth } from '../context/AuthContext';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useError();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            // Fetch all events and filter client-side (or improve API later)
            // Ideally we should have /events?organizer=me, but for now we iterate
            const { data } = await api.get('/events');
            const myEvents = data.filter(e => e.organizerId === (user.userId || user._id));
            setEvents(myEvents);
        } catch (error) {
            console.error(error);
            showError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            setEvents(events.filter(e => e._id !== id));
        } catch (error) {
            showError('Failed to delete event');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Events</h2>
                <Link to="/create-event" className="btn btn-primary">
                    + Create New Event
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {events.map(event => (
                    <div key={event._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{event.title}</h3>
                        <p style={{ color: '#666', marginBottom: '1rem', flex: 1 }}>
                            {event.description.substring(0, 100)}...
                        </p>
                        <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
                            <div>📍 {event.location}</div>
                            <div>🪑 {event.seats} seats remaining</div>
                            <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <button 
                                onClick={() => navigate(`/edit-event/${event._id}`)}
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: '0.5rem' }}
                            >
                                View / Verify
                            </button>
                            <button 
                                onClick={() => handleDelete(event._id)}
                                className="btn" 
                                style={{ flex: 1, padding: '0.5rem', background: '#fee2e2', color: '#991b1b', border: 'none' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                    <p>You haven't created any events yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyEvents;
