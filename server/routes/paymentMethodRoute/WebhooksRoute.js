const express = require("express");
const router = express.Router();
const { razorpayWebhook } = require("../../controller/paymentPage/Webhooks");

router.post("/razorpay/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

module.exports = router;
