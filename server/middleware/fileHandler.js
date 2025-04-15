const multer = require("multer");

// Image ko memory me temporarily store karega (na ki disk me)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
