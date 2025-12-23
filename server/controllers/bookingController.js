const Booking = require("../models/bookingModel");

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
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "event"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
