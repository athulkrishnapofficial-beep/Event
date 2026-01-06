// Importing essential libraries and hooks
import { useState } from 'react'; // For managing form input state
import axios from 'axios'; // For making API requests
import { useNavigate, Link } from 'react-router-dom'; // For navigation and internal linking

// Main Login component
export default function Login() {

  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const navigate = useNavigate(); // React Router hook for navigation

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload on form submission
    try {
      // Send POST request to backend for authentication
      const { data } = await axios.post('https://event-kqrm.onrender.com/api/users/login', {
      // const { data } = await axios.post('http://localhost:5000/api/users/login', { 
      
        email,  // User email
        password // User password
      });

      // Save token and role to localStorage for session persistence
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // Redirect user based on role after successful login
      if (data.role === 'admin') {
        navigate('/admin-panel'); // Admin goes to admin panel
      } else if (data.role === 'organizer') {
        navigate('/organizer-dashboard'); // Organizer dashboard
      } else {
        navigate('/home'); // Default: normal user → home page
      }
    } catch (err) {
      // Handle potential errors — show server message if available
      alert(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  // JSX structure for login UI
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('poster bg login.jpg')" }} // Background image for login page
    >
      {/* Semi-transparent overlay for dim background */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Login form card container */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-black">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Login</h2> {/* Title */}
          <p className="text-center text-gray-500 mb-6">Welcome back to EventEase</p> {/* Subtitle */}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gmail ID</label>
            <input 
              type="email"  // Input type: email
              placeholder="you@gmail.com" // Placeholder example
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none" // Styling
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required // Field validation
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" // Input type: password
              placeholder="••••••••" // Hidden character placeholder
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"  // Form submit action
            className="w-full bg-gray-600 text-white p-2 rounded-lg font-semibold hover:bg-black transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Signup Redirect Text */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/signup" className="text-black font-bold hover:underline ml-1">Register</Link> {/* Navigate to signup */}
        </p>
      </div>
    </div>
  );
}
