const router = require("express").Router();
const CryptoJS = require("crypto-js");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const User = require("../model/User");

// update a user
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

// delete a user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("user deleted");
  } catch (error) {
    return res.status(503).json(error);
  }
});

// GET A USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other });
  } catch (error) {
    res.status(503).json({ message: error.message });
  }
});

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(503).json({ message: error.message });
  }
});

// ADD TO USERS'S CART
// router.put("/:userId/cart", verifyTokenAndAuthorization, async (req, res) => {
//   console.log(req.body.productId);
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       {
//         $push: { cart: req.body.productId },
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// });

// STATS
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: lastYear } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     res.status(200).json(data);
//   } catch (error) {}
// });

module.exports = router;
