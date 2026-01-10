// Import dependencies
import { useEffect, useState } from 'react'; // React hooks for state and lifecycle
import axios from 'axios'; // HTTP client for API requests
import { Link, useNavigate } from 'react-router-dom'; // Router hooks and navigation link
import { Ticket, Search } from 'lucide-react'; // Icons from lucide library


// Skeleton loader while fetching data
function EventCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3"> {/* Pulsing animation */}
      <div className="aspect-2/3 rounded-xl bg-linear-to-br from-gray-300 to-gray-200" /> {/* Dummy image */}
      <div className="h-4 bg-gray-300 rounded w-4/5" /> {/* Dummy title */}
      <div className="h-3 bg-gray-200 rounded w-full" /> {/* Dummy description */}
      <div className="h-4 bg-gray-300 rounded w-1/3" /> {/* Dummy footer */}
    </div>
  );
}


// Component displayed when no events match filters
function NoEventsState({ resetFilters }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6">
        <span className="text-4xl">🎭</span> {/* Mask emoji icon */}
      </div>
      <h3 className="text-xl font-bold text-gray-800">
        No events found {/* Message */}
      </h3>
      <p className="text-gray-500 mt-2 max-w-md">
        We couldn't find any events matching your search or category.
      </p>
      <button
        onClick={resetFilters} // Resets search and filters
        className="mt-6 bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
      >
        Clear Filters
      </button>
    </div>
  );
}


