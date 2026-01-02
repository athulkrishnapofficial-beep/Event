import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/signup', formData);
      alert("Registration Successful!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Error during signup");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('poster bg login.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Form Card */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-black">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join EventEase Today</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Gmail)</label>
            <input
              type="email"
              placeholder="you@gmail.com"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">I am an:</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 mt-1 border rounded bg-white focus:ring-2 focus:ring-black outline-none"
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white p-2 rounded-lg font-semibold hover:bg-black transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link to="/login" className="text-black font-bold hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
