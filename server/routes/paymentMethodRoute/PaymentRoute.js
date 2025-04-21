const express = require('express');
const router = express.Router();
const PaymentController = require('../../controller/paymentPage/Payment');


router.post('/checkout', PaymentController.checkout);
router.post('/payment-verification', PaymentController.paymentVerification);

module.exports = router;