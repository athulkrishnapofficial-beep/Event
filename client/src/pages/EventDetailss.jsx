import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Calendar, MapPin, Ticket, ShieldCheck, 
  Heart, Clock, Info // Removed CheckCircle as it wasn't used in valid context
} from 'lucide-react';
import { Link } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- STATE FOR INTEREST FUNCTIONALITY ---
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0);

  // Fetch Event Data & Verify Interest
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const baseUrl = 'https://event-1-ie8k.onrender.com';
        // const baseUrl = 'http://localhost:5000'; // Toggle for local testing
        
        const { data } = await axios.get(`${baseUrl}/api/events/single/${id}`);
        setEvent(data);
        
        // 1. Initialize Interest Count
        const count = data.likes ? data.likes.length : 0;
        setInterestCount(count);

        // 2. Strict User Verification Logic
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        // Verify if current user has already liked this event
        if (token && userId && data.likes && Array.isArray(data.likes)) {
          const isUserLiked = data.likes.some(likeItem => {
            // Handle if 'likeItem' is just an ID string OR a populated User object
            const idToCheck = (typeof likeItem === 'object' && likeItem !== null) 
                               ? likeItem._id 
                               : likeItem;
            
            // Convert both to String to ensure strict comparison matches
            return String(idToCheck) === String(userId);
          });
          
          setIsInterested(isUserLiked);
        } else {
          setIsInterested(false);
        }

      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // --- HANDLER: MARK AS INTERESTED ---
  const handleInterest = async () => {
    const token = localStorage.getItem('token');
    
    // 1. Auth Check
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // 2. Optimistic UI Update (Update screen instantly before API finishes)
    const previousState = isInterested;
    const previousCount = interestCount;

    setIsInterested(!previousState);
    setInterestCount(prev => previousState ? prev - 1 : prev + 1);

    try {
      const baseUrl = 'https://event-1-ie8k.onrender.com';
      // const baseUrl = 'http://localhost:5000';

      // 3. API Call
      const { data } = await axios.put(
        `${baseUrl}/api/events/interest/${event._id}`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 4. Update state with actual API response to be safe
      if (data.isLiked !== undefined) {
        setIsInterested(data.isLiked);
      }
      if (data.likeCount !== undefined) {
        setInterestCount(data.likeCount);
      }
      
    } catch (error) {
      console.error("Failed to update interest:", error);
      // Revert UI if API fails
      setIsInterested(previousState);
      setInterestCount(previousCount);
      alert("Something went wrong. Please try again.");
    }
  };

  // --- HANDLER: PAYMENT ---
  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const baseUrl = 'https://event-1-ie8k.onrender.com';
      // const baseUrl = 'http://localhost:5000';
      
      const orderResponse = await axios.post(
        `${baseUrl}/api/payments/order`,
        { amount: event.price, eventId: event._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = orderResponse.data;

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

  // Modern Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-gray-200 rounded-full"></div>
          <div className="h-16 w-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Loading Event...</p>
      </div>
    </div>
  );

  // Modern Not Found State
  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-6">The event you are looking for might have been removed.</p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-sm font-semibold text-gray-400 hidden sm:block">
            Event Details
          </div>

          {!localStorage.getItem('token') && (
             <button 
               onClick={() => navigate('/login', { state: { from: location.pathname } })}
               className="text-sm font-semibold text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition-colors"
             >
               Sign In
             </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Image Section */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video lg:aspect-[21/9] bg-gray-200 group">
              <img 
                src={event.coverImage} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              
              {/* Interest Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-1.5">
                <Heart className={`w-4 h-4 ${isInterested ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                {interestCount} Interested
              </div>
            </div>

            {/* Title & Key Details Mobile */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col gap-4 mb-8">
                <span className="inline-block w-fit px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                  Featured Event
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date</p>
                    <p className="text-gray-900 font-semibold mt-0.5">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: 'short', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Location</p>
                    <p className="text-gray-900 font-semibold mt-0.5 truncate max-w-[150px]">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Availability</p>
                    <p className="text-gray-900 font-semibold mt-0.5">
                      {event.availableTickets > 0 ? `${event.availableTickets} Seats Left` : 'Sold Out'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About this Event</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Pricing & Action */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 p-6 text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
                  <div className="relative z-10">
                    <p className="text-sm text-gray-300 font-medium uppercase tracking-widest mb-1">Total Price</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black">₹{event.price}</span>
                      <span className="text-gray-400 text-sm font-normal">/ person</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Secure payment via Razorpay</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>Instant confirmation</span>
                    </div>
                  </div>

                  <button 
                    onClick={handlePayment}
                    disabled={event.availableTickets <= 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] 
                      ${event.availableTickets > 0 
                        ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/30' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    {event.availableTickets > 0 ? 'Book Ticket Now' : 'Sold Out'}
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-4">
                    By booking, you agree to our Terms & Conditions.
                  </p>
                </div>
              </div>

              {/* Support Contact */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">Have questions?</p>
                  <p className="text-xs text-gray-500 mt-1">Contact the organizer</p>
                </div>
                <Link
                  to="/contact-support"
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Contact
                </Link>
              </div>

              {/* INTERESTED BUTTON SECTION */}
              <div className="bg-pink-50 rounded-2xl p-5 border border-pink-100 shadow-sm">
                 <div className="flex items-center justify-between mb-3">
                     <div>
                        <p className="font-bold text-gray-900 text-sm">Interested?</p>
                        <p className="text-xs text-gray-500 mt-1">Save it for later</p>
                     </div>
                     <Heart className={`w-6 h-6 ${isInterested ? "fill-pink-500 text-pink-500" : "text-gray-400"}`} />
                 </div>
                 
                 <button
                    onClick={handleInterest}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 border
                      ${isInterested 
                        ? 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700 shadow-md shadow-pink-200' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-600'
                      }`}
                 >
                    {isInterested ? (
                        <span className="flex items-center justify-center gap-2">
                             <Heart className="w-4 h-4 fill-white" /> Already Liked
                        </span>
                    ) : (
                        "Mark as Interested"
                    )}
                 </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}