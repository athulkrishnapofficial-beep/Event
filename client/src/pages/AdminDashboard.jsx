import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, CheckCircle, LogOut, MessageSquare, X, Mail } from 'lucide-react';
import API_URL from '../config/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Data logic
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/admin'); return; }

    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'users') endpoint = '/api/admin/users';
      if (activeTab === 'organizers') endpoint = '/api/admin/organizers';
      if (activeTab === 'pending') endpoint = '/api/admin/events/pending';
      if (activeTab === 'approved') endpoint = '/api/admin/events/approved';
      if (activeTab === 'support') endpoint = '/api/support';

      const res = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Safety check to ensure data is always an array
      setData(Array.isArray(res.data) ? res.data : []);
      
    } catch (err) {
      console.error(err);
      if(err.response?.status === 403 || err.response?.status === 401) {
        alert("Access Denied");
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // Approve Logic
  const approveEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/admin/approve-event/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Event Approved!");
      fetchData();
    } catch (err) {
      alert("Error approving event");
    }
  };

  // Unapprove Logic
  const unapproveEvent = async (id) => {
    if (window.confirm("Unapprove this event?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/api/admin/unapprove-event/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Event Unapproved!");
        fetchData();
      } catch (err) {
        alert("Error unapproving event");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 text-gray-700 p-6 hidden md:block fixed h-full overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8 text-red-600">Admin Panel</h1>
        <nav className="space-y-2">
          {/* Navigation Buttons */}
          {[
            { id: 'pending', label: 'Pending Events', icon: CheckCircle },
            { id: 'approved', label: 'Approved Events', icon: CheckCircle },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'organizers', label: 'Organizers', icon: Briefcase },
            { id: 'support', label: 'Support Tickets', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" /> <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => { localStorage.clear(); navigate('/'); }}
          className="mt-10 flex items-center space-x-3 text-red-500 hover:text-red-600 w-full p-3 border-t border-gray-100 pt-6"
        >
          <LogOut className="w-5 h-5" /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 overflow-auto min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
          {activeTab === 'support' ? 'User Support Queries' : `${activeTab} Management`}
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {activeTab === 'support' ? (
                  <>
                    <th className="p-4 font-semibold text-gray-600">Sender Details</th>
                    <th className="p-4 font-semibold text-gray-600">Subject</th>
                    <th className="p-4 font-semibold text-gray-600">Message</th>
                    <th className="p-4 font-semibold text-gray-600">Date Received</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 font-semibold text-gray-600">Name / Title</th>
                    <th className="p-4 font-semibold text-gray-600">Email / Details</th>
                    <th className="p-4 font-semibold text-gray-600">Status / Location</th>
                    {['pending', 'approved'].includes(activeTab) && (
                       <th className="p-4 font-semibold text-gray-600 text-right">Action</th>
                    )}
                  </>
                )}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading data...</td></tr>
              ) : data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* --- RENDER SUPPORT TICKET --- */}
                  {activeTab === 'support' ? (
                    <>
                      <td className="p-4 align-top">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.email}</p>
                            </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-800 align-top w-1/5">
                        {item.subject}
                      </td>
                      <td className="p-4 text-gray-600 align-top max-w-md">
                        <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                            {item.message}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap align-top">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                        <br/>
                        <span className="text-xs text-gray-400">
                            {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </span>
                      </td>
                    </>
                  ) : (
                    /* --- RENDER OTHER TABS --- */
                    <>
                      <td className="p-4 font-medium text-gray-900">
                        {item.title || item.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.email || (item.price ? `₹${item.price}` : '')}
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.location || (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">Active</span>
                        )}
                      </td>
                      
                      {/* Action Buttons */}
                      {activeTab === 'pending' && (
                        <td className="p-4 text-right">
                          <button onClick={() => approveEvent(item._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm">
                            Approve
                          </button>
                        </td>
                      )}
                      {activeTab === 'approved' && (
                        <td className="p-4 text-right">
                          <button onClick={() => unapproveEvent(item._id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 border border-red-200 flex items-center gap-1 ml-auto">
                            <X className="w-3 h-3" /> Unapprove
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}

              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                         {activeTab === 'support' ? <MessageSquare className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                      </div>
                      <p>No records found</p>
                    </div>
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