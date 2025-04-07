const db = require("../../connection/Connection");
const fs = require("fs");
const path = require("path");

// ========================================get all products=====================================

const getAllProducts = (req, res) => {
  const q = "SELECT * FROM products";
  db.query(q, (err, result) => {
    if (err) {
      return res.status(500);
    }
    return res.json(result);
  });
};

// ========================================get products by id===================================
const getProductsById = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM products WHERE id =?";
  db.query(q, [id], (err, result) => {
    if (err) {
      return res.status(500);
    }
    return res.json(result);
  });
};

// ========================================add products=========================================
const addProducts = (req, res) => {
  const { name, price, description, category_id   } = req.body;
  const image = req.file ? req.file.filename : null;

  const q =
    "INSERT INTO products (name, price, description, image, category_id, status) VALUES (?,?,?,?,? ,?)";

  const values = [name, price, description, image, category_id ,"active"];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Database Error:", err); // Debugging error
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json({
      success: true,
      message: "Product added successfully",
      data,
    });
  });
};

// ========================================update products======================================
const updateProducts = (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { name, price, description, category_id } = req.body;
  const newImage = req.file ? req.file.filename : null;

  const selectQuery = "SELECT image FROM products WHERE id = ?";
  db.query(selectQuery, [id], (err, data) => {
    if (err) return res.status(500).json({ message: "Database Error" });

    const oldImage = data[0]?.image;

    if (newImage && oldImage) {
      const oldImagePath = path.join(
        __dirname,
        "../../../client/public/uploads/productImage",
        oldImage
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
    }

    const updateQuery =
      "UPDATE products SET name =?, price =?, description =?, category_id=?, image=? WHERE id =?";
    const values = [name, price, description, category_id, newImage || oldImage, id];
    db.query(updateQuery, values, (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error updating product" });

      return res.json({ message: "Product updated successfully", result });
    });
  });
};

// ========================================delete products======================================

const deleteProducts = (req, res) => {
  const id = req.params.id;
  const selectImage = "SELECT image FROM products WHERE id = ?";
  db.query(selectImage, [id], (err, data) => {
    if (err) return res.status(500).json({ message: "Database Error" });

    const imageName = data[0]?.image;
    if (imageName) {
      const imagePath = path.join(
        __dirname,
        "../../../client/public/uploads/productImage",
        imageName
      );

      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    const q = "DELETE FROM products WHERE id =?";
    db.query(q, id, (err, result) => {
      if (err) {
        return res.status(500);
      }
      return res.json(200);
    });
  });
};

// ========================================get products by category=============================
const getProductsByCategory = (req, res) => {
  const category = req.params.categories;
  console.log(category);
  const q = "SELECT * FROM products WHERE category_id = ?";
  db.query(q, category, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
};

// ========================================update status========================================
const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE products SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "Products status updated successfully!" });
  });
};




module.exports = {
  getAllProducts,
  getProductsById,
  addProducts,
  updateProducts,
  deleteProducts,
  getProductsByCategory,
  updateStatus,
};
