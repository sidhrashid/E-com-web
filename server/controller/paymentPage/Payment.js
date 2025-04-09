const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../../connection/Connection");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Checkout Called with Amount:", amount);

    const options = {
      amount: Number(amount * 100), // in paise
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);
    console.log("Order Created:", order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Payment Verification and Insert into Database
const paymentVerification = async (req, res) => {
  try {
    console.log("Payment Verification Called", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Body for Signature:", body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;
    console.log("Is Authentic:", isAuthentic);

    if (isAuthentic) {
      const paymentData = {
        order_id: null,
        user_id: null,
        payment_method: "razorpay",
        payment_status: "Completed",
        transaction_id: razorpay_payment_id,
        amount: null, // Add amount if needed
        status: "Completed",
      };
      console.log("Payment Data:", paymentData);

      const [result] = await db.query(
        `INSERT INTO payments (order_id, user_id, payment_method, payment_status, transaction_id, amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          paymentData.order_id,
          paymentData.user_id,
          paymentData.payment_method,
          paymentData.payment_status,
          paymentData.transaction_id,
          paymentData.amount,
          paymentData.status,
        ]
      );
      console.log("DB Insert Result:", result);

      return res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      console.log("Signature verification failed");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  checkout,
  paymentVerification,
};