// Main Home page component
export default function Home() {
  const [events, setEvents] = useState([]); // All fetched events
  const [filteredEvents, setFilteredEvents] = useState([]); // Events after filters are applied
  const [loading, setLoading] = useState(true); // Loading state
  
  // Filters
  const [searchQuery, setSearchQuery] = useState(""); // Search input text
  const [selectedCategory, setSelectedCategory] = useState("All"); // Active category filter

  const navigate = useNavigate(); // React Router navigation function

  // Fetch approved events when the page loads
  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        //const { data } = await axios.get('http://localhost:5000/api/events'); 
        const { data } = await axios.get('https://event-kqrm.onrender.com/api/events'); // Fetch all events
        
        const approved = data.filter(event => event.isApproved === true); // Only include approved events
        setEvents(approved); // Set to state
        setFilteredEvents(approved); // Also display initially
      } catch (err) {
        console.error('Error fetching events:', err); // Log fetch error
      } finally {
        setLoading(false); // Turn off loading animation
      }
    };
    fetchApprovedEvents(); // Call fetch on component mount
  }, []); // Empty dependency means only once on mount

  // Filtering Logic — reruns whenever search or category changes
  useEffect(() => {
    let result = events; // Start with all events

    // Apply Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase(); // Convert search to lowercase
      result = result.filter(event => 
        event.title.toLowerCase().includes(lowerQuery) || // Match title
        event.description.toLowerCase().includes(lowerQuery) // Match description
      );
    }

    // Apply Category filter
    if (selectedCategory !== "All") {
      result = result.filter(event => 
        event.category && event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredEvents(result); // Update filtered events
  }, [searchQuery, selectedCategory, events]); // Run when filters or event list change

  const categories = ["All", "Events", "Plays", "Sports", "Activities"]; // Category navigation

  // Main JSX structure
  return (
    <div className="bg-gray-100 min-h-screen font-sans"> {/* Page background */}
      
      {/* HEADER BAR */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* LEFT SECTION: Logo and Search */}
          <div className="flex items-center space-x-8 flex-1">
            <h1 
              className="text-2xl font-extrabold italic text-black cursor-pointer" 
              onClick={() => {
                setSearchQuery(""); // Clear search
                setSelectedCategory("All"); // Reset category
              }}
            >
              EventEase {/* Logo text */}
            </h1>
            
            {/* Search Bar (visible on medium + screens) */}
            <div className="relative hidden md:block w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> {/* Search icon */}
                <input
                  type="text"
                  placeholder="Search events, shows, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update state on typing
                  className="w-full border rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none bg-gray-50 hover:bg-white transition-colors"
                />
            </div>
          </div>

          {/* RIGHT SECTION: My Bookings button */}
          <div className="flex items-center space-x-4">
            <button 
                onClick={() => navigate('/my-bookings')} // Go to bookings page
                className="flex items-center space-x-2 bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition active:scale-95 shadow-lg shadow-gray-200"
            >
                <Ticket className="w-4 h-4" /> {/* Ticket icon */}
                <span>My Bookings</span>
            </button>
          </div>
        </div>

        {/* CATEGORY NAV BAR */}
        <div className="bg-linear-to-r from-[#2b3178] to-[#1f2437] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-8 py-3 text-sm font-medium overflow-x-auto no-scrollbar">
              {categories.map((item) => ( // Map through category list
                <button
                  key={item}
                  onClick={() => setSelectedCategory(item)} // Set selected category
                  className={`relative cursor-pointer transition-all duration-200 whitespace-nowrap
                    ${selectedCategory === item ? 'text-white scale-105 font-bold' : 'text-white/60 hover:text-white'}
                  `}
                >
                  {item} {/* Category label text */}
                  {selectedCategory === item && (
                    <span className="absolute left-0 -bottom-3 w-full  bg-red-500 rounded-t-full"></span> // Highlight line 
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* HERO POSTER - Only visible if user is not searching */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto my-6 px-4 animate-fadeIn">
          <div className="relative h-48 md:h-80 rounded-2xl overflow-hidden shadow-2xl group">
            <img
              src="/poster bg login.jpg" // Hero background image
              alt="Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent" /> {/* Dark overlay left */}
            <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 text-white max-w-lg">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Relive the Best<br />Events of <span className="text-red-500">2026</span>
              </h2>
              <p className="mt-4 text-sm md:text-base text-gray-300 font-medium">
                Concerts • Sports • Live Shows • Experiences
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT - Event Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
              <h2 className="text-2xl font-black text-gray-800">
                {searchQuery 
                  ? `Search Results for "${searchQuery}"` // Show search header
                  : (selectedCategory === 'All' ? 'Recommended Events' : selectedCategory)} {/* Default header */}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Found {filteredEvents.length} results {/* Display total matches */}
              </p>
          </div>
        </div>

        {/* Event cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? ( // Show skeleton while loading
            Array.from({ length: 10 }).map((_, i) => (
              <EventCardSkeleton key={i} /> // 10 placeholders
            ))
          ) : filteredEvents.length === 0 ? ( // If no events after filtering
            <NoEventsState resetFilters={() => {setSearchQuery(""); setSelectedCategory("All");}} /> // Show empty state
          ) : (
            filteredEvents.map(event => ( // Loop through filtered events
              <div
                key={event._id}
                className="group cursor-pointer transition transform hover:-translate-y-2 hover:shadow-xl rounded-xl duration-300"
              >
                <Link to={`/event/${event._id}`}> {/* Link to event details */}
                <div className="relative aspect-2/3 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={event.coverImage} // Event cover image
                    alt={event.title}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" /> {/* Overlay */}

                  {/* Category Tag */}
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {event.category || "Event"} {/* Show event category */}
                  </div>
                </div>

                {/* Event Info */}
                <div className="mt-4 space-y-1 px-1">
                  <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-red-600 transition-colors">
                    {event.title} {/* Event title */}
                  </h3>
                  <p className="text-gray-500 text-xs truncate font-medium">
                    {event.description} {/* Short description */}
                  </p>
                  
                  {/* Price and Buy button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-gray-900 font-black text-lg">
                      ₹{event.price} {/* Price */}
                    </p>
                    <button className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full group-hover:bg-red-600 group-hover:text-white transition-all">
                        BUY {/* CTA button */}
                    </button>
                  </div>
                </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
