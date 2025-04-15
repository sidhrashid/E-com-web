const express = require("express");
const products = require("../../controller/pages/Products");
// const {productsFolder} = require("../../middleware/fileHandler");
const upload = require("../../middleware/fileHandler"); // Correct path to fileHandler

const router = express.Router();

router.get("/getallproducts", products.getAllProducts);
router.get("/getproductsbyid/:id", products.getProductsById);
router.post("/addproducts", upload.single("image"), products.addProducts);
router.put(
  "/updateproducts/:id",
  upload.single("image"),
  products.updateProducts
);
router.delete("/deleteproducts/:id", products.deleteProducts);
router.get(
  "/getproductsbycategory/:categories",
  products.getProductsByCategory
);
router.put("/updatestatus/:id", products.updateStatus);

module.exports = router;
