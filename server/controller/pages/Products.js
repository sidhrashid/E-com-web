const db = require("../../connection/Connection");
const cloudinary = require("cloudinary").v2;

const getAllProducts = (req, res) => {
  const q = "SELECT * FROM products ORDER BY id ASC";
  db.query(q, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database Error", error: err.message });
    }
    return res.json(result.rows);
  });
};

const getProductsById = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM products WHERE id =$1";
  db.query(q, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database Error", error: err.message });
    }
    return res.json(result.rows);
  });
};

const addProducts = (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image = req.file ? req.file.path : null; // ✅ NOT .filename
  console.log("productImage", req.file);

  const q =
    "INSERT INTO products (name, price, description, image, status, category_id) VALUES ($1, $2, $3, $4, $5, $6)";

  const values = [name, price, description, image, "active", category_id];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
    return res.json({ message: "Product added successfully" });
  });
};

const updateProducts = async (req, res) => {
  const id = req.params.id;
  const { name, price, description, category_id } = req.body;
  const newImage = req.file ? req.file.path : null; // ✅ NOT .filename

  try {
    // Fetch old image URL to delete from Cloudinary if there's a new image
    const selectQuery = "SELECT image FROM products WHERE id = $1";
    const data = await db.query(selectQuery, [id]);
    const oldImageUrl = data.rows[0]?.image;

    if (newImage && oldImageUrl) {
      const urlParts = oldImageUrl.split("/");
      const folder = urlParts[urlParts.length - 2]; // "productImage"
      const fileName = urlParts[urlParts.length - 1].split(".")[0]; // "abc123"
      const publicId = `${folder}/${fileName}`;

      await cloudinary.uploader.destroy(publicId);
      console.log("Old image deleted:", publicId);
    }

    const updateQuery =
      "UPDATE products SET name =$1, price =$2, description =$3, category_id=$4, image=$5 WHERE id =$6";
    const values = [
      name,
      price,
      description,
      category_id,
      newImage || oldImageUrl,
      id,
    ];
    const result = await db.query(updateQuery, values);

    return res.json({
      message: "Product updated successfully",
      updatedProduct: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating product:", err);
    return res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

const deleteProducts = async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch image URL of the product to delete from Cloudinary
    const selectImage = "SELECT image FROM products WHERE id = $1";
    const data = await db.query(selectImage, [id]);
    const imageUrl = data.rows[0]?.image;

    if (imageUrl) {
      const urlParts = imageUrl.split("/");
      const folder = urlParts[urlParts.length - 2]; // "productImage"
      const fileName = urlParts[urlParts.length - 1].split(".")[0]; // "abc123"
      const publicId = `${folder}/${fileName}`;

      await cloudinary.uploader.destroy(publicId);
      console.log("Image deleted from Cloudinary:", publicId);
    }

    // Delete product from database
    const q = "DELETE FROM products WHERE id =$1";
    await db.query(q, [id]);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getProductsByCategory = (req, res) => {
  const category = req.params.id;
  const q = "SELECT * FROM products WHERE category_id = $1";
  db.query(q, [category], (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({
          message: "Error fetching products by category",
          error: err.message,
        });
    } else {
      res.json(result.rows);
    }
  });
};

const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE products SET status = $1 WHERE id = $2";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating product status", error: err.message });
    }
    return res.json({ message: "Product status updated successfully!" });
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
