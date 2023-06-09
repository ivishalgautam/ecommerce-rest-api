const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, min: 3, max: 20 },
    lastname: { type: String },
    username: { type: String, required: true, unique: true, min: 3, max: 20 },
    email: { type: String, required: true, unique: true, min: 3, max: 40 },
    password: { type: String, required: true, min: 3, max: 20 },
    isAdmin: { type: Boolean, default: false },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
