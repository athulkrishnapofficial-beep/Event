import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        setEvents(data.filter(event => event.isApproved === true));
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };
    fetchApprovedEvents();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* 1. Header/Navbar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-black italic">EventEase</h1>
            <input 
              type="text" 
              placeholder="Search for Events, Plays, Sports and Activities" 
              className="hidden md:block w-96 border rounded px-4 py-1.5 text-sm outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-black text-white px-4 py-1 rounded text-sm font-semibold">Sign In</button>
          </div>
        </div>
        {/* Sub-menu */}
        <div className="bg-[#2b3148] text-white text-xs py-2">
          <div className="max-w-7xl mx-auto px-4 flex space-x-6">
            <span className="cursor-pointer hover:text-gray-300">Events</span>
            <span className="cursor-pointer hover:text-gray-300">Plays</span>
            <span className="cursor-pointer hover:text-gray-300">Sports</span>
            <span className="cursor-pointer hover:text-gray-300">Activities</span>
          </div>
        </div>
      </header>

      {/* 2. Banner/Hero Section */}
      <section className="max-w-7xl mx-auto my-4 px-4">
        <div className="bg-black h-48 md:h-80 rounded-lg flex items-center justify-center overflow-hidden relative shadow-md">
          <img 
            src="/poster bg login.jpg" 
            alt="Promotion Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute left-10 text-white">
             <h2 className="text-4xl font-bold">2025 Throwback</h2>
             <button className="mt-4 bg-white text-black px-6 py-2 rounded font-bold">Know More</button>
          </div>
        </div>
      </section>

      {/* 3. Recommended Events Section */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recommended Events</h2>
          <span className="text-black text-sm font-semibold cursor-pointer">See All &rsaquo;</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {events.length > 0 ? events.map(event => (
            <div key={event._id} className="cursor-pointer group">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={`http://localhost:5000${event.coverImage}`} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs">
                    ★ 8.5/10
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-gray-800 truncate">{event.title}</h3>
                <p className="text-gray-500 text-sm">{event.description.substring(0, 20)}...</p>
                <p className="text-red-500 font-bold mt-1">₹ {event.price}</p>
              </div>
            </div>
          )) : (
            <p className="col-span-full text-center text-gray-400">Loading events...</p>
          )}
        </div>
      </main>
    </div>
  );
}