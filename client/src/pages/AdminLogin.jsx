import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Key } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '', secretCode: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Check Hardcoded Secret Code (Client-side Security Layer)
    if (formData.secretCode !== '123456') {
      alert("Invalid Secret Code! Access Denied.");
      return;
    }

    // 2. Check Specific Admin Email
    if (formData.email !== 'admin@gmail.com') {
      alert("Only the Super Admin can access this page.");
      return;
    }

    try {
      // 3. Perform Standard Login to get Token
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'admin'); // Optional: store role for UI checks
        alert("Welcome, Admin.");
        navigate('/admin/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-3 rounded-full">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">Restricted Area</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input 
              type="email" name="email" placeholder="Admin Email" 
              className="w-full bg-gray-800 text-white pl-10 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleChange} required 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input 
              type="password" name="password" placeholder="Password" 
              className="w-full bg-gray-800 text-white pl-10 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              onChange={handleChange} required 
            />
          </div>

          <div className="relative">
            <Key className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
            <input 
              type="password" name="secretCode" placeholder="6-Digit Secret Code" maxLength="6"
              className="w-full bg-gray-800 text-yellow-400 pl-10 p-3 rounded-lg border border-yellow-600/30 focus:ring-2 focus:ring-yellow-500 outline-none placeholder-gray-600"
              onChange={handleChange} required 
            />
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition">
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}