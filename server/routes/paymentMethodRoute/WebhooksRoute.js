const express = require("express");
const router = express.Router();
const { razorpayWebhook } = require("../../controller/paymentPage/Webhooks");

router.post("/payment/webhook", express.raw({ type: "*/*"  }), razorpayWebhook);

module.exports = router;
