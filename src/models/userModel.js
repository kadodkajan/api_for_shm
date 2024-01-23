const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
  user_name: String,
  user_id: Number,
  user_auth: String,
  user_role: String,
  user_location: String,
});

// Create the User model
const User = mongoose.model("user", userSchema);

// Export the User model
module.exports = User;