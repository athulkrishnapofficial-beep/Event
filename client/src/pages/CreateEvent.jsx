// Importing required dependencies
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

// Component Definition
export default function CreateEvent() {
  const navigate = useNavigate(); 
  
  // Get today's date in YYYY-MM-DD format to prevent past dates
  const today = new Date().toISOString().split('T')[0];

  // Form data state initialization
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    availableTickets: '',
    category: 'Events', 
    coverImage: null
  });

  // Updates form fields dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles file input with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // strict check: if the file is not an image, reset the input
      if (!file.type.startsWith('image/')) {
        console.error('Only image files are allowed!');
        e.target.value = ''; // Clear the input
        return;
      }
      setFormData({ ...formData, coverImage: file });
    }
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const data = new FormData(); 

    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem('token'); 
      await axios.post(`${API_URL}/api/events`, data, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
      });
      navigate('/organizer-dashboard'); 
    } catch (err) {
      console.error('Error creating event:', err); 
    }
  };

  // JSX for the component UI
  return (
    <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        <h1 className="text-3xl font-black text-gray-800 mb-6 text-center">Host an Event</h1>
        
        {/* Form starts here */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Event Title Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label>
            <input type="text" name="title" onChange={handleChange} required 
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none transition" placeholder="e.g. Summer Music Fest" />
          </div>

          {/* Category Dropdown Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
            <div className="relative">
                <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none appearance-none bg-white cursor-pointer"
                >
                    <option value="Events">General Event</option>
                    <option value="Plays">Theater / Play</option>
                    <option value="Sports">Sports Match</option>
                    <option value="Activities">Activity / Workshop</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>

          {/* Date and Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                {/* min={today} restricts selection to today or future dates */}
                <input 
                  type="date" 
                  name="date" 
                  min={today} 
                  onChange={handleChange} 
                  required 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none" 
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                <input type="time" name="time" onChange={handleChange} required 
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none" />
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
            <input type="text" name="location" onChange={handleChange} required 
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none" placeholder="City or Venue" />
          </div>

          {/* Price and Ticket Count Fields */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                <input type="number" name="price" onChange={handleChange} required 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none" placeholder="0" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tickets</label>
                <input type="number" name="availableTickets" onChange={handleChange} required 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none" placeholder="100" />
             </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea name="description" rows="3" onChange={handleChange} required 
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-black outline-none" placeholder="Tell people what it's about..."></textarea>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label>
            {/* accept="image/*" restricts file dialog to only images */}
            <input 
              type="file" 
              name="coverImage" 
              accept="image/*" 
              onChange={handleFileChange} 
              required 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg active:scale-95">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}     