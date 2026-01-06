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

// 1. Protected Route Component
// This prevents a User from typing "/admin" in the URL to bypass security
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // If the role doesn't match, send them back to login or an unauthorized page
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />

          {/* User Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Home />
              </ProtectedRoute>

            } 
          />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/event/:id" element={<EventDetails />} />

          {/* Organizer Routes */}
           
          <Route 
            path="/organizer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />

          {/* Fallback for 404 */}
          <Route path="*" element={<h1 className="text-center mt-10 text-2xl">404 - Page Not Found</h1>} />
        </Routes>
       
      </div>
    </Router>
  );
}

export default App;