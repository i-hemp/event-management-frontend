import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useError } from '../context/ErrorContext';

const Profile = () => {
    const { user: authUser } = useAuth();
    const { showError } = useError();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        bio: '',
        address: '',
        organizationName: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/users/profile');
            setFormData({
                name: data.name || '',
                email: data.email || '',
                role: data.role || '',
                bio: data.bio || '',
                address: data.address || '',
                organizationName: data.organizationName || ''
            });
        } catch (error) {
            console.error(error);
            showError('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${authUser.userId || authUser._id}`, formData);
            alert('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            showError('Failed to update profile');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0 }}>
                        {formData.role === 'ORGANIZER' ? 'Organizer Profile' : 'User Profile'}
                    </h2>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
                
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Email (Read-only)</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                            />
                        </div>

                        {formData.role === 'ORGANIZER' && (
                            <div className="form-group">
                                <label>Organization Name</label>
                                <input
                                    type="text"
                                    value={formData.organizationName}
                                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                    placeholder="e.g. Acme Events Co."
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Bio / About</label>
                            <textarea
                                rows="3"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                rows="2"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Your contact address"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                onClick={() => { setIsEditing(false); fetchProfile(); }} 
                                className="btn" 
                                style={{ flex: 1, border: '1px solid #ddd' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-details" style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', color: '#666', fontSize: '0.875rem' }}>Full Name</label>
                            <div style={{ fontSize: '1.1rem' }}>{formData.name}</div>
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', color: '#666', fontSize: '0.875rem' }}>Email</label>
                            <div>{formData.email}</div>
                        </div>
                        {formData.role === 'ORGANIZER' && (
                            <div>
                                <label style={{ fontWeight: 'bold', color: '#666', fontSize: '0.875rem' }}>Organization</label>
                                <div>{formData.organizationName || '-'}</div>
                            </div>
                        )}
                        <div>
                            <label style={{ fontWeight: 'bold', color: '#666', fontSize: '0.875rem' }}>Bio</label>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{formData.bio || '-'}</div>
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', color: '#666', fontSize: '0.875rem' }}>Address</label>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{formData.address || '-'}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
