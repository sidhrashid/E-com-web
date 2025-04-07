const express = require("express");
const userLogin = require("../../controller/Login/UserLogin");

const router = express.Router();

router.post("/registernewuser", userLogin.registerNewUser);
router.post("/loginclientuser", userLogin.loginClientUser);
router.post("/send-otp", userLogin.sendOtp);



module.exports = router;
