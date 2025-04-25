const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../../connection/Connection");
const axios = require("axios");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const checkout = async (req, res) => {
  try {
    const { user_id, amount, items } = req.body;

    // Validate inputs
    if (!user_id || !amount || !items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Insert into orders table
    const orderInsertQuery = `
      INSERT INTO orders (user_id, total_amount)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const orderResult = await db.query(orderInsertQuery, [user_id, amount]);
    const order_id = orderResult.rows[0].id;

    // Insert into order_items table
    const itemInsertPromises = items.map((item) => {
      return db.query(
        `INSERT INTO order_items (
           order_id, product_id, quantity, price, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
        [order_id, item.product_id, item.quantity, item.price]
      );
    });
    await Promise.all(itemInsertPromises);

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Number(amount * 100),
      currency: "INR",
      receipt: `order_rcptid_${order_id}`,
      notes: {
        user_id: user_id.toString(),
        order_id: order_id.toString(),
      },
    });

    // Respond to frontend
    res.status(200).json({
      success: true,
      razorpayOrder,
      order_id,
      payment_order_id: razorpayOrder.id,
    });
  } catch (error) {
    console.error("Checkout Error:", error.message);
    res.status(500).json({ success: false, message: "Checkout failed" });
  }
};

// Verify Payment and Save to DB
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

    // Validate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Get payment details from Razorpay
      const paymentRes = await axios.get(
        `https://api.razorpay.com/v1/orders/${razorpay_order_id}/payments`,
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET,
          },
        }
      );

      const paymentData = paymentRes.data.items[0];
      const payment_method = paymentData.method;
      const payment_status = paymentData.status;
      const status = payment_status === "captured" ? "Completed" : "Failed";

      // Check for duplicate transaction
      const existing = await db.query(
        "SELECT * FROM payments WHERE transaction_id = $1",
        [razorpay_payment_id]
      );

      if (existing.rows.length === 0) {
        const paymentQuery = `
          INSERT INTO payments (
            order_id, user_id, payment_method, payment_status,
            transaction_id, amount, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const values = [
          order_id,
          user_id,
          payment_method,
          payment_status,
          razorpay_payment_id,
          amount,
          status,
        ];
        await db.query(paymentQuery, values);

        console.log("💾 Payment recorded in DB");
        console.log("🧾 Status:", status);
        console.log("💳 Method:", payment_method);
        console.log("🆔 Payment ID:", razorpay_payment_id);
      } else {
        console.log("⚠️ Payment already exists in DB");
      }

      return res.redirect(
        `https://e-com-web-n1aw.onrender.com/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  checkout,
  paymentVerification,
};