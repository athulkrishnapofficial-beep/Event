const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticketType: { type: String },
    status: { type: String, default: "Confirmed" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Booking", bookingSchema);
