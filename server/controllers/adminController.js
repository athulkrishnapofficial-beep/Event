const User = require('../models/userModel'); // Assuming you have a User model
const Event = require('../models/eventModel');

// 1. Get All Users (excluding admins)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get All Organizers
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: 'organizer' }).select('-password');
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Get Pending Events
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false }).populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Approve Event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ message: "Event Approved", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};