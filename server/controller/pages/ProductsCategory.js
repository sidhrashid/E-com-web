const db = require("../../connection/Connection");
const fs = require("fs");
const path = require("path");

// ====================================== getCategories ======================================

const getCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};

// ====================================== addCategory ======================================

const addCategory = (req, res) => {
  const title = req.body.title;
  const image = req.file ? req.file.filename : null;
  const q = "INSERT INTO categories (title, image ,status) VALUES (?,?,?)";
  const values = [title, image, "active"];
  db.query(q, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding category");
    } else {
      res.status(201).send("Category added successfully");
    }
  });
};

// ====================================== updateCategory ======================================

const updateCategory = (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  const newImage = req.file ? req.file.filename : null;

  const selectQuery = "SELECT image FROM categories WHERE id = ?";
  db.query(selectQuery, [id], (err, data) => {
    if (err) return res.status(500).json({ message: "Database Error" });

    const oldImage = data[0]?.image;

    if (newImage && oldImage) {
      const oldImagePath = path.join(
        __dirname,
        "../../../client/public/uploads/categoryImage",
        oldImage
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
    }

    const updateQuery = "UPDATE categories SET title =?, image =? WHERE id =?";
    const values = [title, newImage || oldImage, id];

    db.query(updateQuery, values, (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error updating category" });

      return res.json({ message: "Category updated successfully", result });
    });
  });
};

// ====================================== getCategoryById ======================================

const getCategoryById = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM categories WHERE id =?";
  db.query(q, id, (err, result) => {
    if (err) {
      return res.status(500);
    }
    return res.json(result);
  });
};

// ====================================== deleteCategory ======================================

const deleteCategory = (req, res) => {
  const id = req.params.id;

  const selectProductImages =
    "SELECT image FROM products WHERE category_id = ?";
  db.query(selectProductImages, [id], (err, productData) => {
    if (err)
      return res.status(500).json({ message: "Error fetching product images" });

    productData.forEach((product) => {
      const imagePath = path.join(
        __dirname,
        "../../../client/public/uploads/productImage",
        product.image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting product image:", err);
        });
      }
    });

    const selectImage = "SELECT image FROM categories WHERE id = ?";
    db.query(selectImage, [id], (err, data) => {
      if (err) return res.status(500).json({ message: "Database Error" });

      const imageName = data[0]?.image;
      if (imageName) {
        const imagePath = path.join(
          __dirname,
          "../../../client/public/uploads/categoryImage",
          imageName
        );

        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }

      const deleteQuery = "DELETE FROM categories WHERE id = ?";
      db.query(deleteQuery, [id], (err, result) => {
        if (err)
          return res.status(500).json({ message: "Error deleting category" });

        return res
          .status(200)
          .json({ message: "Category deleted successfully" });
      });
    });
  });
};

// ====================================== updateStatus ======================================

const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE categories SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "Category status updated successfully!" });
  });
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  updateStatus,
};
