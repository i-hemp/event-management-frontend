import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { useError } from '../context/ErrorContext';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showError } = useError();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        seats: 0
    });
    const [bookings, setBookings] = useState([]);
    const [attendeeForm, setAttendeeForm] = useState({ name: '', email: '', contact: '' });

    useEffect(() => {
        fetchEvent();
        fetchBookings();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const { data } = await api.get(`/events/${id}`);
            setFormData({
                title: data.title,
                description: data.description,
                location: data.location,
                seats: data.seats
            });
        } catch (error) {
            console.error(error);
            showError('Failed to fetch event details');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
             // Organizer gets all their bookings via this endpoint
             const { data } = await api.get('/bookings');
             // Filter for this specific event
             const eventBookings = data.filter(b => b.eventId === id);
             setBookings(eventBookings);
        } catch (error) {
            console.error("Failed to fetch bookings");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/events/${id}`, formData);
            alert('Event updated successfully');
            navigate('/events');
        } catch (error) {
            showError('Failed to update event');
        }
    };

    const handleAddAttendee = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bookings/manual', {
                eventId: id,
                ...attendeeForm
            });
            alert('Attendee added successfully');
            setAttendeeForm({ name: '', email: '', contact: '' });
            fetchBookings(); // Refresh list
        } catch (error) {
            showError(error.response?.data?.error || 'Failed to add attendee');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Ticket ID copied!');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Edit Event</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Seats</label>
                                <input
                                    type="number"
                                    value={formData.seats}
                                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Event</button>
                        <button type="button" onClick={() => navigate('/events')} className="btn" style={{ flex: 1, border: '1px solid #ddd' }}>Cancel</button>
                    </div>
                </form>
            </div>

            {/* Manage Attendees Section */}
            <div className="card">
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Manage Attendees</h3>
                
                {/* Add Attendee Form */}
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Add New Attendee</h4>
                    <form onSubmit={handleAddAttendee} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr auto' }}>
                        <input 
                            placeholder="Name" 
                            required 
                            value={attendeeForm.name}
                            onChange={(e) => setAttendeeForm({...attendeeForm, name: e.target.value})}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <input 
                            placeholder="Email" 
                            type="email" 
                            required 
                            value={attendeeForm.email}
                            onChange={(e) => setAttendeeForm({...attendeeForm, email: e.target.value})}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <input 
                            placeholder="Contact" 
                            required 
                            value={attendeeForm.contact}
                            onChange={(e) => setAttendeeForm({...attendeeForm, contact: e.target.value})}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Add</button>
                    </form>
                </div>

                {/* Attendee List */}
                <div>
                     <h4 style={{ marginBottom: '1rem' }}>Registered Attendees ({bookings.length})</h4>
                     <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '0.5rem' }}>Name</th>
                                    <th style={{ padding: '0.5rem' }}>Email</th>
                                    <th style={{ padding: '0.5rem' }}>Ticket ID</th>
                                    <th style={{ padding: '0.5rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '0.5rem' }}>{b.name}</td>
                                        <td style={{ padding: '0.5rem' }}>{b.email}</td>
                                        <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{b.ticketId}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <button 
                                                onClick={() => copyToClipboard(b.ticketId)}
                                                style={{ color: '#2563eb', background: '#eff6ff', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                            >
                                                Copy ID
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No attendees yet</td></tr>}
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
