const router = require("express").Router();
const Cart = require("../model/Cart");
const CartProduct = require("../model/CartProduct");
const User = require("../model/User");

// CREATE CART
router.post("/:userId/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "user not found!" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      const newCart = new Cart({ user: userId });
      await newCart.save();
    }

    const cartProduct = new CartProduct({
      cart: cart._id,
      product: productId,
      quantity,
    });
    await cartProduct.save();
    res.status(201).json(cartProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
