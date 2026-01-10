// Import dependencies
import { useEffect, useState } from 'react'; // React hooks for state and side-effects
import { useParams, useNavigate } from 'react-router-dom'; // Router hooks for navigation and route params
import axios from 'axios'; // HTTP client
import { ArrowLeft, Calendar, MapPin, Ticket, ShieldCheck, Star } from 'lucide-react'; // Lucide React icons

// Component definition
export default function EventDetails() {
  const { id } = useParams(); // Extract event ID from URL
  const navigate = useNavigate(); // For navigation
  const [event, setEvent] = useState(null); // State to hold fetched event
  const [loading, setLoading] = useState(true); // Loading state while fetching data

  // Fetch single event details when component loads
  useEffect(() => {
    const fetchEvent = async () => {
      try {
       // const { data } = await axios.get(`http://localhost:5000/api/events/single/${id}`); // Fetch event by ID
        const { data } = await axios.get(`https://event-kqrm.onrender.com/api/events/single/${id}`); // Fetch event by ID
        setEvent(data); // Store event in state
      } catch (err) {
        console.error("Error fetching event:", err); // Log error if failed
      } finally {
        setLoading(false); // Stop loading spinner after fetching or error
      }
    };
    fetchEvent(); // Trigger fetch
  }, [id]); // Dependency on 'id' ensures re-fetch when URL changes

  // Function to handle Razorpay payment process
  const handlePayment = async () => {
    const token = localStorage.getItem('token'); // Get auth token from localStorage
    if (!token) {
        alert("Please log in to book tickets"); // Ask user to log in if not authorized
        navigate('/login'); // Redirect to login
        return; // Stop execution
    }

    try {
        // Step 1: Create an order in backend
        const orderResponse = await axios.post(
            //'http://localhost:5000/api/payments/order', // API endpoint for Razorpay order creation
            'https://event-kqrm.onrender.com/api/payments/order',
            { amount: event.price, eventId: event._id }, // Send amount and event ID
            { headers: { Authorization: `Bearer ${token}` } } // Authorization header
        );

        const order = orderResponse.data; // Extract order from response
        console.log("1. Order ID from Backend:", order.id); // Debug order id
        console.log("2. Key used in Frontend:", import.meta.env.VITE_RAZORPAY_KEY_ID); // Debug Razorpay key
        console.log("3. Amount:", order.amount); // Debug amount

        // Razorpay modal options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Public key from .env
            amount: order.amount, // Payment amount
            currency: order.currency, // Currency type
            name: "EventEase", // Merchant name
            description: `Booking for ${event.title}`, // Description
            order_id: order.id, // Order ID from backend

            // Step 2: Handler for successful payment
            handler: async (response) => {
                try {
                    const verifyData = { // Prepare verification data
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        eventId: event._id,
                        amount: event.price
                    };

                    // Step 3: Verify payment from backend
                    const verifyResponse = await axios.post(
                        //'http://localhost:5000/api/payments/verify',
                        'https://event-kqrm.onrender.com/api/payments/verify',
                        verifyData,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    // If backend confirms success
                    if (verifyResponse.data.success) {
                        alert("Payment Successful!"); // Success feedback
                        navigate('/my-bookings'); // Redirect to bookings page
                    }
                } catch (error) {
                    console.error("Verification failed:", error);
                    alert("Payment verification failed."); // If verification failed
                }
            },
            theme: { color: "#dc2626" }, // Razorpay modal color theme
        };

        const rzp = new window.Razorpay(options); // Initialize Razorpay object
        rzp.open(); // Open Razorpay modal popup

    } catch (error) {
        console.error("Payment Error:", error); // Log payment errors
        alert("Could not initiate payment."); // Inform user about problems
    }
  };

  // Loading skeleton while fetching event data
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div> {/* Spinner */}
        <p className="mt-4 text-gray-500 font-medium">Loading Event Details...</p>
      </div>
    </div>
  );

  // If no event found
  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800">Event Not Found</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-red-600 font-semibold underline">Go Back Home</button>
    </div>
  );

  // Main Event Details UI
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* Back Button Navigation */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <button 
            onClick={() => navigate('/home')} // Navigate back to home
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> {/* Back icon */}
            Back to Explore
          </button>
        </div>
      </div>

      {/* Event Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: Image + Event Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event cover image with rating */}
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={event.coverImage} // Show cover image
                alt={event.title} // Alt text
                className="w-full h-125 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl flex items-center shadow-lg">
                <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" /> {/* Star icon */}
                <span className="font-bold">4.8</span> {/* Hardcoded review value */}
                <span className="text-gray-300 ml-1 text-xs">(2.4k Reviews)</span>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">{event.title}</h1> {/* Title */}

              {/* Date, Location, Tickets info grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-gray-100">
                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-2xl mr-4">
                    <Calendar className="w-6 h-6 text-red-600" /> {/* Calendar icon */}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Date</p>
                    <p className="font-bold text-gray-800 text-sm italic">Sat, 24 Jan 2026</p> {/* Example date */}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-2xl mr-4">
                    <MapPin className="w-6 h-6 text-red-600" /> {/* Location icon */}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Location</p>
                    <p className="font-bold text-gray-800 text-sm">Thiruvananthapuram</p> {/* Static city */}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-2xl mr-4">
                    <Ticket className="w-6 h-6 text-red-600" /> {/* Ticket icon */}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Available</p>
                    <p className="font-bold text-gray-800 text-sm">{event.availableTickets} Slots</p> {/* Available tickets */}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl italic">
                  {event.description} {/* Event description */}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: Booking & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-4xl shadow-2xl border border-gray-50 sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-tighter">
                Filling Fast {/* Label tag */}
              </div>

              {/* Price Display */}
              <div className="flex justify-between items-baseline mb-8">
                <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total Price</h3>
                <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{event.price}</span> {/* Ticket price */}
              </div>

              {/* Payment Security Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-green-700 font-bold bg-green-50 p-4 rounded-2xl border border-green-100">
                  <ShieldCheck className="w-5 h-5 mr-3 shrink-0" /> {/* Shield icon */}
                  Secure Checkout Guaranteed
                </div>
                <p className="text-[11px] text-gray-400 text-center px-4 leading-tight">
                  By clicking "Book Now" you agree to our 100% Buyer Protection Policy.
                </p>
              </div>

              {/* Book Now Button */}
              <button 
                onClick={handlePayment} // Starts Razorpay payment
                className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-700 hover:shadow-2xl hover:shadow-red-200 transition-all active:scale-[0.98] uppercase tracking-wider"
              >
                Book Tickets Now
              </button>

              {/* Logos of supported payment methods */}
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center space-x-4 grayscale opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="paypal" /> {/* PayPal */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" /> {/* Mastercard */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" className="h-3" alt="visa" /> {/* Visa */}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
