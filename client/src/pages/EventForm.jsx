const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token'); 
  
  // FIX 1: Pass e.target to automatically grab all form inputs
  const data = new FormData(e.target); 
  
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  try {
    await axios.post(`${API_BASE}/api/events`, data, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      }
    }); 

    alert("Event Created Successfully!");
    navigate('/organizer-dashboard');
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Something went wrong";
    alert("Error: " + errorMsg);
  }
};