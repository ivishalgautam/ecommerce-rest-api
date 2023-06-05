const Joi = require("joi");
const Product = require("../model/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = require("express").Router();

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const schema = Joi.object().keys({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    image: Joi.string().required(),
    categories: Joi.array().required(),
    quantity: Joi.number(),
    price: Joi.number().required(),
  });
  if (schema.validate(req.body).error) {
    return res.json(schema.validate(req.body).error.details);
  }
  const newProduct = new Product({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    categories: req.body.categories,
    quantity: req.body.quantity,
    price: req.body.price,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(203).json(savedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  try {
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("product deleted");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategory) {
      products = await Product.find({ categories: { $in: [queryCategory] } });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
