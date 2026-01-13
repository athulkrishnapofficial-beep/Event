const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/eventModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, amount, quantity } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const newBooking = new Booking({
        user: req.user.id,
        event: eventId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amount,
        quantity: quantity || 1
      });
      await newBooking.save();
      await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -(quantity || 1) } });

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};