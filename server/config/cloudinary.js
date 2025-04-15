const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ecom-web-store",
  api_key: "593277899171194",
  api_secret: "81MTxrVD2mynmgGbn_QnMlfZxek",
});

module.exports = cloudinary;
