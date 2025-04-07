const db = require("../../connection/Connection");

// Add or update cart item
const addToCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const checkSql = "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?";
        const existingItem = await new Promise((resolve, reject) => {
            db.query(checkSql, [user_id, product_id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        if (existingItem.length > 0) {
            const newQuantity = existingItem[0].quantity + quantity;
            const updateSql = "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?";
            await new Promise((resolve, reject) => {
                db.query(updateSql, [newQuantity, user_id, product_id], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        } else {
            const insertSql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)";
            await new Promise((resolve, reject) => {
                db.query(insertSql, [user_id, product_id, quantity], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        }

        res.status(201).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch cart items with product details
const getCartItems = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const sql = `
            SELECT ci.product_id AS id, ci.quantity, p.name, p.price, p.image
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `;
        db.query(sql, [user_id], (err, result) => {
            if (err) {
                console.error("Error fetching cart items:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete cart items for a user
const deleteCart = async (req, res) => {
    const { user_id, product_id } = req.body;
    if (!user_id || !product_id) {
        return res.status(400).json({ error: "User ID aur Product ID zaroori hain" });
    }
    try {
        const sql = "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?";
        await db.query(sql, [user_id, product_id]);
        res.status(200).json({ message: "Cart item delete ho gaya" });
    } catch (error) {
        console.error("Delete mein error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update cart item quantity
const updateCartQuantity = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const sql = "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?";
        db.query(sql, [quantity, user_id, product_id], (err, result) => {
            if (err) {
                console.error("Error updating quantity:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.status(200).json({ message: "Cart quantity updated successfully" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Sync local cart to database (Corrected to replace quantities instead of adding)
const syncCart = async (req, res) => {
    const { user_id, cartItems } = req.body;

    if (!user_id || !cartItems || !Array.isArray(cartItems)) {
        return res.status(400).json({ error: "User ID and cart items are required" });
    }

    try {
        for (let item of cartItems) {
            const { id: product_id, quantity } = item; // Assuming item has id and quantity
            if (!product_id || !quantity) continue;

            const existingItem = await new Promise((resolve, reject) => {
                db.query(
                    "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
                    [user_id, product_id],
                    (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    }
                );
            });

            if (existingItem.length > 0) {
                // Replace the existing quantity with the local storage quantity
                await new Promise((resolve, reject) => {
                    db.query(
                        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
                        [quantity, user_id, product_id],
                        (err, result) => {
                            if (err) reject(err);
                            resolve(result);
                        }
                    );
                });
            } else {
                // Insert new item if it doesn't exist
                await new Promise((resolve, reject) => {
                    db.query(
                        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
                        [user_id, product_id, quantity],
                        (err, result) => {
                            if (err) reject(err);
                            resolve(result);
                        }
                    );
                });
            }
        }
        res.status(200).json({ message: "Cart synced successfully" });
    } catch (error) {
        console.error("Error syncing cart:", error);
        res.status(500).json({ error: "Error syncing cart" });
    }
};

module.exports = { addToCart, getCartItems, deleteCart, updateCartQuantity, syncCart };