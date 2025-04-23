const crypto = require("crypto");
const db = require("../../connection/Connection");

const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature === expectedSignature) {
    console.log("✅ Webhook verified successfully");

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    const {
      order_id,
      id: payment_id,
      amount,
      status: razorpay_status,
      method,
    } = payload;

    try {
      const check = await db.query(
        "SELECT * FROM payments WHERE transaction_id = $1",
        [payment_id]
      );

      if (check.rows.length === 0) {
        const insertQuery = `
          INSERT INTO payments (
            order_id,
            user_id,
            payment_method,
            payment_status,
            transaction_id,
            amount,
            status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        // ✅ Map Razorpay status to your own custom status
        const finalStatus =
          razorpay_status === "captured" ? "Completed" : "Failed";

        const values = [
          order_id || null,
          null, // user_id Razorpay webhook se nahi milta
          method || "razorpay",
          razorpay_status || "captured",
          payment_id,
          amount / 100,
          finalStatus,
        ];

        await db.query(insertQuery, values);
        console.log("💾 Webhook: Payment saved to DB");
      } else {
        console.log("⚠️ Webhook: Payment already exists");
      }
    } catch (err) {
      console.error("Webhook DB Insert Error:", err.message);
    }

    res.status(200).json({ status: "ok" });
  } else {
    console.warn("❌ Webhook signature mismatch");
    res.status(400).json({ error: "Invalid signature" });
  }
};

module.exports = { razorpayWebhook };
