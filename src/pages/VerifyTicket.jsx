import React, { useState } from 'react';
import api from '../api';
import { useError } from '../context/ErrorContext';

const VerifyTicket = () => {
    const [ticketId, setTicketId] = useState('');
    const [result, setResult] = useState(null);
    const { showError } = useError();

    const handleVerify = async (e) => {
        e.preventDefault();
        setResult(null);
        try {
            const { data } = await api.post('/bookings/verify', { ticketId });
            setResult({ success: true, ...data });
        } catch (error) {
            const msg = error.response?.data?.error || 'Verification Failed';
            setResult({ success: false, error: msg, details: error.response?.data?.details });
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>Verify Ticket</h2>
                <form onSubmit={handleVerify} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="Enter Ticket ID"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        required
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                    <button type="submit" className="btn btn-primary">Check</button>
                </form>

                {result && (
                    <div style={{ padding: '1.5rem', borderRadius: '8px', background: result.success ? '#f0fdf4' : '#fef2f2', border: result.success ? '1px solid #bbf7d0' : '1px solid #fecaca' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: result.success ? '#166534' : '#991b1b', marginBottom: '0.5rem' }}>
                            {result.success ? '✅ Valid Ticket' : '❌ ' + result.error}
                        </div>
                        {result.booking && (
                             <div style={{ marginTop: '1rem' }}>
                                 <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ticket Details:</div>
                                 <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem' }}>
                                     <div style={{ color: '#666' }}>Attendee:</div>
                                     <div style={{ fontWeight: '500' }}>{result.booking.name}</div>
                                     
                                     <div style={{ color: '#666' }}>Event:</div>
                                     <div style={{ fontWeight: '500' }}>{result.booking.event?.title}</div>

                                     <div style={{ color: '#666' }}>Date:</div>
                                     <div style={{ fontWeight: '500' }}>{result.booking.event?.date ? new Date(result.booking.event.date).toLocaleDateString() : 'N/A'}</div>

                                     <div style={{ color: '#666' }}>Email:</div>
                                     <div>{result.booking.email}</div>
                                 </div>
                             </div>
                        )}
                        {/* Show limited details even if cancelled for context */}
                        {result.details && !result.booking && (
                             <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#991b1b' }}>
                                 <p>Booking ID: {result.details._id}</p>
                                 <p>Status: {result.details.status}</p>
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyTicket;
