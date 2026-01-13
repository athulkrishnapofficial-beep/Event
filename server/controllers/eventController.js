const Event = require("../models/eventModel");

// 1. Get all approved events for Homepage
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: true });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get specific events created by the logged-in Organizer
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your events" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. CREATE EVENT (Fixed for Dashboard Math)
exports.createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      location, 
      price, 
      totalTickets, 
      availableTickets, 
      category 
    } = req.body;

    const total = totalTickets || availableTickets;

    // Validation
    if (!total || !price) {
      return res.status(400).json({ success: false, message: "Price and Total Tickets are required" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      price: Number(price),
      
      // CRITICAL LOGIC FOR DASHBOARD:
      // 1. Store the starting number (Total)
      totalTickets: Number(total),
      // 2. Initially, Available = Total (0 sold)
      availableTickets: Number(total), 
      
      coverImage: req.file ? req.file.path : "",
      category: category || 'Events',
      organizer: req.user.id 
    });

    await newEvent.save();
    res.status(201).json({ success: true, message: "Event created!" });
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    // 1. Prepare the update object
    let updates = { ...req.body };

    // 2. If a new file is uploaded, update the coverImage field
    if (req.file) {
      updates.coverImage = req.file.path; // Cloudinary URL
    }

    // 3. Perform the update
    const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW FUNCTION ADDED HERE ---
// 4. Toggle Interest (Like/Unlike Event) - FIXED VERSION
exports.toggleInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user already liked this event
    const userLiked = event.likes.some(likeId => likeId.toString() === userId.toString());

    let updatedEvent;

    if (userLiked) {
      // User already liked it -> REMOVE the like
      updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      // User hasn't liked it -> ADD the like
      updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $push: { likes: userId } },
        { new: true }
      );
    }

    res.status(200).json({
      message: userLiked ? "Unliked successfully" : "Liked successfully",
      event: updatedEvent,
      likeCount: updatedEvent.likes.length,
      isLiked: !userLiked
    });
  } catch (error) {
    console.error("Toggle Interest Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};