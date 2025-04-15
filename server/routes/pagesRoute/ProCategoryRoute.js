const express = require("express");
const Category = require("../../controller/pages/ProductsCategory");
// const {categoryFolder} = require("../../middleware/fileHandler");
const upload = require("../../middleware/fileHandler"); // Correct path to fileHandler

const router = express.Router();

router.get("/category", Category.getCategories);
router.get("/getcategorybyid/:id", Category.getCategoryById);
router.delete("/deletecategory/:id", Category.deleteCategory);
router.post(
  "/addcategory",
  upload.single("image"),
  Category.addCategory
);
router.put(
  "/updatecategory/:id",
  upload.single("image"),
  Category.updateCategory
);

module.exports = router;
