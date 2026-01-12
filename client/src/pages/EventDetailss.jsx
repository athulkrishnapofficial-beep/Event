import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import axios from 'axios';
import { ArrowLeft, Calendar, MapPin, Ticket, ShieldCheck, Star } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current URL for redirecting back later
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Switch between localhost and production automatically based on env or manual toggle
        //const baseUrl = 'http://localhost:5000'; 
         const baseUrl = 'https://event-1-ie8k.onrender.com';
        
        const { data } = await axios.get(`${baseUrl}/api/events/single/${id}`);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Handle Payment / Booking Logic
  const handlePayment = async () => {
    const token = localStorage.getItem('token');

    // --- LAZY REGISTRATION CHECK ---
    if (!token) {
      // User is NOT logged in.
      // Redirect to Login, but pass "state" so we know where to come back to.
          navigate('/login', { state: { from: location.pathname } }); 
      return;
    }

    // --- IF LOGGED IN, PROCEED WITH RAZORPAY ---
    try {
      //const baseUrl = 'http://localhost:5000'; // Match your fetch URL above
       const baseUrl = 'https://event-1-ie8k.onrender.com';

      // 1. Create Order
      const orderResponse = await axios.post(
        `${baseUrl}/api/payments/order`,
        { amount: event.price, eventId: event._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderResponse.data;

      // 2. Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EventEase",
        description: `Booking for ${event.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event._id,
              amount: event.price
            };

            // 3. Verify Payment
            const verifyResponse = await axios.post(
              `${baseUrl}/api/payments/verify`,
              verifyData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              navigate('/my-bookings');
            }
          } catch (error) {
            console.error("Verification failed:", error);
            alert("Payment verification failed.");
          }
        },
        theme: { color: "#dc2626" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Could not initiate payment. Please try again.");
    }
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading Event Details...</p>
      </div>
    </div>
  );

  // Not Found State
  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800">Event Not Found</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-red-600 font-semibold underline">Go Back Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* Navbar / Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Explore
          </button>
          
          {/* Optional: Show Login button here if user is not logged in */}
          {!localStorage.getItem('token') && (
             <button 
               onClick={() => navigate('/login', { state: { from: location.pathname } })}
               className="text-sm font-bold text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50"
             >
               Login to Book
             </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={event.coverImage} 
                alt={event.title} 
                className="w-full h-125 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center shadow-lg">
                <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">4.8</span>
                <span className="text-gray-300 ml-1 text-xs">(2.4k Reviews)</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">{event.title}</h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-gray-100">
                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-2xl mr-4">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Date</p>
                    {/* Ensure you format the date properly if it's an ISO string */}
                    <p className="font-bold text-gray-800 text-sm italic">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-2xl mr-4">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Location</p>
                    <p className="font-bold text-gray-800 text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-2xl mr-4">
                    <Ticket className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Available</p>
                    <p className="font-bold text-gray-800 text-sm">{event.availableTickets} Slots</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl italic">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-4xl shadow-2xl border border-gray-50 sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-tighter">
                Filling Fast
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total Price</h3>
                <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{event.price}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-green-700 font-bold bg-green-50 p-4 rounded-2xl border border-green-100">
                  <ShieldCheck className="w-5 h-5 mr-3 shrink-0" />
                  Secure Checkout Guaranteed
                </div>
                <p className="text-[11px] text-gray-400 text-center px-4 leading-tight">
                  By clicking "Book Now" you agree to our 100% Buyer Protection Policy.
                </p>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-700 hover:shadow-2xl hover:shadow-red-200 transition-all active:scale-[0.98] uppercase tracking-wider"
              >
                Book Tickets Now
              </button>

              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center space-x-4 grayscale opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="paypal" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" className="h-3" alt="visa" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}