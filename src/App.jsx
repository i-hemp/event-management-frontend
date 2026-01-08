import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import MyEvents from './pages/MyEvents';
import VerifyTicket from './pages/VerifyTicket';
import UserDashboard from './pages/UserDashboard';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import GlobalError from './components/GlobalError';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ErrorProvider>
      <div className="app-container">
        <GlobalError />
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/create-event" element={
              <PrivateRoute roles={['ORGANIZER', 'ADMIN']}>
                <CreateEvent />
              </PrivateRoute>
            } />

            <Route path="/edit-event/:id" element={
              <PrivateRoute roles={['ORGANIZER', 'ADMIN']}>
                <EditEvent />
              </PrivateRoute>
            } />
            
            <Route path="/admin" element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/my-bookings" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/my-bookings" element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } />

          <Route path="/my-events" element={
            <PrivateRoute roles={['ORGANIZER']}>
              <MyEvents />
            </PrivateRoute>
          } />

          <Route path="/verify-ticket" element={
            <PrivateRoute roles={['ORGANIZER']}>
              <VerifyTicket />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
        </Routes>
        </div>
        <footer style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          <p>Event Management System - Student Project © 2026</p>
        </footer>
      </div>
    </ErrorProvider>
  );
}

export default App;
