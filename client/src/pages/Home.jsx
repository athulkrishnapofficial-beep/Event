import { useEffect, useState } from 'react';
import axios from 'axios';

function EventCardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-[2/3] rounded-xl bg-gradient-to-br from-gray-300 to-gray-200" />
      <div className="h-4 bg-gray-300 rounded w-4/5" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-1/3" />
    </div>
  );
}
function NoEventsState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6">
        <span className="text-4xl">🎭</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800">
        No events available
      </h3>
      <p className="text-gray-500 mt-2 max-w-md">
        There are no approved events right now.  
        Please check back later for exciting experiences.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
      >
        Refresh
      </button>
    </div>
  );
}
export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        const approved = data.filter(event => event.isApproved === true);
        setEvents(approved);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedEvents();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-extrabold italic text-black">
              EventEase
            </h1>
            <input
              type="text"
              placeholder="Search events, shows, sports..."
              className="hidden md:block w-96 border rounded px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
            />
          </div>
        </div>

<div className="bg-gradient-to-r from-[#2b3148] to-[#1f2437] border-t border-white/10">
  <div className="max-w-7xl mx-auto px-4">
    <nav className="flex items-center gap-8 py-2.5 text-sm font-medium">
      {["Events", "Plays", "Sports", "Activities"].map((item) => (
        <span
          key={item}
          className="relative cursor-pointer text-white/80 
                     transition-all duration-200
                     hover:text-white
                     after:absolute after:left-0 after:-bottom-1
                     after:h-[2px] after:w-0 after:bg-white
                     after:transition-all after:duration-300
                     hover:after:w-full"
        >
          {item}
        </span>
      ))}
    </nav>
  </div>
</div>

      </header>
      <section className="max-w-7xl mx-auto my-4 px-4">
        <div className="relative h-48 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <img
            src="/poster bg login.jpg"
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white max-w-md">
            <h2 className="text-4xl font-extrabold leading-tight">
              Relive the Best<br />Events of 2025
            </h2>
            <p className="mt-2 text-sm text-gray-200">
              Concerts • Sports • Live Shows • Experiences
            </p>
            <button className="mt-5 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
              Explore Now
            </button>
          </div>
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recommended Events
          </h2>
          <span className="text-sm font-semibold cursor-pointer hover:underline">
            See All →
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          ) : events.length === 0 ? (
            <NoEventsState />
          ) : (
            events.map(event => (
              <div
                key={event._id}
                className="group cursor-pointer transition transform hover:-translate-y-1"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={`http://localhost:5000${event.coverImage}`}
                    alt={event.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold">
                    ★ 8.5
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">
                    {event.description}
                  </p>
                  <p className="text-red-600 font-bold">
                    ₹ {event.price}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}