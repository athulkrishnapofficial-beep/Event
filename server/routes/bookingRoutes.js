const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
} = require("../controllers/bookingController");
const { auth } = require("../middlewares/auth");

router.post("/", auth, createBooking);
router.get("/my-bookings", auth, getUserBookings);

module.exports = router;
