import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, CheckCircle, LogOut, X } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, users, organizers
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Fetch Data based on active tab
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/admin'); return; }

    try {
      let endpoint = '';
      if (activeTab === 'users') endpoint = '/api/admin/users';
      if (activeTab === 'organizers') endpoint = '/api/admin/organizers';
      if (activeTab === 'pending') endpoint = '/api/admin/events/pending';
      if (activeTab === 'approved') endpoint = '/api/admin/events/approved';

      //const res = await axios.get(`http://localhost:5000${endpoint}`, {
      const res = await axios.get(`https://event-kqrm.onrender.com${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      if(err.response?.status === 403) {
        alert("Access Denied");
        navigate('/');
      }
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const approveEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      //await axios.put(`http://localhost:5000/api/admin/approve-event/${id}`, {}, {
      await axios.put(`https://event-kqrm.onrender.com/api/admin/approve-event/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Event Approved!");
      fetchData(); // Refresh list
    } catch (err) {
      alert("Error approving event");
    }
  };

  const unapproveEvent = async (id) => {
    if (window.confirm("Are you sure you want to unapprove this event? It will no longer be visible to users.")) {
      try {
        const token = localStorage.getItem('token');
        //await axios.put(`http://localhost:5000/api/admin/unapprove-event/${id}`, {}, {
        await axios.put(`https://event-kqrm.onrender.com/api/admin/unapprove-event/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Event Unapproved!");
        fetchData(); // Refresh list
      } catch (err) {
        alert("Error unapproving event");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 text-gray-700 p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8 text-red-600">Admin Panel</h1>
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
              activeTab === 'pending'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckCircle className="w-5 h-5" /> <span>Pending Events</span>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
              activeTab === 'approved'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckCircle className="w-5 h-5" /> <span>Approved Events</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
              activeTab === 'users'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" /> <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('organizers')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
              activeTab === 'organizers'
                ? 'bg-red-50 text-red-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="w-5 h-5" /> <span>Organizers</span>
          </button>
        </nav>

        <button
          onClick={() => { localStorage.clear(); navigate('/'); }}
          className="mt-20 flex items-center space-x-3 text-red-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
          {activeTab} Management
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">
                  {activeTab === 'pending' || activeTab === 'approved' ? 'Event Title' : 'Name'}
                </th>
                <th className="p-4 font-semibold text-gray-600">
                  {activeTab === 'pending' || activeTab === 'approved' ? 'Price / Tickets' : 'Email'}
                </th>
                <th className="p-4 font-semibold text-gray-600">
                  {activeTab === 'pending' || activeTab === 'approved' ? 'Location' : 'Status'}
                </th>
                <th className="p-4 font-semibold text-gray-600">
                  {activeTab === 'pending' || activeTab === 'approved' ? 'Date' : ''}
                </th>
                {(activeTab === 'pending' || activeTab === 'approved') && (
                  <th className="p-4 font-semibold text-gray-600 text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {activeTab === 'pending' || activeTab === 'approved' ? (
                    <>
                      <td className="p-4 font-medium text-gray-900">
                        {item.title}
                      </td>
                      <td className="p-4 text-gray-600">
                        ₹{item.price} / {item.availableTickets} tickets
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.location}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      {activeTab === 'pending' && (
                        <td className="p-4 text-right">
                          <button
                            onClick={() => approveEvent(item._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm"
                          >
                            Approve
                          </button>
                        </td>
                      )}
                      {activeTab === 'approved' && (
                        <td className="p-4 text-right">
                          <button
                            onClick={() => unapproveEvent(item._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 shadow-sm flex items-center gap-2 ml-auto"
                          >
                            <X className="w-4 h-4" /> Unapprove
                          </button>
                        </td>
                      )}
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.email}
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                          Active
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
