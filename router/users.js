const router = require("express").Router();
const CryptoJS = require("crypto-js");
const {
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../middleware/verifyToken");
const User = require("../model/User");

// get all the users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json({ users });
});

// update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(504).json(error);
  }
});

// delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("user deleted");
  } catch (error) {
    return res.status(503).json(error);
  }
});

module.exports = router;
