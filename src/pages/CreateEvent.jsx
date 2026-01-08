import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const [formData, setFormData] = useState({ title: '', description: '', location: '', seats: 0 });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      navigate('/');
    } catch (error) {
      alert('Failed to create event');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                </div>
                <div>
                     <label>Date & Time</label>
                     <input
                       type="datetime-local"
                       value={formData.date || ''}
                       onChange={(e) => setFormData({...formData, date: e.target.value})}
                       min={new Date().toISOString().slice(0, 16)}
                       max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 16)}
                       required
                     />
                     <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                        * Must be a future date within the next 1 month
                     </small>
                </div>
                <div>
                    <label>Seats</label>
                    <input
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})}
                      required
                    />
                </div>
             </div>
          </div>
          <button type="submit" className="btn btn-primary">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
