const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");
const db = require("../../connection/Connection");
require("dotenv").config();

// File logging for Render debugging
const logStream = fs.createWriteStream("webhook.log", { flags: "a" });
const logToFile = (message) => {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
  console.log(message);
};

// Retry logic for API calls
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const razorpayWebhook = async (req, res) => {
  logToFile("Webhook received: " + JSON.stringify(req.body));
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const body = Buffer.from(JSON.stringify(req.body));

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  logToFile("Received Signature: " + signature);
  logToFile("Expected Signature: " + expectedSignature);

  if (signature === expectedSignature) {
    logToFile("✅ Webhook verified successfully");
    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    // Handle payment.captured and payment.failed events
    if (event === "payment.captured" || event === "payment.failed") {
      const {
        order_id: payment_order_id,
        id: payment_id,
        amount,
        notes,
      } = payload;
      try {
        // Fetch order_id and user_id from notes
        const order_id = notes?.order_id ? parseInt(notes.order_id) : null;
        const user_id = notes?.user_id ? parseInt(notes.user_id) : null;

        if (!order_id || !user_id) {
          logToFile(
            `Missing notes: order_id=${order_id}, user_id=${user_id} for payment_order_id: ${payment_order_id}`
          );
          return res.status(200).json({ status: "ok" });
        }

        // Verify order exists
        const orderCheck = await db.query(
          "SELECT user_id FROM orders WHERE id = $1",
          [order_id]
        );
        if (!orderCheck.rows.length) {
          logToFile("Order not found for order_id: " + order_id);
          return res.status(200).json({ status: "ok" });
        }

        // Razorpay API Call to confirm details
        const razorpayRes = await retry(() =>
          axios.get(`https://api.razorpay.com/v1/orders/${payment_order_id}/payments`, {
            auth: {
              username: process.env.RAZORPAY_KEY_ID,
              password: process.env.RAZORPAY_KEY_SECRET,
            },
          })
        );
        logToFile("Razorpay API Response: " + JSON.stringify(razorpayRes.data));

        const payment = razorpayRes.data.items && razorpayRes.data.items[0];
        if (!payment) {
          logToFile("No payment found for payment_order_id: " + payment_order_id);
          return res.status(200).json({ status: "ok" });
        }

        const payment_method = payment.method; // upi, card, etc.
        const payment_status = payment.status; // captured, failed
        const status = payment_status === "captured" ? "Completed" : "Failed";

        // Check if payment exists
        const check = await db.query(
          "SELECT * FROM payments WHERE transaction_id = $1",
          [payment_id]
        );
        logToFile("DB Check Result: " + JSON.stringify(check.rows));

        if (check.rows.length === 0) {
          // Insert new payment record
          const insertQuery = `
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
            payment_id,
            amount / 100,
            status,
          ];
          await db.query(insertQuery, values);
          logToFile("💾 Payment saved to DB");
          logToFile("🧾 Status: " + status);
          logToFile("💳 Method: " + payment_method);
          logToFile("🆔 Payment ID: " + payment_id);
        } else {
          // Update existing payment record
          const updateQuery = `
            UPDATE payments
            SET payment_method = $1, payment_status = $2, amount = $3, status = $4
            WHERE transaction_id = $5
          `;
          const updateValues = [
            payment_method,
            payment_status,
            amount / 100,
            status,
            payment_id,
          ];
          await db.query(updateQuery, updateValues);
          logToFile("🔄 Payment updated in DB");
          logToFile("🧾 Status: " + status);
          logToFile("💳 Method: " + payment_method);
          logToFile("🆔 Payment ID: " + payment_id);
        }
      } catch (err) {
        logToFile("Webhook Error: " + err.message + "\nStack: " + err.stack);
      }
    } else {
      logToFile("ℹ️ Unhandled event: " + event);
    }

    return res.status(200).json({ status: "ok" });
  } else {
    logToFile("❌ Webhook signature mismatch");
    return res.status(400).json({ error: "Invalid signature" });
  }
};

module.exports = { razorpayWebhook };