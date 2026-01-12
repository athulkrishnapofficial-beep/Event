// Import dependencies
import { useEffect, useState } from 'react'; // React hooks
import axios from 'axios'; // HTTP client
import { Link, useNavigate } from 'react-router-dom'; // Router hooks
import { Ticket, Search, LogOut, User, Sparkles } from 'lucide-react'; // Icons

// Skeleton loader
function EventCardSkeleton() {
  return (
    <div className="space-y-3 p-3 md:p-4 rounded-3xl bg-white shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="aspect-4/5 w-full rounded-2xl bg-linear-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      <div className="space-y-2 mt-4 flex-1">
        <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded-full w-full animate-pulse" />
      </div>
    </div>
  );
}

// No Events State
function NoEventsState({ resetFilters }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-24 text-center px-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 border border-gray-100">
          <span className="text-4xl md:text-6xl transform group-hover:scale-110 transition-transform duration-300">🎭</span>
        </div>
      </div>
      <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">No events found</h3>
      <p className="text-gray-500 mt-3 max-w-md text-base md:text-lg">
        We couldn't find any events matching your search.
      </p>
      <button
        onClick={resetFilters}
        className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black hover:shadow-lg hover:shadow-gray-400/30 transform hover:-translate-y-1 transition-all duration-300 w-full md:w-auto"
      >
        Clear Filters
      </button>
    </div>
  );
}

// Main Home Component
export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
   
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  // 1. Check Login Status on Mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, []);

  // 2. Fetch Events
  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        //const { data } = await axios.get('http://localhost:5000/api/events'); 
         const { data } = await axios.get('https://event-kqrm.onrender.com/api/events');
        
        const approved = data.filter(event => event.isApproved === true);
        setEvents(approved);
        setFilteredEvents(approved);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedEvents();
  }, []);

  // 3. Filter Logic
  useEffect(() => {
    let result = events;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(lowerQuery) || 
        event.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(event => 
        event.category && event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredEvents(result);
  }, [searchQuery, selectedCategory, events]);

  // 4. Handle Logout Function
  const handleLogout = () => {
      localStorage.removeItem('token'); 
      localStorage.removeItem('role'); 
      setIsLoggedIn(false); 
  };

  const categories = ["All", "Events", "Plays", "Sports", "Activities"];

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-rose-500 selection:text-white pb-20 md:pb-0">
       
      {/* HEADER BAR */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <h1 
              className="text-2xl md:text-3xl font-black italic tracking-tighter cursor-pointer bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 shrink-0" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              EventEase<span className="text-rose-500 not-italic">.</span>
            </h1>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 md:space-x-5 shrink-0">
              {isLoggedIn ? (
                <>
                  {/* === NEW PROFILE BUTTON === */}
                  <button 
                      onClick={() => navigate('/profile')} 
                      className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-all active:scale-95 shadow-xs"
                      title="Profile"
                  >
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  <button 
                      onClick={() => navigate('/my-bookings')} 
                      className="flex items-center space-x-2 bg-gray-900 text-white px-3 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-[10px] md:text-sm hover:bg-black transition-all shadow-lg shadow-gray-200"
                  >
                      <Ticket className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">My Bookings</span>
                  </button>

                  <button 
                      onClick={handleLogout}
                      className="p-2 md:px-4 md:py-2 text-gray-500 hover:text-rose-600 transition-colors"
                  >
                      <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button 
                    onClick={() => navigate('/login')} 
                    className="relative overflow-hidden group flex items-center space-x-2 bg-linear-to-r from-rose-600 to-pink-600 text-white px-4 py-2 md:px-8 md:py-2.5 rounded-full font-bold hover:shadow-xl transition-all active:scale-95 text-xs md:text-sm"
                >
                    <User className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Login</span>
                </button>
              )}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-4 md:mt-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-96 group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-full pl-10 pr-6 py-2.5 md:py-3 text-sm font-medium bg-gray-50 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all duration-300 shadow-inner"
              />
            </div>
          </div>

        </div>

        {/* CATEGORY NAV BAR */}
        <div className="bg-[#1a1f36] border-t border-white/5 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <nav className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar mask-gradient-right">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedCategory(item)}
                  className={`
                    relative px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap snap-center
                    ${selectedCategory === item 
                      ? 'bg-white text-black shadow-lg shadow-white/10 scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {item}
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
                Relive the Best<br />Events of <span className="text-yellow-200">2026</span>
              </h2>
              <p className="mt-4 text-sm md:text-base text-gray-300 font-medium">
                Concerts • Sports • Live Shows • Experiences
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-10 pb-4 border-b border-gray-200 gap-4">
          <div>
              <h2 className="text-2xl md:text-3xxl font-black text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                {searchQuery 
                  ? `Search: "${searchQuery}"`
                  : (selectedCategory === 'All' ? <> Recommended</> : selectedCategory)}
              </h2>
          </div>
        </div>

        {/* GRID: 
            - grid-cols-2 (Mobile) 
            - md:grid-cols-3 (Tablet) 
            - lg:grid-cols-4 (Desktop) 
            - xl:grid-cols-5 (Wide)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 lg:gap-8">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          ) : filteredEvents.length === 0 ? (
            <NoEventsState resetFilters={() => {setSearchQuery(""); setSelectedCategory("All");}} />
          ) : (
            filteredEvents.map(event => (
              <div
                key={event._id}
                className="group relative flex flex-col h-full bg-white rounded-2xl md:rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 border border-gray-100 hover:-translate-y-2 overflow-hidden cursor-pointer active:scale-98"
              >
                <Link to={`/event/${event._id}`} className="flex flex-col h-full">
                
                {/* IMAGE RATIO:
                    - aspect-[4/5] is strictly enforced on the image container.
                    - This ensures all cards have uniform height regardless of image size.
                */}
                <div className="relative w-full aspect-4/5 overflow-hidden bg-gray-100">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  
                  {/* Tag */}
                  <div className="absolute top-2 left-2 md:top-4 md:left-4">
                     <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-lg">
                       {event.category || "Event"}
                     </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-3 md:p-5 flex-1 flex flex-col">
                  <div className="flex-1 space-y-1 md:space-y-2">
                    <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-tight line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                      {event.title}
                    </h3>
                    
                    {/* DESCRIPTION:
                        - line-clamp-2 ensures max 2 lines on ALL screens (PC & Mobile).
                        - This prevents the card from stretching.
                    */}
                    <p className="text-gray-500 text-[10px] md:text-xs font-medium line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                    
                  <div className="mt-3 md:mt-4 pt-2 md:pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-wider">Starting</p>
                        <p className="text-gray-900 font-black text-base md:text-xl tracking-tight">
                        ₹{event.price}
                        </p>
                    </div>
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