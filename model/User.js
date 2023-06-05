const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, min: 4, max: 20 },
    email: { type: String, required: true, unique: true, min: 4, max: 40 },
    password: { type: String, required: true, min: 4, max: 20 },
    isAdmin: { type: Boolean, default: false },
    // cart: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   default: [],
    //   ref: "Product",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
