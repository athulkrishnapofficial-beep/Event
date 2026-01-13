import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, CheckCircle, XCircle, ArrowLeft, Loader, Users } from 'lucide-react'; // Added Users icon
import QRCode from "react-qr-code";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        //const { data } = await axios.get('https://event-kqrm.onrender.com/api/bookings/my-bookings', {
        const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="w-10 h-10 animate-spin text-red-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="bg-white sticky top-0 z-10 shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="text-gray-600 hover:text-black transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Tickets</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900">No Tickets Found</h2>
            <button 
                onClick={() => navigate('/home')}
                className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition"
            >
                Book an Event
            </button>
          </div>
        ) : (
          bookings.map((booking) => {
            // --- DATE LOGIC ---
            const eventDate = new Date(booking.event?.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            eventDate.setHours(0, 0, 0, 0);
            const isExpired = eventDate < today;
            // ------------------

            // Fallback to 1 if quantity is missing in DB
            const ticketCount = booking.quantity || 1; 

            return (
              <div key={booking._id} className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col sm:flex-row border border-gray-100 relative group">
                
                {/* Event Image */}
                <div className={`sm:w-1/3 h-48 sm:h-auto relative bg-gray-200 ${isExpired ? 'grayscale' : ''}`}>
                  <img 
                    src={booking.event?.coverImage}
                    alt={booking.event?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className={`text-xl font-black line-clamp-1 ${isExpired ? 'text-gray-500' : 'text-gray-900'}`}>
                        {booking.event?.title}
                      </h2>
                      
                      {isExpired ? (
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full flex items-center border border-gray-200">
                          <XCircle className="w-3 h-3 mr-1" /> EXPIRED
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center border border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" /> VALID
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-500 mt-2">
                      <div className="flex items-center">
                        <Calendar className={`w-4 h-4 mr-2 ${isExpired ? 'text-gray-400' : 'text-red-500'}`} />
                        {booking.event?.date?.split('T')[0]}
                      </div>
                      <div className="flex items-center">
                        <MapPin className={`w-4 h-4 mr-2 ${isExpired ? 'text-gray-400' : 'text-red-500'}`} />
                        {booking.event?.location}
                      </div>

                      {/* --- TICKET COUNT DISPLAY --- */}
                      <div className="flex items-center">
                        <Ticket className={`w-4 h-4 mr-2 ${isExpired ? 'text-gray-400' : 'text-red-500'}`} />
                        <span className="font-semibold text-gray-700">
                           {ticketCount} {ticketCount > 1 ? 'Tickets' : 'Ticket'}
                        </span>
                      </div>

                      <div className="flex items-center font-mono text-xs text-gray-400 pt-2">
                          ID: {booking.paymentId?.slice(-10).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                    
                    {/* QR Code */}
                    <div className={`bg-white p-2 border border-gray-100 rounded-lg shadow-sm ${isExpired ? 'opacity-30 grayscale' : ''}`}>
                      <QRCode 
                          value={JSON.stringify({ 
                              id: booking._id, 
                              tickets: ticketCount, 
                              status: isExpired ? 'Expired' : 'Valid' 
                          })}
                          size={64}
                          fgColor="#000000"
                          bgColor="#ffffff"
                          level="Q"
                      />
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Paid</p>
                      <p className={`text-2xl font-black ${isExpired ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        ₹{booking.amount}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {isExpired ? 'Event Concluded' : 'Scan for Entry'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200 sm:hidden"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200 sm:hidden"></div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}