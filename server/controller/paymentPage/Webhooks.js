const crypto = require("crypto");
const fs = require("fs");
const db = require("../../connection/Connection");
require("dotenv").config();

const logStream = fs.createWriteStream("webhook.log", { flags: "a" });
const logToFile = (message) => {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
  console.log(message);
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

    if (event === "payment.captured" || event === "payment.failed") {
      const {
        id: payment_id,
        amount,
        method: payment_method,
        status: payment_status,
        notes,
      } = payload;

      try {
        const order_id = notes?.order_id ? parseInt(notes.order_id) : null;
        const user_id = notes?.user_id ? parseInt(notes.user_id) : null;

        if (!order_id || !user_id) {
          logToFile(`Missing notes: order_id=${order_id}, user_id=${user_id}`);
          return res.status(200).json({ status: "ok" });
        }

        const orderCheck = await db.query(
          "SELECT user_id FROM orders WHERE id = $1",
          [order_id]
        );
        if (!orderCheck.rows.length) {
          logToFile("Order not found for order_id: " + order_id);
          return res.status(200).json({ status: "ok" });
        }

        const status = payment_status === "captured" ? "Completed" : "Failed";

        const check = await db.query(
          "SELECT * FROM payments WHERE transaction_id = $1",
          [payment_id]
        );
        logToFile("DB Check Result: " + JSON.stringify(check.rows));

        if (check.rows.length === 0) {
          const insertQuery = `
            INSERT INTO payments (
              order_id, user_id, payment_order_id, payment_method, payment_status,
              transaction_id, amount, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `;
          const values = [
            order_id,
            user_id,
            null, // Removed payment_order_id, or you can keep as null
            payment_method,
            payment_status,
            payment_id,
            amount / 100,
            status,
          ];
          await db.query(insertQuery, values);
          logToFile("💾 Payment saved to DB");
        } else {
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
