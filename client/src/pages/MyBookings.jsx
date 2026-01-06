import { useEffect, useState } from 'react'; // React hooks for state and side effects
import axios from 'axios'; // For making HTTP requests to the backend
import { useNavigate } from 'react-router-dom'; // For redirecting users programmatically
import { Ticket, Calendar, MapPin, CheckCircle, ArrowLeft, Loader } from 'lucide-react'; // Icon components

// 1. Import the QR Code component
import QRCode from "react-qr-code"; // QRCode component from react-qr-code package

export default function MyBookings() {
  const [bookings, setBookings] = useState([]); // Stores the list of user bookings
  const [loading, setLoading] = useState(true); // Indicates if data is still being loaded
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token'); // Get JWT token from local storage
      if (!token) {
        navigate('/login'); // If not logged in, redirect to login page
        return; // Stop further execution
      }
      try {
        const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` } // Attach auth header with token
        });
        setBookings(data); // Save bookings in state
      } catch (err) {
        console.error("Error fetching bookings:", err); // Log any error that occurs
      } finally {
        setLoading(false); // Turn off loading state whether success or failure
      }
    };
    fetchBookings(); // Call the async function immediately
  }, [navigate]); // Re-run if navigate reference changes (usually stable)

  // Show a loading spinner while bookings are being fetched
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="w-10 h-10 animate-spin text-red-600" /> {/* Spinning loader icon */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans"> {/* Page background and base layout */}
      <div className="bg-white sticky top-0 z-10 shadow-sm border-b"> {/* Header bar */}
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="text-gray-600 hover:text-black transition">
            <ArrowLeft className="w-6 h-6" /> {/* Back icon */}
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Tickets</h1> {/* Page title */}
          <div className="w-6"></div> {/* Spacer to balance flex layout */}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6"> {/* Main content container */}
        {bookings.length === 0 ? ( // If no bookings available
          <div className="text-center py-20">
            <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" /> {/* Ticket icon */}
            <h2 className="text-xl font-bold text-gray-900">No Tickets Found</h2>
            <button 
                onClick={() => navigate('/home')} // Redirect user to explore events
                className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition"
            >
                Book an Event
            </button>
          </div>
        ) : (
          bookings.map((booking) => ( // Loop through each booking
            <div key={booking._id} className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col sm:flex-row border border-gray-100 relative group">
              
              {/* Event Image */}
              <div className="sm:w-1/3 h-48 sm:h-auto relative bg-gray-200">
                <img 
                  src={`http://localhost:5000${booking.event?.coverImage}`} // Event cover image from API
                  alt={booking.event?.title} // Alt text for accessibility
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Ticket Details */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-black text-gray-900 line-clamp-1">{booking.event?.title}</h2> {/* Event title */}
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> VALID {/* Status tag */}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-500 mt-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-red-500" /> {/* Calendar icon */}
                      Sat, 24 Jan 2026 {/* Hardcoded date text */}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" /> {/* Location icon */}
                      Veeranakavu, Trivandrum {/* Hardcoded location text */}
                    </div>
                    <div className="flex items-center font-mono text-xs text-gray-400">
                       ID: {booking.paymentId?.slice(-10).toUpperCase()} {/* Shortened payment ID */}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                  
                  {/* REAL QR Code Section */}
                  <div className="bg-white p-2 border border-gray-100 rounded-lg shadow-sm">
                    <QRCode 
                        value={booking._id} // Unique booking ID used for QR scanning
                        size={64} // Size of the QR
                        fgColor="#000000" // Foreground (QR code color)
                        bgColor="#ffffff" // Background color
                        level="Q"  // Error correction level
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Entry Pass</p>
                    <p className="text-2xl font-black text-gray-900">₹{booking.amount}</p> {/* Booking amount */}
                    <p className="text-[10px] text-gray-400 mt-1">Scan at venue</p> {/* Scan instruction */}
                  </div>
                </div>
              </div>

              {/* Aesthetic Cutouts (Ticket Holes) for mobile view */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200 sm:hidden"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200 sm:hidden"></div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
