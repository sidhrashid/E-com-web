const express = require("express");
const router = express.Router();

const upload = require("../middleware/fileHandler"); // Memory handler
const { uploadImage } = require("../controllers/uploadController");

router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
