const db = require("../../connection/Connection");
const cloudinary = require("cloudinary").v2;

const getCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result.rows);
    }
  });
};

const addCategory = (req, res) => {
  const title = req.body.title;
  const image = req.file ? req.file.path : null; // ✅ NOT .filename
  console.log("categoryImage", req.file)

  const q = "INSERT INTO categories (image, title) VALUES ($1, $2)";
  const values = [image, title];

  db.query(q, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding category");
    } else {
      res.status(201).send("Category added successfully");
    }
  });
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  const newImage = req.file ? req.file.path : null;  // Cloudinary URL

  const selectQuery = "SELECT image FROM categories WHERE id = $1";
  db.query(selectQuery, [id], async (err, data) => {
    if (err) return res.status(500).json({ message: "Database Error" });

    const oldImageUrl = data.rows[0]?.image;

    if (newImage && oldImageUrl) {
      // Extract the folder name and file name from the old image URL
      const urlParts = oldImageUrl.split("/");
      const folder = urlParts[urlParts.length - 2]; // "categoryImage"
      const fileName = urlParts[urlParts.length - 1].split(".")[0]; // "abc123"
      const publicId = `${folder}/${fileName}`;

      try {
        await cloudinary.uploader.destroy(publicId);
        console.log("Old image deleted:", publicId);
      } catch (err) {
        console.error("Cloudinary deletion error:", err);
      }
    }

    // Update category with the new image or keep the old image
    const updateQuery = "UPDATE categories SET title = $1, image = $2 WHERE id = $3";
    const values = [title, newImage || oldImageUrl, id];

    db.query(updateQuery, values ,(err) => {
      if (err) return res.status(500).json({ message: "Error updating category" });
      return res.json({ message: "Category updated successfully" });
    });
  });
};


const getCategoryById = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM categories WHERE id =$1";
  db.query(q, [id], (err, result) => {
    if (err) {
      return res.status(500);
    }
    return res.json(result.rows);
  });
};



const deleteCategory = (req, res) => {
  const id = req.params.id;

  // Fetch the products associated with the category
  const selectProductImages = "SELECT image FROM products WHERE category_id = $1";
  db.query(selectProductImages, [id], (err, productData) => {
    if (err) return res.status(500).json({ message: "Error fetching product images" });

    productData.rows.forEach((product) => {
      if (product.image) {
        // Extract public_id for the product image and delete from Cloudinary
        const urlParts = product.image.split("/");
        const folder = urlParts[urlParts.length - 2]; // "productImage"
        const fileName = urlParts[urlParts.length - 1].split(".")[0]; // "abc123"
        const publicId = `${folder}/${fileName}`;

        cloudinary.uploader.destroy(publicId, (err) => {
          if (err) console.error("Error deleting product image:", err);
        });
      }
    });

    // Fetch the category image
    const selectImage = "SELECT image FROM categories WHERE id = $1";
    db.query(selectImage, [id], (err, data) => {
      if (err) return res.status(500).json({ message: "Database Error" });

      const imageUrl = data.rows[0]?.image;
      if (imageUrl) {
        // Extract public_id for the category image and delete from Cloudinary
        const urlParts = imageUrl.split("/");
        const folder = urlParts[urlParts.length - 2]; // "categoryImage"
        const fileName = urlParts[urlParts.length - 1].split(".")[0]; // "abc123"
        const publicId = `${folder}/${fileName}`;

        cloudinary.uploader.destroy(publicId, (err) => {
          if (err) console.error("Error deleting category image:", err);
        });
      }

      // Proceed with category deletion from the database
      const deleteQuery = "DELETE FROM categories WHERE id = $1";
      db.query(deleteQuery, [id], (err) => {
        if (err) return res.status(500).json({ message: "Error deleting category" });

        return res.status(200).json({ message: "Category deleted successfully" });
      });
    });
  });
};



module.exports = { getCategories, addCategory, deleteCategory, updateCategory, getCategoryById };