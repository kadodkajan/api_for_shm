require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const HTTP_PORT = process.env.PORT || 8080;
const DB =process.env.DB;

const cors = require("cors");
const net = require("net");
let dynamicPort = HTTP_PORT;

app.use(cors());

const userRoutes = require("./src/routes/userRoutes");
app.use("/", userRoutes);

const storeRoutes = require("./src/routes/storeRoutes");
app.use("/", storeRoutes);


const teamRoutes = require("./src/routes/teamRoutes");
app.use("/", teamRoutes);

const procatRoutes = require("./src/routes/procatRoutes");
app.use("/", procatRoutes);

const productRoutes = require("./src/routes/productRoutes");
app.use("/", productRoutes);


const guideRoutes = require("./src/routes/guideRoutes");
app.use("/", guideRoutes);


const storeGuideRoutes = require("./src/routes/storeGuideRoutes");
app.use("/", storeGuideRoutes);

const orderRoutes = require('./src/routes/orderRoutes');
app.use('/', orderRoutes);

const OrdersForCommisary = require('./src/routes/orderforCommisary');
app.use('/', OrdersForCommisary);


const User = require("./src/models/userModel");

app.post("/login", async (req, res) => {
  try {
    const { user_id, user_auth } = req.body;
    // Find the user by user_id
    const user = await User.findOne({ user_id: user_id });
    if (!user) {
      // User not found
      return res
        .status(404)
        .json({ status: "error", message: "User not founssd" });
    }
    if (String(user.user_auth) === String(user_auth)) {
      // Passwords match
      const { user_id, user_name, user_location } = user; // Extract additional user details

      res.json({
        status: "success",
        message: "Login successful",
        user: { user_id, user_name, user_location },
      });
    } else {
      // Passwords do not match
      res.status(401).json({ status: "error", message: "Incorrect password" });
    }
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});















mongoose
  .connect(DB)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Start the server on an available port
app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});
