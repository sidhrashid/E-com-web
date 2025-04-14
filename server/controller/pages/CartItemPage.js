const db = require("../../connection/Connection");

// Helper to run DB queries with Promise
const runQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// ✅ Add or update cart item
const addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingItem = await runQuery(
      "SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].quantity + quantity;
      await runQuery(
        "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [newQuantity, user_id, product_id]
      );
    } else {
      await runQuery(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [user_id, product_id, quantity]
      );
    }

    res.status(201).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get cart items
const getCartItems = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: "User ID is required" });

  try {
    const result = await runQuery(
      `SELECT ci.product_id AS id, ci.quantity, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [user_id]
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Fetch cart items error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete item from cart
const deleteCart = async (req, res) => {
  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) {
    return res.status(400).json({ error: "User ID and Product ID are required" });
  }

  try {
    await runQuery("DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2", [user_id, product_id]);
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Update quantity of a cart item
const updateCartQuantity = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await runQuery(
      "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
      [quantity, user_id, product_id]
    );
    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Quantity update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Sync local cart (replace quantities)
const syncCart = async (req, res) => {
  const { user_id, cartItems } = req.body;
  if (!user_id || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: "User ID and cart items are required" });
  }

  try {
    for (let item of cartItems) {
      const { id: product_id, quantity } = item;
      if (!product_id || !quantity) continue;

      const existing = await runQuery(
        "SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [user_id, product_id]
      );

      if (existing.length > 0) {
        await runQuery(
          "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
          [quantity, user_id, product_id]
        );
      } else {
        await runQuery(
          "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
          [user_id, product_id, quantity]
        );
      }
    }

    res.status(200).json({ message: "Cart synced successfully" });
  } catch (error) {
    console.error("Sync cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  deleteCart,
  updateCartQuantity,
  syncCart,
};
