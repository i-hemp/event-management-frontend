import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this registration? Seats will be restored.")) return;

        try {
            await api.delete(`/bookings/${bookingId}`);
            alert('Registration cancelled successfully.');
            // Remove locally
            setBookings(bookings.filter(b => b._id !== bookingId));
        } catch (error) {
            alert(error.response?.data?.error || "Failed to cancel registration");
        }
    };

    const { user } = useAuth();
    const isOrganizer = user?.role === 'ORGANIZER';

    // Extract unique events for filter
    const uniqueEvents = [...new Map(bookings.map(b => [b.eventId, b.event])).values()].filter(e => e);
    const [selectedEventId, setSelectedEventId] = useState('ALL');

    const filteredBookings = selectedEventId === 'ALL'
        ? bookings
        : bookings.filter(b => b.eventId === selectedEventId);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {isOrganizer ? 'Event Bookings ( Attendees )' : 'My Registered Events'}
                </h2>

                {isOrganizer && uniqueEvents.length > 0 && (
                    <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    >
                        <option value="ALL">All Events</option>
                        {uniqueEvents.map(event => (
                            <option key={event._id} value={event._id}>{event.title}</option>
                        ))}
                    </select>
                )}
            </div>

            {filteredBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <p>No bookings found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {filteredBookings.map(booking => (
                        booking.event && (
                            <div key={booking._id} className="card" style={{ borderLeft: `4px solid ${booking.status === 'CANCELLED' ? '#ef4444' : '#4f46e5'}`, position: 'relative' }}>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Event</span>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{booking.event.title}</h3>
                                </div>

                                {isOrganizer ? (
                                    <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '6px', margin: '0.5rem 0' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Attendee Details</div>
                                        <div style={{ fontSize: '0.9rem' }}>👤 {booking.name}</div>
                                        <div style={{ fontSize: '0.9rem' }}>📧 {booking.email}</div>
                                        <div style={{ fontSize: '0.9rem' }}>📞 {booking.contact}</div>
                                    </div>
                                ) : (
                                    <>
                                        <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{booking.event.description.substring(0, 60)}...</p>
                                        <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                            <div>📍 {booking.event.location}</div>
                                            <div>📅 {booking.event.date ? new Date(booking.event.date).toLocaleDateString() : 'Date N/A'}</div>
                                        </div>
                                    </>
                                )}

                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ticket ID</p>
                                        <p style={{ fontSize: '0.875rem', color: '#4f46e5', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                            {booking.ticketId}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {/* Status Logic */}
                                        {(() => {
                                            const isCancelled = booking.status === 'CANCELLED';
                                            const isAttended = booking.attended;
                                            const isExpired = new Date(booking.event.date) < new Date();

                                            let statusText = 'GOING';
                                            let statusStyle = { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };

                                            if (isCancelled) {
                                                statusText = 'CANCELLED';
                                                statusStyle = { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
                                            } else if (isAttended) {
                                                statusText = 'VERIFIED';
                                                statusStyle = { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' };
                                            } else if (isExpired) {
                                                statusText = 'EXPIRED';
                                                statusStyle = { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
                                            }

                                            return (
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.text,
                                                    border: `1px solid ${statusStyle.border}`,
                                                    display: 'inline-block',
                                                    minWidth: '80px',
                                                    textAlign: 'center'
                                                }}>
                                                    {statusText}
                                                </span>
                                            );
                                        })()}

                                        {booking.status !== 'CANCELLED' && !booking.attended && new Date(booking.event.date) > new Date() && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                style={{
                                                    padding: '0.375rem 0.75rem',
                                                    backgroundColor: '#fff',
                                                    color: '#ef4444',
                                                    border: '1px solid #fca5a5',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                                title="Cancel Booking"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
