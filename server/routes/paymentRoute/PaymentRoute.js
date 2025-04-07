const express = require('express');
const router = express.Router();
const PaymentController = require('../../controller/paymentPage/Payment');

router.post('/create-order', PaymentController.createOrder);
router.post('/verify-payment', PaymentController.verifyPayment);

module.exports = router;