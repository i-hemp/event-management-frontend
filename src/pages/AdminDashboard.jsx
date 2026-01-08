import React, { useState, useEffect } from 'react';
import api from '../api';
import { useError } from '../context/ErrorContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');
  const [editingUser, setEditingUser] = useState(null);
  const { showError } = useError();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, bookingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/bookings/all')
      ]);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error(error);
      showError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
       showError('Failed to delete user');
    }
  };

  const handleUpdateUser = async (e) => {
      e.preventDefault();
      try {
          const { data } = await api.put(`/users/${editingUser._id}`, {
              name: editingUser.name,
              role: editingUser.role
          });
          setUsers(users.map(u => u._id === editingUser._id ? data.user : u));
          setEditingUser(null);
          alert('User updated successfully');
      } catch (error) {
          showError('Failed to update user');
      }
  };

  // User Pagination Logic
  const filteredUsers = filterRole === 'ALL' 
    ? users 
    : users.filter(u => u.role === filterRole);
  
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE, 
      currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole]);

    // Booking Pagination
    const [bookingPage, setBookingPage] = useState(1);
    const totalBookingPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
    const paginatedBookings = bookings.slice(
        (bookingPage - 1) * ITEMS_PER_PAGE,
        bookingPage * ITEMS_PER_PAGE
    );

    if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard</h2>
        
        {/* Booking History Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                 <h3 style={{ fontSize: '1.5rem', margin: 0 }}>🎫 Booking History</h3>
                 <span style={{ fontSize: '0.875rem', color: '#666' }}>Showing {paginatedBookings.length} of {bookings.length}</span>
            </div>
            
            <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '0.75rem' }}>Ticket ID</th>
                            <th style={{ padding: '0.75rem' }}>Event Name</th>
                            <th style={{ padding: '0.75rem' }}>User Name</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBookings.map(booking => (
                            <tr key={booking._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{booking.ticketId}</td>
                                <td style={{ padding: '0.75rem' }}>{booking.eventName}</td>
                                <td style={{ padding: '0.75rem' }}>{booking.userName || booking.name}</td>
                                <td style={{ padding: '0.75rem' }}>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem', 
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: booking.status === 'CANCELLED' ? '#fee2e2' : '#dcfce7',
                                        color: booking.status === 'CANCELLED' ? '#991b1b' : '#166534'
                                    }}>
                                        {booking.status || 'BOOKED'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {paginatedBookings.length === 0 && (
                            <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No bookings found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Booking Pagination Controls */}
            {totalBookingPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                        onClick={() => setBookingPage(p => Math.max(1, p - 1))}
                        disabled={bookingPage === 1}
                        className="btn"
                        style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', cursor: bookingPage === 1 ? 'not-allowed' : 'pointer', opacity: bookingPage === 1 ? 0.5 : 1 }}
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        Page {bookingPage} of {totalBookingPages}
                    </span>
                    <button 
                        onClick={() => setBookingPage(p => Math.min(totalBookingPages, p + 1))}
                        disabled={bookingPage === totalBookingPages}
                        className="btn"
                        style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', cursor: bookingPage === totalBookingPages ? 'not-allowed' : 'pointer', opacity: bookingPage === totalBookingPages ? 0.5 : 1 }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>

        {/* User Management Section */}
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>👥 User Management</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#666' }}>
                        Showing {paginatedUsers.length} of {filteredUsers.length}
                    </span>
                    <select 
                        value={filterRole} 
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="ALL">All Users</option>
                        <option value="USER">Users</option>
                        <option value="ORGANIZER">Organizers</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>
            
            <div style={{ overflowX: 'auto', minHeight: '300px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Role</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem' }}>{user.name}</td>
                                <td style={{ padding: '0.75rem' }}>{user.email}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.5rem', 
                                        borderRadius: '9999px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 'bold',
                                        backgroundColor: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'ORGANIZER' ? '#fef3c7' : '#e0e7ff',
                                        color: user.role === 'ADMIN' ? '#991b1b' : user.role === 'ORGANIZER' ? '#92400e' : '#3730a3'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button 
                                        onClick={() => setEditingUser(user)}
                                        style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', marginRight: '1rem' }}
                                    >
                                        Edit
                                    </button>
                                    {user.role !== 'ADMIN' && (
                                        <button 
                                            onClick={() => handleDeleteUser(user._id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {paginatedUsers.length === 0 && (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No users found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn"
                        style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn"
                        style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>

        {/* Edit User Modal */}
        {editingUser && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-btn" onClick={() => setEditingUser(null)}>&times;</button>
                    <h3 style={{ marginBottom: '1.5rem' }}>Edit User</h3>
                    <form onSubmit={handleUpdateUser}>
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                value={editingUser.name} 
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email (Read-only)</label>
                            <input 
                                type="email" 
                                value={editingUser.email} 
                                disabled
                                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select 
                                value={editingUser.role} 
                                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                            >
                                <option value="USER">User</option>
                                <option value="ORGANIZER">Organizer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                            <button type="button" onClick={() => setEditingUser(null)} className="btn" style={{ flex: 1, border: '1px solid #ddd' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;
