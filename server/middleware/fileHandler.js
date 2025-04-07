const multer = require("multer");
const path = require("path");

const storageConfig = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        path.join(__dirname, `../../client/public/uploads/${folderName}`)
      );
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

const categoryFolder = multer({ storage: storageConfig("categoryImage") });
const productsFolder = multer({ storage: storageConfig("productImage") });

module.exports = { categoryFolder, productsFolder };
