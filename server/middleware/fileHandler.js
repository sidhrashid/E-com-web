const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const createStorage = (folderName) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: (req, file) => Date.now() + "-" + file.originalname,
    },
  });

const productsFolder = multer({ storage: createStorage("productImage") });
const categoryFolder = multer({ storage: createStorage("categoryImage") });


module.exports = {productsFolder, categoryFolder};