require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

const authRoute = require("./router/auth");
const users = require("./router/users");
app.use("/api/auth", authRoute);
app.use("/api/users", users);

app.listen(process.env.PORT || 5000, () => {
  console.log(`server up at: ${process.env.PORT || 5000}`);
});
