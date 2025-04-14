const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../../connection/Connection");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =================================== Create Razorpay Order ===================================
const checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Checkout Called with Amount:", amount);

    const options = {
      amount: Number(amount * 100), // Convert to paise
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

// =================================== Verify Payment and Save to DB ===================================
const paymentVerification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      order_id,
      amount,
    } = req.body;

    console.log("Payment Verification Called", req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    console.log("Is Authentic:", isAuthentic);

    if (isAuthentic) {
      const paymentQuery = `
        INSERT INTO payments (
          order_id,
          user_id,
          payment_method,
          payment_status,
          transaction_id,
          amount,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      const values = [
        order_id || null,
        user_id || null,
        "razorpay",
        "Completed",
        razorpay_payment_id,
        amount || null,
        "Completed",
      ];

      const result = await db.query(paymentQuery, values);
      console.log("Payment recorded in DB");

      return res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
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
