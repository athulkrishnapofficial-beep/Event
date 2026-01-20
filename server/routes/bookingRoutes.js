const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { verifyTicket } = require("../controllers/bookingController");

const Booking = require("../models/Booking"); 

router.get('/my-bookings', auth, async (req, res) => {
  try {

    const bookings = await Booking.find({ user: req.user.id })
                                  .populate('event')
                                  .sort({ createdAt: -1 });
                                  
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Verify ticket by ID (for organizer ticket validation)
router.get('/verify/:ticketId', auth, verifyTicket);

module.exports = router;