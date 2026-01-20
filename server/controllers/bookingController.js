const Booking = require("../models/Booking");
const Event = require("../models/eventModel");
const User = require("../models/userModel");

exports.createBooking = async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;
    const booking = await Booking.create({
      event: eventId,
      user: req.user.id,
      ticketType,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

exports.verifyTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const organizerId = req.user.id;

    // Find the booking by ID
    const booking = await Booking.findById(ticketId)
      .populate('user')
      .populate('event');

    if (!booking) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Verify that the organizer owns this event
    if (booking.event.organizer.toString() !== organizerId) {
      return res.status(403).json({ message: "Unauthorized to verify this ticket" });
    }

    // Check if ticket status is valid
    if (booking.status !== 'Confirmed') {
      return res.status(400).json({ message: "Ticket is not confirmed" });
    }

    // Return booking details for validation
    res.json({
      booking: {
        _id: booking._id,
        guestName: booking.user.fullName || booking.user.name || 'Guest',
        eventName: booking.event.title,
        quantity: booking.quantity,
        isVip: booking.isVip,
        status: booking.status,
        amount: booking.amount,
        orderId: booking.orderId
      }
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};
