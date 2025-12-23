const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");
const { auth } = require("../middlewares/auth");

router.post("/order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

module.exports = router;
