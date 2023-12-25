
require('dotenv').config();


const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const HTTP_PORT = process.env.PORT || 8080;
const DB =process.env.DB;
const cors = require("cors");
const net = require('net');
let dynamicPort = HTTP_PORT;

app.use(cors());

//products



const userSchema = new Schema({
  user_name: String,
  user_id: Number,
  user_auth: String,
  user_role: String,
  user_location: String,
});

let User = mongoose.model("user", userSchema);

app.post("/addUser", async (req, res) => {
  try {
    const { user_name, user_id, user_auth, user_role, user_location } =
      req.body;

    // Check if user_id already exists
    const existingUser = await User.findOne({ user_id });

    if (existingUser) {
      // User with the provided user_id already exists
      return res.status(400).json({
        status: "error",
        message: "User with this user_id already exists",
      });
    }

    // Create a new user if user_id doesn't exist
    const newUser = new User({
      user_name,
      user_id,
      user_auth,
      user_role,
      user_location,
    });

    await newUser.save();

    // Send a success response
    res.json({ status: "success", message: "User added successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE route to remove a user by user_id
app.delete("/deleteUser/:userId", (req, res) => {
  const user_id = req.params.userId;

  // Use Mongoose to find and remove the product by product_id
  User.findOneAndDelete({ user_id: user_id })
    .then((deletedUser) => {
      if (deletedUser) {
        // Product found and deleted successfully
        res.json({ status: "success", message: "User deleted successfully" });
      } else {
        // Product with the given product_id not found
        res.status(404).json({ status: "error", message: "User not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});

// GET route to retrieve all users
app.get("/getAllUsers", (req, res) => {
  User.find()
    .then((users) => {
      res.json({ status: "success", users });
    })
    .catch((error) => {
      console.log("error");
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});



app.put("/updateAuth/:userId", async (req, res) => {
  try {
    const { user_auth } = req.body;
    const userId = req.params.userId;

    // Check if the user_role property is present in req.body
    if (!user_auth) {
      return res.status(400).json({
        status: "error",
        message: "User new Password not provided in the request body",
      });
    }

    // Check if the user with the provided userId exists
    const existingUser = await User.findOne({ user_id: userId });

    if (!existingUser) {
      // User with the provided userId does not exist
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Update the user's role
    existingUser.user_user_auth = user_auth;
    await existingUser.save();

    // Send a success response
    res.json({
      status: "success",
      message: "User Password updated successfully",
    });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error updating user Password:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});


//Store
const storeSchema = new Schema({
  storeName: String,
  storeId: Number,
});

let Store = mongoose.model("store", storeSchema);

app.post("/addStore", async (req, res) => {
  try {
    const { storeName, storeId } = req.body;

    // Check if storeId already exists
    const existingStore = await Store.findOne({ storeId });

    if (existingStore) {
      // Store with the provided storeId already exists
      return res.status(400).json({
        status: "error",
        message: "Store with this storeId already exists",
      });
    }

    // Create a new store if storeId doesn't exist
    const newStore = new Store({
      storeName,
      storeId,
    });

    await newStore.save();

    // Send a success response
    res.json({ status: "success", message: "Store added successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE route to remove a store by storeId
app.delete("/deleteStore/:storeId", (req, res) => {
  const storeId = req.params.storeId;

  // Use Mongoose to find and remove the store by storeId
  Store.findOneAndDelete({ storeId })
    .then((deletedStore) => {
      if (deletedStore) {
        // Store found and deleted successfully
        res.json({ status: "success", message: "Store deleted successfully" });
      } else {
        // Store with the given storeId not found
        res.status(404).json({ status: "error", message: "Store not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });
});

// GET route to retrieve all stores
app.get("/getAllStores", async (req, res) => {
  try {
    // Use Mongoose to find all stores
    const allStores = await Store.find();

    // Send the list of stores as a JSON response
    res.json({ status: "success", stores: allStores });
  } catch (error) {
    // Send an error response if an exception occurs
    console.error("Error getting all stores:", error);
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
app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})
