const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the team schema
const teamSchema = new Schema({
  teamName: String,
});

// Create the Team model
const Team = mongoose.model("team", teamSchema);

// Export the Team model
module.exports = Team;
