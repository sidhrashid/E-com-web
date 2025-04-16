const express = require("express");
const products = require("../../controller/pages/Products");
const {productsFolder} = require("../../middleware/fileHandler");

const router = express.Router();

router.get("/getallproducts", products.getAllProducts);
router.get("/getproductsbyid/:id", products.getProductsById);
router.post("/addproducts", productsFolder.single("image"), products.addProducts);
router.put(
  "/updateproducts/:id",
  productsFolder.single("image"),
  products.updateProducts
);
router.delete("/deleteproducts/:id", products.deleteProducts);
router.get(
  "/getproductsbycategory/:categories",
  products.getProductsByCategory
);
router.put("/updatestatus/:id", products.updateStatus);

module.exports = router;
