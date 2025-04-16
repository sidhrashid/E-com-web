const express = require("express");
const Category = require("../../controller/pages/ProductsCategory");
const {categoryFolder} = require("../../middleware/fileHandler");

const router = express.Router();

router.get("/category", Category.getCategories);
router.get("/getcategorybyid/:id", Category.getCategoryById);
router.delete("/deletecategory/:id", Category.deleteCategory);
router.post(
  "/addcategory",
  categoryFolder.single("image"),
  Category.addCategory
);
router.put(
  "/updatecategory/:id",
  categoryFolder.single("image"),
  Category.updateCategory
);

module.exports = router;
