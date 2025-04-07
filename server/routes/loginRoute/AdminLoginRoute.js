const express = require("express");
const router = express.Router();
const adminUserRoute = require("../../controller/Login/AdminLogin");

router.post("/add-admin-user", adminUserRoute.addAdminUser);
router.post("/login-admin-user", adminUserRoute.loginAdminUser);
router.get("/get-admin-user", adminUserRoute.getAdminUsers);
router.delete("/delete-admin-user/:id", adminUserRoute.deleteAdminUser);
router.put("/update-admin-user/:id", adminUserRoute.updateAdminUser);
router.get("/get-admin-by-id/:id", adminUserRoute.getAdminUsersById);
router.put("/update-admin-status/:id", adminUserRoute.updateStatus);

module.exports = router;
