const handleSubmit = async (e) => {
  e.preventDefault(); // Prevents form from reloading the page on submit
  const token = localStorage.getItem('token'); // Retrieves JWT token from local storage for authentication
  
  // Create the "Envelope" for our data (FormData allows file upload with other text data)
  const data = new FormData(); // Initialize new FormData object

  data.append('coverImage', file); // Append image file (must match upload.single('coverImage') in backend)
  data.append('title', formData.title); // Append event title from form state
  data.append('description', formData.description); // Append event description
  data.append('price', formData.price); // Append ticket price
  data.append('availableTickets', formData.availableTickets); // Append total number of available tickets

  try {
    // Send POST request to backend to create event
    await axios.post('http://localhost:5000/api/events', data, {
      headers: { 
        Authorization: `Bearer ${token}`, // Pass token in Authorization header for protected route
        'Content-Type': 'multipart/form-data' // Tells server the request contains a file
      }
    });

    alert("Event Created Successfully!"); // Show success message on completion
    navigate('/organizer-dashboard'); // Redirect user to organizer dashboard
  } catch (err) {
    // If an error occurs, capture and display custom message from server or fallback text
    const errorMsg = err.response?.data?.message || "Something went wrong";
    alert("Error: " + errorMsg); // Alert user about the error
  }
};
