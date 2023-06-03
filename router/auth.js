const router = require("express").Router();
const Joi = require("joi");
const User = require("../model/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// register a user
router.post("/register", async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(4).max(20).required(),
    email: Joi.string().email().min(4).max(20).required(),
    password: Joi.string().min(4).max(20).required(),
  });

  if (schema.validate(req.body).error) {
    return res.json(schema.validate(req.body).error.details);
  }

  let user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (user) {
    return res
      .status(409)
      .json("user already exist try changing email or username");
  }

  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    let savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// login
router.get("/login", async (req, res) => {
  let loginSchema = Joi.object().keys({
    username: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  });
  if (loginSchema.validate(req.body).error) {
    return res.json(loginSchema.validate(req.body).error.details);
  }

  let user = await User.findOne({ username: req.body.username });
  try {
    if (!user) return res.json({ message: "user not found!" });
    let hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    let OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== req.body.password) {
      return res.json({ message: "Wrong credentials!" });
    }
    const { password, ...other } = user._doc;
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    res.status(200).json({ ...other, accessToken });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
