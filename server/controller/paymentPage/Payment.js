const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../../connection/Connection');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class PaymentController {
  // Order Create
  static async createOrder(req, res) {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Paise mein
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json({ order_id: order.id, amount: order.amount });
    } catch (error) {
      res.status(500).json({ error: 'Order creation failed' });
    }
  }

  // Payment Verify aur Database Save
  static async verifyPayment(req, res) {
    try {
      const { order_id, payment_id, signature } = req.body;
      console.log("Received:", { order_id, payment_id, signature });
  
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(order_id + "|" + payment_id)
        .digest("hex");
  
      if (generatedSignature === signature) {
        console.log("✅ Signature matched");
        res.json({ status: "success" });
      } else {
        console.log("❌ Signature mismatch");
        res.status(400).json({ status: "failure" });
      }
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
}

// module.exports = {createOrder, verifyPayment} = PaymentController;
module.exports = PaymentController;