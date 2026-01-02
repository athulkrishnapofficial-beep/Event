import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    totalTickets: ''
  });
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = new FormData();
    if (file) data.append('image', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', Number(formData.price));
    data.append('totalTickets', Number(formData.totalTickets));

    try {
      await axios.post('http://localhost:5000/api/events', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Event created successfully! Waiting for admin approval.');
      navigate('/organizer-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Create New Event</h2>
          <p className="text-sm text-gray-500 text-center mt-1">Fill in the details to list your event</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt="Event preview"
                className="h-48 w-full object-cover rounded-lg mb-4 border"
              />
            ) : (
              <div className="text-gray-400 text-center py-10">No image selected</div>
            )}

            <label className="inline-flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!preview}
                className="sr-only"
              />
              <span className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer transition">
                Upload Event Image
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Event Title"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Ticket Price (₹)"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <textarea
            placeholder="Event Description"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Total Tickets Available"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
            required
          />

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition shadow"
            >
              Create Event
            </button>

            <button
              type="button"
              onClick={() => navigate('/organizer-dashboard')}
              className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">Your event will be reviewed by admins before going live.</p>
        </form>
      </div>
    </div>
  );
}
