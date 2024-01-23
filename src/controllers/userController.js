const User = require("../models/userModel");

// Define route handling logic
exports.addUser = async (req, res) => {
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
      }};

exports.deleteUser = (req, res) => {
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
      });};

exports.getAllUsers = (req, res) => {
    User.find()
    .then((users) => {
      res.json({ status: "success", users });
    })
    .catch((error) => {
      console.log("error");
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    });};
