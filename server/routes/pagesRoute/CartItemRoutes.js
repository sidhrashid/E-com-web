const express = require("express");
const CartItem = require("../../controller/pages/CartItemPage")
const router = express.Router();




router.route("/add-cart-item").post(CartItem.addToCart)
router.route("/get-cart-item/:user_id").get(CartItem.getCartItems)
router.route("/delete-cart-item").delete(CartItem.deleteCart)
router.route("/update-cart-item").put(CartItem.updateCartQuantity)
router.route("/sync-cart-item").post(CartItem.syncCart)


module.exports = router