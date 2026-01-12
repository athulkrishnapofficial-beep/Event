import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import MyBookings from './pages/MyBookings';
import EventDetails from './pages/EventDetailss.jsx';
import AdminLogin from './pages/AdminLogin';
import EditEvent from './pages/EditEvent';
import Profile from './pages/Profile';
import ContactSupport from './pages/ContactSupport';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check them. If not specified, just allow the logged-in user.
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* --- PUBLIC ROUTES (Visible to everyone) --- */}
          {/* 1. Change root path to show Home instead of redirecting to Login */}
          <Route path="/" element={<Home />} /> 
          <Route path="/home" element={<Navigate to="/" replace />} /> {/* Optional: Redirect /home to / */}
          
          {/* 2. Event Details should be public so users can see what they are buying */}
          <Route path="/event/:id" element={<EventDetails />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact-support" element={<ContactSupport />} />

          {/* --- PROTECTED USER ROUTES (Login Required) --- */}
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'organizer']}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />

          {/* --- PROTECTED ORGANIZER ROUTES --- */}
          <Route 
            path="/organizer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-event/:id" 
            element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <EditEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-event" 
            element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <CreateEvent />
              </ProtectedRoute>
            } 
          />

          {/* --- PROTECTED ADMIN ROUTES --- */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<h1 className="text-center mt-10 text-2xl">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;