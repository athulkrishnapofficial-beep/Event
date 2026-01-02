import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { 
        email, 
        password 
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      if (data.role === 'admin') {
        navigate('/admin-panel');
      } else if (data.role === 'organizer') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/home');
      }

      alert(`Welcome back, ${data.name}!`);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Check your credentials.");
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
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Login</h2>
          <p className="text-center text-gray-500 mb-6">Welcome back to EventEase</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gmail ID</label>
            <input 
              type="email" 
              placeholder="you@gmail.com"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gray-600 text-white p-2 rounded-lg font-semibold hover:bg-black transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/signup" className="text-black font-bold hover:underline ml-1">Register</Link>
        </p>
      </div>
    </div>
  );
}
