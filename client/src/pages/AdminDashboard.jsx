import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, CheckCircle, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending'); // pending, users, organizers
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
            <CheckCircle className="w-5 h-5" /> <span>Approvals</span>
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
                <th className="p-4 font-semibold text-gray-600">Name / Title</th>
                <th className="p-4 font-semibold text-gray-600">Email / Details</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                {activeTab === 'pending' && (
                  <th className="p-4 font-semibold text-gray-600 text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    {item.name || item.title}
                  </td>
                  <td className="p-4 text-gray-600">
                    {item.email ||
                      (item.organizer?.name
                        ? `By: ${item.organizer.name}`
                        : item.description?.substring(0, 30) + '...')}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                      {activeTab === 'pending' ? 'Pending' : 'Active'}
                    </span>
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
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
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
