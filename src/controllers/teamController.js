const Team = require("../models/teamModel");

// Define team route handling logic
exports.addTeam = async (req, res) => {
    try {
        const { teamName } = req.body;
    
        // Check if teamId already exists
        const existingTeam = await Team.findOne({ teamName });
    
        if (existingTeam) {
          // team with the provided teamId already exists
          return res.status(400).json({
            status: "error",
            message: "Team already exists",
          });
        }
    
        // Create a new team if teamId doesn't exist
        const newteam = new Team({
          teamName,
        });
    
        await newteam.save();
    
        // Send a success response
        res.json({ status: "success", message: "Team added successfully" });
      } catch (error) {
        // Send an error response if an exception occurs
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};

exports.deleteTeam = (req, res) => {
    const teamId = req.params.teamId;

    // Use Mongoose to find and remove the team by teamId
    Team.findOneAndDelete({ _id: teamId })
      .then((deletedTeam) => {
        if (deletedTeam) {
          // Team found and deleted successfully
          res.json({ status: "success", message: "Team deleted successfully" });
        } else {
          // team with the given teamId not found
          res.status(404).json({ status: "error", message: "Team not found" });
        }
      })
      .catch((error) => {
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      });};

exports.getAllTeams = async (req, res) => {
    try {
        // Use Mongoose to find all teams
        const allTeam = await Team.find();
    
        // Send the list of teams as a JSON response
        res.json({ status: "success", team: allTeam });
      } catch (error) {
        // Send an error response if an exception occurs
        console.error("Error getting all Teams:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
      }};
