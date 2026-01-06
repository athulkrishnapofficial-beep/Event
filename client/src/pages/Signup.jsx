import { useState } from 'react'; // Import useState hook to manage form state
import axios from 'axios'; // Import Axios for HTTP requests
import { useNavigate, Link } from 'react-router-dom'; // useNavigate for redirects, Link for client-side navigation

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '', // User full name
    email: '', // User email
    password: '', // User password
    role: 'user', // Default role is 'user'
  });

  const navigate = useNavigate(); // Initialize navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit (page reload)
    try {
      await axios.post('http://localhost:5000/api/users/signup', formData); // Send signup data to backend
      alert("Registration Successful!"); // Notify success
      navigate('/login'); // Redirect to login page
    } catch (err) {
      alert(err.response?.data?.message || "Error during signup"); // Show backend error or fallback text
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('poster bg login.jpg')" }} // Background image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div> {/* Semi-transparent dark overlay */}

      {/* Form Card */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-black">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h2> {/* Heading */}
        <p className="text-center text-gray-500 mb-6">Join EventEase Today</p> {/* Subtitle */}

        <form onSubmit={handleSubmit} className="space-y-4"> {/* Form with submit handler */}

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text" // Text input for name
              placeholder="Your full name"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} // Update name in state
              required // Make field mandatory
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Gmail)</label>
            <input
              type="email" // Email input
              placeholder="you@gmail.com"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update email in state
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password" // Password input
              placeholder="••••••••"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Update password in state
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">I am an:</label>
            <select
              value={formData.role} // Controlled select bound to role
              onChange={(e) => setFormData({ ...formData, role: e.target.value })} // Update role in state
              className="w-full p-2 mt-1 border rounded bg-white focus:ring-2 focus:ring-black outline-none"
            >
              <option value="user">User</option> {/* Normal attendee */}
              <option value="organizer">Organizer</option> {/* Event organizer role */}
            </select>
          </div>

          <button
            type="submit" // Submit button
            className="w-full bg-gray-600 text-white p-2 rounded-lg font-semibold hover:bg-black transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link to="/login" className="text-black font-bold hover:underline ml-1">
            Login {/* Link to login route */}
          </Link>
        </p>
      </div>
    </div>
  );
}
