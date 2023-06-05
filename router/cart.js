const router = require("express").Router();
const Cart = require("../model/Cart");

// CREATE CART
router.post("/", async (req, res) => {
  const newCart = new Cart({
    userId: req.body.userId,
    products: req.body.products,
  });

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
