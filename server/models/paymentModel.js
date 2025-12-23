const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Payment", paymentSchema);
