const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  
  // Create the "Envelope" for our data
  const data = new FormData();
  data.append('image', file); // 'image' must match upload.single('image') in routes
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('price', formData.price);
  data.append('totalTickets', formData.totalTickets);

  try {
    await axios.post('http://localhost:5000/api/events/', data, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      }
    });
    alert("Event Created Successfully!");
    navigate('/organizer-dashboard');
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Something went wrong";
    alert("Error: " + errorMsg);
  }
};
