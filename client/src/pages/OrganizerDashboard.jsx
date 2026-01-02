import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrganizerDashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({ totalProfit: 0, ticketsSold: 0, remaining: 0 });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchMyData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events/my-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyEvents(data);

      const sold = data.reduce((acc, curr) => acc + (curr.totalTickets - curr.availableTickets), 0);
      const profit = data.reduce((acc, curr) => acc + ((curr.totalTickets - curr.availableTickets) * curr.price), 0);
      const remain = data.reduce((acc, curr) => acc + curr.availableTickets, 0);

      setStats({ totalProfit: profit, ticketsSold: sold, remaining: remain });
    } catch (err) {
      console.error('Dashboard Error:', err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchMyData(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your events and sales</p>
        </div>
        <button
          onClick={() => navigate('/create-event')}
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow"
        >
          + Create New Event
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <p className="text-gray-400 text-sm">Total Profit</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalProfit}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <p className="text-gray-400 text-sm">Tickets Sold</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.ticketsSold}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <p className="text-gray-400 text-sm">Remaining Tickets</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.remaining}</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Event</th>
              <th className="p-4">Price</th>
              <th className="p-4">Sold</th>
              <th className="p-4">Available</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {myEvents.map(event => (
              <tr key={event._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{event.title}</td>
                <td className="p-4 text-gray-700">₹{event.price}</td>
                <td className="p-4 text-gray-700">{event.totalTickets - event.availableTickets}</td>
                <td className="p-4 text-gray-700">{event.availableTickets}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {event.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/edit-event/${event._id}`)}
                    className="text-black font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
