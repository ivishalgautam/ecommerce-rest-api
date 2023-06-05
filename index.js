require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./router/auth");
const userRoutes = require("./router/users");
const productRoutes = require("./router/product");
const cartRoutes = require("./router/cart");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`server up at: ${process.env.PORT || 5000}`);
});
