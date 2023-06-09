const { default: mongoose } = require("mongoose");

const CartProductSchema = new mongoose.Schema({
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model("CartProduct", CartProductSchema);
