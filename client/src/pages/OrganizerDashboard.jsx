import { useEffect, useState } from 'react'; // React hooks for state and lifecycle
import axios from 'axios'; // HTTP client for API requests
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import { Loader, TrendingUp, Users, Ticket, Edit, Plus, ScanLine } from 'lucide-react'; // Added ScanLine icon
import API_URL from '../config/api';

export default function OrganizerDashboard() {
  const [myEvents, setMyEvents] = useState([]); // Stores all events created by this organizer
  const [stats, setStats] = useState({ totalProfit: 0, ticketsSold: 0, remaining: 0 }); // Aggregated statistics
  const [loading, setLoading] = useState(true); // Loading indicator
  const token = localStorage.getItem('token'); // JWT token for authenticated requests
  const navigate = useNavigate(); // Navigation hook

  const fetchMyData = async () => {
    if (!token) { // If no token, user is not logged in
        navigate('/login'); // Redirect to login page
        return; // Stop execution
    }

    try {
      const { data } = await axios.get(`${API_URL}/api/events/my-events`, {
        headers: { Authorization: `Bearer ${token}` } // Include Authorization header
      });
      setMyEvents(data); // Save events to state

      // --- CALCULATE STATS ---
      // Use reduce to accumulate totals across all events
      const calculatedStats = data.reduce((acc, event) => {
        // Safely convert values to numbers to avoid NaN
        const price = Number(event.price) || 0;
        
        // Use totalTickets if present, otherwise fallback to availableTickets
        const total = Number(event.totalTickets) || Number(event.availableTickets) || 0;
        const available = Number(event.availableTickets) || 0;

        // Math Logic
        const soldCount = total - available; // Total sold = total tickets - remaining
        const profit = soldCount * price;    // Revenue = sold tickets * price

        return {
          totalProfit: acc.totalProfit + profit, // Add to total revenue
          ticketsSold: acc.ticketsSold + soldCount, // Add to tickets sold count
          remaining: acc.remaining + available // Add to remaining tickets
        };
      }, { totalProfit: 0, ticketsSold: 0, remaining: 0 }); // Initial accumulator

      setStats(calculatedStats); // Store final aggregated stats
    } catch (err) {
      console.error('Dashboard Error:', err.response?.data || err.message); // Log API or network error
    } finally {
        setLoading(false); // Disable loading state
    }
  };

  useEffect(() => { fetchMyData(); }, []); // Fetch dashboard data on component mount

  // Show spinner while loading data
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-gray-500" /> {/* Loading icon */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Organizer Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your sales, profit, and event performance.</p>
        </div>
        
        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
            {/* SCANNER BUTTON */}
            <button
              onClick={() => navigate('/scanner')} 
              className="flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition shadow-sm active:scale-95"
            >
              <ScanLine className="w-5 h-5" /> Scan Tickets
            </button>

            {/* CREATE EVENT BUTTON */}
            <button
              onClick={() => navigate('/create-event')} // Navigate to create event page
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg active:scale-95"
            >
              <Plus className="w-5 h-5" /> Create Event 
            </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
        {/* Card 1: Profit */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-green-50 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-green-600" /> {/* Revenue icon */}
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-black text-gray-900 mt-1">₹{stats.totalProfit.toLocaleString()}</p> {/* Formatted total profit */}
          </div>
        </div>

        {/* Card 2: Sold */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <Users className="w-8 h-8 text-blue-600" /> {/* Tickets sold icon */}
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Tickets Sold</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stats.ticketsSold}</p> {/* Total tickets sold */}
          </div>
        </div>

        {/* Card 3: Remaining */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-orange-50 rounded-2xl">
            <Ticket className="w-8 h-8 text-orange-600" /> {/* Remaining tickets icon */}
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Available</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{stats.remaining}</p> {/* Remaining tickets */}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Your Events</h2>
        </div>
        <div className="overflow-x-auto"> {/* Enable horizontal scroll on small screens */}
            <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                <th className="p-5">Event Name</th>
                <th className="p-5">Price</th>
                <th className="p-5">Sold / Total</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {myEvents.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="p-10 text-center text-gray-400 font-medium">
                            No events found. Start by creating one! {/* Empty state */}
                        </td>
                    </tr>
                ) : (
                    myEvents.map(event => {
                        const total = Number(event.totalTickets) || Number(event.availableTickets) || 0; // Total tickets
                        const available = Number(event.availableTickets) || 0; // Remaining tickets
                        const sold = total - available; // Tickets sold

                        return (
                            <tr key={event._id} className="hover:bg-gray-50 transition group">
                                <td className="p-5">
                                    <div className="font-bold text-gray-900">{event.title}</div> {/* Event title */}
                                    <div className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString()}</div> {/* Event date */}
                                </td>
                                <td className="p-5 font-medium text-gray-700">₹{event.price}</td> {/* Ticket price */}
                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-black rounded-full" 
                                                style={{ width: `${(sold / total) * 100}%` }} // Progress bar width
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">{sold} / {total}</span> {/* Sold vs total */}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                        event.isApproved 
                                        ? 'bg-green-100 text-green-700'  // Live event
                                        : 'bg-yellow-100 text-yellow-700' // Pending approval
                                    }`}>
                                    {event.isApproved ? 'Live' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <button
                                    onClick={() => navigate(`/edit-event/${event._id}`)} // Navigate to edit event page
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition"
                                    title="Edit Event"
                                    >
                                    <Edit className="w-4 h-4" /> 
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}